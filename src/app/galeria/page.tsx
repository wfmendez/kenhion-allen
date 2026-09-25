import type { Metadata } from 'next';
import { gallery } from '@/data/gallery';
import { GalleryGrid } from '@/features/gallery/gallery-grid';
import { PageHeader } from '@/sections/page-header';

export const metadata: Metadata = {
  title: 'Galería',
  description: 'Fotogalería oficial de las colecciones Kenhion Allen.',
  alternates: { canonical: '/galeria' },
};

export default function GalleryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Fotogalería oficial"
        title="Galería"
        description="Toca cualquier imagen para verla en detalle."
        crumbs={[{ name: 'Galería', path: '/galeria' }]}
      />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <GalleryGrid images={gallery} />
      </div>
    </>
  );
}
