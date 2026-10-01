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
import { getProductColor, type Collection, type Product } from '@/lib/schemas/product';
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
  addItem: (product: Product, color: string, size: Size, qty?: number) => void;
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
    (product: Product, color: string, size: Size, qty = 1) => {
      const wasWholesale = calculateTotals(
        resolveCartLines(getCartSnapshot().lines, products),
      ).isWholesale;
      dispatchCart({ type: 'add', productId: product.id, color, size, qty });
      const nowWholesale = calculateTotals(
        resolveCartLines(getCartSnapshot().lines, products),
      ).isWholesale;
      if (!wasWholesale && nowWholesale) {
        toast(
          `¡Precio al mayor activado! ${Math.round(WHOLESALE.rate * 100)}% de descuento aplicado`,
          'success',
        );
      } else {
        toast(
          `Añadido: ${product.name} · ${getProductColor(product, color).name} · Talla ${size}${qty > 1 ? ` · ${qty} uds` : ''}`,
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
