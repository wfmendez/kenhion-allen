'use client';

import { useEffect, useId, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Icon } from './icon';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Oculta visualmente el título (sigue disponible para lectores de pantalla). */
  hideTitle?: boolean;
  children: ReactNode;
  className?: string;
  variant?: 'modal' | 'drawer';
}

/**
 * Base de Modal y Drawer sobre <dialog> nativo: el navegador se encarga de atrapar el foco,
 * cerrar con Esc, devolver el foco al elemento que lo abrió y bloquear el contenido de fondo.
 */
function BaseDialog({
  open,
  onClose,
  title,
  hideTitle,
  children,
  className,
  variant = 'modal',
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      document.body.style.overflow = 'hidden';
    } else if (!open && dialog.open) {
      dialog.close();
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      // Clic en el fondo (fuera del contenido) cierra el diálogo.
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className={cn(
        'bg-transparent p-0 text-fg backdrop:bg-transparent open:animate-fade-in',
        variant === 'modal' && 'm-auto w-[calc(100%-2rem)] max-w-2xl',
        variant === 'drawer' &&
          'm-0 ml-auto h-dvh max-h-dvh w-full max-w-md open:animate-slide-in-right',
      )}
    >
      <div
        className={cn(
          'relative flex flex-col border border-line bg-surface-raised shadow-panel',
          variant === 'modal' && 'max-h-[calc(100dvh-2rem)] rounded-card',
          variant === 'drawer' && 'h-full border-y-0 border-r-0',
          className,
        )}
      >
        <div className="flex items-center justify-between gap-4 border-b border-line px-6 py-4">
          <h2
            id={titleId}
            className={cn(
              'font-display text-sm font-bold tracking-[0.18em] text-fg uppercase',
              hideTitle && 'sr-only',
            )}
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto grid size-10 place-items-center rounded-full text-fg-muted transition-colors hover:bg-surface hover:text-gold"
          >
            <Icon name="close" label="Cerrar" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </dialog>
  );
}

export function Modal(props: Omit<DialogProps, 'variant'>) {
  return <BaseDialog {...props} variant="modal" />;
}

export function Drawer(props: Omit<DialogProps, 'variant'>) {
  return <BaseDialog {...props} variant="drawer" />;
}
