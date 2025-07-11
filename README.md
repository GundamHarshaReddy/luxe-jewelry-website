# LUXE & LUSH - Jewelry E-commerce Website

A modern, elegant jewelry e-commerce website built with React, TypeScript, Tailwind CSS, and Supabase backend.

## Features

- 🏠 **Home Page** - Hero section with featured products
- 💍 **Products** - Complete product catalog with detailed views
- 🛒 **Shopping Cart** - Floating mini-cart with YouTube-style popup
- 🔍 **Search** - Real-time product search functionality
- 📱 **Responsive** - Mobile-first design
- ⚡ **Fast** - Built with Vite for optimal performance
- 🎨 **Modern UI** - Clean, minimal design with Tailwind CSS

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Build Tool**: Vite
- **Deployment**: Vercel
- **Animation**: Framer Motion
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/GundamHarshaReddy/luxe-jewelry-website.git
cd luxe-jewelry-website
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the environment template:

```bash
cp .env.example .env.local
```

Update `.env.local` with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key  
VITE_SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 4. Set Up Supabase Database

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL migration in your Supabase SQL editor:

```sql
-- Copy and paste the contents of supabase/migrations/20250711_products_table.sql
```

This will create:
- `products` table with sample data
- Proper indexing for performance
- Row Level Security (RLS) policies
- Auto-updating timestamp triggers

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the website.

## Database Schema

### Products Table

- `id` (UUID, Primary Key)
- `name` (Text, Required)
- `description` (Text)
- `price` (Decimal, Required)
- `images` (Text Array)
- `stock` (Integer)
- `materials` (Text Array)
- `gemstones` (Text Array) 
- `sizes` (Text Array)
- `is_featured` (Boolean)
- `specifications` (JSONB)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Functions

The project includes a complete API service layer (`src/lib/productService.ts`) with:

- `getAllProducts()` - Fetch all products
- `getFeaturedProducts()` - Fetch featured products only
- `getProductById(id)` - Fetch single product
- `createProduct(data)` - Create new product (Admin)
- `updateProduct(data)` - Update existing product (Admin)
- `deleteProduct(id)` - Delete product (Admin)
- `updateStock(id, stock)` - Update product stock
- `searchProducts(query)` - Search products by name/description

## Component Structure

```
src/
├── components/
│   ├── cart/
│   │   └── MiniCart.tsx          # Floating cart popup
│   ├── home/
│   │   ├── Hero.tsx              # Landing page hero
│   │   ├── FeaturedProducts.tsx  # Featured products section
│   │   └── Contact.tsx           # Contact section
│   ├── layout/
│   │   └── Header.tsx            # Navigation with search
│   ├── products/
│   │   ├── ProductCard.tsx       # Product card component
│   │   ├── ProductGrid.tsx       # Product grid layout
│   │   └── ProductModal.tsx      # Product quick view
│   └── ui/
│       ├── Button.tsx            # Reusable button component
│       └── Input.tsx             # Reusable input component
├── contexts/
│   └── CartContext.tsx           # Shopping cart state management
├── hooks/
│   └── useProducts.ts            # Product data hooks
├── lib/
│   ├── supabase.ts              # Supabase client configuration
│   └── productService.ts        # API service layer
├── pages/
│   ├── HomePage.tsx             # Home page
│   ├── ProductsPage.tsx         # Products listing page
│   ├── ProductDetailsPage.tsx   # Individual product page
│   └── ContactPage.tsx          # Contact page
└── types/
    └── index.ts                 # TypeScript type definitions
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Environment Variables for Production

Make sure to add these in your Vercel dashboard:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SUPABASE_SERVICE_ROLE_KEY`

## Future Enhancements

### Admin Panel (Planned)
- Product management (CRUD operations)
- Order management
- Customer management
- Analytics dashboard
- Inventory tracking

### Payment Integration (Planned)
- Razorpay integration
- Order processing
- Payment confirmation
- Invoice generation

### Additional Features (Planned)
- User authentication
- Customer reviews
- Wishlist functionality
- Email notifications
- Advanced filtering/sorting

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@luxeandlush.com or create an issue in the GitHub repository.
