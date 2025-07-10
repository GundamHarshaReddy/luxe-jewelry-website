export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  stock: number;
  materials: string[];
  gemstones: string[];
  sizes: string[];
  created_at: string;
  updated_at: string;
  is_featured: boolean;
  specifications: Record<string, string>;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  size?: string;
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