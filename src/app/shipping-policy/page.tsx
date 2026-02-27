import Header from '@/app/Header';

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen font-sans" style={{ background: 'var(--bg)' }}>
      <div className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-sky-500 via-sky-300 to-sky-500 text-white h-8 sm:h-auto sm:py-3 px-3 sm:px-8 text-center font-semibold overflow-hidden text-xs sm:text-base">
        <div className="max-w-6xl mx-auto h-8 sm:h-auto flex items-center justify-center whitespace-nowrap overflow-hidden text-ellipsis sm:whitespace-normal sm:overflow-visible sm:text-clip">
          Shipping Policy — typical processing times apply.
        </div>
      </div>

      <div className="sticky top-8 sm:top-12 z-50">
        <Header />
      </div>

      <section className="pt-20 sm:pt-28 pb-16 px-4 sm:px-8" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 55%, #eef6ff 100%)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="rounded-3xl p-6 sm:p-8" style={{ background: 'rgba(255,255,255,0.82)', border: '1px solid var(--divider)', boxShadow: 'var(--shadow-md)' }}>
            <h1 className="text-3xl sm:text-4xl font-black" style={{ color: 'var(--text)' }}>Shipping Policy</h1>
            <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>Last updated: {new Date().toISOString().slice(0, 10)}</p>

            <div className="prose prose-slate max-w-none mt-6">
              <h2>Processing Time</h2>
              <p>
                Orders are typically processed within 1–2 business days. Processing times may vary based on inventory,
                order volume, verification needs, holidays, and other operational factors.
              </p>

              <h2>Shipping Time</h2>
              <p>
                Shipping transit times depend on the selected service and destination. Any delivery dates shown are
                estimates and are not guaranteed.
              </p>

              <h2>Address Accuracy</h2>
              <p>
                You are responsible for providing an accurate shipping address. If a package is returned due to an
                incorrect or incomplete address, reshipment may require additional fees.
              </p>

              <h2>Risk of Loss</h2>
              <p>
                Risk of loss transfers as permitted by applicable law once the order is handed off to the carrier.
              </p>

              <h2>Order Issues</h2>
              <p>
                If your package appears damaged or you believe an item is missing, contact us promptly at{' '}
                <a href="mailto:info@bluelabelwholesale.com">info@bluelabelwholesale.com</a> with your order details and
                photos (when applicable).
              </p>

              <h2>Wholesale Orders</h2>
              <p>
                Wholesale orders may require additional review/confirmation prior to fulfillment, including verification
                of account type and minimum order requirements.
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
