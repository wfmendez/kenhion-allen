import type { MetadataRoute } from 'next';
import { isIndexable, siteConfig } from '@/config/site';
import { buildRobots } from '@/lib/seo/robots';

export default function robots(): MetadataRoute.Robots {
  return buildRobots(isIndexable(process.env.VERCEL_ENV), siteConfig.url);
}
