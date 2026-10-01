'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Modal } from '@/components/ui/dialog';
import type { GalleryImage } from '@/data/gallery';
import { PHOTO_QUALITY } from '@/lib/images';

export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [active, setActive] = useState<GalleryImage | null>(null);
  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5">
        {images.map((img) => (
          <li key={img.src}>
            <button
              type="button"
              onClick={() => setActive(img)}
              className="group relative block aspect-[9/16] w-full overflow-hidden rounded-card border border-line"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(min-width: 1280px) 400px, (min-width: 640px) 33vw, 50vw"
                quality={PHOTO_QUALITY}
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
          <div className="relative mx-auto aspect-[9/16] max-h-[75dvh]">
            <Image
              src={active.src}
              alt={active.alt}
              fill
              sizes="(min-width: 640px) 480px, 90vw"
              quality={PHOTO_QUALITY}
              className="object-contain"
            />
          </div>
        ) : null}
      </Modal>
    </>
  );
}
