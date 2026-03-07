import { NextResponse } from 'next/server';

/**
 * Validates the admin Bearer token from the Authorization header.
 * Returns null if authorised, or a NextResponse 401/500 to send back.
 */
export function requireAdmin(req: Request): NextResponse | null {
  const adminToken = process.env.ADMIN_ANALYTICS_TOKEN;

  if (!adminToken) {
    return NextResponse.json(
      { ok: false, error: 'missing_env' },
      { status: 500 },
    );
  }

  const auth = req.headers.get('authorization') || '';
  if (auth !== `Bearer ${adminToken}`) {
    return NextResponse.json(
      { ok: false, error: 'unauthorized' },
      { status: 401 },
    );
  }

  return null; // authorised
}
