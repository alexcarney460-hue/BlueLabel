'use client';

import { useState } from 'react';
import { useCart } from '@/app/cart-context';

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
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

  const submit = async () => {
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
    <div className="min-h-screen bg-white px-4 sm:px-8 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-black mb-6">Checkout</h1>

        <div className="bg-slate-50 rounded-2xl p-5 sm:p-6 mb-8">
          <div className="font-bold mb-2">Order Summary</div>
          <div className="space-y-2 text-sm">
            {cart.map((i) => (
              <div key={i.id} className="flex justify-between">
                <div>{i.name} × {i.quantity}</div>
                <div className="font-semibold">${(i.price * i.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-200 mt-4 pt-4 flex justify-between font-black">
            <div>Subtotal</div>
            <div>${subtotal.toFixed(2)}</div>
          </div>
        </div>

        <div className="grid gap-4">
          <input className="border rounded-lg p-3" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="border rounded-lg p-3" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="border rounded-lg p-3" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />

          <input className="border rounded-lg p-3" placeholder="Address line 1" value={address1} onChange={(e) => setAddress1(e.target.value)} />
          <input className="border rounded-lg p-3" placeholder="Address line 2" value={address2} onChange={(e) => setAddress2(e.target.value)} />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input className="border rounded-lg p-3" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
            <input className="border rounded-lg p-3" placeholder="State" value={state} onChange={(e) => setState(e.target.value)} />
            <input className="border rounded-lg p-3" placeholder="ZIP" value={zip} onChange={(e) => setZip(e.target.value)} />
          </div>

          <textarea className="border rounded-lg p-3" placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />

          <div className="border rounded-xl p-4">
            <label className="flex items-center gap-3 font-bold">
              <input type="checkbox" checked={subscribe} onChange={(e) => setSubscribe(e.target.checked)} />
              Subscribe & Save (10%)
            </label>
            {subscribe && (
              <div className="mt-3 flex gap-3">
                <button onClick={() => setFrequency('monthly')} className={`flex-1 border rounded-lg py-2 font-semibold ${frequency==='monthly' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300'}`}>
                  Monthly
                </button>
                <button onClick={() => setFrequency('6weeks')} className={`flex-1 border rounded-lg py-2 font-semibold ${frequency==='6weeks' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300'}`}>
                  Every 6 Weeks
                </button>
              </div>
            )}
          </div>

          <button disabled={loading || cart.length===0} onClick={submit} className="bg-slate-900 text-white font-bold py-4 rounded-xl">
            {loading ? 'Submitting…' : 'Submit Order'}
          </button>

          <p className="text-xs text-slate-500">
            Note: this collects order info for wholesale quoting + invoice. Payment checkout can be added next.
          </p>
        </div>
      </div>
    </div>
  );
}
