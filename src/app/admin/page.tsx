'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSupabase } from '@/lib/supabase';

const sections = [
  {
    label: 'Mission Control',
    href: '/admin/mission-control',
    description: 'Content drafts, AI agents, publishing pipeline',
  },
  {
    label: 'CRM',
    href: '/admin/crm',
    description: '12,372 companies, 4,319 contacts',
  },
  {
    label: 'Analytics',
    href: '/admin/analytics',
    description: 'Traffic, engagement, conversion metrics',
  },
  {
    label: 'Accounting',
    href: '/admin/accounting',
    description: 'Orders, revenue, refunds, reports',
  },
  {
    label: 'Marketing',
    href: '/admin/marketing',
    description: 'Content queue, social media publishing',
  },
  {
    label: 'Settings',
    href: '/admin/settings',
    description: 'Product management, admin config',
  },
];

export default function AdminLanding() {
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const supabase = getSupabase();
      const { data } = await supabase.auth.getUser();
      const email = data.user?.email ?? '';
      setAuthorized(email.toLowerCase() === 'gardenablaze@gmail.com');
    })();
  }, []);

  if (authorized === null) return <div className="p-8">Loading...</div>;
  if (!authorized) {
    return (
      <div className="p-8">
        <div className="max-w-md">
          <div className="font-black text-xl mb-2" style={{ color: 'var(--text)' }}>Not authorized.</div>
          <a
            href="/login"
            className="inline-block px-4 py-2 rounded-lg font-bold text-white"
            style={{ background: 'var(--brand)' }}
          >
            Sign in
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 55%, #eef6ff 100%)' }}>
      <section className="max-w-6xl mx-auto px-4 sm:px-8 pt-10 pb-16">
        {/* Mission Control banner */}
        <Link
          href="/admin/mission-control"
          className="block rounded-2xl p-8 mb-8 transition-transform hover:scale-[1.005]"
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0e66b3 100%)',
            boxShadow: '0 8px 32px rgba(14,102,179,0.18)',
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-sky-300 mb-1">
                Command Center
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-1">
                Mission Control
              </h2>
              <p className="text-sm text-slate-300">
                Content drafts, AI agents, publishing pipeline
              </p>
            </div>
            <div className="text-white/60 text-3xl font-black">&rarr;</div>
          </div>
        </Link>

        {/* Section cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.filter((s) => s.href !== '/admin/mission-control').map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group rounded-2xl p-6 transition-all hover:scale-[1.01]"
              style={{
                background: 'rgba(255,255,255,0.82)',
                border: '1px solid var(--divider)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              <h3
                className="text-lg font-black mb-1 group-hover:underline"
                style={{ color: 'var(--text)' }}
              >
                {section.label}
              </h3>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>
                {section.description}
              </p>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <footer
          className="mt-16 pt-8 text-center text-sm"
          style={{ borderTop: '1px solid var(--divider)', color: 'var(--muted)' }}
        >
          <div className="font-black" style={{ color: 'var(--text)' }}>Blue Label Wholesale</div>
          <div>&copy; 2026 BlueLabel. All rights reserved.</div>
        </footer>
      </section>
    </div>
  );
}
