import nextConfig from '../../next.config';
import { PHOTO_QUALITY, productCardSizes } from './images';

describe('imágenes', () => {
  it('la calidad de las fotos está permitida en next.config', () => {
    expect(nextConfig.images?.qualities).toContain(PHOTO_QUALITY);
    expect(nextConfig.images?.formats).toEqual(['image/avif', 'image/webp']);
  });

  it('sizes de la tarjeta refleja las columnas de la grilla', () => {
    expect(productCardSizes(3)).toBe('(min-width: 1280px) 400px, (min-width: 768px) 33vw, 50vw');
    expect(productCardSizes(4)).toContain('(min-width: 1280px) 300px');
  });
});
