'use client';

import React, { useEffect, useState } from 'react';
import { Geist, Geist_Mono } from "next/font/google";
import { TonConnectUIProvider, THEME } from '@tonconnect/ui-react';
import { MarketProvider } from './contexts/MarketContext';
import ClientOnly from './components/ClientOnly';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // State to store the manifest URL
  const [manifestUrl, setManifestUrl] = useState("/tonconnect-manifest.json");
  
  // Use effect to set the correct manifest URL on the client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // For local development: use fully qualified URL to avoid CORS and path issues
      const port = window.location.port;
      setManifestUrl(`http://localhost:${port}/tonconnect-manifest.json`);
    }
  }, []);
  
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientOnly placeholder={<div className="ton-wallet-loading">Loading wallet connection...</div>}>
          <>
            {/* Debug flag is now set inside ClientOnly where it's safe */}
            <script
              dangerouslySetInnerHTML={{
                __html: `window.debugTON = true; console.log('TonConnect: Initializing in ${process.env.NODE_ENV === 'development' ? 'development' : 'production'} mode');`
              }}
            />
            
            <TonConnectUIProvider 
              manifestUrl={manifestUrl}
              uiPreferences={{ theme: THEME.LIGHT }}
            >
              <MarketProvider>
                {children}
              </MarketProvider>
            </TonConnectUIProvider>
          </>
        </ClientOnly>
      </body>
    </html>
  );
}
