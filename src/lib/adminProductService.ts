import { supabase } from './supabase';
import { productService } from './productService';
import type { Product, ProductVariant } from '../types';

// Use the same Product type as the main site
export type { Product } from '../types';

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
  is_featured: boolean;
  tags: string[];
  variants: ProductVariant[];
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: string;
}

class AdminProductService {
  async getAllProducts(): Promise<Product[]> {
    try {
      return await productService.getAllProducts();
    } catch (error) {
      console.error('Error in getAllProducts:', error);
      return [];
    }
  }

  async createProduct(productData: CreateProductData): Promise<Product> {
    try {
      const { variants, ...baseProductData } = productData;
      
      const { data: productResult, error: productError } = await supabase
        .from('products')
        .insert([{
          ...baseProductData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          average_rating: 0,
          total_reviews: 0
        }])
        .select()
        .single();

      if (productError) {
        throw new Error(`Failed to create product: ${productError.message}`);
      }

      if (!productResult) {
        throw new Error('No product data returned after creation');
      }

      if (variants && variants.length > 0) {
        const variantData = variants.map(variant => ({
          ...variant,
          product_id: productResult.id,
          id: undefined
        }));

        const { error: variantError } = await supabase
          .from('product_variants')
          .insert(variantData);

        if (variantError) {
          throw new Error(`Failed to create variants: ${variantError.message}`);
        }
      }

      return await this.getProductById(productResult.id);
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  async updateProduct(updateData: UpdateProductData): Promise<Product> {
    try {
      const { id, variants, ...baseProductData } = updateData;
      
      const { error: productError } = await supabase
        .from('products')
        .update({
          ...baseProductData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (productError) {
        throw new Error(`Failed to update product: ${productError.message}`);
      }

      if (variants) {
        await supabase
          .from('product_variants')
          .delete()
          .eq('product_id', id);

        if (variants.length > 0) {
          const variantData = variants.map(variant => ({
            ...variant,
            product_id: id,
            id: undefined
          }));

          const { error: variantError } = await supabase
            .from('product_variants')
            .insert(variantData);

          if (variantError) {
            throw new Error(`Failed to update variants: ${variantError.message}`);
          }
        }
      }

      return await this.getProductById(id);
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      await supabase
        .from('product_variants')
        .delete()
        .eq('product_id', id);

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Failed to delete product: ${error.message}`);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  async getProductById(id: string): Promise<Product> {
    try {
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (productError || !productData) {
        throw new Error(`Product not found: ${productError?.message || 'No data'}`);
      }

      const { data: variantsData, error: variantsError } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', id);

      if (variantsError) {
        throw new Error(`Failed to load variants: ${variantsError.message}`);
      }

      const { data: reviewsData } = await supabase
        .from('product_reviews')
        .select('*')
        .eq('product_id', id)
        .order('created_at', { ascending: false });

      const reviews = reviewsData || [];
      const averageRating = reviews.length > 0 
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
        : 0;

      return {
        ...productData,
        variants: variantsData || [],
        reviews: reviews,
        average_rating: averageRating,
        total_reviews: reviews.length
      };
    } catch (error) {
      console.error('Error getting product by ID:', error);
      throw error;
    }
  }

  async uploadImage(file: File): Promise<string> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `product-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: urlData } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  async toggleFeatured(id: string, isFeatured: boolean): Promise<void> {
    try {
      const { error } = await supabase
        .from('products')
        .update({ 
          is_featured: isFeatured,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        throw new Error(`Failed to toggle featured status: ${error.message}`);
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
      throw error;
    }
  }
}

export const adminProductService = new AdminProductService();
