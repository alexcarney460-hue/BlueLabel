import Header from '@/app/Header';

export default function TermsPage() {
  return (
    <div className="min-h-screen font-sans" style={{ background: 'var(--bg)' }}>
      {/* Announcement Banner */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-sky-500 via-sky-300 to-sky-500 text-white h-8 sm:h-auto sm:py-3 px-3 sm:px-8 text-center font-semibold overflow-hidden text-xs sm:text-base">
        <div className="max-w-6xl mx-auto h-8 sm:h-auto flex items-center justify-center whitespace-nowrap overflow-hidden text-ellipsis sm:whitespace-normal sm:overflow-visible sm:text-clip">
          Terms & Conditions — please read carefully.
        </div>
      </div>

      {/* Header */}
      <div className="sticky top-8 sm:top-12 z-50">
        <Header />
      </div>

      <section className="pt-20 sm:pt-28 pb-16 px-4 sm:px-8" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 55%, #eef6ff 100%)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="rounded-3xl p-6 sm:p-8" style={{ background: 'rgba(255,255,255,0.82)', border: '1px solid var(--divider)', boxShadow: 'var(--shadow-md)' }}>
            <h1 className="text-3xl sm:text-4xl font-black" style={{ color: 'var(--text)' }}>Terms & Conditions</h1>
            <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>
              Last updated: {new Date().toISOString().slice(0, 10)}
            </p>

            <div className="prose prose-slate max-w-none mt-6">
              <h2>Agreement to Terms</h2>
              <p>
                These Terms &amp; Conditions ("Terms") govern your access to and use of the Blue Label Wholesale website
                located at <a href="https://bluelabelwholesale.com">bluelabelwholesale.com</a> (the "Site") and any
                related services (collectively, the "Services"). By accessing or using the Services, you agree to be
                bound by these Terms.
              </p>
              <p>
                If you do not agree to these Terms, you must not use the Services.
              </p>

              <h2>Who We Are / Contact</h2>
              <p>
                Blue Label Wholesale ("Company," "we," "us," "our") provides retail and account-based wholesale ordering
                for 7OH (7-OH) tablet products.
              </p>
              <p>
                Contact: <a href="mailto:info@bluelabelwholesale.com">info@bluelabelwholesale.com</a>
              </p>

              <h2>Eligibility (Age Requirement)</h2>
              <p>
                You must be at least 21 years old to access or use the Services. By using the Services, you represent
                that you are 21+.
              </p>

              <h2>Account Registration &amp; Wholesale Access</h2>
              <ul>
                <li>
                  Some features (including wholesale pricing) require registration and sign-in.
                </li>
                <li>
                  You agree to provide accurate, current information and to keep your account credentials confidential.
                </li>
                <li>
                  We may approve, deny, suspend, or terminate accounts at our discretion, including for suspected fraud,
                  misuse, or non-compliance.
                </li>
              </ul>

              <h2>Products &amp; Information</h2>
              <p>
                We make reasonable efforts to display product information accurately. However, product descriptions,
                images, packaging, pricing, and availability may change without notice.
              </p>

              <h2>Ordering, Pricing, and Payment</h2>
              <ul>
                <li>
                  Prices may differ based on account type (Retailer, Distributor, etc.) and may change at any time.
                </li>
                <li>
                  Wholesale accounts may have minimum order totals. If a minimum applies, the checkout will display it
                  and may prevent order submission until the threshold is met.
                </li>
                <li>
                  Submitted orders may be subject to review and confirmation.
                </li>
              </ul>

              <h2>Subscribe &amp; Save</h2>
              <p>
                If you enable Subscribe &amp; Save, an instant discount may be applied to displayed pricing and/or the cart.
                Subscribe &amp; Save terms, eligibility, and discount percentages may change. We may contact you to confirm
                subscription details.
              </p>

              <h2>Shipping, Delivery, and Risk of Loss</h2>
              <p>
                Shipping timelines are estimates and not guarantees. Risk of loss transfers as permitted by applicable
                law once the order is handed off to the carrier.
              </p>

              <h2>Returns, Refunds, and Chargebacks</h2>
              <p>
                All sales are final unless otherwise required by applicable law or explicitly agreed in writing by the
                Company. If there is an issue with an order (damage, wrong item, etc.), contact us promptly at{' '}
                <a href="mailto:info@bluelabelwholesale.com">info@bluelabelwholesale.com</a>.
              </p>
              <p>
                Unauthorized chargebacks or payment disputes may result in account suspension and additional recovery
                actions.
              </p>

              <h2>Prohibited Activities</h2>
              <p>You agree not to:</p>
              <ul>
                <li>Use the Services in violation of any law or regulation.</li>
                <li>Attempt to interfere with or compromise the security or performance of the Services.</li>
                <li>Use automated scraping, bots, or similar methods to access the Services without our permission.</li>
                <li>Misrepresent your identity, account type, or purchase intent.</li>
              </ul>

              <h2>Intellectual Property</h2>
              <p>
                The Services and all content (including text, graphics, logos, and software) are owned by or licensed to
                the Company and are protected by intellectual property laws. You may not copy, reproduce, or exploit any
                part of the Services without prior written permission.
              </p>

              <h2>Disclaimer</h2>
              <p>
                THE SERVICES AND PRODUCTS ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, WHETHER
                EXPRESS OR IMPLIED, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
                NON-INFRINGEMENT, TO THE MAXIMUM EXTENT PERMITTED BY LAW.
              </p>

              <h2>Limitation of Liability</h2>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT WILL THE COMPANY BE LIABLE FOR INDIRECT, INCIDENTAL,
                SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR FOR ANY LOSS OF PROFITS OR REVENUE.
              </p>

              <h2>Indemnification</h2>
              <p>
                You agree to indemnify and hold harmless the Company from any claims, liabilities, damages, losses, and
                expenses arising out of your use of the Services, your violation of these Terms, or your violation of any
                law or rights of a third party.
              </p>

              <h2>Privacy</h2>
              <p>
                Your use of the Services is also subject to our Privacy Policy (if posted). If we do not have a separate
                Privacy Policy posted, we still handle data according to applicable law and our internal practices.
              </p>

              <h2>Changes to These Terms</h2>
              <p>
                We may update these Terms from time to time. The updated version will be posted on this page with a new
                “Last updated” date. Your continued use of the Services after changes become effective constitutes your
                acceptance of the updated Terms.
              </p>

              <h2>Governing Law</h2>
              <p>
                These Terms are governed by the laws applicable to the Company’s operations, without regard to conflict
                of law rules.
              </p>

              <h2>Contact Us</h2>
              <p>
                Questions about these Terms? Email{' '}
                <a href="mailto:info@bluelabelwholesale.com">info@bluelabelwholesale.com</a>.
              </p>

              <hr />
              <p className="text-xs" style={{ color: 'var(--muted)' }}>
                Note: This page is provided for general informational purposes and does not constitute legal advice.
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
