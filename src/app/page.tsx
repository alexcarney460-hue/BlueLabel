'use client';

import { useState, useEffect } from 'react';
import Header from './Header';
import { useCart } from './cart-context';
import { allProducts } from '@/lib/products';
import { getMyProfile } from '@/lib/account';
import { priceForAccount } from '@/lib/pricing';

export default function Home() {
  const [ageVerified, setAgeVerified] = useState(false);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [accountType, setAccountType] = useState<'retail' | 'shop' | 'distributor'>('retail');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const { addToCart } = useCart();

  const announcements = [
    '🚀 New shipment arriving: Order by Friday for guaranteed delivery next week',
    '💎 Autoship & Save: Lock in 10% off with Subscribe & Save',
    '🔬 ISO 17025 certified. Every batch verified with serialized COAs',
  ];

  const products = allProducts;

  const productPrice = (id: string) => {
    const p = products.find((x) => x.id === id);
    const base = p?.price ?? 0;
    return isSignedIn ? priceForAccount(base, accountType) : base;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const p = await getMyProfile();
        if (p) {
          setIsSignedIn(true);
          setAccountType((p.account_type as any) ?? 'retail');
        } else {
          setIsSignedIn(false);
          setAccountType('retail');
        }
      } catch {
        setIsSignedIn(false);
        setAccountType('retail');
      }
    })();
  }, []);

  if (!ageVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center px-8" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 55%, #eef6ff 100%)' }}>
        <div className="max-w-md w-full bg-white rounded-lg p-8" style={{ boxShadow: 'var(--shadow-md)', border: '1px solid var(--divider)' }}>
          <h1 className="text-3xl font-bold text-slate-900 mb-4 text-center">Age Verification</h1>
          <p className="text-slate-600 mb-6 text-center">
            You must be at least 21 years old to enter this site.
          </p>
          <p className="text-slate-600 mb-8 text-center text-sm">
            Please confirm you are at least 21 years old.
          </p>
          
          <div className="space-y-3 mb-6">
            <button 
              onClick={() => setAgeVerified(true)}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 rounded-lg transition"
            >
              I am 21 or older
            </button>
            <a 
              href="https://www.google.com" 
              className="w-full block bg-slate-300 hover:bg-slate-400 text-slate-900 font-bold py-3 rounded-lg transition text-center"
            >
              I am under 21
            </a>
          </div>

          <p className="text-xs text-slate-500 text-center">
            By clicking "I am 21 or older", you confirm that you are at least 21 years of age and agree to our Terms of Service.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans" style={{ background: 'var(--bg)' }}>
      {/* Rotating Announcement Banner */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-sky-500 via-sky-300 to-sky-500 text-white h-8 sm:h-auto sm:py-3 px-3 sm:px-8 text-center font-semibold overflow-hidden text-xs sm:text-base">
        <div className="max-w-6xl mx-auto h-8 sm:h-auto flex items-center justify-center whitespace-nowrap overflow-hidden text-ellipsis sm:whitespace-normal sm:overflow-visible sm:text-clip sm:animate-pulse">
          {announcements[bannerIndex]}
        </div>
      </div>

      {/* Header */}
      <div className="sticky top-8 sm:top-12 z-50">
        <Header />
      </div>

      {/* Top Hero Section with Dark Gradient */}
      <section id="home" className="relative pt-20 sm:pt-28 pb-14 sm:pb-20 px-4 sm:px-8" style={{background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 55%, #e8f0fb 100%)'}}>
        
        <div className="relative max-w-6xl mx-auto z-10">
          <div className="grid md:grid-cols-2 gap-10 sm:gap-12 items-center">
            {/* Left Content */}
            <div>
              <p className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: 'var(--brand)' }}>Retail + Wholesale</p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-5 sm:mb-6" style={{ color: 'var(--text)' }}>
                Premium 7-OH Tablets
              </h1>
              <p className="text-base sm:text-xl mb-6 sm:mb-8 leading-relaxed" style={{ color: 'var(--muted)' }}>
                Built for smoke shops, distributors, and retail customers. Create an account to access wholesale pricing and streamlined reorders.
              </p>
              <div className="flex gap-3 sm:gap-4 flex-col sm:flex-row flex-wrap mb-3">
                <a href="#products" className="inline-block w-full sm:w-auto text-center px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-bold transition shadow-xl transform hover:scale-105" style={{ background: 'var(--gold)', color: 'var(--text)', boxShadow: 'var(--shadow-md)' }}>
                  Shop Retail
                </a>
                <a href="/signup" className="inline-block w-full sm:w-auto text-center px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-bold transition" style={{ border: '2px solid var(--brand)', color: 'var(--brand)', background: 'rgba(255,255,255,0.6)', boxShadow: 'var(--shadow-sm)' }}>
                  Unlock Wholesale Pricing
                </a>
              </div>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>Wholesale pricing available — sign in to view.</p>
            </div>

            {/* Right - Product Image */}
            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-sm">
                <img 
                  src="/cherry.jpg" 
                  alt="BlueLabel 7-OH Cherry Tablets" 
                  className="w-full h-auto object-contain drop-shadow-2xl relative"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-16 sm:py-24 px-4 sm:px-8" style={{background: 'linear-gradient(to bottom, #ffffff, #f1f5f9, #f8fafc)'}}>
        <div className="max-w-6xl mx-auto">
          <p className="text-sky-600 font-bold uppercase tracking-wide text-center mb-4">Our Selection</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12 text-slate-900">Premium Product Line</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {/* Product 1 - Cherry */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-white hover:shadow-lg transition cursor-pointer block">
              <a href="/product/cherry" className="block mb-4">
                <div className="w-full h-48 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                  <img src="/cherry.jpg" alt="Cherry 7-OH" className="w-full h-full object-contain bg-transparent" />
                </div>
              </a>
              <h3 className="text-sm font-bold uppercase tracking-wide text-sky-600 mb-2">Cherry</h3>
              <p className="text-slate-600 text-sm mb-2">Wholesale pricing available — contact sales for bulk quotes.</p>
              <p className="text-slate-600 text-sm mb-3">Premium cherry-flavored 7-OH tablets. 20mg per unit, 2 containers of 10.</p>
              <div className="text-sm mb-4">
                <div className="font-black text-slate-900">${productPrice('cherry').toFixed(2)}</div>
                <div className="text-slate-600">Retail price{isSignedIn && accountType !== 'retail' ? ' (your account pricing applied)' : ''}</div>
                {!isSignedIn && <div className="text-slate-500">Wholesale pricing available — sign in to view.</div>}
              </div>
              <button onClick={() => { addToCart({id: 'cherry', name: 'Cherry 7-OH', price: productPrice('cherry'), quantity: 1, image: '/cherry.jpg'}); import('./Track').then(m => m.track('click_add_to_cart', { product_id: 'cherry' })); }} className="w-full font-bold py-3 rounded-lg transition text-sm" style={{ background: 'var(--brand)', color: 'white' }}>
                Add to Cart
              </button>
            </div>

            {/* Product 2 - Mix Berry */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-white hover:shadow-lg transition cursor-pointer block">
              <a href="/product/mix-berry" className="block mb-4">
                <div className="w-full h-48 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                  <img src="/mixberry.jpg" alt="Mix Berry 7-OH" className="w-full h-full object-contain bg-transparent" />
                </div>
              </a>
              <h3 className="text-sm font-bold uppercase tracking-wide text-sky-600 mb-2">Mix Berry</h3>
              <p className="text-slate-600 text-sm mb-2">Wholesale pricing available — contact sales for bulk quotes.</p>
              <p className="text-slate-600 text-sm mb-3">Enhanced berry blend 7-OH tablets. 20mg per unit, 2 containers of 10.</p>
              <div className="text-sm mb-4">
                <div className="font-black text-slate-900">${productPrice('mix-berry').toFixed(2)}</div>
                <div className="text-slate-600">Retail price{isSignedIn && accountType !== 'retail' ? ' (your account pricing applied)' : ''}</div>
                {!isSignedIn && <div className="text-slate-500">Wholesale pricing available — sign in to view.</div>}
              </div>
              <button onClick={() => addToCart({id: 'mix-berry', name: 'Mix Berry 7-OH', price: productPrice('mix-berry'), quantity: 1, image: '/mixberry.jpg'})} className="w-full font-bold py-3 rounded-lg transition text-sm" style={{ background: 'var(--brand)', color: 'white' }}>
                Add to Cart
              </button>
            </div>

            {/* Product 3 - Strawberry */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-white hover:shadow-lg transition cursor-pointer block">
              <a href="/product/strawberry" className="block mb-4">
                <div className="w-full h-48 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                  <img src="/strawberry.jpg" alt="Strawberry 7-OH" className="w-full h-full object-contain bg-transparent" />
                </div>
              </a>
              <h3 className="text-sm font-bold uppercase tracking-wide text-sky-600 mb-2">Strawberry</h3>
              <p className="text-slate-600 text-sm mb-2">Wholesale pricing available — contact sales for bulk quotes.</p>
              <p className="text-slate-600 text-sm mb-3">Premium strawberry-flavored 7-OH tablets. 20mg per unit, 2 containers of 10.</p>
              <div className="text-sm mb-4">
                <div className="font-black text-slate-900">${productPrice('strawberry').toFixed(2)}</div>
                <div className="text-slate-600">Retail price{isSignedIn && accountType !== 'retail' ? ' (your account pricing applied)' : ''}</div>
                {!isSignedIn && <div className="text-slate-500">Wholesale pricing available — sign in to view.</div>}
              </div>
              <button onClick={() => addToCart({id: 'strawberry', name: 'Strawberry 7-OH', price: productPrice('strawberry'), quantity: 1, image: '/strawberry.jpg'})} className="w-full font-bold py-3 rounded-lg transition text-sm" style={{ background: 'var(--brand)', color: 'white' }}>
                Add to Cart
              </button>
            </div>

            {/* Product 4 - Watermelon */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-white hover:shadow-lg transition cursor-pointer block">
              <a href="/product/watermelon" className="block mb-4">
                <div className="w-full h-48 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                  <img src="/watermelon.jpg" alt="Watermelon 7-OH" className="w-full h-full object-contain bg-transparent" />
                </div>
              </a>
              <h3 className="text-sm font-bold uppercase tracking-wide text-sky-600 mb-2">Watermelon</h3>
              <p className="text-slate-600 text-sm mb-2">Wholesale pricing available — contact sales for bulk quotes.</p>
              <p className="text-slate-600 text-sm mb-3">Premium watermelon-flavored 7-OH tablets. 20mg per unit, 2 containers of 10.</p>
              <div className="text-sm mb-4">
                <div className="font-black text-slate-900">${productPrice('watermelon').toFixed(2)}</div>
                <div className="text-slate-600">Retail price{isSignedIn && accountType !== 'retail' ? ' (your account pricing applied)' : ''}</div>
                {!isSignedIn && <div className="text-slate-500">Wholesale pricing available — sign in to view.</div>}
              </div>
              <button onClick={() => addToCart({id: 'watermelon', name: 'Watermelon 7-OH', price: productPrice('watermelon'), quantity: 1, image: '/watermelon.jpg'})} className="w-full font-bold py-3 rounded-lg transition text-sm" style={{ background: 'var(--brand)', color: 'white' }}>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Retail + Wholesale Program */}
      <section className="relative py-24 px-8" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 55%, #eef6ff 100%)' }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <p className="font-bold uppercase tracking-wide mb-4" style={{ color: 'var(--brand-2)' }}>Wholesale Program</p>
            <h2 className="text-4xl font-bold mb-6" style={{ color: 'var(--text)' }}>Unlock account pricing + faster reorders</h2>
            <p className="mb-6" style={{ color: 'var(--muted)' }}>
              Create an account to access wholesale pricing and an easier reorder flow. Retail customers can continue shopping instantly—no hoops.
            </p>
            <ul className="space-y-3 mb-8" style={{ color: 'var(--muted)' }}>
              <li>• Retail + wholesale in one catalog</li>
              <li>• Account-based pricing</li>
              <li>• Simple reordering</li>
            </ul>
          </div>
          <div className="rounded-3xl p-8" style={{ background: 'rgba(255,255,255,0.78)', border: '1px solid var(--divider)', boxShadow: 'var(--shadow-md)' }}>
            <p className="font-bold uppercase tracking-wide mb-4" style={{ color: 'var(--brand-2)' }}>Get started</p>
            <ol className="space-y-3 mb-6 text-sm" style={{ color: 'var(--muted)' }}>
              <li>1. Create an account.</li>
              <li>2. Select Retail / Smoke shop / Distributor.</li>
              <li>3. Sign in to view your pricing.</li>
            </ol>
            <div className="flex gap-3 flex-wrap">
              <a
                href="/signup"
                className="inline-block px-6 py-3 rounded-full font-bold transition shadow-sm"
                style={{ background: 'var(--brand)', color: 'white' }}
              >
                Create account
              </a>
              <a
                href="/login"
                className="inline-block px-6 py-3 rounded-full font-bold transition"
                style={{ border: '1px solid var(--divider)', color: 'var(--text)', background: 'rgba(255,255,255,0.6)' }}
              >
                Sign in
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose BlueLabel */}
      <section className="py-24 px-8 bg-slate-50 border-y border-slate-200">
        <div className="max-w-6xl mx-auto">
          <p className="text-sky-600 font-bold uppercase tracking-wide text-center mb-4">Why BlueLabel?</p>
          <h2 className="text-4xl font-bold text-center mb-12 text-slate-900">Consistent quality. Reliable supply.</h2>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
            We focus on consistency—clean specs, dependable inventory, and clear documentation. Built for wholesale buyers and retail customers who want a straightforward experience.
          </p>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-white hover:shadow-md transition">
              <div className="h-10 w-10 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-bold mb-3">✓</div>
              <h3 className="font-bold text-slate-900 mb-2">Unmatched Quality</h3>
              <p className="text-slate-600 text-sm">Lab-verified purity confirmed via HPLC + MS.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-white hover:shadow-md transition">
              <div className="h-10 w-10 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-bold mb-3">✓</div>
              <h3 className="font-bold text-slate-900 mb-2">Innovative Solutions</h3>
              <p className="text-slate-600 text-sm">Tablets engineered for research and wholesale.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-white hover:shadow-md transition">
              <div className="h-10 w-10 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-bold mb-3">✓</div>
              <h3 className="font-bold text-slate-900 mb-2">Comprehensive Selection</h3>
              <p className="text-slate-600 text-sm">Multiple potencies and bulk options in stock.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-white hover:shadow-md transition">
              <div className="h-10 w-10 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-bold mb-3">✓</div>
              <h3 className="font-bold text-slate-900 mb-2">Reliable Results</h3>
              <p className="text-slate-600 text-sm">Serialized COAs stored with your order history.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Fulfillment + Operations */}
      <section className="py-24 px-8 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sky-600 font-bold uppercase tracking-wide mb-4">Operations</p>
            <h2 className="text-4xl font-bold mb-6 text-slate-900">Fast fulfillment. Clear process.</h2>
            <p className="text-slate-600 mb-8">
              Our focus is simple: consistent product, predictable fulfillment, and a clean reorder experience. If you’re buying for a shop or distribution, you’ll get the same reliability you expect from a real wholesale partner.
            </p>
            
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold mt-0.5 flex-shrink-0">✓</div>
                <div>
                  <h3 className="font-bold text-slate-900">Ultrasonic Cleaning</h3>
                  <p className="text-slate-600 text-sm">Automated 360° cleaning removes all contaminants.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold mt-0.5 flex-shrink-0">✓</div>
                <div>
                  <h3 className="font-bold text-slate-900">Class 100 Laminar Flow</h3>
                  <p className="text-slate-600 text-sm">HEPA-filtered sterilization for maximum safety.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold mt-0.5 flex-shrink-0">✓</div>
                <div>
                  <h3 className="font-bold text-slate-900">Precision Encapsulation</h3>
                  <p className="text-slate-600 text-sm">Exact dosage accuracy for every tablet.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative aspect-square rounded-3xl overflow-hidden border border-slate-300">
            <img src="/cherry.jpg" alt="BlueLabel Cherry" className="w-full h-full object-contain" />
          </div>
        </div>
      </section>

      {/* Wholesale */}
      <section id="wholesale" className="bg-slate-50 py-24 px-8 border-y border-slate-200">
        <div className="max-w-6xl mx-auto">
          <p className="text-sky-600 font-bold uppercase tracking-wide text-center mb-4">Wholesale</p>
          <h2 className="text-4xl font-bold text-center mb-8 text-slate-900">Wholesale pricing for shops & distributors</h2>
          <p className="text-center text-slate-600 max-w-2xl mx-auto mb-10">
            Create an account and sign in to view account pricing. Retail customers can purchase immediately.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="text-xs text-sky-700 font-black uppercase tracking-wide">Step 1</div>
              <div className="font-black text-slate-900 mt-1">Create an account</div>
              <div className="text-sm text-slate-600 mt-2">Choose Retail, Smoke shop, or Distributor.</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="text-xs text-sky-700 font-black uppercase tracking-wide">Step 2</div>
              <div className="font-black text-slate-900 mt-1">Sign in</div>
              <div className="text-sm text-slate-600 mt-2">Your pricing displays across the site automatically.</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="text-xs text-sky-700 font-black uppercase tracking-wide">Step 3</div>
              <div className="font-black text-slate-900 mt-1">Place your order</div>
              <div className="text-sm text-slate-600 mt-2">Minimum order totals apply for wholesale accounts.</div>
            </div>
          </div>

          <div className="flex gap-3 justify-center flex-wrap">
            <a href="/signup" className="inline-block px-8 py-3 rounded-full font-black transition" style={{ background: 'var(--brand)', color: 'white' }}>
              Create account
            </a>
            <a href="/login" className="inline-block px-8 py-3 rounded-full font-black transition" style={{ border: '1px solid var(--divider)', color: 'var(--text)', background: 'rgba(255,255,255,0.6)' }}>
              Sign in
            </a>
            <a href="mailto:info@bluelabelwholesale.com" className="inline-block px-8 py-3 rounded-full font-black transition" style={{ border: '1px solid var(--brand)', color: 'var(--brand)', background: 'rgba(255,255,255,0.6)' }}>
              Contact sales
            </a>
          </div>
        </div>
      </section>

      {/* Bottom Hero / CTA Section */}
      <section
        id="contact"
        className="relative py-28 sm:py-32 px-4 sm:px-8"
        style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 55%, #eef6ff 100%)' }}
      >
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl font-black mb-6" style={{ color: 'var(--text)' }}>
            Ready to Get Started?
          </h2>
          <p className="text-lg sm:text-xl mb-10 max-w-2xl mx-auto" style={{ color: 'var(--muted)' }}>
            Shop retail instantly or create an account to access wholesale pricing. Contact us for bulk orders and partnership opportunities.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="mailto:info@bluelabelwholesale.com"
              className="inline-block px-10 py-4 rounded-full font-bold transition shadow-xl transform hover:scale-105 text-lg"
              style={{ background: 'linear-gradient(90deg, var(--brand-2), var(--brand))', color: 'white' }}
            >
              Contact Sales
            </a>
            <a
              href="#products"
              className="inline-block px-10 py-4 rounded-full font-bold transition text-lg"
              style={{ border: '1px solid var(--divider)', color: 'var(--text)', background: 'rgba(255,255,255,0.6)' }}
            >
              View Products
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: 'var(--bg)', color: 'var(--muted)', borderTop: '1px solid var(--divider)' }} className="py-8 px-8 text-center">
        <p>© 2026 BlueLabel. All rights reserved.</p>
      </footer>
    </div>
  );
}
