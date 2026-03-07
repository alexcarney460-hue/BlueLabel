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
  hashtags: string[] | string | null;
  media_urls: string[] | string | null;
  created_at: string;
  updated_at: string;
  posted_at: string | null;
}

const STATUS_TABS = ['all', 'draft', 'approved', 'posted', 'killed'] as const;

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  draft: { bg: '#1e3a5f', text: '#60a5fa' },
  approved: { bg: '#14532d', text: '#4ade80' },
  posted: { bg: '#3b0764', text: '#c084fc' },
  killed: { bg: '#450a0a', text: '#f87171' },
};

function adminFetch(path: string, opts: RequestInit = {}) {
  const token = process.env.NEXT_PUBLIC_ADMIN_ANALYTICS_TOKEN;
  const headers: Record<string, string> = {
    ...(opts.headers as Record<string, string> ?? {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (opts.body && !headers['Content-Type']) headers['Content-Type'] = 'application/json';
  return fetch(path, { ...opts, headers });
}

export default function MarketingPage() {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [items, setItems] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [mediaInputs, setMediaInputs] = useState<Record<string, string>>({});
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const supabase = getSupabase();
      const { data } = await supabase.auth.getUser();
      const email = data.user?.email ?? '';
      setAuthorized(email.toLowerCase() === 'gardenablaze@gmail.com');
    })();
  }, []);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminFetch(`/api/admin/marketing/queue?status=${activeTab}`);
      const json = await res.json();
      if (json.ok) setItems(json.items);
    } catch {
      // ignore
    }
    setLoading(false);
  }, [activeTab]);

  useEffect(() => {
    if (authorized) fetchItems();
  }, [authorized, fetchItems]);

  async function updateStatus(id: string, status: string) {
    setActionLoading(id);
    try {
      await adminFetch('/api/admin/marketing/queue', {
        method: 'PATCH',
        body: JSON.stringify({ id, status }),
      });
      await fetchItems();
    } catch {
      // ignore
    }
    setActionLoading(null);
  }

  async function updateMedia(id: string) {
    const url = mediaInputs[id]?.trim();
    if (!url) return;
    setActionLoading(id);
    try {
      await adminFetch('/api/admin/marketing/queue', {
        method: 'PATCH',
        body: JSON.stringify({ id, media_urls: [url] }),
      });
      setMediaInputs((prev) => ({ ...prev, [id]: '' }));
      await fetchItems();
    } catch {
      // ignore
    }
    setActionLoading(null);
  }

  async function publishItem(id: string) {
    setActionLoading(id);
    try {
      await adminFetch(`/api/admin/marketing/publish/${id}`, { method: 'POST' });
      await fetchItems();
    } catch {
      // ignore
    }
    setActionLoading(null);
  }

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

  const hashtags = (h: string[] | string | null): string[] => {
    if (!h) return [];
    if (Array.isArray(h)) return h;
    return h.split(/[\s,]+/).filter(Boolean);
  };

  const mediaList = (m: string[] | string | null): string[] => {
    if (!m) return [];
    if (Array.isArray(m)) return m;
    return [m];
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <section className="max-w-6xl mx-auto px-4 sm:px-8 pt-10 pb-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <Link
              href="/admin"
              className="text-sm font-semibold mb-1 inline-block hover:underline text-blue-400"
            >
              &larr; Admin
            </Link>
            <h1 className="text-3xl font-black text-white">Marketing Queue</h1>
            <p className="text-sm text-gray-400 mt-1">
              Manage content pipeline: drafts, approvals, publishing
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 mb-8 rounded-xl overflow-hidden border border-gray-800 w-fit">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-2 text-sm font-bold capitalize transition-colors"
              style={{
                background: activeTab === tab ? '#1e40af' : 'transparent',
                color: activeTab === tab ? '#fff' : '#9ca3af',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-20 text-gray-500 font-semibold">Loading queue...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-500 font-semibold text-lg mb-2">No items found</div>
            <div className="text-gray-600 text-sm">
              {activeTab === 'all'
                ? 'The marketing content queue is empty.'
                : `No items with status "${activeTab}".`}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => {
              const sc = STATUS_COLORS[item.status] ?? { bg: '#1f2937', text: '#9ca3af' };
              const tags = hashtags(item.hashtags);
              const media = mediaList(item.media_urls);
              const isLoading = actionLoading === item.id;

              return (
                <div
                  key={item.id}
                  className="rounded-2xl p-6 border border-gray-800"
                  style={{ background: '#111111' }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-black text-white">{item.topic || 'Untitled'}</h3>
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded-full uppercase"
                          style={{ background: sc.bg, color: sc.text }}
                        >
                          {item.status}
                        </span>
                        {item.format && (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-800 text-gray-400">
                            {item.format}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        Created {new Date(item.created_at).toLocaleDateString()}
                        {item.posted_at && ` | Posted ${new Date(item.posted_at).toLocaleDateString()}`}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2 flex-shrink-0">
                      {item.status === 'draft' && (
                        <button
                          onClick={() => updateStatus(item.id, 'approved')}
                          disabled={isLoading}
                          className="px-3 py-1.5 text-xs font-bold rounded-lg bg-green-900/50 text-green-400 hover:bg-green-900 transition-colors disabled:opacity-50"
                        >
                          Approve
                        </button>
                      )}
                      {item.status === 'approved' && (
                        <button
                          onClick={() => publishItem(item.id)}
                          disabled={isLoading}
                          className="px-3 py-1.5 text-xs font-bold rounded-lg bg-purple-900/50 text-purple-400 hover:bg-purple-900 transition-colors disabled:opacity-50"
                        >
                          Publish
                        </button>
                      )}
                      {(item.status === 'draft' || item.status === 'approved') && (
                        <button
                          onClick={() => updateStatus(item.id, 'killed')}
                          disabled={isLoading}
                          className="px-3 py-1.5 text-xs font-bold rounded-lg bg-red-900/50 text-red-400 hover:bg-red-900 transition-colors disabled:opacity-50"
                        >
                          Kill
                        </button>
                      )}
                      {item.status === 'killed' && (
                        <button
                          onClick={() => updateStatus(item.id, 'draft')}
                          disabled={isLoading}
                          className="px-3 py-1.5 text-xs font-bold rounded-lg bg-blue-900/50 text-blue-400 hover:bg-blue-900 transition-colors disabled:opacity-50"
                        >
                          Restore
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Caption preview */}
                  {item.caption && (
                    <div className="text-sm text-gray-300 mb-3 line-clamp-3 whitespace-pre-wrap">
                      {item.caption}
                    </div>
                  )}

                  {/* Hashtags */}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {tags.map((tag, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-0.5 rounded-full bg-blue-900/30 text-blue-400"
                        >
                          {tag.startsWith('#') ? tag : `#${tag}`}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Media URLs */}
                  {media.length > 0 && (
                    <div className="mb-3">
                      <div className="text-xs font-bold text-gray-500 mb-1">Media</div>
                      {media.map((url, i) => (
                        <a
                          key={i}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-400 hover:underline block truncate"
                        >
                          {url}
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Media URL input for items that can be published */}
                  {(item.status === 'draft' || item.status === 'approved') && (
                    <div className="flex gap-2 mt-3">
                      <input
                        type="url"
                        placeholder="Add media URL..."
                        value={mediaInputs[item.id] ?? ''}
                        onChange={(e) =>
                          setMediaInputs((prev) => ({ ...prev, [item.id]: e.target.value }))
                        }
                        className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
                      />
                      <button
                        onClick={() => updateMedia(item.id)}
                        disabled={isLoading || !mediaInputs[item.id]?.trim()}
                        className="px-3 py-1.5 text-xs font-bold rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors disabled:opacity-50"
                      >
                        Set Media
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 pt-8 text-center text-sm border-t border-gray-800 text-gray-600">
          <div className="font-black text-gray-400">Blue Label Wholesale</div>
          <div>&copy; 2026 BlueLabel. All rights reserved.</div>
        </footer>
      </section>
    </div>
  );
}
