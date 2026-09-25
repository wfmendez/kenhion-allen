import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { ContactDetails } from '@/sections/contact-details';
import { PageHeader } from '@/sections/page-header';

export const metadata: Metadata = {
  title: 'Contacto',
  description: `Escríbenos por WhatsApp al ${siteConfig.contact.whatsappDisplay}. ${siteConfig.location.city}, ${siteConfig.location.country}.`,
  alternates: { canonical: '/contacto' },
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Ubicación y contacto"
        title="Hablemos"
        crumbs={[{ name: 'Contacto', path: '/contacto' }]}
      />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <ContactDetails />
      </div>
    </>
  );
}
