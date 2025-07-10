import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/products/${product.id}`);
  };

  return (
    <motion.div
      className="group relative bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
      onClick={handleViewDetails}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      {/* Product Image */}
      <div className="relative aspect-w-4 aspect-h-3 overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
          className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          <Heart
            size={20}
            className={`${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'} hover:text-red-500 transition-colors duration-300`}
          />
        </button>

        {/* Stock Badge */}
        {product.stock < 5 && product.stock > 0 && (
          <div className="absolute top-4 left-4 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-montserrat font-semibold">
            Only {product.stock} left
          </div>
        )}

        {/* Out of Stock Badge */}
        {product.stock === 0 && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-montserrat font-semibold">
            Out of Stock
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-cormorant font-semibold text-black group-hover:text-gold transition-colors duration-300">
            {product.name}
          </h3>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-gold text-gold" />
            <span className="text-sm font-montserrat text-gray-600">4.8</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 font-montserrat mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Materials */}
        <div className="flex flex-wrap gap-1 mb-4">
          {product.materials.slice(0, 2).map((material, index) => (
            <span
              key={index}
              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full font-montserrat"
            >
              {material}
            </span>
          ))}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <span className="text-xl font-cormorant font-bold text-black">
            ₹{product.price.toLocaleString()}
          </span>
          <span className="text-sm font-montserrat text-gray-500">
            Free Shipping
          </span>
        </div>
      </div>
    </motion.div>
  );
};