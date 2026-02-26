'use client';

import { useEffect, useMemo, useState } from 'react';
import { getSupabase } from '@/lib/supabase';

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
      const since = daysAgo(range).toISOString();

      const types = [
        'pageview',
        'click_product',
        'click_add_to_cart',
        'click_checkout',
        'submit_order',
      ];

      const next: Record<string, number> = {};
      const supabase = getSupabase();

      for (const t of types) {
        const { count } = await supabase
          .from('events')
          .select('*', { count: 'exact', head: true })
          .eq('event_type', t)
          .gte('created_at', since);
        next[t] = count ?? 0;
      }
      setKpis(next);

      // daily pageviews series
      const { data: rows } = await supabase
        .from('events')
        .select('created_at')
        .eq('event_type', 'pageview')
        .gte('created_at', since);

      const byDay = new Map<string, number>();
      (rows ?? []).forEach((r: any) => {
        const day = new Date(r.created_at).toISOString().slice(0, 10);
        byDay.set(day, (byDay.get(day) ?? 0) + 1);
      });

      const out: Row[] = [];
      for (let i = range - 1; i >= 0; i--) {
        const day = daysAgo(i).toISOString().slice(0, 10);
        out.push({ day, count: byDay.get(day) ?? 0 });
      }
      setSeries(out);
    })();
  }, [authorized, range]);

  const max = useMemo(() => Math.max(1, ...series.map((s) => s.count)), [series]);

  if (authorized === null) return <div className="p-8">Loading…</div>;
  if (!authorized) return <div className="p-8">Not authorized.</div>;

  return (
    <div className="min-h-screen bg-white p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-black">Admin</h1>
          <div className="flex gap-2">
            <button onClick={() => setRange(7)} className={`px-4 py-2 rounded-lg border font-bold ${range===7?'bg-slate-900 text-white':'bg-white'}`}>7d</button>
            <button onClick={() => setRange(30)} className={`px-4 py-2 rounded-lg border font-bold ${range===30?'bg-slate-900 text-white':'bg-white'}`}>30d</button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
          {['pageview','click_product','click_add_to_cart','click_checkout','submit_order'].map((k) => (
            <div key={k} className="border rounded-xl p-4">
              <div className="text-xs text-slate-500 uppercase font-bold">{k}</div>
              <div className="text-2xl font-black">{kpis[k] ?? 0}</div>
            </div>
          ))}
        </div>

        <div className="border rounded-2xl p-4">
          <div className="font-bold mb-3">Pageviews (daily)</div>
          <div className="flex items-end gap-1 h-32">
            {series.map((p) => (
              <div key={p.day} className="flex-1">
                <div className="w-full bg-amber-500/80 rounded-t" style={{ height: `${(p.count / max) * 100}%` }} />
              </div>
            ))}
          </div>
          <div className="text-xs text-slate-500 mt-2">Last {range} days</div>
        </div>
      </div>
    </div>
  );
}
