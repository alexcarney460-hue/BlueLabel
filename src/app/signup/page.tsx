'use client';

import { useEffect, useState } from 'react';
import { getSupabase } from '@/lib/supabase';
import { upsertMyProfile } from '@/lib/account';

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

      window.location.href = '/profile';
    } catch {
      setError('Signup failed');
    }
  }

  if (userEmail) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-black mb-2">Create account</h1>
          <div className="border rounded-2xl p-4">
            <div className="text-sm text-slate-600">Already signed in as</div>
            <div className="font-bold mb-4">{userEmail}</div>
            <a href="/profile" className="inline-block px-4 py-2 rounded-lg font-bold" style={{ background: 'var(--brand)', color: 'white' }}>Go to profile</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-black mb-2">Create account</h1>
        <p className="text-slate-600 mb-6">Create an account to shop retail or unlock wholesale pricing.</p>

        <form onSubmit={signup} className="border rounded-2xl p-4">
          <label className="block text-sm font-bold mb-2">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            placeholder="you@company.com"
            className="w-full border rounded-lg px-3 py-2 mb-3"
          />

          <label className="block text-sm font-bold mb-2">Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            placeholder="••••••••"
            className="w-full border rounded-lg px-3 py-2 mb-4"
          />

          <label className="block text-sm font-bold mb-2">Account type</label>
          <select
            value={accountType}
            onChange={(e) => setAccountType(e.target.value as any)}
            className="w-full border rounded-lg px-3 py-2 mb-3"
          >
            <option value="retail">Retail customer</option>
            <option value="shop">Smoke shop / retailer (wholesale)</option>
            <option value="distributor">Distributor (wholesale)</option>
          </select>

          <label className="block text-sm font-bold mb-2">Company name (optional)</label>
          <input
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            type="text"
            placeholder="Your shop / company"
            className="w-full border rounded-lg px-3 py-2 mb-4"
          />

          <button className="w-full font-black py-3 rounded-lg" style={{ background: 'var(--brand)', color: 'white' }}>
            Create account
          </button>

          {error && <div className="text-sm text-red-700 mt-3">{error}</div>}

          <div className="text-sm text-slate-600 mt-4">
            Already have an account? <a className="font-bold underline" href="/login">Sign in</a>
          </div>
        </form>
      </div>
    </div>
  );
}
