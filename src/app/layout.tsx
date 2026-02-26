import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from './cart-context';

export const metadata: Metadata = {
  metadataBase: new URL('https://bluelabelwholesale.com'),
  title: "BlueLabel - Premium 7-OH Tablets",
  description: "Lab-tested, pharmaceutical-grade 7-hydroxymitragynine tablets for wholesale distribution",
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }, { url: '/favicon.ico' }],
    apple: [{ url: '/favicon.svg' }],
  },
  openGraph: {
    title: 'BlueLabel - Premium 7-OH Tablets',
    description: 'Wholesale research-grade 7-OH tablets with verified documentation.',
    url: 'https://bluelabelwholesale.com',
    siteName: 'BlueLabel',
    images: [{ url: '/cherry.jpg', width: 1200, height: 630, alt: 'BlueLabel Wholesale' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BlueLabel - Premium 7-OH Tablets',
    description: 'Wholesale research-grade 7-OH tablets. Contact sales for bulk pricing.',
    images: ['/cherry.jpg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
