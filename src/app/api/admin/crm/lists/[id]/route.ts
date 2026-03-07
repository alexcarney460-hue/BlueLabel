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

  const { data: list, error: listError } = await supabase
    .from('lists')
    .select('*')
    .eq('id', id)
    .single();

  if (listError)
    return NextResponse.json(
      { ok: false, error: listError.message },
      { status: 404 },
    );

  const { data: members, error: membersError } = await supabase
    .from('list_members')
    .select('*, contacts(id, firstname, lastname, email, company_id, companies(id, name))')
    .eq('list_id', id)
    .order('created_at', { ascending: false });

  if (membersError)
    return NextResponse.json(
      { ok: false, error: membersError.message },
      { status: 500 },
    );

  return NextResponse.json({
    ok: true,
    data: { ...list, members: members ?? [] },
  });
}

export async function POST(req: Request, ctx: Ctx) {
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

  // body should be { contact_ids: number[] }
  const contactIds: number[] = body.contact_ids ?? [];
  if (!contactIds.length)
    return NextResponse.json(
      { ok: false, error: 'contact_ids required' },
      { status: 400 },
    );

  const rows = contactIds.map((contact_id) => ({
    list_id: Number(id),
    contact_id,
  }));

  const { data, error } = await supabase
    .from('list_members')
    .upsert(rows, { onConflict: 'list_id,contact_id', ignoreDuplicates: true })
    .select();

  if (error)
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true, data }, { status: 201 });
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

  // If contact_ids in query string, remove specific members; otherwise delete the list itself
  const { searchParams } = new URL(req.url);
  const contactIdsParam = searchParams.get('contact_ids');

  if (contactIdsParam) {
    const contactIds = contactIdsParam.split(',').map(Number);
    const { error } = await supabase
      .from('list_members')
      .delete()
      .eq('list_id', id)
      .in('contact_id', contactIds);

    if (error)
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 400 },
      );

    return NextResponse.json({ ok: true });
  }

  // Delete the entire list (members cascade or handled by FK)
  const { error } = await supabase
    .from('lists')
    .delete()
    .eq('id', id);

  if (error)
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}
