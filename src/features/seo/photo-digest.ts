import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Solo servidor. Huella del CONTENIDO de una foto de public/ (sha256, 12 caracteres), para que
 * la URL de la imagen para compartir cambie también si se reemplaza una foto con el mismo nombre.
 * Se calcula en el build (todas las páginas que la usan son estáticas) y se guarda en memoria.
 */
const cache = new Map<string, string>();

export function photoDigest(src: string): string {
  let digest = cache.get(src);
  if (digest === undefined) {
    try {
      const file = readFileSync(join(process.cwd(), 'public', src));
      digest = createHash('sha256').update(file).digest('hex').slice(0, 12);
    } catch {
      // Sin el archivo (p. ej. una función sin public/ en Vercel) basta con la ruta: la imagen
      // se sirve igual, solo cambia el ?v=. Si la foto falta de verdad, el build de /og/* falla.
      digest = 'sin-archivo';
    }
    cache.set(src, digest);
  }
  return digest;
}
