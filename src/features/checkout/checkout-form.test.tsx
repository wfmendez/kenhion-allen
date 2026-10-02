import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToastProvider } from '@/components/ui/toast';
import { collections } from '@/data/collections';
import { products } from '@/data/products';
import { CartProvider } from '@/features/cart/cart-context';
import { CART_STORAGE_KEY } from '@/features/cart/cart-storage';
import { resetCartStoreForTests } from '@/features/cart/cart-store';
import { CheckoutForm } from './checkout-form';
import { loadLastOrder } from './order-storage';

const push = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));

function renderForm() {
  return render(
    <ToastProvider>
      <CartProvider products={products} collections={collections}>
        <CheckoutForm />
      </CartProvider>
    </ToastProvider>,
  );
}

describe('CheckoutForm', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    resetCartStoreForTests();
    push.mockReset();
    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify({
        version: 3,
        lines: [{ productId: 12, color: 'negro', size: 'L', qty: 6 }],
      }),
    );
  });

  it('muestra los errores y no envía si faltan datos', async () => {
    const user = userEvent.setup();
    renderForm();
    await user.click(screen.getByRole('button', { name: 'Confirmar pedido' }));

    expect(await screen.findByText('Escribe tu nombre')).toBeInTheDocument();
    expect(screen.getByLabelText('Estado')).toHaveAccessibleDescription('Selecciona un estado');
    expect(screen.getByLabelText('Método de pago')).toHaveAttribute('aria-invalid', 'true');
    expect(push).not.toHaveBeenCalled();
    expect(loadLastOrder()).toBeNull();
  });

  it('crea el pedido normalizado y va a la confirmación', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText('Nombre y apellido'), 'Ana Pérez');
    await user.type(screen.getByLabelText('Cédula o RIF'), 'v 12.345.678');
    await user.type(screen.getByLabelText('Teléfono (WhatsApp)'), '0412 123 4567');
    await user.selectOptions(screen.getByLabelText('Estado'), 'Aragua');
    await user.type(screen.getByLabelText('Ciudad'), 'Maracay');
    await user.type(screen.getByLabelText('Dirección'), 'Calle Páez, casa 10, sector centro');
    await user.selectOptions(screen.getByLabelText('¿Cómo lo recibes?'), 'Delivery en Maracay');
    await user.selectOptions(screen.getByLabelText('Método de pago'), 'Binance');
    await user.click(screen.getByRole('button', { name: 'Confirmar pedido' }));

    await vi.waitFor(() => expect(push).toHaveBeenCalledWith('/checkout/confirmacion'));
    const order = loadLastOrder();
    expect(order?.customer).toMatchObject({
      idNumber: 'V-12345678',
      phone: '0412-1234567',
      shippingAgency: 'Delivery en Maracay',
      paymentMethod: 'Binance',
    });
    expect(order?.items).toEqual([
      expect.objectContaining({
        name: 'Franela de compresión de caballero',
        colorName: 'Negro',
        size: 'L',
        qty: 6,
      }),
    ]);
    expect(order?.totals.totalCents).toBe(16891);
    // Los datos personales no van a localStorage.
    expect(JSON.stringify({ ...localStorage })).not.toContain('Ana Pérez');
  });
});
