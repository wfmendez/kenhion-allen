'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Modal } from '@/components/ui/dialog';
import type { GalleryImage } from '@/data/gallery';

export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [active, setActive] = useState<GalleryImage | null>(null);
  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {images.map((img) => (
          <li key={img.src}>
            <button
              type="button"
              onClick={() => setActive(img)}
              className="group relative block aspect-[3/4] w-full overflow-hidden rounded-card border border-line"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-0 grid place-items-center bg-ink/60 font-display text-[0.7rem] font-bold tracking-[0.2em] text-gold uppercase opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                Ampliar
              </span>
            </button>
          </li>
        ))}
      </ul>
      <Modal open={active !== null} onClose={() => setActive(null)} title={active?.alt ?? 'Imagen'}>
        {active ? (
          <div className="relative aspect-[3/4] w-full">
            <Image
              src={active.src}
              alt={active.alt}
              fill
              sizes="672px"
              className="object-contain"
            />
          </div>
        ) : null}
      </Modal>
    </>
  );
}
