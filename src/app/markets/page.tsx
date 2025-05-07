'use client';

import React, { useState } from 'react';
import Header from '../components/Header';
import { Filter, Search } from 'lucide-react';
import Link from 'next/link';
import { useMarkets } from '../contexts/MarketContext';

export default function MarketsPage() {
  const { markets, loading } = useMarkets();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const filteredMarkets = markets.filter(market => 
    (searchTerm === '' || 
      market.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      market.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      market.category.toLowerCase().includes(searchTerm.toLowerCase())
    ) &&
    (selectedCategory === '' || market.category === selectedCategory)
  );
  
  const categories = [...new Set(markets.map(market => market.category))];
  
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <div className="relative">
              <select
                className="appearance-none px-4 py-2 pr-8 border rounded-lg bg-white"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <Filter className="absolute right-2 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading markets...</p>
          </div>
        ) : filteredMarkets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No markets found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredMarkets.map((market) => (
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
        )}
      </main>
    </div>
  );
}
