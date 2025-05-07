import React from 'react';
import MarketDetailClient from './MarketDetailClient';

// Define proper interface that satisfies Next.js 15.3.x requirements
interface PageProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: Promise<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  searchParams?: Promise<any>;
}

// Interface for the resolved params
interface ResolvedParams {
  id: string;
}

// Instead of using the params directly with a specific type, we'll create
// a function that can work with the interface Next.js expects
export default async function MarketDetailPage(props: PageProps) {
  // Resolve the params promise
  const params = await props.params as ResolvedParams;
  // Extract the id and pass it to the client component
  
  return <MarketDetailClient id={params.id} />;
}
