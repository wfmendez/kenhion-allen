import type { Metadata } from 'next';
import { gallery } from '@/data/gallery';
import { siteConfig } from '@/config/site';
import { GalleryGrid } from '@/features/gallery/gallery-grid';
import { pageMetadata } from '@/lib/seo/metadata';
import { PageHeader } from '@/sections/page-header';

export const metadata: Metadata = pageMetadata({
  path: '/galeria',
  title: 'Galería',
  description: `Fotogalería oficial de ${siteConfig.name}: la colección KA ELITE de ropa deportiva de compresión, puesta a prueba por atletas.`,
});

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
