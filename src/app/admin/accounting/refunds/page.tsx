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

interface Refund {
  id: number | string;
  amount: number;
  order_id: number | string | null;
  reason: string | null;
  created_at: string;
}

export default function RefundsPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [total, setTotal] = useState(0);
  const [totalRefunded, setTotalRefunded] = useState(0);
  const [page, setPage] = useState(1);
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

  const fetchRefunds = useCallback(async () => {
    if (!authorized) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      const json = await accountingFetch(`/api/admin/accounting/refunds?${params}`);
      if (!json.ok) throw new Error(json.error || 'Failed');
      setRefunds(json.refunds);
      setTotal(json.total);
      setTotalRefunded(json.total_refunded);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [authorized, page]);

  useEffect(() => { fetchRefunds(); }, [fetchRefunds]);

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
          <h1 className="text-2xl sm:text-3xl font-black" style={{ color: 'var(--text)' }}>Refunds</h1>
        </div>

        {error && (
          <div className="rounded-xl p-4 mb-6 text-red-800 bg-red-50 border border-red-200 text-sm font-medium">{error}</div>
        )}

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.82)', border: '1px solid var(--divider)' }}>
            <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--muted)' }}>Total Refunded</div>
            <div className="text-2xl font-black" style={{ color: '#dc2626' }}>{fmt(totalRefunded)}</div>
          </div>
          <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.82)', border: '1px solid var(--divider)' }}>
            <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--muted)' }}>Refund Count</div>
            <div className="text-2xl font-black" style={{ color: 'var(--text)' }}>{fmtNum(total)}</div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20" style={{ color: 'var(--muted)' }}>Loading...</div>
        ) : (
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
                    <th className="text-left px-4 py-3 font-bold text-xs uppercase" style={{ color: 'var(--muted)' }}>Order ID</th>
                    <th className="text-right px-4 py-3 font-bold text-xs uppercase" style={{ color: 'var(--muted)' }}>Amount</th>
                    <th className="text-left px-4 py-3 font-bold text-xs uppercase" style={{ color: 'var(--muted)' }}>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {refunds.map((r) => (
                    <tr key={r.id} style={{ borderBottom: '1px solid var(--divider)' }} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--text)' }}>{r.id}</td>
                      <td className="px-4 py-3" style={{ color: 'var(--text)' }}>{fmtDate(r.created_at)}</td>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--muted)' }}>{r.order_id ?? '-'}</td>
                      <td className="px-4 py-3 text-right font-bold" style={{ color: '#dc2626' }}>{fmt(r.amount)}</td>
                      <td className="px-4 py-3" style={{ color: 'var(--muted)' }}>{r.reason || '-'}</td>
                    </tr>
                  ))}
                  {refunds.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-12 text-center" style={{ color: 'var(--muted)' }}>No refunds found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

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
