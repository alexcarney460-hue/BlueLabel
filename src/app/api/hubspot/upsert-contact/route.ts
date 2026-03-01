import { NextResponse } from 'next/server';
import { hubspotUpsertContact, mapAccountTypeToCategory, splitName } from '@/lib/hubspot';

// Minimal server-side endpoint for upserting a HubSpot contact.
// Protected by ADMIN_ANALYTICS_TOKEN to prevent abuse.

export async function POST(req: Request) {
  const adminToken = process.env.ADMIN_ANALYTICS_TOKEN;
  const auth = req.headers.get('authorization') || '';
  if (!adminToken || auth !== `Bearer ${adminToken}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const email = (body?.email ?? '').trim();
  if (!email) return NextResponse.json({ error: 'missing_email' }, { status: 400 });

  const { firstname, lastname } = splitName(body?.name);
  const category = mapAccountTypeToCategory(body?.account_type ?? body?.accountType);

  const result = await hubspotUpsertContact({
    email,
    properties: {
      firstname,
      lastname,
      phone: body?.phone || undefined,
      bluelabel_company_name: body?.company_name || body?.companyName || undefined,
      bluelabel_customer_category: category || undefined,
      lifecyclestage: body?.lifecyclestage || 'lead',
    },
  });

  if (!result.ok) return NextResponse.json(result, { status: 500 });
  return NextResponse.json({ ok: true });
}
