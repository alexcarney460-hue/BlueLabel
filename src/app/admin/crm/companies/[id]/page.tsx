'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';
import StatusBadge from '../../components/StatusBadge';
import { crmFetch } from '../../components/api';

interface CompanyDetail {
  id: string;
  name: string;
  domain: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  rating: string | null;
  contacts: any[];
  deals: any[];
  activities: any[];
  created_at: string;
  updated_at: string;
}

export default function CompanyDetailPage() {
  const router = useRouter();
  const params = useParams();
  const companyId = params.id as string;

  const [authorized, setAuthorized] = useState(false);
  const [company, setCompany] = useState<CompanyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Record<string, boolean>>({});
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

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

  const fetchCompany = useCallback(async () => {
    setLoading(true);
    const json = await crmFetch(`/api/admin/crm/companies/${companyId}`);
    if (json.ok) {
      setCompany(json.data);
    }
    setLoading(false);
  }, [companyId]);

  useEffect(() => {
    if (authorized) fetchCompany();
  }, [authorized, fetchCompany]);

  function startEdit(field: string, currentValue: string) {
    setEditing({ ...editing, [field]: true });
    setEditValues({ ...editValues, [field]: currentValue });
  }

  async function saveField(field: string) {
    setSaving(true);
    const json = await crmFetch(`/api/admin/crm/companies/${companyId}`, {
      method: 'PATCH',
      body: JSON.stringify({ [field]: editValues[field] || null }),
    });
    setSaving(false);
    if (json.ok) {
      setCompany({ ...company!, ...json.data, contacts: company!.contacts, deals: company!.deals, activities: company!.activities });
      setEditing({ ...editing, [field]: false });
    }
  }

  function cancelEdit(field: string) {
    setEditing({ ...editing, [field]: false });
  }

  if (!authorized) return null;

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="text-slate-400 text-sm">Loading company...</div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="p-6 lg:p-8">
        <div className="text-red-400 text-sm">Company not found</div>
      </div>
    );
  }

  const fields: { key: string; label: string; value: string; type?: 'select'; options?: string[] }[] = [
    { key: 'name', label: 'Name', value: company.name || '' },
    { key: 'domain', label: 'Domain', value: company.domain || '' },
    { key: 'phone', label: 'Phone', value: company.phone || '' },
    { key: 'city', label: 'City', value: company.city || '' },
    { key: 'state', label: 'State', value: company.state || '' },
    { key: 'rating', label: 'Rating', value: company.rating || '', type: 'select', options: ['hot', 'warm', 'cold'] },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Back + header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/admin/crm/companies')}
          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">{company.name}</h1>
          {company.domain && <p className="text-sm text-slate-400">{company.domain}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Company info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-base font-bold text-white mb-4">Company Information</h2>
            <div className="space-y-4">
              {fields.map((field) => (
                <div key={field.key} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
                  <label className="text-sm text-slate-400 w-28 flex-shrink-0">{field.label}</label>
                  {editing[field.key] ? (
                    <div className="flex items-center gap-2 flex-1">
                      {field.type === 'select' ? (
                        <select
                          value={editValues[field.key] || ''}
                          onChange={(e) => setEditValues({ ...editValues, [field.key]: e.target.value })}
                          className="flex-1 px-3 py-1.5 bg-slate-800 border border-slate-600 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                        >
                          <option value="">None</option>
                          {field.options?.map((o) => (
                            <option key={o} value={o}>{o}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={editValues[field.key] || ''}
                          onChange={(e) => setEditValues({ ...editValues, [field.key]: e.target.value })}
                          className="flex-1 px-3 py-1.5 bg-slate-800 border border-slate-600 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                          autoFocus
                        />
                      )}
                      <button onClick={() => saveField(field.key)} disabled={saving} className="px-2 py-1 text-xs font-medium text-sky-400 hover:text-sky-300">Save</button>
                      <button onClick={() => cancelEdit(field.key)} className="px-2 py-1 text-xs text-slate-500 hover:text-white">Cancel</button>
                    </div>
                  ) : (
                    <div
                      className="flex-1 text-sm text-white cursor-pointer hover:text-sky-400 transition-colors group"
                      onClick={() => startEdit(field.key, field.value)}
                    >
                      {field.value || <span className="text-slate-600">Click to edit</span>}
                      <svg className="w-3 h-3 ml-2 inline opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Associated contacts */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-base font-bold text-white mb-4">
              Contacts ({(company.contacts ?? []).length})
            </h2>
            {(company.contacts ?? []).length === 0 ? (
              <p className="text-sm text-slate-500">No contacts associated</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-400 uppercase">Name</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-400 uppercase">Email</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-400 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {company.contacts.map((c: any) => (
                      <tr
                        key={c.id}
                        className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                        onClick={() => router.push(`/admin/crm/contacts/${c.id}`)}
                      >
                        <td className="px-3 py-2 text-white font-medium">{c.firstname} {c.lastname}</td>
                        <td className="px-3 py-2 text-slate-400">{c.email}</td>
                        <td className="px-3 py-2"><StatusBadge status={c.lead_status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Activity Timeline */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-base font-bold text-white mb-4">Activity Timeline</h2>
            {(company.activities ?? []).length === 0 ? (
              <p className="text-sm text-slate-500">No activities recorded</p>
            ) : (
              <div className="relative">
                <div className="absolute left-[7px] top-2 bottom-2 w-px bg-slate-800" />
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {company.activities
                    .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                    .map((activity: any, i: number) => (
                      <div key={activity.id || i} className="flex items-start gap-4 relative">
                        <div className="mt-1.5 w-4 h-4 rounded-full bg-slate-800 border-2 border-sky-500 flex-shrink-0 z-10" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white font-medium capitalize">
                            {(activity.type || 'note').replace(/_/g, ' ')}
                          </p>
                          {activity.contacts && (
                            <p className="text-xs text-slate-400">
                              {activity.contacts.firstname} {activity.contacts.lastname}
                            </p>
                          )}
                          {activity.note && <p className="text-xs text-slate-500 mt-0.5 truncate">{activity.note}</p>}
                          <p className="text-xs text-slate-600 mt-1">
                            {new Date(activity.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Deals */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-base font-bold text-white mb-4">
              Deals ({(company.deals ?? []).length})
            </h2>
            {(company.deals ?? []).length === 0 ? (
              <p className="text-sm text-slate-500">No deals</p>
            ) : (
              <div className="space-y-3">
                {company.deals.map((deal: any) => (
                  <div
                    key={deal.id}
                    className="p-3 bg-slate-800 rounded-xl cursor-pointer hover:bg-slate-700 transition-colors"
                    onClick={() => router.push('/admin/crm/deals')}
                  >
                    <div className="text-sm font-medium text-white">{deal.name}</div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-slate-400 capitalize">{(deal.stage || '').replace(/_/g, ' ')}</span>
                      <span className="text-xs font-medium text-emerald-400">${Number(deal.amount ?? 0).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-base font-bold text-white mb-3">Details</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Created</span>
                <span className="text-slate-300">{new Date(company.created_at).toLocaleDateString()}</span>
              </div>
              {company.updated_at && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Updated</span>
                  <span className="text-slate-300">{new Date(company.updated_at).toLocaleDateString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">ID</span>
                <span className="text-slate-500 text-xs font-mono">{String(company.id)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
