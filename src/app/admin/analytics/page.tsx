'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSupabase } from '@/lib/supabase';

interface KPIs {
  pageview: number;
  click_product: number;
  click_add_to_cart: number;
  click_checkout: number;
  submit_order: number;
}

interface DaySeries {
  day: string;
  count: number;
}

interface AnalyticsData {
  ok: boolean;
  range: number;
  since: string;
  kpis: KPIs;
  series: DaySeries[];
}

const RANGES = [
  { label: '7 days', value: 7 },
  { label: '30 days', value: 30 },
  { label: '90 days', value: 90 },
] as const;

export default function AnalyticsPage() {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [range, setRange] = useState<number>(7);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const supabase = getSupabase();
      const { data } = await supabase.auth.getUser();
      const email = data.user?.email ?? '';
      setAuthorized(email.toLowerCase() === 'gardenablaze@gmail.com');
    })();
  }, []);

  useEffect(() => {
    if (!authorized) return;
    setLoading(true);
    const token = process.env.NEXT_PUBLIC_ADMIN_ANALYTICS_TOKEN;
    fetch(`/api/admin-analytics?range=${range}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [authorized, range]);

  if (authorized === null) return <div className="p-8" style={{ color: 'var(--text)' }}>Loading...</div>;
  if (!authorized) {
    return (
      <div className="p-8">
        <div className="max-w-md">
          <div className="font-black text-xl mb-2" style={{ color: 'var(--text)' }}>Not authorized.</div>
          <a
            href="/login"
            className="inline-block px-4 py-2 rounded-lg font-bold text-white"
            style={{ background: 'var(--brand)' }}
          >
            Sign in
          </a>
        </div>
      </div>
    );
  }

  const kpiCards: { label: string; key: keyof KPIs; color: string }[] = [
    { label: 'Pageviews', key: 'pageview', color: '#0e66b3' },
    { label: 'Product Clicks', key: 'click_product', color: '#0891b2' },
    { label: 'Add to Cart', key: 'click_add_to_cart', color: '#059669' },
    { label: 'Checkouts', key: 'click_checkout', color: '#d97706' },
    { label: 'Orders', key: 'submit_order', color: '#7c3aed' },
  ];

  const series = data?.series ?? [];
  const maxCount = Math.max(1, ...series.map((s) => s.count));

  return (
    <div style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 55%, #eef6ff 100%)' }}>
      <section className="max-w-6xl mx-auto px-4 sm:px-8 pt-10 pb-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <Link
              href="/admin"
              className="text-sm font-semibold mb-1 inline-block hover:underline"
              style={{ color: 'var(--brand)' }}
            >
              &larr; Admin
            </Link>
            <h1 className="text-3xl font-black" style={{ color: 'var(--text)' }}>
              Analytics
            </h1>
          </div>

          {/* Range selector */}
          <div
            className="flex rounded-xl overflow-hidden"
            style={{ border: '1px solid var(--divider)' }}
          >
            {RANGES.map((r) => (
              <button
                key={r.value}
                onClick={() => setRange(r.value)}
                className="px-4 py-2 text-sm font-bold transition-colors"
                style={{
                  background: range === r.value ? 'var(--brand)' : 'rgba(255,255,255,0.8)',
                  color: range === r.value ? '#fff' : 'var(--text)',
                }}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-lg font-semibold" style={{ color: 'var(--muted)' }}>
            Loading analytics...
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
              {kpiCards.map((card) => (
                <div
                  key={card.key}
                  className="rounded-2xl p-5"
                  style={{
                    background: 'rgba(255,255,255,0.82)',
                    border: '1px solid var(--divider)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  }}
                >
                  <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--muted)' }}>
                    {card.label}
                  </div>
                  <div className="text-3xl font-black" style={{ color: card.color }}>
                    {(data?.kpis?.[card.key] ?? 0).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            {/* Bar Chart - Daily Pageviews */}
            <div
              className="rounded-2xl p-6 mb-10"
              style={{
                background: 'rgba(255,255,255,0.82)',
                border: '1px solid var(--divider)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              <h2 className="text-lg font-black mb-6" style={{ color: 'var(--text)' }}>
                Daily Pageviews
              </h2>

              {series.length === 0 ? (
                <div className="text-center py-10" style={{ color: 'var(--muted)' }}>
                  No data for this period.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <svg
                    viewBox={`0 0 ${Math.max(series.length * 28, 200)} 180`}
                    className="w-full"
                    style={{ minWidth: series.length > 14 ? series.length * 28 : 'auto' }}
                    preserveAspectRatio="xMinYMid meet"
                  >
                    {/* Y-axis gridlines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
                      const y = 150 - frac * 140;
                      return (
                        <g key={frac}>
                          <line
                            x1="0"
                            y1={y}
                            x2={series.length * 28}
                            y2={y}
                            stroke="#e2e8f0"
                            strokeWidth="0.5"
                          />
                          <text
                            x="-4"
                            y={y + 3}
                            textAnchor="end"
                            fontSize="8"
                            fill="#94a3b8"
                          >
                            {Math.round(maxCount * frac)}
                          </text>
                        </g>
                      );
                    })}

                    {/* Bars */}
                    {series.map((s, i) => {
                      const barHeight = maxCount > 0 ? (s.count / maxCount) * 140 : 0;
                      const x = i * 28 + 4;
                      const barWidth = 20;
                      const y = 150 - barHeight;

                      return (
                        <g key={s.day}>
                          <rect
                            x={x}
                            y={y}
                            width={barWidth}
                            height={barHeight}
                            rx="3"
                            fill="#0e66b3"
                            opacity={0.85}
                          >
                            <title>
                              {s.day}: {s.count} pageviews
                            </title>
                          </rect>
                          {/* Date label (show every Nth to avoid crowding) */}
                          {(series.length <= 14 || i % Math.ceil(series.length / 14) === 0) && (
                            <text
                              x={x + barWidth / 2}
                              y="166"
                              textAnchor="middle"
                              fontSize="7"
                              fill="#94a3b8"
                            >
                              {s.day.slice(5)}
                            </text>
                          )}
                          {/* Count on top of bar */}
                          {s.count > 0 && (
                            <text
                              x={x + barWidth / 2}
                              y={y - 3}
                              textAnchor="middle"
                              fontSize="7"
                              fontWeight="bold"
                              fill="#0e66b3"
                            >
                              {s.count}
                            </text>
                          )}
                        </g>
                      );
                    })}
                  </svg>
                </div>
              )}
            </div>

            {/* Traffic Sources */}
            <div
              className="rounded-2xl p-6"
              style={{
                background: 'rgba(255,255,255,0.82)',
                border: '1px solid var(--divider)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              <h2 className="text-lg font-black mb-4" style={{ color: 'var(--text)' }}>
                Traffic Sources
              </h2>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>
                Traffic source breakdown will be available once UTM and referrer data accumulates.
                Events are being tracked with referrer, UTM parameters, and user agent data.
              </p>
            </div>
          </>
        )}

        {/* Footer */}
        <footer
          className="mt-16 pt-8 text-center text-sm"
          style={{ borderTop: '1px solid var(--divider)', color: 'var(--muted)' }}
        >
          <div className="font-black" style={{ color: 'var(--text)' }}>Blue Label Wholesale</div>
          <div>&copy; 2026 BlueLabel. All rights reserved.</div>
        </footer>
      </section>
    </div>
  );
}
