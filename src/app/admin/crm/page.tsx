'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';
import StatCard from './components/StatCard';
import { crmFetch } from './components/api';

interface StatsData {
  totals: { contacts: number; companies: number; deals: number };
  contacts_by_status: Record<string, number>;
  contacts_by_stage: Record<string, number>;
  deals_by_stage: Record<string, { count: number; total_amount: number }>;
  recent_activities: any[];
}

const STAGE_ORDER = ['discovery', 'proposal', 'negotiation', 'closed_won', 'closed_lost'];
const STAGE_COLORS: Record<string, string> = {
  discovery: 'bg-blue-500',
  proposal: 'bg-indigo-500',
  negotiation: 'bg-amber-500',
  closed_won: 'bg-emerald-500',
  closed_lost: 'bg-red-500',
};

export default function CRMDashboard() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const supabase = getSupabase();
      const { data } = await supabase.auth.getUser();
      if (data.user?.email?.toLowerCase() !== 'gardenablaze@gmail.com') {
        router.push('/admin');
        return;
      }
      setAuthorized(true);
    })();
  }, [router]);

  useEffect(() => {
    if (!authorized) return;
    (async () => {
      setLoading(true);
      try {
        const json = await crmFetch('/api/admin/crm/stats');
        if (json.ok) {
          setStats(json.data);
        } else {
          setError(json.error || 'Failed to load stats');
        }
      } catch {
        setError('Failed to connect to API');
      } finally {
        setLoading(false);
      }
    })();
  }, [authorized]);

  if (!authorized) return null;

  const openDealsValue = stats
    ? Object.entries(stats.deals_by_stage)
        .filter(([stage]) => !['closed_won', 'closed_lost'].includes(stage))
        .reduce((sum, [, v]) => sum + v.total_amount, 0)
    : 0;

  const totalStatusCount = stats
    ? Object.values(stats.contacts_by_status).reduce((s, v) => s + v, 0)
    : 1;

  const totalStageCount = stats
    ? Object.values(stats.contacts_by_stage).reduce((s, v) => s + v, 0)
    : 1;

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">CRM Dashboard</h1>
        <p className="text-sm text-slate-400 mt-1">Overview of your customer relationships</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-slate-400 text-sm">Loading dashboard...</div>
        </div>
      ) : stats ? (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Contacts"
              value={stats.totals.contacts.toLocaleString()}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
            />
            <StatCard
              label="Companies"
              value={stats.totals.companies.toLocaleString()}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              }
            />
            <StatCard
              label="Total Deals"
              value={stats.totals.deals.toLocaleString()}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
            />
            <StatCard
              label="Open Deals Value"
              value={`$${openDealsValue.toLocaleString()}`}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
          </div>

          {/* Lead status distribution */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-base font-bold text-white mb-4">Lead Status Distribution</h2>
            <div className="space-y-3">
              {Object.entries(stats.contacts_by_status)
                .sort(([, a], [, b]) => b - a)
                .map(([status, count]) => (
                  <div key={status}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-300 capitalize">{status.replace(/_/g, ' ')}</span>
                      <span className="text-sm text-slate-400">{count}</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-sky-500 rounded-full transition-all"
                        style={{ width: `${(count / totalStatusCount) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Lifecycle stage funnel */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-base font-bold text-white mb-4">Lifecycle Stage Funnel</h2>
              <div className="space-y-2">
                {Object.entries(stats.contacts_by_stage)
                  .sort(([, a], [, b]) => b - a)
                  .map(([stage, count]) => (
                    <div key={stage} className="flex items-center gap-3">
                      <div className="w-32 text-sm text-slate-300 capitalize truncate">{stage.replace(/_/g, ' ')}</div>
                      <div className="flex-1 h-8 bg-slate-800 rounded-lg overflow-hidden relative">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-600 to-sky-500 rounded-lg transition-all"
                          style={{ width: `${Math.max(4, (count / totalStageCount) * 100)}%` }}
                        />
                        <span className="absolute inset-0 flex items-center px-3 text-xs font-medium text-white">
                          {count}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Deals pipeline */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-base font-bold text-white mb-4">Deals Pipeline</h2>
              <div className="space-y-3">
                {STAGE_ORDER.map((stage) => {
                  const data = stats.deals_by_stage[stage];
                  if (!data) return null;
                  return (
                    <div key={stage} className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${STAGE_COLORS[stage] || 'bg-slate-500'}`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-300 capitalize">{stage.replace(/_/g, ' ')}</span>
                          <span className="text-sm text-slate-400">
                            {data.count} deal{data.count !== 1 ? 's' : ''} - ${data.total_amount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {Object.keys(stats.deals_by_stage).length === 0 && (
                  <p className="text-sm text-slate-500">No deals yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Recent activity */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-base font-bold text-white mb-4">Recent Activity</h2>
            {stats.recent_activities.length === 0 ? (
              <p className="text-sm text-slate-500">No recent activity</p>
            ) : (
              <div className="space-y-3">
                {stats.recent_activities.map((activity: any, i: number) => (
                  <div key={activity.id || i} className="flex items-start gap-3 py-2 border-b border-slate-800 last:border-0">
                    <div className="mt-1 w-2 h-2 rounded-full bg-sky-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-300">
                        <span className="font-medium text-white capitalize">{(activity.type || 'activity').replace(/_/g, ' ')}</span>
                        {activity.contacts && (
                          <span> - {activity.contacts.firstname} {activity.contacts.lastname}</span>
                        )}
                        {activity.companies && (
                          <span className="text-slate-500"> at {activity.companies.name}</span>
                        )}
                      </p>
                      {activity.note && (
                        <p className="text-xs text-slate-500 mt-0.5 truncate">{activity.note}</p>
                      )}
                      <p className="text-xs text-slate-600 mt-0.5">
                        {new Date(activity.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}
