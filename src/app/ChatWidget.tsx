'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type Msg = { role: 'user' | 'assistant'; text: string };

type FAQ = {
  patterns: RegExp[];
  answer: string;
};

function normalize(s: string) {
  return s.toLowerCase().trim();
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: 'assistant',
      text:
        "Ask me anything about ordering, wholesale accounts, Subscribe & Save, or product details. If I can't answer, I’ll point you to the right place.",
    },
  ]);

  const listRef = useRef<HTMLDivElement | null>(null);

  const faqs: FAQ[] = useMemo(
    () => [
      {
        patterns: [/wholesale/i, /retailer/i, /distributor/i, /account/i, /pricing/i],
        answer:
          'Wholesale pricing is account-based. Create an account (Retailer or Distributor) and sign in—your pricing will display automatically across the site.',
      },
      {
        patterns: [/subscribe/i, /autoship/i, /save/i, /10%/i],
        answer:
          'Subscribe & Save gives 10% off immediately when enabled (including for Retailer and Distributor accounts). The discounted price is stored in your cart.',
      },
      {
        patterns: [/shipping/i, /delivery/i, /fulfillment/i],
        answer:
          'After you submit an order, we confirm account pricing (if applicable) and follow up with an invoice / next steps. For shipping timelines, contact sales with your order details.',
      },
      {
        patterns: [/minimum/i, /min/i, /minimum order/i],
        answer:
          'Wholesale accounts have minimum order totals. If your account has a minimum, the checkout will show it and prevent submission until you’re above the threshold.',
      },
      {
        patterns: [/coa/i, /lab/i, /testing/i, /iso/i],
        answer:
          'We focus on consistent specs and clear documentation. If you need batch paperwork details, contact sales and include the product + quantity you’re looking for.',
      },
      {
        patterns: [/contact/i, /email/i, /sales/i, /support/i],
        answer:
          'You can reach sales at info@bluelabelwholesale.com. Include your account email (if you have one), desired products/flavors, and quantities for fastest turnaround.',
      },
    ],
    []
  );

  function getAnswer(q: string) {
    const t = normalize(q);
    if (!t) return "Tell me what you're trying to do (retail order, wholesale account, pricing, or Subscribe & Save).";

    for (const f of faqs) {
      if (f.patterns.some((p) => p.test(t))) return f.answer;
    }

    return (
      "I’m not sure on that one yet. Email info@bluelabelwholesale.com with your question and any order details (products + quantities), and we’ll get you sorted."
    );
  }

  function send() {
    const q = input.trim();
    if (!q) return;

    setMessages((m) => [...m, { role: 'user', text: q }, { role: 'assistant', text: getAnswer(q) }]);
    setInput('');
  }

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
    }, 50);
    return () => clearTimeout(t);
  }, [open, messages.length]);

  return (
    <div className="fixed bottom-4 right-4 z-[80]">
      {open && (
        <div
          className="w-[92vw] max-w-sm rounded-3xl overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.92)', border: '1px solid var(--divider)', boxShadow: 'var(--shadow-md)' }}
        >
          <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid var(--divider)' }}>
            <div>
              <div className="text-sm font-black" style={{ color: 'var(--text)' }}>Blue Label Help</div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>Instant answers · FAQ bot</div>
            </div>
            <button className="p-2" onClick={() => setOpen(false)} aria-label="Close chat">
              ✕
            </button>
          </div>

          <div ref={listRef} className="px-4 py-3 space-y-3 h-72 overflow-auto">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`text-sm rounded-2xl px-3 py-2 ${m.role === 'user' ? 'ml-8' : 'mr-8'}`}
                style={
                  m.role === 'user'
                    ? { background: 'rgba(14,102,179,0.10)', border: '1px solid rgba(14,102,179,0.18)', color: 'var(--text)' }
                    : { background: 'rgba(255,255,255,0.7)', border: '1px solid var(--divider)', color: 'var(--text)' }
                }
              >
                {m.text}
              </div>
            ))}
          </div>

          <div className="p-3" style={{ borderTop: '1px solid var(--divider)' }}>
            <div className="flex gap-2">
              <input
                className="flex-1 border rounded-xl px-3 py-2 text-sm bg-white"
                style={{ borderColor: 'var(--divider)' }}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question…"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') send();
                }}
              />
              <button
                className="px-4 rounded-xl font-black text-sm"
                style={{ background: 'var(--brand)', color: 'white' }}
                onClick={send}
              >
                Send
              </button>
            </div>
            <div className="text-[11px] mt-2" style={{ color: 'var(--muted)' }}>
              Not medical advice. For pricing/help: info@bluelabelwholesale.com
            </div>
          </div>
        </div>
      )}

      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="rounded-full px-4 py-3 font-black"
          style={{ background: 'linear-gradient(90deg, var(--brand-2), var(--brand))', color: 'white', boxShadow: 'var(--shadow-md)' }}
          aria-label="Open chat"
        >
          Chat
        </button>
      )}
    </div>
  );
}
