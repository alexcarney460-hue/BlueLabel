'use client';

import { useState, useEffect } from 'react';
import { useCart } from './cart-context';

export default function Home() {
  const [ageVerified, setAgeVerified] = useState(false);
  const [bannerIndex, setBannerIndex] = useState(0);
  const { addToCart, cartCount } = useCart();

  const announcements = [
    '🚀 New shipment arriving: Order by Friday for guaranteed delivery next week',
    '💎 Autoship & Save: Lock in 10% off with Subscribe & Save',
    '🔬 ISO 17025 certified. Every batch verified with serialized COAs',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(timer);
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
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-lg transition"
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
      <div className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-white py-3 px-8 text-center font-semibold overflow-hidden">
        <div className="max-w-6xl mx-auto animate-pulse">
          {announcements[bannerIndex]}
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-12 z-50 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="text-3xl font-bold">
            <span className="text-slate-900">Blue</span><span className="text-amber-400">Label</span>
          </div>
          <nav className="flex gap-8 items-center">
            <a href="#home" className="text-slate-700 hover:text-amber-600 font-bold text-sm uppercase tracking-wide transition">Home</a>
            <a href="#products" className="text-slate-700 hover:text-amber-600 font-bold text-sm uppercase tracking-wide transition">Products</a>
            <a href="#wholesale" className="text-slate-700 hover:text-amber-600 font-bold text-sm uppercase tracking-wide transition">Wholesale</a>
            <a href="#contact" className="text-slate-700 hover:text-amber-600 font-bold text-sm uppercase tracking-wide transition">Contact</a>
          </nav>
          <div className="flex gap-4 items-center">
            {/* Cart Button */}
            <button className="relative p-2 hover:text-amber-600 transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="absolute top-0 right-0 bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{cartCount}</span>
            </button>

            {/* Account / Login */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:text-amber-600 font-bold text-sm uppercase tracking-wide transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Account
              </button>
              
              {/* Login Dropdown */}
              <div className="absolute right-0 mt-0 w-64 bg-white border border-slate-200 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-6 space-y-4">
                  <h3 className="font-bold text-slate-900 mb-4">Login or Sign Up</h3>
                  
                  {/* Email Input */}
                  <div>
                    <input 
                      type="email" 
                      placeholder="Enter your email" 
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Email Login Button */}
                  <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-lg transition text-sm">
                    Continue with Email
                  </button>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-slate-500">Or</span>
                    </div>
                  </div>

                  {/* Google OAuth Button */}
                  <button className="w-full flex items-center justify-center gap-2 border border-slate-300 hover:border-slate-400 py-2 rounded-lg transition text-sm font-semibold">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Sign in with Google
                  </button>

                  <p className="text-xs text-slate-500 text-center mt-4">
                    By continuing, you agree to our Terms of Service and Privacy Policy
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Top Hero Section with Dark Gradient */}
      <section id="home" className="relative pt-32 pb-20 px-8" style={{background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'}}>
        {/* Subtle glow effect */}
        <div style={{position: 'absolute', top: '30%', right: '0', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(251, 191, 36, 0.1) 0%, transparent 70%)', borderRadius: '50%'}} />
        
        <div className="relative max-w-6xl mx-auto z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <p className="text-sm text-amber-300 font-bold uppercase tracking-wide mb-4">Premium Research Grade</p>
              <h1 className="text-6xl md:text-7xl font-black mb-6 text-white drop-shadow-lg">
                ≥98% Purity
              </h1>
              <p className="text-xl text-slate-100 mb-8 leading-relaxed">
                Research-grade 7-OH tablets with verified COAs. Lab-tested, pharmaceutical-grade tablets for wholesale distribution and research use.
              </p>
              <div className="flex gap-4 flex-wrap mb-6">
                <a href="#products" className="inline-block bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-900 px-10 py-4 rounded-full font-bold transition shadow-xl transform hover:scale-105">
                  Shop Now
                </a>
                <a href="#wholesale" className="inline-block border-2 border-amber-300 text-amber-300 hover:bg-white/10 px-10 py-4 rounded-full font-bold transition backdrop-blur-sm">
                  Wholesale
                </a>
              </div>
              <p className="text-sm text-slate-200">For research use only. Not for human consumption.</p>
            </div>

            {/* Right - Product Image */}
            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-sm">
                {/* Glowing orb */}
                <div className="absolute -inset-8 rounded-full blur-3xl opacity-30 animate-pulse" style={{background: 'linear-gradient(to right, #fbbf24, #f97316)'}} />
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
      <section id="products" className="py-24 px-8" style={{background: 'linear-gradient(to bottom, #ffffff, #f1f5f9, #f8fafc)'}}>
        <div className="max-w-6xl mx-auto">
          <p className="text-amber-600 font-bold uppercase tracking-wide text-center mb-4">Our Selection</p>
          <h2 className="text-4xl font-bold text-center mb-12 text-slate-900">Premium Product Line</h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            {/* Product 1 - Cherry */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-white hover:shadow-lg transition cursor-pointer block">
              <a href="/product/cherry" className="block mb-4">
                <div className="w-full h-48 bg-slate-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                  <img src="/cherry.jpg" alt="Cherry 7-OH" className="w-full h-full object-contain" />
                </div>
              </a>
              <h3 className="text-sm font-bold uppercase tracking-wide text-amber-600 mb-2">Cherry</h3>
              <p className="text-slate-600 text-sm mb-2">Wholesale pricing available — contact sales for bulk quotes.</p>
              <p className="text-slate-600 text-sm mb-4">Premium cherry-flavored 7-OH tablets. 20mg per unit, 2 containers of 10.</p>
              <button onClick={() => addToCart({id: 'cherry', name: 'Cherry 7-OH', price: 29.99, quantity: 1, image: '/cherry.jpg'})} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-lg transition text-sm">
                Add to Cart
              </button>
            </div>

            {/* Product 2 - Mix Berry */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-white hover:shadow-lg transition cursor-pointer block">
              <a href="/product/mix-berry" className="block mb-4">
                <div className="w-full h-48 bg-slate-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                  <img src="/mixberry.jpg" alt="Mix Berry 7-OH" className="w-full h-full object-contain" />
                </div>
              </a>
              <h3 className="text-sm font-bold uppercase tracking-wide text-amber-600 mb-2">Mix Berry</h3>
              <p className="text-slate-600 text-sm mb-2">Wholesale pricing available — contact sales for bulk quotes.</p>
              <p className="text-slate-600 text-sm mb-4">Enhanced berry blend 7-OH tablets. 20mg per unit, 2 containers of 10.</p>
              <button onClick={() => addToCart({id: 'mix-berry', name: 'Mix Berry 7-OH', price: 32.99, quantity: 1, image: '/mixberry.jpg'})} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-lg transition text-sm">
                Add to Cart
              </button>
            </div>

            {/* Product 3 - Strawberry */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-white hover:shadow-lg transition cursor-pointer block">
              <a href="/product/strawberry" className="block mb-4">
                <div className="w-full h-48 bg-slate-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                  <img src="/strawberry.jpg" alt="Strawberry 7-OH" className="w-full h-full object-contain" />
                </div>
              </a>
              <h3 className="text-sm font-bold uppercase tracking-wide text-amber-600 mb-2">Strawberry</h3>
              <p className="text-slate-600 text-sm mb-2">Wholesale pricing available — contact sales for bulk quotes.</p>
              <p className="text-slate-600 text-sm mb-4">Premium strawberry-flavored 7-OH tablets. 20mg per unit, 2 containers of 10.</p>
              <button onClick={() => addToCart({id: 'strawberry', name: 'Strawberry 7-OH', price: 29.99, quantity: 1, image: '/strawberry.jpg'})} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-lg transition text-sm">
                Add to Cart
              </button>
            </div>

            {/* Product 4 - Watermelon */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-white hover:shadow-lg transition cursor-pointer block">
              <a href="/product/watermelon" className="block mb-4">
                <div className="w-full h-48 bg-slate-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                  <img src="/watermelon.jpg" alt="Watermelon 7-OH" className="w-full h-full object-contain" />
                </div>
              </a>
              <h3 className="text-sm font-bold uppercase tracking-wide text-amber-600 mb-2">Watermelon</h3>
              <p className="text-slate-600 text-sm mb-2">Wholesale pricing available — contact sales for bulk quotes.</p>
              <p className="text-slate-600 text-sm mb-4">Premium watermelon-flavored 7-OH tablets. 20mg per unit, 2 containers of 10.</p>
              <button onClick={() => addToCart({id: 'watermelon', name: 'Watermelon 7-OH', price: 31.99, quantity: 1, image: '/watermelon.jpg'})} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-lg transition text-sm">
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
            <p className="text-amber-300 font-bold uppercase tracking-wide mb-4">Autoship Program</p>
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
          <div className="bg-slate-800 rounded-3xl border border-amber-200/30 p-8 shadow-xl">
            <p className="text-amber-300 font-bold uppercase tracking-wide mb-4">How it works</p>
            <ol className="space-y-3 text-slate-300 mb-6 text-sm">
              <li>1. Select "Autoship & Save 10%" on any product.</li>
              <li>2. Choose your tablet quantity. Discount applies instantly.</li>
              <li>3. Manage renewals from your dashboard in two clicks.</li>
            </ol>
            <a href="#" className="inline-block bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-full font-bold transition">
              Browse eligible products
            </a>
          </div>
        </div>
      </section>

      {/* Why Choose BlueLabel */}
      <section className="py-24 px-8 bg-slate-50 border-y border-slate-200">
        <div className="max-w-6xl mx-auto">
          <p className="text-amber-600 font-bold uppercase tracking-wide text-center mb-4">Why BlueLabel?</p>
          <h2 className="text-4xl font-bold text-center mb-12 text-slate-900">Trusted science. Verified batches.</h2>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
            Every tablet that leaves our facility is backed by ISO 17025 partner labs, in-house sterility logs, and serialized labels for full chain-of-custody. Researchers choose BlueLabel for consistent purity and transparent documentation.
          </p>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-white hover:shadow-md transition">
              <div className="h-10 w-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold mb-3">✓</div>
              <h3 className="font-bold text-slate-900 mb-2">Unmatched Quality</h3>
              <p className="text-slate-600 text-sm">≥98% purity confirmed via HPLC + MS.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-white hover:shadow-md transition">
              <div className="h-10 w-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold mb-3">✓</div>
              <h3 className="font-bold text-slate-900 mb-2">Innovative Solutions</h3>
              <p className="text-slate-600 text-sm">Tablets engineered for research and wholesale.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-white hover:shadow-md transition">
              <div className="h-10 w-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold mb-3">✓</div>
              <h3 className="font-bold text-slate-900 mb-2">Comprehensive Selection</h3>
              <p className="text-slate-600 text-sm">Multiple potencies and bulk options in stock.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-white hover:shadow-md transition">
              <div className="h-10 w-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold mb-3">✓</div>
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
            <p className="text-amber-600 font-bold uppercase tracking-wide mb-4">Advanced Manufacturing</p>
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
            <img src="/manufacturing.jpg" alt="Advanced Manufacturing Facility" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Wholesale & White Label */}
      <section id="wholesale" className="bg-slate-50 py-24 px-8 border-y border-slate-200">
        <div className="max-w-6xl mx-auto">
          <p className="text-amber-600 font-bold uppercase tracking-wide text-center mb-4">Wholesale Solutions</p>
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
            <a href="mailto:info@bluelabel.com" className="inline-block bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white px-10 py-4 rounded-full font-bold transition shadow-xl transform hover:scale-105 text-lg">
              Contact Sales
            </a>
            <a href="#products" className="inline-block border-2 border-amber-400 text-amber-300 hover:bg-white/10 px-10 py-4 rounded-full font-bold transition text-lg backdrop-blur-sm">
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
