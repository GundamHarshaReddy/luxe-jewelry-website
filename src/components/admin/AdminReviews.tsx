import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Star, 
  Calendar, 
  User, 
  Mail, 
  Phone, 
  Reply, 
  Trash2, 
  Clock,
  CheckCircle,
  Search,
  Filter,
  BarChart3
} from 'lucide-react';
import { adminReviewService } from '../../lib/adminReviewService';
import { adminProductService } from '../../lib/adminProductService';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { ProductReview, Product } from '../../types';

interface ReviewWithProduct extends ProductReview {
  product_name?: string;
}

interface AdminReviewsProps {}

const AdminReviews: React.FC<AdminReviewsProps> = () => {
  const [reviews, setReviews] = useState<ReviewWithProduct[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'replied'>('all');
  const [selectedProduct, setSelectedProduct] = useState<string>('all');
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState<ReviewWithProduct | null>(null);
  const [stats, setStats] = useState({
    total_reviews: 0,
    pending_replies: 0,
    average_rating: 0,
    recent_reviews: 0
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [reviewsData, productsData, statsData] = await Promise.all([
        adminReviewService.getAllReviews(),
        adminProductService.getAllProducts(),
        adminReviewService.getReviewStats()
      ]);
      
      setReviews(reviewsData);
      setProducts(productsData);
      setStats(statsData);
      setError(null);
    } catch (err) {
      console.error('Error loading review data:', err);
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  // Filter reviews
  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (review.product_name && review.product_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'pending' && !review.admin_reply) ||
                         (filterStatus === 'replied' && review.admin_reply);
    
    const matchesProduct = selectedProduct === 'all' || 
                          (review as any).product_id === selectedProduct;
    
    return matchesSearch && matchesStatus && matchesProduct;
  });

  const handleReply = (review: ReviewWithProduct) => {
    setSelectedReview(review);
    setShowReplyModal(true);
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    
    try {
      await adminReviewService.deleteReview(reviewId);
      await loadData();
    } catch (err) {
      console.error('Error deleting review:', err);
      setError('Failed to delete review');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Review Management</h1>
          <p className="text-gray-600 mt-2">Manage customer reviews and responses</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <MessageSquare className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Reviews</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total_reviews}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-orange-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Replies</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending_replies}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Star className="h-8 w-8 text-yellow-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Rating</p>
              <p className="text-2xl font-bold text-gray-900">{stats.average_rating}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-gray-900">{stats.recent_reviews}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'pending' | 'replied')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Reviews</option>
                <option value="pending">Pending Reply</option>
                <option value="replied">Replied</option>
              </select>
            </div>

            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Products</option>
              {products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            onReply={handleReply}
            onDelete={handleDeleteReview}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredReviews.length === 0 && !loading && (
        <div className="text-center py-12">
          <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
          <p className="text-gray-500">
            {searchTerm || filterStatus !== 'all' || selectedProduct !== 'all' 
              ? 'Try adjusting your search or filters' 
              : 'No customer reviews yet'}
          </p>
        </div>
      )}

      {/* Reply Modal */}
      <AnimatePresence>
        {showReplyModal && selectedReview && (
          <ReplyModal
            review={selectedReview}
            onClose={() => setShowReplyModal(false)}
            onReply={loadData}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Review Card Component
interface ReviewCardProps {
  review: ReviewWithProduct;
  onReply: (review: ReviewWithProduct) => void;
  onDelete: (reviewId: string) => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, onReply, onDelete }) => {
  const getStarRating = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
      whileHover={{ y: -1 }}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{review.user_name}</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Calendar size={14} />
                <span>{formatDate(review.created_at)}</span>
                {review.verified_purchase && (
                  <>
                    <CheckCircle size={14} className="text-green-500" />
                    <span className="text-green-600">Verified Purchase</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {!review.admin_reply ? (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                <Clock size={12} className="mr-1" />
                Pending Reply
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <CheckCircle size={12} className="mr-1" />
                Replied
              </span>
            )}
          </div>
        </div>

        {/* Product & Rating */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-gray-600">Product: <span className="font-medium">{review.product_name}</span></p>
            <div className="flex items-center mt-1">
              {getStarRating(review.rating)}
              <span className="ml-2 text-sm text-gray-600">({review.rating}/5)</span>
            </div>
          </div>
        </div>

        {/* Review Comment */}
        <div className="mb-4">
          <p className="text-gray-700">{review.comment}</p>
        </div>

        {/* Contact Info */}
        {(review.user_email || review.user_phone) && (
          <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
            {review.user_email && (
              <div className="flex items-center space-x-1">
                <Mail size={14} />
                <span>{review.user_email}</span>
              </div>
            )}
            {review.user_phone && (
              <div className="flex items-center space-x-1">
                <Phone size={14} />
                <span>{review.user_phone}</span>
              </div>
            )}
          </div>
        )}

        {/* Admin Reply */}
        {review.admin_reply && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-900">
                Admin Reply by {review.admin_name}
              </span>
              <span className="text-xs text-blue-600">
                {review.admin_reply_at && formatDate(review.admin_reply_at)}
              </span>
            </div>
            <p className="text-blue-800">{review.admin_reply}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => onReply(review)}
            className="flex items-center space-x-1"
          >
            <Reply size={16} />
            <span>{review.admin_reply ? 'Update Reply' : 'Reply'}</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => onDelete(review.id)}
            className="flex items-center space-x-1 text-red-600 border-red-200 hover:bg-red-50"
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

// Reply Modal Component
interface ReplyModalProps {
  review: ReviewWithProduct;
  onClose: () => void;
  onReply: () => void;
}

const ReplyModal: React.FC<ReplyModalProps> = ({ review, onClose, onReply }) => {
  const [replyText, setReplyText] = useState(review.admin_reply || '');
  const [adminName, setAdminName] = useState(review.admin_name || 'Admin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await adminReviewService.replyToReview({
        review_id: review.id,
        admin_reply: replyText,
        admin_name: adminName
      });
      
      onReply();
      onClose();
    } catch (err: any) {
      console.error('Error replying to review:', err);
      setError(err.message || 'Failed to reply to review');
    } finally {
      setLoading(false);
    }
  };

  return (
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
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            {review.admin_reply ? 'Update Reply' : 'Reply to Review'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ×
          </button>
        </div>

        {/* Review Context */}
        <div className="p-6 bg-gray-50 border-b">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User size={16} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{review.user_name}</h3>
              <div className="flex items-center space-x-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                  />
                ))}
              </div>
            </div>
          </div>
          <p className="text-gray-700 italic">"{review.comment}"</p>
        </div>

        {/* Reply Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admin Name
            </label>
            <Input
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              placeholder="Your name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reply Message *
            </label>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Thank you for your review..."
            />
          </div>

          <div className="flex items-center justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Reply size={16} className="mr-2" />
                  {review.admin_reply ? 'Update Reply' : 'Send Reply'}
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AdminReviews;
