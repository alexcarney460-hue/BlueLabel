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

  const url = new URL(req.url);
  const contact_id = url.searchParams.get('contact_id');
  const channel = url.searchParams.get('channel');
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const limit = parseInt(url.searchParams.get('limit') || '50', 10);
  const offset = (page - 1) * limit;

  let query = supabase
    .from('communications')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (contact_id) query = query.eq('contact_id', contact_id);
  if (channel) query = query.eq('channel', channel);

  const { data, error, count } = await query;

  if (error)
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true, data, meta: { page, limit, total: count } });
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
  const { contact_id, company_id, channel, direction, subject, body: commBody, status, scheduled_at } = body;

  if (!contact_id || !channel || !direction) {
    return NextResponse.json(
      { ok: false, error: 'contact_id, channel, and direction are required' },
      { status: 400 },
    );
  }

  const insert: Record<string, any> = {
    contact_id,
    channel,
    direction,
    subject: subject || null,
    body: commBody || null,
    status: status || 'completed',
  };
  if (company_id) insert.company_id = company_id;
  if (scheduled_at) insert.scheduled_at = scheduled_at;
  if (status === 'completed' || !status) insert.completed_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('communications')
    .insert(insert)
    .select()
    .single();

  if (error)
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true, data }, { status: 201 });
}
