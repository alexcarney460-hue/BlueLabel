import { PolicyShell } from '@/app/PolicyShell';

export default function ShippingPolicyPage() {
  return (
    <PolicyShell title="Shipping Policy" subtitle="Shipping Policy — typical processing times apply.">
      <div className="not-prose rounded-2xl p-4" style={{ background: 'rgba(14,102,179,0.06)', border: '1px solid rgba(14,102,179,0.14)' }}>
        <div className="font-black" style={{ color: 'var(--text)' }}>Typical processing</div>
        <div className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Most orders process in 1–2 business days.</div>
      </div>

      <h2>Processing Time</h2>
      <p>
        Orders are typically processed within 1–2 business days. Processing times may vary based on inventory, order
        volume, verification needs, holidays, and other operational factors.
      </p>

      <h2>Shipping Time</h2>
      <p>
        Transit times depend on the selected service and destination. Any delivery dates shown are estimates and are not
        guaranteed.
      </p>

      <h2>Address Accuracy</h2>
      <p>
        You are responsible for providing an accurate shipping address. If a package is returned due to an incorrect or
        incomplete address, reshipment may require additional fees.
      </p>

      <h2>Risk of Loss</h2>
      <p>Risk of loss transfers as permitted by applicable law once the order is handed off to the carrier.</p>

      <h2>Order Issues</h2>
      <p>
        If your package appears damaged or you believe an item is missing, contact us promptly at{' '}
        <a href="mailto:info@bluelabelwholesale.com">info@bluelabelwholesale.com</a> with your order details and photos
        (when applicable).
      </p>

      <h2>Wholesale Orders</h2>
      <p>
        Wholesale orders may require additional review/confirmation prior to fulfillment, including verification of
        account type and minimum order requirements.
      </p>
    </PolicyShell>
  );
}
