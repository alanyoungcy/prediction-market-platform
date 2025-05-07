'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import { ArrowLeft, Calendar, Info } from 'lucide-react';
import Link from 'next/link';
import { useWalletData } from '../../hooks/useWalletData';
import { useMarkets } from '../../contexts/MarketContext';
import { createMarketTransaction } from '../../utils/ton';

const CATEGORIES = [
  'Cryptocurrency',
  'Politics',
  'Sports',
  'Entertainment',
  'Technology',
  'Science',
  'Finance',
  'Other'
];

export default function CreateMarketPage() {
  const router = useRouter();
  const { isConnected, address } = useWalletData();
  const { addMarket } = useMarkets();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    endDate: '',
    initialLiquidity: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected || !address) {
      alert('Please connect your wallet first');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const transaction = createMarketTransaction(
        formData.title,
        formData.description,
        formData.category,
        new Date(formData.endDate).getTime(),
        formData.initialLiquidity
      );
      
      console.log('Transaction created:', transaction);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addMarket({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        endDate: formData.endDate,
        creator: address,
      });
      
      alert('Market created successfully!');
      
      router.push('/markets');
    } catch (error) {
      console.error('Error creating market:', error);
      alert('Failed to create market. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Link href="/markets" className="inline-flex items-center text-blue-600 mb-6">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Markets
          </Link>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h1 className="text-2xl font-bold mb-4">Connect Wallet to Create Market</h1>
            <p className="text-gray-600 mb-6">
              You need to connect your TON wallet to create a prediction market.
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
        <Link href="/markets" className="inline-flex items-center text-blue-600 mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Markets
        </Link>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6">Create a New Prediction Market</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Market Question
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                placeholder="E.g., Will Bitcoin exceed $100,000 by end of 2023?"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                rows={4}
                placeholder="Provide details about the market, including resolution criteria..."
                required
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                  required
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                  <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Initial Liquidity (TON)
              </label>
              <input
                type="number"
                name="initialLiquidity"
                value={formData.initialLiquidity}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                placeholder="0.0"
                min="0"
                step="0.1"
                required
              />
              <p className="text-sm text-gray-500 mt-1 flex items-center">
                <Info className="h-4 w-4 mr-1" />
                You need to provide initial liquidity to create a market.
              </p>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating Market...' : 'Create Market'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
