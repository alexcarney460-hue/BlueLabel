import Header from '@/app/Header';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import AddToCartClient from './AddToCartClient';
import { allProducts, normalizeProductId } from '@/lib/products';

export default function ProductPage({ params }: { params: { id: string } }) {
  const slug = normalizeProductId(params?.id ?? '');

  if (!slug) {
    redirect('/catalog');
  }

  const product = allProducts.find((p) => p.id === slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen font-sans">
      <Header />

      <section className="py-16 sm:py-20 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <Link href="/catalog" className="text-amber-600 hover:underline mb-8 inline-block font-bold">← Back to Catalog</Link>
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
            <div className="flex items-center justify-center">
              <div className="w-full max-w-xs sm:max-w-sm h-80 sm:h-96 rounded-2xl overflow-hidden flex items-center justify-center">
                <img src={product.image} alt={product.name} className="w-full h-full object-contain p-6 sm:p-8" />
              </div>
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 text-slate-900">{product.name}</h1>
              <p className="text-amber-600 text-sm font-bold uppercase mb-6">Research Grade</p>

              <div className="mb-8">
                <p className="text-3xl sm:text-4xl font-black text-slate-900">${product.price.toFixed(2)}</p>
              </div>

              <p className="text-base sm:text-lg text-slate-600 mb-8 leading-relaxed">{product.description}</p>

              <div className="mb-8 space-y-3 bg-slate-50 p-5 sm:p-6 rounded-lg text-sm sm:text-base">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="font-bold text-slate-900">Wholesale:</span>
                  <span className="text-slate-700 font-semibold">Wholesale pricing available — contact sales for bulk quotes.</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="font-bold text-slate-900">Dosage:</span>
                  <span className="text-slate-700 font-semibold">{product.dosage}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="font-bold text-slate-900">Format:</span>
                  <span className="text-slate-700 font-semibold">2x10 Tablet Containers</span>
                </div>
              </div>

              <AddToCartClient product={product} />

              <div className="bg-slate-50 p-6 rounded-lg">
                <h3 className="font-bold text-slate-900 mb-4">Quality Assurance</h3>
                <ul className="space-y-3 text-slate-700">
                  {product.details.map((detail: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span className="text-sm">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 text-slate-400 py-8 px-8 text-center border-t border-slate-800">
        <p>Research use only · Not for human consumption</p>
        <p className="text-sm mt-4">© 2026 BlueLabel. All rights reserved.</p>
      </footer>
    </div>
  );
}
