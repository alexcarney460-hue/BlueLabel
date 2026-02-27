'use client';

import { useState } from 'react';
import { useCart } from '@/app/cart-context';
import { useAccountPricing } from '@/lib/useAccountPricing';

export default function AddToCartClient({ product }: { product: any }) {
  const { addToCart } = useCart();
  const { isSignedIn, price } = useAccountPricing();
  const [added, setAdded] = useState(false);

  const handle = () => {
    const finalPrice = price(product.price);
    addToCart({ id: product.id, name: product.name, price: finalPrice, quantity: 1, image: product.image });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button
      onClick={handle}
      className={`w-full font-bold py-4 rounded-lg mb-4 transition text-lg ${
        added
          ? 'bg-emerald-500 text-white'
          : 'bg-gradient-to-r from-sky-300 to-sky-500 hover:from-sky-500 hover:to-sky-600 text-slate-900 shadow-lg'
      }`}
    >
      {added ? '✓ Added to Cart' : 'Add to Cart'}
    </button>
  );
}
