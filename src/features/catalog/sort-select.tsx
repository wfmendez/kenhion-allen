'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { buildCatalogQuery } from './catalog-params';
import type { CatalogFilters, SortOption } from './filter-products';

export function SortSelect({
  basePath,
  filters,
  options,
}: {
  basePath: string;
  filters: Omit<CatalogFilters, 'collection'>;
  options: [SortOption, string][];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <label className="flex items-center gap-2 text-xs text-fg-subtle">
      Ordenar
      <select
        value={filters.sort}
        aria-busy={pending}
        onChange={(e) =>
          startTransition(() =>
            router.replace(
              `${basePath}${buildCatalogQuery({ ...filters, sort: e.target.value as SortOption })}`,
              { scroll: false },
            ),
          )
        }
        className="rounded-full border border-line bg-ink px-3 py-2 text-sm text-fg focus:border-gold focus:outline-none"
      >
        {options.map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </label>
  );
}
