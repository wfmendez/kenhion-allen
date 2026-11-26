import { existsSync } from 'node:fs';
import { join } from 'node:path';
import manifest from './manifest';

describe('manifest', () => {
  const data = manifest();

  it('declara los dos iconos PNG del emblema y existen en public/', () => {
    expect(data.icons?.map((i) => i.sizes)).toEqual(['192x192', '512x512']);
    for (const icon of data.icons ?? []) {
      expect(existsSync(join(process.cwd(), 'public', icon.src))).toBe(true);
    }
  });

  it('usa el nombre y el negro de la marca, sin instalación como app', () => {
    expect(data).toMatchObject({
      name: 'Kenhion Allen',
      lang: 'es-VE',
      start_url: '/',
      display: 'browser',
      theme_color: '#0a0a0b',
    });
  });
});
