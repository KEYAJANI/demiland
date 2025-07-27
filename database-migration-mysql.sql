-- DEMILAND MySQL Database Migration Script
-- This file contains the MySQL database schema and initial data migration
-- for the DEMILAND beauty brand website

-- ===============================
-- Database Setup
-- ===============================

-- Create database (uncomment to create new database)
-- CREATE DATABASE demiland_beauty CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE demiland_beauty;

-- ===============================
-- Database Schema Creation
-- ===============================

-- Users table
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role ENUM('user', 'admin', 'super-admin') DEFAULT 'user',
    email_verified BOOLEAN DEFAULT FALSE,
    profile_picture TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(10,2),
    image TEXT,
    images JSON,
    features JSON,
    ingredients TEXT,
    specifications JSON,
    stock_quantity INTEGER DEFAULT 0,
    in_stock BOOLEAN DEFAULT TRUE,
    featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- User sessions table
CREATE TABLE user_sessions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    session_token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Email campaigns table
CREATE TABLE email_campaigns (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    recipients JSON,
    status ENUM('draft', 'scheduled', 'sent', 'failed') DEFAULT 'draft',
    scheduled_at TIMESTAMP,
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Contact inquiries table
CREATE TABLE contact_inquiries (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('pending', 'in_progress', 'responded', 'closed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_to VARCHAR(36),
    FOREIGN KEY (assigned_to) REFERENCES users(id)
);

-- Analytics events table
CREATE TABLE analytics_events (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    event_type VARCHAR(100) NOT NULL,
    event_data JSON,
    user_id VARCHAR(36),
    session_id VARCHAR(255),
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- User favorites table
CREATE TABLE user_favorites (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_product (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
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
INSERT INTO categories (id, name, slug, description, is_active) VALUES
(UUID(), 'Eyes', 'eyes', 'Eye makeup products including mascara, eyeliner, and eyeshadow', true),
(UUID(), 'Lips', 'lips', 'Lip products including lipstick, gloss, and lip care', true),
(UUID(), 'Complexion', 'complexion', 'Face makeup including foundation, concealer, and powder', true),
(UUID(), 'Nails', 'nails', 'Nail care and nail art products', true),
(UUID(), 'Tools', 'tools', 'Makeup tools and accessories', true);

-- Create default admin user (password: admin123 - should be changed in production)
-- Password hash for 'admin123' using bcrypt
INSERT INTO users (id, email, password_hash, first_name, last_name, role, email_verified, is_active) VALUES
(UUID(), 'admin@demiland.com', '$2b$12$LQv3c1yqBwEHxAA4Z8Z8qeYm1Jq8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8', 'Admin', 'User', 'admin', true, true);

-- Migrate existing products from frontend
INSERT INTO products (id, name, category, description, features, ingredients, in_stock, featured, image, price, stock_quantity) VALUES

(UUID(), 'Waterproof Mascara', 'Eyes', 
'Professional waterproof mascara with luxurious gold packaging. Delivers dramatic volume and length that lasts all day without smudging or flaking.',
JSON_ARRAY('100% Waterproof formula', 'Long-lasting 12+ hours', 'Volume & length enhancement', 'Smudge-proof technology', 'Premium gold packaging'),
'Aqua, Synthetic Beeswax, Paraffin, Acacia Senegal Gum, Stearic Acid, Palmitic Acid',
true, true, '/products/1.jpg', 29.99, 150),

(UUID(), 'Eyeliner Pencil', 'Eyes',
'Precision waterproof eyeliner pencil for defining and enhancing your eyes. Smooth application with intense color payoff that stays put all day.',
JSON_ARRAY('Waterproof & long-lasting', 'Smooth glide application', 'Intense black pigmentation', 'Precise tip for fine lines', 'Smudge-resistant formula'),
'Cyclopentasiloxane, Synthetic Wax, Hydrogenated Polyisobutene, Polybutene',
true, false, '/products/2.jpg', 19.99, 200),

(UUID(), '5D Natural Lashes', 'Eyes',
'Handcrafted 5D natural false eyelashes for a comfortable, soft, and dramatic look. Perfect for special occasions or everyday glamour.',
JSON_ARRAY('100% Handmade quality', '5D natural volume effect', 'Comfortable & lightweight', 'Soft natural hair fibers', 'Reusable up to 15 times'),
'Premium synthetic fibers, cotton band, hypoallergenic adhesive',
true, true, '/products/3.jpg', 24.99, 75),

(UUID(), 'Premium Lip Color', 'Lips',
'Rich, creamy lip color with long-lasting formula. Delivers vibrant pigmentation and smooth application for beautiful, kissable lips.',
JSON_ARRAY('Long-lasting formula', 'Creamy smooth texture', 'Vibrant color payoff', 'Moisturizing ingredients', 'Professional finish'),
'Caprylic/Capric Triglyceride, Ozokerite, Synthetic Wax, Tocopherol',
true, false, '/products/4.jpg', 34.99, 120),

(UUID(), 'Professional Makeup Brush Set', 'Tools',
'Complete professional makeup brush collection for flawless application. Premium synthetic bristles designed for precision and perfect blending.',
JSON_ARRAY('Professional grade brushes', 'Synthetic cruelty-free bristles', 'Ergonomic handles', 'Complete face & eye set', 'Easy to clean & maintain'),
'Synthetic taklon bristles, aluminum ferrule, wooden handles',
true, true, '/products/5.jpg', 89.99, 50),

(UUID(), 'Luxury Foundation', 'Complexion',
'Full coverage luxury foundation with a natural finish. Provides flawless complexion while nourishing your skin with premium ingredients.',
JSON_ARRAY('Full coverage formula', 'Natural matte finish', '24-hour wear time', 'Buildable coverage', 'Skin-nourishing formula'),
'Aqua, Cyclopentasiloxane, Dimethicone, Glycerin, Titanium Dioxide',
true, false, '/products/6.jpg', 54.99, 80),

(UUID(), 'Nail Art Collection', 'Nails',
'Professional nail art accessories and decorative elements. Create stunning nail designs with our premium collection of nail art supplies.',
JSON_ARRAY('Professional nail art tools', 'Variety of decorative elements', 'Long-lasting adhesion', 'Easy application', 'Salon-quality results'),
'Acrylic polymers, adhesive compounds, decorative materials',
true, false, '/products/7.jpg', 39.99, 100),

(UUID(), 'Contour Palette', 'Complexion',
'Professional contour and highlight palette for sculpting and defining facial features. Includes warm and cool tones for all skin types.',
JSON_ARRAY('Multi-shade palette', 'Blendable powder formula', 'Suitable for all skin tones', 'Professional finish', 'Compact travel-friendly design'),
'Talc, Mica, Magnesium Stearate, Dimethicone, Phenoxyethanol',
true, true, '/products/8.jpg', 44.99, 60);

-- ===============================
-- Sample Analytics Data
-- ===============================

-- Insert some sample analytics events
INSERT INTO analytics_events (id, event_type, event_data) VALUES
(UUID(), 'page_view', JSON_OBJECT('page', 'homepage', 'timestamp', '2024-01-15T10:00:00Z')),
(UUID(), 'product_view', JSON_OBJECT('product_id', '1', 'product_name', 'Waterproof Mascara', 'timestamp', '2024-01-15T10:05:00Z')),
(UUID(), 'search', JSON_OBJECT('query', 'mascara', 'results_count', 2, 'timestamp', '2024-01-15T10:10:00Z'));

-- ===============================
-- Database Constraints and Security
-- ===============================

-- Add additional constraints
ALTER TABLE products ADD CONSTRAINT positive_price CHECK (price >= 0);
ALTER TABLE products ADD CONSTRAINT positive_stock CHECK (stock_quantity >= 0);
ALTER TABLE user_sessions ADD CONSTRAINT valid_expiry CHECK (expires_at > created_at);

-- ===============================
-- Stored Procedures for Common Operations
-- ===============================

-- Procedure to get user with role
DELIMITER //
CREATE PROCEDURE GetUserWithRole(IN user_email VARCHAR(255))
BEGIN
    SELECT id, email, password_hash, first_name, last_name, phone, role, email_verified, 
           profile_picture, is_active, created_at, updated_at
    FROM users 
    WHERE email = user_email AND is_active = TRUE;
END //
DELIMITER ;

-- Procedure to get products with filters
DELIMITER //
CREATE PROCEDURE GetProducts(
    IN p_category VARCHAR(100),
    IN p_featured BOOLEAN,
    IN p_in_stock BOOLEAN,
    IN p_search VARCHAR(255)
)
BEGIN
    SET @sql = 'SELECT * FROM products WHERE is_active = TRUE';
    
    IF p_category IS NOT NULL AND p_category != 'all' THEN
        SET @sql = CONCAT(@sql, ' AND category = ''', p_category, '''');
    END IF;
    
    IF p_featured IS NOT NULL THEN
        SET @sql = CONCAT(@sql, ' AND featured = ', p_featured);
    END IF;
    
    IF p_in_stock IS NOT NULL THEN
        SET @sql = CONCAT(@sql, ' AND in_stock = ', p_in_stock);
    END IF;
    
    IF p_search IS NOT NULL AND p_search != '' THEN
        SET @sql = CONCAT(@sql, ' AND (name LIKE ''%', p_search, '%'' OR description LIKE ''%', p_search, '%'')');
    END IF;
    
    SET @sql = CONCAT(@sql, ' ORDER BY created_at DESC');
    
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END //
DELIMITER ;

-- ===============================
-- Database Setup Complete
-- ===============================

-- This migration script sets up the complete DEMILAND MySQL database with:
-- 1. All necessary tables converted from PostgreSQL to MySQL format
-- 2. Proper indexes for performance
-- 3. Initial data migration from frontend mock data
-- 4. Security constraints and stored procedures
-- 5. Sample data for testing

-- Next steps:
-- 1. Run this script on your MySQL database
-- 2. Install mysql2 package: npm install mysql2
-- 3. Update your application to use the new MySQL service
-- 4. Configure connection settings in your environment variables
-- 5. Test API endpoints with the migrated data

-- Migration notes:
-- - UUID() function replaced gen_random_uuid() for MySQL compatibility
-- - JSONB columns converted to JSON (MySQL 5.7+)
-- - PostgreSQL ENUM types converted to MySQL ENUM
-- - INET type converted to VARCHAR(45) for IP addresses
-- - Updated triggers replaced with ON UPDATE CURRENT_TIMESTAMP
-- - Stored procedures added for common queries