import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase-server';
import { requireAdmin } from '@/lib/admin/requireAdmin';

export async function GET(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const supabase = getSupabaseServer();
  if (!supabase)
    return NextResponse.json({ ok: false, error: 'Database unavailable' }, { status: 503 });

  // Fetch all orders and products
  const [ordersRes, productsRes] = await Promise.all([
    supabase.from('orders').select('payload'),
    supabase.from('products').select('id, name, price, active'),
  ]);

  const orders = ordersRes.data ?? [];
  const products = productsRes.data ?? [];

  // Build revenue map from order items in payloads
  const revenueMap: Record<string, { units: number; revenue: number }> = {};

  for (const order of orders) {
    const items = order.payload?.items ?? [];
    for (const item of items) {
      const pid = item.id || item.product_id || 'unknown';
      if (!revenueMap[pid]) revenueMap[pid] = { units: 0, revenue: 0 };
      const qty = Number(item.quantity ?? 1);
      const price = Number(item.price ?? 0);
      revenueMap[pid].units += qty;
      revenueMap[pid].revenue += qty * price;
    }
  }

  // Also check order_items table if it exists
  const { data: orderItems } = await supabase.from('order_items').select('product_id, quantity, unit_price');
  if (orderItems && orderItems.length > 0) {
    for (const item of orderItems) {
      const pid = item.product_id || 'unknown';
      if (!revenueMap[pid]) revenueMap[pid] = { units: 0, revenue: 0 };
      revenueMap[pid].units += Number(item.quantity ?? 1);
      revenueMap[pid].revenue += Number(item.quantity ?? 1) * Number(item.unit_price ?? 0);
    }
  }

  // Merge with product info
  const productMap = new Map(products.map((p: any) => [p.id, p]));
  const result = Object.entries(revenueMap)
    .map(([id, stats]) => {
      const product = productMap.get(id);
      return {
        id,
        name: product?.name ?? id,
        price: product?.price ?? null,
        active: product?.active ?? null,
        units_sold: stats.units,
        total_revenue: stats.revenue,
      };
    })
    .sort((a, b) => b.total_revenue - a.total_revenue);

  return NextResponse.json({
    ok: true,
    products: result,
    total_revenue: result.reduce((s, p) => s + p.total_revenue, 0),
    total_units: result.reduce((s, p) => s + p.units_sold, 0),
  });
}
