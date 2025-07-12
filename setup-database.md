# DEMILAND Database Setup with Supabase

## 🎯 Database Migration Steps

### 1. Access your Supabase Dashboard
Go to: https://supabase.com/dashboard/project/gxnyzbwulktlzokgcbdy

### 2. Navigate to SQL Editor
- Click on "SQL Editor" in the left sidebar
- Create a new query

### 3. Run the Database Migration
Copy and paste the contents of `database-migration.sql` into the SQL editor and execute it.

### 4. Import Product Data
After the schema is created, you can import the product data from `product-data-migration.json` using the following SQL:

```sql
-- Import DEMILAND products from JSON data
INSERT INTO products (name, category, description, features, ingredients, in_stock, featured, image, price, stock_quantity) VALUES
('Waterproof Mascara', 'Eyes', 
'Professional waterproof mascara with luxurious gold packaging. Delivers dramatic volume and length that lasts all day without smudging or flaking.',
'["100% Waterproof formula", "Long-lasting 12+ hours", "Volume & length enhancement", "Smudge-proof technology", "Premium gold packaging"]',
'Aqua, Synthetic Beeswax, Paraffin, Acacia Senegal Gum, Stearic Acid, Palmitic Acid',
true, true, '/products/1.jpg', 29.99, 150),

('Eyeliner Pencil', 'Eyes',
'Precision waterproof eyeliner pencil for defining and enhancing your eyes. Smooth application with intense color payoff that stays put all day.',
'["Waterproof & long-lasting", "Smooth glide application", "Intense black pigmentation", "Precise tip for fine lines", "Smudge-resistant formula"]',
'Cyclopentasiloxane, Synthetic Wax, Hydrogenated Polyisobutene, Polybutene',
true, false, '/products/2.jpg', 19.99, 200),

('5D Natural Lashes', 'Eyes',
'Handcrafted 5D natural false eyelashes for a comfortable, soft, and dramatic look. Perfect for special occasions or everyday glamour.',
'["100% Handmade quality", "5D natural volume effect", "Comfortable & lightweight", "Soft natural hair fibers", "Reusable up to 15 times"]',
'Premium synthetic fibers, cotton band, hypoallergenic adhesive',
true, true, '/products/3.jpg', 24.99, 75),

('Premium Lip Color', 'Lips',
'Rich, creamy lip color with long-lasting formula. Delivers vibrant pigmentation and smooth application for beautiful, kissable lips.',
'["Long-lasting formula", "Creamy smooth texture", "Vibrant color payoff", "Moisturizing ingredients", "Professional finish"]',
'Caprylic/Capric Triglyceride, Ozokerite, Synthetic Wax, Tocopherol',
true, false, '/products/4.jpg', 34.99, 120),

('Professional Makeup Brush Set', 'Tools',
'Complete professional makeup brush collection for flawless application. Premium synthetic bristles designed for precision and perfect blending.',
'["Professional grade brushes", "Synthetic cruelty-free bristles", "Ergonomic handles", "Complete face & eye set", "Easy to clean & maintain"]',
'Synthetic taklon bristles, aluminum ferrule, wooden handles',
true, true, '/products/5.jpg', 89.99, 50),

('Luxury Foundation', 'Complexion',
'Full coverage luxury foundation with a natural finish. Provides flawless complexion while nourishing your skin with premium ingredients.',
'["Full coverage formula", "Natural matte finish", "24-hour wear time", "Buildable coverage", "Skin-nourishing formula"]',
'Aqua, Cyclopentasiloxane, Dimethicone, Glycerin, Titanium Dioxide',
true, false, '/products/6.jpg', 54.99, 80),

('Nail Art Collection', 'Nails',
'Professional nail art accessories and decorative elements. Create stunning nail designs with our premium collection of nail art supplies.',
'["Professional nail art tools", "Variety of decorative elements", "Long-lasting adhesion", "Easy application", "Salon-quality results"]',
'Acrylic polymers, adhesive compounds, decorative materials',
true, false, '/products/7.jpg', 39.99, 100),

('Contour Palette', 'Complexion',
'Professional contour and highlight palette for sculpting and defining facial features. Includes warm and cool tones for all skin types.',
'["Multi-shade palette", "Blendable powder formula", "Suitable for all skin tones", "Professional finish", "Compact travel-friendly design"]',
'Talc, Mica, Magnesium Stearate, Dimethicone, Phenoxyethanol',
true, true, '/products/8.jpg', 44.99, 60);
```

### 5. Enable Row Level Security (RLS)
After importing the data, enable RLS policies:

```sql
-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Allow public read access to products and categories
CREATE POLICY "Public products are viewable by everyone" ON products
FOR SELECT USING (is_active = true);

CREATE POLICY "Public categories are viewable by everyone" ON categories
FOR SELECT USING (is_active = true);

-- Users can only see and edit their own data
CREATE POLICY "Users can view own profile" ON users
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
FOR UPDATE USING (auth.uid() = id);

-- Users can manage their own favorites
CREATE POLICY "Users can view own favorites" ON user_favorites
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites" ON user_favorites
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" ON user_favorites
FOR DELETE USING (auth.uid() = user_id);

-- Admin policies for product management
CREATE POLICY "Admins can manage products" ON products
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role IN ('admin', 'super-admin')
  )
);
```

### 6. Set up Storage for Product Images
1. Go to Storage in your Supabase dashboard
2. Create a new bucket called "product-images"
3. Set it to public access for product photos
4. Upload your product images from the `/products/` folder

### 7. Test the Integration
Once everything is set up:
1. Start your development server: `npm run dev`
2. Test user registration and login
3. Verify products are loading from Supabase
4. Check admin dashboard functionality

## 🔧 Environment Variables Required
Make sure your `.env.local` file contains:
```env
VITE_SUPABASE_URL=https://gxnyzbwulktlzokgcbdy.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## 🎉 Success!
Your DEMILAND application is now connected to Supabase with:
- ✅ User authentication
- ✅ Product management
- ✅ Real-time updates
- ✅ Secure data access
- ✅ Admin functionality

The frontend will automatically fall back to mock data if Supabase is unavailable, ensuring your app always works!