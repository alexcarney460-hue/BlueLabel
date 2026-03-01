'use client';

import { useEffect, useState } from 'react';
import Header from '@/app/Header';
import { getSupabase } from '@/lib/supabase';
import { upsertMyProfile } from '@/lib/account';
import { track } from '@/app/Track';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState<'retail' | 'shop' | 'distributor'>('retail');
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const supabase = getSupabase();
        const { data } = await supabase.auth.getUser();
        setUserEmail(data.user?.email ?? null);
      } catch {
        setUserEmail(null);
      }
    })();
  }, []);

  async function signup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      const supabase = getSupabase();
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;

      // Create profile (retail/shop/distributor) immediately after signup
      await upsertMyProfile({ account_type: accountType, company_name: companyName });

      // Best-effort contact creation in HubSpot happens server-side.
      // We just fire an event; backend can also be wired later if we want.
      track('signup_completed', { meta: { account_type: accountType, company_name: companyName } });

      window.location.href = '/profile';
    } catch {
      setError('Signup failed');
    }
  }

  const Shell = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen font-sans" style={{ background: 'var(--bg)' }}>
      {/* Announcement Banner */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-sky-500 via-sky-300 to-sky-500 text-white h-8 sm:h-auto sm:py-3 px-3 sm:px-8 text-center font-semibold overflow-hidden text-xs sm:text-base">
        <div className="max-w-6xl mx-auto h-8 sm:h-auto flex items-center justify-center whitespace-nowrap overflow-hidden text-ellipsis sm:whitespace-normal sm:overflow-visible sm:text-clip">
          Create an account to unlock wholesale pricing and faster reorders.
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

  if (userEmail) {
    return (
      <Shell>
        <div className="rounded-3xl p-6" style={{ background: 'rgba(255,255,255,0.78)', border: '1px solid var(--divider)', boxShadow: 'var(--shadow-md)' }}>
          <p className="text-sm font-bold uppercase tracking-wide" style={{ color: 'var(--brand-2)' }}>Create account</p>
          <h1 className="text-3xl font-black mt-2" style={{ color: 'var(--text)' }}>You’re already signed in</h1>
          <div className="mt-4" style={{ color: 'var(--muted)' }}>Signed in as</div>
          <div className="font-black" style={{ color: 'var(--text)' }}>{userEmail}</div>
          <a href="/profile" className="inline-block mt-5 px-4 py-2 rounded-lg font-bold transition" style={{ background: 'var(--brand)', color: 'white' }}>
            Go to profile
          </a>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-wide mb-2" style={{ color: 'var(--brand-2)' }}>Create account</p>
        <h1 className="text-3xl sm:text-4xl font-black" style={{ color: 'var(--text)' }}>Get wholesale access</h1>
        <p className="mt-2" style={{ color: 'var(--muted)' }}>Create an account to shop retail or unlock wholesale pricing.</p>
      </div>

      <form onSubmit={signup} className="rounded-3xl p-6" style={{ background: 'rgba(255,255,255,0.78)', border: '1px solid var(--divider)', boxShadow: 'var(--shadow-md)' }}>
        <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text)' }}>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
          placeholder="you@company.com"
          className="w-full border rounded-lg px-3 py-2 mb-3 bg-white"
          style={{ borderColor: 'var(--divider)' }}
        />

        <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text)' }}>Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
          placeholder="••••••••"
          className="w-full border rounded-lg px-3 py-2 mb-4 bg-white"
          style={{ borderColor: 'var(--divider)' }}
        />

        <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text)' }}>Account type</label>
        <select
          value={accountType}
          onChange={(e) => setAccountType(e.target.value as any)}
          className="w-full border rounded-lg px-3 py-2 mb-3 bg-white"
          style={{ borderColor: 'var(--divider)' }}
        >
          <option value="retail">Retail customer</option>
          <option value="shop">Retailer (wholesale)</option>
          <option value="distributor">Distributor (wholesale)</option>
        </select>

        <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text)' }}>Company name (optional)</label>
        <input
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          type="text"
          placeholder="Your shop / company"
          className="w-full border rounded-lg px-3 py-2 mb-4 bg-white"
          style={{ borderColor: 'var(--divider)' }}
        />

        <button className="w-full font-black py-3 rounded-lg transition" style={{ background: 'var(--brand)', color: 'white', boxShadow: 'var(--shadow-sm)' }}>
          Create account
        </button>

        {error && <div className="text-sm mt-3" style={{ color: '#b91c1c' }}>{error}</div>}

        <div className="text-sm mt-4" style={{ color: 'var(--muted)' }}>
          Already have an account? <a className="font-bold underline" href="/login">Sign in</a>
        </div>
      </form>
    </Shell>
  );
}
