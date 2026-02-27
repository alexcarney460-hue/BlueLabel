import { NextResponse } from 'next/server';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const adminToken = process.env.ADMIN_ANALYTICS_TOKEN;
  const publicToken = process.env.NEXT_PUBLIC_ADMIN_ANALYTICS_TOKEN;

  return NextResponse.json({
    ok: true,
    hasSupabaseUrl: Boolean(supabaseUrl),
    hasServiceRole: Boolean(serviceRole),
    hasAdminToken: Boolean(adminToken),
    hasPublicToken: Boolean(publicToken),
    tokensMatch: Boolean(adminToken && publicToken && adminToken === publicToken),
  });
}
