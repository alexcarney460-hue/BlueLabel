'use client';

import { useEffect, useMemo, useState } from 'react';
import Header from '@/app/Header';
import { getSupabase } from '@/lib/supabase';
import { track } from '@/app/Track';

// Requires env:
// - NEXT_PUBLIC_ADMIN_ANALYTICS_TOKEN (client)
// - ADMIN_ANALYTICS_TOKEN (server)

type Row = { day: string; count: number };

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function Admin() {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [range, setRange] = useState<7 | 30>(7);
  const [kpis, setKpis] = useState<Record<string, number>>({});
  const [series, setSeries] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [diag, setDiag] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const supabase = getSupabase();
      const { data } = await supabase.auth.getUser();
      const email = data.user?.email ?? '';
      setAuthorized(email.toLowerCase() === 'gardenablaze@gmail.com');
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!authorized) return;

      setLoading(true);
      setError(null);

      const token = process.env.NEXT_PUBLIC_ADMIN_ANALYTICS_TOKEN;
      if (!token) {
        setError('Missing NEXT_PUBLIC_ADMIN_ANALYTICS_TOKEN');
        setLoading(false);
        return;
      }

      try {
        const [res, diagRes] = await Promise.all([
          fetch(`/api/admin-analytics?range=${range}`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/debug-analytics-env'),
        ]);

        if (!diagRes.ok) {
          setDiag(null);
        } else {
          setDiag(await diagRes.json());
        }

        if (!res.ok) {
          setError(`Analytics API error: ${res.status}`);
          setLoading(false);
          return;
        }

        const json = await res.json();
        setKpis(json.kpis ?? {});
        setSeries(json.series ?? []);
        setLoading(false);
      } catch (e: any) {
        setError('Analytics fetch failed');
        setLoading(false);
      }
    })();
  }, [authorized, range]);

  const max = useMemo(() => Math.max(1, ...series.map((s) => s.count)), [series]);

  if (authorized === null) return <div className="p-8">Loading…</div>;
  if (!authorized) {
    return (
      <div className="p-8">
        <div className="max-w-md">
          <div className="font-black text-xl mb-2">Not authorized.</div>
          <a href="/login" className="inline-block px-4 py-2 rounded-lg font-bold" style={{ background: 'var(--brand)', color: 'white' }}>Sign in</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans" style={{ background: 'var(--bg)' }}>
      {/* Banner */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-sky-500 via-sky-300 to-sky-500 text-white h-8 sm:h-auto sm:py-3 px-3 sm:px-8 text-center font-semibold overflow-hidden text-xs sm:text-base">
        <div className="max-w-6xl mx-auto h-8 sm:h-auto flex items-center justify-center whitespace-nowrap overflow-hidden text-ellipsis sm:whitespace-normal sm:overflow-visible sm:text-clip">
          Admin analytics — live event tracking
        </div>
      </div>

      <div className="sticky top-8 sm:top-12 z-50">
        <Header />
      </div>

      <section className="pt-20 sm:pt-28 pb-16 px-4 sm:px-8" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 55%, #eef6ff 100%)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black" style={{ color: 'var(--text)' }}>Admin Analytics</h1>
              <div style={{ color: 'var(--muted)' }}>Performance + event tracking</div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <a href="/admin/settings" className="px-4 py-2 rounded-lg border font-bold" style={{ borderColor: 'var(--divider)' }}>Settings</a>
              <button
                onClick={() => setRange(7)}
                className={`px-4 py-2 rounded-lg border font-bold ${range===7 ? 'text-white' : 'bg-white'}`}
                style={range===7 ? { background: 'var(--brand)' } : { borderColor: 'var(--divider)' }}
              >
                7d
              </button>
              <button
                onClick={() => setRange(30)}
                className={`px-4 py-2 rounded-lg border font-bold ${range===30 ? 'text-white' : 'bg-white'}`}
                style={range===30 ? { background: 'var(--brand)' } : { borderColor: 'var(--divider)' }}
              >
                30d
              </button>
              <button
                onClick={() => track('admin_test_event', { meta: { source: 'admin' } })}
                className="px-4 py-2 rounded-lg font-bold"
                style={{ background: 'var(--brand)', color: 'white' }}
              >
                Test event
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-2xl p-4 mb-6" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <div className="font-black" style={{ color: 'var(--text)' }}>Analytics error</div>
              <div className="text-sm" style={{ color: 'var(--muted)' }}>{error}</div>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
            {['pageview','click_product','click_add_to_cart','click_checkout','submit_order'].map((k) => (
              <div key={k} className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.78)', border: '1px solid var(--divider)', boxShadow: 'var(--shadow-sm)' }}>
                <div className="text-xs uppercase font-bold" style={{ color: 'var(--muted)' }}>{k}</div>
                <div className="text-2xl font-black" style={{ color: 'var(--text)' }}>{kpis[k] ?? 0}</div>
              </div>
            ))}
          </div>

          <div className="rounded-3xl p-6" style={{ background: 'rgba(255,255,255,0.78)', border: '1px solid var(--divider)', boxShadow: 'var(--shadow-md)' }}>
            <div className="font-black mb-3" style={{ color: 'var(--text)' }}>Pageviews (daily)</div>
            <div className="flex items-end gap-1 h-36">
              {series.map((p) => (
                <div key={p.day} className="flex-1">
                  <div className="w-full rounded-t" style={{ height: `${(p.count / max) * 100}%`, background: 'linear-gradient(180deg, #3a86c9, #0e66b3)' }} />
                </div>
              ))}
            </div>
            <div className="text-xs mt-2" style={{ color: 'var(--muted)' }}>Last {range} days</div>
          </div>

          {diag && (
            <div className="mt-6 rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.78)', border: '1px solid var(--divider)' }}>
              <div className="font-black" style={{ color: 'var(--text)' }}>Diagnostics</div>
              <div className="text-sm" style={{ color: 'var(--muted)' }}>
                Supabase URL: {String(diag.hasSupabaseUrl)} · Service Role: {String(diag.hasServiceRole)} · Admin Token: {String(diag.hasAdminToken)} · Public Token: {String(diag.hasPublicToken)} · Tokens Match: {String(diag.tokensMatch)}
              </div>
              <div className="text-xs mt-2" style={{ color: 'var(--muted)' }}>
                If KPIs are zero, use “Test event” to generate a sample event and refresh.
              </div>
            </div>
          )}
        </div>
      </section>

      <footer className="py-10 px-4 sm:px-8" style={{ background: 'var(--bg)', color: 'var(--muted)', borderTop: '1px solid var(--divider)' }}>
        <div className="max-w-6xl mx-auto text-center">
          <div className="font-black" style={{ color: 'var(--text)' }}>Blue Label Wholesale</div>
          <div className="text-sm">© 2026 BlueLabel. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
