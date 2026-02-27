import { NextResponse } from 'next/server';
import { allProducts } from '@/lib/products';

const ADMIN_EMAIL = 'gardenablaze@gmail.com';

async function requireAdmin(req: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !service || !anon) return { ok: false as const, res: NextResponse.json({ error: 'missing_env' }, { status: 500 }) };

  const authHeader = req.headers.get('authorization') || '';
  const jwt = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  if (!jwt) return { ok: false as const, res: NextResponse.json({ error: 'unauthorized' }, { status: 401 }) };

  const me = await fetch(`${url}/auth/v1/user`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
      apikey: anon,
    } as HeadersInit,
  });
  if (!me.ok) return { ok: false as const, res: NextResponse.json({ error: 'unauthorized' }, { status: 401 }) };
  const user = await me.json();
  const email = (user?.email ?? '').toLowerCase();
  if (email !== ADMIN_EMAIL) return { ok: false as const, res: NextResponse.json({ error: 'forbidden' }, { status: 403 }) };

  return { ok: true as const, url, service };
}

export async function POST(req: Request) {
  const admin = await requireAdmin(req);
  if (!admin.ok) return admin.res;

  const seed = allProducts.map((p, idx) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    image_url: p.image,
    summary: p.summary,
    description: p.description,
    active: true,
    sort: idx,
    updated_at: new Date().toISOString(),
  }));

  const res = await fetch(`${admin.url}/rest/v1/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: admin.service,
      Authorization: `Bearer ${admin.service}`,
      Prefer: 'resolution=merge-duplicates,return=representation',
    } as HeadersInit,
    body: JSON.stringify(seed),
  });

  if (!res.ok) {
    const detail = await res.text();
    return NextResponse.json({ error: 'seed_failed', status: res.status, detail: detail.slice(0, 500) }, { status: 500 });
  }
  const json = await res.json();
  return NextResponse.json({ ok: true, inserted: Array.isArray(json) ? json.length : 0 });
}
