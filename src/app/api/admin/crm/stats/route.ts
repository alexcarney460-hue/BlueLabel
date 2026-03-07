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

  const [
    contactsRes,
    companiesRes,
    dealsRes,
    contactsByStatusRes,
    contactsByStageRes,
    dealsByStageRes,
    recentActivitiesRes,
  ] = await Promise.all([
    supabase.from('contacts').select('id', { count: 'exact', head: true }),
    supabase.from('companies').select('id', { count: 'exact', head: true }),
    supabase.from('deals').select('id', { count: 'exact', head: true }),
    supabase.from('contacts').select('lead_status'),
    supabase.from('contacts').select('lifecycle_stage'),
    supabase.from('deals').select('stage, amount'),
    supabase
      .from('activities')
      .select('*, contacts(firstname, lastname), companies(name)')
      .order('created_at', { ascending: false })
      .limit(20),
  ]);

  // Aggregate contacts by lead_status
  const contactsByStatus: Record<string, number> = {};
  for (const c of contactsByStatusRes.data ?? []) {
    const s = c.lead_status || 'unknown';
    contactsByStatus[s] = (contactsByStatus[s] ?? 0) + 1;
  }

  // Aggregate contacts by lifecycle_stage
  const contactsByStage: Record<string, number> = {};
  for (const c of contactsByStageRes.data ?? []) {
    const s = c.lifecycle_stage || 'unknown';
    contactsByStage[s] = (contactsByStage[s] ?? 0) + 1;
  }

  // Aggregate deals by stage
  const dealsByStage: Record<string, { count: number; total_amount: number }> = {};
  for (const d of dealsByStageRes.data ?? []) {
    const s = d.stage || 'unknown';
    if (!dealsByStage[s]) dealsByStage[s] = { count: 0, total_amount: 0 };
    dealsByStage[s].count += 1;
    dealsByStage[s].total_amount += Number(d.amount ?? 0);
  }

  return NextResponse.json({
    ok: true,
    data: {
      totals: {
        contacts: contactsRes.count ?? 0,
        companies: companiesRes.count ?? 0,
        deals: dealsRes.count ?? 0,
      },
      contacts_by_status: contactsByStatus,
      contacts_by_stage: contactsByStage,
      deals_by_stage: dealsByStage,
      recent_activities: recentActivitiesRes.data ?? [],
    },
  });
}
