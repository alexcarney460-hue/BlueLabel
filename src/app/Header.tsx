'use client';

import Link from 'next/link';
import { useState } from 'react';
import CartDrawer from './CartDrawer';
import { useCart } from './cart-context';

export default function Header() {
  const [open, setOpen] = useState(false);
  const { cartCount } = useCart();

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-3 sm:py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="text-2xl sm:text-3xl font-bold">
            <span className="text-slate-900">Blue</span>
            <span className="text-sky-300">Label</span>
          </Link>

          <nav className="flex flex-wrap gap-4 sm:gap-8 items-center text-xs sm:text-sm">
            <Link href="/" className="text-slate-700 hover:text-sky-600 font-bold uppercase tracking-wide transition">
              Home
            </Link>
            <Link href="/catalog" className="text-slate-700 hover:text-sky-600 font-bold uppercase tracking-wide transition">
              Catalog
            </Link>
            <Link href="/#wholesale" className="text-slate-700 hover:text-sky-600 font-bold uppercase tracking-wide transition">
              Wholesale
            </Link>
            <Link href="/#contact" className="text-slate-700 hover:text-sky-600 font-bold uppercase tracking-wide transition">
              Contact
            </Link>
          </nav>

          <div className="flex gap-4 items-center">
            <Link href="/profile" className="text-slate-700 hover:text-sky-600 font-bold uppercase tracking-wide transition text-xs sm:text-sm">
              Profile
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="relative p-2 hover:text-sky-600 transition"
              aria-label="Cart"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="absolute top-0 right-0 bg-sky-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
