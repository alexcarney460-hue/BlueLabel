'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/app/cart-context';
import { getProductById, normalizeProductId } from '@/lib/products';

export default function ProductPage({ params }: { params: { id: string } }) {
  const rawId = params?.id ?? '';
  const normalizedId = normalizeProductId(rawId);
  const product = getProductById(normalizedId);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [isSubscription, setIsSubscription] = useState(false);
  const [frequency, setFrequency] = useState('monthly');
  const { addToCart, cartCount } = useCart();

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <p className="mb-4">If you followed a link, please try the catalog or contact support.</p>
          <Link href="/catalog" className="text-amber-600 hover:underline">Back to Catalog</Link>
        </div>
      </div>
    );
  }

  if (normalizedId && normalizedId !== rawId && typeof window !== 'undefined') {
    window.location.replace(`/product/${normalizedId}`);
  }

  const subscriptionDiscount = 0.10;
  const subscriptionPrice = product.price * (1 - subscriptionDiscount);

  const handleAddToCart = () => {
    addToCart({
      id: isSubscription ? `${product.id}-sub-${frequency}` : product.id,
      name: isSubscription ? `${product.name} (${frequency === 'monthly' ? 'Monthly' : 'Every 6 Weeks'} Subscription)` : product.name,
      price: isSubscription ? subscriptionPrice : product.price,
      quantity,
      image: product.image
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-3 sm:py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="text-2xl sm:text-3xl font-bold">
            <span className="text-slate-900">Blue</span><span className="text-amber-400">Label</span>
          </Link>
          <nav className="flex flex-wrap gap-4 sm:gap-8 items-center text-xs sm:text-sm">
            <Link href="/" className="text-slate-700 hover:text-amber-600 font-bold uppercase tracking-wide transition">Home</Link>
            <Link href="/#products" className="text-slate-700 hover:text-amber-600 font-bold uppercase tracking-wide transition">Products</Link>
            <Link href="/#wholesale" className="text-slate-700 hover:text-amber-600 font-bold uppercase tracking-wide transition">Wholesale</Link>
            <Link href="/#contact" className="text-slate-700 hover:text-amber-600 font-bold uppercase tracking-wide transition">Contact</Link>
          </nav>
          <div className="flex gap-4 items-center">
            <button className="relative p-2 hover:text-amber-600 transition" aria-label="Cart">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="absolute top-0 right-0 bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{cartCount}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Product Details */}
      <section className="py-16 sm:py-20 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <Link href="/#products" className="text-amber-600 hover:underline mb-8 inline-block font-bold">← Back to Products</Link>
          
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
            {/* Product Image */}
            <div className="flex items-center justify-center">
              <div className="w-full max-w-xs sm:max-w-sm h-80 sm:h-96 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl overflow-hidden flex items-center justify-center shadow-lg">
                <img src={product.image} alt={product.name} className="w-full h-full object-contain p-6 sm:p-8" />
              </div>
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 text-slate-900">{product.name}</h1>
              <p className="text-amber-600 text-sm font-bold uppercase mb-6">Research Grade</p>
              
              <div className="mb-8">
                <p className={`text-3xl sm:text-4xl font-black ${isSubscription ? 'text-emerald-600' : 'text-slate-900'}`}>
                  ${isSubscription ? subscriptionPrice.toFixed(2) : product.price.toFixed(2)}
                </p>
                {isSubscription && (
                  <p className="text-sm text-emerald-600 font-bold">Save 10% with subscription</p>
                )}
              </div>
              
              <p className="text-base sm:text-lg text-slate-600 mb-8 leading-relaxed">{product.description}</p>
              
              {/* Specs */}
              <div className="mb-8 space-y-3 bg-slate-50 p-5 sm:p-6 rounded-lg text-sm sm:text-base">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="font-bold text-slate-900">Wholesale:</span>
                  <span className="text-slate-700 font-semibold">Wholesale pricing available — contact sales for bulk quotes.</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="font-bold text-slate-900">Dosage:</span>
                  <span className="text-slate-700 font-semibold">{product.dosage}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="font-bold text-slate-900">Format:</span>
                  <span className="text-slate-700 font-semibold">2x10 Tablet Containers</span>
                </div>
              </div>

              {/* Purchase Type */}
              <div className="mb-8 space-y-3">
                <label className="block font-bold text-slate-900">Purchase Type</label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => setIsSubscription(false)}
                    className={`flex-1 py-3 px-4 rounded-lg border-2 font-bold transition ${
                      !isSubscription
                        ? 'border-amber-500 bg-amber-50 text-amber-900'
                        : 'border-slate-300 text-slate-600 hover:border-slate-400'
                    }`}
                  >
                    One-Time
                  </button>
                  <button
                    onClick={() => setIsSubscription(true)}
                    className={`flex-1 py-3 px-4 rounded-lg border-2 font-bold transition ${
                      isSubscription
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                        : 'border-slate-300 text-slate-600 hover:border-slate-400'
                    }`}
                  >
                    Subscribe & Save 10%
                  </button>
                </div>
              </div>

              {/* Subscription Frequency */}
              {isSubscription && (
                <div className="mb-8">
                  <label className="block font-bold text-slate-900 mb-3">Frequency</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => setFrequency('monthly')}
                      className={`flex-1 py-2 px-4 rounded-lg border-2 font-semibold transition ${
                        frequency === 'monthly'
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                          : 'border-slate-300 text-slate-600 hover:border-slate-400'
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => setFrequency('6weeks')}
                      className={`flex-1 py-2 px-4 rounded-lg border-2 font-semibold transition ${
                        frequency === '6weeks'
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                          : 'border-slate-300 text-slate-600 hover:border-slate-400'
                      }`}
                    >
                      Every 6 Weeks
                    </button>
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <label className="block font-bold text-slate-900 mb-3">Qty</label>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border-2 border-slate-300 rounded-lg hover:border-amber-600 transition font-bold"
                  >
                    −
                  </button>
                  <input 
                    type="number" 
                    value={quantity} 
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 h-10 text-center font-bold border-2 border-slate-300 rounded-lg focus:outline-none focus:border-amber-600"
                  />
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 border-2 border-slate-300 rounded-lg hover:border-amber-600 transition font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <button 
                onClick={handleAddToCart}
                className={`w-full font-bold py-4 rounded-lg mb-4 transition text-lg ${
                  added
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-900 shadow-lg'
                }`}
              >
                {added ? '✓ Added to Cart' : 'Add to Cart'}
              </button>

              {/* Details */}
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

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-8 px-8 text-center border-t border-slate-800">
        <p>Research use only · Not for human consumption</p>
        <p className="text-sm mt-4">© 2026 BlueLabel. All rights reserved.</p>
      </footer>
    </div>
  );
}
