'use client';

import { useEffect, useState } from 'react';
import Header from '@/app/Header';
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

  const Shell = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen font-sans" style={{ background: 'var(--bg)' }}>
      {/* Announcement Banner */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-sky-500 via-sky-300 to-sky-500 text-white h-8 sm:h-auto sm:py-3 px-3 sm:px-8 text-center font-semibold overflow-hidden text-xs sm:text-base">
        <div className="max-w-6xl mx-auto h-8 sm:h-auto flex items-center justify-center whitespace-nowrap overflow-hidden text-ellipsis sm:whitespace-normal sm:overflow-visible sm:text-clip">
          Profile — manage your account type and access wholesale pricing.
        </div>
      </div>

      {/* Header */}
      <div className="sticky top-8 sm:top-12 z-50">
        <Header />
      </div>

      <section className="pt-20 sm:pt-28 pb-16 px-4 sm:px-8" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 55%, #eef6ff 100%)' }}>
        <div className="max-w-md mx-auto">
          {children}
        </div>
      </section>

      <footer className="py-8 px-8 text-center" style={{ background: 'var(--bg)', color: 'var(--muted)', borderTop: '1px solid var(--divider)' }}>
        <p>© 2026 BlueLabel. All rights reserved.</p>
      </footer>
    </div>
  );

  if (!email) {
    return (
      <Shell>
        <div className="mb-6">
          <p className="text-sm font-bold uppercase tracking-wide mb-2" style={{ color: 'var(--brand-2)' }}>Profile</p>
          <h1 className="text-3xl sm:text-4xl font-black" style={{ color: 'var(--text)' }}>Sign in required</h1>
          <p className="mt-2" style={{ color: 'var(--muted)' }}>You’re not signed in yet.</p>
        </div>

        <div className="rounded-3xl p-6" style={{ background: 'rgba(255,255,255,0.78)', border: '1px solid var(--divider)', boxShadow: 'var(--shadow-md)' }}>
          <a href="/login" className="inline-block px-4 py-2 rounded-lg font-bold transition" style={{ background: 'var(--brand)', color: 'white' }}>Sign in</a>
        </div>
      </Shell>
    );
  }

  const isAdmin = email.toLowerCase() === ADMIN_EMAIL;

  return (
    <Shell>
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-wide mb-2" style={{ color: 'var(--brand-2)' }}>Profile</p>
        <h1 className="text-3xl sm:text-4xl font-black" style={{ color: 'var(--text)' }}>Account</h1>
        <p className="mt-2" style={{ color: 'var(--muted)' }}>Your pricing and wholesale access follow your account type.</p>
      </div>

      <div className="rounded-3xl p-6 mb-4" style={{ background: 'rgba(255,255,255,0.78)', border: '1px solid var(--divider)', boxShadow: 'var(--shadow-md)' }}>
        <div className="text-sm" style={{ color: 'var(--muted)' }}>Signed in as</div>
        <div className="font-black" style={{ color: 'var(--text)' }}>{email}</div>
        <div className="mt-3 text-sm" style={{ color: 'var(--text)' }}>
          <span className="font-bold">Account type:</span>{' '}
          <span style={{ color: 'var(--muted)' }}>{accountType ? accountType : '—'}</span>
          {companyName ? <span style={{ color: 'var(--muted)' }}> · {companyName}</span> : null}
        </div>
        <div className="mt-4 flex gap-2">
          <button onClick={logout} className="px-4 py-2 rounded-lg border font-bold" style={{ borderColor: 'var(--divider)' }}>Sign out</button>
        </div>
      </div>

      {isAdmin && (
        <div className="rounded-3xl p-6" style={{ background: 'rgba(255,255,255,0.78)', border: '1px solid var(--divider)', boxShadow: 'var(--shadow-md)' }}>
          <div className="text-xs font-black uppercase tracking-wide" style={{ color: 'var(--brand-2)' }}>Admin</div>
          <div className="font-bold mb-3" style={{ color: 'var(--text)' }}>Analytics dashboard</div>
          <a href="/admin" className="inline-block px-4 py-2 rounded-lg font-black transition" style={{ background: 'var(--brand)', color: 'white' }}>Open /admin</a>
        </div>
      )}
    </Shell>
  );
}
