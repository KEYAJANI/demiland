// Product Service for DEMILAND Frontend
// Updated to work with Express.js backend API

import imagekitService from './imagekitService.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ProductService {
  constructor() {
    this.listeners = [];
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    this.imageKit = imagekitService;
  }

  // Event listeners for product changes
  onProductChange(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  notifyListeners(action, product) {
    this.listeners.forEach(listener => {
      try {
        listener({ action, product });
      } catch (error) {
        console.error('Product listener error:', error);
      }
    });
  }

  // HTTP request helper
  async makeRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add token if available for admin operations
    const token = localStorage.getItem('demiland_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      return { 
        success: response.ok, 
        data: data.data || data, 
        message: data.message,
        status: response.status
      };

    } catch (error) {
      console.error('API Request failed:', error);
      return { 
        success: false, 
        error: error.message,
        message: error.message 
      };
    }
  }

  // Cache management
  getCached(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  clearCache() {
    this.cache.clear();
  }

  // Get all products
  async getAllProducts(params = {}) {
    console.log('📦 Fetching all products');
    
    const cacheKey = `products_${JSON.stringify(params)}`;
    const cached = this.getCached(cacheKey);
    if (cached) {
      return { success: true, data: cached };
    }

    // Build query parameters
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        queryParams.append(key, params[key]);
      }
    });

    const endpoint = `/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const result = await this.makeRequest(endpoint);

    if (result.success) {
      this.setCache(cacheKey, result.data);
      console.log(`✅ Fetched ${result.data?.length || 0} products`);
    } else {
      console.error('❌ Failed to fetch products:', result.message);
    }

    return result;
  }

  // Get product by ID
  async getProductById(id) {
    console.log('🔍 Fetching product:', id);
    
    const cacheKey = `product_${id}`;
    const cached = this.getCached(cacheKey);
    if (cached) {
      return { success: true, data: cached };
    }

    const result = await this.makeRequest(`/products/${id}`);

    if (result.success) {
      this.setCache(cacheKey, result.data);
      console.log('✅ Product fetched:', result.data?.name);
    } else {
      console.error('❌ Failed to fetch product:', result.message);
    }

    return result;
  }

  // Get featured products
  async getFeaturedProducts(limit) {
    console.log('⭐ Fetching featured products');
    
    const cacheKey = `featured_${limit || 'all'}`;
    const cached = this.getCached(cacheKey);
    if (cached) {
      return { success: true, data: cached };
    }

    const endpoint = `/products/featured${limit ? `?limit=${limit}` : ''}`;
    const result = await this.makeRequest(endpoint);

    if (result.success) {
      this.setCache(cacheKey, result.data);
      console.log(`✅ Fetched ${result.data?.length || 0} featured products`);
    } else {
      console.error('❌ Failed to fetch featured products:', result.message);
    }

    return result;
  }

  // Get products by category
  async getProductsByCategory(category, params = {}) {
    console.log('📂 Fetching products by category:', category);
    
    const cacheKey = `category_${category}_${JSON.stringify(params)}`;
    const cached = this.getCached(cacheKey);
    if (cached) {
      return { success: true, data: cached };
    }

    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        queryParams.append(key, params[key]);
      }
    });

    const endpoint = `/products/category/${category}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const result = await this.makeRequest(endpoint);

    if (result.success) {
      this.setCache(cacheKey, result.data);
      console.log(`✅ Fetched ${result.data?.length || 0} products in category ${category}`);
    } else {
      console.error('❌ Failed to fetch products by category:', result.message);
    }

    return result;
  }

  // Search products
  async searchProducts(query, filters = {}) {
    console.log('🔎 Searching products:', query);
    
    const cacheKey = `search_${query}_${JSON.stringify(filters)}`;
    const cached = this.getCached(cacheKey);
    if (cached) {
      return { success: true, data: cached };
    }

    const queryParams = new URLSearchParams({ search: query });
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null) {
        queryParams.append(key, filters[key]);
      }
    });

    const endpoint = `/products?${queryParams.toString()}`;
    const result = await this.makeRequest(endpoint);

    if (result.success) {
      this.setCache(cacheKey, result.data);
      console.log(`✅ Found ${result.data?.length || 0} products matching "${query}"`);
    } else {
      console.error('❌ Search failed:', result.message);
    }

    return result;
  }

  // Get categories
  async getCategories() {
    console.log('📂 Fetching categories');
    
    const cacheKey = 'categories';
    const cached = this.getCached(cacheKey);
    if (cached) {
      return { success: true, data: cached };
    }

    const result = await this.makeRequest('/users/categories');

    if (result.success) {
      this.setCache(cacheKey, result.data);
      console.log(`✅ Fetched ${result.data?.length || 0} categories`);
    } else {
      console.error('❌ Failed to fetch categories:', result.message);
    }

    return result;
  }

  // Admin: Create product
  async createProduct(productData) {
    console.log('➕ ProductService - Creating product:', {
      name: productData.name,
      image_url: productData.image_url,
      hasImageUrl: !!productData.image_url
    });
    
    const result = await this.makeRequest('/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });

    if (result.success) {
      console.log('✅ ProductService - Product created successfully:', {
        name: result.data?.name,
        image_url: result.data?.image_url,
        hasImageUrl: !!result.data?.image_url
      });
      this.clearCache(); // Clear cache to refresh data
      this.notifyListeners('created', result.data);
    } else {
      console.error('❌ Failed to create product:', result.message);
    }

    return result;
  }

  // Admin: Update product
  async updateProduct(id, updateData) {
    console.log('✏️ Updating product:', id);
    
    const result = await this.makeRequest(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });

    if (result.success) {
      this.clearCache(); // Clear cache to refresh data
      this.notifyListeners('updated', result.data);
      console.log('✅ Product updated:', result.data?.name);
    } else {
      console.error('❌ Failed to update product:', result.message);
    }

    return result;
  }

  // Admin: Delete product
  async deleteProduct(id) {
    console.log('🗑️ Deleting product:', id);
    
    const result = await this.makeRequest(`/products/${id}`, {
      method: 'DELETE'
    });

    if (result.success) {
      this.clearCache(); // Clear cache to refresh data
      this.notifyListeners('deleted', { id });
      console.log('✅ Product deleted');
    } else {
      console.error('❌ Failed to delete product:', result.message);
    }

    return result;
  }

  // Get related products (placeholder implementation)
  async getRelatedProducts(productId, limit = 4) {
    console.log('🔗 Fetching related products for:', productId);
    
    // For now, just get random featured products
    const result = await this.getFeaturedProducts(limit);
    return result;
  }

  // Upload product image (placeholder)
  async uploadProductImage(file, productId) {
    try {
      console.log('📸 Starting product image upload to ImageKit:', file.name);
      
      // Generate unique filename with product context
      const timestamp = Date.now();
      const fileName = `products/${productId || 'temp'}_${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      
      // Upload to ImageKit
      const uploadResult = await this.imageKit.uploadImage(file, {
        fileName: fileName,
        folder: '/products',
        tags: ['product', 'demiland'],
        useUniqueFileName: false // We're already making it unique
      });
      
      if (uploadResult.success) {
        console.log('✅ Image uploaded successfully to ImageKit:', uploadResult.data.image_url);
        return uploadResult.data.image_url; // Return the URL directly
      } else {
        console.error('❌ ImageKit upload failed:', uploadResult.message);
        throw new Error(uploadResult.message || 'Image upload failed');
      }
      
    } catch (error) {
      console.error('❌ Upload error:', error);
      throw new Error(`Image upload failed: ${error.message}`);
    }
  }

  // Polling for real-time updates (simplified implementation)
  startPolling(interval = 30000) {
    console.log('🔄 Starting product polling');
    // For now, we'll use event listeners instead of polling
    // Real-time updates would be implemented with WebSockets
  }

  stopPolling() {
    console.log('⏹️ Stopping product polling');
    // For now, just a placeholder
  }
}

// Create singleton instance
const productService = new ProductService();

export default productService;