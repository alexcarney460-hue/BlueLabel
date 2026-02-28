'use client';

import { Suspense, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';
import { gaPageView, gaEvent } from './analytics';

function isMobileUA(ua: string) {
  return /Android|iPhone|iPad|iPod/i.test(ua);
}

async function getUserEmail() {
  try {
    const supabase = getSupabase();
    const { data } = await supabase.auth.getUser();
    return data.user?.email ?? null;
  } catch {
    return null;
  }
}

function getOrCreateVisitorId() {
  if (typeof window === 'undefined') return null;
  const key = 'bluelabel_visitor_id';
  let id = window.localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(key, id);
  }
  return id;
}

function getOrRefreshSessionId() {
  if (typeof window === 'undefined') return null;
  const key = 'bluelabel_session';
  const raw = window.sessionStorage.getItem(key);
  const now = Date.now();

  try {
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.id && parsed?.ts && now - parsed.ts < 30 * 60 * 1000) {
        // refresh rolling window
        window.sessionStorage.setItem(key, JSON.stringify({ id: parsed.id, ts: now }));
        return parsed.id;
      }
    }
  } catch {
    // ignore
  }

  const id = crypto.randomUUID();
  window.sessionStorage.setItem(key, JSON.stringify({ id, ts: now }));
  return id;
}

function getUtmParams() {
  if (typeof window === 'undefined') return {};
  const url = new URL(window.location.href);
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  const out: Record<string, string> = {};
  for (const k of keys) {
    const v = url.searchParams.get(k);
    if (v) out[k] = v;
  }
  return out;
}

export async function track(event_type: string, payload: any = {}) {
  const user_email = await getUserEmail();
  const body = {
    event_type,
    path: typeof window !== 'undefined' ? window.location.pathname : null,
    referrer: typeof document !== 'undefined' ? document.referrer : null,
    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
    product_id: payload.product_id ?? null,
    user_email,
    visitor_id: getOrCreateVisitorId(),
    session_id: getOrRefreshSessionId(),
    utm: getUtmParams(),
    meta: {
      mobile: typeof navigator !== 'undefined' ? isMobileUA(navigator.userAgent) : null,
      ...payload.meta,
    },
  };

  try {
    await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      keepalive: true,
    });
  } catch {
    // ignore
  }
}

function TrackPageViewInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const qs = searchParams?.toString();
    const url = pathname + (qs ? `?${qs}` : '');

    // Custom (Supabase) analytics
    track('pageview');

    // GA4 page_view
    gaPageView(url);
  }, [pathname, searchParams]);

  return null;
}

export default function TrackPageView() {
  return (
    <Suspense fallback={null}>
      <TrackPageViewInner />
    </Suspense>
  );
}

// Convenience wrapper if you want to track GA4 events from UI code.
export function trackGa(event: string, params: Record<string, any> = {}) {
  gaEvent(event, params);
}
