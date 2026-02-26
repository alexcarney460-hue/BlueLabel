export default function Home() {
  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-blue-900 border-b-4 border-red-600">
        <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-yellow-400">BlueLabel</h1>
          <nav className="flex gap-8 items-center">
            <a href="#home" className="text-white hover:text-yellow-400 font-bold text-sm uppercase tracking-wide transition">Home</a>
            <a href="#catalog" className="text-white hover:text-yellow-400 font-bold text-sm uppercase tracking-wide transition">Catalog</a>
            <a href="#wholesale" className="text-white hover:text-yellow-400 font-bold text-sm uppercase tracking-wide transition">Wholesale</a>
            <a href="#contact" className="text-white hover:text-yellow-400 font-bold text-sm uppercase tracking-wide transition">Contact</a>
          </nav>
        </div>
      </header>

      {/* Top Hero Section */}
      <section id="home" className="py-24 px-8 bg-gradient-to-b from-blue-900 to-blue-800 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-block bg-red-600 px-4 py-2 rounded mb-4">
            <p className="text-sm font-bold uppercase tracking-wide text-white">KRATOM 7OH</p>
          </div>
          <h1 className="text-6xl font-bold mb-6 text-yellow-400">≥98% Purity</h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Research-grade 7-OH tablets with verified COAs. Lab-tested, pharmaceutical-grade tablets for wholesale distribution and research use.
          </p>
          <div className="flex gap-4 justify-center">
            <a href="#catalog" className="inline-block bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-bold transition">
              View Catalog
            </a>
            <a href="#wholesale" className="inline-block border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-blue-900 px-8 py-3 rounded-full font-bold transition">
              Wholesale Info
            </a>
          </div>
        </div>
      </section>

      {/* Autoship Program */}
      <section className="bg-blue-800 text-white py-20 px-8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block bg-red-600 px-3 py-1 rounded mb-4">
              <p className="text-xs font-bold uppercase tracking-wide">Autoship Program</p>
            </div>
            <h2 className="text-4xl font-bold mb-6 text-yellow-400">Lock in 10% off with Subscribe & Save</h2>
            <p className="text-blue-100 mb-6">
              Researchers who rely on the same compounds month over month can schedule automatic resupply every 30 days. Pause or cancel anytime inside your account—no hidden fees, just guaranteed inventory and loyalty pricing.
            </p>
            <ul className="space-y-3 text-blue-100 mb-8">
              <li>• 10% discount on every recurring shipment</li>
              <li>• Priority pull from fresh COA lots</li>
              <li>• Automated cold-chain packaging with tracking</li>
            </ul>
          </div>
          <div className="bg-blue-900 rounded-2xl p-8 border-2 border-red-600">
            <p className="text-yellow-400 font-bold uppercase tracking-wide mb-4">How it works</p>
            <ol className="space-y-3 text-blue-100 mb-6">
              <li>1. Select "Autoship & Save 10%" on any product.</li>
              <li>2. Choose your tablet quantity. Discount applies instantly.</li>
              <li>3. Manage renewals from your dashboard in two clicks.</li>
            </ol>
            <a href="#" className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-bold transition">
              Browse eligible products
            </a>
          </div>
        </div>
      </section>

      {/* Why Choose BlueLabel */}
      <section className="py-20 px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="inline-block bg-red-600 px-3 py-1 rounded mb-4 mx-auto block">
            <p className="text-xs font-bold uppercase tracking-wide text-white">Why BlueLabel?</p>
          </div>
          <h2 className="text-4xl font-bold text-center mb-12 text-blue-900">Trusted science. Verified batches.</h2>
          <p className="text-center text-gray-700 mb-12 max-w-2xl mx-auto">
            Every tablet that leaves our facility is backed by ISO 17025 partner labs, in-house sterility logs, and serialized labels for full chain-of-custody. Researchers choose BlueLabel for consistent purity and transparent documentation.
          </p>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-blue-900">
              <div className="text-3xl mb-3 text-red-600">✓</div>
              <h3 className="font-bold text-blue-900 mb-2">Unmatched Quality</h3>
              <p className="text-gray-600 text-sm">≥98% purity confirmed via HPLC + MS.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-blue-900">
              <div className="text-3xl mb-3 text-red-600">✓</div>
              <h3 className="font-bold text-blue-900 mb-2">Innovative Solutions</h3>
              <p className="text-gray-600 text-sm">Tablets engineered for research and wholesale.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-blue-900">
              <div className="text-3xl mb-3 text-red-600">✓</div>
              <h3 className="font-bold text-blue-900 mb-2">Comprehensive Selection</h3>
              <p className="text-gray-600 text-sm">Multiple potencies and bulk options in stock.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-blue-900">
              <div className="text-3xl mb-3 text-red-600">✓</div>
              <h3 className="font-bold text-blue-900 mb-2">Reliable Results</h3>
              <p className="text-gray-600 text-sm">Serialized COAs stored with your order history.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Manufacturing */}
      <section className="py-20 px-8 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block bg-red-600 px-3 py-1 rounded mb-4">
              <p className="text-xs font-bold uppercase tracking-wide text-white">Advanced Manufacturing</p>
            </div>
            <h2 className="text-4xl font-bold mb-6 text-blue-900">Sterile. Precise. Automated.</h2>
            <p className="text-gray-700 mb-8">
              We don't just resell—we manufacture. Our state-of-the-art facility utilizes a fully automated tablet processing line equipped with ultrasonic cleaning, Class 100 laminar air flow, and precision encapsulation to ensure medical-grade sterility and dosage accuracy.
            </p>
            
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="text-2xl text-red-600">✓</div>
                <div>
                  <h3 className="font-bold text-blue-900">Ultrasonic Cleaning</h3>
                  <p className="text-gray-600 text-sm">Automated 360° cleaning removes all contaminants.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-2xl text-red-600">✓</div>
                <div>
                  <h3 className="font-bold text-blue-900">Class 100 Laminar Flow</h3>
                  <p className="text-gray-600 text-sm">HEPA-filtered sterilization for maximum safety.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-2xl text-red-600">✓</div>
                <div>
                  <h3 className="font-bold text-blue-900">Precision Encapsulation</h3>
                  <p className="text-gray-600 text-sm">Exact dosage accuracy for every tablet.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-blue-900 rounded-2xl h-64 flex items-center justify-center text-blue-200">
            [Manufacturing Image]
          </div>
        </div>
      </section>

      {/* Wholesale & White Label */}
      <section id="wholesale" className="bg-blue-50 py-20 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="inline-block bg-red-600 px-3 py-1 rounded mb-4 mx-auto block">
            <p className="text-xs font-bold uppercase tracking-wide text-white">Wholesale Solutions</p>
          </div>
          <h2 className="text-4xl font-bold text-center mb-8 text-blue-900">Wholesale & White Label Solutions</h2>
          <p className="text-center text-gray-700 max-w-2xl mx-auto mb-12">
            Scale your brand with our premium manufacturing capabilities. We offer competitive bulk pricing and fully custom white-label packaging for qualified partners.
          </p>
          <p className="text-center text-gray-600 text-sm">
            Minimum Order Quantities apply. ISO 17025 testing included with all bulk orders.
          </p>
        </div>
      </section>

      {/* Bottom Hero / CTA Section */}
      <section id="contact" className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-24 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6 text-yellow-400">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join researchers and distributors worldwide who trust BlueLabel for premium 7-OH tablets. Contact us for wholesale inquiries, sample orders, or partnership opportunities.
          </p>
          <div className="flex gap-4 justify-center">
            <a href="mailto:info@bluelabel.com" className="inline-block bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-bold transition">
              Contact Sales
            </a>
            <a href="#catalog" className="inline-block border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-blue-900 px-8 py-3 rounded-full font-bold transition">
              View Products
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-950 text-blue-200 py-8 px-8 text-center border-t-4 border-red-600">
        <p>Research use only · Not for human consumption</p>
        <p className="text-sm mt-4">© 2026 BlueLabel. All rights reserved.</p>
      </footer>
    </div>
  );
}
