import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type BadgeTone = 'gold' | 'red' | 'neutral' | 'success';

const tones: Record<BadgeTone, string> = {
  gold: 'border border-gold/60 bg-ink/80 text-gold',
  red: 'bg-red text-on-accent',
  neutral: 'border border-line bg-surface-raised text-fg-muted',
  success: 'border border-success/40 bg-success/10 text-success',
};

export function Badge({
  tone = 'gold',
  className,
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-3 py-1 font-display text-[0.65rem] font-bold tracking-[0.14em] uppercase',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
