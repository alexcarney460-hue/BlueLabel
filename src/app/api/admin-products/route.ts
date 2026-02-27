import { NextResponse } from 'next/server';

const ADMIN_EMAIL = 'gardenablaze@gmail.com';

async function requireAdmin(req: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !service) return { ok: false as const, res: NextResponse.json({ error: 'missing_env' }, { status: 500 }) };

  const authHeader = req.headers.get('authorization') || '';
  const jwt = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  if (!jwt) return { ok: false as const, res: NextResponse.json({ error: 'unauthorized' }, { status: 401 }) };

  const me = await fetch(`${url}/auth/v1/user`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    } as HeadersInit,
  });

  if (!me.ok) return { ok: false as const, res: NextResponse.json({ error: 'unauthorized' }, { status: 401 }) };
  const user = await me.json();
  const email = (user?.email ?? '').toLowerCase();
  if (email !== ADMIN_EMAIL) return { ok: false as const, res: NextResponse.json({ error: 'forbidden' }, { status: 403 }) };

  return { ok: true as const, url, service };
}

function sbHeaders(service: string) {
  return {
    'Content-Type': 'application/json',
    apikey: service,
    Authorization: `Bearer ${service}`,
  } as HeadersInit;
}

export async function GET(req: Request) {
  const admin = await requireAdmin(req);
  if (!admin.ok) return admin.res;

  const q = new URL(`${admin.url}/rest/v1/products`);
  q.searchParams.set('select', '*');
  q.searchParams.set('order', 'sort.asc');

  const res = await fetch(q.toString(), { headers: sbHeaders(admin.service) });
  const data = res.ok ? await res.json() : [];
  return NextResponse.json({ ok: true, products: data });
}

export async function POST(req: Request) {
  const admin = await requireAdmin(req);
  if (!admin.ok) return admin.res;

  const body = await req.json();
  const payload = {
    id: String(body.id || '').trim(),
    name: String(body.name || '').trim(),
    price: Number(body.price ?? 0),
    image_url: body.image_url ? String(body.image_url) : null,
    summary: body.summary ? String(body.summary) : null,
    description: body.description ? String(body.description) : null,
    active: body.active !== false,
    sort: Number.isFinite(Number(body.sort)) ? Number(body.sort) : 0,
    updated_at: new Date().toISOString(),
  };

  if (!payload.id || !payload.name) {
    return NextResponse.json({ error: 'missing_fields' }, { status: 400 });
  }

  const res = await fetch(`${admin.url}/rest/v1/products`, {
    method: 'POST',
    headers: {
      ...sbHeaders(admin.service),
      Prefer: 'resolution=merge-duplicates,return=representation',
    } as HeadersInit,
    body: JSON.stringify(payload),
  });

  if (!res.ok) return NextResponse.json({ error: 'upsert_failed' }, { status: 500 });
  const json = await res.json();
  return NextResponse.json({ ok: true, product: json?.[0] ?? null });
}
