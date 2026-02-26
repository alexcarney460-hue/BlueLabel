import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return NextResponse.json({ error: 'missing_supabase_env' }, { status: 500 });
  }

  const res = await fetch(`${url}/rest/v1/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: key,
      Authorization: `Bearer ${key}`,
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      event_type: body.event_type,
      path: body.path,
      referrer: body.referrer ?? null,
      user_agent: body.user_agent ?? null,
      product_id: body.product_id ?? null,
      user_email: body.user_email ?? null,
      meta: body.meta ?? {},
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json({ error: 'supabase_insert_failed', detail: text }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
