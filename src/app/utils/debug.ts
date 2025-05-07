'use client';

/**
 * Utility for debugging TON wallet connection issues
 * All functions must be safe to call during SSR
 */

// Safe console logging - only executed on client side
export const logTonConnectEvent = (event: string, data?: unknown) => {
  if (typeof window === 'undefined') return;
  console.log(`TON Connect [${event}]:`, data);
};

// Enhanced manifest check with detailed error reporting
export const checkManifestUrl = async (url: string) => {
  if (typeof window === 'undefined') return false;
  
  console.log(`Attempting to fetch manifest from: ${url}`);
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
    
    const response = await fetch(url, { 
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    
    clearTimeout(timeoutId);
    
    console.log(`Manifest fetch response status: ${response.status} ${response.statusText}`);
    console.log(`Response headers:`, Object.fromEntries([...response.headers.entries()]));
    
    if (!response.ok) {
      console.error(`Manifest URL error: ${response.status} ${response.statusText}`);
      
      // Try to read the error response
      try {
        const errorText = await response.text();
        console.error(`Error response body: ${errorText.substring(0, 500)}${errorText.length > 500 ? '...' : ''}`);
      } catch (readErr) {
        console.error(`Couldn't read error response: ${readErr}`);
      }
      
      return false;
    }
    
    const manifest = await response.json();
    console.log('Manifest loaded successfully:', manifest);
    return true;
  } catch (error: unknown) {
    console.error('Error fetching manifest:', error);
    
    // Provide more specific error info
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      console.error('Network error: The server may be unreachable or blocking cross-origin requests');
    } else if (
      typeof error === 'object' && 
      error !== null && 
      'name' in error && 
      error.name === 'AbortError'
    ) {
      console.error('Request timed out - server may be slow or unresponsive');
    } else if (error instanceof SyntaxError) {
      console.error('Invalid JSON response - the manifest file may be malformed');
    }
    
    return false;
  }
};

// Safe debugging function - only executed on client side
export const debugTonConnect = () => {
  // Skip during SSR
  if (typeof window === 'undefined') return;
  
  const manifestUrl = '/tonconnect-manifest.json';
  const absoluteUrl = new URL(manifestUrl, window.location.origin).toString();
  
  console.log('Checking TON Connect manifest at:', absoluteUrl);
  checkManifestUrl(absoluteUrl).then(success => {
    if (success) {
      console.log('✅ TON Connect manifest is accessible from root path');
    } else {
      console.error('❌ TON Connect manifest is NOT accessible from root path');
      
      // Also try the .well-known path
      const wellKnownUrl = new URL('/.well-known/tonconnect-manifest.json', window.location.origin).toString();
      console.log('Trying alternate path:', wellKnownUrl);
      checkManifestUrl(wellKnownUrl).then(wellKnownSuccess => {
        if (wellKnownSuccess) {
          console.log('✅ TON Connect manifest is accessible from .well-known path');
        } else {
          console.error('❌ TON Connect manifest is NOT accessible from either path');
          
          // Test if the wallet can directly access our manifest
          const ngrokUrl = "https://c86d-211-55-157-142.ngrok-free.app/tonconnect-manifest.json";
          console.log(`Testing direct access to ngrok URL: ${ngrokUrl}`);
          checkManifestUrl(ngrokUrl).then(ngrokSuccess => {
            console.log(`Direct ngrok manifest access: ${ngrokSuccess ? '✅ Success' : '❌ Failed'}`);
          });
        }
      });
    }
  });
  
  // Log browser information
  console.log('Browser:', navigator.userAgent);
  console.log('Protocol:', window.location.protocol);
  console.log('Origin:', window.location.origin);
  console.log('Port:', window.location.port);
  
  // Log Cross-Origin status
  const isSameOrigin = window.location.origin === 'http://localhost:3001';
  console.log(`Same origin check: ${isSameOrigin ? 'Yes' : 'No - CORS issues may occur'}`);
  
  // Check CORS settings
  console.log(`Testing CORS for manifest access...`);
  const testHeader = new Headers();
  testHeader.append('Origin', 'http://localhost:3001');
  
  fetch('/tonconnect-manifest.json', {
    method: 'GET',
    headers: testHeader
  })
  .then(response => {
    console.log('CORS test response:', response.status, response.statusText);
    console.log('CORS headers:', Object.fromEntries([...response.headers.entries()]));
  })
  .catch(error => {
    console.error('CORS test failed:', error);
  });
}; 