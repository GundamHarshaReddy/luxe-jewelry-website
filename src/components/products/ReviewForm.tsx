import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Send } from 'lucide-react';
import { productService, CreateReviewData } from '../../lib/productService';

interface ReviewFormProps {
  productId: string;
  onReviewAdded: () => void;
  onClose: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ productId, onReviewAdded, onClose }) => {
  const [formData, setFormData] = useState<CreateReviewData>({
    user_name: '',
    user_email: '',
    user_phone: '',
    user_gender: 'female',
    rating: 0,
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.user_name.trim()) {
      newErrors.user_name = 'Name is required';
    }

    if (!formData.user_email.trim()) {
      newErrors.user_email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.user_email)) {
      newErrors.user_email = 'Please enter a valid email address';
    }

    if (!formData.comment.trim()) {
      newErrors.comment = 'Review comment is required';
    }

    if (formData.rating === 0) {
      newErrors.rating = 'Please select a rating';
    }

    if (formData.user_phone && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(formData.user_phone)) {
      newErrors.user_phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await productService.addReview(productId, formData);
      onReviewAdded();
      onClose();
    } catch (error) {
      console.error('Error submitting review:', error);
      setErrors({ submit: 'Failed to submit review. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingClick = (rating: number) => {
    setFormData({ ...formData, rating });
    if (errors.rating) {
      setErrors({ ...errors, rating: '' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-cormorant font-bold text-black">
              Write a Review
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-montserrat font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                value={formData.user_name}
                onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent font-montserrat ${
                  errors.user_name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Your full name"
              />
              {errors.user_name && (
                <p className="text-red-500 text-sm mt-1 font-montserrat">{errors.user_name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-montserrat font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                value={formData.user_email}
                onChange={(e) => setFormData({ ...formData, user_email: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent font-montserrat ${
                  errors.user_email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="your@email.com"
              />
              {errors.user_email && (
                <p className="text-red-500 text-sm mt-1 font-montserrat">{errors.user_email}</p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-montserrat font-medium text-gray-700 mb-1">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                value={formData.user_phone}
                onChange={(e) => setFormData({ ...formData, user_phone: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent font-montserrat ${
                  errors.user_phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="+91 98765 43210"
              />
              {errors.user_phone && (
                <p className="text-red-500 text-sm mt-1 font-montserrat">{errors.user_phone}</p>
              )}
            </div>

            {/* Gender Field */}
            <div>
              <label className="block text-sm font-montserrat font-medium text-gray-700 mb-2">
                Gender *
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.user_gender === 'female'}
                    onChange={(e) => setFormData({ ...formData, user_gender: e.target.value as 'male' | 'female' })}
                    className="mr-2 text-gold focus:ring-gold"
                  />
                  <span className="font-montserrat text-sm">Female</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.user_gender === 'male'}
                    onChange={(e) => setFormData({ ...formData, user_gender: e.target.value as 'male' | 'female' })}
                    className="mr-2 text-gold focus:ring-gold"
                  />
                  <span className="font-montserrat text-sm">Male</span>
                </label>
              </div>
            </div>

            {/* Rating Field */}
            <div>
              <label className="block text-sm font-montserrat font-medium text-gray-700 mb-2">
                Rating *
              </label>
              <div className="flex items-center space-x-1 mb-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => handleRatingClick(rating)}
                    className="focus:outline-none hover:scale-110 transition-transform duration-200"
                  >
                    <Star
                      size={32}
                      className={`${
                        rating <= formData.rating
                          ? 'fill-gold text-gold'
                          : 'text-gray-300 hover:text-gold'
                      } transition-colors duration-200`}
                    />
                  </button>
                ))}
              </div>
              {formData.rating > 0 && (
                <p className="text-sm text-gray-600 font-montserrat">
                  {formData.rating === 1 && "Poor"}
                  {formData.rating === 2 && "Fair"}
                  {formData.rating === 3 && "Good"}
                  {formData.rating === 4 && "Very Good"}
                  {formData.rating === 5 && "Excellent"}
                </p>
              )}
              {errors.rating && (
                <p className="text-red-500 text-sm mt-1 font-montserrat">{errors.rating}</p>
              )}
            </div>

            {/* Comment Field */}
            <div>
              <label className="block text-sm font-montserrat font-medium text-gray-700 mb-1">
                Your Review *
              </label>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent font-montserrat resize-none ${
                  errors.comment ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Share your experience with this product..."
              />
              {errors.comment && (
                <p className="text-red-500 text-sm mt-1 font-montserrat">{errors.comment}</p>
              )}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm font-montserrat">{errors.submit}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300 font-montserrat font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 px-4 py-3 rounded-lg transition-all duration-300 font-montserrat font-medium flex items-center justify-center space-x-2 ${
                  isSubmitting
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gold text-white hover:bg-gold hover:shadow-lg hover:transform hover:scale-[1.02]'
                }`}
              >
                <Send size={16} />
                <span>{isSubmitting ? 'Submitting...' : 'Submit Review'}</span>
              </button>
            </div>
          </form>

          {/* Privacy Notice */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 font-montserrat">
              Your review will be publicly visible. We do not share your contact information with third parties.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
