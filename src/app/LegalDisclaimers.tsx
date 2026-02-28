export function LegalDisclaimers({ variant = 'full' }: { variant?: 'full' | 'compact' }) {
  const items = [
    {
      label: 'FDA disclosure',
      text: 'Statements have not been evaluated by the Food and Drug Administration (FDA). Products are not intended to diagnose, treat, cure, or prevent any disease.',
    },
    {
      label: 'Not medical advice',
      text: 'Information provided is for general informational purposes only and is not medical advice.',
    },
    {
      label: '21+ only',
      text: 'Intended for individuals 21 years of age or older.',
    },
  ];

  return (
    <div
      className={variant === 'compact' ? 'rounded-2xl p-4 text-xs' : 'rounded-2xl p-5 text-xs sm:text-sm'}
      style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.18)' }}
    >
      <div className="font-black" style={{ color: 'var(--text)' }}>Product Disclaimer &amp; FDA Disclosure</div>
      <div className="mt-2 space-y-2" style={{ color: 'var(--muted)' }}>
        {items.map((i) => (
          <div key={i.label}>
            <span className="font-bold" style={{ color: 'var(--text)' }}>{i.label}:</span> {i.text}
          </div>
        ))}
      </div>
    </div>
  );
}
