declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export function gaEvent(name: string, params: Record<string, any> = {}) {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', name, params);
}

export function gaPageView(url: string) {
  if (typeof window === 'undefined') return;
  const gaId = process.env.NEXT_PUBLIC_GA4_ID;
  if (!gaId) return;
  if (typeof window.gtag !== 'function') return;
  window.gtag('config', gaId, { page_path: url });
}
