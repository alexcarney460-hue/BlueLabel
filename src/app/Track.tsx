'use client';

import { useEffect } from 'react';
import { getSupabase } from '@/lib/supabase';

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

export async function track(event_type: string, payload: any = {}) {
  const user_email = await getUserEmail();
  const body = {
    event_type,
    path: typeof window !== 'undefined' ? window.location.pathname : null,
    referrer: typeof document !== 'undefined' ? document.referrer : null,
    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
    product_id: payload.product_id ?? null,
    user_email,
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

export default function TrackPageView() {
  useEffect(() => {
    track('pageview');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
