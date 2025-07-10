import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../types';
import { ProductCard } from '../products/ProductCard';
import { Button } from '../ui/Button';

// Sample data - in real app, this would come from Supabase
const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Diamond Eternity Ring',
    description: 'Exquisite 18K white gold ring featuring perfectly matched diamonds in a classic eternity setting.',
    price: 2899,
    
    images: [
      'https://images.pexels.com/photos/1721932/pexels-photo-1721932.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1721933/pexels-photo-1721933.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    stock: 8,
    materials: ['18K White Gold', 'Diamond'],
    gemstones: ['Diamond'],
    sizes: ['5', '6', '7', '8', '9'],
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    is_featured: true,
    specifications: {
      'Metal Purity': '18K',
      'Diamond Quality': 'VS1',
      'Carat Weight': '2.0 ct'
    }
  },
  {
    id: '2',
    name: 'Sapphire Pendant Necklace',
    description: 'Stunning blue sapphire pendant set in 14K yellow gold with a delicate chain.',
    price: 1599,
    
    images: [
      'https://images.pexels.com/photos/1721930/pexels-photo-1721930.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    stock: 5,
    materials: ['14K Yellow Gold', 'Sapphire'],
    gemstones: ['Blue Sapphire'],
    sizes: ['16"', '18"', '20"'],
    created_at: '2024-01-14T10:00:00Z',
    updated_at: '2024-01-14T10:00:00Z',
    is_featured: true,
    specifications: {
      'Metal Purity': '14K',
      'Sapphire Quality': 'AAA',
      'Carat Weight': '1.5 ct'
    }
  },
  {
    id: '3',
    name: 'Pearl Drop Earrings',
    description: 'Elegant freshwater pearl earrings with 18K rose gold accents.',
    price: 899,
    
    images: [
      'https://images.pexels.com/photos/1721928/pexels-photo-1721928.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    stock: 12,
    materials: ['18K Rose Gold', 'Freshwater Pearl'],
    gemstones: ['Pearl'],
    sizes: ['One Size'],
    created_at: '2024-01-13T10:00:00Z',
    updated_at: '2024-01-13T10:00:00Z',
    is_featured: true,
    specifications: {
      'Metal Purity': '18K',
      'Pearl Type': 'Freshwater',
      'Pearl Size': '8mm'
    }
  },
  {
    id: '4',
    name: 'Tennis Bracelet',
    description: 'Classic diamond tennis bracelet featuring premium diamonds in 18K white gold.',
    price: 3299,
    
    images: [
      'https://images.pexels.com/photos/1721929/pexels-photo-1721929.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    stock: 3,
    materials: ['18K White Gold', 'Diamond'],
    gemstones: ['Diamond'],
    sizes: ['6.5"', '7"', '7.5"', '8"'],
    created_at: '2024-01-12T10:00:00Z',
    updated_at: '2024-01-12T10:00:00Z',
    is_featured: true,
    specifications: {
      'Metal Purity': '18K',
      'Diamond Quality': 'VS1',
      'Total Carat Weight': '5.0 ct'
    }
  }
];

export const FeaturedProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // In real app, fetch from Supabase
    setProducts(sampleProducts);
  }, []);

  return (
    <section id="products" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-cormorant font-bold text-black mb-4">
            Our Jewelry Collection
          </h2>
          <p className="text-lg text-gray-600 font-montserrat max-w-2xl mx-auto">
            Discover our beautiful pieces, carefully curated for their exceptional beauty and craftsmanship.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              <ProductCard
                product={product}
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <Button 
            variant="primary" 
            size="lg"
            onClick={() => navigate('/products')}
          >
            Shop Collection
          </Button>
        </motion.div>
      </div>
    </section>
  );
};