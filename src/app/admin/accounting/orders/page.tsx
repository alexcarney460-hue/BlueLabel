'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSupabase } from '@/lib/supabase';
import { fmt, fmtDate, fmtNum } from '@/lib/admin/accounting-hooks';

function accountingFetch(path: string) {
  const token = process.env.NEXT_PUBLIC_ADMIN_ANALYTICS_TOKEN;
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return fetch(path, { headers }).then(r => r.json());
}

interface Order {
  id: number | string;
  status: string;
  payload: {
    customer?: { name?: string; email?: string; phone?: string };
    items?: any[];
    subtotal?: number;
    account_type?: string;
    shipping?: { city?: string; state?: string };
    notes?: string;
  };
  created_at: string;
}

export default function OrdersPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [error, setError] = useState<string | null>(null);
  const limit = 25;

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

  const fetchOrders = useCallback(async () => {
    if (!authorized) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (search) params.set('search', search);
      if (dateFrom) params.set('from', dateFrom);
      if (dateTo) params.set('to', dateTo);
      const json = await accountingFetch(`/api/admin/accounting/orders?${params}`);
      if (!json.ok) throw new Error(json.error || 'Failed');
      setOrders(json.orders);
      setTotal(json.total);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [authorized, page, search, dateFrom, dateTo]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const totalPages = Math.ceil(total / limit);

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
          <h1 className="text-2xl sm:text-3xl font-black" style={{ color: 'var(--text)' }}>Orders</h1>
        </div>

        {/* Filters */}
        <div
          className="rounded-2xl p-4 mb-6 flex flex-col sm:flex-row gap-3 items-end"
          style={{ background: 'rgba(255,255,255,0.82)', border: '1px solid var(--divider)' }}
        >
          <div className="flex-1 w-full">
            <label className="text-xs font-bold uppercase mb-1 block" style={{ color: 'var(--muted)' }}>Search</label>
            <input
              type="text"
              placeholder="Name, email, or order ID..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { setSearch(searchInput); setPage(1); } }}
              className="w-full px-3 py-2 rounded-lg text-sm border"
              style={{ borderColor: 'var(--divider)', color: 'var(--text)' }}
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase mb-1 block" style={{ color: 'var(--muted)' }}>From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={e => { setDateFrom(e.target.value); setPage(1); }}
              className="px-3 py-2 rounded-lg text-sm border"
              style={{ borderColor: 'var(--divider)', color: 'var(--text)' }}
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase mb-1 block" style={{ color: 'var(--muted)' }}>To</label>
            <input
              type="date"
              value={dateTo}
              onChange={e => { setDateTo(e.target.value); setPage(1); }}
              className="px-3 py-2 rounded-lg text-sm border"
              style={{ borderColor: 'var(--divider)', color: 'var(--text)' }}
            />
          </div>
          <button
            onClick={() => { setSearch(searchInput); setPage(1); }}
            className="px-4 py-2 rounded-lg text-sm font-bold text-white"
            style={{ background: '#0e66b3' }}
          >
            Search
          </button>
        </div>

        {error && (
          <div className="rounded-xl p-4 mb-6 text-red-800 bg-red-50 border border-red-200 text-sm font-medium">{error}</div>
        )}

        {/* Results info */}
        <div className="text-sm mb-3" style={{ color: 'var(--muted)' }}>
          {loading ? 'Loading...' : `${fmtNum(total)} order${total !== 1 ? 's' : ''} found`}
        </div>

        {/* Table */}
        <div
          className="rounded-2xl overflow-hidden mb-6"
          style={{ background: 'rgba(255,255,255,0.82)', border: '1px solid var(--divider)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--divider)' }}>
                  <th className="text-left px-4 py-3 font-bold text-xs uppercase" style={{ color: 'var(--muted)' }}>ID</th>
                  <th className="text-left px-4 py-3 font-bold text-xs uppercase" style={{ color: 'var(--muted)' }}>Date</th>
                  <th className="text-left px-4 py-3 font-bold text-xs uppercase" style={{ color: 'var(--muted)' }}>Customer</th>
                  <th className="text-left px-4 py-3 font-bold text-xs uppercase" style={{ color: 'var(--muted)' }}>Email</th>
                  <th className="text-right px-4 py-3 font-bold text-xs uppercase" style={{ color: 'var(--muted)' }}>Items</th>
                  <th className="text-right px-4 py-3 font-bold text-xs uppercase" style={{ color: 'var(--muted)' }}>Subtotal</th>
                  <th className="text-left px-4 py-3 font-bold text-xs uppercase" style={{ color: 'var(--muted)' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => {
                  const p = o.payload ?? {};
                  return (
                    <tr key={o.id} style={{ borderBottom: '1px solid var(--divider)' }} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--text)' }}>{o.id}</td>
                      <td className="px-4 py-3" style={{ color: 'var(--text)' }}>{fmtDate(o.created_at)}</td>
                      <td className="px-4 py-3 font-medium" style={{ color: 'var(--text)' }}>{p.customer?.name || '-'}</td>
                      <td className="px-4 py-3" style={{ color: 'var(--muted)' }}>{p.customer?.email || '-'}</td>
                      <td className="px-4 py-3 text-right" style={{ color: 'var(--text)' }}>{(p.items ?? []).length}</td>
                      <td className="px-4 py-3 text-right font-bold" style={{ color: 'var(--text)' }}>{fmt(p.subtotal ?? 0)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${
                          o.status === 'new' ? 'bg-blue-100 text-blue-800' :
                          o.status === 'fulfilled' ? 'bg-emerald-100 text-emerald-800' :
                          o.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-slate-100 text-slate-800'
                        }`}>
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {!loading && orders.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center" style={{ color: 'var(--muted)' }}>
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-3 py-1.5 rounded-lg text-sm font-bold disabled:opacity-40"
              style={{ border: '1px solid var(--divider)', color: 'var(--text)' }}
            >
              Previous
            </button>
            <span className="text-sm" style={{ color: 'var(--muted)' }}>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-3 py-1.5 rounded-lg text-sm font-bold disabled:opacity-40"
              style={{ border: '1px solid var(--divider)', color: 'var(--text)' }}
            >
              Next
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
