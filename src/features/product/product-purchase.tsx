'use client';

import Image from 'next/image';
import { useState, type ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/cn';
import { getProductColor, type Product } from '@/lib/schemas/product';
import { AddToCartPanel } from './add-to-cart-panel';
import { ColorSelector } from './color-selector';

/**
 * Ficha de producto interactiva: el color elegido se comparte entre la galería de fotos
 * y el panel de compra. `info` y `footer` llegan renderizados desde el servidor.
 */
export function ProductPurchase({
  product,
  info,
  sizeGuide,
  footer,
}: {
  product: Product;
  info: ReactNode;
  sizeGuide: ReactNode;
  footer: ReactNode;
}) {
  const [color, setColor] = useState(product.colors[0]!.slug);
  const [activeIndex, setActiveIndex] = useState(0);

  const colorOption = getProductColor(product, color);
  const images = [...colorOption.images, ...product.lifestyleImages];
  const active = images[activeIndex] ?? images[0]!;

  const handleColorChange = (slug: string) => {
    setColor(slug);
    setActiveIndex(0); // al cambiar de color se vuelve a la foto principal de ese color
  };

  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:gap-16">
      <div className="flex flex-col gap-3 lg:sticky lg:top-24 lg:self-start">
        <div className="relative aspect-[2/3] overflow-hidden rounded-card border border-line bg-surface">
          <Image
            key={active.src}
            src={active.src}
            alt={active.alt}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="animate-fade-in object-cover"
          />
          <Badge
            tone={product.compareAtPriceCents ? 'red' : 'gold'}
            className="absolute top-4 left-4"
          >
            {product.badge}
          </Badge>
        </div>

        <ul aria-label="Fotos del producto" className="grid grid-cols-5 gap-2 sm:grid-cols-6">
          {images.map((image, i) => (
            <li key={image.src}>
              <button
                type="button"
                onClick={() => setActiveIndex(i)}
                aria-label={`Ver foto ${i + 1}: ${image.alt}`}
                aria-current={i === activeIndex ? 'true' : undefined}
                className={cn(
                  'relative block aspect-[2/3] w-full overflow-hidden rounded-lg border-2 transition-colors',
                  i === activeIndex ? 'border-gold' : 'border-line hover:border-gold/50',
                )}
              >
                <Image src={image.src} alt="" fill sizes="96px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-8">
        {info}
        <div className="flex flex-col gap-6 border-t border-line pt-6">
          <ColorSelector colors={product.colors} value={color} onChange={handleColorChange} />
          {sizeGuide}
          <AddToCartPanel product={product} color={color} />
        </div>
        {footer}
      </div>
    </div>
  );
}
