import { NextResponse } from 'next/server';
import { hubspotUpsertContact, mapAccountTypeToCategory, splitName } from '@/lib/hubspot';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));

  const email = (body?.email ?? '').trim().toLowerCase();
  const password = body?.password ?? '';
  const account_type = body?.account_type ?? 'retail';
  const company_name = body?.company_name ?? null;

  if (!email || !password) return NextResponse.json({ error: 'missing_email_or_password' }, { status: 400 });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !serviceKey || !anonKey) {
    return NextResponse.json({ error: 'missing_supabase_env' }, { status: 500 });
  }

  // Create user via Supabase Admin API
  const createUserRes = await fetch(`${url}/auth/v1/admin/users`, {
    method: 'POST',
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
      email_confirm: true,
      user_metadata: { account_type, company_name },
    }),
  });

  if (!createUserRes.ok) {
    const text = await createUserRes.text().catch(() => '');
    return NextResponse.json({ error: 'supabase_user_create_failed', hint: text.slice(0, 300) }, { status: 500 });
  }

  const created = await createUserRes.json();
  const userId = created?.id;

  // Upsert profile row (best-effort)
  try {
    if (userId) {
      await fetch(`${url}/rest/v1/profiles`, {
        method: 'POST',
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates,return=minimal',
        },
        body: JSON.stringify({
          user_id: userId,
          email,
          account_type,
          company_name,
        }),
      });
    }
  } catch {
    // ignore
  }

  // HubSpot upsert (best-effort)
  try {
    const { firstname, lastname } = splitName(body?.name);
    await hubspotUpsertContact({
      email,
      properties: {
        firstname,
        lastname,
        bluelabel_company_name: company_name || undefined,
        bluelabel_customer_category: mapAccountTypeToCategory(account_type) || undefined,
        lifecyclestage: 'lead',
      },
    });
  } catch {
    // ignore
  }

  // Now sign the user in (password grant)
  const signInRes = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      apikey: anonKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!signInRes.ok) {
    const text = await signInRes.text().catch(() => '');
    return NextResponse.json({ ok: true, needsLogin: true, hint: text.slice(0, 200) });
  }

  const session = await signInRes.json();

  // Set Supabase session cookies (GoTrue style)
  // This mirrors what supabase-js would do client-side.
  const headers = new Headers({ 'Content-Type': 'application/json' });
  const tokenName = `sb-${url.split('//')[1].split('.')[0]}-auth-token`;

  headers.append(
    'Set-Cookie',
    `${tokenName}=${encodeURIComponent(JSON.stringify(session))}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`
  );

  return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
}
