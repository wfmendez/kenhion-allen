import { z } from 'zod';
import { PAYMENT_METHODS, SHIPPING_AGENCIES } from '@/config/business';
import { VENEZUELA_STATES } from '@/data/venezuela-states';

/** "v 12.345.678" → "V-12345678". Acepta V, E, J, P, G (cédula, extranjero, RIF). */
export function normalizeIdNumber(raw: string): string {
  const compact = raw.toUpperCase().replace(/[\s.\-]/g, '');
  const match = /^([VEJPG])(\d{5,9})$/.exec(compact);
  return match ? `${match[1]}-${match[2]}` : raw.trim();
}

/** "+58 412-530.5464" o "0412 5305464" → "0412-5305464". */
export function normalizePhone(raw: string): string {
  let digits = raw.replace(/\D/g, '');
  if (digits.startsWith('58')) digits = `0${digits.slice(2)}`;
  if (digits.length === 10 && !digits.startsWith('0')) digits = `0${digits}`;
  return /^0\d{10}$/.test(digits) ? `${digits.slice(0, 4)}-${digits.slice(4)}` : raw.trim();
}

/** Campo obligatorio con un mensaje directo (evita problemas de género: "la ciudad es obligatoria"). */
const required = (message: string) => z.string().trim().min(1, message);

export const customerSchema = z.object({
  name: required('Escribe tu nombre')
    .min(3, 'Escribe tu nombre y apellido')
    .max(80, 'Máximo 80 caracteres'),
  idNumber: required('Escribe tu cédula o RIF')
    .transform(normalizeIdNumber)
    .refine((v) => /^[VEJPG]-\d{5,9}$/.test(v), 'Formato válido: V-12345678 o J-123456789'),
  phone: required('Escribe tu teléfono')
    .transform(normalizePhone)
    .refine((v) => /^0\d{3}-\d{7}$/.test(v), 'Formato válido: 0412-1234567'),
  email: z
    .string()
    .trim()
    .max(120)
    .refine((v) => v === '' || z.email().safeParse(v).success, 'Correo no válido'),
  state: z.enum(VENEZUELA_STATES, { error: 'Selecciona un estado' }),
  city: required('Escribe tu ciudad').max(60),
  address: required('Escribe tu dirección')
    .min(10, 'Incluye calle, sector o punto de referencia')
    .max(200, 'Máximo 200 caracteres'),
  shippingAgency: z.enum(SHIPPING_AGENCIES, { error: 'Selecciona cómo quieres recibirlo' }),
  paymentMethod: z.enum(PAYMENT_METHODS, { error: 'Selecciona un método de pago' }),
  notes: z.string().trim().max(300, 'Máximo 300 caracteres'),
});

/** Datos tal como los escribe el usuario (antes de normalizar). */
export type CustomerInput = z.input<typeof customerSchema>;
/** Datos validados y normalizados. */
export type Customer = z.output<typeof customerSchema>;

export const emptyCustomer: CustomerInput = {
  name: '',
  idNumber: '',
  phone: '',
  email: '',
  state: '' as CustomerInput['state'],
  city: '',
  address: '',
  shippingAgency: '' as CustomerInput['shippingAgency'],
  paymentMethod: '' as CustomerInput['paymentMethod'],
  notes: '',
};
