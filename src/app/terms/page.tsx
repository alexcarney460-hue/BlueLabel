import { PolicyShell } from '@/app/PolicyShell';

export default function TermsPage() {
  return (
    <PolicyShell title="Terms & Conditions" subtitle="Terms & Conditions — please read carefully.">
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

      <h2>Who We Are / Contact</h2>
      <p>
        Blue Label Wholesale ("Company," "we," "us," "our") provides retail and account-based wholesale ordering for 7OH
        (7-OH) tablet products.
      </p>
      <p>
        Contact: <a href="mailto:info@bluelabelwholesale.com">info@bluelabelwholesale.com</a>
      </p>

      <h2>Eligibility (Age Requirement)</h2>
      <p>You must be at least 21 years old to access or use the Services. By using the Services, you represent that you are 21+.</p>

      <h2>Account Registration &amp; Wholesale Access</h2>
      <ul>
        <li>Some features (including wholesale pricing) require registration and sign-in.</li>
        <li>You agree to provide accurate, current information and keep credentials confidential.</li>
        <li>We may approve, deny, suspend, or terminate accounts for suspected fraud, misuse, or non-compliance.</li>
      </ul>

      <h2>Products &amp; Information</h2>
      <p>
        We make reasonable efforts to display product information accurately. Product descriptions, images, packaging,
        pricing, and availability may change without notice.
      </p>

      <h2>Ordering, Pricing, and Payment</h2>
      <ul>
        <li>Prices may differ by account type and may change at any time.</li>
        <li>Wholesale accounts may have minimum order totals (shown at checkout when applicable).</li>
        <li>Submitted orders may be subject to review and confirmation.</li>
      </ul>

      <h2>Subscribe &amp; Save</h2>
      <p>
        If enabled, an instant discount may be applied to displayed pricing and/or the cart. Subscribe &amp; Save terms,
        eligibility, and discount percentages may change, and we may contact you to confirm details.
      </p>

      <h2>Shipping, Delivery, and Risk of Loss</h2>
      <p>
        Shipping timelines are estimates and not guarantees. Risk of loss transfers as permitted by applicable law once
        an order is handed off to the carrier.
      </p>

      <h2>Returns, Refunds, and Chargebacks</h2>
      <p>
        All sales are final unless otherwise required by applicable law or explicitly agreed in writing by the Company.
        For order issues (damage, wrong item, etc.), contact us at{' '}
        <a href="mailto:info@bluelabelwholesale.com">info@bluelabelwholesale.com</a>.
      </p>
      <p>Unauthorized chargebacks may result in account suspension and additional recovery actions.</p>

      <h2>Prohibited Activities</h2>
      <ul>
        <li>Use the Services in violation of any law or regulation.</li>
        <li>Attempt to interfere with or compromise security/performance of the Services.</li>
        <li>Use automated scraping, bots, or similar access methods without permission.</li>
        <li>Misrepresent your identity, account type, or purchase intent.</li>
      </ul>

      <h2>Intellectual Property</h2>
      <p>
        The Services and content (text, graphics, logos, and software) are owned by or licensed to the Company.
        Unauthorized copying or exploitation is prohibited.
      </p>

      <h2>Disclaimer</h2>
      <p>
        THE SERVICES AND PRODUCTS ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, TO THE MAXIMUM
        EXTENT PERMITTED BY LAW.
      </p>

      <h2>Limitation of Liability</h2>
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE COMPANY WILL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL,
        CONSEQUENTIAL, OR PUNITIVE DAMAGES.
      </p>

      <h2>Indemnification</h2>
      <p>
        You agree to indemnify and hold harmless the Company from claims arising from your use of the Services or
        violation of these Terms.
      </p>

      <h2>Privacy</h2>
      <p>Your use of the Services is also subject to our Privacy Policy.</p>

      <h2>Changes to These Terms</h2>
      <p>We may update these Terms from time to time by posting updates on this page.</p>

      <h2>Governing Law</h2>
      <p>These Terms are governed by the laws applicable to the Company’s operations, without regard to conflict-of-law rules.</p>
    </PolicyShell>
  );
}
