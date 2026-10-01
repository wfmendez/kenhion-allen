'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { DEFAULT_SIZE, type Size } from '@/config/business';
import { useCart } from '@/features/cart/cart-context';
import { getProductColor, type Product } from '@/lib/schemas/product';
import { ColorSelector } from './color-selector';
import { SizeSelector } from './size-selector';

/** Compra rápida desde la tarjeta del catálogo. El color lo controla la tarjeta (cambia la foto). */
export function QuickAdd({
  product,
  color,
  onColorChange,
}: {
  product: Product;
  color: string;
  onColorChange: (colorSlug: string) => void;
}) {
  const { addItem } = useCart();
  const [size, setSize] = useState<Size>(
    product.sizes.includes(DEFAULT_SIZE) ? DEFAULT_SIZE : product.sizes[0]!,
  );
  const colorName = getProductColor(product, color).name;

  return (
    <div className="flex flex-col gap-3">
      <ColorSelector
        colors={product.colors}
        value={color}
        onChange={onColorChange}
        compact
        label={`Color de ${product.name}`}
      />
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
        onClick={() => addItem(product, color, size)}
        // El nombre accesible empieza con el texto visible (WCAG 2.5.3) y suma el contexto.
        aria-label={`Añadir a la cesta: ${product.name}, color ${colorName}, talla ${size}`}
      >
        <Icon name="bag" size={15} />
        <span className="sm:hidden">Añadir</span>
        <span className="hidden sm:inline">Añadir a la cesta</span>
      </Button>
    </div>
  );
}
