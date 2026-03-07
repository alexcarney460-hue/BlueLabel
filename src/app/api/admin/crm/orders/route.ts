import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase-server';
import { requireAdmin } from '@/lib/admin/requireAdmin';

export async function GET(req: Request) {
  const authErr = requireAdmin(req);
  if (authErr) return authErr;

  const supabase = getSupabaseServer();
  if (!supabase)
    return NextResponse.json({ ok: false, error: 'Database unavailable' }, { status: 503 });

  const url = new URL(req.url);
  const email = url.searchParams.get('email') || '';
  const contact_id = url.searchParams.get('contact_id') || '';
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '25', 10)));
  const offset = (page - 1) * limit;

  let query = supabase.from('orders').select('*', { count: 'exact' });

  if (email) query = query.eq('email', email);
  if (contact_id) query = query.eq('email', contact_id); // fallback

  query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

  const { data, count, error } = await query;
  if (error)
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, data, total: count ?? 0, page, limit });
}

export async function POST(req: Request) {
  const authErr = requireAdmin(req);
  if (authErr) return authErr;

  const supabase = getSupabaseServer();
  if (!supabase)
    return NextResponse.json({ ok: false, error: 'Database unavailable' }, { status: 503 });

  const body = await req.json();

  const insert: Record<string, unknown> = {};
  const allowed = ['email', 'status', 'amount_cents', 'currency', 'items', 'provider', 'provider_order_id', 'autoship'];
  for (const key of allowed) {
    if (body[key] !== undefined) insert[key] = body[key];
  }

  const { data, error } = await supabase.from('orders').insert(insert).select().single();
  if (error)
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, data }, { status: 201 });
}
