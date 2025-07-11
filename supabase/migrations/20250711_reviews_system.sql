-- Create product_reviews table
create table if not exists public.product_reviews (
  id uuid default gen_random_uuid() primary key,
  product_id uuid not null references public.products(id) on delete cascade,
  user_name text not null,
  user_email text,
  user_phone text,
  user_avatar text,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text not null,
  verified_purchase boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for better performance
create index if not exists product_reviews_product_id_idx on public.product_reviews(product_id);
create index if not exists product_reviews_created_at_idx on public.product_reviews(created_at desc);
create index if not exists product_reviews_rating_idx on public.product_reviews(rating);

-- Enable RLS (Row Level Security)
alter table public.product_reviews enable row level security;

-- Create policies for product_reviews
create policy "Reviews are viewable by everyone" on public.product_reviews
  for select using (true);

create policy "Anyone can insert reviews" on public.product_reviews
  for insert with check (true);

create policy "Users can update their own reviews" on public.product_reviews
  for update using (true);

create policy "Users can delete their own reviews" on public.product_reviews
  for delete using (true);

-- Create a function to automatically update the updated_at column
create trigger handle_product_reviews_updated_at
  before update on public.product_reviews
  for each row
  execute function public.handle_updated_at();

-- Function to calculate average rating for a product
create or replace function calculate_product_rating(product_uuid uuid)
returns table(average_rating numeric, total_reviews bigint) as $$
begin
  return query
  select 
    coalesce(round(avg(rating), 1), 0) as average_rating,
    count(*) as total_reviews
  from public.product_reviews
  where product_id = product_uuid;
end;
$$ language plpgsql;

-- Insert mock reviews for our existing products
-- First, let's get the product IDs (we'll use the names to identify them)
-- We'll insert reviews for our mock products

-- Insert mock reviews for product 1 (Golden Rose Bangle)
insert into public.product_reviews (product_id, user_name, user_email, user_phone, user_avatar, rating, comment, verified_purchase, created_at) values
(
  (select id from public.products where name = 'Golden Rose Bangle' limit 1),
  'Priya Sharma',
  'priya.sharma@example.com',
  '+91 98765 43210',
  'https://images.unsplash.com/photo-1494790108755-2616b8ad8ae2?w=100',
  5,
  'Beautiful bangle! The rose pattern is stunning and it fits perfectly. The quality is excellent and it arrived beautifully packaged.',
  true,
  timezone('utc'::text, now() - interval '7 days')
),
(
  (select id from public.products where name = 'Golden Rose Bangle' limit 1),
  'Meera Patel',
  'meera.patel@example.com',
  '+91 98765 43211',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
  4,
  'Lovely design and good craftsmanship. The gold plating looks premium. Only wish it came in a slightly larger size.',
  true,
  timezone('utc'::text, now() - interval '12 days')
),
(
  (select id from public.products where name = 'Golden Rose Bangle' limit 1),
  'Kavya R',
  'kavya.r@example.com',
  '+91 98765 43212',
  null,
  5,
  'Perfect for my wedding! Got so many compliments. The adjustable feature is very convenient.',
  true,
  timezone('utc'::text, now() - interval '20 days')
);

-- Insert mock reviews for product 2 (Silver Lotus Bangle)
insert into public.product_reviews (product_id, user_name, user_email, user_phone, user_avatar, rating, comment, verified_purchase, created_at) values
(
  (select id from public.products where name = 'Silver Lotus Bangle' limit 1),
  'Anita Desai',
  'anita.desai@example.com',
  '+91 98765 43213',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
  4,
  'Love the lotus design! Good quality silver. The oxidized finish gives it a beautiful vintage look.',
  true,
  timezone('utc'::text, now() - interval '5 days')
),
(
  (select id from public.products where name = 'Silver Lotus Bangle' limit 1),
  'Divya Singh',
  'divya.singh@example.com',
  '+91 98765 43214',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
  5,
  'Absolutely gorgeous! The lotus engravings are so detailed and beautiful. Perfect weight and comfortable to wear.',
  true,
  timezone('utc'::text, now() - interval '10 days')
),
(
  (select id from public.products where name = 'Silver Lotus Bangle' limit 1),
  'Ritu K',
  'ritu.k@example.com',
  '+91 98765 43215',
  null,
  4,
  'Very nice silver work. The bangle is well-crafted and the size is adjustable which is great.',
  false,
  timezone('utc'::text, now() - interval '15 days')
);

-- Create a view for products with review statistics
create or replace view products_with_reviews as
select 
  p.*,
  coalesce(r.average_rating, 0) as average_rating,
  coalesce(r.total_reviews, 0) as total_reviews
from public.products p
left join (
  select 
    product_id,
    round(avg(rating), 1) as average_rating,
    count(*) as total_reviews
  from public.product_reviews
  group by product_id
) r on p.id = r.product_id;
