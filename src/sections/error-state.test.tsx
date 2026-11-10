import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorState } from './error-state';

describe('ErrorState', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('permite reintentar y volver al inicio', async () => {
    const retry = vi.fn();
    render(<ErrorState error={new Error('falló')} retry={retry} />);

    expect(screen.getByRole('heading', { level: 1, name: 'Algo salió mal' })).toBeVisible();
    await userEvent.click(screen.getByRole('button', { name: 'Intentar de nuevo' }));
    expect(retry).toHaveBeenCalledOnce();
    expect(screen.getByRole('link', { name: 'Ir al inicio' })).toHaveAttribute('href', '/');
  });

  it('incluye el código del error en el mensaje de WhatsApp', () => {
    const error = Object.assign(new Error('falló'), { digest: 'abc123' });
    render(<ErrorState error={error} retry={() => {}} />);

    const whatsapp = screen.getByRole('link', { name: /escríbenos por WhatsApp/ });
    const message = decodeURIComponent(whatsapp.getAttribute('href')!.split('text=')[1]!);
    expect(message).toBe('Hola, la página web me mostró un error (código abc123).');
    expect(screen.getByText('Código: abc123')).toBeVisible();
  });

  it('registra el error en la consola', () => {
    const error = new Error('falló');
    render(<ErrorState error={error} retry={() => {}} />);
    expect(console.error).toHaveBeenCalledWith(error);
  });
});
