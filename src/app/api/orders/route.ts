import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return NextResponse.json({ error: 'missing_supabase_env' }, { status: 500 });
  }

  const res = await fetch(`${url}/rest/v1/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: key,
      Authorization: `Bearer ${key}`,
      Prefer: 'return=representation',
    },
    body: JSON.stringify({
      status: 'new',
      payload: body,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json({ error: 'supabase_insert_failed', detail: text }, { status: 500 });
  }

  const data = await res.json();
  return NextResponse.json({ ok: true, data });
}
