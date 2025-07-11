import { supabase } from './supabase';
import type { ProductReview } from '../types';

export interface AdminReplyData {
  review_id: string;
  admin_reply: string;
  admin_name?: string;
}

class AdminReviewService {
  // Get all reviews for a specific product
  async getProductReviews(productId: string): Promise<ProductReview[]> {
    try {
      const { data, error } = await supabase
        .from('product_reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching product reviews:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getProductReviews:', error);
      throw error;
    }
  }

  // Get all reviews across all products
  async getAllReviews(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('product_reviews')
        .select(`
          *,
          products!inner(
            id,
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching all reviews:', error);
        throw error;
      }

      return data?.map(review => ({
        ...review,
        product_name: review.products?.name
      })) || [];
    } catch (error) {
      console.error('Error in getAllReviews:', error);
      throw error;
    }
  }

  // Reply to a review
  async replyToReview(replyData: AdminReplyData): Promise<ProductReview> {
    try {
      const { data, error } = await supabase
        .from('product_reviews')
        .update({
          admin_reply: replyData.admin_reply,
          admin_reply_at: new Date().toISOString(),
          admin_name: replyData.admin_name || 'Admin'
        })
        .eq('id', replyData.review_id)
        .select()
        .single();

      if (error) {
        console.error('Error replying to review:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in replyToReview:', error);
      throw error;
    }
  }

  // Delete a review
  async deleteReview(reviewId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('product_reviews')
        .delete()
        .eq('id', reviewId);

      if (error) {
        console.error('Error deleting review:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in deleteReview:', error);
      throw error;
    }
  }

  // Get review statistics
  async getReviewStats(): Promise<{
    total_reviews: number;
    pending_replies: number;
    average_rating: number;
    recent_reviews: number;
  }> {
    try {
      const { data: stats, error } = await supabase
        .from('product_reviews')
        .select('id, rating, admin_reply, created_at');

      if (error) {
        console.error('Error fetching review stats:', error);
        throw error;
      }

      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const totalReviews = stats?.length || 0;
      const pendingReplies = stats?.filter(r => !r.admin_reply).length || 0;
      const averageRating = totalReviews > 0 
        ? stats.reduce((sum, r) => sum + r.rating, 0) / totalReviews 
        : 0;
      const recentReviews = stats?.filter(r => new Date(r.created_at) >= weekAgo).length || 0;

      return {
        total_reviews: totalReviews,
        pending_replies: pendingReplies,
        average_rating: Math.round(averageRating * 10) / 10,
        recent_reviews: recentReviews
      };
    } catch (error) {
      console.error('Error in getReviewStats:', error);
      return {
        total_reviews: 0,
        pending_replies: 0,
        average_rating: 0,
        recent_reviews: 0
      };
    }
  }
}

export const adminReviewService = new AdminReviewService();
