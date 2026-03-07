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

interface Customer {
  email: string;
  name: string;
  order_count: number;
  total_spent: number;
  first_order: string;
  last_order: string;
  account_type: string;
}

export default function CustomersPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [uniqueCustomers, setUniqueCustomers] = useState(0);
  const [repeatRate, setRepeatRate] = useState(0);
  const [avgLTV, setAvgLTV] = useState(0);
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
        const json = await accountingFetch('/api/admin/accounting/customers');
        if (!json.ok) throw new Error(json.error || 'Failed');
        setCustomers(json.customers);
        setUniqueCustomers(json.unique_customers);
        setRepeatRate(json.repeat_rate);
        setAvgLTV(json.avg_ltv);
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
          <h1 className="text-2xl sm:text-3xl font-black" style={{ color: 'var(--text)' }}>Customer Analytics</h1>
        </div>

        {error && (
          <div className="rounded-xl p-4 mb-6 text-red-800 bg-red-50 border border-red-200 text-sm font-medium">{error}</div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.82)', border: '1px solid var(--divider)' }}>
            <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--muted)' }}>Unique Customers</div>
            <div className="text-2xl font-black" style={{ color: '#0e66b3' }}>{fmtNum(uniqueCustomers)}</div>
          </div>
          <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.82)', border: '1px solid var(--divider)' }}>
            <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--muted)' }}>Repeat Rate</div>
            <div className="text-2xl font-black" style={{ color: 'var(--text)' }}>{repeatRate.toFixed(1)}%</div>
          </div>
          <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.82)', border: '1px solid var(--divider)' }}>
            <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--muted)' }}>Avg Lifetime Value</div>
            <div className="text-2xl font-black" style={{ color: 'var(--text)' }}>{fmt(avgLTV)}</div>
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
                    <th className="text-left px-4 py-3 font-bold text-xs uppercase" style={{ color: 'var(--muted)' }}>Customer</th>
                    <th className="text-left px-4 py-3 font-bold text-xs uppercase" style={{ color: 'var(--muted)' }}>Account Type</th>
                    <th className="text-right px-4 py-3 font-bold text-xs uppercase" style={{ color: 'var(--muted)' }}>Orders</th>
                    <th className="text-right px-4 py-3 font-bold text-xs uppercase" style={{ color: 'var(--muted)' }}>Total Spent</th>
                    <th className="text-left px-4 py-3 font-bold text-xs uppercase" style={{ color: 'var(--muted)' }}>First Order</th>
                    <th className="text-left px-4 py-3 font-bold text-xs uppercase" style={{ color: 'var(--muted)' }}>Last Order</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c) => (
                    <tr key={c.email} style={{ borderBottom: '1px solid var(--divider)' }} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3">
                        <div className="font-medium" style={{ color: 'var(--text)' }}>{c.name || '-'}</div>
                        <div className="text-xs" style={{ color: 'var(--muted)' }}>{c.email}</div>
                      </td>
                      <td className="px-4 py-3">
                        {c.account_type ? (
                          <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                            {c.account_type}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="px-4 py-3 text-right font-medium" style={{ color: 'var(--text)' }}>
                        {c.order_count}
                        {c.order_count > 1 && (
                          <span className="ml-1 text-xs text-emerald-600 font-bold">repeat</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right font-bold" style={{ color: 'var(--text)' }}>{fmt(c.total_spent)}</td>
                      <td className="px-4 py-3" style={{ color: 'var(--muted)' }}>{fmtDate(c.first_order)}</td>
                      <td className="px-4 py-3" style={{ color: 'var(--muted)' }}>{fmtDate(c.last_order)}</td>
                    </tr>
                  ))}
                  {customers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center" style={{ color: 'var(--muted)' }}>No customer data found</td>
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
