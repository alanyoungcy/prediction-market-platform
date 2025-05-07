'use client';

import React, { useState } from 'react';
import Header from '../components/Header';
import { ArrowLeft, Check, X } from 'lucide-react';
import Link from 'next/link';
import { useWalletData } from '../hooks/useWalletData';

const MOCK_MARKETS = [
  {
    id: '1',
    title: 'Will Bitcoin exceed $100,000 by end of 2023?',
    category: 'Cryptocurrency',
    endDate: '2023-12-31',
    volume: 25000,
    resolved: false,
  },
  {
    id: '2',
    title: 'Will the Democrats win the 2024 US Presidential Election?',
    category: 'Politics',
    endDate: '2024-11-05',
    volume: 120000,
    resolved: false,
  },
  {
    id: '3',
    title: 'Will Apple release a foldable iPhone in 2024?',
    category: 'Technology',
    endDate: '2024-12-31',
    volume: 75000,
    resolved: false,
  },
];

const ADMIN_ADDRESS = '0:1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';

export default function AdminPage() {
  const { address, isConnected } = useWalletData();
  const [markets] = useState(MOCK_MARKETS);
  
  const isAdmin = isConnected && address === ADMIN_ADDRESS;
  
  const handleResolve = (marketId: string, outcome: boolean) => {
    alert(`Resolving market ${marketId} to ${outcome ? 'YES' : 'NO'}`);
  };
  
  if (!isConnected || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Link href="/" className="inline-flex items-center text-blue-600 mb-6">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h1 className="text-2xl font-bold mb-4">Admin Access Required</h1>
            <p className="text-gray-600 mb-6">
              You need admin privileges to access this page.
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
        
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Markets Pending Resolution</h2>
          
          {markets.length === 0 ? (
            <p className="text-gray-500">No markets pending resolution.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Market
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      End Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Volume
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {markets.map((market) => (
                    <tr key={market.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {market.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{market.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(market.endDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {market.volume.toLocaleString()} TON
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleResolve(market.id, true)}
                            className="bg-green-100 text-green-800 px-3 py-1 rounded-full hover:bg-green-200 transition flex items-center"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            YES
                          </button>
                          <button
                            onClick={() => handleResolve(market.id, false)}
                            className="bg-red-100 text-red-800 px-3 py-1 rounded-full hover:bg-red-200 transition flex items-center"
                          >
                            <X className="h-4 w-4 mr-1" />
                            NO
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
