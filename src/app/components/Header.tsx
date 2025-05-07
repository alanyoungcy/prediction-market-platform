'use client';

import React from 'react';
import { Home, TrendingUp, User } from 'lucide-react';
import Link from 'next/link';
import CustomTonConnectButton from './CustomTonConnectButton';

export default function Header() {
  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-md">
      <div className="flex items-center space-x-4">
        <Link href="/" className="flex items-center space-x-2">
          <TrendingUp className="h-6 w-6 text-blue-600" />
          <span className="text-xl font-bold">Prediction Markets</span>
        </Link>
        <nav className="hidden md:flex space-x-4">
          <Link href="/" className="flex items-center space-x-1">
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>
          <Link href="/markets" className="flex items-center space-x-1">
            <TrendingUp className="h-4 w-4" />
            <span>Markets</span>
          </Link>
          <Link href="/profile" className="flex items-center space-x-1">
            <User className="h-4 w-4" />
            <span>Profile</span>
          </Link>
        </nav>
      </div>
      <CustomTonConnectButton />
    </header>
  );
}
