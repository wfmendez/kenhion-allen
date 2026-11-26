import { notFound } from 'next/navigation';
import { productCard } from '@/features/seo/og-cards';
import { productOgData } from '@/features/seo/og-image';
import { renderOgJpeg } from '@/features/seo/render-og';
import {
  getCollectionBySlug,
  getProductBySlug,
  getProducts,
} from '@/lib/repositories/product-repository';

// Una imagen por producto, generada en el build.
export const dynamic = 'force-static';
export const dynamicParams = false;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const product = await getProductBySlug((await params).slug);
  if (!product) notFound();
  const collection = await getCollectionBySlug(product.collection);
  return renderOgJpeg(await productCard(productOgData(product, collection)));
}
