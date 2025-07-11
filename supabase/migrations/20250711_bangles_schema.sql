-- Drop existing products table if it exists
DROP TABLE IF EXISTS public.products CASCADE;

-- Create products table for bangles
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  detailed_description TEXT,
  base_price DECIMAL(10,2) NOT NULL,
  category TEXT DEFAULT 'bangles',
  sizes TEXT[] DEFAULT '{}',
  materials TEXT[] DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  care_instructions TEXT,
  is_featured BOOLEAN DEFAULT false,
  average_rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create product variants table for color variations
CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  color TEXT NOT NULL,
  color_code TEXT NOT NULL, -- hex color code
  images TEXT[] DEFAULT '{}',
  stock INTEGER DEFAULT 0,
  price_adjustment DECIMAL(10,2) DEFAULT 0, -- price difference from base price
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create product reviews table
CREATE TABLE IF NOT EXISTS public.product_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  verified_purchase BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS products_category_idx ON public.products(category);
CREATE INDEX IF NOT EXISTS products_featured_idx ON public.products(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS products_rating_idx ON public.products(average_rating DESC);
CREATE INDEX IF NOT EXISTS product_variants_product_idx ON public.product_variants(product_id);
CREATE INDEX IF NOT EXISTS product_reviews_product_idx ON public.product_reviews(product_id);

-- Enable RLS (Row Level Security)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for products
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Products can be inserted by authenticated users" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Products can be updated by authenticated users" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Products can be deleted by authenticated users" ON public.products FOR DELETE USING (true);

-- Create policies for product variants
CREATE POLICY "Product variants are viewable by everyone" ON public.product_variants FOR SELECT USING (true);
CREATE POLICY "Product variants can be inserted by authenticated users" ON public.product_variants FOR INSERT WITH CHECK (true);
CREATE POLICY "Product variants can be updated by authenticated users" ON public.product_variants FOR UPDATE USING (true);
CREATE POLICY "Product variants can be deleted by authenticated users" ON public.product_variants FOR DELETE USING (true);

-- Create policies for reviews
CREATE POLICY "Reviews are viewable by everyone" ON public.product_reviews FOR SELECT USING (true);
CREATE POLICY "Reviews can be inserted by authenticated users" ON public.product_reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Reviews can be updated by authenticated users" ON public.product_reviews FOR UPDATE USING (true);
CREATE POLICY "Reviews can be deleted by authenticated users" ON public.product_reviews FOR DELETE USING (true);

-- Create triggers for automatic timestamp updates
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  new.updated_at = timezone('utc'::text, now());
  RETURN new;
END;
$$ language plpgsql;

CREATE TRIGGER handle_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Function to update product ratings when reviews are added/updated
CREATE OR REPLACE FUNCTION public.update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.products SET
    average_rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM public.product_reviews
      WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM public.product_reviews
      WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)
    )
  WHERE id = COALESCE(NEW.product_id, OLD.product_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ language plpgsql;

CREATE TRIGGER update_product_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.product_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_product_rating();

-- Insert sample bangle products
INSERT INTO public.products (name, description, detailed_description, base_price, category, sizes, materials, features, care_instructions, is_featured, tags) VALUES
(
  'Classic Gold Bangles Set',
  'Beautiful set of traditional gold bangles perfect for daily wear and special occasions.',
  'These stunning gold bangles are crafted with precision and attention to detail. Made from high-quality gold plating over brass, they offer the perfect blend of elegance and affordability. The classic design makes them versatile enough for both casual and formal occasions. Each bangle is carefully polished to achieve a lustrous finish that catches the light beautifully.',
  2500.00,
  'bangles',
  ARRAY['2.1', '2.2', '2.3', '2.4', '2.5', '2.6', '2.7', '2.8'],
  ARRAY['Gold Plated Brass', 'Anti-Tarnish Coating'],
  ARRAY['Lightweight', 'Comfortable Fit', 'Durable Finish'],
  'Clean with soft cloth. Avoid contact with water, perfumes, and chemicals. Store in a dry place.',
  true,
  ARRAY['gold', 'traditional', 'daily wear', 'classic', 'set']
),
(
  'Silver Oxidized Bangles',
  'Elegant silver oxidized bangles with intricate patterns and ethnic designs.',
  'These beautiful silver oxidized bangles showcase traditional Indian craftsmanship with intricate patterns and oxidized finish. Perfect for ethnic wear and festival occasions. The oxidized silver gives them an antique look that pairs beautifully with traditional outfits. Each piece is handcrafted by skilled artisans.',
  1800.00,
  'bangles',
  ARRAY['2.1', '2.2', '2.3', '2.4', '2.5', '2.6', '2.7', '2.8'],
  ARRAY['Oxidized Silver', 'German Silver'],
  ARRAY['Handcrafted', 'Ethnic Design', 'Antique Finish'],
  'Clean with silver cleaning cloth. Avoid water exposure. Store separately to prevent scratching.',
  true,
  ARRAY['silver', 'oxidized', 'ethnic', 'traditional', 'handcrafted']
),
(
  'Pearl Accent Bangles',
  'Sophisticated bangles adorned with lustrous pearls for a contemporary look.',
  'These sophisticated bangles feature beautiful freshwater pearls set in a contemporary design. Perfect for formal occasions and parties. The pearls are carefully selected for their luster and uniformity. The modern design makes them perfect for pairing with western as well as ethnic outfits.',
  3200.00,
  'bangles',
  ARRAY['2.2', '2.3', '2.4', '2.5', '2.6', '2.7'],
  ARRAY['Brass Base', 'Freshwater Pearls', 'Gold Plating'],
  ARRAY['Pearl Studded', 'Contemporary Design', 'Party Wear'],
  'Handle with care. Clean pearls with soft damp cloth. Avoid chemicals and perfumes.',
  false,
  ARRAY['pearl', 'contemporary', 'formal', 'party wear', 'sophisticated']
),
(
  'Kundan Bridal Bangles',
  'Exquisite kundan bangles perfect for weddings and special celebrations.',
  'These magnificent kundan bangles are perfect for brides and special occasions. Featuring traditional kundan work with high-quality stones and gold plating. Each piece is meticulously crafted to create a royal and elegant look. The intricate design and sparkling stones make them perfect for weddings and celebrations.',
  5500.00,
  'bangles',
  ARRAY['2.3', '2.4', '2.5', '2.6', '2.7'],
  ARRAY['Gold Plated', 'Kundan Stones', 'Brass Base'],
  ARRAY['Bridal Jewelry', 'Kundan Work', 'Heavy Work', 'Traditional'],
  'Store in original box. Clean with soft brush. Avoid water and chemicals.',
  true,
  ARRAY['kundan', 'bridal', 'wedding', 'traditional', 'heavy work']
),
(
  'Diamond Cut Bangles',
  'Sparkling diamond cut bangles that catch light beautifully from every angle.',
  'These stunning diamond cut bangles feature precision-cut facets that create maximum sparkle and brilliance. The intricate cutting technique ensures that light reflects from multiple angles, creating a dazzling effect. Perfect for special occasions when you want to make a statement.',
  4200.00,
  'bangles',
  ARRAY['2.1', '2.2', '2.3', '2.4', '2.5', '2.6', '2.7', '2.8'],
  ARRAY['Gold Plated', 'Diamond Cut Brass'],
  ARRAY['Diamond Cut', 'High Shine', 'Sparkle Effect'],
  'Polish regularly with soft cloth to maintain shine. Avoid harsh chemicals.',
  false,
  ARRAY['diamond cut', 'sparkle', 'shine', 'special occasion', 'brilliant']
);

-- Insert color variants for each product
-- Classic Gold Bangles variants
INSERT INTO public.product_variants (product_id, color, color_code, images, stock, price_adjustment) VALUES
((SELECT id FROM public.products WHERE name = 'Classic Gold Bangles Set'), 'Gold', '#FFD700', 
 ARRAY['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400'], 25, 0),
((SELECT id FROM public.products WHERE name = 'Classic Gold Bangles Set'), 'Rose Gold', '#E8B4A0', 
 ARRAY['https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400', 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400'], 20, 200);

-- Silver Oxidized Bangles variants  
INSERT INTO public.product_variants (product_id, color, color_code, images, stock, price_adjustment) VALUES
((SELECT id FROM public.products WHERE name = 'Silver Oxidized Bangles'), 'Oxidized Silver', '#C0C0C0', 
 ARRAY['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400', 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400'], 30, 0),
((SELECT id FROM public.products WHERE name = 'Silver Oxidized Bangles'), 'Black Oxidized', '#2F2F2F', 
 ARRAY['https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400', 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400'], 15, 100);

-- Pearl Accent Bangles variants
INSERT INTO public.product_variants (product_id, color, color_code, images, stock, price_adjustment) VALUES
((SELECT id FROM public.products WHERE name = 'Pearl Accent Bangles'), 'White Pearl', '#F8F8FF', 
 ARRAY['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400'], 18, 0),
((SELECT id FROM public.products WHERE name = 'Pearl Accent Bangles'), 'Cream Pearl', '#FDF5E6', 
 ARRAY['https://images.unsplash.com/photo-1589674781759-c21c37956a44?w=400', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400'], 12, 0),
((SELECT id FROM public.products WHERE name = 'Pearl Accent Bangles'), 'Pink Pearl', '#FFB6C1', 
 ARRAY['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400', 'https://images.unsplash.com/photo-1588444837495-c6cfeb53ee55?w=400'], 10, 300);

-- Kundan Bridal Bangles variants
INSERT INTO public.product_variants (product_id, color, color_code, images, stock, price_adjustment) VALUES
((SELECT id FROM public.products WHERE name = 'Kundan Bridal Bangles'), 'Traditional Gold', '#FFD700', 
 ARRAY['https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400', 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400'], 8, 0),
((SELECT id FROM public.products WHERE name = 'Kundan Bridal Bangles'), 'Red Kundan', '#DC143C', 
 ARRAY['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400', 'https://images.unsplash.com/photo-1588444837495-c6cfeb53ee55?w=400'], 5, 500),
((SELECT id FROM public.products WHERE name = 'Kundan Bridal Bangles'), 'Green Kundan', '#228B22', 
 ARRAY['https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400', 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400'], 6, 500);

-- Diamond Cut Bangles variants
INSERT INTO public.product_variants (product_id, color, color_code, images, stock, price_adjustment) VALUES
((SELECT id FROM public.products WHERE name = 'Diamond Cut Bangles'), 'Gold', '#FFD700', 
 ARRAY['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400'], 22, 0),
((SELECT id FROM public.products WHERE name = 'Diamond Cut Bangles'), 'Silver', '#C0C0C0', 
 ARRAY['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400', 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400'], 18, -300),
((SELECT id FROM public.products WHERE name = 'Diamond Cut Bangles'), 'Rose Gold', '#E8B4A0', 
 ARRAY['https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400', 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400'], 15, 200);

-- Insert sample reviews
INSERT INTO public.product_reviews (product_id, user_name, user_avatar, rating, comment, verified_purchase) VALUES
((SELECT id FROM public.products WHERE name = 'Classic Gold Bangles Set'), 'Priya Sharma', 'https://images.unsplash.com/photo-1494790108755-2616b69e1b8e?w=40', 5, 'Absolutely beautiful bangles! The quality is excellent and they look exactly like the pictures. Perfect for daily wear.', true),
((SELECT id FROM public.products WHERE name = 'Classic Gold Bangles Set'), 'Anita Reddy', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40', 4, 'Good quality and fast delivery. The gold color is rich and the bangles are comfortable to wear.', true),
((SELECT id FROM public.products WHERE name = 'Silver Oxidized Bangles'), 'Meera Nair', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40', 5, 'These bangles are gorgeous! The oxidized finish looks very authentic and goes well with ethnic wear.', true),
((SELECT id FROM public.products WHERE name = 'Kundan Bridal Bangles'), 'Kavya Iyer', 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=40', 5, 'Perfect for my wedding! The kundan work is exquisite and they look very royal. Highly recommended!', true),
((SELECT id FROM public.products WHERE name = 'Pearl Accent Bangles'), 'Sneha Gupta', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40', 4, 'Beautiful bangles with lovely pearls. Perfect for parties and formal occasions.', true);
