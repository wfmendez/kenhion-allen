import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { pageMetadata } from '@/lib/seo/metadata';
import { ContactDetails } from '@/sections/contact-details';
import { PageHeader } from '@/sections/page-header';

export const metadata: Metadata = pageMetadata({
  path: '/contacto',
  title: 'Contacto',
  description: `Escríbenos por WhatsApp al ${siteConfig.contact.whatsappDisplay} para pedidos, tallas y compras al mayor. ${siteConfig.location.city}, ${siteConfig.location.country}, con envíos a toda Venezuela.`,
});

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
