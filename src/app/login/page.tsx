'use client';

import { useEffect, useState } from 'react';
import Header from '@/app/Header';
import { getSupabase } from '@/lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
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

  const [password, setPassword] = useState('');

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      const supabase = getSupabase();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      window.location.href = '/profile';
    } catch {
      setError('Login failed');
    }
  }

  async function logout() {
    try {
      const supabase = getSupabase();
      await supabase.auth.signOut();
      setUserEmail(null);
    } catch {
      // ignore
    }
  }

  const Shell = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen font-sans" style={{ background: 'var(--bg)' }}>
      {/* Announcement Banner */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-sky-500 via-sky-300 to-sky-500 text-white h-8 sm:h-auto sm:py-3 px-3 sm:px-8 text-center font-semibold overflow-hidden text-xs sm:text-base">
        <div className="max-w-6xl mx-auto h-8 sm:h-auto flex items-center justify-center whitespace-nowrap overflow-hidden text-ellipsis sm:whitespace-normal sm:overflow-visible sm:text-clip">
          Sign in to view account pricing and reorder faster.
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

  return (
    <Shell>
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-wide mb-2" style={{ color: 'var(--brand-2)' }}>Sign in</p>
        <h1 className="text-3xl sm:text-4xl font-black" style={{ color: 'var(--text)' }}>Welcome back</h1>
        <p className="mt-2" style={{ color: 'var(--muted)' }}>Sign in with your email and password.</p>
      </div>

      {userEmail ? (
        <div className="rounded-3xl p-6" style={{ background: 'rgba(255,255,255,0.78)', border: '1px solid var(--divider)', boxShadow: 'var(--shadow-md)' }}>
          <div className="text-sm" style={{ color: 'var(--muted)' }}>Signed in as</div>
          <div className="font-black mb-4" style={{ color: 'var(--text)' }}>{userEmail}</div>
          <div className="flex gap-2">
            <a href="/profile" className="px-4 py-2 rounded-lg font-bold transition" style={{ background: 'var(--brand)', color: 'white' }}>Go to profile</a>
            <button onClick={logout} className="px-4 py-2 rounded-lg border font-bold" style={{ borderColor: 'var(--divider)' }}>Sign out</button>
          </div>
        </div>
      ) : (
        <form onSubmit={signIn} className="rounded-3xl p-6" style={{ background: 'rgba(255,255,255,0.78)', border: '1px solid var(--divider)', boxShadow: 'var(--shadow-md)' }}>
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

          <button className="w-full font-black py-3 rounded-lg transition" style={{ background: 'var(--brand)', color: 'white', boxShadow: 'var(--shadow-sm)' }}>
            Sign in
          </button>
          {error && <div className="text-sm mt-3" style={{ color: '#b91c1c' }}>{error}</div>}

          <div className="text-sm mt-4" style={{ color: 'var(--muted)' }}>
            No account? <a className="font-bold underline" href="/signup">Create one</a>
          </div>
        </form>
      )}

      <div className="text-xs mt-6" style={{ color: 'var(--muted)' }}>
        Admin access is granted automatically for gardenablaze@gmail.com.
      </div>
    </Shell>
  );
}
