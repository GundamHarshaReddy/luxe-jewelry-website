export interface ProductVariant {
  id: string;
  color: string;
  colorCode: string; // hex color code
  images: string[];
  stock: number;
  price: number;
}

export interface ProductReview {
  id: string;
  user_name: string;
  user_email?: string;
  user_phone?: string;
  user_gender?: 'male' | 'female';
  rating: number; // 1-5
  comment: string;
  created_at: string;
  verified_purchase: boolean;
  admin_reply?: string;
  admin_reply_at?: string;
  admin_name?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  detailed_description: string;
  base_price: number;
  category: string; // 'bangles', 'bracelets', etc.
  variants: ProductVariant[]; // color variants
  sizes: string[]; // ['2.1', '2.2', '2.3', '2.4', etc.]
  materials: string[];
  features: string[]; // special features like 'adjustable', 'waterproof', etc.
  care_instructions: string;
  created_at: string;
  updated_at: string;
  is_featured: boolean;
  average_rating: number;
  total_reviews: number;
  reviews: ProductReview[];
  tags: string[]; // for search and filtering
}

export interface CartItem {
  id: string;
  product: Product;
  selectedVariant: ProductVariant;
  quantity: number;
  size: string;
  personalization?: string;
  price: number;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
  itemCount: number;
  total: number;
}

export interface CartAction {
  type: 'ADD_ITEM' | 'REMOVE_ITEM' | 'UPDATE_QUANTITY' | 'CLEAR_CART' | 'TOGGLE_CART';
  payload?: any;
}