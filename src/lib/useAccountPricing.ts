'use client';

import { useEffect, useMemo, useState } from 'react';
import { getMyProfile, type AccountType } from '@/lib/account';
import { priceForAccount } from '@/lib/pricing';

export function useAccountPricing() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [accountType, setAccountType] = useState<AccountType>('retail');

  useEffect(() => {
    (async () => {
      try {
        const p = await getMyProfile();
        if (p) {
          setIsSignedIn(true);
          setAccountType((p.account_type as any) ?? 'retail');
        } else {
          setIsSignedIn(false);
          setAccountType('retail');
        }
      } catch {
        setIsSignedIn(false);
        setAccountType('retail');
      }
    })();
  }, []);

  const price = useMemo(() => {
    return (base: number) => (isSignedIn ? priceForAccount(base, accountType) : base);
  }, [isSignedIn, accountType]);

  return { isSignedIn, accountType, price };
}
