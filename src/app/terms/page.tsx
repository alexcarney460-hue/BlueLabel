import { PolicyShell } from '@/app/PolicyShell';

export default function TermsPage() {
  const fdaDisclosure = (
    <div
      className="rounded-2xl p-5 text-xs sm:text-sm"
      style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.18)', color: 'var(--text)' }}
    >
      <div className="font-black">Product Disclaimer &amp; FDA Disclosure</div>
      <ul className="mt-2 space-y-2" style={{ color: 'var(--muted)' }}>
        <li>
          <span className="font-bold" style={{ color: 'var(--text)' }}>Not medical advice:</span> Information on this site is for general
          informational purposes only and is not medical advice.
        </li>
        <li>
          <span className="font-bold" style={{ color: 'var(--text)' }}>Not for minors:</span> Intended for individuals 21+ only.
        </li>
        <li>
          <span className="font-bold" style={{ color: 'var(--text)' }}>FDA disclosure:</span> Statements on this site have not been evaluated
          by the Food and Drug Administration (FDA). Products are not intended to diagnose, treat, cure, or prevent any
          disease.
        </li>
        <li>
          <span className="font-bold" style={{ color: 'var(--text)' }}>Use responsibly:</span> Do not use products in violation of applicable
          laws or regulations. You are responsible for compliance with local requirements.
        </li>
      </ul>
    </div>
  );

  return (
    <PolicyShell
      title="Terms & Conditions"
      subtitle="Terms & Conditions — please read carefully."
      footerExtra={fdaDisclosure}
    >
      <p>
        These Terms &amp; Conditions ("Terms") govern your access to and use of the Blue Label Wholesale website located at{' '}
        <a href="https://bluelabelwholesale.com">bluelabelwholesale.com</a> (the "Site") and any related services
        (collectively, the "Services"). By accessing or using the Services, you agree to be bound by these Terms.
      </p>

      <div className="not-prose rounded-2xl p-4 mt-6" style={{ background: 'rgba(14,102,179,0.06)', border: '1px solid rgba(14,102,179,0.14)' }}>
        <div className="font-black" style={{ color: 'var(--text)' }}>Quick summary</div>
        <ul className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>
          <li>• 21+ only</li>
          <li>• Wholesale pricing is account-based (Retailer / Distributor)</li>
          <li>• All sales final (see Return Policy)</li>
          <li>• Subscribe &amp; Save may apply instant discounts</li>
        </ul>
      </div>

      <div className="not-prose rounded-2xl p-4 mt-6" style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid var(--divider)' }}>
        <div className="font-black" style={{ color: 'var(--text)' }}>Table of contents</div>
        <div className="mt-3 grid sm:grid-cols-2 gap-2 text-sm font-bold">
          <a href="#services" className="hover:underline" style={{ color: 'var(--brand)' }}>1. Our Services</a>
          <a href="#ip" className="hover:underline" style={{ color: 'var(--brand)' }}>2. Intellectual Property</a>
          <a href="#userreps" className="hover:underline" style={{ color: 'var(--brand)' }}>3. User Representations</a>
          <a href="#userreg" className="hover:underline" style={{ color: 'var(--brand)' }}>4. Registration</a>
          <a href="#products" className="hover:underline" style={{ color: 'var(--brand)' }}>5. Products</a>
          <a href="#purchases" className="hover:underline" style={{ color: 'var(--brand)' }}>6. Purchases & Payment</a>
          <a href="#returns" className="hover:underline" style={{ color: 'var(--brand)' }}>7. Returns</a>
          <a href="#prohibited" className="hover:underline" style={{ color: 'var(--brand)' }}>8. Prohibited Activities</a>
          <a href="#privacy" className="hover:underline" style={{ color: 'var(--brand)' }}>9. Privacy</a>
          <a href="#term" className="hover:underline" style={{ color: 'var(--brand)' }}>10. Term & Termination</a>
          <a href="#modifications" className="hover:underline" style={{ color: 'var(--brand)' }}>11. Modifications</a>
          <a href="#law" className="hover:underline" style={{ color: 'var(--brand)' }}>12. Governing Law</a>
          <a href="#disputes" className="hover:underline" style={{ color: 'var(--brand)' }}>13. Dispute Resolution</a>
          <a href="#disclaimer" className="hover:underline" style={{ color: 'var(--brand)' }}>14. Disclaimer</a>
          <a href="#liability" className="hover:underline" style={{ color: 'var(--brand)' }}>15. Limitation of Liability</a>
          <a href="#indemnification" className="hover:underline" style={{ color: 'var(--brand)' }}>16. Indemnification</a>
          <a href="#electronic" className="hover:underline" style={{ color: 'var(--brand)' }}>17. Electronic Communications</a>
          <a href="#misc" className="hover:underline" style={{ color: 'var(--brand)' }}>18. Miscellaneous</a>
          <a href="#contact" className="hover:underline" style={{ color: 'var(--brand)' }}>19. Contact</a>
        </div>
      </div>

      <h2 id="services">1. Our Services</h2>
      <p>
        The Services provide retail and account-based wholesale ordering for 7OH (7-OH) tablet products. The information
        on the Services is not intended for distribution to or use by any person or entity in any jurisdiction where
        such distribution or use would be contrary to law or regulation.
      </p>

      <h2 id="ip">2. Intellectual Property</h2>
      <p>
        We own or license the content, design, code, and materials on the Services, including trademarks and logos.
        Subject to these Terms, we grant you a limited, non-exclusive, non-transferable, revocable license to access the
        Services for your personal use and for evaluating wholesale purchases.
      </p>

      <h2 id="userreps">3. User Representations</h2>
      <ul>
        <li>You are 21+ and have legal capacity to agree to these Terms.</li>
        <li>You will provide accurate information and keep it updated.</li>
        <li>You will not use the Services for unlawful or unauthorized purposes.</li>
      </ul>

      <h2 id="userreg">4. Registration</h2>
      <p>
        Some features require registration and sign-in. You are responsible for maintaining the confidentiality of your
        credentials and for activity under your account.
      </p>

      <h2 id="products">5. Products</h2>
      <p>
        We attempt to display product information accurately. Product descriptions, images, packaging, and availability
        may change without notice.
      </p>

      <h2 id="purchases">6. Purchases &amp; Payment</h2>
      <ul>
        <li>Prices may differ by account type (Retailer / Distributor) and may change at any time.</li>
        <li>Wholesale accounts may have minimum order totals (shown at checkout when applicable).</li>
        <li>Submitted orders may be subject to review and confirmation before fulfillment.</li>
      </ul>

      <h2 id="returns">7. Returns</h2>
      <p>
        All sales are final unless otherwise required by applicable law or explicitly agreed in writing by the Company.
        See our <a href="/return-policy">Return Policy</a>.
      </p>

      <h2 id="prohibited">8. Prohibited Activities</h2>
      <ul>
        <li>Use the Services in violation of any law or regulation.</li>
        <li>Attempt to interfere with or compromise security/performance of the Services.</li>
        <li>Use automated scraping, bots, or similar access methods without permission.</li>
        <li>Misrepresent your identity, account type, or purchase intent.</li>
      </ul>

      <h2 id="privacy">9. Privacy</h2>
      <p>
        Your use of the Services is also subject to our <a href="/privacy-policy">Privacy Policy</a>.
      </p>

      <h2 id="term">10. Term &amp; Termination</h2>
      <p>
        We may suspend or terminate your access to the Services at any time for violations of these Terms, suspected
        fraud, or other misuse.
      </p>

      <h2 id="modifications">11. Modifications and Interruptions</h2>
      <p>
        We may change, suspend, or discontinue any part of the Services at any time. The Services may also be
        unavailable due to maintenance or technical issues.
      </p>

      <h2 id="law">12. Governing Law</h2>
      <p>
        These Terms are governed by the laws applicable to the Company’s operations, without regard to conflict-of-law
        rules.
      </p>

      <h2 id="disputes">13. Dispute Resolution</h2>
      <p>
        Before filing any formal dispute, you agree to contact us at{' '}
        <a href="mailto:info@bluelabelwholesale.com">info@bluelabelwholesale.com</a> and attempt to resolve the issue.
      </p>

      <h2 id="disclaimer">14. Disclaimer</h2>
      <p>
        THE SERVICES AND PRODUCTS ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, TO THE MAXIMUM
        EXTENT PERMITTED BY LAW.
      </p>

      <h2 id="liability">15. Limitation of Liability</h2>
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE COMPANY WILL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL,
        CONSEQUENTIAL, OR PUNITIVE DAMAGES.
      </p>

      <h2 id="indemnification">16. Indemnification</h2>
      <p>
        You agree to indemnify and hold harmless the Company from claims arising from your use of the Services or
        violation of these Terms.
      </p>

      <h2 id="electronic">17. Electronic Communications, Transactions, and Signatures</h2>
      <p>
        You consent to receive communications electronically and agree that electronic agreements, notices, and other
        communications satisfy any legal requirement that such communications be in writing.
      </p>

      <h2 id="misc">18. Miscellaneous</h2>
      <p>
        These Terms and any policies posted on the Services constitute the entire agreement between you and the Company.
        If any provision is deemed unenforceable, the remaining provisions remain in effect.
      </p>

      <h2 id="contact">19. Contact</h2>
      <p>
        Questions about these Terms? Email <a href="mailto:info@bluelabelwholesale.com">info@bluelabelwholesale.com</a>.
      </p>
    </PolicyShell>
  );
}
