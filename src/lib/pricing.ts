'use client';

import type { AccountType } from '@/lib/account';

export const DISCOUNTS: Record<AccountType, number> = {
  retail: 0,
  shop: 0.2,
  distributor: 0.3,
};

export function roundMoney(n: number) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function priceForAccount(base: number, accountType: AccountType) {
  const discount = DISCOUNTS[accountType] ?? 0;
  const final = base * (1 - discount);
  return roundMoney(final);
}

export function subscribeAndSavePrice(price: number, enabled: boolean, percent = 0.1) {
  if (!enabled) return roundMoney(price);
  return roundMoney(price * (1 - percent));
}
