'use client';

import type { AccountType } from '@/lib/account';

export const MIN_ORDER_TOTAL: Record<AccountType, number> = {
  retail: 0,
  shop: 2500,
  distributor: 5000,
};

export function minOrderFor(accountType: AccountType) {
  return MIN_ORDER_TOTAL[accountType] ?? 0;
}
