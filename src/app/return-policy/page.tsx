import Header from '@/app/Header';

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen font-sans" style={{ background: 'var(--bg)' }}>
      <div className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-sky-500 via-sky-300 to-sky-500 text-white h-8 sm:h-auto sm:py-3 px-3 sm:px-8 text-center font-semibold overflow-hidden text-xs sm:text-base">
        <div className="max-w-6xl mx-auto h-8 sm:h-auto flex items-center justify-center whitespace-nowrap overflow-hidden text-ellipsis sm:whitespace-normal sm:overflow-visible sm:text-clip">
          Return Policy — all sales final.
        </div>
      </div>

      <div className="sticky top-8 sm:top-12 z-50">
        <Header />
      </div>

      <section className="pt-20 sm:pt-28 pb-16 px-4 sm:px-8" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 55%, #eef6ff 100%)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="rounded-3xl p-6 sm:p-8" style={{ background: 'rgba(255,255,255,0.82)', border: '1px solid var(--divider)', boxShadow: 'var(--shadow-md)' }}>
            <h1 className="text-3xl sm:text-4xl font-black" style={{ color: 'var(--text)' }}>Return Policy</h1>
            <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>Last updated: {new Date().toISOString().slice(0, 10)}</p>

            <div className="prose prose-slate max-w-none mt-6">
              <p>
                Blue Label Wholesale (“we”, “us”, “our”) maintains a strict all-sales-final policy unless otherwise
                required by applicable law or explicitly agreed in writing by us.
              </p>

              <h2>All Sales Final</h2>
              <p>
                All orders are final once placed and/or fulfilled. We do not accept returns, exchanges, or refunds for
                change of mind, incorrect ordering, or buyer preference.
              </p>

              <h2>Damaged, Incorrect, or Missing Items</h2>
              <p>
                If your order arrives damaged, incorrect, or missing items, contact us as soon as possible so we can
                review and resolve the issue.
              </p>
              <ul>
                <li>
                  Email: <a href="mailto:info@bluelabelwholesale.com">info@bluelabelwholesale.com</a>
                </li>
                <li>
                  Include: order details, photos of the package and contents, and a brief description of the issue.
                </li>
              </ul>

              <h2>Refused Deliveries / Undeliverable Packages</h2>
              <p>
                If a package is refused, returned to sender, or undeliverable due to address issues, we may (at our
                discretion) offer reshipment options. Additional shipping/handling fees may apply.
              </p>

              <h2>Chargebacks</h2>
              <p>
                Unauthorized chargebacks or payment disputes may result in account suspension and may incur additional
                recovery actions.
              </p>

              <h2>Contact</h2>
              <p>
                Questions? Email <a href="mailto:info@bluelabelwholesale.com">info@bluelabelwholesale.com</a>.
              </p>

              <hr />
              <p className="text-xs" style={{ color: 'var(--muted)' }}>
                This page is provided for general informational purposes and does not constitute legal advice.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8 px-8 text-center" style={{ background: 'var(--bg)', color: 'var(--muted)', borderTop: '1px solid var(--divider)' }}>
        <p>© 2026 BlueLabel. All rights reserved.</p>
      </footer>
    </div>
  );
}
