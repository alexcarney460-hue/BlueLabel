'use client';

import Link from 'next/link';
import Header from '@/app/Header';
import { allProducts } from '@/lib/products';
import { getActiveProductsFromDb } from '@/lib/products-db';
import { useAccountPricing } from '@/lib/useAccountPricing';

export default function Catalog() {
  const { isSignedIn, accountType, price } = useAccountPricing();

  const products = allProducts.map((p) => ({
    id: p.id,
    name: p.shortName,
    image: p.image,
    purity: p.purityLabel,
    dosage: p.dosage,
    description: p.summary,
    price: price(p.price),
    retailPrice: p.price,
    showWholesaleHint: !isSignedIn,
    pricingNote: isSignedIn && accountType !== 'retail' ? 'Your account pricing applied' : null,
  }));

  return (
    <div className="bg-white min-h-screen font-sans">
      <Header />

      {/* Catalog Section */}
      <section className="py-14 sm:py-20 px-4 sm:px-8 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-black text-center mb-8 sm:mb-12 text-slate-900">Product Catalog</h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {products.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`}>
                <div className="bg-white rounded-2xl shadow-sm border border-white hover:shadow-lg transition cursor-pointer group">
                  <div className="w-full h-52 sm:h-64 bg-slate-100 rounded-t-2xl overflow-hidden flex items-center justify-center">
                    <img src={product.image} alt={product.name} className="w-full h-full object-contain group-hover:scale-105 transition p-3 sm:p-4" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-sky-600 mb-2">{product.name}</h3>
                    <p className="font-bold text-slate-900 mb-2">Purity: {product.purity}</p>
                    <p className="text-slate-600 text-sm mb-4">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-bold text-lg text-slate-900">${product.price.toFixed(2)}</div>
                        <div className="text-xs text-slate-500">Retail{product.pricingNote ? ` · ${product.pricingNote}` : ''}</div>
                      </div>
                      <button className="font-bold py-2 px-4 rounded-lg transition text-sm" style={{ background: 'var(--brand)', color: 'white' }}>
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: 'var(--bg)', color: 'var(--muted)', borderTop: '1px solid var(--divider)' }} className="py-10 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-center sm:text-left">
              <div className="font-black" style={{ color: 'var(--text)' }}>Blue Label Wholesale</div>
              <div className="text-sm">© 2026 BlueLabel. All rights reserved.</div>
            </div>

            <div className="flex flex-wrap justify-center sm:justify-end gap-x-5 gap-y-2 text-sm font-bold">
              <a href="/terms" className="hover:underline" style={{ color: 'var(--brand)' }}>Terms</a>
              <a href="/privacy-policy" className="hover:underline" style={{ color: 'var(--brand)' }}>Privacy</a>
              <a href="/shipping-policy" className="hover:underline" style={{ color: 'var(--brand)' }}>Shipping</a>
              <a href="/return-policy" className="hover:underline" style={{ color: 'var(--brand)' }}>Returns</a>
            </div>
          </div>

          <div className="mt-6 rounded-2xl p-4 text-center text-xs" style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid var(--divider)' }}>
            <div>Research use only · Not for human consumption</div>
            <div className="mt-2">Questions? Email <a className="font-bold underline" href="mailto:info@bluelabelwholesale.com">info@bluelabelwholesale.com</a></div>
          </div>
        </div>
      </footer>
    </div>
  );
}
