'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSupabase } from '@/lib/supabase';

type Product = {
  id: string;
  name: string;
  price: number;
  image_url?: string | null;
  summary?: string | null;
  description?: string | null;
  active: boolean;
  sort: number;
  updated_at?: string | null;
};

type EditedProduct = {
  id: string;
  active?: boolean;
  price?: number;
  image_url?: string | null;
  summary?: string | null;
  sort?: number;
};

export default function AdminSettings() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [checked, setChecked] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [edited, setEdited] = useState<Map<string, EditedProduct>>(new Map());
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newProduct, setNewProduct] = useState({
    id: '', name: '', price: '', image_url: '', summary: '', description: '', sort: '0',
  });

  const sorted = useMemo(() => [...products].sort((a, b) => a.sort - b.sort || a.name.localeCompare(b.name)), [products]);
  const hasChanges = edited.size > 0;

  async function getToken() {
    const supabase = getSupabase();
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token || null;
  }

  async function loadProducts() {
    const token = await getToken();
    if (!token) return;
    const res = await fetch('/api/admin-products', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return;
    const json = await res.json();
    setProducts(json.products ?? []);
  }

  useEffect(() => {
    (async () => {
      try {
        const supabase = getSupabase();
        const { data } = await supabase.auth.getUser();
        const ok = (data.user?.email ?? '').toLowerCase() === 'gardenablaze@gmail.com';
        setAuthed(ok);
        if (!ok) router.push('/admin');
      } finally {
        setChecked(true);
      }
    })();
  }, [router]);

  useEffect(() => {
    if (authed) loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed]);

  function updateLocal(productId: string, patch: Partial<EditedProduct>) {
    const existing = edited.get(productId) || { id: productId };
    const updated = { ...existing, ...patch };
    const next = new Map(edited);
    next.set(productId, updated);
    setEdited(next);
    setStatus('idle');
  }

  function getVal<K extends keyof Product>(product: Product, field: K): Product[K] {
    const edit = edited.get(product.id);
    if (edit && field in edit) return (edit as any)[field];
    return product[field];
  }

  async function saveChanges() {
    if (!hasChanges) return;
    setStatus('saving');
    setError('');
    const token = await getToken();
    if (!token) { setStatus('error'); setError('Not logged in'); return; }

    try {
      for (const edit of edited.values()) {
        const product = products.find(p => p.id === edit.id);
        if (!product) continue;
        const payload: Record<string, unknown> = { id: edit.id, name: product.name };
        if (edit.active !== undefined) payload.active = edit.active;
        if (edit.price !== undefined) payload.price = edit.price;
        if (edit.image_url !== undefined) payload.image_url = edit.image_url;
        if (edit.summary !== undefined) payload.summary = edit.summary;
        if (edit.sort !== undefined) payload.sort = edit.sort;

        const res = await fetch('/api/admin-products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Save failed for ' + edit.id);
      }

      setEdited(new Map());
      setStatus('success');
      await loadProducts();
      setTimeout(() => setStatus('idle'), 2000);
    } catch (err: any) {
      setStatus('error');
      setError(err.message || 'Save failed');
    }
  }

  async function createProduct() {
    if (!newProduct.id || !newProduct.name || !newProduct.price) {
      setError('ID, name, and price are required');
      return;
    }
    setCreating(true);
    setError('');
    const token = await getToken();
    if (!token) { setCreating(false); return; }

    try {
      const res = await fetch('/api/admin-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          id: newProduct.id.toLowerCase().replace(/[^a-z0-9-]/g, ''),
          name: newProduct.name,
          price: Number(newProduct.price),
          image_url: newProduct.image_url || null,
          summary: newProduct.summary || null,
          description: newProduct.description || null,
          sort: Number(newProduct.sort) || 0,
          active: true,
        }),
      });

      if (!res.ok) throw new Error('Create failed');
      setShowCreate(false);
      setNewProduct({ id: '', name: '', price: '', image_url: '', summary: '', description: '', sort: '0' });
      await loadProducts();
    } catch (err: any) {
      setError(err.message || 'Create failed');
    } finally {
      setCreating(false);
    }
  }

  if (!checked) return <div className="p-8">Loading...</div>;
  if (!authed) return null;

  const inputClass = 'rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-sky-400 transition';
  const labelClass = 'grid gap-1 text-xs font-bold text-slate-600';

  return (
    <div style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 55%, #eef6ff 100%)' }}>
      <section className="max-w-6xl mx-auto px-4 sm:px-8 pt-10 pb-16">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black" style={{ color: 'var(--text)' }}>Admin Settings</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
              Product management — pricing, images, inventory, availability
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {!showCreate && (
              <button
                onClick={() => setShowCreate(true)}
                className="px-4 py-2 rounded-lg text-sm font-bold text-white"
                style={{ background: '#16a34a' }}
              >
                + New Product
              </button>
            )}
            {hasChanges && (
              <>
                <button
                  onClick={() => { setEdited(new Map()); setStatus('idle'); }}
                  className="px-4 py-2 rounded-lg text-sm font-bold border"
                  style={{ borderColor: 'var(--divider)', color: 'var(--text)' }}
                >
                  Discard
                </button>
                <button
                  onClick={saveChanges}
                  disabled={status === 'saving'}
                  className="px-4 py-2 rounded-lg text-sm font-bold text-white disabled:opacity-50"
                  style={{ background: '#0e66b3' }}
                >
                  {status === 'saving' ? 'Saving...' : `Save Changes (${edited.size})`}
                </button>
              </>
            )}
            <Link
              href="/admin"
              className="px-4 py-2 rounded-lg text-sm font-bold border"
              style={{ borderColor: 'var(--divider)', color: 'var(--text)' }}
            >
              Back
            </Link>
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 font-medium mb-6">{error}</div>
        )}
        {status === 'success' && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 font-medium mb-6">
            Changes saved successfully!
          </div>
        )}

        {/* Create Product Form */}
        {showCreate && (
          <div className="rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-emerald-900">Create New Product</h3>
              <button onClick={() => setShowCreate(false)} className="text-sm font-bold text-emerald-700 hover:text-emerald-900">Cancel</button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className={labelClass}>
                Product ID * (lowercase, no spaces)
                <input className={inputClass} value={newProduct.id} onChange={e => setNewProduct({ ...newProduct, id: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })} placeholder="e.g. cherry-7oh" />
              </label>
              <label className={labelClass}>
                Product Name *
                <input className={inputClass} value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} placeholder="e.g. Cherry 7-OH" />
              </label>
              <label className={labelClass}>
                Price * ($)
                <input className={inputClass} type="number" step="0.01" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} placeholder="49.99" />
              </label>
              <label className={labelClass}>
                Sort Order
                <input className={inputClass} type="number" value={newProduct.sort} onChange={e => setNewProduct({ ...newProduct, sort: e.target.value })} placeholder="0" />
              </label>
              <label className={labelClass}>
                Image URL
                <input className={inputClass} value={newProduct.image_url} onChange={e => setNewProduct({ ...newProduct, image_url: e.target.value })} placeholder="/products/cherry.png" />
              </label>
              <label className={labelClass}>
                Summary
                <input className={inputClass} value={newProduct.summary} onChange={e => setNewProduct({ ...newProduct, summary: e.target.value })} placeholder="Brief product tagline" />
              </label>
              <label className={`${labelClass} md:col-span-2`}>
                Description
                <textarea className={inputClass} rows={3} value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} placeholder="Full product description..." />
              </label>
            </div>
            <div className="mt-4 flex justify-end">
              <button onClick={createProduct} disabled={creating} className="px-6 py-2 rounded-lg text-sm font-bold text-white disabled:opacity-50" style={{ background: '#16a34a' }}>
                {creating ? 'Creating...' : 'Create Product'}
              </button>
            </div>
          </div>
        )}

        {/* Product List */}
        <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.82)', border: '1px solid var(--divider)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Products</h3>
              <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{products.length} total · {products.filter(p => p.active).length} active</p>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-12" style={{ color: 'var(--muted)' }}>
              No products yet. Click "+ New Product" to add one.
            </div>
          ) : (
            <div className="space-y-3">
              {sorted.map(product => {
                const isEdited = edited.has(product.id);
                const isActive = Boolean(getVal(product, 'active'));
                return (
                  <div
                    key={product.id}
                    className={`rounded-xl border p-4 transition-colors ${
                      isEdited ? 'border-sky-300 bg-sky-50' : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      {/* Product info */}
                      <div className="flex gap-4 flex-1 min-w-0">
                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                          {(getVal(product, 'image_url') as string) ? (
                            <img
                              src={getVal(product, 'image_url') as string}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">No img</div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-black" style={{ color: 'var(--text)' }}>
                            {product.name}
                            {isEdited && <span className="ml-2 text-xs font-bold text-sky-600">● UNSAVED</span>}
                            {!isActive && <span className="ml-2 text-xs font-bold text-red-500">DISABLED</span>}
                          </div>
                          <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                            ID: {product.id} · Sort: {getVal(product, 'sort') as number}
                          </div>
                          <div className="text-sm mt-1 font-bold" style={{ color: '#0e66b3' }}>
                            ${Number(getVal(product, 'price')).toFixed(2)}
                          </div>
                          {product.summary && (
                            <div className="text-xs mt-1 truncate" style={{ color: 'var(--muted)' }}>{product.summary}</div>
                          )}
                        </div>
                      </div>

                      {/* Edit controls */}
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:items-end flex-shrink-0">
                        <label className={labelClass}>
                          Price ($)
                          <input
                            type="number"
                            step="0.01"
                            className={inputClass}
                            value={Number(getVal(product, 'price')).toFixed(2)}
                            onChange={e => updateLocal(product.id, { price: Number(e.target.value) })}
                          />
                        </label>
                        <label className={labelClass}>
                          Sort
                          <input
                            type="number"
                            className={inputClass}
                            value={getVal(product, 'sort') as number}
                            onChange={e => updateLocal(product.id, { sort: Number(e.target.value) })}
                          />
                        </label>
                        <label className={labelClass}>
                          Image URL
                          <input
                            type="text"
                            className={inputClass}
                            value={(getVal(product, 'image_url') as string) || ''}
                            onChange={e => updateLocal(product.id, { image_url: e.target.value || null })}
                            placeholder="/products/..."
                          />
                        </label>
                        <label className={labelClass}>
                          Active
                          <div className="flex items-center gap-2 py-2">
                            <button
                              onClick={() => updateLocal(product.id, { active: !isActive })}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                isActive ? 'bg-emerald-500' : 'bg-slate-300'
                              }`}
                            >
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow ${
                                isActive ? 'translate-x-6' : 'translate-x-1'
                              }`} />
                            </button>
                            <span className="text-xs font-medium" style={{ color: isActive ? '#16a34a' : '#94a3b8' }}>
                              {isActive ? 'On' : 'Off'}
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="mt-3 text-xs" style={{ color: 'var(--muted)' }}>
                      Last updated: {product.updated_at ? new Date(product.updated_at).toLocaleString() : '—'}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
