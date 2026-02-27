import { PolicyShell } from '@/app/PolicyShell';

export default function ReturnPolicyPage() {
  return (
    <PolicyShell title="Return Policy" subtitle="Return Policy — all sales final.">
      <div className="not-prose rounded-2xl p-4" style={{ background: 'rgba(245,158,11,0.10)', border: '1px solid rgba(245,158,11,0.22)' }}>
        <div className="font-black" style={{ color: 'var(--text)' }}>All sales final</div>
        <div className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
          We do not accept returns or exchanges for change of mind, incorrect ordering, or buyer preference.
        </div>
      </div>

      <h2>Damaged, Incorrect, or Missing Items</h2>
      <p>
        If your order arrives damaged, incorrect, or missing items, contact us as soon as possible so we can review and
        resolve the issue.
      </p>
      <ul>
        <li>Email: <a href="mailto:info@bluelabelwholesale.com">info@bluelabelwholesale.com</a></li>
        <li>Include: order details, photos of the package and contents, and a brief description of the issue.</li>
      </ul>

      <h2>Refused Deliveries / Undeliverable Packages</h2>
      <p>
        If a package is refused, returned to sender, or undeliverable due to address issues, we may (at our discretion)
        offer reshipment options. Additional shipping/handling fees may apply.
      </p>

      <h2>Chargebacks</h2>
      <p>
        Unauthorized chargebacks or payment disputes may result in account suspension and may incur additional recovery
        actions.
      </p>
    </PolicyShell>
  );
}
