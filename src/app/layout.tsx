import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from './cart-context';

export const metadata: Metadata = {
  title: "BlueLabel - Premium 7-OH Tablets",
  description: "Lab-tested, pharmaceutical-grade 7-hydroxymitragynine tablets for wholesale distribution",
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
