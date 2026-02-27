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
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-8">
        <div className="max-w-md w-full bg-white rounded-lg shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-4 text-center">Age Verification</h1>
          <p className="text-slate-600 mb-6 text-center">
            You must be at least 21 years old to enter this site.
          </p>
          <p className="text-slate-600 mb-8 text-center text-sm">
            This product is for research use only. Not for human consumption.
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
    <div className="bg-white min-h-screen font-sans">
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
      <section id="home" className="relative pt-20 sm:pt-28 pb-14 sm:pb-20 px-4 sm:px-8" style={{background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'}}>
        
        <div className="relative max-w-6xl mx-auto z-10">
          <div className="grid md:grid-cols-2 gap-10 sm:gap-12 items-center">
            {/* Left Content */}
            <div>
              <p className="text-sm text-sky-200 font-bold uppercase tracking-wide mb-4">Premium Research Grade</p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-5 sm:mb-6 text-white drop-shadow-lg">
                Research-grade 7-OH Tablets
              </h1>
              <p className="text-base sm:text-xl text-slate-100 mb-6 sm:mb-8 leading-relaxed">
                Research-grade 7-OH tablets with verified COAs. Lab-tested, pharmaceutical-grade tablets for wholesale distribution and research use.
              </p>
              <div className="flex gap-3 sm:gap-4 flex-col sm:flex-row flex-wrap mb-6">
                <a href="#products" className="inline-block w-full sm:w-auto text-center bg-gradient-to-r from-sky-300 to-sky-500 hover:from-sky-500 hover:to-sky-600 text-slate-900 px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-bold transition shadow-xl transform hover:scale-105">
                  Shop Now
                </a>
                <a href="#wholesale" className="inline-block w-full sm:w-auto text-center border-2 border-sky-200 text-sky-200 hover:bg-white/10 px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-bold transition backdrop-blur-sm">
                  Wholesale
                </a>
              </div>
              <p className="text-sm text-slate-200">For research use only. Not for human consumption.</p>
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
              <button onClick={() => { addToCart({id: 'cherry', name: 'Cherry 7-OH', price: productPrice('cherry'), quantity: 1, image: '/cherry.jpg'}); import('./Track').then(m => m.track('click_add_to_cart', { product_id: 'cherry' })); }} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-lg transition text-sm">
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
              <button onClick={() => addToCart({id: 'mix-berry', name: 'Mix Berry 7-OH', price: productPrice('mix-berry'), quantity: 1, image: '/mixberry.jpg'})} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-lg transition text-sm">
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
              <button onClick={() => addToCart({id: 'strawberry', name: 'Strawberry 7-OH', price: productPrice('strawberry'), quantity: 1, image: '/strawberry.jpg'})} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-lg transition text-sm">
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
              <button onClick={() => addToCart({id: 'watermelon', name: 'Watermelon 7-OH', price: productPrice('watermelon'), quantity: 1, image: '/watermelon.jpg'})} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-lg transition text-sm">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Autoship Program */}
      <section className="relative bg-slate-900 text-white py-24 px-8" style={{background: 'linear-gradient(to right, #0f172a, #1e293b, #0f172a)'}}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <p className="text-sky-200 font-bold uppercase tracking-wide mb-4">Autoship Program</p>
            <h2 className="text-4xl font-bold mb-6">Lock in 10% off with Subscribe & Save</h2>
            <p className="text-slate-300 mb-6">
              Researchers who rely on the same compounds month over month can schedule automatic resupply every 30 days. Pause or cancel anytime inside your account—no hidden fees, just guaranteed inventory and loyalty pricing.
            </p>
            <ul className="space-y-3 text-slate-300 mb-8">
              <li>• 10% discount on every recurring shipment</li>
              <li>• Priority pull from fresh COA lots</li>
              <li>• Automated cold-chain packaging with tracking</li>
            </ul>
          </div>
          <div className="bg-slate-800 rounded-3xl border border-sky-200/30 p-8 shadow-xl">
            <p className="text-sky-200 font-bold uppercase tracking-wide mb-4">How it works</p>
            <ol className="space-y-3 text-slate-300 mb-6 text-sm">
              <li>1. Select "Autoship & Save 10%" on any product.</li>
              <li>2. Choose your tablet quantity. Discount applies instantly.</li>
              <li>3. Manage renewals from your dashboard in two clicks.</li>
            </ol>
            <a href="#" className="inline-block bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-full font-bold transition">
              Browse eligible products
            </a>
          </div>
        </div>
      </section>

      {/* Why Choose BlueLabel */}
      <section className="py-24 px-8 bg-slate-50 border-y border-slate-200">
        <div className="max-w-6xl mx-auto">
          <p className="text-sky-600 font-bold uppercase tracking-wide text-center mb-4">Why BlueLabel?</p>
          <h2 className="text-4xl font-bold text-center mb-12 text-slate-900">Trusted science. Verified batches.</h2>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
            Every tablet that leaves our facility is backed by ISO 17025 partner labs, in-house sterility logs, and serialized labels for full chain-of-custody. Researchers choose BlueLabel for consistent purity and transparent documentation.
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

      {/* Advanced Manufacturing */}
      <section className="py-24 px-8 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sky-600 font-bold uppercase tracking-wide mb-4">Advanced Manufacturing</p>
            <h2 className="text-4xl font-bold mb-6 text-slate-900">Sterile. Precise. Automated.</h2>
            <p className="text-slate-600 mb-8">
              We don't just resell—we manufacture. Our state-of-the-art facility utilizes a fully automated tablet processing line equipped with ultrasonic cleaning, Class 100 laminar air flow, and precision encapsulation to ensure medical-grade sterility and dosage accuracy.
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
            <img src="/cherry.png" alt="BlueLabel Cherry" className="w-full h-full object-contain" />
          </div>
        </div>
      </section>

      {/* Wholesale & White Label */}
      <section id="wholesale" className="bg-slate-50 py-24 px-8 border-y border-slate-200">
        <div className="max-w-6xl mx-auto">
          <p className="text-sky-600 font-bold uppercase tracking-wide text-center mb-4">Wholesale Solutions</p>
          <h2 className="text-4xl font-bold text-center mb-8 text-slate-900">Wholesale & White Label Solutions</h2>
          <p className="text-center text-slate-600 max-w-2xl mx-auto mb-12">
            Scale your brand with our premium manufacturing capabilities. We offer competitive bulk pricing and fully custom white-label packaging for qualified partners.
          </p>
          <p className="text-center text-slate-600 text-sm">
            Minimum Order Quantities apply. ISO 17025 testing included with all bulk orders.
          </p>
        </div>
      </section>

      {/* Bottom Hero / CTA Section */}
      <section id="contact" className="relative py-32 px-8" style={{background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'}}>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h2 className="text-5xl font-bold mb-6 text-white">Ready to Get Started?</h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Join researchers and distributors worldwide who trust BlueLabel for premium 7-OH tablets. Contact us for wholesale inquiries, sample orders, or partnership opportunities.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="mailto:info@bluelabelwholesale.com" className="inline-block bg-gradient-to-r from-sky-300 to-sky-500 hover:from-sky-500 hover:to-sky-600 text-white px-10 py-4 rounded-full font-bold transition shadow-xl transform hover:scale-105 text-lg">
              Contact Sales
            </a>
            <a href="#products" className="inline-block border-2 border-sky-300 text-sky-200 hover:bg-white/10 px-10 py-4 rounded-full font-bold transition text-lg backdrop-blur-sm">
              View Products
            </a>
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
