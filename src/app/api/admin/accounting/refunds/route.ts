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
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '25', 10)));
  const offset = (page - 1) * limit;

  const { data: refunds, count, error } = await supabase
    .from('refunds')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  // Compute total refunded across ALL refunds (not just current page)
  const { data: allRefunds } = await supabase.from('refunds').select('amount');
  const totalRefunded = (allRefunds ?? []).reduce((s, r) => s + Number(r.amount ?? 0), 0);

  return NextResponse.json({
    ok: true,
    refunds: refunds ?? [],
    total: count ?? 0,
    total_refunded: totalRefunded,
    page,
    limit,
  });
}
