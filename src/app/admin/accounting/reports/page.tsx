'use client';

import { useEffect, useState } from 'react';
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

interface ReportData {
  ok: boolean;
  from: string;
  to: string;
  total_orders: number;
  total_revenue: number;
  total_refunded: number;
  net_revenue: number;
  refund_count: number;
  avg_order_value: number;
  daily: { date: string; orders: number; revenue: number }[];
  top_products: { id: string; name: string; units: number; revenue: number }[];
}

export default function ReportsPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<ReportData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Default to last 30 days
  const today = new Date().toISOString().slice(0, 10);
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);
  const [dateFrom, setDateFrom] = useState(thirtyDaysAgo);
  const [dateTo, setDateTo] = useState(today);

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

  const generateReport = async () => {
    if (!dateFrom || !dateTo) return;
    setLoading(true);
    setError(null);
    setReport(null);
    try {
      const params = new URLSearchParams({ from: dateFrom, to: dateTo });
      const json = await accountingFetch(`/api/admin/accounting/reports?${params}`);
      if (!json.ok) throw new Error(json.error || 'Failed');
      setReport(json);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    const token = process.env.NEXT_PUBLIC_ADMIN_ANALYTICS_TOKEN;
    const params = new URLSearchParams({ from: dateFrom, to: dateTo });
    const url = `/api/admin/accounting/export?${params}`;
    // Open with auth header via a hidden form or direct link
    // For simplicity, open in new tab (token is passed via query for CSV)
    window.open(url, '_blank');
  };

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
          <h1 className="text-2xl sm:text-3xl font-black" style={{ color: 'var(--text)' }}>Reports</h1>
        </div>

        {/* Date Range Controls */}
        <div
          className="rounded-2xl p-6 mb-6"
          style={{ background: 'rgba(255,255,255,0.82)', border: '1px solid var(--divider)' }}
        >
          <h3 className="text-sm font-black uppercase tracking-wider mb-4" style={{ color: 'var(--muted)' }}>
            Generate Report
          </h3>
          <div className="flex flex-col sm:flex-row gap-3 items-end">
            <div>
              <label className="text-xs font-bold uppercase mb-1 block" style={{ color: 'var(--muted)' }}>From</label>
              <input
                type="date"
                value={dateFrom}
                onChange={e => setDateFrom(e.target.value)}
                className="px-3 py-2 rounded-lg text-sm border"
                style={{ borderColor: 'var(--divider)', color: 'var(--text)' }}
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase mb-1 block" style={{ color: 'var(--muted)' }}>To</label>
              <input
                type="date"
                value={dateTo}
                onChange={e => setDateTo(e.target.value)}
                className="px-3 py-2 rounded-lg text-sm border"
                style={{ borderColor: 'var(--divider)', color: 'var(--text)' }}
              />
            </div>
            <button
              onClick={generateReport}
              disabled={loading}
              className="px-5 py-2 rounded-lg text-sm font-bold text-white disabled:opacity-60"
              style={{ background: '#0e66b3' }}
            >
              {loading ? 'Generating...' : 'Generate Report'}
            </button>
            {report && (
              <button
                onClick={exportCSV}
                className="px-5 py-2 rounded-lg text-sm font-bold"
                style={{ border: '1px solid var(--divider)', color: 'var(--text)' }}
              >
                Export CSV
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="rounded-xl p-4 mb-6 text-red-800 bg-red-50 border border-red-200 text-sm font-medium">{error}</div>
        )}

        {report && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.82)', border: '1px solid var(--divider)' }}>
                <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--muted)' }}>Total Revenue</div>
                <div className="text-xl font-black" style={{ color: '#0e66b3' }}>{fmt(report.total_revenue)}</div>
              </div>
              <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.82)', border: '1px solid var(--divider)' }}>
                <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--muted)' }}>Net Revenue</div>
                <div className="text-xl font-black" style={{ color: 'var(--text)' }}>{fmt(report.net_revenue)}</div>
              </div>
              <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.82)', border: '1px solid var(--divider)' }}>
                <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--muted)' }}>Orders</div>
                <div className="text-xl font-black" style={{ color: 'var(--text)' }}>{fmtNum(report.total_orders)}</div>
              </div>
              <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.82)', border: '1px solid var(--divider)' }}>
                <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--muted)' }}>Avg Order Value</div>
                <div className="text-xl font-black" style={{ color: 'var(--text)' }}>{fmt(report.avg_order_value)}</div>
              </div>
            </div>

            {/* Refunds row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.82)', border: '1px solid var(--divider)' }}>
                <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--muted)' }}>Total Refunded</div>
                <div className="text-xl font-black" style={{ color: '#dc2626' }}>{fmt(report.total_refunded)}</div>
                <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{report.refund_count} refund{report.refund_count !== 1 ? 's' : ''}</div>
              </div>
              <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.82)', border: '1px solid var(--divider)' }}>
                <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--muted)' }}>Date Range</div>
                <div className="text-lg font-black" style={{ color: 'var(--text)' }}>
                  {fmtDate(report.from)} &mdash; {fmtDate(report.to)}
                </div>
              </div>
            </div>

            {/* Daily Breakdown */}
            {report.daily.length > 0 && (
              <div
                className="rounded-2xl p-6 mb-6"
                style={{ background: 'rgba(255,255,255,0.82)', border: '1px solid var(--divider)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
              >
                <h3 className="text-sm font-black uppercase tracking-wider mb-4" style={{ color: 'var(--muted)' }}>
                  Daily Breakdown
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--divider)' }}>
                        <th className="text-left px-3 py-2 font-bold text-xs uppercase" style={{ color: 'var(--muted)' }}>Date</th>
                        <th className="text-right px-3 py-2 font-bold text-xs uppercase" style={{ color: 'var(--muted)' }}>Orders</th>
                        <th className="text-right px-3 py-2 font-bold text-xs uppercase" style={{ color: 'var(--muted)' }}>Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.daily.map((d) => (
                        <tr key={d.date} style={{ borderBottom: '1px solid var(--divider)' }}>
                          <td className="px-3 py-2" style={{ color: 'var(--text)' }}>{fmtDate(d.date)}</td>
                          <td className="px-3 py-2 text-right" style={{ color: 'var(--text)' }}>{d.orders}</td>
                          <td className="px-3 py-2 text-right font-bold" style={{ color: 'var(--text)' }}>{fmt(d.revenue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Top Products */}
            {report.top_products.length > 0 && (
              <div
                className="rounded-2xl p-6"
                style={{ background: 'rgba(255,255,255,0.82)', border: '1px solid var(--divider)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
              >
                <h3 className="text-sm font-black uppercase tracking-wider mb-4" style={{ color: 'var(--muted)' }}>
                  Top Products
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--divider)' }}>
                        <th className="text-left px-3 py-2 font-bold text-xs uppercase" style={{ color: 'var(--muted)' }}>Product</th>
                        <th className="text-right px-3 py-2 font-bold text-xs uppercase" style={{ color: 'var(--muted)' }}>Units</th>
                        <th className="text-right px-3 py-2 font-bold text-xs uppercase" style={{ color: 'var(--muted)' }}>Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.top_products.map((p) => (
                        <tr key={p.id} style={{ borderBottom: '1px solid var(--divider)' }}>
                          <td className="px-3 py-2">
                            <div className="font-medium" style={{ color: 'var(--text)' }}>{p.name}</div>
                          </td>
                          <td className="px-3 py-2 text-right" style={{ color: 'var(--text)' }}>{fmtNum(p.units)}</td>
                          <td className="px-3 py-2 text-right font-bold" style={{ color: 'var(--text)' }}>{fmt(p.revenue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {!report && !loading && !error && (
          <div className="text-center py-20" style={{ color: 'var(--muted)' }}>
            Select a date range and click Generate Report
          </div>
        )}
      </section>
    </div>
  );
}
