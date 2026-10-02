import { siteConfig } from '@/config/site';

/**
 * Textos de marca redactados por el cliente (octubre 2026).
 * Se copian tal cual: cualquier cambio de redacción debe venir del cliente.
 */

/** Párrafo del hero del inicio. */
export const homeCopy = {
  collectionTitle: 'Colección KA ELITE',
  collectionText:
    'Prendas deportivas de compresión de alta resistencia, diseñadas para brindar máxima durabilidad y hacerte lucir elegante en cada entrenamiento. Siente el ajuste perfecto y eleva tu rendimiento más allá del límite.',
} as const;

export interface AboutValue {
  id: 'diseno' | 'calidad' | 'manufactura';
  title: string;
  text: string;
}

/** Página "Nosotros". */
export const aboutCopy: { description: string; values: AboutValue[] } = {
  description: `Somos una firma de diseño definida por la elegancia atemporal. La cuidadosa selección de nuestros textiles y la precisión de nuestro estilo transformarán tu noción del vestir. En ${siteConfig.name} no seguimos tendencias, las creamos.`,
  values: [
    {
      id: 'diseno',
      title: 'Diseño elegante',
      text: 'La sofisticación está en el detalle: cortes pulidos, acabados limpios y un diseño impecable pensado para destacar en cualquier ocasión. Una experiencia de vestir que redefine tu estilo.',
    },
    {
      id: 'calidad',
      title: 'Calidad garantizada',
      text: 'Cada pieza es el resultado de una selección de telas de categoría superior y un impecable cuidado en cada detalle.',
    },
    {
      id: 'manufactura',
      title: 'Manufactura local',
      text: `Cada pieza nace en ${siteConfig.location.city} bajo un proceso de confección impecable. Te brindamos un trato cercano en cada paso de tu compra y la tranquilidad de recibirlos con envíos seguros a cualquier rincón de ${siteConfig.location.country}.`,
    },
  ],
};
