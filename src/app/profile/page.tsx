'use client';

import { useEffect, useState } from 'react';
import { getSupabase } from '@/lib/supabase';
import { getMyProfile } from '@/lib/account';

const ADMIN_EMAIL = 'gardenablaze@gmail.com';

export default function ProfilePage() {
  const [email, setEmail] = useState<string | null>(null);
  const [accountType, setAccountType] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const supabase = getSupabase();
        const { data } = await supabase.auth.getUser();
        setEmail(data.user?.email ?? null);

        const p = await getMyProfile();
        setAccountType(p?.account_type ?? null);
        setCompanyName(p?.company_name ?? null);
      } catch {
        setEmail(null);
      }
    })();
  }, []);

  async function logout() {
    try {
      const supabase = getSupabase();
      await supabase.auth.signOut();
      window.location.href = '/';
    } catch {
      // ignore
    }
  }

  if (!email) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-black mb-2">Profile</h1>
          <div className="border rounded-2xl p-4">
            <div className="text-slate-600 mb-4">You’re not signed in.</div>
            <a href="/login" className="inline-block px-4 py-2 rounded-lg font-bold" style={{ background: 'var(--brand)', color: 'white' }}>Sign in</a>
          </div>
        </div>
      </div>
    );
  }

  const isAdmin = email.toLowerCase() === ADMIN_EMAIL;

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-black mb-2">Profile</h1>
        <div className="border rounded-2xl p-4 mb-4">
          <div className="text-sm text-slate-600">Signed in as</div>
          <div className="font-bold">{email}</div>
          <div className="mt-3 text-sm text-slate-700">
            <span className="font-bold">Account type:</span>{' '}
            {accountType ? accountType : '—'}
            {companyName ? <span className="text-slate-500"> · {companyName}</span> : null}
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={logout} className="px-4 py-2 rounded-lg border font-bold">Sign out</button>
          </div>
        </div>

        {isAdmin && (
          <div className="border rounded-2xl p-4">
            <div className="text-xs text-sky-700 font-black uppercase tracking-wide">Admin</div>
            <div className="font-bold mb-3">Analytics dashboard</div>
            <a href="/admin" className="inline-block px-4 py-2 rounded-lg bg-sky-500 text-black font-black">Open /admin</a>
          </div>
        )}
      </div>
    </div>
  );
}
