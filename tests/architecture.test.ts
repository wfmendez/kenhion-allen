// @vitest-environment node
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * ADR 0009: el catálogo (productos y colecciones) solo se lee a través del repositorio.
 * El contenido editorial de src/data (FAQ, galería, servicios, textos, tallas, envíos, estados)
 * sí se importa directamente.
 */
const root = fileURLToPath(new URL('..', import.meta.url));
const src = join(root, 'src');

const CATALOG_MODULES = ['src/data/products', 'src/data/collections'];
/** Únicos lugares de código de la app que pueden importar el catálogo en crudo. */
const ALLOWED_DIRS = ['src/lib/repositories/', 'src/data/'];

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return /\.(ts|tsx)$/.test(entry.name) ? [path] : [];
  });
}

const toPosix = (path: string) => path.split(sep).join('/');

/** Módulos que importa un archivo, como rutas relativas a la raíz y sin extensión. */
function importedModules(file: string): string[] {
  const code = readFileSync(file, 'utf8');
  const specifiers = [
    ...code.matchAll(/\bfrom\s+['"]([^'"]+)['"]/g),
    ...code.matchAll(/\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g),
    ...code.matchAll(/\bimport\s+['"]([^'"]+)['"]/g),
  ].map((match) => match[1] ?? '');

  return specifiers.flatMap((specifier) => {
    let absolute: string;
    if (specifier.startsWith('@/')) absolute = join(src, specifier.slice(2));
    else if (specifier.startsWith('.')) absolute = resolve(dirname(file), specifier);
    else return [];
    return [
      toPosix(relative(root, absolute))
        .replace(/\.(ts|tsx)$/, '')
        .replace(/\/index$/, ''),
    ];
  });
}

const appFiles = sourceFiles(src).filter((file) => !/\.test\.tsx?$/.test(file));

describe('arquitectura', () => {
  it('el repositorio es el único acceso de la app a productos y colecciones', () => {
    const offenders = appFiles
      .map((file) => toPosix(relative(root, file)))
      .filter((path) => !ALLOWED_DIRS.some((dir) => path.startsWith(dir)))
      .filter((path) =>
        importedModules(join(root, path)).some((module) => CATALOG_MODULES.includes(module)),
      );

    expect(offenders).toEqual([]);
  });

  it('la revisión detecta los imports del catálogo (alias y rutas relativas)', () => {
    const repository = join(src, 'lib/repositories/product-repository.ts');
    expect(importedModules(repository)).toEqual(expect.arrayContaining(CATALOG_MODULES));
    expect(importedModules(join(src, 'data/faq.ts'))).toContain('src/data/products');
  });
});
