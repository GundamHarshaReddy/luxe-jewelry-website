import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  title?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, title = 'Our Products' }) => {

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 product-grid-section">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-cormorant font-bold text-black mb-4">
          {title}
        </h2>
        <p className="text-lg text-gray-600 font-montserrat max-w-2xl mx-auto">
          Discover our exquisite collection of handcrafted jewelry, each piece telling a unique story of elegance and sophistication.
        </p>
      </div>

      {/* Product Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {products.map((product) => (
          <motion.div
            key={product.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <ProductCard
              product={product}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 font-montserrat text-lg">
            No products found.
          </p>
        </div>
      )}
    </div>
  );
};