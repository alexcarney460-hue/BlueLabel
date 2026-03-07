'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSupabase } from '@/lib/supabase';
import { fmt, fmtNum } from '@/lib/admin/accounting-hooks';

interface SummaryData {
  ok: boolean;
  data: {
    revenue_ytd: number;
    revenue_month: number;
    revenue_week: number;
    order_count: number;
    order_count_ytd: number;
    order_count_month: number;
    order_count_week: number;
    avg_order_value: number;
    refund_rate: number;
    refund_total: number;
    refund_count: number;
    payment_methods: Record<string, number>;
  };
}

const subPages = [
  { label: 'Orders', href: '/admin/accounting/orders', description: 'Browse and search all orders' },
  { label: 'Reports', href: '/admin/accounting/reports', description: 'Date range reports with CSV export' },
  { label: 'Products', href: '/admin/accounting/products', description: 'Revenue breakdown by product' },
  { label: 'Customers', href: '/admin/accounting/customers', description: 'Customer analytics and LTV' },
  { label: 'Refunds', href: '/admin/accounting/refunds', description: 'Refund history and totals' },
];

function accountingFetch(path: string) {
  const token = process.env.NEXT_PUBLIC_ADMIN_ANALYTICS_TOKEN;
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return fetch(path, { headers }).then(r => r.json());
}

export default function AccountingDashboard() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<SummaryData | null>(null);
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
        const json = await accountingFetch('/api/admin/accounting/summary');
        if (!json.ok) throw new Error(json.error || 'Failed to load summary');
        setSummary(json);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [authorized]);

  if (!authorized) return <div className="p-8">Loading...</div>;

  const d = summary?.data;

  return (
    <div style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 55%, #eef6ff 100%)' }}>
      <section className="max-w-6xl mx-auto px-4 sm:px-8 pt-10 pb-16">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/admin"
            className="text-sm font-bold px-3 py-1.5 rounded-lg transition-colors"
            style={{ color: 'var(--muted)', border: '1px solid var(--divider)' }}
          >
            &larr; Admin
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black" style={{ color: 'var(--text)' }}>
            Accounting
          </h1>
        </div>

        {error && (
          <div className="rounded-xl p-4 mb-6 text-red-800 bg-red-50 border border-red-200 text-sm font-medium">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-20" style={{ color: 'var(--muted)' }}>Loading summary...</div>
        ) : d ? (
          <>
            {/* Revenue Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <StatCard label="Revenue YTD" value={fmt(d.revenue_ytd)} sub={`${fmtNum(d.order_count_ytd)} orders`} accent="#0e66b3" />
              <StatCard label="Revenue This Month" value={fmt(d.revenue_month)} sub={`${fmtNum(d.order_count_month)} orders`} accent="#0e66b3" />
              <StatCard label="Revenue This Week" value={fmt(d.revenue_week)} sub={`${fmtNum(d.order_count_week)} orders`} accent="#0e66b3" />
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <StatCard label="Total Orders" value={fmtNum(d.order_count)} accent="#334155" />
              <StatCard label="Avg Order Value" value={fmt(d.avg_order_value)} accent="#334155" />
              <StatCard label="Refund Rate" value={`${d.refund_rate.toFixed(1)}%`} sub={`${fmt(d.refund_total)} refunded (${d.refund_count})`} accent={d.refund_rate > 5 ? '#dc2626' : '#334155'} />
            </div>

            {/* Payment Method Breakdown */}
            {Object.keys(d.payment_methods).length > 0 && (
              <div
                className="rounded-2xl p-6 mb-8"
                style={{ background: 'rgba(255,255,255,0.82)', border: '1px solid var(--divider)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
              >
                <h3 className="text-sm font-black uppercase tracking-wider mb-4" style={{ color: 'var(--muted)' }}>
                  Payment Methods
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {Object.entries(d.payment_methods)
                    .sort(([, a], [, b]) => b - a)
                    .map(([method, amount]) => (
                      <div key={method}>
                        <div className="text-xs font-bold uppercase" style={{ color: 'var(--muted)' }}>
                          {method}
                        </div>
                        <div className="text-lg font-black" style={{ color: 'var(--text)' }}>
                          {fmt(amount)}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </>
        ) : null}

        {/* Sub-page Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subPages.map((page) => (
            <Link
              key={page.href}
              href={page.href}
              className="group rounded-2xl p-6 transition-all hover:scale-[1.01]"
              style={{
                background: 'rgba(255,255,255,0.82)',
                border: '1px solid var(--divider)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              <h3
                className="text-lg font-black mb-1 group-hover:underline"
                style={{ color: 'var(--text)' }}
              >
                {page.label}
              </h3>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>
                {page.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent: string }) {
  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: 'rgba(255,255,255,0.82)', border: '1px solid var(--divider)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
    >
      <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--muted)' }}>
        {label}
      </div>
      <div className="text-2xl font-black" style={{ color: accent }}>
        {value}
      </div>
      {sub && (
        <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
          {sub}
        </div>
      )}
    </div>
  );
}
