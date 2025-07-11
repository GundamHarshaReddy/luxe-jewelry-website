import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Star, Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useCart } from '../contexts/CartContext';
import { useProduct } from '../hooks/useProducts';
import { ReviewForm } from '../components/products/ReviewForm';

export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { product, loading, error } = useProduct(id || '');
  const { dispatch: cartDispatch } = useCart();
  
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Helper function to get avatar based on gender
  const getAvatarForGender = (gender: 'male' | 'female', name: string) => {
    // Get initials from name
    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    
    // Different colors for male/female
    const femaleColors = ['#FFB6C1', '#DDA0DD', '#F0E68C', '#98FB98', '#87CEEB'];
    const maleColors = ['#4682B4', '#32CD32', '#FF6347', '#DEB887', '#20B2AA'];
    
    const colors = gender === 'female' ? femaleColors : maleColors;
    const bgColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Create a simple data URL for the avatar
    const svg = `
      <svg width="48" height="48" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="24" fill="${bgColor}"/>
        <text x="24" y="30" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="16" font-weight="bold">${initials}</text>
      </svg>
    `;
    
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  // Get the currently selected variant
  const selectedVariant = product?.variants?.[selectedVariantIndex] || product?.variants?.[0];

  if (loading) {
    return (
      <div className="pt-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-300 rounded w-20 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="bg-gray-300 aspect-square rounded-lg"></div>
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-gray-300 aspect-square rounded"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                <div className="h-6 bg-gray-300 rounded w-1/4"></div>
                <div className="h-20 bg-gray-300 rounded"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pt-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-3xl font-cormorant font-bold text-black mb-4">
              Product Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              {error || "The product you're looking for doesn't exist."}
            </p>
            <Button 
              variant="primary" 
              onClick={() => navigate('/products')}
            >
              View All Products
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedVariant) {
      alert('Product variant not available');
      return;
    }

    if (product.sizes.length > 1 && !selectedSize) {
      alert('Please select a size');
      return;
    }

    cartDispatch({
      type: 'ADD_ITEM',
      payload: {
        product,
        selectedVariant,
        quantity: 1,
        size: selectedSize || product.sizes[0]
      }
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    // Navigate to checkout or open cart
    cartDispatch({ type: 'TOGGLE_CART' });
  };

  return (
    <div className="pt-16 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <motion.button
          onClick={() => navigate('/products')}
          className="flex items-center text-gray-600 hover:text-gold transition-colors duration-300 mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Products
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Main Image */}
            <div className="mb-4">
              <img
                src={selectedVariant?.images?.[selectedImage] || '/placeholder-image.jpg'}
                alt={product.name}
                className="w-full aspect-square object-cover rounded-lg shadow-lg"
              />
            </div>

            {/* Thumbnail Images */}
            {selectedVariant?.images && selectedVariant.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {selectedVariant.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      selectedImage === index
                        ? 'border-gold shadow-lg'
                        : 'border-gray-200 hover:border-gray-300'
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
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Product Name and Price */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-cormorant font-bold text-black mb-2">
                {product.name}
              </h1>
              <p className="text-2xl font-montserrat font-semibold text-gold">
                ₹{((product.base_price + (selectedVariant?.price || 0))).toLocaleString('en-IN')}
              </p>
            </div>

            {/* Product Description */}
            <div>
              <p className="text-gray-700 font-montserrat leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Materials and Color Variants */}
            <div className="space-y-4">
              {/* Color Variants */}
              {product.variants && product.variants.length > 1 && (
                <div>
                  <h3 className="text-lg font-cormorant font-semibold text-black mb-2">
                    Color
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {product.variants.map((variant, index) => (
                      <button
                        key={variant.id}
                        onClick={() => {
                          setSelectedVariantIndex(index);
                          setSelectedImage(0); // Reset to first image when changing variant
                        }}
                        className={`flex items-center space-x-2 px-3 py-2 border rounded-lg transition-all duration-300 transform hover:scale-105 ${
                          selectedVariantIndex === index
                            ? 'border-gold bg-gold bg-opacity-10 shadow-md scale-105'
                            : 'border-gray-300 hover:border-gold hover:bg-gold hover:bg-opacity-5 hover:shadow-sm'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border-2 transition-all duration-300 ${
                            selectedVariantIndex === index 
                              ? 'border-gold shadow-md' 
                              : 'border-gray-300 hover:border-gold'
                          }`}
                          style={{ backgroundColor: variant.colorCode }}
                        />
                        <span className="font-montserrat text-sm">{variant.color}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-lg font-cormorant font-semibold text-black mb-2">
                  Materials
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.materials.map((material, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-montserrat"
                    >
                      {material}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Size Selection */}
            {product.sizes.length > 1 && (
              <div>
                <h3 className="text-lg font-cormorant font-semibold text-black mb-2">
                  Size
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1.5 border rounded-md transition-all duration-300 font-montserrat text-sm ${
                        selectedSize === size
                          ? 'border-gold bg-gold text-white shadow-md transform scale-105'
                          : 'border-gray-300 text-gray-700 hover:border-gold hover:bg-gold hover:bg-opacity-10 hover:shadow-sm'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Status */}
            <div className="bg-gray-50 rounded-lg p-4">
              {selectedVariant && selectedVariant.stock > 0 ? (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-green-600 font-montserrat font-medium">
                    In Stock ({selectedVariant.stock} available)
                  </p>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <p className="text-red-600 font-montserrat font-medium">
                    Out of Stock
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                disabled={!selectedVariant || selectedVariant.stock === 0}
                className={`w-full py-4 px-6 rounded-lg font-montserrat font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
                  !selectedVariant || selectedVariant.stock === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-black text-white hover:bg-gray-800 hover:shadow-lg hover:transform hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                <ShoppingCart size={20} />
                <span>Add to Bag</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={!selectedVariant || selectedVariant.stock === 0}
                className={`w-full py-4 px-6 rounded-lg font-montserrat font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-2 border-2 ${
                  !selectedVariant || selectedVariant.stock === 0
                    ? 'border-gray-300 text-gray-500 cursor-not-allowed bg-gray-50'
                    : 'border-gold text-gold hover:bg-gold hover:text-white hover:shadow-lg hover:transform hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-r from-transparent to-transparent hover:from-gold hover:to-gold'
                }`}
              >
                <span>Buy Now</span>
              </button>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div>
                <h3 className="text-lg font-cormorant font-semibold text-black mb-4">
                  Features
                </h3>
                <div className="space-y-2">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-center py-2">
                      <span className="font-montserrat text-gray-700">• {feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16"
        >
          <div className="border-t border-gray-200 pt-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-cormorant font-bold text-black mb-2">
                  Customer Reviews
                </h2>
                {product.reviews && product.reviews.length > 0 ? (
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={20}
                          className={`${
                            i < Math.floor(product.average_rating)
                              ? 'fill-gold text-gold'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-lg font-montserrat font-semibold text-black">
                      {product.average_rating.toFixed(1)}
                    </span>
                    <span className="text-gray-600 font-montserrat">
                      ({product.total_reviews} {product.total_reviews === 1 ? 'review' : 'reviews'})
                    </span>
                  </div>
                ) : (
                  <p className="text-gray-600 font-montserrat">
                    No reviews yet. Be the first to review this product!
                  </p>
                )}
              </div>
              
              {/* Write Review Button */}
              <button
                onClick={() => setShowReviewForm(true)}
                className="flex items-center space-x-2 px-4 py-2 border-2 border-gold text-gold hover:bg-gold hover:text-white transition-all duration-300 rounded-lg font-montserrat font-semibold"
              >
                <Plus size={16} />
                <span>Write Review</span>
              </button>
            </div>

            {product.reviews && product.reviews.length > 0 ? (
              <>
                <div className="grid gap-6">
                  {product.reviews.map((review) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors duration-300"
                    >
                      <div className="flex items-start space-x-4">
                        {/* User Avatar */}
                        <div className="flex-shrink-0">
                          <img
                            src={getAvatarForGender(review.user_gender, review.user_name)}
                            alt={review.user_name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 bg-gray-100"
                          />
                        </div>

                        {/* Review Content */}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-montserrat font-semibold text-black">
                                {review.user_name}
                              </h4>
                              <div className="flex items-center space-x-2">
                                <div className="flex items-center space-x-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      size={16}
                                      className={`${
                                        i < review.rating
                                          ? 'fill-gold text-gold'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                {review.verified_purchase && (
                                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-montserrat">
                                    Verified Purchase
                                  </span>
                                )}
                              </div>
                            </div>
                            <span className="text-sm text-gray-500 font-montserrat">
                              {new Date(review.created_at).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>

                          <p className="text-gray-700 font-montserrat leading-relaxed">
                            {review.comment}
                          </p>

                          {/* Admin Reply */}
                          {review.admin_reply && (
                            <div className="mt-4 pl-4 border-l-3 border-gold bg-gold/5 rounded-r-lg p-4">
                              <div className="flex items-center space-x-2 mb-2">
                                <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center">
                                  <span className="text-white text-sm font-bold">A</span>
                                </div>
                                <div>
                                  <h5 className="font-montserrat font-semibold text-gold text-sm">
                                    {review.admin_name || 'Admin'}
                                  </h5>
                                  <span className="text-xs text-gray-500">
                                    {review.admin_reply_at && new Date(review.admin_reply_at).toLocaleDateString('en-IN', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric'
                                    })}
                                  </span>
                                </div>
                              </div>
                              <p className="text-gray-700 font-montserrat text-sm leading-relaxed">
                                {review.admin_reply}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* View More Reviews Button */}
                {product.total_reviews > product.reviews.length && (
                  <div className="text-center mt-8">
                    <button className="px-6 py-3 border-2 border-gold text-gold hover:bg-gold hover:text-white transition-all duration-300 rounded-lg font-montserrat font-semibold">
                      View All {product.total_reviews} Reviews
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Star size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-cormorant font-semibold text-gray-700 mb-2">
                  No Reviews Yet
                </h3>
                <p className="text-gray-600 font-montserrat mb-4">
                  Share your experience with this product and help other customers make informed decisions.
                </p>
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="px-6 py-3 bg-gold text-white hover:bg-opacity-90 transition-all duration-300 rounded-lg font-montserrat font-semibold"
                >
                  Write the First Review
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <ReviewForm
          productId={id || ''}
          onReviewAdded={() => {
            // Trigger a refetch of the product data
            window.location.reload(); // Simple refresh for now
          }}
          onClose={() => setShowReviewForm(false)}
        />
      )}
    </div>
  );
};
