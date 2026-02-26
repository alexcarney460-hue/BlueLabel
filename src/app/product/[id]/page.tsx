'use client';

import Link from 'next/link';
import { useState } from 'react';
import { addToCart } from '@/lib/cart';

const products: { [key: string]: any } = {
  'cherry': {
    id: 'cherry',
    name: 'Cherry 7-OH',
    image: '/cherry.jpg',
    purity: '≥98%',
    dosage: '20mg per unit',
    price: 29.99,
    description: 'Premium cherry-flavored 7-OH tablets crafted for research use.',
    details: [
      'Lab-verified ≥98% purity',
      '20mg per tablet',
      '2 containers of 10 tablets',
      'HPLC & GC-MS tested',
      'Certificate of Analysis included'
    ]
  },
  'mix-berry': {
    id: 'mix-berry',
    name: 'Mix Berry 7-OH',
    image: '/mixberry.jpg',
    purity: '≥98%',
    dosage: '20mg per unit',
    price: 32.99,
    description: 'Enhanced berry blend 7-OH tablets optimized for research applications.',
    details: [
      'Lab-verified ≥98% purity',
      '20mg per tablet',
      '2 containers of 10 tablets',
      'Advanced alkaloid blend',
      'Serialized COA included'
    ]
  },
  'strawberry': {
    id: 'strawberry',
    name: 'Strawberry 7-OH',
    image: '/strawberry.jpg',
    purity: '≥98%',
    dosage: '20mg per unit',
    price: 29.99,
    description: 'Lab-verified strawberry-flavored 7-OH tablets for research.',
    details: [
      'Lab-verified ≥98% purity',
      '20mg per tablet',
      '2 containers of 10 tablets',
      'HPLC & GC-MS tested',
      'Chain-of-custody documentation'
    ]
  },
  'watermelon': {
    id: 'watermelon',
    name: 'Watermelon 7-OH',
    image: '/watermelon.jpg',
    purity: '≥98%',
    dosage: '20mg per unit',
    price: 31.99,
    description: 'Premium watermelon-flavored 7-OH tablets with comprehensive verification.',
    details: [
      'Lab-verified ≥98% purity',
      '20mg per tablet',
      '2 containers of 10 tablets',
      'Microbial analysis included',
      'ISO 17025 certified testing'
    ]
  }
};

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = products[params.id];
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [isSubscription, setIsSubscription] = useState(false);
  const [frequency, setFrequency] = useState('monthly');

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <Link href="/" className="text-amber-600 hover:underline">Back to Home</Link>
        </div>
      </div>
    );
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
        <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-3xl font-bold">
            <span className="text-slate-900">Blue</span><span className="text-amber-400">Label</span>
          </Link>
          <nav className="flex gap-8 items-center">
            <Link href="/" className="text-slate-700 hover:text-amber-600 font-bold text-sm uppercase tracking-wide transition">Home</Link>
            <Link href="/#products" className="text-slate-700 hover:text-amber-600 font-bold text-sm uppercase tracking-wide transition">Products</Link>
            <Link href="/#wholesale" className="text-slate-700 hover:text-amber-600 font-bold text-sm uppercase tracking-wide transition">Wholesale</Link>
            <Link href="/#contact" className="text-slate-700 hover:text-amber-600 font-bold text-sm uppercase tracking-wide transition">Contact</Link>
          </nav>
        </div>
      </header>

      {/* Product Details */}
      <section className="py-20 px-8">
        <div className="max-w-6xl mx-auto">
          <Link href="/#products" className="text-amber-600 hover:underline mb-8 inline-block font-bold">← Back to Products</Link>
          
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Product Image */}
            <div className="flex items-center justify-center">
              <div className="w-full max-w-sm h-96 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl overflow-hidden flex items-center justify-center shadow-lg">
                <img src={product.image} alt={product.name} className="w-full h-full object-contain p-8" />
              </div>
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-5xl font-bold mb-2 text-slate-900">{product.name}</h1>
              <p className="text-amber-600 text-sm font-bold uppercase mb-6">Research Grade</p>
              
              <div className="mb-8">
                <p className={`text-4xl font-black ${isSubscription ? 'text-emerald-600' : 'text-slate-900'}`}>
                  ${isSubscription ? subscriptionPrice.toFixed(2) : product.price.toFixed(2)}
                </p>
                {isSubscription && (
                  <p className="text-sm text-emerald-600 font-bold">Save 10% with subscription</p>
                )}
              </div>
              
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">{product.description}</p>
              
              {/* Specs */}
              <div className="mb-8 space-y-3 bg-slate-50 p-6 rounded-lg">
                <div className="flex justify-between">
                  <span className="font-bold text-slate-900">Purity:</span>
                  <span className="text-slate-700 font-semibold">{product.purity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-slate-900">Dosage:</span>
                  <span className="text-slate-700 font-semibold">{product.dosage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-slate-900">Format:</span>
                  <span className="text-slate-700 font-semibold">2x10 Tablet Containers</span>
                </div>
              </div>

              {/* Purchase Type */}
              <div className="mb-8 space-y-3">
                <label className="block font-bold text-slate-900">Purchase Type</label>
                <div className="flex gap-4">
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
                  <div className="flex gap-4">
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
                    className="w-14 h-10 text-center font-bold border-2 border-slate-300 rounded-lg focus:outline-none focus:border-amber-600"
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
