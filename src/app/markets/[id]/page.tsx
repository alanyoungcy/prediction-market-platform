'use client';

import React, { useState } from 'react';
import Header from '../../components/Header';
import { ArrowLeft, Clock, DollarSign, Info } from 'lucide-react';
import Link from 'next/link';
import { useWalletData } from '../../hooks/useWalletData';

const MOCK_MARKET = {
  id: '1',
  title: 'Will Bitcoin exceed $100,000 by end of 2023?',
  description: 'This market will resolve to YES if the price of Bitcoin exceeds $100,000 USD on any major exchange before the end of 2023. It will resolve to NO otherwise.',
  category: 'Cryptocurrency',
  endDate: '2023-12-31',
  volume: 25000,
  yesPrice: 0.65,
  noPrice: 0.35,
  liquidity: 50000,
  creator: '0:1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  resolved: false,
  outcome: null
};

export default function MarketDetailPage({ params }: { params: { id: string } }) {
  const { isConnected } = useWalletData();
  const [market] = useState(MOCK_MARKET);
  const [outcome, setOutcome] = useState<'yes' | 'no'>('yes');
  const [amount, setAmount] = useState('');
  
  const handleBuy = () => {
    if (!amount) return;
    alert(`Buying ${amount} ${outcome.toUpperCase()} shares`);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Link href="/markets" className="inline-flex items-center text-blue-600 mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Markets
        </Link>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold">{market.title}</h1>
            <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
              {market.category}
            </span>
          </div>
          
          <p className="text-gray-700 mb-4">{market.description}</p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Market Details</h2>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-500 mr-2" />
                  <span>End Date: {new Date(market.endDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-gray-500 mr-2" />
                  <span>Volume: {market.volume.toLocaleString()} TON</span>
                </div>
                <div className="flex items-center">
                  <Info className="h-5 w-5 text-gray-500 mr-2" />
                  <span>Liquidity: {market.liquidity.toLocaleString()} TON</span>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-2">Current Prices</h2>
              <div className="flex space-x-4">
                <div className="bg-green-50 p-4 rounded-lg flex-1">
                  <p className="text-sm text-gray-500 mb-1">YES</p>
                  <p className="text-2xl font-bold text-green-600">{market.yesPrice.toFixed(2)}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg flex-1">
                  <p className="text-sm text-gray-500 mb-1">NO</p>
                  <p className="text-2xl font-bold text-red-600">{market.noPrice.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
          
          {market.resolved ? (
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h2 className="text-lg font-semibold mb-2">Market Resolved</h2>
              <p>
                This market has been resolved to{' '}
                <span className={market.outcome ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                  {market.outcome ? 'YES' : 'NO'}
                </span>
              </p>
            </div>
          ) : (
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h2 className="text-lg font-semibold mb-4">Trade</h2>
              
              {!isConnected ? (
                <div className="text-center py-4">
                  <p className="mb-2">Connect your wallet to trade</p>
                </div>
              ) : (
                <>
                  <div className="flex space-x-4 mb-4">
                    <button
                      className={`flex-1 py-2 rounded-lg font-medium ${
                        outcome === 'yes' 
                          ? 'bg-green-600 text-white' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                      onClick={() => setOutcome('yes')}
                    >
                      YES
                    </button>
                    <button
                      className={`flex-1 py-2 rounded-lg font-medium ${
                        outcome === 'no' 
                          ? 'bg-red-600 text-white' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                      onClick={() => setOutcome('no')}
                    >
                      NO
                    </button>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount (TON)
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full p-2 border rounded-lg"
                      placeholder="0.0"
                      min="0"
                    />
                  </div>
                  
                  <button
                    onClick={handleBuy}
                    disabled={!amount}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Buy {outcome.toUpperCase()} Shares
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
