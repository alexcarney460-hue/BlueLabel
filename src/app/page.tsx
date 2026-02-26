export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-800 text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-blue-700">
        <h1 className="text-2xl font-bold">BlueLabel</h1>
        <div className="flex gap-8">
          <a href="#" className="hover:text-blue-200 transition">Products</a>
          <a href="#" className="hover:text-blue-200 transition">Wholesale</a>
          <a href="#" className="hover:text-blue-200 transition">Contact</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-8 py-20 text-center max-w-4xl mx-auto">
        <h2 className="text-5xl font-bold mb-6">Premium 7-OH Tablets</h2>
        <p className="text-xl text-blue-200 mb-8">Lab-tested, pharmaceutical-grade tablets for wholesale distribution</p>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg transition">
          Learn More
        </button>
      </section>

      {/* Features */}
      <section className="bg-blue-800/50 px-8 py-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl mb-4">✓</div>
            <h3 className="font-bold text-lg mb-2">Lab Verified</h3>
            <p className="text-blue-200">Every batch tested for purity and potency</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">✓</div>
            <h3 className="font-bold text-lg mb-2">Fast Shipping</h3>
            <p className="text-blue-200">Quick delivery worldwide</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">✓</div>
            <h3 className="font-bold text-lg mb-2">Wholesale Pricing</h3>
            <p className="text-blue-200">Competitive bulk rates</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 border-t border-blue-700">
        <p className="text-blue-300">© 2026 BlueLabel. For research use only.</p>
      </footer>
    </div>
  );
}
