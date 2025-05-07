'use client';

import { useEffect, useState, ReactNode } from 'react';

interface ClientOnlyProps {
  children: ReactNode;
  placeholder?: ReactNode;
}

/**
 * Component that only renders its children on the client side
 * This prevents hydration errors by ensuring consistent server/client rendering
 * 
 * Implementation based on Josh W. Comeau's solution for React 18
 * @see https://www.joshwcomeau.com/react/the-perils-of-rehydration/
 */
export default function ClientOnly({ 
  children, 
  placeholder = <div></div> 
}: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false);
  
  // Set mounted flag after hydration is complete
  useEffect(() => {
    setHasMounted(true);
  }, []);
  
  // During SSR and initial hydration, render the placeholder
  if (!hasMounted) {
    return <>{placeholder}</>;
  }
  
  // After client-side hydration is complete, render the children
  return <>{children}</>;
} 