import type { CSSProperties, ReactNode } from 'react';
import { EMBLEM_PATHS, EMBLEM_VIEWBOX } from '@/components/layout/emblem-paths';
import { colors } from '@/styles/tokens';
import type { GridOgData, ProductOgData, SiteOgData } from './og-image';
import { localPhoto } from './render-og';

/**
 * Diseños de las imágenes para compartir (1200x630). Se dibujan con next/og (satori):
 * cada contenedor con varios hijos necesita `display: flex`.
 *
 * Zona segura: X superpone el dominio en la esquina inferior izquierda y recorta ~15 px arriba
 * y abajo, así que ahí solo van la marca o el dominio. Al cambiar el diseño, subir
 * OG_DESIGN_VERSION en og-image.ts para que las redes descarguen la imagen nueva.
 */

const GOLD_GRADIENT = `linear-gradient(135deg, ${colors['gold-light']} 0%, ${colors.gold} 45%, ${colors['gold-deep']} 100%)`;
const PHOTO_BACKGROUND = '#ffffff';

const pct = (rate: number) => Math.round(rate * 100);
const wholesaleLine = (w: { minQty: number; rate: number }) =>
  `${pct(w.rate)}% al mayor desde ${w.minQty} piezas`;

function Emblem({ width }: { width: number }) {
  return (
    <svg width={width} height={(width * 120) / 100} viewBox={EMBLEM_VIEWBOX} fill="none">
      <g stroke={colors.gold} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round">
        {EMBLEM_PATHS.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
    </svg>
  );
}

function Text({ children, style }: { children: ReactNode; style: CSSProperties }) {
  return <div style={{ display: 'flex', fontFamily: 'Montserrat', ...style }}>{children}</div>;
}

/** Texto con el degradado dorado de la marca (igual que `.text-gold-gradient`). */
function GoldText({ children, style }: { children: ReactNode; style: CSSProperties }) {
  return (
    <div
      style={{
        display: 'flex',
        backgroundImage: GOLD_GRADIENT,
        backgroundClip: 'text',
        color: 'transparent',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** Eslogan en la script de marca. El relleno evita que se corte la cola de la última letra. */
function Slogan({ children, fontSize }: { children: ReactNode; fontSize: number }) {
  return (
    <GoldText
      style={{ fontFamily: 'Brand Script', fontSize, lineHeight: 1.25, padding: '0 24px 0 4px' }}
    >
      {children}
    </GoldText>
  );
}

function Eyebrow({ children, color = colors.gold }: { children: ReactNode; color?: string }) {
  return (
    <Text
      style={{
        fontWeight: 600,
        fontSize: 22,
        letterSpacing: 6,
        color,
        textTransform: 'uppercase',
      }}
    >
      {children}
    </Text>
  );
}

const RedStripe = () => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      top: 0,
      width: 1200,
      height: 8,
      display: 'flex',
      background: colors.red,
    }}
  />
);

/** Genérica: marca, eslogan y una foto de la colección en uso. */
export async function siteCard(data: SiteOgData) {
  const photo = await localPhoto(data.photo, { width: 540, height: 630, focusY: 0.08 });
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        position: 'relative',
        background: colors.ink,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- satori, no HTML */}
      <img
        src={photo}
        width={540}
        height={630}
        style={{ position: 'absolute', right: 0, top: 0 }}
      />
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: 540,
          height: 630,
          display: 'flex',
          backgroundImage: `linear-gradient(90deg, ${colors.ink} 0%, rgba(10,10,11,0.55) 30%, rgba(10,10,11,0) 60%)`,
        }}
      />
      <RedStripe />
      <div
        style={{
          position: 'absolute',
          left: 80,
          top: 0,
          width: 640,
          height: 630,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 18,
        }}
      >
        <Emblem width={56} />
        <Text style={{ fontWeight: 800, fontSize: 56, letterSpacing: 3, color: colors.fg }}>
          {data.brand.toUpperCase()}
        </Text>
        <Slogan fontSize={96}>{data.slogan}</Slogan>
        <Eyebrow color={colors['fg-muted']}>{data.line}</Eyebrow>
        <Text
          style={{
            marginTop: 26,
            fontWeight: 600,
            fontSize: 26,
            letterSpacing: 1,
            color: colors.gold,
          }}
        >
          {data.domain}
        </Text>
      </div>
    </div>
  );
}

/** Ficha: nombre, precio y mayoreo a la izquierda; la foto entera (2:3) a la derecha. */
export async function productCard(data: ProductOgData) {
  const photo = await localPhoto(data.photo, { width: 420, height: 630 });
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', background: colors.ink }}>
      <div
        style={{
          width: 760,
          height: 630,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 56px 56px 72px',
          borderTop: `8px solid ${colors.red}`,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Eyebrow>{data.eyebrow}</Eyebrow>
          <Text
            style={{
              fontWeight: 800,
              fontSize: data.name.length > 24 ? 52 : 64,
              lineHeight: 1.08,
              color: colors.fg,
              textWrap: 'balance',
            }}
          >
            {data.name}
          </Text>
          <GoldText style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 76 }}>
            {data.price}
          </GoldText>
          <Text
            style={{
              alignSelf: 'flex-start',
              background: colors.red,
              color: colors['on-accent'],
              fontWeight: 800,
              fontSize: 24,
              padding: '10px 20px',
              borderRadius: 999,
            }}
          >
            {wholesaleLine(data.wholesale)}
          </Text>
          {data.units > 1 ? (
            <Text style={{ fontWeight: 600, fontSize: 22, color: colors['fg-muted'] }}>
              {`Este conjunto cuenta como ${data.units} piezas`}
            </Text>
          ) : null}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Emblem width={40} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Text style={{ fontWeight: 800, fontSize: 26, letterSpacing: 3, color: colors.fg }}>
              {data.brand.toUpperCase()}
            </Text>
            <Text style={{ fontWeight: 600, fontSize: 20, color: colors['fg-muted'] }}>
              {data.domain}
            </Text>
          </div>
        </div>
      </div>
      <div
        style={{
          width: 440,
          height: 630,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: PHOTO_BACKGROUND,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- satori, no HTML */}
        <img src={photo} width={420} height={630} />
      </div>
    </div>
  );
}

/** Tienda y colección: hasta 3 prendas con su foto principal. */
export async function gridCard(data: GridOgData) {
  const photos = await Promise.all(
    data.photos.map((src) => localPhoto(src, { width: 346, height: 360, focusY: 0.4 })),
  );
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: colors.ink,
        borderTop: `8px solid ${colors.red}`,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          padding: '40px 64px 28px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Eyebrow>{data.eyebrow}</Eyebrow>
          <Text style={{ fontWeight: 800, fontSize: 60, letterSpacing: 2, color: colors.fg }}>
            {data.title.toUpperCase()}
          </Text>
        </div>
        <Slogan fontSize={68}>{data.slogan}</Slogan>
      </div>
      <div style={{ display: 'flex', gap: 16, padding: '0 64px' }}>
        {photos.map((src) => (
          <div
            key={src.slice(-32)}
            style={{
              display: 'flex',
              background: PHOTO_BACKGROUND,
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- satori, no HTML */}
            <img src={src} width={346} height={360} />
          </div>
        ))}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '22px 64px 0',
        }}
      >
        <Text style={{ fontWeight: 600, fontSize: 24, color: colors.gold }}>{data.domain}</Text>
        <Text style={{ fontWeight: 600, fontSize: 24, color: colors['fg-muted'] }}>
          {`${data.names.join(' · ')} · ${wholesaleLine(data.wholesale)}`}
        </Text>
      </div>
    </div>
  );
}
