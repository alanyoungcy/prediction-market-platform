'use client';

import React from 'react';
import { Geist, Geist_Mono } from "next/font/google";
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { MarketProvider } from './contexts/MarketContext';
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
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TonConnectUIProvider manifestUrl="/tonconnect-manifest.json">
          <MarketProvider>
            {children}
          </MarketProvider>
        </TonConnectUIProvider>
      </body>
    </html>
  );
}
