'use client';

import { ErrorState, type ErrorStateProps } from '@/sections/error-state';

/** Errores dentro de una página: el encabezado y el pie siguen visibles. */
export default function ErrorPage(props: ErrorStateProps) {
  return <ErrorState {...props} />;
}
