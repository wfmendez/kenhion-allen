'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { DEFAULT_SIZE, WHOLESALE, type Size } from '@/config/business';
import { useCart } from '@/features/cart/cart-context';
import type { Product } from '@/lib/schemas/product';
import { QuantityPicker } from './quantity-picker';
import { SizeSelector } from './size-selector';

/** Panel de compra de la ficha de producto: talla, cantidad, añadir y pedir al mayor. */
export function AddToCartPanel({ product, color }: { product: Product; color: string }) {
  const { addItem, openDrawer } = useCart();
  const [size, setSize] = useState<Size>(
    product.sizes.includes(DEFAULT_SIZE) ? DEFAULT_SIZE : product.sizes[0]!,
  );
  const [qty, setQty] = useState(1);
  const pct = Math.round(WHOLESALE.rate * 100);
  // Unidades de este producto necesarias para llegar al mayoreo.
  const wholesaleQty = Math.ceil(WHOLESALE.minQty / product.wholesaleUnits);

  return (
    <div className="flex flex-col gap-6">
      <SizeSelector
        sizes={product.sizes}
        value={size}
        onChange={setSize}
        label="Selecciona tu talla"
      />
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-fg-muted">Cantidad</span>
        <QuantityPicker value={qty} onChange={setQty} label={product.name} />
      </div>
      <div className="flex flex-col gap-3">
        <Button
          size="lg"
          fullWidth
          onClick={() => {
            addItem(product, color, size, qty);
            openDrawer();
          }}
        >
          <Icon name="bag" size={18} /> Añadir a la cesta
        </Button>
        <Button
          size="lg"
          variant="outline"
          fullWidth
          onClick={() => {
            addItem(product, color, size, wholesaleQty);
            openDrawer();
          }}
        >
          Pedir al mayor ({wholesaleQty} uds) · −{pct}%
        </Button>
      </div>
    </div>
  );
}
