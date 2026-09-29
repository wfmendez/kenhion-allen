# 0004: Checkout por WhatsApp con comprobante PDF no fiscal

- **Estado:** aceptada (septiembre 2026)

## Contexto

- El cliente cierra las ventas por WhatsApp y cobra por Pago Móvil, transferencia, Zelle o efectivo. No hay pasarela de pago.
- Se pidió "una factura al comprar". En Venezuela, una factura fiscal válida ante el SENIAT solo la emite una imprenta autorizada o una máquina fiscal.
- No hay backend.

## Decisión

- El checkout recoge los datos del cliente, crea un **pedido** (`KA-AAAAMMDD-XXXX`) y genera un **comprobante de pedido en PDF**, marcado _"No válido como factura fiscal"_. La factura fiscal la emite la tienda por fuera.
- El PDF se genera **en el navegador** con `@react-pdf/renderer`, cargado solo al pedirlo.
- El pedido se envía por WhatsApp (`wa.me`). Como un enlace no puede adjuntar archivos, se le pide al cliente que adjunte el PDF.
- **Privacidad:** los datos personales solo viven en `sessionStorage` de la pestaña (se borran al cerrarla). Nunca en `localStorage` ni en un servidor.
- El envío pasa por `submitOrder()` (`src/features/checkout/submit-order.ts`), el único punto a cambiar cuando exista un backend.

## Consecuencias

- El número de orden **no es correlativo** (sufijo aleatorio). Será correlativo cuando haya base de datos.
- La tienda no guarda un registro de los pedidos: el registro es el chat de WhatsApp.
- Evoluciones posibles sin tocar la UI: guardar pedidos en Supabase, enviar el PDF por correo o integrar un proveedor de facturación electrónica autorizado.
