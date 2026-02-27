'use client';

import { useState } from 'react';
import { useCart } from '@/app/cart-context';
import { useAccountPricing } from '@/lib/useAccountPricing';
import { subscribeAndSavePrice } from '@/lib/pricing';

export default function AddToCartClient({ product }: { product: any }) {
  const { addToCart } = useCart();
  const { isSignedIn, price } = useAccountPricing();
  const [added, setAdded] = useState(false);
  const [subscribe, setSubscribe] = useState(false);

  const baseDisplay = isSignedIn ? price(product.price) : product.price;
  const finalDisplay = subscribeAndSavePrice(baseDisplay, subscribe, 0.1);
  const savings = Math.max(0, baseDisplay - finalDisplay);

  const handle = () => {
    const accountPrice = price(product.price);
    const finalPrice = subscribeAndSavePrice(accountPrice, subscribe, 0.1);
    addToCart({ id: product.id, name: product.name, price: finalPrice, quantity: 1, image: product.image });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="mb-6">
      <div
        className="rounded-2xl p-4 mb-4"
        style={{ border: '1px solid var(--divider)', background: 'rgba(255,255,255,0.6)' }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-black" style={{ color: 'var(--text)' }}>
              Subscribe & Save <span style={{ color: 'var(--brand-2)' }}>10%</span>
            </div>
            <div className="text-sm" style={{ color: 'var(--muted)' }}>
              Turn on autoship for instant savings.
            </div>
          </div>
          <label className="flex items-center gap-2 font-bold" style={{ color: 'var(--text)' }}>
            <input type="checkbox" checked={subscribe} onChange={(e) => setSubscribe(e.target.checked)} />
            On
          </label>
        </div>

        <div className="mt-3 text-sm" style={{ color: 'var(--muted)' }}>
          Price today:{' '}
          <span className="font-black" style={{ color: 'var(--text)' }}>${finalDisplay.toFixed(2)}</span>
          {subscribe && (
            <span style={{ color: 'var(--muted)' }}> · You save ${savings.toFixed(2)}</span>
          )}
        </div>
      </div>

      <button
        onClick={handle}
        className={`w-full font-bold py-4 rounded-lg transition text-lg ${
          added
            ? 'bg-emerald-500 text-white'
            : 'bg-gradient-to-r from-sky-300 to-sky-500 hover:from-sky-500 hover:to-sky-600 text-slate-900 shadow-lg'
        }`}
      >
        {added ? '✓ Added to Cart' : 'Add to Cart'}
      </button>

      <div className="text-xs mt-2" style={{ color: 'var(--muted)' }}>
        {subscribe ? 'Autoship selected — final pricing stored in cart.' : 'Tip: enable Subscribe & Save for immediate discount.'}
      </div>
    </div>
  );
}
