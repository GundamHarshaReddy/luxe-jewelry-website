-- Complete product_reviews table creation with new review system
-- Drop existing table if it exists to recreate with new structure
DROP TABLE IF EXISTS public.product_reviews CASCADE;

-- Create product_reviews table with all required fields
CREATE TABLE public.product_reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  product_id uuid NULL,
  user_name text NOT NULL,
  user_email text NULL,
  user_phone text NULL,
  user_gender text NULL CHECK (user_gender IN ('male', 'female')),
  rating integer NULL,
  comment text NULL,
  verified_purchase boolean NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT product_reviews_pkey PRIMARY KEY (id),
  CONSTRAINT product_reviews_product_id_fkey FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
  CONSTRAINT product_reviews_rating_check CHECK (
    (
      (rating >= 1)
      AND (rating <= 5)
    )
  )
) TABLESPACE pg_default;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS product_reviews_product_idx ON public.product_reviews USING btree (product_id) TABLESPACE pg_default;

-- Create trigger for automatic product rating updates
CREATE TRIGGER update_product_rating_trigger
AFTER INSERT
OR DELETE
OR UPDATE ON product_reviews FOR EACH ROW
EXECUTE FUNCTION update_product_rating();

-- Add comments for documentation
COMMENT ON COLUMN public.product_reviews.user_email IS 'Required email address of the reviewer';
COMMENT ON COLUMN public.product_reviews.user_phone IS 'Optional phone number of the reviewer';
COMMENT ON COLUMN public.product_reviews.user_gender IS 'Gender of the reviewer (male/female) for avatar selection';

-- Insert sample reviews for products
INSERT INTO public.product_reviews (product_id, user_name, user_email, user_phone, user_gender, rating, comment, verified_purchase) VALUES
((SELECT id FROM public.products WHERE name = 'Classic Gold Bangles Set'), 'Priya Sharma', 'priya.sharma@email.com', '+91 9876543210', 'female', 5, 'Absolutely beautiful bangles! The quality is excellent and they look exactly like the pictures. Perfect for daily wear.', true),
((SELECT id FROM public.products WHERE name = 'Classic Gold Bangles Set'), 'Anita Reddy', 'anita.reddy@email.com', '+91 9876543211', 'female', 4, 'Good quality and fast delivery. The gold color is rich and the bangles are comfortable to wear.', true),
((SELECT id FROM public.products WHERE name = 'Silver Oxidized Bangles'), 'Meera Nair', 'meera.nair@email.com', '+91 9876543212', 'female', 5, 'These bangles are gorgeous! The oxidized finish looks very authentic and goes well with ethnic wear.', true),
((SELECT id FROM public.products WHERE name = 'Pearl Accent Bangles'), 'Sneha Gupta', 'sneha.gupta@email.com', '+91 9876543213', 'female', 4, 'Beautiful bangles with lovely pearls. Perfect for parties and formal occasions.', true),
((SELECT id FROM public.products WHERE name = 'Kundan Bridal Bangles'), 'Kavya Iyer', 'kavya.iyer@email.com', '+91 9876543214', 'female', 5, 'Perfect for my wedding! The kundan work is exquisite and they look very royal. Highly recommended!', true),
((SELECT id FROM public.products WHERE name = 'Diamond Cut Bangles'), 'Divya Singh', 'divya.singh@email.com', '+91 9876543215', 'female', 5, 'Amazing sparkle and shine! These bangles catch the light beautifully. Great craftsmanship.', true),
((SELECT id FROM public.products WHERE name = 'Classic Gold Bangles Set'), 'Rajesh Kumar', 'rajesh.kumar@email.com', '+91 9876543216', 'male', 4, 'Bought these for my wife. She loves them! Good quality and excellent packaging.', true),
((SELECT id FROM public.products WHERE name = 'Silver Oxidized Bangles'), 'Amit Patel', 'amit.patel@email.com', '+91 9876543217', 'male', 4, 'Purchased for my sister''s birthday. The oxidized finish is beautiful and she was very happy with it.', true);
