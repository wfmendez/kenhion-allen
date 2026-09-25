import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { isActivePath } from '@/config/navigation';
import { cn } from '@/lib/cn';
import { Badge } from './badge';
import { Button, buttonClasses } from './button';
import { Modal } from './dialog';
import { Input } from './field';
import { Price } from './price';
import { ToastProvider, useToast } from './toast';

describe('utilidades', () => {
  it('cn descarta valores falsos', () => {
    expect(cn('a', false, undefined, null, 'b')).toBe('a b');
  });

  it('isActivePath distingue inicio y subrutas', () => {
    expect(isActivePath('/', '/')).toBe(true);
    expect(isActivePath('/tienda', '/')).toBe(false);
    expect(isActivePath('/tienda/pod', '/tienda')).toBe(true);
    expect(isActivePath('/tiendas', '/tienda')).toBe(false);
  });
});

describe('Button', () => {
  it('es type="button" por defecto para no enviar formularios', () => {
    render(<Button>Añadir</Button>);
    expect(screen.getByRole('button', { name: 'Añadir' })).toHaveAttribute('type', 'button');
  });

  it('aplica variantes', () => {
    expect(buttonClasses({ variant: 'primary' })).toContain('bg-gold');
    expect(buttonClasses({ variant: 'whatsapp', fullWidth: true })).toContain('w-full');
  });
});

describe('Price y Badge', () => {
  it('muestra el precio formateado y el anterior tachado', () => {
    render(<Price cents={2500} compareAtCents={2800} />);
    expect(screen.getByText('$25.00')).toBeInTheDocument();
    expect(screen.getByText('$28.00')).toHaveClass('line-through');
    expect(screen.getByText('Antes')).toHaveClass('sr-only');
  });

  it('renderiza el badge', () => {
    render(<Badge tone="red">Oferta</Badge>);
    expect(screen.getByText('Oferta')).toHaveClass('bg-red');
  });
});

describe('Input', () => {
  it('asocia label y error de forma accesible', () => {
    render(<Input label="Teléfono" error="Teléfono inválido" />);
    const input = screen.getByLabelText('Teléfono');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Teléfono inválido');
  });
});

describe('Modal', () => {
  function Harness() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Abrir</Button>
        <Modal open={open} onClose={() => setOpen(false)} title="Guía de tallas">
          <p>Contenido</p>
        </Modal>
      </>
    );
  }

  it('abre, se titula y cierra con el botón', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole('button', { name: 'Abrir' }));
    const dialog = screen.getByRole('dialog', { name: 'Guía de tallas' });
    expect(dialog).toHaveAttribute('open');
    await user.click(screen.getByRole('button', { name: 'Cerrar' }));
    expect(dialog).not.toHaveAttribute('open');
  });
});

describe('Toast', () => {
  function Trigger() {
    const { toast } = useToast();
    return <Button onClick={() => toast('Añadido a la cesta', 'success')}>Notificar</Button>;
  }

  it('muestra la notificación y la cierra sola', () => {
    vi.useFakeTimers();
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    );
    act(() => screen.getByRole('button', { name: 'Notificar' }).click());
    expect(screen.getByRole('status')).toHaveTextContent('Añadido a la cesta');
    act(() => vi.advanceTimersByTime(4000));
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    vi.useRealTimers();
  });

  it('falla con un mensaje claro fuera del provider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Trigger />)).toThrow('useToast debe usarse dentro de <ToastProvider>');
  });
});
