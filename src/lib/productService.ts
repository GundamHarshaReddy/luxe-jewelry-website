import { supabase } from './supabase';
import type { Product, ProductVariant, ProductReview } from '../types';

export interface CreateProductData {
  name: string;
  description: string;
  detailed_description: string;
  base_price: number;
  category: string;
  sizes: string[];
  materials: string[];
  features: string[];
  care_instructions: string;
  is_featured?: boolean;
  tags: string[];
  variants: Omit<ProductVariant, 'id'>[];
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: string;
}

export interface CreateReviewData {
  user_name: string;
  user_email: string;
  user_phone?: string;
  user_gender: 'male' | 'female';
  rating: number;
  comment: string;
}

class ProductService {
  // Get all products with variants and reviews
  async getAllProducts(): Promise<Product[]> {
    try {
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (productsError) {
        console.error('Supabase error:', productsError);
        throw productsError;
      }

      const products = await Promise.all(
        (productsData || []).map(async (product) => {
          const [variantsResult, reviewsResult] = await Promise.all([
            this.getProductVariants(product.id),
            this.getProductReviews(product.id)
          ]);

          return {
            ...product,
            variants: variantsResult,
            reviews: reviewsResult
          } as Product;
        })
      );

      return products;
    } catch (error) {
      console.error('Error fetching products from Supabase:', error);
      return this.getMockProducts();
    }
  }

  // Get featured products
  async getFeaturedProducts(): Promise<Product[]> {
    try {
      // Check if Supabase is properly configured
      if (!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === 'your_supabase_project_url') {
        return this.getMockProducts().filter(p => p.is_featured);
      }

      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true)
        .order('created_at', { ascending: false });

      if (productsError) throw productsError;

      const products = await Promise.all(
        (productsData || []).map(async (product) => {
          const [variantsResult, reviewsResult] = await Promise.all([
            this.getProductVariants(product.id),
            this.getProductReviews(product.id)
          ]);

          return {
            ...product,
            variants: variantsResult,
            reviews: reviewsResult
          } as Product;
        })
      );

      return products;
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return this.getMockProducts().filter(p => p.is_featured);
    }
  }

  // Get product by ID with variants and reviews
  async getProductById(id: string): Promise<Product | null> {
    try {
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (productError) {
        console.error('Product fetch error:', productError);
        if (productError.code === 'PGRST116') {
          return null;
        }
        throw productError;
      }

      const [variantsResult, reviewsResult] = await Promise.all([
        this.getProductVariants(id),
        this.getProductReviews(id)
      ]);

      return {
        ...productData,
        variants: variantsResult,
        reviews: reviewsResult
      } as Product;
    } catch (error) {
      console.error('Error fetching product from Supabase:', error);
      const mockProducts = this.getMockProducts();
      return mockProducts.find(p => p.id === id) || null;
    }
  }

  // Get product variants
  async getProductVariants(productId: string): Promise<ProductVariant[]> {
    try {
      const { data, error } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return (data || []).map(variant => ({
        id: variant.id,
        color: variant.color,
        colorCode: variant.color_code,
        images: variant.images,
        stock: variant.stock,
        price: variant.price_adjustment || 0
      })) as ProductVariant[];
    } catch (error) {
      console.error('Error fetching product variants:', error);
      return [];
    }
  }

  // Get product reviews
  async getProductReviews(productId: string): Promise<ProductReview[]> {
    try {
      const { data, error } = await supabase
        .from('product_reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(review => ({
        id: review.id,
        user_name: review.user_name,
        user_email: review.user_email,
        user_phone: review.user_phone,
        user_gender: review.user_gender,
        rating: review.rating,
        comment: review.comment,
        created_at: review.created_at,
        verified_purchase: review.verified_purchase,
        admin_reply: review.admin_reply,
        admin_reply_at: review.admin_reply_at,
        admin_name: review.admin_name
      })) as ProductReview[];
    } catch (error) {
      console.error('Error fetching product reviews:', error);
      return [];
    }
  }

  // Create new product with variants (Admin only)
  async createProduct(productData: CreateProductData): Promise<Product> {
    try {
      const { variants, ...productInfo } = productData;
      
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert([productInfo])
        .select()
        .single();

      if (productError) throw productError;

      // Insert variants
      if (variants.length > 0) {
        const variantsToInsert = variants.map(variant => ({
          product_id: product.id,
          color: variant.color,
          color_code: variant.colorCode,
          images: variant.images,
          stock: variant.stock,
          price_adjustment: variant.price
        }));

        const { error: variantsError } = await supabase
          .from('product_variants')
          .insert(variantsToInsert);

        if (variantsError) throw variantsError;
      }

      return await this.getProductById(product.id) as Product;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  // Search products
  async searchProducts(query: string): Promise<Product[]> {
    try {
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query}}`)
        .order('created_at', { ascending: false });

      if (productsError) throw productsError;

      const products = await Promise.all(
        (productsData || []).map(async (product) => {
          const [variantsResult, reviewsResult] = await Promise.all([
            this.getProductVariants(product.id),
            this.getProductReviews(product.id)
          ]);

          return {
            ...product,
            variants: variantsResult,
            reviews: reviewsResult
          } as Product;
        })
      );

      return products;
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }

  // Add product review
  async addReview(productId: string, reviewData: CreateReviewData): Promise<ProductReview> {
    try {
      const { data, error } = await supabase
        .from('product_reviews')
        .insert([{
          product_id: productId,
          user_name: reviewData.user_name,
          user_email: reviewData.user_email,
          user_phone: reviewData.user_phone,
          user_gender: reviewData.user_gender,
          rating: reviewData.rating,
          comment: reviewData.comment,
          verified_purchase: false // New reviews are not verified by default
        }])
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        user_name: data.user_name,
        user_gender: data.user_gender,
        rating: data.rating,
        comment: data.comment,
        created_at: data.created_at,
        verified_purchase: data.verified_purchase
      } as ProductReview;
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  }

  // Update variant stock
  async updateVariantStock(variantId: string, stock: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('product_variants')
        .update({ stock })
        .eq('id', variantId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating variant stock:', error);
      throw error;
    }
  }

  // Mock data for when Supabase is not configured
  private getMockProducts(): Product[] {
    return [
      {
        id: '1',
        name: 'Golden Rose Bangle',
        description: 'Elegant gold-plated bangle with intricate rose patterns perfect for special occasions.',
        detailed_description: 'This exquisite bangle features hand-crafted rose motifs in 18k gold plating over premium brass. The adjustable design ensures a comfortable fit while maintaining its elegant appearance. Perfect for weddings, parties, and special occasions.',
        base_price: 2500,
        category: 'bangles',
        variants: [
          {
            id: 'v1',
            color: 'Rose Gold',
            colorCode: '#E8B4B8',
            images: [
              'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400',
              'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400'
            ],
            stock: 15,
            price: 0
          },
          {
            id: 'v2',
            color: 'Classic Gold',
            colorCode: '#FFD700',
            images: [
              'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400',
              'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400'
            ],
            stock: 12,
            price: 0
          }
        ],
        sizes: ['2.1', '2.2', '2.3', '2.4', '2.5', '2.6', '2.7', '2.8'],
        materials: ['18K Gold Plated', 'Brass'],
        features: ['Adjustable Size', 'Lightweight', 'Tarnish Resistant'],
        care_instructions: 'Clean with soft cloth. Avoid water and chemicals.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_featured: true,
        average_rating: 4.5,
        total_reviews: 23,
        reviews: [
          {
            id: 'r1',
            user_name: 'Priya Sharma',
            user_gender: 'female',
            rating: 5,
            comment: 'Beautiful bangle! The rose pattern is stunning and it fits perfectly. The quality is excellent and it arrived beautifully packaged.',
            created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            verified_purchase: true
          },
          {
            id: 'r1b',
            user_name: 'Meera Patel',
            user_gender: 'female',
            rating: 4,
            comment: 'Lovely design and good craftsmanship. The gold plating looks premium. Only wish it came in a slightly larger size.',
            created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
            verified_purchase: true
          },
          {
            id: 'r1c',
            user_name: 'Kavya R',
            user_gender: 'female',
            rating: 5,
            comment: 'Perfect for my wedding! Got so many compliments. The adjustable feature is very convenient.',
            created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
            verified_purchase: true
          }
        ],
        tags: ['traditional', 'wedding', 'gold', 'elegant']
      },
      {
        id: '2',
        name: 'Silver Lotus Bangle',
        description: 'Premium silver bangle with lotus flower engravings, symbolizing purity and elegance.',
        detailed_description: 'Crafted from 925 sterling silver, this bangle features beautiful lotus engravings that symbolize purity and new beginnings. The oxidized finish gives it a vintage appeal while the adjustable design ensures comfort.',
        base_price: 1800,
        category: 'bangles',
        variants: [
          {
            id: 'v3',
            color: 'Oxidized Silver',
            colorCode: '#C0C0C0',
            images: [
              'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400',
              'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400'
            ],
            stock: 18,
            price: 0
          },
          {
            id: 'v4',
            color: 'Bright Silver',
            colorCode: '#E5E5E5',
            images: [
              'https://images.unsplash.com/photo-1588444837495-c6cfeb53ee55?w=400',
              'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400'
            ],
            stock: 22,
            price: 200
          }
        ],
        sizes: ['2.1', '2.2', '2.3', '2.4', '2.5', '2.6', '2.7', '2.8'],
        materials: ['925 Sterling Silver'],
        features: ['Handcrafted', 'Oxidized Finish', 'Adjustable'],
        care_instructions: 'Clean with silver polish. Store in dry place.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_featured: false,
        average_rating: 4.2,
        total_reviews: 18,
        reviews: [
          {
            id: 'r2',
            user_name: 'Anita Desai',
            user_gender: 'female',
            rating: 4,
            comment: 'Love the lotus design! Good quality silver. The oxidized finish gives it a beautiful vintage look.',
            created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            verified_purchase: true
          },
          {
            id: 'r2b',
            user_name: 'Divya Singh',
            user_gender: 'female',
            rating: 5,
            comment: 'Absolutely gorgeous! The lotus engravings are so detailed and beautiful. Perfect weight and comfortable to wear.',
            created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            verified_purchase: true
          },
          {
            id: 'r2c',
            user_name: 'Ritu K',
            user_gender: 'female',
            rating: 4,
            comment: 'Very nice silver work. The bangle is well-crafted and the size is adjustable which is great.',
            created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            verified_purchase: false
          }
        ],
        tags: ['traditional', 'silver', 'lotus', 'handcrafted']
      }
    ];
  }
}

export const productService = new ProductService();
