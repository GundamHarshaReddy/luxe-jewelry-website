import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ProductGrid } from '../components/products/ProductGrid';
import { useProducts } from '../hooks/useProducts';
import { Button } from '../components/ui/Button';
import type { Product } from '../types';

export const ProductsPage: React.FC = () => {
  const location = useLocation();
  const { products, loading, error, refreshProducts } = useProducts();
  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Handle search results from navigation state
  useEffect(() => {
    if (location.state?.searchResults && location.state?.searchQuery) {
      setDisplayProducts(location.state.searchResults);
      setSearchQuery(location.state.searchQuery);
    } else {
      setDisplayProducts(products);
      setSearchQuery('');
    }
  }, [location.state, products]);

  const title = searchQuery ? `Search Results for "${searchQuery}"` : 'All Products';

  if (loading) {
    return (
      <div className="pt-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-1/3 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto mb-12"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-300 aspect-square rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-3xl font-cormorant font-bold text-black mb-4">
              Oops! Something went wrong
            </h2>
            <p className="text-red-600 mb-6">{error}</p>
            <Button 
              variant="primary" 
              onClick={refreshProducts}
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      <ProductGrid products={displayProducts} title={title} />
    </div>
  );
};
