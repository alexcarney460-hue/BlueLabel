import Header from '@/app/Header';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen font-sans" style={{ background: 'var(--bg)' }}>
      <div className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-sky-500 via-sky-300 to-sky-500 text-white h-8 sm:h-auto sm:py-3 px-3 sm:px-8 text-center font-semibold overflow-hidden text-xs sm:text-base">
        <div className="max-w-6xl mx-auto h-8 sm:h-auto flex items-center justify-center whitespace-nowrap overflow-hidden text-ellipsis sm:whitespace-normal sm:overflow-visible sm:text-clip">
          Privacy Policy — basic site logs only.
        </div>
      </div>

      <div className="sticky top-8 sm:top-12 z-50">
        <Header />
      </div>

      <section className="pt-20 sm:pt-28 pb-16 px-4 sm:px-8" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 55%, #eef6ff 100%)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="rounded-3xl p-6 sm:p-8" style={{ background: 'rgba(255,255,255,0.82)', border: '1px solid var(--divider)', boxShadow: 'var(--shadow-md)' }}>
            <h1 className="text-3xl sm:text-4xl font-black" style={{ color: 'var(--text)' }}>Privacy Policy</h1>
            <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>Last updated: {new Date().toISOString().slice(0, 10)}</p>

            <div className="prose prose-slate max-w-none mt-6">
              <p>
                This Privacy Policy explains how Blue Label Wholesale (“we”, “us”, “our”) collects, uses, and shares
                information when you visit or use our website at{' '}
                <a href="https://bluelabelwholesale.com">bluelabelwholesale.com</a> (the “Site”) and related services.
              </p>

              <h2>Information We Collect</h2>
              <h3>Information you provide</h3>
              <ul>
                <li>Account information (such as email, password, and account type) when you register.</li>
                <li>Order information (such as name, email, phone, shipping address, notes) when you submit an order.</li>
                <li>Messages you send us (for example, emails to customer support).</li>
              </ul>

              <h3>Automatic information (basic server logs)</h3>
              <p>
                Like most websites, we may collect basic log data automatically, such as IP address, device/browser
                information, and pages visited, for security, fraud prevention, and site operations.
              </p>
              <p>
                We do not intentionally use third-party advertising trackers (such as Meta Pixel) unless explicitly
                implemented and disclosed.
              </p>

              <h2>How We Use Information</h2>
              <ul>
                <li>To provide and operate the Services (accounts, pricing, and order processing).</li>
                <li>To communicate with you about orders, account access, or support requests.</li>
                <li>To maintain security, prevent fraud, and improve the Site.</li>
                <li>To comply with legal obligations.</li>
              </ul>

              <h2>How We Share Information</h2>
              <p>
                We may share information with service providers that help us operate the Site (for example, hosting,
                database/auth providers, and email). We may also disclose information if required by law or to protect our
                rights and users.
              </p>

              <h2>Data Retention</h2>
              <p>
                We retain information as needed to operate the Services, meet legal requirements, resolve disputes, and
                enforce our agreements.
              </p>

              <h2>Security</h2>
              <p>
                We implement reasonable safeguards designed to protect your information. However, no method of
                transmission or storage is 100% secure.
              </p>

              <h2>Your Choices</h2>
              <ul>
                <li>You may access or update account information through your profile (where available).</li>
                <li>You may request account deletion by emailing us, subject to legal and operational requirements.</li>
              </ul>

              <h2>Children</h2>
              <p>
                The Site is intended for individuals 21+. We do not knowingly collect personal information from children.
              </p>

              <h2>Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will post the updated policy on this page with a
                new “Last updated” date.
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
