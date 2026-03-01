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
      visitor_id: body.visitor_id ?? null,
      session_id: body.session_id ?? null,
      utm: body.utm ?? {},
      meta: body.meta ?? {},
    }),
  });

  if (!res.ok) {
    // Return safe debugging info (no secrets) so we can diagnose prod failures.
    let details: any = null;
    try {
      const text = await res.text();
      details = text?.slice(0, 300);
    } catch {
      // ignore
    }

    return NextResponse.json(
      {
        error: 'supabase_insert_failed',
        status: res.status,
        hint: details,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
