'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import Modal from '../components/Modal';
import { crmFetch } from '../components/api';

interface Deal {
  id: string;
  name: string;
  amount: number | null;
  stage: string;
  owner: string | null;
  close_date: string | null;
  company_id: string | null;
  contact_id: string | null;
  companies: { id: string; name: string } | null;
  contacts: { id: string; firstname: string; lastname: string; email: string } | null;
  created_at: string;
}

const STAGES = ['discovery', 'proposal', 'negotiation', 'closed_won', 'closed_lost'];
const STAGE_COLORS: Record<string, { bg: string; border: string; header: string }> = {
  discovery: { bg: 'bg-blue-500/5', border: 'border-blue-500/20', header: 'text-blue-400' },
  proposal: { bg: 'bg-indigo-500/5', border: 'border-indigo-500/20', header: 'text-indigo-400' },
  negotiation: { bg: 'bg-amber-500/5', border: 'border-amber-500/20', header: 'text-amber-400' },
  closed_won: { bg: 'bg-emerald-500/5', border: 'border-emerald-500/20', header: 'text-emerald-400' },
  closed_lost: { bg: 'bg-red-500/5', border: 'border-red-500/20', header: 'text-red-400' },
};

export default function DealsPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'kanban' | 'table'>('kanban');
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', amount: '', stage: 'discovery', owner: '', close_date: '', company_id: '', contact_id: '' });
  const [saving, setSaving] = useState(false);
  const [companies, setCompanies] = useState<{ id: string; name: string }[]>([]);
  const [contactsList, setContactsList] = useState<{ id: string; firstname: string; lastname: string }[]>([]);
  const limit = 100; // fetch more for kanban

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

  const fetchDeals = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search) params.set('search', search);

    const json = await crmFetch(`/api/admin/crm/deals?${params}`);
    if (json.ok) {
      setDeals(json.data);
      setTotal(json.total);
    }
    setLoading(false);
  }, [page, search]);

  useEffect(() => {
    if (authorized) fetchDeals();
  }, [authorized, fetchDeals]);

  useEffect(() => {
    if (!authorized) return;
    (async () => {
      const [compJson, contJson] = await Promise.all([
        crmFetch('/api/admin/crm/companies?limit=200'),
        crmFetch('/api/admin/crm/contacts?limit=200'),
      ]);
      if (compJson.ok) setCompanies(compJson.data);
      if (contJson.ok) setContactsList(contJson.data);
    })();
  }, [authorized]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  async function handleAdd() {
    setSaving(true);
    const body: Record<string, any> = { name: addForm.name, stage: addForm.stage };
    if (addForm.amount) body.amount = Number(addForm.amount);
    if (addForm.owner) body.owner = addForm.owner;
    if (addForm.close_date) body.close_date = addForm.close_date;
    if (addForm.company_id) body.company_id = addForm.company_id;
    if (addForm.contact_id) body.contact_id = addForm.contact_id;

    const json = await crmFetch('/api/admin/crm/deals', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    setSaving(false);
    if (json.ok) {
      setShowAdd(false);
      setAddForm({ name: '', amount: '', stage: 'discovery', owner: '', close_date: '', company_id: '', contact_id: '' });
      fetchDeals();
    }
  }

  async function handleStageChange(dealId: string, newStage: string) {
    await crmFetch(`/api/admin/crm/deals/${dealId}`, {
      method: 'PATCH',
      body: JSON.stringify({ stage: newStage }),
    });
    fetchDeals();
  }

  if (!authorized) return null;

  const dealsByStage: Record<string, Deal[]> = {};
  for (const stage of STAGES) dealsByStage[stage] = [];
  for (const deal of deals) {
    const s = deal.stage || 'discovery';
    if (!dealsByStage[s]) dealsByStage[s] = [];
    dealsByStage[s].push(deal);
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Deals</h1>
          <p className="text-sm text-slate-400 mt-1">{total} total deal{total !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex bg-slate-800 rounded-xl p-1">
            <button
              onClick={() => setView('kanban')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                view === 'kanban' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
              Board
            </button>
            <button
              onClick={() => setView('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                view === 'table' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              Table
            </button>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium rounded-xl transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Deal
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <SearchBar value={search} onChange={setSearch} placeholder="Search deals..." />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-slate-400 text-sm">Loading deals...</div>
        </div>
      ) : view === 'kanban' ? (
        /* Kanban board */
        <div className="flex gap-4 overflow-x-auto pb-4">
          {STAGES.map((stage) => {
            const colors = STAGE_COLORS[stage] || STAGE_COLORS.discovery;
            const stageDeals = dealsByStage[stage] || [];
            const stageTotal = stageDeals.reduce((s, d) => s + Number(d.amount ?? 0), 0);

            return (
              <div
                key={stage}
                className={`flex-shrink-0 w-72 rounded-2xl border ${colors.border} ${colors.bg}`}
              >
                {/* Column header */}
                <div className="px-4 py-3 border-b border-slate-800">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-sm font-bold uppercase tracking-wider ${colors.header}`}>
                      {stage.replace(/_/g, ' ')}
                    </h3>
                    <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
                      {stageDeals.length}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">${stageTotal.toLocaleString()}</div>
                </div>

                {/* Cards */}
                <div className="p-2 space-y-2 min-h-[100px] max-h-[60vh] overflow-y-auto">
                  {stageDeals.length === 0 ? (
                    <div className="text-xs text-slate-600 text-center py-6">No deals</div>
                  ) : (
                    stageDeals.map((deal) => (
                      <div
                        key={deal.id}
                        className="bg-slate-900 border border-slate-800 rounded-xl p-3 hover:border-slate-700 cursor-pointer transition-colors group"
                      >
                        <div className="text-sm font-medium text-white mb-1">{deal.name}</div>
                        <div className="text-xs text-emerald-400 font-medium mb-2">
                          ${Number(deal.amount ?? 0).toLocaleString()}
                        </div>
                        {deal.companies && (
                          <div className="text-xs text-slate-500 mb-1">{deal.companies.name}</div>
                        )}
                        {deal.contacts && (
                          <div className="text-xs text-slate-500">
                            {deal.contacts.firstname} {deal.contacts.lastname}
                          </div>
                        )}
                        {deal.owner && (
                          <div className="text-xs text-slate-600 mt-1">Owner: {deal.owner}</div>
                        )}

                        {/* Quick stage change */}
                        <div className="mt-2 pt-2 border-t border-slate-800 opacity-0 group-hover:opacity-100 transition-opacity">
                          <select
                            value={deal.stage}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleStageChange(deal.id, e.target.value);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs text-white focus:outline-none"
                          >
                            {STAGES.map((s) => (
                              <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table view */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Stage</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">Company</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider hidden lg:table-cell">Owner</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider hidden lg:table-cell">Close Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider hidden xl:table-cell">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {deals.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-slate-500">No deals found</td>
                  </tr>
                ) : (
                  deals.map((deal) => {
                    const colors = STAGE_COLORS[deal.stage] || STAGE_COLORS.discovery;
                    return (
                      <tr key={deal.id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="px-4 py-3 text-white font-medium">{deal.name}</td>
                        <td className="px-4 py-3 text-emerald-400 font-medium">${Number(deal.amount ?? 0).toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${colors.border} ${colors.header}`}>
                            {deal.stage.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-400 hidden md:table-cell">{deal.companies?.name || '-'}</td>
                        <td className="px-4 py-3 text-slate-400 hidden md:table-cell">
                          {deal.contacts ? `${deal.contacts.firstname} ${deal.contacts.lastname}` : '-'}
                        </td>
                        <td className="px-4 py-3 text-slate-400 hidden lg:table-cell">{deal.owner || '-'}</td>
                        <td className="px-4 py-3 text-slate-400 text-xs hidden lg:table-cell">
                          {deal.close_date ? new Date(deal.close_date).toLocaleDateString() : '-'}
                        </td>
                        <td className="px-4 py-3 text-slate-500 text-xs hidden xl:table-cell whitespace-nowrap">
                          {new Date(deal.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          {view === 'table' && (
            <div className="px-4 pb-4">
              <Pagination page={page} total={total} limit={25} onPageChange={setPage} />
            </div>
          )}
        </div>
      )}

      {/* Add Deal Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Deal">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Deal Name</label>
            <input
              type="text"
              value={addForm.name}
              onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Company</label>
              <select
                value={addForm.company_id}
                onChange={(e) => setAddForm({ ...addForm, company_id: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="">Select company</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Contact</label>
              <select
                value={addForm.contact_id}
                onChange={(e) => setAddForm({ ...addForm, contact_id: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="">Select contact</option>
                {contactsList.map((c) => (
                  <option key={c.id} value={c.id}>{c.firstname} {c.lastname}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Amount ($)</label>
              <input
                type="number"
                value={addForm.amount}
                onChange={(e) => setAddForm({ ...addForm, amount: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Stage</label>
              <select
                value={addForm.stage}
                onChange={(e) => setAddForm({ ...addForm, stage: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {STAGES.map((s) => (
                  <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Owner</label>
            <input
              type="text"
              value={addForm.owner}
              onChange={(e) => setAddForm({ ...addForm, owner: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Expected Close Date</label>
            <input
              type="date"
              value={addForm.close_date}
              onChange={(e) => setAddForm({ ...addForm, close_date: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
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
              {saving ? 'Saving...' : 'Add Deal'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
