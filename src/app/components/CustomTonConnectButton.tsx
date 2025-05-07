'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { TonConnectButton, useTonConnectUI } from '@tonconnect/ui-react';
import { debugTonConnect, logTonConnectEvent, checkManifestUrl } from '../utils/debug';
import { connectWallet, disconnectWallet, getTonConnectSDK, getWalletInfo } from '../utils/tonConnector';
import ClientOnly from './ClientOnly';
import type { Wallet } from '@tonconnect/sdk';

function TonButtonContent() {
  const [tonConnectUI] = useTonConnectUI();
  const [error, setError] = useState<string | null>(null);
  const [isDebugVisible, setIsDebugVisible] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string>('Not connected');
  const [sdkWallet, setSDKWallet] = useState<Wallet | null>(null);

  // Run debugging on mount
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      debugTonConnect();
      setIsDebugVisible(true);
      
      // Additional check for manifest accessibility
      const checkManifest = async () => {
        const manifestUrl = '/tonconnect-manifest.json';
        const absoluteUrl = new URL(manifestUrl, window.location.origin).toString();
        const isManifestAccessible = await checkManifestUrl(absoluteUrl);
        setConnectionStatus(isManifestAccessible 
          ? 'Manifest accessible, waiting for connection...' 
          : 'Error: Manifest not accessible');
      };
      
      checkManifest();
      
      // Initialize wallet state from SDK
      const info = getWalletInfo();
      setSDKWallet(info.wallet);
    }
  }, []);

  // Listen for SDK connection changes
  useEffect(() => {
    const sdk = getTonConnectSDK();
    if (!sdk) return;
    
    const unsubscribe = sdk.onStatusChange((wallet) => {
      setSDKWallet(wallet);
      if (!wallet) {
        logTonConnectEvent('SDK Disconnected');
        setConnectionStatus('SDK: Disconnected');
      } else {
        logTonConnectEvent('SDK Connected', wallet);
        setConnectionStatus(`SDK: Connected to wallet with address ${wallet.account.address.slice(0, 8)}...`);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Add UI connection error listener
  useEffect(() => {
    const unsubscribe = tonConnectUI.onStatusChange((wallet) => {
      if (!wallet) {
        logTonConnectEvent('UI Disconnected');
      } else {
        logTonConnectEvent('UI Connected', wallet);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [tonConnectUI]);

  // Connect using direct SDK
  const handleSDKConnect = useCallback(async () => {
    try {
      setError(null);
      setConnectionStatus('SDK: Attempting connection...');
      await connectWallet();
    } catch (err) {
      logTonConnectEvent('SDK Connection Error', err);
      setError(err instanceof Error ? err.message : String(err));
      setConnectionStatus('SDK: Connection failed');
    }
  }, []);

  // Disconnect using direct SDK
  const handleSDKDisconnect = useCallback(async () => {
    try {
      setError(null);
      setConnectionStatus('SDK: Disconnecting...');
      await disconnectWallet();
    } catch (err) {
      logTonConnectEvent('SDK Disconnection Error', err);
      setError(err instanceof Error ? err.message : String(err));
    }
  }, []);

  // Alternative connection method using UI package
  const handleAlternativeConnect = useCallback(async () => {
    try {
      setError(null);
      setConnectionStatus('UI: Attempting alternative connection...');
      logTonConnectEvent('UI Alternative Connect Attempt');
      
      // Try opening the modal instead of direct connection
      await tonConnectUI.openModal();
      logTonConnectEvent('UI Connection modal opened');
    } catch (err) {
      logTonConnectEvent('UI Connection Error', err);
      setError(err instanceof Error ? err.message : String(err));
      setConnectionStatus('UI: Connection failed');
    }
  }, [tonConnectUI]);

  return (
    <div className="relative">
      <TonConnectButton />
      
      {isDebugVisible && (
        <div className="flex flex-col mt-2">
          <div className="text-xs bg-blue-100 text-blue-800 p-2 rounded mb-2">
            Status: {connectionStatus}
          </div>
          
          {getTonConnectSDK() !== null && (
            <div className="flex mt-2">
              {!sdkWallet ? (
                <button
                  onClick={handleSDKConnect}
                  className="text-xs bg-purple-500 text-white px-2 py-1 rounded mr-2"
                >
                  SDK Connect
                </button>
              ) : (
                <button
                  onClick={handleSDKDisconnect}
                  className="text-xs bg-red-500 text-white px-2 py-1 rounded mr-2"
                >
                  SDK Disconnect
                </button>
              )}
              
              <button
                onClick={handleAlternativeConnect}
                className="text-xs bg-green-500 text-white px-2 py-1 rounded"
              >
                UI Connect
              </button>
            </div>
          )}
        </div>
      )}
      
      {error && (
        <div className="absolute top-full mt-2 p-2 bg-red-100 text-red-700 text-xs rounded shadow-md z-50 max-w-xs break-words">
          {error}
        </div>
      )}
    </div>
  );
}

// Main component that ensures client-only rendering
export default function CustomTonConnectButton() {
  const placeholder = <div className="ton-button-placeholder">Loading TON Connect...</div>;
  
  return (
    <ClientOnly placeholder={placeholder}>
      <TonButtonContent />
    </ClientOnly>
  );
} 