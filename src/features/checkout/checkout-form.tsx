'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input, Select, Textarea } from '@/components/ui/field';
import { useToast } from '@/components/ui/toast';
import { PAYMENT_METHODS, SHIPPING_AGENCIES } from '@/config/business';
import { VENEZUELA_STATES } from '@/data/venezuela-states';
import { useCart } from '@/features/cart/cart-context';
import {
  customerSchema,
  emptyCustomer,
  type Customer,
  type CustomerInput,
} from '@/lib/schemas/customer';
import { confirmationPath } from '@/lib/routes';
import { createOrder } from './create-order';
import { submitOrder } from './submit-order';

export function CheckoutForm() {
  const { lines, collections } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CustomerInput, unknown, Customer>({
    resolver: zodResolver(customerSchema),
    defaultValues: emptyCustomer,
    mode: 'onTouched',
  });

  const onSubmit = handleSubmit(async (customer) => {
    try {
      const order = createOrder({ lines, collections, customer });
      await submitOrder(order);
      router.push(confirmationPath);
    } catch {
      toast('No pudimos procesar el pedido. Intenta de nuevo.', 'error');
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-8">
      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="mb-5 font-display text-xs font-bold tracking-[0.2em] text-gold uppercase">
          1. Tus datos
        </legend>
        <Input
          label="Nombre y apellido"
          autoComplete="name"
          error={errors.name?.message}
          className="sm:col-span-2"
          {...register('name')}
        />
        <Input
          label="Cédula o RIF"
          placeholder="V-12345678"
          hint="Aparece en tu comprobante de pedido"
          error={errors.idNumber?.message}
          {...register('idNumber')}
        />
        <Input
          label="Teléfono (WhatsApp)"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="0412-1234567"
          error={errors.phone?.message}
          {...register('phone')}
        />
        <Input
          label="Correo (opcional)"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          className="sm:col-span-2"
          {...register('email')}
        />
      </fieldset>

      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="mb-5 font-display text-xs font-bold tracking-[0.2em] text-gold uppercase">
          2. Envío
        </legend>
        <Select
          label="Estado"
          options={VENEZUELA_STATES}
          placeholder="Selecciona tu estado"
          autoComplete="address-level1"
          error={errors.state?.message}
          {...register('state')}
        />
        <Input
          label="Ciudad"
          autoComplete="address-level2"
          error={errors.city?.message}
          {...register('city')}
        />
        <Textarea
          label="Dirección"
          placeholder="Calle, urbanización o sector, casa/apto y punto de referencia"
          autoComplete="street-address"
          error={errors.address?.message}
          className="sm:col-span-2"
          {...register('address')}
        />
        <Select
          label="¿Cómo lo recibes?"
          options={SHIPPING_AGENCIES}
          placeholder="Selecciona una opción"
          error={errors.shippingAgency?.message}
          className="sm:col-span-2"
          {...register('shippingAgency')}
        />
      </fieldset>

      <fieldset className="grid gap-5">
        <legend className="mb-5 font-display text-xs font-bold tracking-[0.2em] text-gold uppercase">
          3. Pago
        </legend>
        <Select
          label="Método de pago"
          options={PAYMENT_METHODS}
          placeholder="Selecciona un método"
          hint="Te enviaremos los datos de pago por WhatsApp"
          error={errors.paymentMethod?.message}
          {...register('paymentMethod')}
        />
        <Textarea
          label="Notas para la tienda (opcional)"
          placeholder="Horario de entrega, empaque para regalo…"
          error={errors.notes?.message}
          {...register('notes')}
        />
      </fieldset>

      <div className="flex flex-col gap-3">
        <Button type="submit" size="lg" fullWidth disabled={isSubmitting || lines.length === 0}>
          {isSubmitting ? 'Procesando…' : 'Confirmar pedido'}
        </Button>
        <p className="text-center text-xs text-fg-subtle">
          Tus datos solo se usan para generar el comprobante y el mensaje de WhatsApp. No se guardan
          en ningún servidor.
        </p>
      </div>
    </form>
  );
}
