export interface GalleryImage {
  src: string;
  alt: string;
}

const CDN = 'https://af606c0c04.cbaul-cdnwnd.com/a50e9269c7b3dca260132ece6590c58c';

export const gallery: GalleryImage[] = [
  {
    src: `${CDN}/200000110-2b9d22b9d4/IMG_0964.JPG-5.jpeg?ph=af606c0c04`,
    alt: 'Colección Kenhion Allen 1',
  },
  {
    src: `${CDN}/200000085-22e1522e17/IMG_0977.JPG.jpeg?ph=af606c0c04`,
    alt: 'Colección Kenhion Allen 2',
  },
  {
    src: `${CDN}/200000094-0c01b0c01c/IMG_0976.JPG.jpeg?ph=af606c0c04`,
    alt: 'Colección Kenhion Allen 3',
  },
  {
    src: `${CDN}/200000088-913299132b/IMG_0979.JPG.jpeg?ph=af606c0c04`,
    alt: 'Colección Kenhion Allen 4',
  },
];

export const heroImage: GalleryImage = {
  src: `${CDN}/200000054-9349b9349d/IMG_0965.JPG%20%281%29.jpeg?ph=af606c0c04`,
  alt: 'Kenhion Allen moda elegante',
};
