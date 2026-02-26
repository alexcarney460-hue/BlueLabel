'use client';

import Link from 'next/link';

const products: { [key: string]: any } = {
  'cherry': {
    name: 'Cherry',
    image: '/cherry.jpg',
    purity: '≥98%',
    dosage: '20mg per unit',
    price: '$29.99',
    description: 'Premium cherry-flavored 7-OH tablets crafted for research use.',
    details: [
      'Lab-verified ≥98% purity',
      '20mg per tablet',
      '2 containers of 10 tablets',
      'HPLC & GC-MS tested',
      'Certificate of Analysis included'
    ]
  },
  'mix-berry': {
    name: 'Mix Berry',
    image: '/mixberry.jpg',
    purity: '≥98%',
    dosage: '20mg per unit',
    price: '$32.99',
    description: 'Enhanced berry blend 7-OH tablets optimized for research applications.',
    details: [
      'Lab-verified ≥98% purity',
      '20mg per tablet',
      '2 containers of 10 tablets',
      'Advanced alkaloid blend',
      'Serialized COA included'
    ]
  },
  'strawberry': {
    name: 'Strawberry',
    image: '/strawberry.jpg',
    purity: '≥98%',
    dosage: '20mg per unit',
    price: '$29.99',
    description: 'Lab-verified strawberry-flavored 7-OH tablets for research.',
    details: [
      'Lab-verified ≥98% purity',
      '20mg per tablet',
      '2 containers of 10 tablets',
      'HPLC & GC-MS tested',
      'Chain-of-custody documentation'
    ]
  },
  'watermelon': {
    name: 'Watermelon',
    image: '/watermelon.jpg',
    purity: '≥98%',
    dosage: '20mg per unit',
    price: '$31.99',
    description: 'Premium watermelon-flavored 7-OH tablets with comprehensive verification.',
    details: [
      'Lab-verified ≥98% purity',
      '20mg per tablet',
      '2 containers of 10 tablets',
      'Microbial analysis included',
      'ISO 17025 certified testing'
    ]
  }
};

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = products[params.id];

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <Link href="/catalog" className="text-blue-600 hover:underline">Back to Catalog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-8 py-2 flex items-center justify-between">
          <Link href="/"><img src="/logo.jpg" alt="BlueLabel Wholesale" className="h-16 w-auto" /></Link>
          <nav className="flex gap-8 items-center">
            <Link href="/" className="text-slate-700 hover:text-amber-600 font-bold text-sm uppercase tracking-wide transition">Home</Link>
            <Link href="/catalog" className="text-slate-700 hover:text-amber-600 font-bold text-sm uppercase tracking-wide transition">Catalog</Link>
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
          </div>
        </div>
      </header>

      {/* Product Details */}
      <section className="py-20 px-8">
        <div className="max-w-6xl mx-auto">
          <Link href="/catalog" className="text-blue-600 hover:underline mb-8 inline-block">← Back to Catalog</Link>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="flex items-center justify-center">
              <div className="w-full max-w-sm h-96 bg-slate-200 rounded-2xl overflow-hidden flex items-center justify-center">
                <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
              </div>
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-5xl font-bold mb-4 text-slate-900">{product.name}</h1>
              <p className="text-2xl font-bold mb-6 text-amber-600">{product.price}</p>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">{product.description}</p>
              
              <div className="mb-8 space-y-3">
                <div className="flex justify-between">
                  <span className="font-bold text-slate-900">Purity:</span>
                  <span className="text-slate-700">{product.purity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-slate-900">Dosage:</span>
                  <span className="text-slate-700">{product.dosage}</span>
                </div>
              </div>

              <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-lg mb-4 transition text-lg">
                Add to Cart
              </button>

              <div className="bg-slate-50 p-6 rounded-lg">
                <h3 className="font-bold text-slate-900 mb-4">What's Included</h3>
                <ul className="space-y-2 text-slate-700">
                  {product.details.map((detail: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-amber-600 font-bold">✓</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
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
