'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Market = {
  id: string;
  title: string;
  description: string;
  category: string;
  endDate: string;
  volume: number;
  yesPrice: number;
  noPrice: number;
  liquidity: number;
  creator?: string;
  resolved?: boolean;
  outcome?: boolean | null;
};

const MOCK_MARKETS: Market[] = [
  {
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
  },
  {
    id: '2',
    title: 'Will the Democrats win the 2024 US Presidential Election?',
    description: 'This market will resolve to YES if the Democratic Party candidate wins the 2024 US Presidential Election. It will resolve to NO if any other candidate wins.',
    category: 'Politics',
    endDate: '2024-11-05',
    volume: 120000,
    yesPrice: 0.48,
    noPrice: 0.52,
    liquidity: 200000,
    creator: '0:1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    resolved: false,
    outcome: null
  },
  {
    id: '3',
    title: 'Will Apple release a foldable iPhone in 2024?',
    description: 'This market will resolve to YES if Apple officially announces and releases a foldable iPhone model in 2024. It will resolve to NO otherwise.',
    category: 'Technology',
    endDate: '2024-12-31',
    volume: 75000,
    yesPrice: 0.22,
    noPrice: 0.78,
    liquidity: 150000,
    creator: '0:1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    resolved: false,
    outcome: null
  },
];

export type Position = {
  id: string;
  marketId: string;
  marketTitle: string;
  outcome: 'YES' | 'NO';
  shares: number;
  purchasePrice: number;
  currentPrice: number;
  profit: number;
};

const MOCK_POSITIONS: Position[] = [
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

type MarketContextType = {
  markets: Market[];
  positions: Position[];
  getMarket: (id: string) => Market | undefined;
  addMarket: (market: Omit<Market, 'id' | 'volume' | 'yesPrice' | 'noPrice' | 'liquidity'>) => void;
  buyShares: (marketId: string, outcome: boolean, amount: number) => void;
  sellShares: (marketId: string, outcome: boolean, amount: number) => void;
  resolveMarket: (marketId: string, outcome: boolean) => void;
  getUserPositions: (address: string) => Position[];
  loading: boolean;
};

const MarketContext = createContext<MarketContextType | undefined>(undefined);

export function MarketProvider({ children }: { children: ReactNode }) {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setMarkets(MOCK_MARKETS);
    setPositions(MOCK_POSITIONS);
    setLoading(false);
  }, []);
  
  const getMarket = (id: string) => {
    return markets.find(market => market.id === id);
  };
  
  const addMarket = (market: Omit<Market, 'id' | 'volume' | 'yesPrice' | 'noPrice' | 'liquidity'>) => {
    const newMarket: Market = {
      ...market,
      id: (markets.length + 1).toString(),
      volume: 0,
      yesPrice: 0.5,
      noPrice: 0.5,
      liquidity: parseInt(market.creator?.substring(0, 8) || '50000', 16) % 100000 + 50000, // Random liquidity based on creator address
    };
    
    setMarkets([...markets, newMarket]);
  };
  
  const buyShares = (marketId: string, outcome: boolean, amount: number) => {
    
    setMarkets(prevMarkets => 
      prevMarkets.map(market => {
        if (market.id === marketId) {
          const newYesPrice = outcome 
            ? market.yesPrice + 0.01 
            : market.yesPrice - 0.01;
          
          const newNoPrice = outcome 
            ? market.noPrice - 0.01 
            : market.noPrice + 0.01;
          
          return {
            ...market,
            yesPrice: Math.max(0.01, Math.min(0.99, newYesPrice)),
            noPrice: Math.max(0.01, Math.min(0.99, newNoPrice)),
            volume: market.volume + amount
          };
        }
        return market;
      })
    );
    
    const market = markets.find(m => m.id === marketId);
    if (!market) return;
    
    const positionOutcome = outcome ? 'YES' : 'NO';
    const existingPosition = positions.find(p => 
      p.marketId === marketId && p.outcome === positionOutcome
    );
    
    if (existingPosition) {
      setPositions(prevPositions => 
        prevPositions.map(position => {
          if (position.id === existingPosition.id) {
            const totalShares = position.shares + amount;
            const totalCost = (position.shares * position.purchasePrice) + (amount * (outcome ? market.yesPrice : market.noPrice));
            const newPurchasePrice = totalCost / totalShares;
            
            return {
              ...position,
              shares: totalShares,
              purchasePrice: newPurchasePrice,
              currentPrice: outcome ? market.yesPrice : market.noPrice,
              profit: ((outcome ? market.yesPrice : market.noPrice) - newPurchasePrice) / newPurchasePrice * 100
            };
          }
          return position;
        })
      );
    } else {
      const newPosition: Position = {
        id: (positions.length + 1).toString(),
        marketId,
        marketTitle: market.title,
        outcome: positionOutcome,
        shares: amount,
        purchasePrice: outcome ? market.yesPrice : market.noPrice,
        currentPrice: outcome ? market.yesPrice : market.noPrice,
        profit: 0
      };
      
      setPositions([...positions, newPosition]);
    }
  };
  
  const sellShares = (marketId: string, outcome: boolean, amount: number) => {
    
    setMarkets(prevMarkets => 
      prevMarkets.map(market => {
        if (market.id === marketId) {
          const newYesPrice = outcome 
            ? market.yesPrice - 0.01 
            : market.yesPrice + 0.01;
          
          const newNoPrice = outcome 
            ? market.noPrice + 0.01 
            : market.noPrice - 0.01;
          
          return {
            ...market,
            yesPrice: Math.max(0.01, Math.min(0.99, newYesPrice)),
            noPrice: Math.max(0.01, Math.min(0.99, newNoPrice)),
            volume: market.volume + amount
          };
        }
        return market;
      })
    );
    
    const positionOutcome = outcome ? 'YES' : 'NO';
    const existingPosition = positions.find(p => 
      p.marketId === marketId && p.outcome === positionOutcome
    );
    
    if (existingPosition && existingPosition.shares >= amount) {
      if (existingPosition.shares === amount) {
        setPositions(prevPositions => 
          prevPositions.filter(position => position.id !== existingPosition.id)
        );
      } else {
        setPositions(prevPositions => 
          prevPositions.map(position => {
            if (position.id === existingPosition.id) {
              return {
                ...position,
                shares: position.shares - amount
              };
            }
            return position;
          })
        );
      }
    }
  };
  
  const resolveMarket = (marketId: string, outcome: boolean) => {
    setMarkets(prevMarkets => 
      prevMarkets.map(market => {
        if (market.id === marketId) {
          return {
            ...market,
            resolved: true,
            outcome
          };
        }
        return market;
      })
    );
  };
  
  const getUserPositions = (address: string) => {
    return positions;
  };
  
  return (
    <MarketContext.Provider value={{ 
      markets, 
      positions,
      getMarket, 
      addMarket, 
      buyShares, 
      sellShares, 
      resolveMarket,
      getUserPositions,
      loading 
    }}>
      {children}
    </MarketContext.Provider>
  );
}

export function useMarkets() {
  const context = useContext(MarketContext);
  if (context === undefined) {
    throw new Error('useMarkets must be used within a MarketProvider');
  }
  return context;
}
