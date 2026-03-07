'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { getSupabase } from '@/lib/supabase';

interface QueueItem {
  id: string;
  topic: string;
  format: string;
  status: string;
  caption: string;
  created_at: string;
}

interface Agent {
  name: string;
  role: string;
  status: 'Idle' | 'Running' | 'Review';
}

const AGENTS: Agent[] = [
  { name: 'Catalyst', role: 'Angles', status: 'Idle' },
  { name: 'Maven', role: 'Briefs', status: 'Idle' },
  { name: 'Echo', role: 'Drafts', status: 'Idle' },
  { name: 'Guardian', role: 'Compliance', status: 'Idle' },
  { name: 'Courier', role: 'Sales DMs', status: 'Idle' },
  { name: 'Publisher', role: 'Instagram', status: 'Idle' },
];

const STATUS_DOT: Record<string, string> = {
  Idle: '#6b7280',
  Running: '#22c55e',
  Review: '#f59e0b',
};

function adminFetch(path: string) {
  const token = process.env.NEXT_PUBLIC_ADMIN_ANALYTICS_TOKEN;
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return fetch(path, { headers });
}

export default function MissionControlPage() {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [items, setItems] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    draftCount: 0,
    approvedCount: 0,
    postedThisWeek: 0,
    killRate: 0,
  });

  useEffect(() => {
    (async () => {
      const supabase = getSupabase();
      const { data } = await supabase.auth.getUser();
      const email = data.user?.email ?? '';
      setAuthorized(email.toLowerCase() === 'gardenablaze@gmail.com');
    })();
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminFetch('/api/admin/marketing/queue?status=all');
      const json = await res.json();
      if (json.ok) {
        const all: QueueItem[] = json.items;
        setItems(all);

        const drafts = all.filter((i) => i.status === 'draft').length;
        const approved = all.filter((i) => i.status === 'approved').length;
        const killed = all.filter((i) => i.status === 'killed').length;
        const total = all.length;

        // Posted this week
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const postedThisWeek = all.filter(
          (i) =>
            i.status === 'posted' &&
            new Date(i.created_at) >= weekAgo,
        ).length;

        setMetrics({
          draftCount: drafts,
          approvedCount: approved,
          postedThisWeek,
          killRate: total > 0 ? Math.round((killed / total) * 100) : 0,
        });
      }
    } catch {
      // ignore
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authorized) fetchData();
  }, [authorized, fetchData]);

  if (authorized === null) {
    return <div className="min-h-screen bg-[#0a0a0a] text-white p-8">Loading...</div>;
  }
  if (!authorized) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
        <div className="max-w-md">
          <div className="font-black text-xl mb-2">Not authorized.</div>
          <a
            href="/login"
            className="inline-block px-4 py-2 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700"
          >
            Sign in
          </a>
        </div>
      </div>
    );
  }

  const recentDrafts = items
    .filter((i) => i.status === 'draft' || i.status === 'approved')
    .slice(0, 8);

  const metricCards = [
    { label: 'Draft Queue', value: metrics.draftCount, color: '#60a5fa' },
    { label: 'Approved', value: metrics.approvedCount, color: '#4ade80' },
    { label: 'Posted This Week', value: metrics.postedThisWeek, color: '#c084fc' },
    { label: 'Kill Rate', value: `${metrics.killRate}%`, color: '#f87171' },
  ];

  const STATUS_BADGE: Record<string, { bg: string; text: string }> = {
    draft: { bg: '#1e3a5f', text: '#60a5fa' },
    approved: { bg: '#14532d', text: '#4ade80' },
    posted: { bg: '#3b0764', text: '#c084fc' },
    killed: { bg: '#450a0a', text: '#f87171' },
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <section className="max-w-6xl mx-auto px-4 sm:px-8 pt-10 pb-16">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="text-sm font-semibold mb-1 inline-block hover:underline text-blue-400"
          >
            &larr; Admin
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-white">Mission Control</h1>
            <span className="text-xs font-bold px-2 py-1 rounded-full bg-sky-900/50 text-sky-300 uppercase tracking-wider">
              Command Center
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Content pipeline, AI agents, publishing status
          </p>
        </div>

        {/* Agent Status Panel */}
        <div className="mb-8">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">
            Agent Status
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {AGENTS.map((agent) => (
              <div
                key={agent.name}
                className="rounded-xl p-4 border border-gray-800"
                style={{ background: '#111111' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{
                      background: STATUS_DOT[agent.status],
                      boxShadow: agent.status === 'Running'
                        ? '0 0 8px rgba(34,197,94,0.5)'
                        : agent.status === 'Review'
                          ? '0 0 8px rgba(245,158,11,0.5)'
                          : 'none',
                    }}
                  />
                  <span className="text-xs font-bold text-gray-400 uppercase">
                    {agent.status}
                  </span>
                </div>
                <div className="font-black text-white text-sm">{agent.name}</div>
                <div className="text-xs text-gray-500">{agent.role}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {metricCards.map((card) => (
            <div
              key={card.label}
              className="rounded-xl p-5 border border-gray-800"
              style={{ background: '#111111' }}
            >
              <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                {card.label}
              </div>
              <div
                className="text-3xl font-black"
                style={{ color: card.color }}
              >
                {loading ? '--' : card.value}
              </div>
            </div>
          ))}
        </div>

        {/* Recent Drafts */}
        <div className="mb-8">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">
            Recent Drafts &amp; Approved
          </h2>
          {loading ? (
            <div className="text-center py-10 text-gray-600 font-semibold">Loading...</div>
          ) : recentDrafts.length === 0 ? (
            <div
              className="rounded-xl p-8 text-center border border-gray-800"
              style={{ background: '#111111' }}
            >
              <div className="text-gray-500 font-semibold">No pending drafts</div>
              <div className="text-gray-600 text-sm mt-1">All clear in the pipeline</div>
            </div>
          ) : (
            <div className="space-y-2">
              {recentDrafts.map((item) => {
                const sb = STATUS_BADGE[item.status] ?? { bg: '#1f2937', text: '#9ca3af' };
                return (
                  <div
                    key={item.id}
                    className="rounded-xl px-5 py-3 flex items-center justify-between border border-gray-800"
                    style={{ background: '#111111' }}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full uppercase flex-shrink-0"
                        style={{ background: sb.bg, color: sb.text }}
                      >
                        {item.status}
                      </span>
                      <span className="text-sm font-semibold text-white truncate">
                        {item.topic || 'Untitled'}
                      </span>
                      {item.format && (
                        <span className="text-xs text-gray-500 flex-shrink-0">{item.format}</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-600 flex-shrink-0 ml-3">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/marketing?tab=draft"
              className="px-5 py-3 rounded-xl font-bold text-sm transition-colors border border-blue-800 bg-blue-900/30 text-blue-400 hover:bg-blue-900/60"
            >
              Review Drafts
            </Link>
            <Link
              href="/admin/marketing?tab=approved"
              className="px-5 py-3 rounded-xl font-bold text-sm transition-colors border border-green-800 bg-green-900/30 text-green-400 hover:bg-green-900/60"
            >
              Approve Queue
            </Link>
            <Link
              href="/admin/marketing"
              className="px-5 py-3 rounded-xl font-bold text-sm transition-colors border border-purple-800 bg-purple-900/30 text-purple-400 hover:bg-purple-900/60"
            >
              Open Marketing
            </Link>
            <Link
              href="/admin/analytics"
              className="px-5 py-3 rounded-xl font-bold text-sm transition-colors border border-gray-700 bg-gray-800/50 text-gray-300 hover:bg-gray-800"
            >
              View Analytics
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 text-center text-sm border-t border-gray-800 text-gray-600">
          <div className="font-black text-gray-400">Blue Label Wholesale</div>
          <div>&copy; 2026 BlueLabel. All rights reserved.</div>
        </footer>
      </section>
    </div>
  );
}
