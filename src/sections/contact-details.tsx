import { ButtonLink } from '@/components/ui/button';
import { Icon, type IconName } from '@/components/ui/icon';
import { siteConfig } from '@/config/site';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

export function ContactDetails() {
  const { contact, location } = siteConfig;
  const items: { icon: IconName; title: string; value: string; href?: string }[] = [
    {
      icon: 'mapPin',
      title: 'Ubicación',
      value: `${location.city}, estado ${location.state}, ${location.country}`,
    },
    {
      icon: 'whatsapp',
      title: 'Teléfono / WhatsApp',
      value: contact.whatsappDisplay,
      href: `https://wa.me/${contact.whatsappNumber}`,
    },
    { icon: 'mail', title: 'Correo', value: contact.email, href: `mailto:${contact.email}` },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
      <ul className="flex flex-col gap-4">
        {items.map((item) => (
          <li
            key={item.title}
            className="flex items-center gap-4 rounded-card border border-line bg-surface p-5"
          >
            <span className="grid size-12 shrink-0 place-items-center rounded-full border border-gold/40 text-gold">
              <Icon name={item.icon} />
            </span>
            <div className="min-w-0">
              <p className="font-display text-xs font-bold tracking-[0.16em] text-fg-subtle uppercase">
                {item.title}
              </p>
              {item.href ? (
                <a
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="break-all text-fg hover:text-gold"
                >
                  {item.value}
                </a>
              ) : (
                <p className="text-fg">{item.value}</p>
              )}
            </div>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-4 rounded-card border border-gold/40 bg-surface p-8">
        <h2 className="font-display text-xl font-bold">Atención inmediata por WhatsApp</h2>
        <p className="text-sm text-fg-muted">
          ¿Dudas sobre tallas, disponibilidad o pedidos al mayor? Escríbenos directamente.
        </p>
        <ButtonLink
          href={buildWhatsAppUrl(`Hola ${siteConfig.name}, quisiera realizar una consulta.`)}
          external
          variant="whatsapp"
          size="lg"
          fullWidth
        >
          <Icon name="whatsapp" size={18} /> Escribir al WhatsApp
        </ButtonLink>
      </div>
    </div>
  );
}
