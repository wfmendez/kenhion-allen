import type { Size } from '@/config/business';
import type { CartLine } from '@/lib/schemas/cart';

export type CartState = { lines: CartLine[] };

export type CartAction =
  | { type: 'add'; productId: number; size: Size; qty: number }
  | { type: 'setQty'; lineId: string; qty: number }
  | { type: 'changeSize'; lineId: string; size: Size }
  | { type: 'remove'; lineId: string }
  | { type: 'clear' }
  | { type: 'hydrate'; lines: CartLine[] };

export const initialCartState: CartState = { lines: [] };

/** Una línea por combinación producto + talla. */
export function getLineId(line: Pick<CartLine, 'productId' | 'size'>): string {
  return `${line.productId}-${line.size}`;
}

/** Une líneas repetidas (mismo producto y talla) sumando cantidades, sin alterar el orden. */
function mergeLines(lines: CartLine[]): CartLine[] {
  const merged = new Map<string, CartLine>();
  for (const line of lines) {
    const id = getLineId(line);
    const existing = merged.get(id);
    merged.set(id, existing ? { ...existing, qty: existing.qty + line.qty } : { ...line });
  }
  return [...merged.values()];
}

/** Reducer puro e inmutable: nunca modifica el estado recibido. */
export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'add': {
      if (action.qty <= 0) return state;
      const line: CartLine = { productId: action.productId, size: action.size, qty: action.qty };
      return { lines: mergeLines([...state.lines, line]) };
    }
    case 'setQty': {
      if (action.qty <= 0) {
        return { lines: state.lines.filter((l) => getLineId(l) !== action.lineId) };
      }
      return {
        lines: state.lines.map((l) =>
          getLineId(l) === action.lineId ? { ...l, qty: action.qty } : l,
        ),
      };
    }
    case 'changeSize': {
      const lines = state.lines.map((l) =>
        getLineId(l) === action.lineId ? { ...l, size: action.size } : l,
      );
      return { lines: mergeLines(lines) };
    }
    case 'remove':
      return { lines: state.lines.filter((l) => getLineId(l) !== action.lineId) };
    case 'clear':
      return initialCartState;
    case 'hydrate':
      return { lines: mergeLines(action.lines) };
  }
}
