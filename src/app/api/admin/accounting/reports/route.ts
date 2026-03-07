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
  const from = url.searchParams.get('from') || '';
  const to = url.searchParams.get('to') || '';

  if (!from || !to) {
    return NextResponse.json({ ok: false, error: 'Missing from/to date params' }, { status: 400 });
  }

  const [ordersRes, refundsRes] = await Promise.all([
    supabase
      .from('orders')
      .select('id, payload, status, created_at')
      .gte('created_at', from)
      .lte('created_at', to + 'T23:59:59.999Z')
      .order('created_at', { ascending: false }),
    supabase
      .from('refunds')
      .select('id, amount, order_id, reason, created_at')
      .gte('created_at', from)
      .lte('created_at', to + 'T23:59:59.999Z'),
  ]);

  const orders = ordersRes.data ?? [];
  const refunds = refundsRes.data ?? [];

  const totalRevenue = orders.reduce((s, o) => s + Number(o.payload?.subtotal ?? 0), 0);
  const totalRefunded = refunds.reduce((s, r) => s + Number(r.amount ?? 0), 0);
  const netRevenue = totalRevenue - totalRefunded;

  // Daily breakdown
  const dailyMap: Record<string, { orders: number; revenue: number }> = {};
  for (const order of orders) {
    const day = (order.created_at ?? '').slice(0, 10);
    if (!dailyMap[day]) dailyMap[day] = { orders: 0, revenue: 0 };
    dailyMap[day].orders++;
    dailyMap[day].revenue += Number(order.payload?.subtotal ?? 0);
  }
  const daily = Object.entries(dailyMap)
    .map(([date, stats]) => ({ date, ...stats }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Top products in range
  const productRevenue: Record<string, { name: string; units: number; revenue: number }> = {};
  for (const order of orders) {
    const items = order.payload?.items ?? [];
    for (const item of items) {
      const pid = item.id || item.product_id || 'unknown';
      if (!productRevenue[pid]) productRevenue[pid] = { name: item.name ?? pid, units: 0, revenue: 0 };
      const qty = Number(item.quantity ?? 1);
      productRevenue[pid].units += qty;
      productRevenue[pid].revenue += qty * Number(item.price ?? 0);
    }
  }
  const topProducts = Object.entries(productRevenue)
    .map(([id, stats]) => ({ id, ...stats }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  return NextResponse.json({
    ok: true,
    from,
    to,
    total_orders: orders.length,
    total_revenue: totalRevenue,
    total_refunded: totalRefunded,
    net_revenue: netRevenue,
    refund_count: refunds.length,
    avg_order_value: orders.length > 0 ? totalRevenue / orders.length : 0,
    daily,
    top_products: topProducts,
  });
}
