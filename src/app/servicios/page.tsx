import type { Metadata } from 'next';
import { services } from '@/data/services';
import { PageHeader } from '@/sections/page-header';
import { ServicesGrid } from '@/sections/services-grid';
import { WholesaleBanner } from '@/sections/wholesale-banner';

export const metadata: Metadata = {
  title: 'Servicios',
  description: 'Asesoría de moda, Print On Demand y prendas personalizadas a tu medida.',
  alternates: { canonical: '/servicios' },
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Kenhion Allen"
        title="Nuestros servicios"
        description="Más que una tienda: te acompañamos a construir tu estilo."
        crumbs={[{ name: 'Servicios', path: '/servicios' }]}
      />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <ServicesGrid services={services} />
      </div>
      <WholesaleBanner />
    </>
  );
}
