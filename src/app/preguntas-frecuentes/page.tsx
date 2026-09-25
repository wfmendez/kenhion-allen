import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/json-ld';
import { ButtonLink } from '@/components/ui/button';
import { faq } from '@/data/faq';
import { FaqList } from '@/features/faq/faq-list';
import { faqJsonLd } from '@/lib/structured-data';
import { PageHeader } from '@/sections/page-header';

export const metadata: Metadata = {
  title: 'Preguntas frecuentes',
  description: 'Envíos en Venezuela, compras al mayor, métodos de pago y atención personalizada.',
  alternates: { canonical: '/preguntas-frecuentes' },
};

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faq)} />
      <PageHeader
        eyebrow="Resolvemos tus dudas"
        title="Preguntas frecuentes"
        crumbs={[{ name: 'Preguntas frecuentes', path: '/preguntas-frecuentes' }]}
      />
      <div className="mx-auto flex max-w-3xl flex-col gap-10 px-4 py-16 sm:px-6">
        <FaqList items={faq} />
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="text-fg-muted">¿No encontraste tu respuesta?</p>
          <ButtonLink href="/contacto" variant="outline">
            Contáctanos
          </ButtonLink>
        </div>
      </div>
    </>
  );
}
