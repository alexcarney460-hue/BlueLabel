'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'Mission Control', href: '/admin/mission-control' },
  { label: 'CRM', href: '/admin/crm' },
  { label: 'Analytics', href: '/admin/analytics' },
  { label: 'Accounting', href: '/admin/accounting' },
  { label: 'Marketing', href: '/admin/marketing' },
  { label: 'Settings', href: '/admin/settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Admin top nav */}
      <nav
        className="sticky top-0 z-50 border-b"
        style={{
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(12px)',
          borderColor: 'var(--divider)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center h-14 gap-6 overflow-x-auto">
          {/* Logo / home link */}
          <Link
            href="/admin"
            className="font-black text-lg whitespace-nowrap shrink-0"
            style={{ color: 'var(--brand)' }}
          >
            Blue Label Admin
          </Link>

          <div className="flex items-center gap-1 ml-4">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors"
                  style={{
                    background: active ? 'var(--brand)' : 'transparent',
                    color: active ? '#ffffff' : 'var(--muted)',
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Page content */}
      {children}
    </div>
  );
}
