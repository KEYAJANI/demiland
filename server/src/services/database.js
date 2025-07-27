// MySQL Configuration for DEMILAND Backend
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// MySQL connection configuration
const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  port: process.env.MYSQL_PORT || 3306,
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'demiland_beauty',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
};

if (!dbConfig.host || !dbConfig.database) {
  console.error('❌ Missing MySQL environment variables:', {
    host: !!dbConfig.host,
    database: !!dbConfig.database,
    user: !!dbConfig.user
  });
  throw new Error('Missing MySQL environment variables. Please check your .env.local file.');
}

console.log('✅ MySQL configuration loaded:', {
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.database,
  user: dbConfig.user
});

// Create connection pool
let connectionPool;

try {
  connectionPool = mysql.createPool(dbConfig);
  console.log('✅ MySQL connection pool created successfully');
} catch (error) {
  console.error('❌ Failed to create MySQL connection pool:', error);
  throw error;
}

// Database table names (matching your migration schema)
export const TABLES = {
  USERS: 'users',
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  USER_SESSIONS: 'user_sessions',
  USER_FAVORITES: 'user_favorites',
  CONTACT_INQUIRIES: 'contact_inquiries',
  EMAIL_CAMPAIGNS: 'email_campaigns',
  ANALYTICS_EVENTS: 'analytics_events'
};

// Database helper functions
export const dbHelpers = {
  // Get database connection from pool
  getConnection: async () => {
    try {
      return await connectionPool.getConnection();
    } catch (error) {
      console.error('❌ Failed to get database connection:', error);
      throw error;
    }
  },

  // Execute query with connection handling
  query: async (sql, params = []) => {
    let connection;
    try {
      connection = await connectionPool.getConnection();
      const [results, fields] = await connection.execute(sql, params);
      return { data: results, error: null };
    } catch (error) {
      console.error('❌ Database query error:', error);
      return { data: null, error };
    } finally {
      if (connection) connection.release();
    }
  },

  // Execute multiple queries in transaction
  transaction: async (queries) => {
    let connection;
    try {
      connection = await connectionPool.getConnection();
      await connection.beginTransaction();
      
      const results = [];
      for (const { sql, params } of queries) {
        const [result] = await connection.execute(sql, params);
        results.push(result);
      }
      
      await connection.commit();
      return { data: results, error: null };
    } catch (error) {
      if (connection) await connection.rollback();
      console.error('❌ Transaction error:', error);
      return { data: null, error };
    } finally {
      if (connection) connection.release();
    }
  },

  // Generate UUID (MySQL compatible)
  generateUUID: () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },

  // Error handling helper
  handleDatabaseError: (error) => {
    console.error('MySQL Error:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return { error: 'Record already exists', code: 409 };
    }
    
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return { error: 'Referenced record not found', code: 404 };
    }
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      return { error: 'Database access denied', code: 401 };
    }
    
    if (error.code === 'ECONNREFUSED') {
      return { error: 'Database connection refused', code: 503 };
    }
    
    return { 
      error: error.message || 'Database operation failed', 
      code: error.errno || 500 
    };
  }
};

// Auth helper functions
export const authHelpers = {
  // Hash password
  hashPassword: async (password) => {
    return await bcrypt.hash(password, 12);
  },

  // Verify password
  verifyPassword: async (password, hash) => {
    return await bcrypt.compare(password, hash);
  },

  // Create user
  createUser: async (userData) => {
    const id = dbHelpers.generateUUID();
    const hashedPassword = await authHelpers.hashPassword(userData.password);
    
    const sql = `
      INSERT INTO ${TABLES.USERS} 
      (id, email, password_hash, first_name, last_name, phone, role, email_verified, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      id,
      userData.email,
      hashedPassword,
      userData.firstName || userData.first_name,
      userData.lastName || userData.last_name,
      userData.phone || null,
      userData.role || 'user',
      true, // Email verification disabled
      true
    ];
    
    const result = await dbHelpers.query(sql, params);
    
    if (result.error) {
      return result;
    }
    
    // Return created user without password
    const userResult = await authHelpers.getUserById(id);
    return userResult;
  },

  // Get user by email
  getUserByEmail: async (email) => {
    const sql = `
      SELECT id, email, password_hash, first_name, last_name, phone, role, 
             email_verified, profile_picture, is_active, created_at, updated_at
      FROM ${TABLES.USERS} 
      WHERE email = ? AND is_active = TRUE
    `;
    
    const result = await dbHelpers.query(sql, [email]);
    
    if (result.error) {
      return result;
    }
    
    return {
      data: result.data.length > 0 ? result.data[0] : null,
      error: null
    };
  },

  // Get user by ID
  getUserById: async (id) => {
    const sql = `
      SELECT id, email, first_name, last_name, phone, role, 
             email_verified, profile_picture, is_active, created_at, updated_at
      FROM ${TABLES.USERS} 
      WHERE id = ? AND is_active = TRUE
    `;
    
    const result = await dbHelpers.query(sql, [id]);
    
    if (result.error) {
      return result;
    }
    
    return {
      data: result.data.length > 0 ? result.data[0] : null,
      error: null
    };
  },

  // Update user
  updateUser: async (id, updates) => {
    const fields = [];
    const params = [];
    
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined && key !== 'id') {
        fields.push(`${key} = ?`);
        params.push(updates[key]);
      }
    });
    
    if (fields.length === 0) {
      return { data: null, error: new Error('No fields to update') };
    }
    
    params.push(id);
    
    const sql = `
      UPDATE ${TABLES.USERS} 
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    const result = await dbHelpers.query(sql, params);
    
    if (result.error) {
      return result;
    }
    
    // Return updated user
    return await authHelpers.getUserById(id);
  },

  // Create session
  createSession: async (userId, sessionToken, expiresAt) => {
    const id = dbHelpers.generateUUID();
    
    const sql = `
      INSERT INTO ${TABLES.USER_SESSIONS} 
      (id, user_id, session_token, expires_at, ip_address, user_agent)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      id,
      userId,
      sessionToken,
      expiresAt,
      null, // IP address would be set by backend
      typeof navigator !== 'undefined' ? navigator.userAgent : null
    ];
    
    return await dbHelpers.query(sql, params);
  },

  // Get valid session
  getSession: async (sessionToken) => {
    const sql = `
      SELECT s.*, u.email, u.first_name, u.last_name, u.role
      FROM ${TABLES.USER_SESSIONS} s
      JOIN ${TABLES.USERS} u ON s.user_id = u.id
      WHERE s.session_token = ? AND s.expires_at > NOW() AND u.is_active = TRUE
    `;
    
    const result = await dbHelpers.query(sql, [sessionToken]);
    
    if (result.error) {
      return result;
    }
    
    return {
      data: result.data.length > 0 ? result.data[0] : null,
      error: null
    };
  },

  // Delete session
  deleteSession: async (sessionToken) => {
    const sql = `DELETE FROM ${TABLES.USER_SESSIONS} WHERE session_token = ?`;
    return await dbHelpers.query(sql, [sessionToken]);
  },

  // Clean expired sessions
  cleanExpiredSessions: async () => {
    const sql = `DELETE FROM ${TABLES.USER_SESSIONS} WHERE expires_at <= NOW()`;
    return await dbHelpers.query(sql);
  },

  // Authenticate user (login)
  authenticateUser: async (email, password) => {
    try {
      console.log('🔐 authHelpers.authenticateUser called for:', email);
      
      // Get user by email
      const userResult = await authHelpers.getUserByEmail(email);
      if (userResult.error || !userResult.data) {
        console.log('❌ User not found:', email);
        return { data: null, error: new Error('Invalid email or password') };
      }
      
      const user = userResult.data;
      
      // Verify password
      const passwordValid = await authHelpers.verifyPassword(password, user.password_hash);
      if (!passwordValid) {
        console.log('❌ Invalid password for user:', email);
        return { data: null, error: new Error('Invalid email or password') };
      }
      
      // Check if user is active
      if (!user.is_active) {
        console.log('❌ User account is inactive:', email);
        return { data: null, error: new Error('Account is inactive') };
      }
      
      // Remove password hash from returned data
      const { password_hash, ...userWithoutPassword } = user;
      
      console.log('✅ Authentication successful for:', email, 'Role:', user.role);
      return { data: userWithoutPassword, error: null };
      
    } catch (error) {
      console.error('❌ authenticateUser error:', error);
      return { data: null, error };
    }
  },

  // Update last login timestamp
  updateLastLogin: async (userId) => {
    try {
      const sql = `UPDATE ${TABLES.USERS} SET updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
      const result = await dbHelpers.query(sql, [userId]);
      
      if (result.error) {
        console.error('❌ Failed to update last login:', result.error);
        return result;
      }
      
      console.log('✅ Last login updated for user:', userId);
      return { data: true, error: null };
      
    } catch (error) {
      console.error('❌ updateLastLogin error:', error);
      return { data: null, error };
    }
  },

  // Change password
  changePassword: async (userId, currentPassword, newPassword) => {
    try {
      console.log('🔒 Changing password for user:', userId);
      
      // Get user to verify current password
      const userResult = await authHelpers.getUserById(userId);
      if (userResult.error || !userResult.data) {
        return { data: null, error: new Error('User not found') };
      }
      
      // Verify current password
      const passwordValid = await authHelpers.verifyPassword(currentPassword, userResult.data.password_hash);
      if (!passwordValid) {
        return { data: null, error: new Error('Current password is incorrect') };
      }
      
      // Hash new password
      const newPasswordHash = await authHelpers.hashPassword(newPassword);
      
      // Update password
      const sql = `UPDATE ${TABLES.USERS} SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
      const result = await dbHelpers.query(sql, [newPasswordHash, userId]);
      
      if (result.error) {
        return result;
      }
      
      console.log('✅ Password changed successfully for user:', userId);
      return { data: true, error: null };
      
    } catch (error) {
      console.error('❌ changePassword error:', error);
      return { data: null, error };
    }
  },

  // Get all users (admin function)
  getAllUsers: async () => {
    try {
      console.log('🔍 authHelpers.getAllUsers called');
      
      const sql = `SELECT id, email, first_name, last_name, phone, role, email_verified, is_active, created_at, updated_at 
                   FROM ${TABLES.USERS} 
                   ORDER BY created_at DESC`;
      
      const result = await dbHelpers.query(sql);
      
      if (result.error) {
        console.error('❌ Failed to get all users:', result.error);
        return result;
      }
      
      // Format users data for frontend compatibility
      const formattedUsers = result.data.map(user => ({
        id: user.id,
        email: user.email,
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
        role: user.role || 'user',
        email_verified: !!user.email_verified,
        is_active: !!user.is_active,
        created_at: user.created_at,
        updated_at: user.updated_at,
        // Additional fields for dashboard compatibility
        name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unknown User',
        joinDate: new Date(user.created_at).toISOString().split('T')[0],
        status: user.is_active ? 'active' : 'inactive'
      }));
      
      console.log(`✅ Retrieved ${formattedUsers.length} users`);
      return { data: formattedUsers, error: null };
      
    } catch (error) {
      console.error('❌ getAllUsers error:', error);
      return { data: null, error };
    }
  },

  // Hard delete user (removes from database completely)
  deleteUser: async (id) => {
    try {
      console.log('🗑️ Hard deleting user:', id);
      
      // First, delete related data to avoid foreign key constraints
      // Delete user favorites
      const deleteFavoritesSQL = `DELETE FROM ${TABLES.USER_FAVORITES} WHERE user_id = ?`;
      await dbHelpers.query(deleteFavoritesSQL, [id]);
      console.log('✅ User favorites deleted');
      
      // Delete user sessions (if any)
      const deleteSessionsSQL = `DELETE FROM ${TABLES.USER_SESSIONS} WHERE user_id = ?`;
      await dbHelpers.query(deleteSessionsSQL, [id]);
      console.log('✅ User sessions deleted');
      
      // Finally, delete the user
      const deleteUserSQL = `DELETE FROM ${TABLES.USERS} WHERE id = ?`;
      const result = await dbHelpers.query(deleteUserSQL, [id]);
      
      if (result.error) {
        console.error('❌ Failed to delete user:', result.error);
        return result;
      }
      
      if (result.data.affectedRows === 0) {
        return { data: null, error: new Error('User not found') };
      }
      
      console.log('✅ User hard deleted successfully');
      return { data: { deleted: true, affectedRows: result.data.affectedRows }, error: null };
      
    } catch (error) {
      console.error('❌ deleteUser error:', error);
      return { data: null, error };
    }
  }
};

// Data transformation helpers (maintaining compatibility with existing frontend)
const transformProductData = (product) => {
  if (!product) return null;
  
  console.log('🔄 transformProductData - Input product:', {
    id: product.id,
    name: product.name,
    image: product.image,
    hasImageData: !!product.image
  });
  
  const transformed = {
    ...product,
    // Parse JSON fields if they're strings
    images: typeof product.images === 'string' ? JSON.parse(product.images || '[]') : (product.images || []),
    features: typeof product.features === 'string' ? JSON.parse(product.features || '[]') : (product.features || []),
    specifications: typeof product.specifications === 'string' ? JSON.parse(product.specifications || '{}') : (product.specifications || {}),
    // Convert MySQL TINYINT to proper JavaScript booleans
    featured: !!product.featured,
    inStock: !!product.in_stock,
    isActive: !!product.is_active,
    // Maintain camelCase compatibility
    stockQuantity: product.stock_quantity,
    createdAt: product.created_at,
    updatedAt: product.updated_at,
    image_url: product.image, // Frontend expects image_url
  };
  
  console.log('✅ transformProductData - Output product:', {
    id: transformed.id,
    name: transformed.name,
    image_url: transformed.image_url,
    hasImageUrl: !!transformed.image_url
  });
  
  return transformed;
};

// Product helper functions
export const productHelpers = {
  // Get all products with filters
  getAllProducts: async (filters = {}) => {
    try {
      console.log('🔍 productHelpers.getAllProducts called with filters:', filters);
      
      let sql = `SELECT * FROM ${TABLES.PRODUCTS} WHERE is_active = TRUE`;
      const params = [];
      
      if (filters.category && filters.category !== 'all') {
        sql += ` AND category = ?`;
        params.push(filters.category);
      }
      
      if (filters.featured !== undefined) {
        sql += ` AND featured = ?`;
        params.push(filters.featured);
      }
      
      if (filters.inStock !== undefined) {
        sql += ` AND in_stock = ?`;
        params.push(filters.inStock);
      }
      
      if (filters.search) {
        sql += ` AND (name LIKE ? OR description LIKE ?)`;
        params.push(`%${filters.search}%`, `%${filters.search}%`);
      }
      
      sql += ` ORDER BY created_at DESC`;
      
      console.log('🚀 Executing MySQL query:', sql, params);
      const result = await dbHelpers.query(sql, params);
      
      if (result.error) {
        console.error('❌ MySQL query error:', result.error);
        return result;
      }
      
      // Transform data for frontend compatibility
      const transformedData = result.data.map(transformProductData);
      
      console.log('✅ Products loaded successfully:', {
        count: transformedData.length,
        firstProduct: transformedData[0]?.name || 'No products'
      });
      
      return {
        data: transformedData,
        error: null
      };
    } catch (error) {
      console.error('❌ Error in productHelpers.getAllProducts:', error);
      return {
        data: null,
        error: error
      };
    }
  },

  // Get single product
  getProduct: async (id) => {
    const sql = `SELECT * FROM ${TABLES.PRODUCTS} WHERE id = ? AND is_active = TRUE`;
    const result = await dbHelpers.query(sql, [id]);
    
    if (result.error) {
      return result;
    }
    
    return {
      data: result.data.length > 0 ? transformProductData(result.data[0]) : null,
      error: null
    };
  },

  // Get featured products
  getFeaturedProducts: async () => {
    const sql = `SELECT * FROM ${TABLES.PRODUCTS} WHERE featured = TRUE AND is_active = TRUE ORDER BY created_at DESC`;
    const result = await dbHelpers.query(sql);
    
    if (result.error) {
      return result;
    }
    
    return {
      data: result.data.map(transformProductData),
      error: null
    };
  },

  // Get products by category
  getProductsByCategory: async (category) => {
    if (category === 'all') {
      return await productHelpers.getAllProducts();
    }
    
    const sql = `SELECT * FROM ${TABLES.PRODUCTS} WHERE category LIKE ? AND is_active = TRUE ORDER BY created_at DESC`;
    const result = await dbHelpers.query(sql, [`%${category}%`]);
    
    if (result.error) {
      return result;
    }
    
    return {
      data: result.data.map(transformProductData),
      error: null
    };
  },

  // Create product
  createProduct: async (productData) => {
    const id = dbHelpers.generateUUID();
    
    console.log('🔍 createProduct - Received productData:', {
      name: productData.name,
      image: productData.image,
      image_url: productData.image_url,
      hasImageData: !!(productData.image || productData.image_url)
    });
    
    const imageUrl = productData.image || productData.image_url;
    console.log('🖼️ createProduct - Saving image URL to database:', imageUrl);
    
    const sql = `
      INSERT INTO ${TABLES.PRODUCTS} 
      (id, name, description, category, price, image, images, features, ingredients, 
       specifications, stock_quantity, in_stock, featured, is_active, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      id,
      productData.name,
      productData.description,
      productData.category,
      productData.price || null,
      imageUrl,
      JSON.stringify(productData.images || []),
      JSON.stringify(productData.features || []),
      productData.ingredients,
      JSON.stringify(productData.specifications || {}),
      productData.stockQuantity || productData.stock_quantity || 0,
      productData.inStock !== undefined ? productData.inStock : (productData.in_stock !== undefined ? productData.in_stock : true),
      productData.featured || false,
      productData.isActive !== undefined ? productData.isActive : (productData.is_active !== undefined ? productData.is_active : true),
      productData.created_by || null
    ];
    
    const result = await dbHelpers.query(sql, params);
    
    if (result.error) {
      return result;
    }
    
    // Return created product
    return await productHelpers.getProduct(id);
  },

  // Update product
  updateProduct: async (id, updates) => {
    const fields = [];
    const params = [];
    
    // Map frontend field names to database field names
    const fieldMapping = {
      inStock: 'in_stock',
      stockQuantity: 'stock_quantity',
      isActive: 'is_active',
      image_url: 'image'
    };
    
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined && key !== 'id') {
        const dbField = fieldMapping[key] || key;
        
        if (['images', 'features', 'specifications'].includes(dbField)) {
          fields.push(`${dbField} = ?`);
          params.push(JSON.stringify(updates[key]));
        } else {
          fields.push(`${dbField} = ?`);
          params.push(updates[key]);
        }
      }
    });
    
    if (fields.length === 0) {
      return { data: null, error: new Error('No fields to update') };
    }
    
    params.push(id);
    
    const sql = `
      UPDATE ${TABLES.PRODUCTS} 
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    const result = await dbHelpers.query(sql, params);
    
    if (result.error) {
      return result;
    }
    
    // Return updated product
    return await productHelpers.getProduct(id);
  },

  // Delete product
  deleteProduct: async (id) => {
    const sql = `DELETE FROM ${TABLES.PRODUCTS} WHERE id = ?`;
    return await dbHelpers.query(sql, [id]);
  },

  // Get all categories
  getAllCategories: async () => {
    try {
      console.log('📂 productHelpers.getAllCategories called');
      
      const sql = `SELECT * FROM ${TABLES.CATEGORIES} ORDER BY name ASC`;
      const result = await dbHelpers.query(sql, []);
      
      if (result.error) {
        console.error('❌ Failed to fetch categories:', result.error);
        return result;
      }
      
      console.log(`✅ Categories loaded successfully: { count: ${result.data?.length || 0} }`);
      return result;
      
    } catch (error) {
      console.error('❌ getAllCategories error:', error);
      return { data: null, error };
    }
  }
};

// User favorites helper functions
export const favoriteHelpers = {
  // Get user favorites
  getUserFavorites: async (userId) => {
    const sql = `
      SELECT f.product_id, p.*
      FROM ${TABLES.USER_FAVORITES} f
      JOIN ${TABLES.PRODUCTS} p ON f.product_id = p.id
      WHERE f.user_id = ? AND p.is_active = TRUE
    `;
    
    const result = await dbHelpers.query(sql, [userId]);
    
    if (result.error) {
      return result;
    }
    
    return {
      data: result.data.map(row => ({
        product_id: row.product_id,
        products: transformProductData(row)
      })),
      error: null
    };
  },

  // Add to favorites
  addToFavorites: async (userId, productId) => {
    const id = dbHelpers.generateUUID();
    const sql = `INSERT INTO ${TABLES.USER_FAVORITES} (id, user_id, product_id) VALUES (?, ?, ?)`;
    return await dbHelpers.query(sql, [id, userId, productId]);
  },

  // Remove from favorites
  removeFromFavorites: async (userId, productId) => {
    const sql = `DELETE FROM ${TABLES.USER_FAVORITES} WHERE user_id = ? AND product_id = ?`;
    return await dbHelpers.query(sql, [userId, productId]);
  }
};

// Analytics helper functions
export const analyticsHelpers = {
  // Track event
  trackEvent: async (eventType, eventData = {}, userId = null) => {
    const id = dbHelpers.generateUUID();
    const sql = `
      INSERT INTO ${TABLES.ANALYTICS_EVENTS} 
      (id, event_type, event_data, user_id, ip_address, user_agent)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      id,
      eventType,
      JSON.stringify(eventData),
      userId,
      null, // IP address would be set by backend
      typeof navigator !== 'undefined' ? navigator.userAgent : null
    ];
    
    return await dbHelpers.query(sql, params);
  },

  // Get analytics data
  getAnalytics: async (filters = {}) => {
    let sql = `SELECT * FROM ${TABLES.ANALYTICS_EVENTS} ORDER BY created_at DESC`;
    const params = [];
    
    if (filters.eventType) {
      sql = `SELECT * FROM ${TABLES.ANALYTICS_EVENTS} WHERE event_type = ? ORDER BY created_at DESC`;
      params.push(filters.eventType);
    }
    
    if (filters.userId) {
      if (params.length > 0) {
        sql = sql.replace('ORDER BY', 'AND user_id = ? ORDER BY');
      } else {
        sql = `SELECT * FROM ${TABLES.ANALYTICS_EVENTS} WHERE user_id = ? ORDER BY created_at DESC`;
      }
      params.push(filters.userId);
    }
    
    const result = await dbHelpers.query(sql, params);
    
    if (result.error) {
      return result;
    }
    
    // Parse JSON data
    return {
      data: result.data.map(row => ({
        ...row,
        event_data: typeof row.event_data === 'string' ? JSON.parse(row.event_data) : row.event_data
      })),
      error: null
    };
  }
};

// Test database connection
export const testConnection = async () => {
  try {
    const result = await dbHelpers.query('SELECT 1 as test');
    if (result.error) {
      throw result.error;
    }
    console.log('✅ MySQL database connection test successful');
    return { success: true, message: 'Database connection successful' };
  } catch (error) {
    console.error('❌ MySQL database connection test failed:', error);
    return { success: false, error: error.message };
  }
};

export default {
  connectionPool,
  TABLES,
  dbHelpers,
  authHelpers,
  productHelpers,
  favoriteHelpers,
  analyticsHelpers,
  testConnection
};