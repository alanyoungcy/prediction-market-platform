'use client';

import { TonConnect, WalletInfoRemote } from '@tonconnect/sdk';
import { logTonConnectEvent } from './debug';

/**
 * Direct TON Connect SDK implementation
 * This provides lower-level access to wallet connection functionality
 * 
 * Using a safe pattern for client-side only initialization
 */

// Reference to store the TonConnect instance
let _tonConnectSDK: TonConnect | null = null;

// Safe initialization function for client-side only
export const getTonConnectSDK = () => {
  // Always return null during SSR
  if (typeof window === 'undefined') {
    return null;
  }
  
  // Initialize only once and only in the browser
  if (!_tonConnectSDK) {
    try {
      // Try both common manifest paths
      let actualManifestUrl;
      
      // First, determine which URL to use based on environment
      if (window.location.hostname === 'localhost') {
        // For local development: use fully qualified URL to avoid CORS and path issues
        const port = window.location.port;
        actualManifestUrl = `http://localhost:${port}/tonconnect-manifest.json`;
      } else {
        // For production: use the standard path that wallets expect
        actualManifestUrl = '/tonconnect-manifest.json';
      }
      
      console.log(`Initializing TonConnect with manifest URL: ${actualManifestUrl}`);
      
      _tonConnectSDK = new TonConnect({
        manifestUrl: actualManifestUrl
      });
      
      // Set up the status change listener
      _tonConnectSDK.onStatusChange((wallet) => {
        if (wallet) {
          logTonConnectEvent('SDK Connected', wallet);
        } else {
          logTonConnectEvent('SDK Disconnected');
        }
      });
    } catch (err) {
      console.error('Error initializing TonConnect SDK:', err);
      return null;
    }
  }
  
  return _tonConnectSDK;
};

// Function to connect to wallet using the direct SDK
export const connectWallet = async () => {
  try {
    const tonConnectSDK = getTonConnectSDK();
    if (!tonConnectSDK) {
      throw new Error('TonConnect SDK not available');
    }
    
    logTonConnectEvent('SDK Connect Attempt');
    
    // Get the list of available wallets
    const walletsList = await tonConnectSDK.getWallets();
    logTonConnectEvent('Available wallets', walletsList);
    
    if (walletsList.length === 0) {
      throw new Error('No wallets available');
    }
    
    // Generate connection URL for the first available wallet
    const universalLink = tonConnectSDK.connect({
      universalLink: (walletsList[0] as WalletInfoRemote).universalLink,
      bridgeUrl: (walletsList[0] as WalletInfoRemote).bridgeUrl
    });
    
    logTonConnectEvent('Connection link generated', universalLink);
    
    // Open the connection link
    window.open(universalLink, '_blank');
    return true;
  } catch (error) {
    logTonConnectEvent('SDK Connection Error', error);
    throw error;
  }
};

// Function to disconnect wallet
export const disconnectWallet = async () => {
  try {
    const tonConnectSDK = getTonConnectSDK();
    if (!tonConnectSDK) {
      throw new Error('TonConnect SDK not available');
    }
    
    await tonConnectSDK.disconnect();
    logTonConnectEvent('SDK Disconnected by user');
    return true;
  } catch (error) {
    logTonConnectEvent('SDK Disconnection Error', error);
    throw error;
  }
};

// Get current wallet details
export const getWalletInfo = () => {
  const tonConnectSDK = getTonConnectSDK();
  if (!tonConnectSDK) {
    return {
      isConnected: false,
      wallet: null,
      address: null,
      chain: null
    };
  }
  
  const wallet = tonConnectSDK.wallet;
  return {
    isConnected: !!wallet,
    wallet,
    address: wallet?.account.address,
    chain: wallet?.account.chain
  };
}; 