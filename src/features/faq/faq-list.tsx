import { Icon } from '@/components/ui/icon';
import type { FaqItem } from '@/data/faq';

/** Acordeón con <details> nativo: accesible y funciona sin JavaScript. */
export function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <details
          key={item.question}
          className="group rounded-card border border-line bg-surface open:border-gold/40"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-display text-sm font-bold [&::-webkit-details-marker]:hidden">
            {item.question}
            <Icon
              name="plus"
              size={18}
              className="shrink-0 text-gold transition-transform group-open:rotate-45"
            />
          </summary>
          <p className="px-5 pb-5 text-sm leading-relaxed text-fg-muted">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
