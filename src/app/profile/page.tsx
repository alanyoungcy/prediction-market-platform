'use client';

import React, { useState } from 'react';
import Header from '../components/Header';
import { ArrowLeft, ExternalLink, Wallet } from 'lucide-react';
import Link from 'next/link';
import { useWalletData } from '../hooks/useWalletData';

const MOCK_POSITIONS = [
  {
    id: '1',
    marketId: '1',
    marketTitle: 'Will Bitcoin exceed $100,000 by end of 2023?',
    outcome: 'YES',
    shares: 100,
    purchasePrice: 0.60,
    currentPrice: 0.65,
    profit: 8.33,
  },
  {
    id: '2',
    marketId: '2',
    marketTitle: 'Will the Democrats win the 2024 US Presidential Election?',
    outcome: 'NO',
    shares: 200,
    purchasePrice: 0.55,
    currentPrice: 0.52,
    profit: -5.45,
  },
];

export default function ProfilePage() {
  const { isConnected, address, wallet } = useWalletData();
  const [positions] = useState(MOCK_POSITIONS);
  
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Link href="/" className="inline-flex items-center text-blue-600 mb-6">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h1 className="text-2xl font-bold mb-4">Connect Wallet to View Profile</h1>
            <p className="text-gray-600 mb-6">
              You need to connect your TON wallet to view your profile and positions.
            </p>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-blue-600 mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Home
        </Link>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h1 className="text-2xl font-bold mb-4">Profile</h1>
              
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <Wallet className="h-5 w-5 text-gray-500 mr-2" />
                  <h2 className="text-lg font-semibold">Wallet</h2>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Connected with:</p>
                  <p className="font-medium">{wallet?.device.appName}</p>
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-semibold mb-2">Address</h2>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-mono truncate">{address}</p>
                    <a 
                      href={`https://tonscan.org/address/${address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Your Positions</h2>
              
              {positions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">You don&apos;t have any positions yet.</p>
                  <Link 
                    href="/markets" 
                    className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                  >
                    Explore Markets
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {positions.map((position) => (
                    <Link 
                      key={position.id} 
                      href={`/markets/${position.marketId}`}
                      className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{position.marketTitle}</h3>
                        <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                          position.outcome === 'YES' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {position.outcome}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 mb-2">
                        {position.shares} shares
                      </div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-500">Purchase Price:</span>
                        <span>{position.purchasePrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-500">Current Price:</span>
                        <span>{position.currentPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Profit/Loss:</span>
                        <span className={position.profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {position.profit >= 0 ? '+' : ''}{position.profit.toFixed(2)}%
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
