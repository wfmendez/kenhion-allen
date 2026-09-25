'use client';

import Link from 'next/link';
import { Icon } from '@/components/ui/icon';
import { Price } from '@/components/ui/price';
import { SIZES, type Size } from '@/config/business';
import { ProductImage } from '@/features/product/product-image';
import { QuantityPicker } from '@/features/product/quantity-picker';
import { productPath } from '@/lib/routes';
import { useCart } from './cart-context';
import type { ResolvedCartLine } from './pricing';

export function CartLineItem({
  line,
  onNavigate,
}: {
  line: ResolvedCartLine;
  onNavigate?: () => void;
}) {
  const { setQty, changeSize, removeItem, collections } = useCart();
  const { product } = line;
  const collection = collections.find((c) => c.slug === product.collection);

  return (
    <li className="flex gap-4 border-b border-line py-5 last:border-0">
      <Link
        href={productPath(product.slug)}
        onClick={onNavigate}
        className="relative size-24 shrink-0 overflow-hidden rounded-lg bg-surface"
        tabIndex={-1}
        aria-hidden
      >
        <ProductImage
          src={product.image}
          fallbackSrc={product.fallbackImage}
          alt=""
          fill
          sizes="96px"
          className="object-cover"
        />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              href={productPath(product.slug)}
              onClick={onNavigate}
              className="block truncate font-display text-sm font-bold hover:text-gold"
            >
              {product.name}
            </Link>
            <p className="text-xs text-fg-subtle">{collection?.name}</p>
          </div>
          <button
            type="button"
            onClick={() => removeItem(line.lineId)}
            className="grid size-8 shrink-0 place-items-center rounded-full text-fg-subtle hover:bg-surface hover:text-red-light"
          >
            <Icon name="close" size={16} label={`Eliminar ${product.name}`} />
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-xs text-fg-muted">
            Talla
            <select
              value={line.size}
              onChange={(e) => changeSize(line.lineId, e.target.value as Size)}
              className="rounded-md border border-line bg-surface px-2 py-1 font-display font-bold text-fg focus:border-gold focus:outline-none"
            >
              {SIZES.filter((s) => product.sizes.includes(s)).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <QuantityPicker
            size="sm"
            value={line.qty}
            min={0}
            onChange={(qty) => setQty(line.lineId, qty)}
            label={`${product.name} talla ${line.size}`}
          />
        </div>
        <Price cents={line.lineTotalCents} size="sm" />
      </div>
    </li>
  );
}
