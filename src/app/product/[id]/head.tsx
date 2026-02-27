import type { Metadata } from 'next';
import { allProducts, normalizeProductId } from '@/lib/products';

export default async function Head({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const slug = normalizeProductId(id);
  const product = allProducts.find((p) => p.id === slug);

  const title = product
    ? `${product.name} — 7OH / 7-OH Tablets (Wholesale + Retail)`
    : 'Product — Blue Label Wholesale';

  const description = product
    ? `${product.name} (7OH / 7-OH tablets). Create an account for wholesale pricing for retailers and distributors. Subscribe & Save 10%.`
    : 'Browse 7OH / 7-OH tablets. Create an account for wholesale pricing.';

  // Next will merge this into the document head.
  const metadata: Metadata = {
    title,
    description,
    openGraph: {
      title,
      description,
      images: product?.image ? [{ url: product.image }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: product?.image ? [product.image] : undefined,
    },
  };

  return (
    <>
      <title>{String(metadata.title)}</title>
      <meta name="description" content={metadata.description ?? ''} />
    </>
  );
}
