import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { TopBar } from '@/components/layout/top-bar';
import { ToastProvider } from '@/components/ui/toast';
import { isIndexable, siteConfig } from '@/config/site';
import { CartProvider } from '@/features/cart/cart-context';
import { CartButton, CartDrawer } from '@/features/cart/cart-drawer';
import { SearchButton } from '@/features/search/search-button';
import { getCollections, getProducts } from '@/lib/repositories/product-repository';
import { baseOpenGraph } from '@/lib/seo/metadata';
import { fontVariables } from '@/styles/fonts';
import '@/styles/globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | ${siteConfig.slogan}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: `${siteConfig.description} ${siteConfig.slogan}.`,
  // Sin canonical aquí: lo heredarían la 404 y el carrito. Cada página indexable declara el suyo.
  // Las páginas sin openGraph propio (carrito, checkout, 404) heredan este, con la imagen genérica.
  openGraph: baseOpenGraph,
  // Las previsualizaciones no se indexan (ADR 0008). VERCEL_ENV solo existe en el servidor.
  robots: isIndexable(process.env.VERCEL_ENV) ? undefined : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0b',
  colorScheme: 'dark',
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const [products, collections] = await Promise.all([getProducts(), getCollections()]);

  return (
    <html lang="es" className={fontVariables}>
      <body className="flex min-h-dvh flex-col">
        <ToastProvider>
          <CartProvider products={products} collections={collections}>
            <a
              href="#contenido"
              className="sr-only z-50 rounded bg-gold px-4 py-2 text-ink focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
            >
              Saltar al contenido
            </a>
            <TopBar />
            <Header
              actions={
                <>
                  <SearchButton />
                  <CartButton />
                </>
              }
            />
            <main id="contenido" className="flex-1">
              {children}
            </main>
            <Footer />
            <CartDrawer />
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
