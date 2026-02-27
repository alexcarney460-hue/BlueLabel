import Header from '@/app/Header';

export function PolicyShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen font-sans" style={{ background: 'var(--bg)' }}>
      <div className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-sky-500 via-sky-300 to-sky-500 text-white h-8 sm:h-auto sm:py-3 px-3 sm:px-8 text-center font-semibold overflow-hidden text-xs sm:text-base">
        <div className="max-w-6xl mx-auto h-8 sm:h-auto flex items-center justify-center whitespace-nowrap overflow-hidden text-ellipsis sm:whitespace-normal sm:overflow-visible sm:text-clip">
          {subtitle}
        </div>
      </div>

      <div className="sticky top-8 sm:top-12 z-50">
        <Header />
      </div>

      <section
        className="pt-20 sm:pt-28 pb-16 px-4 sm:px-8"
        style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 55%, #eef6ff 100%)' }}
      >
        <div className="max-w-5xl mx-auto">
          <div
            className="rounded-3xl overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.82)', border: '1px solid var(--divider)', boxShadow: 'var(--shadow-md)' }}
          >
            <div className="p-6 sm:p-10" style={{ borderBottom: '1px solid var(--divider)' }}>
              <h1 className="text-3xl sm:text-5xl font-black" style={{ color: 'var(--text)' }}>
                {title}
              </h1>
              <div className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>
                Last updated: {new Date().toISOString().slice(0, 10)}
              </div>

              <div className="mt-6 grid sm:grid-cols-4 gap-3">
                <a
                  href="/terms"
                  className="rounded-2xl px-4 py-3 text-sm font-black text-center"
                  style={{ background: 'rgba(14,102,179,0.08)', border: '1px solid rgba(14,102,179,0.16)', color: 'var(--text)' }}
                >
                  Terms
                </a>
                <a
                  href="/privacy-policy"
                  className="rounded-2xl px-4 py-3 text-sm font-black text-center"
                  style={{ background: 'rgba(14,102,179,0.08)', border: '1px solid rgba(14,102,179,0.16)', color: 'var(--text)' }}
                >
                  Privacy
                </a>
                <a
                  href="/shipping-policy"
                  className="rounded-2xl px-4 py-3 text-sm font-black text-center"
                  style={{ background: 'rgba(14,102,179,0.08)', border: '1px solid rgba(14,102,179,0.16)', color: 'var(--text)' }}
                >
                  Shipping
                </a>
                <a
                  href="/return-policy"
                  className="rounded-2xl px-4 py-3 text-sm font-black text-center"
                  style={{ background: 'rgba(14,102,179,0.08)', border: '1px solid rgba(14,102,179,0.16)', color: 'var(--text)' }}
                >
                  Returns
                </a>
              </div>
            </div>

            <div className="p-6 sm:p-10">
              <div className="prose prose-slate max-w-none prose-headings:font-black prose-h2:text-2xl prose-h3:text-lg">
                {children}
              </div>

              <div
                className="mt-10 rounded-2xl p-4 text-center text-xs"
                style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid var(--divider)', color: 'var(--muted)' }}
              >
                Questions? Email{' '}
                <a className="font-bold underline" href="mailto:info@bluelabelwholesale.com">
                  info@bluelabelwholesale.com
                </a>
                <div className="mt-2">This page is provided for general informational purposes and does not constitute legal advice.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer
        className="py-10 px-4 sm:px-8"
        style={{ background: 'var(--bg)', color: 'var(--muted)', borderTop: '1px solid var(--divider)' }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <div className="font-black" style={{ color: 'var(--text)' }}>
            Blue Label Wholesale
          </div>
          <div className="text-sm">© 2026 BlueLabel. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
