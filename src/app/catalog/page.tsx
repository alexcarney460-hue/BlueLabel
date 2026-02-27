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
      <section className="py-20 px-8 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold text-center mb-12 text-slate-900">Product Catalog</h1>
          
          <div className="grid md:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`}>
                <div className="bg-white rounded-2xl shadow-sm border border-white hover:shadow-lg transition cursor-pointer group">
                  <div className="w-full h-64 bg-slate-200 rounded-t-2xl overflow-hidden flex items-center justify-center">
                    <img src={product.image} alt={product.name} className="w-full h-full object-contain group-hover:scale-105 transition" />
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
                      <button className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded-lg transition text-sm">
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
      <footer className="bg-slate-950 text-slate-400 py-8 px-8 text-center border-t border-slate-800">
        <p>Research use only · Not for human consumption</p>
        <p className="text-sm mt-4">© 2026 BlueLabel. All rights reserved.</p>
      </footer>
    </div>
  );
}
