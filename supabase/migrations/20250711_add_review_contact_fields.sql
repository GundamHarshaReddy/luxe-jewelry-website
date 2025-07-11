-- Add missing columns to product_reviews table
ALTER TABLE public.product_reviews 
ADD COLUMN IF NOT EXISTS user_email TEXT,
ADD COLUMN IF NOT EXISTS user_phone TEXT;

-- Update the table comment for clarity
COMMENT ON TABLE public.product_reviews IS 'Customer reviews for products including contact information';
COMMENT ON COLUMN public.product_reviews.user_email IS 'Optional email address of the reviewer';
COMMENT ON COLUMN public.product_reviews.user_phone IS 'Optional phone number of the reviewer';
