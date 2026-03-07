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
  orders: any[];
  communications: any[];
  created_at: string;
  updated_at: string;
}

const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  processing: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  shipped: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  delivered: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
  refunded: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
};

const COMM_CHANNELS = ['call', 'text', 'email'] as const;
const COMM_DIRECTIONS = ['inbound', 'outbound'] as const;
const COMM_STATUSES = ['completed', 'no_answer', 'voicemail', 'bounced', 'scheduled'] as const;

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

  // Communication modal
  const [showAddComm, setShowAddComm] = useState(false);
  const [commForm, setCommForm] = useState({ channel: 'call' as string, direction: 'outbound' as string, subject: '', body: '', status: 'completed' as string });
  const [savingComm, setSavingComm] = useState(false);

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

  async function handleAddComm() {
    setSavingComm(true);
    await crmFetch('/api/admin/crm/communications', {
      method: 'POST',
      body: JSON.stringify({
        contact_id: contactId,
        company_id: contact?.company_id || null,
        channel: commForm.channel,
        direction: commForm.direction,
        subject: commForm.subject,
        body: commForm.body,
        status: commForm.status,
      }),
    });
    setSavingComm(false);
    setShowAddComm(false);
    setCommForm({ channel: 'call', direction: 'outbound', subject: '', body: '', status: 'completed' });
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

          {/* Order History */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-base font-bold text-white mb-4">Order History</h2>
            {(contact.orders ?? []).length === 0 ? (
              <p className="text-sm text-slate-500">No orders found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="text-left text-xs font-medium text-slate-400 pb-2 pr-4">Date</th>
                      <th className="text-left text-xs font-medium text-slate-400 pb-2 pr-4">Status</th>
                      <th className="text-right text-xs font-medium text-slate-400 pb-2 pr-4">Amount</th>
                      <th className="text-right text-xs font-medium text-slate-400 pb-2">Items</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contact.orders.map((order: any) => {
                      const itemCount = Array.isArray(order.items) ? order.items.length : 0;
                      const statusClass = ORDER_STATUS_COLORS[order.status] || 'bg-slate-700/50 text-slate-300 border-slate-600';
                      return (
                        <tr key={order.id} className="border-b border-slate-800/50 last:border-0">
                          <td className="py-2.5 pr-4 text-slate-300 whitespace-nowrap">
                            {new Date(order.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-2.5 pr-4">
                            <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full border capitalize ${statusClass}`}>
                              {order.status || 'unknown'}
                            </span>
                          </td>
                          <td className="py-2.5 pr-4 text-right text-white font-medium whitespace-nowrap">
                            ${(Number(order.amount_cents) / 100).toFixed(2)}
                          </td>
                          <td className="py-2.5 text-right text-slate-400">
                            {itemCount}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Communication Log */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white">Communication Log</h2>
              <button
                onClick={() => setShowAddComm(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium rounded-lg transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Log Communication
              </button>
            </div>
            {(contact.communications ?? []).length === 0 ? (
              <p className="text-sm text-slate-500">No communications recorded</p>
            ) : (
              <div className="space-y-3">
                {[...contact.communications]
                  .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                  .map((comm: any, i: number) => (
                    <div key={comm.id ?? i} className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-xl">
                      {/* Channel icon */}
                      <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                        {comm.channel === 'call' && (
                          <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        )}
                        {comm.channel === 'text' && (
                          <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        )}
                        {comm.channel === 'email' && (
                          <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium text-white capitalize">{comm.channel}</span>
                          <span className={`inline-block px-1.5 py-0.5 text-[10px] font-medium rounded border capitalize ${
                            comm.direction === 'inbound'
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                              : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                          }`}>
                            {comm.direction}
                          </span>
                          {comm.status && (
                            <span className="inline-block px-1.5 py-0.5 text-[10px] font-medium rounded border bg-slate-700/50 text-slate-300 border-slate-600 capitalize">
                              {comm.status.replace(/_/g, ' ')}
                            </span>
                          )}
                        </div>
                        {comm.subject && <p className="text-sm text-slate-300 mt-0.5">{comm.subject}</p>}
                        {comm.body && <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{comm.body}</p>}
                        <p className="text-xs text-slate-600 mt-1">
                          {new Date(comm.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
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
                <span className="text-slate-500 text-xs font-mono">{String(contact.id)}</span>
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

      {/* Log Communication Modal */}
      <Modal open={showAddComm} onClose={() => setShowAddComm(false)} title="Log Communication">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Channel</label>
            <select
              value={commForm.channel}
              onChange={(e) => setCommForm({ ...commForm, channel: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {COMM_CHANNELS.map((c) => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Direction</label>
            <select
              value={commForm.direction}
              onChange={(e) => setCommForm({ ...commForm, direction: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {COMM_DIRECTIONS.map((d) => (
                <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Subject</label>
            <input
              type="text"
              value={commForm.subject}
              onChange={(e) => setCommForm({ ...commForm, subject: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Body</label>
            <textarea
              value={commForm.body}
              onChange={(e) => setCommForm({ ...commForm, body: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Status</label>
            <select
              value={commForm.status}
              onChange={(e) => setCommForm({ ...commForm, status: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {COMM_STATUSES.map((s) => (
                <option key={s} value={s}>{s.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowAddComm(false)} className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">
              Cancel
            </button>
            <button
              onClick={handleAddComm}
              disabled={savingComm}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium rounded-lg disabled:opacity-50 transition-colors"
            >
              {savingComm ? 'Saving...' : 'Log Communication'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
