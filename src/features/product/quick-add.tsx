'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { DEFAULT_SIZE, type Size } from '@/config/business';
import { useCart } from '@/features/cart/cart-context';
import type { Product } from '@/lib/schemas/product';
import { SizeSelector } from './size-selector';

/** Compra rápida desde la tarjeta del catálogo. */
export function QuickAdd({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [size, setSize] = useState<Size>(
    product.sizes.includes(DEFAULT_SIZE) ? DEFAULT_SIZE : product.sizes[0]!,
  );
  return (
    <div className="flex flex-col gap-3">
      <SizeSelector
        sizes={product.sizes}
        value={size}
        onChange={setSize}
        compact
        label={`Talla de ${product.name}`}
      />
      <Button
        fullWidth
        size="sm"
        onClick={() => addItem(product, size)}
        aria-label={`Añadir ${product.name} talla ${size} a la cesta`}
      >
        <Icon name="bag" size={15} />
        <span className="sm:hidden">Añadir</span>
        <span className="hidden sm:inline">Añadir a la cesta</span>
      </Button>
    </div>
  );
}
