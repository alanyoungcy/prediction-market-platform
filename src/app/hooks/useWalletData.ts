'use client';

import { useTonAddress, useTonWallet } from '@tonconnect/ui-react';

export function useWalletData() {
  const wallet = useTonWallet();
  const address = useTonAddress();
  const rawAddress = useTonAddress(false);
  
  return {
    wallet,
    address,
    rawAddress,
    isConnected: !!wallet
  };
}
