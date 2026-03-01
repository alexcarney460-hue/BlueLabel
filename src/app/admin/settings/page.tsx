'use client';

import { useEffect, useState } from 'react';
import { getSupabase } from '@/lib/supabase';

type Product = {
  id: string;
  name: string;
  price: number;
  image_url?: string | null;
  active: boolean;
  sort: number;
  summary?: string | null;
};

export default function AdminSettings() {
  const [authed, setAuthed] = useState(false);
  const [checked, setChecked] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<Partial<Product>>({ active: true, sort: 0, price: 0 });
  const [status, setStatus] = useState<string>('');
  const [hubspotStatus, setHubspotStatus] = useState<string>('');

  async function load() {
    setStatus('');
    const supabase = getSupabase();
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) {
      setStatus('Not logged in');
      return;
    }

    const res = await fetch('/api/admin-products', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      setStatus('Failed to load products');
      return;
    }
    const json = await res.json();
    setProducts(json.products ?? []);
  }

  useEffect(() => {
    (async () => {
      try {
        const supabase = getSupabase();
        const { data } = await supabase.auth.getUser();
        setAuthed((data.user?.email ?? '').toLowerCase() === 'gardenablaze@gmail.com');
      } finally {
        setChecked(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!authed) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed]);

  async function setupHubspotProperties() {
    setHubspotStatus('');

    const token = process.env.NEXT_PUBLIC_ADMIN_ANALYTICS_TOKEN;
    if (!token) {
      setHubspotStatus('Missing NEXT_PUBLIC_ADMIN_ANALYTICS_TOKEN');
      return;
    }

    try {
      const res = await fetch('/api/hubspot/ensure-properties', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        setHubspotStatus(`HubSpot setup failed (${res.status})`);
        return;
      }

      // quick human summary
      const results = json?.results ?? {};
      const failures = Object.entries(results).filter(([, v]: any) => v && v.ok === false);
      if (failures.length) {
        setHubspotStatus(`HubSpot setup completed with ${failures.length} warnings`);
      } else {
        setHubspotStatus('HubSpot properties ready');
      }
    } catch {
      setHubspotStatus('HubSpot setup failed (network)');
    }
  }

  async function seedDefaults() {
    setStatus('');
    const supabase = getSupabase();
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) {
      setStatus('Not logged in');
      return;
    }

    const res = await fetch('/api/admin-products/seed', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      let msg = 'Seed failed';
      try {
        const j = await res.json();
        if (j?.detail) msg = `Seed failed: ${String(j.detail).slice(0, 120)}`;
      } catch {
        // ignore
      }
      setStatus(msg);
      return;
    }

    setStatus('Seeded');
    await load();
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setStatus('');

    const supabase = getSupabase();
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) return;

    const res = await fetch('/api/admin-products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      setStatus('Save failed');
      return;
    }

    setStatus('Saved');
    setForm({ active: true, sort: 0, price: 0 });
    await load();
  }

  if (!checked) return <div className="p-8">Loading…</div>;

  if (!authed) {
    return (
      <div className="p-8">
        <div className="font-black text-xl mb-2">Admin Settings</div>
        <div className="text-slate-600 mb-4">Not authorized.</div>
        <a href="/profile" className="inline-block px-4 py-2 rounded-lg font-bold" style={{ background: 'var(--brand)', color: 'white' }}>Go to profile</a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-black">Admin Settings</h1>
            <div className="text-slate-600">Products (unit price, photos, active)</div>
          </div>
          <div className="flex gap-2 flex-wrap justify-end">
            <button onClick={setupHubspotProperties} className="px-4 py-2 rounded-lg font-bold" style={{ background: '#f97316', color: 'white' }}>
              Setup HubSpot Properties
            </button>
            <button onClick={seedDefaults} className="px-4 py-2 rounded-lg font-bold" style={{ background: 'var(--brand)', color: 'white' }}>Seed defaults</button>
            <a href="/admin" className="px-4 py-2 rounded-lg border font-bold">Back</a>
          </div>
        </div>

        {hubspotStatus && (
          <div className="mb-4 text-sm font-bold" style={{ color: 'var(--text)' }}>{hubspotStatus}</div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div className="border rounded-2xl p-4">
            <div className="font-black mb-3">Upsert product</div>
            <form onSubmit={save} className="space-y-3">
              <input className="w-full border rounded-lg px-3 py-2" placeholder="id (e.g. cherry)" value={form.id ?? ''} onChange={(e)=>setForm(f=>({ ...f, id: e.target.value }))} />
              <input className="w-full border rounded-lg px-3 py-2" placeholder="name" value={form.name ?? ''} onChange={(e)=>setForm(f=>({ ...f, name: e.target.value }))} />
              <input className="w-full border rounded-lg px-3 py-2" placeholder="unit price" type="number" step="0.01" value={form.price ?? 0} onChange={(e)=>setForm(f=>({ ...f, price: Number(e.target.value) }))} />
              <input className="w-full border rounded-lg px-3 py-2" placeholder="image_url (/cherry.jpg or https://...)" value={form.image_url ?? ''} onChange={(e)=>setForm(f=>({ ...f, image_url: e.target.value }))} />
              <input className="w-full border rounded-lg px-3 py-2" placeholder="summary" value={form.summary ?? ''} onChange={(e)=>setForm(f=>({ ...f, summary: e.target.value }))} />
              <div className="flex gap-3">
                <label className="flex items-center gap-2 text-sm font-bold">
                  <input type="checkbox" checked={form.active !== false} onChange={(e)=>setForm(f=>({ ...f, active: e.target.checked }))} />
                  Active
                </label>
                <input className="w-24 border rounded-lg px-3 py-2" placeholder="sort" type="number" value={form.sort ?? 0} onChange={(e)=>setForm(f=>({ ...f, sort: Number(e.target.value) }))} />
              </div>
              <button className="w-full bg-sky-500 hover:bg-sky-600 text-black font-black py-3 rounded-lg">Save</button>
              {status && <div className="text-sm text-slate-700">{status}</div>}
            </form>
          </div>

          <div className="border rounded-2xl p-4">
            <div className="font-black mb-3">Current products</div>
            <div className="space-y-2">
              {products.map((p) => (
                <div key={p.id} className="border rounded-xl p-3">
                  <div className="flex items-center justify-between">
                    <div className="font-bold">{p.name} <span className="text-slate-500">({p.id})</span></div>
                    <div className="font-black">${Number(p.price).toFixed(2)}</div>
                  </div>
                  <div className="text-xs text-slate-600 mt-1">active: {String(p.active)} | sort: {p.sort} | image: {p.image_url ?? ''}</div>
                </div>
              ))}
              {products.length === 0 && <div className="text-slate-600 text-sm">No products yet.</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
