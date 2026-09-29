# 0003: Dinero en centavos enteros

- **Estado:** aceptada (septiembre 2026)

## Contexto

La v2 calculaba con decimales (`35.0 * 0.15`), lo que en JavaScript produce errores de redondeo que pueden llegar al total del pedido y al mensaje de WhatsApp.

## Decisión

- Todos los montos son **enteros en centavos** (`priceCents: 3500`).
- Los porcentajes se aplican con `percentOf()` (redondeo al centavo) en `src/lib/money.ts`.
- Solo se formatea a texto al mostrar (`formatUSD`).

## Consecuencias

- Los totales del carrito, del comprobante y del mensaje de WhatsApp siempre coinciden.
- Quien edite el catálogo debe escribir los precios en centavos (lo valida el esquema).
