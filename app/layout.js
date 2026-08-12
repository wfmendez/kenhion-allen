import './globals.css';

export const metadata = {
  title: 'Kenhion Allen | Tienda de Ropa Elegante en Maracay, Venezuela',
  description: 'Kenhion Allen - Tienda de ropa especializada en prendas elegantes para hombres y mujeres en Maracay, Venezuela. Proyecta la grandeza que llevas dentro.',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120" fill="none" stroke="%23111827" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"><path d="M 50 5 Q 50 35 85 60 Q 50 85 50 115 Q 50 85 15 60 Q 50 35 50 5 Z"/><path d="M 24 25 Q 38 60 24 95"/><path d="M 76 25 Q 62 60 76 95"/></svg>',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Merriweather:ital,wght@0,400;0,700;1,400;1,700&family=Montserrat:wght@700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
