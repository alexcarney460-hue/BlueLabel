'use client';

import { useState } from 'react';
import Header from '@/app/Header';
import { useCart } from '@/app/cart-context';
import { useAccountPricing } from '@/lib/useAccountPricing';
import { minOrderFor } from '@/lib/wholesaleRules';

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { accountType, isSignedIn } = useAccountPricing();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [notes, setNotes] = useState('');
  const [subscribe, setSubscribe] = useState(false);
  const [frequency, setFrequency] = useState<'monthly' | '6weeks'>('monthly');

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const minTotal = isSignedIn ? minOrderFor(accountType) : 0;
  const belowMin = minTotal > 0 && subtotal < minTotal;

  const submit = async () => {
    if (belowMin) {
      alert(`Minimum order total required for your account: $${minTotal.toFixed(2)}`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: { name, email, phone },
          shipping: { address1, address2, city, state, zip },
          notes,
          subscribe,
          frequency,
          items: cart,
          subtotal,
        }),
      });
      if (!res.ok) throw new Error('order_failed');
      clearCart();
      alert('Order received. We will contact you with wholesale pricing + invoice.');
      window.location.href = '/';
    } catch {
      alert('Could not submit order. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-sans" style={{ background: 'var(--bg)' }}>
      {/* Announcement Banner (match homepage) */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-sky-500 via-sky-300 to-sky-500 text-white h-8 sm:h-auto sm:py-3 px-3 sm:px-8 text-center font-semibold overflow-hidden text-xs sm:text-base">
        <div className="max-w-6xl mx-auto h-8 sm:h-auto flex items-center justify-center whitespace-nowrap overflow-hidden text-ellipsis sm:whitespace-normal sm:overflow-visible sm:text-clip">
          Wholesale checkout — we’ll confirm pricing + invoice after you submit.
        </div>
      </div>

      {/* Header */}
      <div className="sticky top-8 sm:top-12 z-50">
        <Header />
      </div>

      <section className="pt-20 sm:pt-28 pb-16 px-4 sm:px-8" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 55%, #eef6ff 100%)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <p className="text-sm font-bold uppercase tracking-wide mb-2" style={{ color: 'var(--brand-2)' }}>Checkout</p>
            <h1 className="text-3xl sm:text-4xl font-black" style={{ color: 'var(--text)' }}>Submit your order</h1>
            <p className="mt-2" style={{ color: 'var(--muted)' }}>
              Retail customers can submit instantly. Wholesale accounts will see minimums and account pricing.
            </p>
            {isSignedIn && accountType !== 'retail' && (
              <div className="text-sm mt-3" style={{ color: 'var(--muted)' }}>Account pricing applied.</div>
            )}
          </div>

          <div className="grid lg:grid-cols-5 gap-6">
            {/* Left: Form */}
            <div className="lg:col-span-3 rounded-3xl p-5 sm:p-7" style={{ background: 'rgba(255,255,255,0.78)', border: '1px solid var(--divider)', boxShadow: 'var(--shadow-md)' }}>
              <div className="font-black mb-4" style={{ color: 'var(--text)' }}>Shipping + contact</div>

              <div className="grid gap-4">
                <div className="grid sm:grid-cols-2 gap-3">
                  <input className="border rounded-lg p-3 bg-white" style={{ borderColor: 'var(--divider)' }} placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
                  <input className="border rounded-lg p-3 bg-white" style={{ borderColor: 'var(--divider)' }} placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <input className="border rounded-lg p-3 bg-white" style={{ borderColor: 'var(--divider)' }} placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />

                <input className="border rounded-lg p-3 bg-white" style={{ borderColor: 'var(--divider)' }} placeholder="Address line 1" value={address1} onChange={(e) => setAddress1(e.target.value)} />
                <input className="border rounded-lg p-3 bg-white" style={{ borderColor: 'var(--divider)' }} placeholder="Address line 2" value={address2} onChange={(e) => setAddress2(e.target.value)} />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input className="border rounded-lg p-3 bg-white" style={{ borderColor: 'var(--divider)' }} placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
                  <input className="border rounded-lg p-3 bg-white" style={{ borderColor: 'var(--divider)' }} placeholder="State" value={state} onChange={(e) => setState(e.target.value)} />
                  <input className="border rounded-lg p-3 bg-white" style={{ borderColor: 'var(--divider)' }} placeholder="ZIP" value={zip} onChange={(e) => setZip(e.target.value)} />
                </div>

                <textarea className="border rounded-lg p-3 bg-white" style={{ borderColor: 'var(--divider)' }} placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />

                <div className="rounded-2xl p-4" style={{ border: '1px solid var(--divider)', background: 'rgba(255,255,255,0.6)' }}>
                  <label className="flex items-center gap-3 font-bold" style={{ color: 'var(--text)' }}>
                    <input type="checkbox" checked={subscribe} onChange={(e) => setSubscribe(e.target.checked)} />
                    Subscribe & Save (10%)
                  </label>
                  {subscribe && (
                    <div className="mt-3 flex gap-3">
                      <button
                        onClick={() => setFrequency('monthly')}
                        className="flex-1 border rounded-lg py-2 font-semibold"
                        style={frequency==='monthly' ? { borderColor: 'var(--brand)', background: 'rgba(14,102,179,0.08)', color: 'var(--text)' } : { borderColor: 'var(--divider)' }}
                      >
                        Monthly
                      </button>
                      <button
                        onClick={() => setFrequency('6weeks')}
                        className="flex-1 border rounded-lg py-2 font-semibold"
                        style={frequency==='6weeks' ? { borderColor: 'var(--brand)', background: 'rgba(14,102,179,0.08)', color: 'var(--text)' } : { borderColor: 'var(--divider)' }}
                      >
                        Every 6 Weeks
                      </button>
                    </div>
                  )}
                </div>

                {belowMin && (
                  <div className="rounded-2xl p-4 text-sm" style={{ border: '1px solid #fde68a', background: '#fffbeb', color: '#78350f' }}>
                    Minimum order total required for your account.
                    <div className="font-black mt-1">Minimum: ${minTotal.toFixed(2)}</div>
                    <div style={{ color: '#92400e' }}>Add more items to proceed.</div>
                  </div>
                )}

                <button
                  disabled={loading || cart.length===0 || belowMin}
                  onClick={submit}
                  className="font-black py-4 rounded-xl disabled:opacity-50 transition"
                  style={{ background: 'var(--brand)', color: 'white', boxShadow: 'var(--shadow-sm)' }}
                >
                  {loading ? 'Submitting…' : 'Submit Order'}
                </button>

                <p className="text-xs" style={{ color: 'var(--muted)' }}>
                  Note: this collects order info for wholesale quoting + invoice. Payment checkout can be added next.
                </p>
              </div>
            </div>

            {/* Right: Summary */}
            <div className="lg:col-span-2 rounded-3xl p-5 sm:p-7 h-fit" style={{ background: 'rgba(255,255,255,0.78)', border: '1px solid var(--divider)', boxShadow: 'var(--shadow-md)' }}>
              <div className="font-black mb-4" style={{ color: 'var(--text)' }}>Order summary</div>

              {cart.length === 0 ? (
                <div style={{ color: 'var(--muted)' }}>Your cart is empty.</div>
              ) : (
                <div className="space-y-3 text-sm">
                  {cart.map((i) => (
                    <div key={i.id} className="flex justify-between gap-4">
                      <div style={{ color: 'var(--text)' }}>
                        <div className="font-semibold">{i.name}</div>
                        <div style={{ color: 'var(--muted)' }}>Qty {i.quantity}</div>
                      </div>
                      <div className="font-semibold" style={{ color: 'var(--text)' }}>${(i.price * i.quantity).toFixed(2)}</div>
                    </div>
                  ))}

                  <div className="pt-4 mt-2 flex justify-between font-black" style={{ borderTop: '1px solid var(--divider)', color: 'var(--text)' }}>
                    <div>Subtotal</div>
                    <div>${subtotal.toFixed(2)}</div>
                  </div>
                </div>
              )}
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
