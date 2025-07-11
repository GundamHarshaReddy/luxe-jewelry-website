-- Create products table
create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price decimal(10,2) not null,
  images text[] default '{}',
  stock integer default 0,
  materials text[] default '{}',
  gemstones text[] default '{}',
  sizes text[] default '{}',
  is_featured boolean default false,
  specifications jsonb default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create an index on created_at for better performance
create index if not exists products_created_at_idx on public.products(created_at desc);

-- Create an index on is_featured for featured products
create index if not exists products_featured_idx on public.products(is_featured) where is_featured = true;

-- Enable RLS (Row Level Security)
alter table public.products enable row level security;

-- Create policies for products
create policy "Products are viewable by everyone" on public.products
  for select using (true);

-- Create policy for admin operations (you can modify this based on your auth setup)
create policy "Products can be inserted by authenticated users" on public.products
  for insert with check (true);

create policy "Products can be updated by authenticated users" on public.products
  for update using (true);

create policy "Products can be deleted by authenticated users" on public.products
  for delete using (true);

-- Create a function to automatically update the updated_at column
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create trigger to automatically update updated_at
create trigger handle_products_updated_at
  before update on public.products
  for each row
  execute function public.handle_updated_at();

-- Insert some sample products
insert into public.products (name, description, price, images, stock, materials, gemstones, sizes, is_featured, specifications) values
(
  'Diamond Solitaire Ring',
  'Elegant diamond solitaire ring with platinum band. Perfect for engagements and special occasions.',
  125000.00,
  ARRAY['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400'],
  15,
  ARRAY['Platinum', '18K Gold'],
  ARRAY['Diamond'],
  ARRAY['6', '7', '8', '9', '10'],
  true,
  '{"carat": "1.5", "cut": "Round", "clarity": "VS1", "color": "F"}'::jsonb
),
(
  'Pearl Necklace',
  'Classic pearl necklace with lustrous freshwater pearls. Timeless elegance for any occasion.',
  45000.00,
  ARRAY['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400', 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400'],
  25,
  ARRAY['Sterling Silver', 'Freshwater Pearls'],
  ARRAY['Pearl'],
  ARRAY['16"', '18"', '20"'],
  true,
  '{"pearl_type": "Freshwater", "pearl_size": "8-9mm", "clasp": "Sterling Silver"}'::jsonb
),
(
  'Gold Tennis Bracelet',
  'Stunning tennis bracelet featuring brilliant cut diamonds set in 18K yellow gold.',
  85000.00,
  ARRAY['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400'],
  10,
  ARRAY['18K Gold'],
  ARRAY['Diamond'],
  ARRAY['7"', '7.5"', '8"'],
  false,
  '{"total_carat": "5.0", "diamond_count": "50", "setting": "Prong"}'::jsonb
),
(
  'Emerald Drop Earrings',
  'Exquisite emerald drop earrings with diamond accents in white gold setting.',
  95000.00,
  ARRAY['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400', 'https://images.unsplash.com/photo-1588444837495-c6cfeb53ee55?w=400'],
  8,
  ARRAY['18K White Gold'],
  ARRAY['Emerald', 'Diamond'],
  ARRAY['One Size'],
  true,
  '{"emerald_carat": "3.0", "diamond_carat": "0.5", "origin": "Colombian"}'::jsonb
),
(
  'Sapphire Pendant',
  'Royal blue sapphire pendant with halo of diamonds on a delicate gold chain.',
  65000.00,
  ARRAY['https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400', 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400'],
  12,
  ARRAY['18K Gold'],
  ARRAY['Sapphire', 'Diamond'],
  ARRAY['16"', '18"'],
  false,
  '{"sapphire_carat": "2.5", "origin": "Ceylon", "chain_length": "18 inches"}'::jsonb
),
(
  'Wedding Band Set',
  'Matching wedding band set with intricate designs and diamond accents.',
  55000.00,
  ARRAY['https://images.unsplash.com/photo-1589674781759-c21c37956a44?w=400', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400'],
  20,
  ARRAY['18K Gold', 'Platinum'],
  ARRAY['Diamond'],
  ARRAY['5', '6', '7', '8', '9', '10'],
  true,
  '{"set_pieces": "2", "total_diamonds": "20", "band_width": "3mm"}'::jsonb
);
