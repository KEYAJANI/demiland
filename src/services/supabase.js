// Supabase Configuration for DEMILAND
import { createClient } from '@supabase/supabase-js';

// Supabase project configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables:', {
    url: !!supabaseUrl,
    key: !!supabaseAnonKey
  });
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

console.log('✅ Supabase configuration loaded:', {
  url: supabaseUrl,
  keyLength: supabaseAnonKey?.length
});

// Create Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: localStorage,
    flowType: 'pkce' // Use PKCE flow for better security
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  db: {
    schema: 'public'
  }
});

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
  // Get authenticated user
  getCurrentUser: () => supabase.auth.getUser(),
  
  // Get current session
  getCurrentSession: () => supabase.auth.getSession(),
  
  // Listen to auth changes
  onAuthStateChange: (callback) => supabase.auth.onAuthStateChange(callback),
  
  // Real-time subscriptions
  subscribeToTable: (table, callback, filter = '*') => {
    return supabase
      .channel(`public:${table}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: table,
        filter: filter 
      }, callback)
      .subscribe();
  },
  
  // Unsubscribe from real-time
  unsubscribe: (subscription) => {
    if (subscription) {
      supabase.removeChannel(subscription);
    }
  },
  
  // Storage helpers for product images
  uploadFile: async (bucket, path, file) => {
    return await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      });
  },
  
  getPublicUrl: (bucket, path) => {
    return supabase.storage
      .from(bucket)
      .getPublicUrl(path);
  },
  
  // Error handling helper
  handleSupabaseError: (error) => {
    console.error('Supabase Error:', error);
    
    if (error?.code === 'PGRST301') {
      return { error: 'Unauthorized access', code: 401 };
    }
    
    if (error?.code === 'PGRST116') {
      return { error: 'Record not found', code: 404 };
    }
    
    if (error?.message?.includes('duplicate key')) {
      return { error: 'Record already exists', code: 409 };
    }
    
    return { 
      error: error?.message || 'Database operation failed', 
      code: error?.code || 500 
    };
  }
};

// Auth helper functions
export const authHelpers = {
  // Sign up new user
  signUp: async (email, password, metadata = {}) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
  },
  
  // Sign in user
  signIn: async (email, password) => {
    return await supabase.auth.signInWithPassword({
      email,
      password
    });
  },
  
  // Sign out user
  signOut: async () => {
    return await supabase.auth.signOut();
  },
  
  // Reset password
  resetPassword: async (email) => {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
  },
  
  // Update user password
  updatePassword: async (newPassword) => {
    return await supabase.auth.updateUser({
      password: newPassword
    });
  },
  
  // Update user metadata
  updateUser: async (updates) => {
    return await supabase.auth.updateUser(updates);
  }
};

// Data transformation helpers
const transformProductData = (product) => {
  if (!product) return null;
  
  return {
    ...product,
    // Transform snake_case to camelCase
    inStock: product.in_stock,
    stockQuantity: product.stock_quantity,
    createdAt: product.created_at,
    updatedAt: product.updated_at,
    isActive: product.is_active,
    // Transform image to image_url for frontend consistency
    image_url: product.image,
    // Remove snake_case properties to avoid confusion
    in_stock: undefined,
    stock_quantity: undefined,
    created_at: undefined,
    updated_at: undefined,
    is_active: undefined,
    image: undefined
  };
};

// Reverse transformation for sending data to database
const transformProductDataToSnakeCase = (product) => {
  if (!product) return null;
  
  const transformed = { ...product };
  
  // Transform camelCase to snake_case for database
  if (product.inStock !== undefined) {
    transformed.in_stock = product.inStock;
    delete transformed.inStock;
  }
  if (product.stockQuantity !== undefined) {
    transformed.stock_quantity = product.stockQuantity;
    delete transformed.stockQuantity;
  }
  if (product.isActive !== undefined) {
    transformed.is_active = product.isActive;
    delete transformed.isActive;
  }
  // Transform image_url to image for database compatibility
  if (product.image_url !== undefined) {
    transformed.image = product.image_url;
    delete transformed.image_url;
  }
  
  return transformed;
};

// Product helper functions
export const productHelpers = {
  // Get all products with filters
  getAllProducts: async (filters = {}) => {
    try {
      console.log('🔍 productHelpers.getAllProducts called with filters:', filters);
      
      let query = supabase
        .from(TABLES.PRODUCTS)
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      console.log('📋 Base query created for table:', TABLES.PRODUCTS);
      
      if (filters.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
        console.log('🏷️ Added category filter:', filters.category);
      }
      
      if (filters.featured !== undefined) {
        query = query.eq('featured', filters.featured);
        console.log('⭐ Added featured filter:', filters.featured);
      }
      
      if (filters.inStock !== undefined) {
        query = query.eq('in_stock', filters.inStock);
        console.log('📦 Added inStock filter:', filters.inStock);
      }
      
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
        console.log('🔍 Added search filter:', filters.search);
      }
      
      console.log('🚀 Executing Supabase query...');
      const result = await query;
      
      console.log('📊 Raw query result:', {
        success: !result.error,
        dataLength: result.data?.length || 0,
        error: result.error,
        status: result.status,
        statusText: result.statusText
      });
      
      // Transform data if successful
      if (result.data) {
        console.log('🔄 Transforming product data...');
        result.data = result.data.map(transformProductData);
        console.log('✅ Data transformation completed');
      }
      
      return result;
    } catch (error) {
      console.error('❌ Error in productHelpers.getAllProducts:', error);
      return {
        data: null,
        error: error,
        status: 500,
        statusText: 'Internal Error'
      };
    }
  },
  
  // Get single product
  getProduct: async (id) => {
    const result = await supabase
      .from(TABLES.PRODUCTS)
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();
      
    // Transform data if successful
    if (result.data) {
      result.data = transformProductData(result.data);
    }
    
    return result;
  },
  
  // Get featured products
  getFeaturedProducts: async () => {
    const result = await supabase
      .from(TABLES.PRODUCTS)
      .select('*')
      .eq('featured', true)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
      
    // Transform data if successful
    if (result.data) {
      result.data = result.data.map(transformProductData);
    }
    
    return result;
  },
  
  // Get products by category - simplified for direct category name matching
  getProductsByCategory: async (category) => {
    console.log('🔍 getProductsByCategory called with:', category);
    
    // If 'all' category, get all products
    if (category === 'all') {
      const result = await supabase
        .from(TABLES.PRODUCTS)
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
        
      if (result.data) {
        result.data = result.data.map(transformProductData);
      }
      
      console.log('📊 All products result:', result.data?.length || 0, 'products');
      return result;
    }
    
    // For specific categories, use case-insensitive matching
    // Frontend passes lowercase (e.g., "eyes"), database stores proper case (e.g., "Eyes")
    const result = await supabase
      .from(TABLES.PRODUCTS)
      .select('*')
      .ilike('category', category) // Case-insensitive match
      .eq('is_active', true)
      .order('created_at', { ascending: false });
      
    // Transform data if successful
    if (result.data) {
      result.data = result.data.map(transformProductData);
    }
    
    console.log('📊 Category filter result:', { 
      searchCategory: category, 
      found: result.data?.length || 0, 
      products: result.data?.map(p => ({ id: p.id, name: p.name, category: p.category })) || []
    });
    
    return result;
  },
  
  // Admin: Create product
  createProduct: async (productData) => {
    const transformedData = transformProductDataToSnakeCase(productData);
    const result = await supabase
      .from(TABLES.PRODUCTS)
      .insert([transformedData])
      .select()
      .single();
      
    // Transform response data
    if (result.data) {
      result.data = transformProductData(result.data);
    }
    
    return result;
  },
  
  // Admin: Update product
  updateProduct: async (id, updates) => {
    const transformedUpdates = transformProductDataToSnakeCase(updates);
    const result = await supabase
      .from(TABLES.PRODUCTS)
      .update(transformedUpdates)
      .eq('id', id)
      .select()
      .single();
      
    // Transform response data
    if (result.data) {
      result.data = transformProductData(result.data);
    }
    
    return result;
  },
  
  // Admin: Delete product (hard delete)
  deleteProduct: async (id) => {
    return await supabase
      .from(TABLES.PRODUCTS)
      .delete()
      .eq('id', id);
  }
};

// User favorites helper functions
export const favoriteHelpers = {
  // Get user favorites
  getUserFavorites: async (userId) => {
    return await supabase
      .from(TABLES.USER_FAVORITES)
      .select(`
        product_id,
        products (*)
      `)
      .eq('user_id', userId);
  },
  
  // Add to favorites
  addToFavorites: async (userId, productId) => {
    return await supabase
      .from(TABLES.USER_FAVORITES)
      .insert([{ user_id: userId, product_id: productId }]);
  },
  
  // Remove from favorites
  removeFromFavorites: async (userId, productId) => {
    return await supabase
      .from(TABLES.USER_FAVORITES)
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);
  }
};

// Analytics helper functions
export const analyticsHelpers = {
  // Track event
  trackEvent: async (eventType, eventData = {}, userId = null) => {
    return await supabase
      .from(TABLES.ANALYTICS_EVENTS)
      .insert([{
        event_type: eventType,
        event_data: eventData,
        user_id: userId,
        ip_address: null, // Will be handled by backend
        user_agent: navigator.userAgent
      }]);
  },
  
  // Get analytics data
  getAnalytics: async (filters = {}) => {
    let query = supabase
      .from(TABLES.ANALYTICS_EVENTS)
      .select('*')
      .order('created_at', { ascending: false });
    
    if (filters.eventType) {
      query = query.eq('event_type', filters.eventType);
    }
    
    if (filters.userId) {
      query = query.eq('user_id', filters.userId);
    }
    
    return await query;
  }
};

export default supabase;