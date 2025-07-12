-- DEMILAND Database Migration Script
-- This file contains the database schema and initial data migration
-- for the DEMILAND beauty brand website

-- ===============================
-- Database Schema Creation
-- ===============================

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super-admin')),
    email_verified BOOLEAN DEFAULT FALSE,
    profile_picture TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(10,2),
    image TEXT,
    images JSONB DEFAULT '[]',
    features JSONB DEFAULT '[]',
    ingredients TEXT,
    specifications JSONB DEFAULT '{}',
    stock_quantity INTEGER DEFAULT 0,
    in_stock BOOLEAN DEFAULT TRUE,
    featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

-- User sessions table
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    user_agent TEXT
);

-- Email campaigns table
CREATE TABLE email_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    recipients JSONB DEFAULT '[]',
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sent', 'failed')),
    scheduled_at TIMESTAMP,
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

-- Contact inquiries table
CREATE TABLE contact_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'responded', 'closed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_to UUID REFERENCES users(id)
);

-- Analytics events table
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB DEFAULT '{}',
    user_id UUID REFERENCES users(id),
    session_id VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User favorites table
CREATE TABLE user_favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);

-- ===============================
-- Indexes for Performance
-- ===============================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_created ON analytics_events(created_at);

-- ===============================
-- Initial Data Migration
-- ===============================

-- Insert default categories
INSERT INTO categories (name, slug, description, is_active) VALUES
('Eyes', 'eyes', 'Eye makeup products including mascara, eyeliner, and eyeshadow', true),
('Lips', 'lips', 'Lip products including lipstick, gloss, and lip care', true),
('Complexion', 'complexion', 'Face makeup including foundation, concealer, and powder', true),
('Nails', 'nails', 'Nail care and nail art products', true),
('Tools', 'tools', 'Makeup tools and accessories', true);

-- Create default admin user (password: admin123 - should be changed in production)
INSERT INTO users (email, password_hash, first_name, last_name, role, email_verified, is_active) VALUES
('admin@demiland.com', '$2b$12$LQv3c1yqBwEHxAA4Z8Z8qeYm1Jq8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8', 'Admin', 'User', 'admin', true, true);

-- Migrate existing products from frontend
INSERT INTO products (name, category, description, features, ingredients, in_stock, featured, image) VALUES

('Waterproof Mascara', 'Eyes', 
'Professional waterproof mascara with luxurious gold packaging. Delivers dramatic volume and length that lasts all day without smudging or flaking.',
'["100% Waterproof formula", "Long-lasting 12+ hours", "Volume & length enhancement", "Smudge-proof technology", "Premium gold packaging"]',
'Aqua, Synthetic Beeswax, Paraffin, Acacia Senegal Gum, Stearic Acid, Palmitic Acid',
true, true, '/products/1.jpg'),

('Eyeliner Pencil', 'Eyes',
'Precision waterproof eyeliner pencil for defining and enhancing your eyes. Smooth application with intense color payoff that stays put all day.',
'["Waterproof & long-lasting", "Smooth glide application", "Intense black pigmentation", "Precise tip for fine lines", "Smudge-resistant formula"]',
'Cyclopentasiloxane, Synthetic Wax, Hydrogenated Polyisobutene, Polybutene',
true, false, '/products/2.jpg'),

('5D Natural Lashes', 'Eyes',
'Handcrafted 5D natural false eyelashes for a comfortable, soft, and dramatic look. Perfect for special occasions or everyday glamour.',
'["100% Handmade quality", "5D natural volume effect", "Comfortable & lightweight", "Soft natural hair fibers", "Reusable up to 15 times"]',
'Premium synthetic fibers, cotton band, hypoallergenic adhesive',
true, true, '/products/3.jpg'),

('Premium Lip Color', 'Lips',
'Rich, creamy lip color with long-lasting formula. Delivers vibrant pigmentation and smooth application for beautiful, kissable lips.',
'["Long-lasting formula", "Creamy smooth texture", "Vibrant color payoff", "Moisturizing ingredients", "Professional finish"]',
'Caprylic/Capric Triglyceride, Ozokerite, Synthetic Wax, Tocopherol',
true, false, '/products/4.jpg'),

('Professional Makeup Brush Set', 'Tools',
'Complete professional makeup brush collection for flawless application. Premium synthetic bristles designed for precision and perfect blending.',
'["Professional grade brushes", "Synthetic cruelty-free bristles", "Ergonomic handles", "Complete face & eye set", "Easy to clean & maintain"]',
'Synthetic taklon bristles, aluminum ferrule, wooden handles',
true, true, '/products/5.jpg'),

('Luxury Foundation', 'Complexion',
'Full coverage luxury foundation with a natural finish. Provides flawless complexion while nourishing your skin with premium ingredients.',
'["Full coverage formula", "Natural matte finish", "24-hour wear time", "Buildable coverage", "Skin-nourishing formula"]',
'Aqua, Cyclopentasiloxane, Dimethicone, Glycerin, Titanium Dioxide',
true, false, '/products/6.jpg'),

('Nail Art Collection', 'Nails',
'Professional nail art accessories and decorative elements. Create stunning nail designs with our premium collection of nail art supplies.',
'["Professional nail art tools", "Variety of decorative elements", "Long-lasting adhesion", "Easy application", "Salon-quality results"]',
'Acrylic polymers, adhesive compounds, decorative materials',
true, false, '/products/7.jpg'),

('Contour Palette', 'Complexion',
'Professional contour and highlight palette for sculpting and defining facial features. Includes warm and cool tones for all skin types.',
'["Multi-shade palette", "Blendable powder formula", "Suitable for all skin tones", "Professional finish", "Compact travel-friendly design"]',
'Talc, Mica, Magnesium Stearate, Dimethicone, Phenoxyethanol',
true, true, '/products/8.jpg');

-- ===============================
-- Triggers for Updated Timestamps
-- ===============================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updating timestamps
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===============================
-- Sample Analytics Data
-- ===============================

-- Insert some sample analytics events
INSERT INTO analytics_events (event_type, event_data) VALUES
('page_view', '{"page": "homepage", "timestamp": "2024-01-15T10:00:00Z"}'),
('product_view', '{"product_id": 1, "product_name": "Waterproof Mascara", "timestamp": "2024-01-15T10:05:00Z"}'),
('search', '{"query": "mascara", "results_count": 2, "timestamp": "2024-01-15T10:10:00Z"}');

-- ===============================
-- Database Constraints and Security
-- ===============================

-- Add additional constraints
ALTER TABLE products ADD CONSTRAINT positive_price CHECK (price >= 0);
ALTER TABLE products ADD CONSTRAINT positive_stock CHECK (stock_quantity >= 0);
ALTER TABLE user_sessions ADD CONSTRAINT valid_expiry CHECK (expires_at > created_at);

-- Create database user for application (replace with actual credentials)
-- CREATE USER demiland_app WITH PASSWORD 'secure_password_here';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO demiland_app;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO demiland_app;

-- ===============================
-- Database Setup Complete
-- ===============================

-- This migration script sets up the complete DEMILAND database with:
-- 1. All necessary tables for users, products, analytics, and CRM
-- 2. Proper indexes for performance
-- 3. Initial data migration from frontend mock data
-- 4. Security constraints and triggers
-- 5. Sample data for testing

-- Next steps:
-- 1. Run this script on your PostgreSQL database
-- 2. Set up your Flask backend with these table structures
-- 3. Configure connection settings in your backend
-- 4. Test API endpoints with the migrated data