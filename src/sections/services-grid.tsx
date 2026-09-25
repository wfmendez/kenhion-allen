import { ButtonLink } from '@/components/ui/button';
import type { Service } from '@/data/services';

export function ServicesGrid({ services }: { services: Service[] }) {
  return (
    <ul className="grid gap-5 md:grid-cols-3">
      {services.map((service, i) => (
        <li
          key={service.id}
          className="flex flex-col gap-4 rounded-card border border-line bg-surface p-7 transition-colors hover:border-gold/50"
        >
          <span className="text-gold-gradient font-display text-4xl font-extrabold">
            {String(i + 1).padStart(2, '0')}
          </span>
          <h3 className="font-display text-lg font-bold">{service.title}</h3>
          <p className="flex-1 text-sm leading-relaxed text-fg-muted">{service.description}</p>
          <ButtonLink
            href={service.cta.href}
            external={service.cta.external}
            variant="outline"
            size="sm"
            className="self-start"
          >
            {service.cta.label}
          </ButtonLink>
        </li>
      ))}
    </ul>
  );
}
