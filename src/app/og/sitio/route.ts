import { siteCard } from '@/features/seo/og-cards';
import { siteOgData } from '@/features/seo/og-image';
import { renderOgJpeg } from '@/features/seo/render-og';

// Se genera en el build. La URL pública lleva ?v=<huella> (ver og-image.ts).
export const dynamic = 'force-static';

export async function GET() {
  return renderOgJpeg(await siteCard(siteOgData()));
}
