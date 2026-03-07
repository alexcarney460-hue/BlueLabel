import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase-server';
import { requireAdmin } from '@/lib/admin/requireAdmin';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: Request, ctx: Ctx) {
  const authErr = requireAdmin(req);
  if (authErr) return authErr;

  const supabase = getSupabaseServer();
  if (!supabase)
    return NextResponse.json(
      { ok: false, error: 'Database unavailable' },
      { status: 503 },
    );

  const { id } = await ctx.params;

  const { data, error } = await supabase
    .from('contacts')
    .select('*, companies(id, name), activities!activities_contact_id_fkey(*), deals!deals_contact_id_fkey(*)')
    .eq('id', id)
    .single();

  if (error)
    return NextResponse.json({ ok: false, error: error.message }, { status: 404 });

  return NextResponse.json({ ok: true, data });
}

export async function PATCH(req: Request, ctx: Ctx) {
  const authErr = requireAdmin(req);
  if (authErr) return authErr;

  const supabase = getSupabaseServer();
  if (!supabase)
    return NextResponse.json(
      { ok: false, error: 'Database unavailable' },
      { status: 503 },
    );

  const { id } = await ctx.params;
  const body = await req.json();

  const { data, error } = await supabase
    .from('contacts')
    .update(body)
    .eq('id', id)
    .select('*, companies(id, name)')
    .single();

  if (error)
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true, data });
}

export async function DELETE(req: Request, ctx: Ctx) {
  const authErr = requireAdmin(req);
  if (authErr) return authErr;

  const supabase = getSupabaseServer();
  if (!supabase)
    return NextResponse.json(
      { ok: false, error: 'Database unavailable' },
      { status: 503 },
    );

  const { id } = await ctx.params;

  const { error } = await supabase
    .from('contacts')
    .delete()
    .eq('id', id);

  if (error)
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}
