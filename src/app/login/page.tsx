'use client';

import { useEffect, useState } from 'react';
import { getSupabase } from '@/lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
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

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSent(false);

    try {
      const supabase = getSupabase();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/profile` : undefined,
        },
      });
      if (error) throw error;
      setSent(true);
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

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-black mb-2">Sign in</h1>
        <p className="text-slate-600 mb-6">We’ll email you a secure magic link.</p>

        {userEmail ? (
          <div className="border rounded-2xl p-4">
            <div className="text-sm text-slate-600">Signed in as</div>
            <div className="font-bold mb-4">{userEmail}</div>
            <div className="flex gap-2">
              <a href="/profile" className="px-4 py-2 rounded-lg bg-slate-900 text-white font-bold">Go to profile</a>
              <button onClick={logout} className="px-4 py-2 rounded-lg border font-bold">Sign out</button>
            </div>
          </div>
        ) : (
          <form onSubmit={sendMagicLink} className="border rounded-2xl p-4">
            <label className="block text-sm font-bold mb-2">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              placeholder="you@company.com"
              className="w-full border rounded-lg px-3 py-2 mb-3"
            />
            <button className="w-full bg-amber-500 hover:bg-amber-600 text-black font-black py-3 rounded-lg">
              Email me a login link
            </button>
            {sent && <div className="text-sm text-green-700 mt-3">Check your email for the login link.</div>}
            {error && <div className="text-sm text-red-700 mt-3">{error}</div>}
          </form>
        )}

        <div className="text-xs text-slate-500 mt-6">
          Admin access is granted automatically for gardenablaze@gmail.com.
        </div>
      </div>
    </div>
  );
}
