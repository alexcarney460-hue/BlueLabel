import Header from '@/app/Header';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import AddToCartClient from './AddToCartClient';
import { allProducts, normalizeProductId } from '@/lib/products';

export default async function ProductPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedParams = await params;
  const resolvedSearch = searchParams ? await searchParams : {};

  const raw = resolvedParams?.id ?? '';
  const lastSegment = raw.split('/').filter(Boolean).pop() ?? '';
  const slug = normalizeProductId(lastSegment);
  const debug = resolvedSearch?.debug === '1' || resolvedSearch?.debug === 'true';

  const product = slug ? allProducts.find((p) => p.id === slug) : undefined;

  if (debug) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="max-w-xl w-full bg-slate-50 border border-slate-200 rounded-2xl p-6">
          <h1 className="text-xl font-black text-slate-900 mb-2">Debug: /product/[id]</h1>
          <div className="text-sm text-slate-700 space-y-2">
            <div>
              <span className="font-bold">params.id:</span> <code>{JSON.stringify(raw)}</code>
            </div>
            <div>
              <span className="font-bold">lastSegment:</span> <code>{JSON.stringify(lastSegment)}</code>
            </div>
            <div>
              <span className="font-bold">slug:</span> <code>{JSON.stringify(slug)}</code>
            </div>
            <div>
              <span className="font-bold">found:</span> <code>{JSON.stringify(!!product)}</code>
            </div>
            <div>
              <span className="font-bold">available:</span>{' '}
              <code>{JSON.stringify(allProducts.map((p) => p.id))}</code>
            </div>
          </div>
          <div className="mt-4 flex gap-4">
            <Link href="/catalog" className="text-sky-700 font-bold hover:underline">
              Go to catalog
            </Link>
            <Link href={`/product/${slug || 'cherry'}`} className="text-slate-700 font-bold hover:underline">
              Try product page
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!slug) {
    redirect('/catalog');
  }

  if (!product) {
    notFound();
  }

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: [`https://bluelabelwholesale.com${product.image}`],
    brand: { '@type': 'Brand', name: 'Blue Label Wholesale' },
    offers: {
      '@type': 'Offer',
      url: `https://bluelabelwholesale.com/product/${product.id}`,
      priceCurrency: 'USD',
      price: Number(product.price).toFixed(2),
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <div className="bg-white min-h-screen font-sans">
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />

      <section className="py-12 sm:py-20 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <Link href="/catalog" className="text-sky-600 hover:underline mb-6 sm:mb-8 inline-block font-bold">← Back to Catalog</Link>
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-start">
            <div className="flex items-center justify-center">
              <div className="w-full max-w-xs sm:max-w-sm h-80 sm:h-96 rounded-2xl overflow-hidden flex items-center justify-center">
                <img src={product.image} alt={product.name} className="w-full h-full object-contain p-6 sm:p-8" />
              </div>
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 text-slate-900">{product.name}</h1>
              <p className="text-sky-600 text-sm font-bold uppercase mb-6">Premium</p>

              <div className="mb-8">
                <div className="text-sm text-slate-600 font-semibold">Retail</div>
                <p className="text-3xl sm:text-4xl font-black text-slate-900">${product.price.toFixed(2)}</p>
                <p className="text-sm text-slate-500">Wholesale pricing available — sign in to view.</p>
              </div>

              <p className="text-base sm:text-lg text-slate-600 mb-8 leading-relaxed">{product.description}</p>

              <div className="mb-8 space-y-3 bg-slate-50 p-5 sm:p-6 rounded-lg text-sm sm:text-base">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="font-bold text-slate-900">Wholesale:</span>
                  <span className="text-slate-700 font-semibold">Wholesale pricing available — sign in to view.</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="font-bold text-slate-900">Dosage:</span>
                  <span className="text-slate-700 font-semibold">{product.dosage}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="font-bold text-slate-900">Format:</span>
                  <span className="text-slate-700 font-semibold">2x10 tablet containers</span>
                </div>
              </div>

              <AddToCartClient product={product} />

              <div className="bg-slate-50 p-6 rounded-lg">
                <h3 className="font-bold text-slate-900 mb-4">Quality Assurance</h3>
                <ul className="space-y-3 text-slate-700">
                  {product.details.map((detail: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span className="text-sm">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8 px-8 text-center" style={{ background: 'var(--bg)', color: 'var(--muted)', borderTop: '1px solid var(--divider)' }}>
        <p>© 2026 BlueLabel. All rights reserved.</p>
      </footer>
    </div>
  );
}
