-- Add admin reply functionality to product_reviews table
ALTER TABLE public.product_reviews 
ADD COLUMN IF NOT EXISTS admin_reply TEXT,
ADD COLUMN IF NOT EXISTS admin_reply_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS admin_name TEXT DEFAULT 'Admin';

-- Create index for admin replies
CREATE INDEX IF NOT EXISTS product_reviews_admin_reply_idx ON public.product_reviews(admin_reply_at DESC) WHERE admin_reply IS NOT NULL;

-- Update table comment
COMMENT ON TABLE public.product_reviews IS 'Customer reviews for products with admin reply support';
COMMENT ON COLUMN public.product_reviews.admin_reply IS 'Admin response to the customer review';
COMMENT ON COLUMN public.product_reviews.admin_reply_at IS 'Timestamp when admin replied to the review';
COMMENT ON COLUMN public.product_reviews.admin_name IS 'Name of the admin who replied';
