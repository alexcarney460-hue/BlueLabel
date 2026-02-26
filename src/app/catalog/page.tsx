'use client';

import Link from 'next/link';

export default function Catalog() {
  const products = [
    {
      id: 'cherry',
      name: 'Cherry',
      image: '/cherry.jpg',
      purity: '≥98%',
      dosage: '20mg per unit',
      description: 'Premium cherry-flavored 7-OH tablets for research use.',
      price: '$29.99'
    },
    {
      id: 'mix-berry',
      name: 'Mix Berry',
      image: '/mixberry.jpg',
      purity: '≥98%',
      dosage: '20mg per unit',
      description: 'Enhanced berry blend 7-OH tablets for optimal research results.',
      price: '$32.99'
    },
    {
      id: 'strawberry',
      name: 'Strawberry',
      image: '/strawberry.jpg',
      purity: '≥98%',
      dosage: '20mg per unit',
      description: 'Lab-verified strawberry-flavored 7-OH tablets.',
      price: '$29.99'
    },
    {
      id: 'watermelon',
      name: 'Watermelon',
      image: '/watermelon.jpg',
      purity: '≥98%',
      dosage: '20mg per unit',
      description: 'Premium watermelon-flavored 7-OH tablets with COA verification.',
      price: '$31.99'
    }
  ];

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-slate-900">BlueLabel</Link>
          <nav className="flex gap-8 items-center">
            <Link href="/" className="text-slate-700 hover:text-amber-600 font-bold text-sm uppercase tracking-wide transition">Home</Link>
            <Link href="/catalog" className="text-amber-600 font-bold text-sm uppercase tracking-wide">Catalog</Link>
            <Link href="/#wholesale" className="text-slate-700 hover:text-amber-600 font-bold text-sm uppercase tracking-wide transition">Wholesale</Link>
            <Link href="/#contact" className="text-slate-700 hover:text-amber-600 font-bold text-sm uppercase tracking-wide transition">Contact</Link>
          </nav>
          <div className="flex gap-4 items-center">
            <button className="relative p-2 hover:text-amber-600 transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="absolute top-0 right-0 bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">0</span>
            </button>
            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:text-amber-600 font-bold text-sm uppercase tracking-wide transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Account
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Catalog Section */}
      <section className="py-20 px-8 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold text-center mb-12 text-slate-900">Product Catalog</h1>
          
          <div className="grid md:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`}>
                <div className="bg-white rounded-2xl shadow-sm border border-white hover:shadow-lg transition cursor-pointer group">
                  <div className="w-full h-64 bg-slate-200 rounded-t-2xl overflow-hidden flex items-center justify-center">
                    <img src={product.image} alt={product.name} className="w-full h-full object-contain group-hover:scale-105 transition" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-amber-600 mb-2">{product.name}</h3>
                    <p className="font-bold text-slate-900 mb-2">Purity: {product.purity}</p>
                    <p className="text-slate-600 text-sm mb-4">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-lg text-slate-900">{product.price}</span>
                      <button className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded-lg transition text-sm">
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
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
