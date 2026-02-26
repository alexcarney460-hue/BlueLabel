import { NextResponse } from 'next/server';

function daysAgoIso(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

export async function GET(req: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const adminToken = process.env.ADMIN_ANALYTICS_TOKEN;

  if (!url || !key || !adminToken) {
    return NextResponse.json({ error: 'missing_env' }, { status: 500 });
  }

  const auth = req.headers.get('authorization') || '';
  if (auth !== `Bearer ${adminToken}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const rangeRaw = searchParams.get('range') || '7';
  const range = rangeRaw === '30' ? 30 : 7;
  const since = daysAgoIso(range);

  async function countType(event_type: string) {
    const q = new URL(`${url}/rest/v1/events`);
    q.searchParams.set('select', 'id');
    q.searchParams.set('event_type', `eq.${event_type}`);
    q.searchParams.set('created_at', `gte.${since}`);

    const res = await fetch(q.toString(), {
      headers: {
        apikey: key as string,
        Authorization: `Bearer ${key}`,
        Prefer: 'count=exact,head=true',
      } as HeadersInit,
    });

    if (!res.ok) return 0;
    const cr = res.headers.get('content-range') || '';
    const m = cr.match(/\/(\d+)$/);
    return m ? Number(m[1]) : 0;
  }

  const types = ['pageview', 'click_product', 'click_add_to_cart', 'click_checkout', 'submit_order'];
  const kpisEntries = await Promise.all(types.map(async (t) => [t, await countType(t)] as const));
  const kpis = Object.fromEntries(kpisEntries);

  // pageview timestamps for daily series
  const q2 = new URL(`${url}/rest/v1/events`);
  q2.searchParams.set('select', 'created_at');
  q2.searchParams.set('event_type', 'eq.pageview');
  q2.searchParams.set('created_at', `gte.${since}`);

  const res2 = await fetch(q2.toString(), {
    headers: {
      apikey: key as string,
      Authorization: `Bearer ${key}`,
    } as HeadersInit,
  });

  const rows: Array<{ created_at: string }> = res2.ok ? await res2.json() : [];
  const byDay = new Map<string, number>();
  for (const r of rows) {
    const day = new Date(r.created_at).toISOString().slice(0, 10);
    byDay.set(day, (byDay.get(day) ?? 0) + 1);
  }

  const series: Array<{ day: string; count: number }> = [];
  for (let i = range - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    const day = d.toISOString().slice(0, 10);
    series.push({ day, count: byDay.get(day) ?? 0 });
  }

  return NextResponse.json({ ok: true, range, since, kpis, series });
}
