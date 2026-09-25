'use client';

import Image, { type ImageProps } from 'next/image';
import { useState } from 'react';

/** next/image que cambia a la imagen de respaldo si la principal falla (CDN caído, URL rota). */
export function ProductImage({
  src,
  fallbackSrc,
  alt,
  ...props
}: Omit<ImageProps, 'src' | 'onError'> & { src: string; fallbackSrc?: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <Image
      {...props}
      alt={alt}
      src={failed && fallbackSrc ? fallbackSrc : src}
      onError={() => setFailed(true)}
    />
  );
}
