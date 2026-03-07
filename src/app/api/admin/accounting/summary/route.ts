import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase-server';
import { requireAdmin } from '@/lib/admin/requireAdmin';

export async function GET(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const supabase = getSupabaseServer();
  if (!supabase)
    return NextResponse.json({ ok: false, error: 'Database unavailable' }, { status: 503 });

  const now = new Date();
  const yearStart = new Date(now.getFullYear(), 0, 1).toISOString();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const weekStart = new Date(now.getTime() - now.getDay() * 86400000);
  weekStart.setHours(0, 0, 0, 0);
  const weekStartISO = weekStart.toISOString();

  const [ordersRes, refundsRes] = await Promise.all([
    supabase.from('orders').select('id, payload, created_at'),
    supabase.from('refunds').select('id, amount, order_id, reason, created_at'),
  ]);

  const orders = ordersRes.data ?? [];
  const refunds = refundsRes.data ?? [];

  let revenueYTD = 0;
  let revenueMonth = 0;
  let revenueWeek = 0;
  let orderCountYTD = 0;
  let orderCountMonth = 0;
  let orderCountWeek = 0;
  const paymentMethods: Record<string, number> = {};

  for (const order of orders) {
    const created = order.created_at ?? '';
    const subtotal = Number(order.payload?.subtotal ?? 0);
    const method = order.payload?.payment_method || 'invoice';

    if (created >= yearStart) {
      revenueYTD += subtotal;
      orderCountYTD++;
    }
    if (created >= monthStart) {
      revenueMonth += subtotal;
      orderCountMonth++;
    }
    if (created >= weekStartISO) {
      revenueWeek += subtotal;
      orderCountWeek++;
    }

    paymentMethods[method] = (paymentMethods[method] ?? 0) + subtotal;
  }

  const totalRefunded = refunds.reduce((s, r) => s + Number(r.amount ?? 0), 0);
  const refundRate = orders.length > 0 ? (refunds.length / orders.length) * 100 : 0;
  const avgOrderValue = orders.length > 0 ? revenueYTD / orderCountYTD : 0;

  return NextResponse.json({
    ok: true,
    data: {
      revenue_ytd: revenueYTD,
      revenue_month: revenueMonth,
      revenue_week: revenueWeek,
      order_count: orders.length,
      order_count_ytd: orderCountYTD,
      order_count_month: orderCountMonth,
      order_count_week: orderCountWeek,
      avg_order_value: avgOrderValue,
      refund_rate: refundRate,
      refund_total: totalRefunded,
      refund_count: refunds.length,
      payment_methods: paymentMethods,
    },
  });
}
