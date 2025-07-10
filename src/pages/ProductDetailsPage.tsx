import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { Button } from '../components/ui/Button';
import { useCart } from '../contexts/CartContext';

// Sample products data (same as in ProductsPage)
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

export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { dispatch } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    // Find product by ID
    const foundProduct = sampleProducts.find(p => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
      setSelectedSize(foundProduct.sizes[0] || '');
    }
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-cormorant font-bold text-gray-900 mb-4">Product Not Found</h2>
          <Button onClick={() => navigate('/products')}>
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        product,
        quantity: 1,
        size: selectedSize
      }
    });
  };

  const handleBuyNow = () => {
    // Add to cart first
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        product,
        quantity: 1,
        size: selectedSize
      }
    });
    // Then navigate to checkout or cart page
    // For now, we'll just show an alert since we don't have a checkout page
    alert('Redirecting to checkout...');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={product.images[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`aspect-square rounded-lg overflow-hidden ${
                        selectedImageIndex === index ? 'ring-2 ring-gold' : ''
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-cormorant font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>
                <p className="text-3xl font-bold text-gold mb-6">
                  ₹{product.price.toLocaleString()}
                </p>
                <p className="text-gray-600 font-montserrat leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Materials & Gemstones */}
              <div className="space-y-3">
                <div>
                  <span className="font-semibold text-gray-900">Materials: </span>
                  <span className="text-gray-600">{product.materials.join(', ')}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-900">Gemstones: </span>
                  <span className="text-gray-600">{product.gemstones.join(', ')}</span>
                </div>
              </div>

              {/* Size Selection */}
              {product.sizes.length > 1 && (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Size
                  </label>
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-gold focus:border-transparent"
                  >
                    {product.sizes.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Specifications */}
              {product.specifications && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Specifications</h3>
                  <div className="space-y-2">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-gray-600">{key}:</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-4 pt-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleAddToCart}
                    variant="outline"
                    size="lg"
                    className="flex-1 flex items-center justify-center border-gold text-gold hover:bg-gold hover:text-black"
                    disabled={product.stock === 0}
                  >
                    <ShoppingCart size={20} className="mr-2" />
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                  
                  <Button
                    onClick={handleBuyNow}
                    variant="primary"
                    size="lg"
                    className="flex-1 flex items-center justify-center"
                    disabled={product.stock === 0}
                  >
                    {product.stock === 0 ? 'Out of Stock' : 'Buy Now'}
                  </Button>
                </div>
                
                <div className="text-center">
                  <span className="text-sm text-gray-500">
                    {product.stock} in stock
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
