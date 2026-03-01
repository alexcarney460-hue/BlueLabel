import { NextResponse } from 'next/server';

// Creates required custom properties in HubSpot (best-effort).
// Protect this route with ADMIN_ANALYTICS_TOKEN to avoid exposing it publicly.

export async function POST(req: Request) {
  const adminToken = process.env.ADMIN_ANALYTICS_TOKEN;
  const auth = req.headers.get('authorization') || '';
  if (!adminToken || auth !== `Bearer ${adminToken}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const token = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
  if (!token) return NextResponse.json({ error: 'missing_hubspot_token' }, { status: 500 });

  const groupName = 'bluelabel';

  async function createGroupIfMissing() {
    const res = await fetch('https://api.hubapi.com/crm/v3/properties/contacts/groups', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return;
    const groups = (await res.json()) as Array<{ name: string }>;
    if (groups.some((g) => g.name === groupName)) return;

    await fetch('https://api.hubapi.com/crm/v3/properties/contacts/groups', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: groupName, label: 'BlueLabel' }),
    });
  }

  async function ensureProperty(property: any) {
    // HubSpot returns 409 if exists; treat as ok
    const res = await fetch('https://api.hubapi.com/crm/v3/properties/contacts', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(property),
    });

    if (res.ok) return { ok: true, status: res.status };
    const text = await res.text().catch(() => '');
    if (res.status === 409) return { ok: true, status: 409 };
    return { ok: false, status: res.status, hint: text.slice(0, 300) };
  }

  await createGroupIfMissing();

  const results: Record<string, any> = {};

  results.bluelabel_customer_category = await ensureProperty({
    name: 'bluelabel_customer_category',
    label: 'BlueLabel Customer Category',
    groupName,
    type: 'enumeration',
    fieldType: 'select',
    description: 'Retail vs wholesale vs distributor category from BlueLabel Wholesale site.',
    options: [
      { label: 'Retail', value: 'retail', displayOrder: 1 },
      { label: 'Wholesale', value: 'wholesale', displayOrder: 2 },
      { label: 'Distributor', value: 'distributor', displayOrder: 3 },
    ],
  });

  results.bluelabel_company_name = await ensureProperty({
    name: 'bluelabel_company_name',
    label: 'BlueLabel Company Name',
    groupName,
    type: 'string',
    fieldType: 'text',
    description: 'Company name captured at signup.',
  });

  results.bluelabel_last_order_submitted_at = await ensureProperty({
    name: 'bluelabel_last_order_submitted_at',
    label: 'BlueLabel Last Order Submitted At',
    groupName,
    type: 'datetime',
    fieldType: 'date',
    description: 'Timestamp of last order submission from BlueLabel site.',
  });

  results.bluelabel_last_order_subtotal = await ensureProperty({
    name: 'bluelabel_last_order_subtotal',
    label: 'BlueLabel Last Order Subtotal',
    groupName,
    type: 'string',
    fieldType: 'text',
    description: 'Subtotal captured at order submit.',
  });

  return NextResponse.json({ ok: true, results });
}
