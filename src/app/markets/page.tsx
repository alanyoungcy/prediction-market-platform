'use client';

import React, { useState } from 'react';
import Header from '../components/Header';
import { ArrowUpDown, Filter, Search } from 'lucide-react';
import Link from 'next/link';

const MOCK_MARKETS = [
  {
    id: '1',
    title: 'Will Bitcoin exceed $100,000 by end of 2023?',
    category: 'Cryptocurrency',
    endDate: '2023-12-31',
    volume: 25000,
    yesPrice: 0.65,
    noPrice: 0.35,
  },
  {
    id: '2',
    title: 'Will the Democrats win the 2024 US Presidential Election?',
    category: 'Politics',
    endDate: '2024-11-05',
    volume: 120000,
    yesPrice: 0.48,
    noPrice: 0.52,
  },
  {
    id: '3',
    title: 'Will Apple release a foldable iPhone in 2024?',
    category: 'Technology',
    endDate: '2024-12-31',
    volume: 75000,
    yesPrice: 0.22,
    noPrice: 0.78,
  },
];

export default function MarketsPage() {
  const [markets] = useState(MOCK_MARKETS);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Prediction Markets</h1>
          <Link 
            href="/markets/create" 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Create Market
          </Link>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search markets..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <button className="flex items-center space-x-1 px-4 py-2 border rounded-lg hover:bg-gray-50">
              <Filter className="h-5 w-5" />
              <span>Filter</span>
            </button>
            <button className="flex items-center space-x-1 px-4 py-2 border rounded-lg hover:bg-gray-50">
              <ArrowUpDown className="h-5 w-5" />
              <span>Sort</span>
            </button>
          </div>
        </div>
        
        <div className="grid gap-6">
          {markets.map((market) => (
            <Link 
              key={market.id} 
              href={`/markets/${market.id}`}
              className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-semibold">{market.title}</h2>
                <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                  {market.category}
                </span>
              </div>
              <div className="mb-4">
                <p className="text-gray-500">
                  End date: {new Date(market.endDate).toLocaleDateString()}
                </p>
                <p className="text-gray-500">
                  Volume: {market.volume.toLocaleString()} TON
                </p>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Current prices:</p>
                  <div className="flex space-x-4">
                    <div>
                      <span className="text-green-600 font-semibold">
                        Yes: {market.yesPrice.toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="text-red-600 font-semibold">
                        No: {market.noPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg transition">
                  View Details
                </button>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
