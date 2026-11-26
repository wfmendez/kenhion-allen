import { ImageResponse } from 'next/og';
import { EmblemIcon } from '@/components/seo/emblem-icon';

/** Icono de iOS (apple-touch-icon, 180x180). Google también lo acepta como favicon. */
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(<EmblemIcon size={size.width} />, size);
}
