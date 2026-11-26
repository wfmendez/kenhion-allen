import { notFound } from 'next/navigation';
import { gridCard } from '@/features/seo/og-cards';
import { collectionOgData } from '@/features/seo/og-image';
import { renderOgJpeg } from '@/features/seo/render-og';
import {
  getCollectionBySlug,
  getCollections,
  getProducts,
} from '@/lib/repositories/product-repository';

// Una imagen por colección, generada en el build.
export const dynamic = 'force-static';
export const dynamicParams = false;

export async function generateStaticParams() {
  const collections = await getCollections();
  return collections.map((c) => ({ coleccion: c.slug }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ coleccion: string }> },
) {
  const collection = await getCollectionBySlug((await params).coleccion);
  if (!collection) notFound();
  return renderOgJpeg(await gridCard(collectionOgData(collection, await getProducts())));
}
