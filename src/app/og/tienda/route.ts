import { gridCard } from '@/features/seo/og-cards';
import { shopOgData } from '@/features/seo/og-image';
import { renderOgJpeg } from '@/features/seo/render-og';
import { getProducts } from '@/lib/repositories/product-repository';

// Se genera en el build. La URL pública lleva ?v=<huella> (ver og-image.ts).
export const dynamic = 'force-static';

export async function GET() {
  return renderOgJpeg(await gridCard(shopOgData(await getProducts())));
}
