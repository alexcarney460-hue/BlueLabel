import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin/requireAdmin';
import { getSupabaseServer } from '@/lib/supabase-server';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const supabase = getSupabaseServer();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: 'supabase_not_configured' }, { status: 500 });
  }

  const { id } = await params;

  // Verify the item exists and is approved
  const { data: item, error: fetchError } = await supabase
    .from('marketing_content_queue')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError || !item) {
    return NextResponse.json({ ok: false, error: 'item_not_found' }, { status: 404 });
  }

  if (item.status !== 'approved') {
    return NextResponse.json(
      { ok: false, error: 'item_not_approved', current_status: item.status },
      { status: 400 },
    );
  }

  // For now, just mark as posted. Instagram Graph API integration can be added later.
  const { data: updated, error: updateError } = await supabase
    .from('marketing_content_queue')
    .update({
      status: 'posted',
      posted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json({ ok: false, error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, item: updated });
}
