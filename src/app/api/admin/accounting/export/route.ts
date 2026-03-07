import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase-server';
import { requireAdmin } from '@/lib/admin/requireAdmin';

function escapeCSV(val: string): string {
  if (val.includes(',') || val.includes('"') || val.includes('\n')) {
    return '"' + val.replace(/"/g, '""') + '"';
  }
  return val;
}

export async function GET(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const supabase = getSupabaseServer();
  if (!supabase)
    return NextResponse.json({ ok: false, error: 'Database unavailable' }, { status: 503 });

  const url = new URL(req.url);
  const from = url.searchParams.get('from') || '';
  const to = url.searchParams.get('to') || '';

  let query = supabase
    .from('orders')
    .select('id, status, payload, created_at')
    .order('created_at', { ascending: false });

  if (from) query = query.gte('created_at', from);
  if (to) query = query.lte('created_at', to + 'T23:59:59.999Z');

  const { data: orders, error } = await query;

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  const headers = [
    'Order ID',
    'Date',
    'Status',
    'Customer Name',
    'Customer Email',
    'Customer Phone',
    'Account Type',
    'Subtotal',
    'Items Count',
    'Shipping Address',
    'City',
    'State',
    'Zip',
    'Notes',
  ];

  const rows = (orders ?? []).map((o: any) => {
    const p = o.payload ?? {};
    const c = p.customer ?? {};
    const s = p.shipping ?? {};
    const items = p.items ?? [];
    return [
      String(o.id ?? ''),
      o.created_at ? new Date(o.created_at).toISOString().slice(0, 19) : '',
      o.status ?? '',
      c.name ?? '',
      c.email ?? '',
      c.phone ?? '',
      p.account_type ?? '',
      String(p.subtotal ?? '0'),
      String(items.length),
      s.address1 ?? '',
      s.city ?? '',
      s.state ?? '',
      s.zip ?? '',
      p.notes ?? '',
    ].map(v => escapeCSV(v));
  });

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="orders-${from || 'all'}-${to || 'all'}.csv"`,
    },
  });
}
