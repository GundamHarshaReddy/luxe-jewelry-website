import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Heart, Share2, Truck, Shield, RotateCcw } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { Button } from '../ui/Button';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [personalization, setPersonalization] = useState('');
  const [isZoomed, setIsZoomed] = useState(false);
  const { dispatch } = useCart();

  const handleAddToBag = () => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        product,
        quantity,
        size: selectedSize,
        personalization,
      },
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col lg:flex-row">
            {/* Product Images */}
            <div className="lg:w-1/2 p-6">
              <div className="relative">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <X size={20} />
                </button>

                {/* Main Image */}
                <div className="relative mb-4 overflow-hidden rounded-lg">
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className={`w-full h-96 object-cover cursor-zoom-in transition-transform duration-300 ${
                      isZoomed ? 'scale-150' : 'scale-100'
                    }`}
                    onClick={() => setIsZoomed(!isZoomed)}
                  />
                </div>

                {/* Thumbnail Images */}
                <div className="flex space-x-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                        selectedImage === index ? 'border-gold' : 'border-gray-200'
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
              </div>
            </div>

            {/* Product Details */}
            <div className="lg:w-1/2 p-6">
              <div className="mb-6">
                <h1 className="text-3xl font-cormorant font-bold text-black mb-2">
                  {product.name}
                </h1>
                <p className="text-2xl font-cormorant font-bold text-gold mb-4">
                  ${product.price.toFixed(2)}
                </p>
                <p className="text-gray-600 font-montserrat mb-6">
                  {product.description}
                </p>
              </div>

              {/* Materials and Specifications */}
              <div className="mb-6">
                <h3 className="text-lg font-cormorant font-semibold text-black mb-3">
                  Materials & Specifications
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-montserrat font-semibold text-gray-700 mb-2">
                      Materials
                    </h4>
                    <ul className="text-sm text-gray-600 font-montserrat">
                      {product.materials.map((material, index) => (
                        <li key={index}>• {material}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-montserrat font-semibold text-gray-700 mb-2">
                      Gemstones
                    </h4>
                    <ul className="text-sm text-gray-600 font-montserrat">
                      {product.gemstones.map((gemstone, index) => (
                        <li key={index}>• {gemstone}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Size Selection */}
              {product.sizes.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-cormorant font-semibold text-black mb-3">
                    Size
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border rounded-lg font-montserrat ${
                          selectedSize === size
                            ? 'border-gold bg-gold text-black'
                            : 'border-gray-300 text-gray-700 hover:border-gold'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Personalization */}
              <div className="mb-6">
                <h3 className="text-lg font-cormorant font-semibold text-black mb-3">
                  Personalization (Optional)
                </h3>
                <input
                  type="text"
                  placeholder="Enter custom engraving text"
                  value={personalization}
                  onChange={(e) => setPersonalization(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                />
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <h3 className="text-lg font-cormorant font-semibold text-black mb-3">
                  Quantity
                </h3>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 border border-gray-300 rounded-lg hover:border-gold transition-colors duration-300"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-lg font-montserrat font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 border border-gray-300 rounded-lg hover:border-gold transition-colors duration-300"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Add to Bag */}
              <div className="mb-6">
                <Button
                  variant="addToBag"
                  size="lg"
                  className="w-full mb-4"
                  onClick={handleAddToBag}
                  disabled={product.stock === 0}
                >
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Bag'}
                </Button>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Heart size={16} className="mr-2" />
                    Add to Wishlist
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Share2 size={16} className="mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Service Icons */}
              <div className="border-t border-gray-200 pt-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="flex flex-col items-center">
                    <Truck size={24} className="text-gold mb-2" />
                    <span className="text-sm font-montserrat text-gray-600">
                      Free Shipping
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Shield size={24} className="text-gold mb-2" />
                    <span className="text-sm font-montserrat text-gray-600">
                      Lifetime Warranty
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <RotateCcw size={24} className="text-gold mb-2" />
                    <span className="text-sm font-montserrat text-gray-600">
                      30-Day Returns
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};