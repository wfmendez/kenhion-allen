'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import { useToast } from '@/components/ui/toast';
import { WHOLESALE, type Size } from '@/config/business';
import type { Collection, Product } from '@/lib/schemas/product';
import { dispatchCart, getCartSnapshot, getServerCartSnapshot, subscribeCart } from './cart-store';
import {
  calculateTotals,
  resolveCartLines,
  type CartTotals,
  type ResolvedCartLine,
} from './pricing';

interface CartContextValue {
  /** Catálogo disponible en el cliente (lo inyecta el layout). */
  products: Product[];
  collections: Collection[];
  lines: ResolvedCartLine[];
  totals: CartTotals;
  addItem: (product: Product, size: Size, qty?: number) => void;
  setQty: (lineId: string, qty: number) => void;
  changeSize: (lineId: string, size: Size) => void;
  removeItem: (lineId: string) => void;
  clear: () => void;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({
  products,
  collections,
  children,
}: {
  products: Product[];
  collections: Collection[];
  children: ReactNode;
}) {
  const { toast } = useToast();
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const state = useSyncExternalStore(subscribeCart, getCartSnapshot, getServerCartSnapshot);

  const lines = useMemo(() => resolveCartLines(state.lines, products), [state.lines, products]);
  const totals = useMemo(() => calculateTotals(lines), [lines]);

  const addItem = useCallback(
    (product: Product, size: Size, qty = 1) => {
      const wasWholesale = calculateTotals(
        resolveCartLines(getCartSnapshot().lines, products),
      ).isWholesale;
      dispatchCart({ type: 'add', productId: product.id, size, qty });
      const nowWholesale = calculateTotals(
        resolveCartLines(getCartSnapshot().lines, products),
      ).isWholesale;
      if (!wasWholesale && nowWholesale) {
        toast(
          `¡Docena completada! ${Math.round(WHOLESALE.rate * 100)}% al mayor aplicado`,
          'success',
        );
      } else {
        toast(
          `Añadido: ${product.name} · Talla ${size}${qty > 1 ? ` · ${qty} uds` : ''}`,
          'success',
        );
      }
    },
    [products, toast],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      products,
      collections,
      lines,
      totals,
      addItem,
      setQty: (lineId, qty) => dispatchCart({ type: 'setQty', lineId, qty }),
      changeSize: (lineId, size) => dispatchCart({ type: 'changeSize', lineId, size }),
      removeItem: (lineId) => dispatchCart({ type: 'remove', lineId }),
      clear: () => dispatchCart({ type: 'clear' }),
      isDrawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
    }),
    [products, collections, lines, totals, addItem, isDrawerOpen],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>');
  return ctx;
}
