type HubSpotContactProperties = Record<string, any>;

function getHubspotToken() {
  const token = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
  if (!token) throw new Error('missing_hubspot_token');
  return token;
}

function normalizeEmail(email?: string | null) {
  const e = (email ?? '').trim().toLowerCase();
  return e || null;
}

export function splitName(fullName?: string) {
  const n = (fullName ?? '').trim().replace(/\s+/g, ' ');
  if (!n) return { firstname: undefined, lastname: undefined };
  const parts = n.split(' ');
  if (parts.length === 1) return { firstname: parts[0], lastname: undefined };
  return { firstname: parts[0], lastname: parts.slice(1).join(' ') };
}

export function mapAccountTypeToCategory(account_type?: string | null) {
  if (!account_type) return undefined;
  if (account_type === 'retail') return 'retail';
  if (account_type === 'shop') return 'wholesale';
  if (account_type === 'distributor') return 'distributor';
  return undefined;
}

export async function hubspotUpsertContact(input: {
  email: string;
  properties?: HubSpotContactProperties;
}): Promise<{ ok: true } | { ok: false; error: string; status?: number }> {
  const email = normalizeEmail(input.email);
  if (!email) return { ok: false, error: 'missing_email' };

  const token = getHubspotToken();

  try {
    // Create or update a contact by email
    const res = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${encodeURIComponent(email)}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: {
          email,
          ...(input.properties ?? {}),
        },
      }),
    });

    if (!res.ok) {
      // safe hint (no secrets)
      const text = await res.text().catch(() => '');
      return { ok: false, error: text?.slice(0, 300) || 'hubspot_error', status: res.status };
    }

    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: 'hubspot_fetch_failed' };
  }
}
