import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from './cart-context';
import ChatWidget from './ChatWidget';
import GoogleAnalytics from './GoogleAnalytics';

export const metadata: Metadata = {
  metadataBase: new URL('https://bluelabelwholesale.com'),
  title: {
    default: 'Blue Label Wholesale — 7OH / 7-OH Tablets (Retail + Wholesale)',
    template: '%s | Blue Label Wholesale',
  },
  description:
    'Blue Label Wholesale: 7OH (7-OH) tablets with account-based wholesale pricing for retailers and distributors. Browse flavors, subscribe & save, and reorder fast.',
  keywords: [
    '7OH',
    '7-OH',
    '7oh',
    '7-oh',
    '7OH tablets',
    '7-OH tablets',
    '7oh tablets',
    '7-oh tablets',
    'kratom',
    'mit',
    'wholesale',
    'Blue Label Wholesale',
    '7ohm',
    '7OHMz',
    '7OHMZ',
  ],
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }, { url: '/favicon.ico' }],
    apple: [{ url: '/favicon.svg' }],
  },
  openGraph: {
    title: 'Blue Label Wholesale — 7OH / 7-OH Tablets',
    description:
      '7OH (7-OH) tablets for retail + wholesale. Create an account for retailer/distributor pricing and faster reorders.',
    url: 'https://bluelabelwholesale.com',
    siteName: 'Blue Label Wholesale',
    images: [{ url: '/cherry.jpg', width: 1200, height: 630, alt: 'Blue Label Wholesale — 7OH / 7-OH Tablets' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blue Label Wholesale — 7OH / 7-OH Tablets',
    description:
      'Shop 7OH (7-OH) tablets retail or create an account for wholesale pricing. Subscribe & save 10%.',
    images: ['/cherry.jpg'],
  },
};

import TrackPageView from './Track';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Blue Label Wholesale',
    url: 'https://bluelabelwholesale.com',
    logo: 'https://bluelabelwholesale.com/logo.jpg',
    email: 'info@bluelabelwholesale.com',
  };

  return (
    <html lang="en">
      <body>
        <CartProvider>
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA4_ID ?? ''} />
          <TrackPageView />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
          {children}
          <ChatWidget />
        </CartProvider>
      </body>
    </html>
  );
}
