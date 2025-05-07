'use client';

import React from 'react';
import Header from './components/Header';
import { TrendingUp, Clock, DollarSign } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <section className="text-center py-12">
          <h1 className="text-4xl font-bold mb-4">
            Predict the Future, Trade with Confidence
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create and trade on prediction markets for various events using cryptocurrency.
          </p>
          <Link 
            href="/markets" 
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            <TrendingUp className="mr-2 h-5 w-5" />
            Explore Markets
          </Link>
        </section>
        
        <section className="py-12">
          <h2 className="text-2xl font-bold mb-8 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="flex justify-center mb-4">
                <TrendingUp className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Markets</h3>
              <p className="text-gray-600">
                Create prediction markets for various events with binary outcomes.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="flex justify-center mb-4">
                <DollarSign className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Trade Outcomes</h3>
              <p className="text-gray-600">
                Buy and sell outcome tokens using cryptocurrency.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="flex justify-center mb-4">
                <Clock className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Resolve Markets</h3>
              <p className="text-gray-600">
                Markets are resolved based on real-world outcomes.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
