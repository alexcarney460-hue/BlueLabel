'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';
import StatusBadge from '../../components/StatusBadge';
import StageBadge from '../../components/StageBadge';
import Modal from '../../components/Modal';
import { crmFetch } from '../../components/api';

const ACTIVITY_TYPES = ['note', 'call', 'email', 'meeting', 'task'];

interface ContactDetail {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string | null;
  lead_status: string | null;
  lifecycle_stage: string | null;
  source: string | null;
  company_id: string | null;
  companies: { id: string; name: string } | null;
  activities: any[];
  deals: any[];
  created_at: string;
  updated_at: string;
}

const LEAD_STATUSES = ['new', 'open', 'in_progress', 'open_deal', 'unqualified', 'attempted_to_contact', 'connected', 'bad_timing'];
const LIFECYCLE_STAGES = ['subscriber', 'lead', 'marketing_qualified_lead', 'sales_qualified_lead', 'opportunity', 'customer', 'evangelist'];

export default function ContactDetailPage() {
  const router = useRouter();
  const params = useParams();
  const contactId = params.id as string;

  const [authorized, setAuthorized] = useState(false);
  const [contact, setContact] = useState<ContactDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Record<string, boolean>>({});
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // Add activity
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [activityForm, setActivityForm] = useState({ type: 'note', subject: '', body: '' });
  const [savingActivity, setSavingActivity] = useState(false);

  // Delete
  const [showDelete, setShowDelete] = useState(false);

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

  const fetchContact = useCallback(async () => {
    setLoading(true);
    const json = await crmFetch(`/api/admin/crm/contacts/${contactId}`);
    if (json.ok) {
      setContact(json.data);
    }
    setLoading(false);
  }, [contactId]);

  useEffect(() => {
    if (authorized) fetchContact();
  }, [authorized, fetchContact]);

  function startEdit(field: string, currentValue: string) {
    setEditing({ ...editing, [field]: true });
    setEditValues({ ...editValues, [field]: currentValue });
  }

  async function saveField(field: string) {
    setSaving(true);
    const json = await crmFetch(`/api/admin/crm/contacts/${contactId}`, {
      method: 'PATCH',
      body: JSON.stringify({ [field]: editValues[field] || null }),
    });
    setSaving(false);
    if (json.ok) {
      setContact({ ...contact!, ...json.data });
      setEditing({ ...editing, [field]: false });
    }
  }

  function cancelEdit(field: string) {
    setEditing({ ...editing, [field]: false });
  }

  async function handleAddActivity() {
    setSavingActivity(true);
    await crmFetch('/api/admin/crm/activities', {
      method: 'POST',
      body: JSON.stringify({
        contact_id: contactId,
        company_id: contact?.company_id || null,
        type: activityForm.type,
        subject: activityForm.subject,
        note: activityForm.body,
      }),
    });
    setSavingActivity(false);
    setShowAddActivity(false);
    setActivityForm({ type: 'note', subject: '', body: '' });
    fetchContact();
  }

  async function handleDelete() {
    await crmFetch(`/api/admin/crm/contacts/${contactId}`, { method: 'DELETE' });
    router.push('/admin/crm/contacts');
  }

  if (!authorized) return null;

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="text-slate-400 text-sm">Loading contact...</div>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="p-6 lg:p-8">
        <div className="text-red-400 text-sm">Contact not found</div>
      </div>
    );
  }

  const fields: { key: string; label: string; value: string; type?: 'select'; options?: string[] }[] = [
    { key: 'firstname', label: 'First Name', value: contact.firstname || '' },
    { key: 'lastname', label: 'Last Name', value: contact.lastname || '' },
    { key: 'email', label: 'Email', value: contact.email || '' },
    { key: 'phone', label: 'Phone', value: contact.phone || '' },
    { key: 'lead_status', label: 'Lead Status', value: contact.lead_status || '', type: 'select', options: LEAD_STATUSES },
    { key: 'lifecycle_stage', label: 'Lifecycle Stage', value: contact.lifecycle_stage || '', type: 'select', options: LIFECYCLE_STAGES },
    { key: 'source', label: 'Source', value: contact.source || '' },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Back + header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/admin/crm/contacts')}
          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">{contact.firstname} {contact.lastname}</h1>
          <p className="text-sm text-slate-400">{contact.email}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <StatusBadge status={contact.lead_status} />
          <StageBadge stage={contact.lifecycle_stage} />
          <button
            onClick={() => setShowAddActivity(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium rounded-xl transition-colors ml-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Activity
          </button>
          <button
            onClick={() => setShowDelete(true)}
            className="px-4 py-2 bg-red-600/20 border border-red-500/30 text-red-400 rounded-xl text-sm font-medium hover:bg-red-600/30 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-base font-bold text-white mb-4">Contact Information</h2>
            <div className="space-y-4">
              {fields.map((field) => (
                <div key={field.key} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
                  <label className="text-sm text-slate-400 w-36 flex-shrink-0">{field.label}</label>
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
                            <option key={o} value={o}>{o.replace(/_/g, ' ')}</option>
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
                      <button
                        onClick={() => saveField(field.key)}
                        disabled={saving}
                        className="px-2 py-1 text-xs font-medium text-sky-400 hover:text-sky-300"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => cancelEdit(field.key)}
                        className="px-2 py-1 text-xs text-slate-500 hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div
                      className="flex-1 text-sm text-white cursor-pointer hover:text-sky-400 transition-colors group"
                      onClick={() => startEdit(field.key, field.value)}
                    >
                      {field.key === 'lead_status' ? <StatusBadge status={field.value} /> :
                       field.key === 'lifecycle_stage' ? <StageBadge stage={field.value} /> :
                       field.value || <span className="text-slate-600">Click to edit</span>}
                      <svg className="w-3 h-3 ml-2 inline opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}

              {/* Company (read-only link) */}
              <div className="flex items-center justify-between py-2">
                <label className="text-sm text-slate-400 w-36 flex-shrink-0">Company</label>
                <div className="flex-1 text-sm">
                  {contact.companies ? (
                    <button
                      onClick={() => router.push(`/admin/crm/companies/${contact.companies!.id}`)}
                      className="text-sky-400 hover:text-sky-300 transition-colors"
                    >
                      {contact.companies.name}
                    </button>
                  ) : (
                    <span className="text-slate-600">No company</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Activity timeline */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-base font-bold text-white mb-4">Activity Timeline</h2>
            {(contact.activities ?? []).length === 0 ? (
              <p className="text-sm text-slate-500">No activities recorded</p>
            ) : (
              <div className="relative">
                <div className="absolute left-[7px] top-2 bottom-2 w-px bg-slate-800" />
                <div className="space-y-4">
                  {contact.activities
                    .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                    .map((activity: any, i: number) => (
                      <div key={activity.id || i} className="flex items-start gap-4 relative">
                        <div className="mt-1.5 w-4 h-4 rounded-full bg-slate-800 border-2 border-sky-500 flex-shrink-0 z-10" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white font-medium capitalize">
                            {(activity.type || 'note').replace(/_/g, ' ')}
                          </p>
                          {activity.note && <p className="text-sm text-slate-400 mt-0.5">{activity.note}</p>}
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
        </div>

        {/* Sidebar - Associated deals */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-base font-bold text-white mb-4">Associated Deals</h2>
            {(contact.deals ?? []).length === 0 ? (
              <p className="text-sm text-slate-500">No deals</p>
            ) : (
              <div className="space-y-3">
                {contact.deals.map((deal: any) => (
                  <div
                    key={deal.id}
                    onClick={() => router.push(`/admin/crm/deals`)}
                    className="p-3 bg-slate-800 rounded-xl cursor-pointer hover:bg-slate-700 transition-colors"
                  >
                    <div className="text-sm font-medium text-white">{deal.name}</div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-slate-400 capitalize">{(deal.stage || '').replace(/_/g, ' ')}</span>
                      <span className="text-xs font-medium text-emerald-400">
                        ${Number(deal.amount ?? 0).toLocaleString()}
                      </span>
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
                <span className="text-slate-300">{new Date(contact.created_at).toLocaleDateString()}</span>
              </div>
              {contact.updated_at && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Updated</span>
                  <span className="text-slate-300">{new Date(contact.updated_at).toLocaleDateString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">ID</span>
                <span className="text-slate-500 text-xs font-mono">{contact.id.slice(0, 8)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Add Activity Modal */}
      <Modal open={showAddActivity} onClose={() => setShowAddActivity(false)} title="Add Activity">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Type</label>
            <select
              value={activityForm.type}
              onChange={(e) => setActivityForm({ ...activityForm, type: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {ACTIVITY_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Subject</label>
            <input
              type="text"
              value={activityForm.subject}
              onChange={(e) => setActivityForm({ ...activityForm, subject: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Body</label>
            <textarea
              value={activityForm.body}
              onChange={(e) => setActivityForm({ ...activityForm, body: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowAddActivity(false)} className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">
              Cancel
            </button>
            <button
              onClick={handleAddActivity}
              disabled={savingActivity}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium rounded-lg disabled:opacity-50 transition-colors"
            >
              {savingActivity ? 'Saving...' : 'Add Activity'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={showDelete} onClose={() => setShowDelete(false)} title="Delete Contact">
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            Are you sure you want to delete <span className="font-medium text-white">{contact.firstname} {contact.lastname}</span>? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowDelete(false)} className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Delete Contact
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
