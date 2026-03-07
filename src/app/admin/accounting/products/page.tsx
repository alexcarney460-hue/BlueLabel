'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSupabase } from '@/lib/supabase';
import { fmt, fmtNum } from '@/lib/admin/accounting-hooks';

function accountingFetch(path: string) {
  const token = process.env.NEXT_PUBLIC_ADMIN_ANALYTICS_TOKEN;
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return fetch(path, { headers }).then(r => r.json());
}

interface ProductRevenue {
  id: string;
  name: string;
  price: number | null;
  active: boolean | null;
  units_sold: number;
  total_revenue: number;
}

export default function ProductsRevenuePage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<ProductRevenue[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalUnits, setTotalUnits] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const supabase = getSupabase();
      const { data } = await supabase.auth.getUser();
      if (data.user?.email?.toLowerCase() !== 'gardenablaze@gmail.com') {
        router.push('/admin');
        return;
      }
      setAuthorized(true);
    })();
  }, [router]);

  useEffect(() => {
    if (!authorized) return;
    (async () => {
      setLoading(true);
      try {
        const json = await accountingFetch('/api/admin/accounting/products');
        if (!json.ok) throw new Error(json.error || 'Failed');
        setProducts(json.products);
        setTotalRevenue(json.total_revenue);
        setTotalUnits(json.total_units);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [authorized]);

  if (!authorized) return <div className="p-8">Loading...</div>;

  return (
    <div style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 55%, #eef6ff 100%)' }}>
      <section className="max-w-6xl mx-auto px-4 sm:px-8 pt-10 pb-16">
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/admin/accounting"
            className="text-sm font-bold px-3 py-1.5 rounded-lg transition-colors"
            style={{ color: 'var(--muted)', border: '1px solid var(--divider)' }}
          >
            &larr; Accounting
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black" style={{ color: 'var(--text)' }}>Product Revenue</h1>
        </div>

        {error && (
          <div className="rounded-xl p-4 mb-6 text-red-800 bg-red-50 border border-red-200 text-sm font-medium">{error}</div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.82)', border: '1px solid var(--divider)' }}>
            <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--muted)' }}>Total Revenue</div>
            <div className="text-2xl font-black" style={{ color: '#0e66b3' }}>{fmt(totalRevenue)}</div>
          </div>
          <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.82)', border: '1px solid var(--divider)' }}>
            <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--muted)' }}>Total Units Sold</div>
            <div className="text-2xl font-black" style={{ color: 'var(--text)' }}>{fmtNum(totalUnits)}</div>
          </div>
          <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.82)', border: '1px solid var(--divider)' }}>
            <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--muted)' }}>Products</div>
            <div className="text-2xl font-black" style={{ color: 'var(--text)' }}>{fmtNum(products.length)}</div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20" style={{ color: 'var(--muted)' }}>Loading...</div>
        ) : (
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.82)', border: '1px solid var(--divider)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--divider)' }}>
                    <th className="text-left px-4 py-3 font-bold text-xs uppercase" style={{ color: 'var(--muted)' }}>Product</th>
                    <th className="text-right px-4 py-3 font-bold text-xs uppercase" style={{ color: 'var(--muted)' }}>Unit Price</th>
                    <th className="text-right px-4 py-3 font-bold text-xs uppercase" style={{ color: 'var(--muted)' }}>Units Sold</th>
                    <th className="text-right px-4 py-3 font-bold text-xs uppercase" style={{ color: 'var(--muted)' }}>Total Revenue</th>
                    <th className="text-right px-4 py-3 font-bold text-xs uppercase" style={{ color: 'var(--muted)' }}>% of Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--divider)' }} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3">
                        <div className="font-medium" style={{ color: 'var(--text)' }}>{p.name}</div>
                        <div className="text-xs" style={{ color: 'var(--muted)' }}>{p.id}</div>
                      </td>
                      <td className="px-4 py-3 text-right" style={{ color: 'var(--text)' }}>{p.price != null ? fmt(p.price) : '-'}</td>
                      <td className="px-4 py-3 text-right font-medium" style={{ color: 'var(--text)' }}>{fmtNum(p.units_sold)}</td>
                      <td className="px-4 py-3 text-right font-bold" style={{ color: 'var(--text)' }}>{fmt(p.total_revenue)}</td>
                      <td className="px-4 py-3 text-right" style={{ color: 'var(--muted)' }}>
                        {totalRevenue > 0 ? ((p.total_revenue / totalRevenue) * 100).toFixed(1) + '%' : '-'}
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-12 text-center" style={{ color: 'var(--muted)' }}>No product data found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
