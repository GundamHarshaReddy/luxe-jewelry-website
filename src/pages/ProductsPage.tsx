import React from 'react';
import { ProductGrid } from '../components/products/ProductGrid';

// Sample products data - move this to a separate data file later
const sampleProducts = [
  {
    id: '1',
    name: 'Diamond Eternity Ring',
    description: 'Exquisite 18K white gold ring featuring perfectly matched diamonds in a classic eternity setting.',
    price: 2899,
    images: [
      'https://images.pexels.com/photos/1721932/pexels-photo-1721932.jpeg?auto=compress&cs=tinysrgb&w=800'
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
  },
  {
    id: '5',
    name: 'Emerald Cocktail Ring',
    description: 'Statement emerald ring with diamond accents in 18K yellow gold.',
    price: 4299,
    images: [
      'https://images.pexels.com/photos/1721931/pexels-photo-1721931.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    stock: 2,
    materials: ['18K Yellow Gold', 'Emerald', 'Diamond'],
    gemstones: ['Emerald', 'Diamond'],
    sizes: ['5', '6', '7', '8', '9'],
    created_at: '2024-01-11T10:00:00Z',
    updated_at: '2024-01-11T10:00:00Z',
    is_featured: false,
    specifications: {
      'Metal Purity': '18K',
      'Emerald Quality': 'AAA',
      'Carat Weight': '3.5 ct'
    }
  },
  {
    id: '6',
    name: 'Diamond Stud Earrings',
    description: 'Classic diamond stud earrings in 14K white gold settings.',
    price: 1299,
    images: [
      'https://images.pexels.com/photos/1721927/pexels-photo-1721927.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    stock: 15,
    materials: ['14K White Gold', 'Diamond'],
    gemstones: ['Diamond'],
    sizes: ['One Size'],
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-10T10:00:00Z',
    is_featured: false,
    specifications: {
      'Metal Purity': '14K',
      'Diamond Quality': 'VS2',
      'Total Carat Weight': '1.0 ct'
    }
  }
];

export const ProductsPage: React.FC = () => {
  return (
    <div className="pt-16">
      <ProductGrid products={sampleProducts as any} title="All Products" />
    </div>
  );
};
