import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase-server';
import { requireAdmin } from '@/lib/admin/requireAdmin';

export async function GET(req: Request) {
  const authErr = requireAdmin(req);
  if (authErr) return authErr;

  const supabase = getSupabaseServer();
  if (!supabase)
    return NextResponse.json(
      { ok: false, error: 'Database unavailable' },
      { status: 503 },
    );

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get('page') || '1'));
  const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit') || '25')));
  const search = searchParams.get('search') || '';
  const leadStatus = searchParams.get('lead_status') || '';
  const lifecycleStage = searchParams.get('lifecycle_stage') || '';
  const source = searchParams.get('source') || '';
  const offset = (page - 1) * limit;

  let query = supabase
    .from('contacts')
    .select('*, companies(id, name)', { count: 'exact' });

  if (search) {
    query = query.or(
      `firstname.ilike.%${search}%,lastname.ilike.%${search}%,email.ilike.%${search}%`,
    );
  }
  if (leadStatus) query = query.eq('lead_status', leadStatus);
  if (lifecycleStage) query = query.eq('lifecycle_stage', lifecycleStage);
  if (source) query = query.eq('source', source);

  query = query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  const { data, count, error } = await query;

  if (error)
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  return NextResponse.json({
    ok: true,
    data,
    total: count ?? 0,
    page,
    limit,
  });
}

export async function POST(req: Request) {
  const authErr = requireAdmin(req);
  if (authErr) return authErr;

  const supabase = getSupabaseServer();
  if (!supabase)
    return NextResponse.json(
      { ok: false, error: 'Database unavailable' },
      { status: 503 },
    );

  const body = await req.json();

  const { data, error } = await supabase
    .from('contacts')
    .insert(body)
    .select('*, companies(id, name)')
    .single();

  if (error)
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true, data }, { status: 201 });
}
