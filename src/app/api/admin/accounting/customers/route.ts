import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase-server';
import { requireAdmin } from '@/lib/admin/requireAdmin';

export async function GET(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const supabase = getSupabaseServer();
  if (!supabase)
    return NextResponse.json({ ok: false, error: 'Database unavailable' }, { status: 503 });

  const { data: orders } = await supabase.from('orders').select('payload, created_at');

  const customerMap: Record<string, {
    email: string;
    name: string;
    order_count: number;
    total_spent: number;
    first_order: string;
    last_order: string;
    account_type: string;
  }> = {};

  for (const order of orders ?? []) {
    const p = order.payload ?? {};
    const email = (p.customer?.email ?? '').toLowerCase().trim();
    if (!email) continue;

    if (!customerMap[email]) {
      customerMap[email] = {
        email,
        name: p.customer?.name ?? '',
        order_count: 0,
        total_spent: 0,
        first_order: order.created_at,
        last_order: order.created_at,
        account_type: p.account_type ?? '',
      };
    }

    const c = customerMap[email];
    c.order_count++;
    c.total_spent += Number(p.subtotal ?? 0);
    if (!c.name && p.customer?.name) c.name = p.customer.name;
    if (order.created_at < c.first_order) c.first_order = order.created_at;
    if (order.created_at > c.last_order) c.last_order = order.created_at;
    if (!c.account_type && p.account_type) c.account_type = p.account_type;
  }

  const customers = Object.values(customerMap).sort((a, b) => b.total_spent - a.total_spent);
  const repeatCustomers = customers.filter(c => c.order_count > 1).length;
  const repeatRate = customers.length > 0 ? (repeatCustomers / customers.length) * 100 : 0;
  const avgLTV = customers.length > 0
    ? customers.reduce((s, c) => s + c.total_spent, 0) / customers.length
    : 0;

  return NextResponse.json({
    ok: true,
    customers,
    unique_customers: customers.length,
    repeat_customers: repeatCustomers,
    repeat_rate: repeatRate,
    avg_ltv: avgLTV,
  });
}
