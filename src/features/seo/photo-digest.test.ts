import { products } from '@/data/products';
import { getPrimaryImage } from '@/lib/schemas/product';
import { photoDigest } from './photo-digest';

describe('photoDigest', () => {
  it('es un sha256 corto del archivo de public/ y distingue fotos distintas', () => {
    const [a, b] = products.map((p) => getPrimaryImage(p).src);
    expect(photoDigest(a!)).toMatch(/^[0-9a-f]{12}$/);
    expect(photoDigest(a!)).not.toBe(photoDigest(b!));
  });

  it('sin archivo no rompe el render de la metadata', () => {
    expect(photoDigest('/images/no-existe.jpg')).toBe('sin-archivo');
  });
});
