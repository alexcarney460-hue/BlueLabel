import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase-server';
import { requireAdmin } from '@/lib/admin/requireAdmin';

export async function GET(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const supabase = getSupabaseServer();
  if (!supabase)
    return NextResponse.json({ ok: false, error: 'Database unavailable' }, { status: 503 });

  const url = new URL(req.url);
  const search = url.searchParams.get('search') || '';
  const from = url.searchParams.get('from') || '';
  const to = url.searchParams.get('to') || '';
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '25', 10)));
  const offset = (page - 1) * limit;

  let query = supabase
    .from('orders')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (from) query = query.gte('created_at', from);
  if (to) query = query.lte('created_at', to + 'T23:59:59.999Z');

  const { data: orders, count, error } = await query;

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  // Client-side search filter on payload fields
  let filtered = orders ?? [];
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter((o: any) => {
      const p = o.payload ?? {};
      const name = (p.customer?.name ?? '').toLowerCase();
      const email = (p.customer?.email ?? '').toLowerCase();
      const id = String(o.id ?? '').toLowerCase();
      return name.includes(q) || email.includes(q) || id.includes(q);
    });
  }

  return NextResponse.json({
    ok: true,
    orders: filtered,
    total: search ? filtered.length : (count ?? 0),
    page,
    limit,
  });
}
