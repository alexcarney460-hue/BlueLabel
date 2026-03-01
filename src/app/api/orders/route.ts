import { NextResponse } from 'next/server';
import { hubspotUpsertContact, splitName } from '@/lib/hubspot';

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

  // Best-effort HubSpot contact upsert (don’t block order creation on HubSpot downtime)
  try {
    const customer = body?.customer ?? {};
    const shipping = body?.shipping ?? {};
    const { firstname, lastname } = splitName(customer?.name);

    const email = (customer?.email ?? '').trim();
    if (email) {
      await hubspotUpsertContact({
        email,
        properties: {
          firstname,
          lastname,
          phone: customer?.phone || undefined,
          address: shipping?.address1 || undefined,
          address2: shipping?.address2 || undefined,
          city: shipping?.city || undefined,
          state: shipping?.state || undefined,
          zip: shipping?.zip || undefined,
          lifecyclestage: 'customer',
          bluelabel_last_order_submitted_at: new Date().toISOString(),
          bluelabel_last_order_subtotal: String(body?.subtotal ?? ''),
        },
      });
    }
  } catch {
    // ignore
  }

  return NextResponse.json({ ok: true, data });
}
