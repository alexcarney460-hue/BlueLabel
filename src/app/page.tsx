export default function Home() {
  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Hero Section */}
      <section className="py-20 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-amber-600 font-bold uppercase tracking-wide mb-4">QC-tested</p>
          <h1 className="text-5xl font-bold mb-6 text-slate-900">≥98% Purity</h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Research-grade 7-OH tablets with verified COAs
          </p>
          <a href="#catalog" className="inline-block bg-slate-900 text-white px-8 py-3 rounded-full font-bold hover:bg-slate-800 transition">
            View Catalog
          </a>
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
          <div className="bg-slate-800 rounded-2xl p-8 border border-amber-200/30">
            <p className="text-amber-300 font-bold uppercase tracking-wide mb-4">How it works</p>
            <ol className="space-y-3 text-slate-300 mb-6">
              <li>1. Select "Autoship & Save 10%" on any product.</li>
              <li>2. Choose your tablet quantity. Discount applies instantly.</li>
              <li>3. Manage renewals from your dashboard in two clicks.</li>
            </ol>
            <a href="#" className="inline-block bg-amber-500 text-white px-6 py-3 rounded-full font-bold hover:bg-amber-600 transition">
              Browse eligible products
            </a>
          </div>
        </div>
      </section>

      {/* Why Choose BlueLabel */}
      <section className="py-20 px-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <p className="text-amber-600 font-bold uppercase tracking-wide text-center mb-4">Why BlueLabel?</p>
          <h2 className="text-4xl font-bold text-center mb-12 text-slate-900">Trusted science. Verified batches.</h2>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
            Every tablet that leaves our facility is backed by ISO 17025 partner labs, in-house sterility logs, and serialized labels for full chain-of-custody. Researchers choose BlueLabel for consistent purity and transparent documentation.
          </p>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="text-2xl mb-3">✓</div>
              <h3 className="font-bold text-slate-900 mb-2">Unmatched Quality</h3>
              <p className="text-slate-600 text-sm">≥98% purity confirmed via HPLC + MS.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="text-2xl mb-3">✓</div>
              <h3 className="font-bold text-slate-900 mb-2">Innovative Solutions</h3>
              <p className="text-slate-600 text-sm">Tablets engineered for research and wholesale.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="text-2xl mb-3">✓</div>
              <h3 className="font-bold text-slate-900 mb-2">Comprehensive Selection</h3>
              <p className="text-slate-600 text-sm">Multiple potencies and bulk options in stock.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="text-2xl mb-3">✓</div>
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
              <div className="flex gap-4">
                <div className="text-2xl">✓</div>
                <div>
                  <h3 className="font-bold text-slate-900">Ultrasonic Cleaning</h3>
                  <p className="text-slate-600 text-sm">Automated 360° cleaning removes all contaminants.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-2xl">✓</div>
                <div>
                  <h3 className="font-bold text-slate-900">Class 100 Laminar Flow</h3>
                  <p className="text-slate-600 text-sm">HEPA-filtered sterilization for maximum safety.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-2xl">✓</div>
                <div>
                  <h3 className="font-bold text-slate-900">Precision Encapsulation</h3>
                  <p className="text-slate-600 text-sm">Exact dosage accuracy for every tablet.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-slate-100 rounded-2xl h-64 flex items-center justify-center text-slate-500">
            [Manufacturing Image]
          </div>
        </div>
      </section>

      {/* Wholesale & White Label */}
      <section className="bg-slate-50 py-20 px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-8 text-slate-900">Wholesale & White Label Solutions</h2>
          <p className="text-center text-slate-600 max-w-2xl mx-auto mb-12">
            Scale your brand with our premium manufacturing capabilities. We offer competitive bulk pricing and fully custom white-label packaging for qualified partners.
          </p>
          <p className="text-center text-slate-600 text-sm">
            Minimum Order Quantities apply. ISO 17025 testing included with all bulk orders.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 px-8 text-center border-t border-slate-800">
        <p className="text-slate-400">Research use only · Not for human consumption</p>
      </footer>
    </div>
  );
}
