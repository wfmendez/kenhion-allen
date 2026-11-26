import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import type { ReactElement } from 'react';
// sharp llega con Next (dependencia opcional de `next`, la misma que optimiza las fotos).
import sharp from 'sharp';
import { colors } from '@/styles/tokens';
import { OG_SIZE } from './og-image';

/**
 * Solo servidor. Las imágenes se prerenderizan en el build (las rutas /og/* son estáticas),
 * así que leer del disco con process.cwd() funciona igual en local, en CI y en Vercel.
 */

const FONTS_DIR = join(process.cwd(), 'src/assets/og');

type OgFont = {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 600 | 800;
  style: 'normal';
};

async function font(file: string, name: string, weight: OgFont['weight']): Promise<OgFont> {
  const buf = await readFile(join(FONTS_DIR, file));
  const data = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
  return { name, data, weight, style: 'normal' };
}

let fonts: Promise<OgFont[]> | null = null;

/** Montserrat (títulos) y la script provisional de marca (ADR 0006). Se leen una sola vez. */
export function loadOgFonts(): Promise<OgFont[]> {
  fonts ??= Promise.all([
    font('Montserrat-ExtraBold.ttf', 'Montserrat', 800),
    font('Montserrat-SemiBold.ttf', 'Montserrat', 600),
    font('GreatVibes-Regular.ttf', 'Brand Script', 400),
  ]);
  return fonts;
}

/**
 * Lee una foto de public/ y la devuelve recortada al tamaño exacto en que se dibuja
 * (como `object-fit: cover`), en JPEG y como data URI. `focusY` va de 0 (arriba) a 1 (abajo).
 * Recortar antes de pasarla a satori hace el render más rápido y la imagen final más liviana.
 */
export async function localPhoto(
  src: string,
  box: { width: number; height: number; focusY?: number },
): Promise<string> {
  const file = join(process.cwd(), 'public', src);
  const { width = box.width, height = box.height } = await sharp(file).metadata();
  const scale = Math.max(box.width / width, box.height / height);
  const w = Math.max(box.width, Math.round(width * scale));
  const h = Math.max(box.height, Math.round(height * scale));
  const jpeg = await sharp(file)
    .resize(w, h)
    .extract({
      left: Math.round((w - box.width) / 2),
      top: Math.round((h - box.height) * (box.focusY ?? 0.5)),
      width: box.width,
      height: box.height,
    })
    .jpeg({ quality: 90 })
    .toBuffer();
  return `data:image/jpeg;base64,${jpeg.toString('base64')}`;
}

/** Dibuja la tarjeta con next/og y la convierte a JPEG: pesa ~10 veces menos que el PNG. */
export async function renderOgJpeg(element: ReactElement): Promise<Response> {
  const png = await new ImageResponse(element, {
    ...OG_SIZE,
    fonts: await loadOgFonts(),
  }).arrayBuffer();
  const jpeg = await sharp(Buffer.from(png))
    .flatten({ background: colors.ink })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
  return new Response(new Uint8Array(jpeg), {
    headers: {
      'Content-Type': 'image/jpeg',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
