import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BlueLabel - Premium 7-OH Tablets",
  description: "Lab-tested, pharmaceutical-grade 7-hydroxymitragynine tablets for wholesale distribution",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
