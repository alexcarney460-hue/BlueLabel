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
  const contactId = searchParams.get('contact_id') || '';
  const companyId = searchParams.get('company_id') || '';
  const dealId = searchParams.get('deal_id') || '';
  const type = searchParams.get('type') || '';
  const offset = (page - 1) * limit;

  let query = supabase
    .from('activities')
    .select(
      '*, contacts(id, firstname, lastname), companies(id, name), deals(id, name)',
      { count: 'exact' },
    );

  if (contactId) query = query.eq('contact_id', contactId);
  if (companyId) query = query.eq('company_id', companyId);
  if (dealId) query = query.eq('deal_id', dealId);
  if (type) query = query.eq('type', type);

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
    .from('activities')
    .insert(body)
    .select(
      '*, contacts(id, firstname, lastname), companies(id, name), deals(id, name)',
    )
    .single();

  if (error)
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true, data }, { status: 201 });
}
