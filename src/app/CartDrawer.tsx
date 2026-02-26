'use client';

import { useMemo } from 'react';
import { useCart } from './cart-context';

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();

  const subtotal = useMemo(() => cart.reduce((s, i) => s + i.price * i.quantity, 0), [cart]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/40 transition-opacity ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm z-[70] bg-white shadow-2xl border-l border-slate-200 transform transition-transform ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-label="Shopping cart"
      >
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Cart</h2>
          <button onClick={onClose} className="text-slate-600 hover:text-slate-900 font-bold px-2 py-1">✕</button>
        </div>

        <div className="p-4 space-y-4 overflow-auto h-[calc(100%-180px)]">
          {cart.length === 0 ? (
            <div className="text-slate-600">Your cart is empty.</div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-3 border border-slate-200 rounded-xl p-3">
                <div className="w-16 h-16 rounded-lg overflow-hidden flex items-center justify-center bg-slate-50">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-slate-900 text-sm">{item.name}</div>
                  <div className="text-slate-600 text-sm">${item.price.toFixed(2)}</div>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="w-8 h-8 border border-slate-300 rounded-lg font-bold"
                    >
                      −
                    </button>
                    <div className="w-10 text-center font-bold">{item.quantity}</div>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 border border-slate-300 rounded-lg font-bold"
                    >
                      +
                    </button>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="ml-auto text-amber-700 hover:text-amber-900 font-bold text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="text-slate-700 font-semibold">Subtotal</div>
            <div className="text-slate-900 font-black">${subtotal.toFixed(2)}</div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={clearCart}
              className="flex-1 border border-slate-300 text-slate-700 font-bold py-3 rounded-xl"
              disabled={cart.length === 0}
            >
              Clear
            </button>
            <button
              className="flex-1 bg-slate-900 text-white font-bold py-3 rounded-xl"
              disabled={cart.length === 0}
              onClick={() => alert('Checkout not wired yet.')}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
