import { shippingSummary } from '@/data/shipping';
import {
  LOCAL_DELIVERY_OPTIONS,
  PAYMENT_METHODS,
  SHIPPING_AGENCIES,
  SHIPPING_CARRIERS,
} from './business';

describe('reglas de envío y pago', () => {
  it('las agencias nacionales incluyen T-envíos', () => {
    expect(SHIPPING_CARRIERS).toEqual(['MRW', 'Zoom', 'Tealca', 'T-envíos']);
  });

  it('en Maracay hay delivery y entrega personal', () => {
    expect(LOCAL_DELIVERY_OPTIONS).toEqual(['Delivery en Maracay', 'Entrega personal en Maracay']);
  });

  it('el checkout ofrece primero las agencias y luego las opciones locales', () => {
    expect(SHIPPING_AGENCIES).toEqual([...SHIPPING_CARRIERS, ...LOCAL_DELIVERY_OPTIONS]);
  });

  it('los pagos incluyen Binance y ya no Zelle', () => {
    expect(PAYMENT_METHODS).toContain('Binance');
    expect(PAYMENT_METHODS).not.toContain('Zelle');
  });

  it('el resumen de envíos sale de la configuración', () => {
    expect(shippingSummary).toBe(
      'Envíos a toda Venezuela por MRW, Zoom, Tealca y T-envíos. Delivery y entrega personal en Maracay.',
    );
  });
});
