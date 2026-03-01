'use client';

import React, { useState } from 'react';
import { useCart } from '@/app/cart-context';
import { track } from '@/app/Track';

export default function AddToCartButton({ product }: { product: any }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handle = () => {
    track('click_add_to_cart', { product_id: product.id, meta: { source: 'product' } });
    addToCart({ id: product.id, name: product.name, price: product.price, quantity: 1, image: product.image });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button onClick={handle} className={`w-full font-bold py-4 rounded-lg mb-4 transition text-lg ${added ? 'bg-emerald-500 text-white' : 'bg-gradient-to-r from-sky-300 to-sky-500 hover:from-sky-500 hover:to-sky-600 text-slate-900 shadow-lg'}`}>
      {added ? '✓ Added to Cart' : 'Add to Cart'}
    </button>
  );
}
