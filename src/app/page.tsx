export default function Home() {
  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">BlueLabel</h1>
          <nav className="flex gap-8 items-center">
            <a href="#home" className="text-slate-700 hover:text-amber-600 font-bold text-sm uppercase tracking-wide transition">Home</a>
            <a href="#catalog" className="text-slate-700 hover:text-amber-600 font-bold text-sm uppercase tracking-wide transition">Catalog</a>
            <a href="#wholesale" className="text-slate-700 hover:text-amber-600 font-bold text-sm uppercase tracking-wide transition">Wholesale</a>
            <a href="#contact" className="text-slate-700 hover:text-amber-600 font-bold text-sm uppercase tracking-wide transition">Contact</a>
          </nav>
        </div>
      </header>

      {/* Top Hero Section */}
      <section id="home" className="py-24 px-8 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-amber-600 font-bold uppercase tracking-wide mb-4">QC-tested</p>
          <h1 className="text-6xl font-bold mb-6 text-slate-900">≥98% Purity</h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Research-grade 7-OH tablets with verified COAs. Lab-tested, pharmaceutical-grade tablets for wholesale distribution and research use.
          </p>
          <div className="flex gap-4 justify-center">
            <a href="#catalog" className="inline-block bg-slate-900 hover:bg-slate-800 text-white px-10 py-4 rounded-full font-bold transition shadow-lg">
              View Catalog
            </a>
            <a href="#wholesale" className="inline-block border-2 border-slate-900 text-slate-900 hover:bg-slate-50 px-10 py-4 rounded-full font-bold transition">
              Wholesale Info
            </a>
          </div>
          <p className="text-sm text-slate-500 mt-8">For research use only. Not for human consumption.</p>
        </div>
      </section>

      {/* Autoship Program */}
      <section className="bg-slate-900 text-white py-20 px-8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
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
      <section className="py-20 px-8 bg-slate-50 border-y border-slate-200">
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
      <section className="py-20 px-8">
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
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-slate-200 border border-slate-300">
            <div className="absolute inset-0 flex items-center justify-center text-slate-500 font-semibold">
              [Manufacturing Image]
            </div>
          </div>
        </div>
      </section>

      {/* Wholesale & White Label */}
      <section id="wholesale" className="bg-slate-50 py-20 px-8 border-y border-slate-200">
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
      <section id="contact" className="bg-slate-900 text-white py-24 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Join researchers and distributors worldwide who trust BlueLabel for premium 7-OH tablets. Contact us for wholesale inquiries, sample orders, or partnership opportunities.
          </p>
          <div className="flex gap-4 justify-center">
            <a href="mailto:info@bluelabel.com" className="inline-block bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-full font-bold transition shadow-lg">
              Contact Sales
            </a>
            <a href="#catalog" className="inline-block border-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-slate-900 px-8 py-3 rounded-full font-bold transition">
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
