export interface GalleryImage {
  src: string;
  alt: string;
}

const ACTION = '/images/ka-elite/accion';

/** Fotos de la colección KA ELITE en uso (capturas de los videos de la marca). */
export const gallery: GalleryImage[] = [
  { src: `${ACTION}/accion-01.jpg`, alt: 'Atleta en bicicleta de aire con el conjunto verde' },
  {
    src: `${ACTION}/accion-02.jpg`,
    alt: 'Atleta levantando una barra con la franela de compresión',
  },
  { src: `${ACTION}/accion-03.jpg`, alt: 'Atleta en anillas con el conjunto verde' },
  {
    src: `${ACTION}/accion-04.jpg`,
    alt: 'Boxeador entrenando con la franela de compresión blanca',
  },
  { src: `${ACTION}/accion-05.jpg`, alt: 'Atleta calentando con el conjunto negro' },
  { src: `${ACTION}/accion-06.jpg`, alt: 'Atleta entrenando con el short de caballero negro' },
  { src: `${ACTION}/accion-07.jpg`, alt: 'Atleta descansando con el conjunto negro' },
  { src: `${ACTION}/accion-08.jpg`, alt: 'Atleta entrenando con pesas rusas' },
  { src: `${ACTION}/accion-09.jpg`, alt: 'Detalle del emblema en la espalda del top negro' },
];

export const heroImage: GalleryImage = gallery[2]!;

/** Selección corta para la franja del inicio. */
export const homeGallery: GalleryImage[] = [gallery[0]!, gallery[1]!, gallery[4]!, gallery[3]!];
