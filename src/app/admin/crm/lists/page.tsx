'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';
import Modal from '../components/Modal';
import SearchBar from '../components/SearchBar';
import { crmFetch } from '../components/api';

interface CrmList {
  id: string;
  name: string;
  description: string | null;
  type: string;
  member_count: number;
  created_at: string;
  updated_at: string;
}

interface ListMember {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  lead_status: string | null;
}

export default function ListsPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [lists, setLists] = useState<CrmList[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', description: '', type: 'static' });
  const [saving, setSaving] = useState(false);
  const [selectedList, setSelectedList] = useState<CrmList | null>(null);
  const [members, setMembers] = useState<ListMember[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);

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

  const fetchLists = useCallback(async () => {
    setLoading(true);
    // Lists may not have a dedicated API yet. We'll try and handle gracefully.
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      const json = await crmFetch(`/api/admin/crm/lists?${params}`);
      if (json.ok) {
        setLists(json.data ?? []);
      } else {
        // API might not exist yet - show empty state
        setLists([]);
      }
    } catch {
      setLists([]);
    }
    setLoading(false);
  }, [search]);

  useEffect(() => {
    if (authorized) fetchLists();
  }, [authorized, fetchLists]);

  async function handleAdd() {
    setSaving(true);
    try {
      const json = await crmFetch('/api/admin/crm/lists', {
        method: 'POST',
        body: JSON.stringify(addForm),
      });
      if (json.ok) {
        setShowAdd(false);
        setAddForm({ name: '', description: '', type: 'static' });
        fetchLists();
      }
    } catch {
      // API might not exist yet
    }
    setSaving(false);
  }

  async function viewMembers(list: CrmList) {
    setSelectedList(list);
    setMembersLoading(true);
    try {
      const json = await crmFetch(`/api/admin/crm/lists/${list.id}/members`);
      if (json.ok) {
        setMembers(json.data ?? []);
      } else {
        setMembers([]);
      }
    } catch {
      setMembers([]);
    }
    setMembersLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this list?')) return;
    try {
      await crmFetch(`/api/admin/crm/lists/${id}`, { method: 'DELETE' });
      fetchLists();
    } catch {
      // API might not exist
    }
  }

  if (!authorized) return null;

  const filtered = lists.filter((l) =>
    !search || l.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Lists</h1>
          <p className="text-sm text-slate-400 mt-1">Organize contacts into groups</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium rounded-xl transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create List
        </button>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <SearchBar value={search} onChange={setSearch} placeholder="Search lists..." />
      </div>

      {/* Lists grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-slate-400 text-sm">Loading lists...</div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
          <svg className="w-12 h-12 text-slate-700 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          <p className="text-slate-500 text-sm">
            {lists.length === 0
              ? 'No lists created yet. Create your first list to organize contacts.'
              : 'No lists match your search.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((list) => (
            <div
              key={list.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-base font-bold text-white">{list.name}</h3>
                  {list.description && (
                    <p className="text-xs text-slate-500 mt-1">{list.description}</p>
                  )}
                </div>
                <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full capitalize">
                  {list.type}
                </span>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-slate-400">
                  <span className="text-white font-medium">{list.member_count ?? 0}</span> member{(list.member_count ?? 0) !== 1 ? 's' : ''}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => viewMembers(list)}
                    className="px-3 py-1.5 text-xs font-medium text-sky-400 bg-sky-500/10 border border-sky-500/20 rounded-lg hover:bg-sky-500/20 transition-colors"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(list.id)}
                    className="px-3 py-1.5 text-xs font-medium text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="text-xs text-slate-600 mt-3">
                Created {new Date(list.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add List Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Create List">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">List Name</label>
            <input
              type="text"
              value={addForm.name}
              onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="e.g. Q1 Leads"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Description</label>
            <textarea
              value={addForm.description}
              onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
              placeholder="Optional description..."
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Type</label>
            <select
              value={addForm.type}
              onChange={(e) => setAddForm({ ...addForm, type: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="static">Static</option>
              <option value="dynamic">Dynamic</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setShowAdd(false)}
              className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={saving || !addForm.name}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium rounded-lg disabled:opacity-50 transition-colors"
            >
              {saving ? 'Creating...' : 'Create List'}
            </button>
          </div>
        </div>
      </Modal>

      {/* View Members Modal */}
      <Modal
        open={!!selectedList}
        onClose={() => { setSelectedList(null); setMembers([]); }}
        title={selectedList ? `${selectedList.name} - Members` : 'Members'}
        maxWidth="max-w-2xl"
      >
        {membersLoading ? (
          <div className="text-sm text-slate-400 py-8 text-center">Loading members...</div>
        ) : members.length === 0 ? (
          <div className="text-sm text-slate-500 py-8 text-center">No members in this list</div>
        ) : (
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="px-3 py-2 text-left text-xs font-semibold text-slate-400 uppercase">Name</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-slate-400 uppercase">Email</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-slate-400 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {members.map((m) => (
                  <tr
                    key={m.id}
                    className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                    onClick={() => {
                      setSelectedList(null);
                      router.push(`/admin/crm/contacts/${m.id}`);
                    }}
                  >
                    <td className="px-3 py-2 text-white font-medium">{m.firstname} {m.lastname}</td>
                    <td className="px-3 py-2 text-slate-400">{m.email}</td>
                    <td className="px-3 py-2 text-slate-400 capitalize">{(m.lead_status || '').replace(/_/g, ' ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Modal>
    </div>
  );
}
