// Genera los iconos raster del emblema a partir de src/components/layout/emblem-paths.ts:
//   - src/app/favicon.ico (PNG de 48, 32 y 16 px dentro de un ICO). Google Search no acepta SVG
//     como favicon y Next no puede generar favicon.ico con código.
//   - public/images/marca/emblema-192.png y emblema-512.png (manifest y logo del JSON-LD).
// Se versionan los archivos resultantes: correr de nuevo solo si cambia el emblema o los colores.
// Uso (desde la raíz del repo, Node 24): node scripts/generate-favicon.mjs
// Ojo: importa una ruta interna de Next (next/dist/compiled/@vercel/og). Al subir de versión
// mayor de Next, revisar que exista antes de correrlo; el sitio no depende de este script.
import { mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const require = createRequire(join(root, 'package.json'));
const React = require('react');
const { ImageResponse } = await import(
  pathToFileURL(join(root, 'node_modules/next/dist/compiled/@vercel/og/index.node.js')).href
);
// Node 24 ejecuta TypeScript borrando los tipos: se reutilizan los trazos y colores del sitio.
const { EMBLEM_PATHS, EMBLEM_STROKE_SMALL, EMBLEM_VIEWBOX, emblemIconBox } = await import(
  pathToFileURL(join(root, 'src/components/layout/emblem-paths.ts')).href
);
const { colors } = await import(pathToFileURL(join(root, 'src/styles/tokens.ts')).href);

const h = React.createElement;

/** Mismo dibujo que src/components/seo/emblem-icon.tsx (apple-touch-icon). */
async function png(px, stroke) {
  const { width, height } = emblemIconBox(px);
  const element = h(
    'div',
    {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: colors.ink,
      },
    },
    h(
      'svg',
      { width, height, viewBox: EMBLEM_VIEWBOX, fill: 'none' },
      h(
        'g',
        {
          stroke: colors.gold,
          strokeWidth: stroke,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        },
        ...EMBLEM_PATHS.map((d) => h('path', { key: d, d })),
      ),
    ),
  );
  const res = new ImageResponse(element, { width: px, height: px });
  return Buffer.from(await res.arrayBuffer());
}

function write(relative, data) {
  const out = join(root, relative);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, data);
  console.log(`${relative} (${data.length} bytes)`);
}

/** Contenedor ICO: cabecera (6 bytes) + 16 bytes por imagen + los PNG. */
function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = 6 + 16 * images.length;
  const entries = images.map(({ px, data }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(px, 0);
    e.writeUInt8(px, 1);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    return e;
  });
  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
}

// En tamaños diminutos el trazo se engrosa para que el emblema se siga leyendo.
// La de 48 va primero: Next toma de la primera imagen el atributo `sizes` del <link>.
const favicon = [
  { px: 48, stroke: 7 },
  { px: 32, stroke: 8 },
  { px: 16, stroke: 10 },
];
const images = [];
for (const { px, stroke } of favicon) images.push({ px, data: await png(px, stroke) });
write('src/app/favicon.ico', ico(images));

write('public/images/marca/emblema-192.png', await png(192, EMBLEM_STROKE_SMALL));
write('public/images/marca/emblema-512.png', await png(512, 4));
