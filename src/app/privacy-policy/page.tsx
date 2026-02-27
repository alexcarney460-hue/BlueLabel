import { PolicyShell } from '@/app/PolicyShell';

export default function PrivacyPolicyPage() {
  return (
    <PolicyShell title="Privacy Policy" subtitle="Privacy Policy — basic site logs only.">
      <p>
        This Privacy Policy explains how Blue Label Wholesale (“we”, “us”, “our”) collects, uses, and shares information
        when you visit or use our website at <a href="https://bluelabelwholesale.com">bluelabelwholesale.com</a> (the
        “Site”) and related services.
      </p>

      <div className="not-prose rounded-2xl p-4 mt-6" style={{ background: 'rgba(14,102,179,0.06)', border: '1px solid rgba(14,102,179,0.14)' }}>
        <div className="font-black" style={{ color: 'var(--text)' }}>At a glance</div>
        <ul className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>
          <li>• We collect info you provide (account + order details).</li>
          <li>• We collect basic server logs for security and operations.</li>
          <li>• We don’t intentionally run ad trackers unless explicitly implemented and disclosed.</li>
        </ul>
      </div>

      <h2>Information We Collect</h2>
      <h3>Information you provide</h3>
      <ul>
        <li>Account information (email, password, account type) when you register.</li>
        <li>Order information (name, email, phone, shipping address, notes) when you submit an order.</li>
        <li>Messages you send us (for example, support emails).</li>
      </ul>

      <h3>Automatic information (basic server logs)</h3>
      <p>
        Like most websites, we may collect basic log data automatically, such as IP address, device/browser information,
        and pages visited, for security, fraud prevention, and site operations.
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
        We may share information with service providers that help us operate the Site (hosting, database/auth providers,
        and email). We may also disclose information if required by law or to protect our rights and users.
      </p>

      <h2>Data Retention</h2>
      <p>
        We retain information as needed to operate the Services, meet legal requirements, resolve disputes, and enforce
        our agreements.
      </p>

      <h2>Security</h2>
      <p>
        We implement reasonable safeguards designed to protect your information. However, no method of transmission or
        storage is 100% secure.
      </p>

      <h2>Your Choices</h2>
      <ul>
        <li>You may access or update account information through your profile (where available).</li>
        <li>You may request account deletion by emailing us, subject to legal and operational requirements.</li>
      </ul>

      <h2>Children</h2>
      <p>The Site is intended for individuals 21+. We do not knowingly collect personal information from children.</p>

      <h2>Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. We will post the updated policy on this page with a new
        “Last updated” date.
      </p>
    </PolicyShell>
  );
}
