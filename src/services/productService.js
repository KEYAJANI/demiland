import apiService from './api.js';
import { supabase, productHelpers, TABLES } from './supabase.js';
// Mock data removed - using Supabase only

// Product Service for DEMILAND - handles all product-related API calls
// Updated to work with Supabase
class ProductService {
  constructor() {
    this.useSupabase = true; // Use Supabase by default
  }
  // Get all products (for frontend product page)
  async getAllProducts(params = {}) {
    if (this.useSupabase) {
      try {
        console.log('🛍️ ProductService.getAllProducts called with params:', params);
        
        const filters = {
          category: params.category,
          featured: params.featured,
          inStock: params.inStock,
          search: params.search
        };
        
        console.log('🔍 Calling productHelpers.getAllProducts with filters:', filters);
        
        const { data, error } = await productHelpers.getAllProducts(filters);
        
        console.log('📊 Raw Supabase response:', { data, error });
        
        if (error) {
          console.error('❌ Supabase error in getAllProducts:', error);
          console.error('❌ Error details:', {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint
          });
          
          return {
            success: false,
            data: [],
            message: `Database error: ${error.message || 'Failed to load products'}`
          };
        }
        
        console.log('✅ Products loaded successfully:', {
          count: data?.length || 0,
          firstProduct: data?.[0]?.name || 'No products'
        });
        
        return {
          success: true,
          data: data || [],
          message: 'Products loaded successfully'
        };
      } catch (error) {
        console.error('❌ Unexpected error in getAllProducts:', error);
        console.error('❌ Error stack:', error.stack);
        
        return {
          success: false,
          data: [],
          message: `Unexpected error: ${error.message || 'Failed to load products'}`
        };
      }
    }

    // Fallback to traditional API
    try {
      const queryParams = new URLSearchParams();
      
      // Add pagination
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      
      // Add search
      if (params.search) queryParams.append('search', params.search);
      
      // Add category filter
      if (params.category && params.category !== 'all') {
        queryParams.append('category', params.category);
      }
      
      // Add other filters
      if (params.minPrice) queryParams.append('minPrice', params.minPrice);
      if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice);
      if (params.inStock !== undefined) queryParams.append('inStock', params.inStock);
      if (params.featured !== undefined) queryParams.append('featured', params.featured);
      
      const queryString = queryParams.toString();
      const endpoint = `/products${queryString ? `?${queryString}` : ''}`;
      
      return await apiService.get(endpoint);
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  // Get single product by ID
  async getProductById(id) {
    if (this.useSupabase) {
      try {
        const { data, error } = await productHelpers.getProduct(id);
        
        if (error) {
          console.error('Supabase error:', error);
          return {
            success: false,
            data: null,
            message: error.message || 'Product not found'
          };
        }
        
        return {
          success: true,
          data,
          message: 'Product loaded successfully'
        };
      } catch (error) {
        console.error('Supabase error:', error);
        return {
          success: false,
          data: null,
          message: error.message || 'Product not found'
        };
      }
    }

    // Fallback to traditional API
    try {
      return await apiService.get(`/products/${id}`);
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  // Get featured products
  async getFeaturedProducts() {
    if (this.useSupabase) {
      try {
        const { data, error } = await productHelpers.getFeaturedProducts();
        
        if (error) {
          console.error('Supabase error:', error);
          return {
            success: false,
            data: [],
            message: error.message || 'Failed to load featured products'
          };
        }
        
        return {
          success: true,
          data: data || [],
          message: 'Featured products loaded successfully'
        };
      } catch (error) {
        console.error('Supabase error:', error);
        return {
          success: false,
          data: [],
          message: error.message || 'Failed to load featured products'
        };
      }
    }

    // Fallback to traditional API
    try {
      return await apiService.get('/products?featured=true');
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
  }

  // Get products by category
  async getProductsByCategory(category) {
    if (this.useSupabase) {
      try {
        if (category === 'all') {
          return await this.getAllProducts();
        }
        
        const { data, error } = await productHelpers.getProductsByCategory(category);
        
        if (error) {
          console.error('Supabase error:', error);
          return {
            success: false,
            data: [],
            message: error.message || 'Failed to load products'
          };
        }
        
        return {
          success: true,
          data: data || [],
          message: 'Products loaded successfully'
        };
      } catch (error) {
        console.error('Supabase error:', error);
        return {
          success: false,
          data: [],
          message: error.message || 'Failed to load products'
        };
      }
    }

    // Fallback to traditional API
    try {
      if (category === 'all') {
        return await this.getAllProducts();
      }
      return await apiService.get(`/products?category=${category}`);
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  }

  // Get related products (for product detail page)
  async getRelatedProducts(productId, category, limit = 4) {
    try {
      return await apiService.get(`/products/related/${productId}?category=${category}&limit=${limit}`);
    } catch (error) {
      console.error('Error fetching related products:', error);
      throw error;
    }
  }

  // Search products
  async searchProducts(query, filters = {}) {
    try {
      const params = {
        search: query,
        ...filters
      };
      return await this.getAllProducts(params);
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }

  // ADMIN OPERATIONS - Create, Update, Delete products
  
  // Create new product (Admin Dashboard)
  async createProduct(productData) {
    if (this.useSupabase) {
      try {
        console.log('🛍️ Creating product with Supabase:', productData);
        const { data, error } = await productHelpers.createProduct(productData);
        
        if (error) {
          console.error('❌ Supabase create product error:', error);
          throw new Error(error.message);
        }
        
        console.log('✅ Product created successfully:', data);
        
        // Trigger real-time update to frontend
        this.notifyProductChange('created', data);
        
        return {
          success: true,
          data: data,
          message: 'Product created successfully'
        };
      } catch (error) {
        console.error('Error creating product with Supabase:', error);
        throw error;
      }
    }
    
    // Fallback to API service
    try {
      const response = await apiService.post('/admin/products', productData);
      
      // Trigger real-time update to frontend
      this.notifyProductChange('created', response.data);
      
      return response;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  // Update existing product (Admin Dashboard)
  async updateProduct(id, productData) {
    if (this.useSupabase) {
      try {
        console.log('🛍️ Updating product with Supabase:', id, productData);
        const { data, error } = await productHelpers.updateProduct(id, productData);
        
        if (error) {
          console.error('❌ Supabase update product error:', error);
          throw new Error(error.message);
        }
        
        console.log('✅ Product updated successfully:', data);
        
        // Trigger real-time update to frontend
        this.notifyProductChange('updated', data);
        
        return {
          success: true,
          data: data,
          message: 'Product updated successfully'
        };
      } catch (error) {
        console.error('Error updating product with Supabase:', error);
        throw error;
      }
    }
    
    // Fallback to API service
    try {
      const response = await apiService.put(`/admin/products/${id}`, productData);
      
      // Trigger real-time update to frontend
      this.notifyProductChange('updated', response.data);
      
      return response;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  // Delete product (Admin Dashboard)
  async deleteProduct(id) {
    if (this.useSupabase) {
      try {
        console.log('🛍️ Deleting product with Supabase:', id);
        const { error } = await productHelpers.deleteProduct(id);
        
        if (error) {
          console.error('❌ Supabase delete product error:', error);
          throw new Error(error.message);
        }
        
        console.log('✅ Product deleted successfully:', id);
        
        // Trigger real-time update to frontend
        this.notifyProductChange('deleted', { id });
        
        return {
          success: true,
          message: 'Product deleted successfully'
        };
      } catch (error) {
        console.error('Error deleting product with Supabase:', error);
        throw error;
      }
    }
    
    // Fallback to API service
    try {
      const response = await apiService.delete(`/admin/products/${id}`);
      
      // Trigger real-time update to frontend
      this.notifyProductChange('deleted', { id });
      
      return response;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  // Upload product image using ImageKit.io
  async uploadProductImage(file, productId = null) {
    try {
      console.log('🖼️ Uploading product image to ImageKit.io:', file.name);
      
      // Import ImageKit service
      const imagekitService = (await import('./imagekitService.js')).default;
      
      // Upload to ImageKit.io
      const result = await imagekitService.uploadImage(file, {
        folder: '/products'
      });
      
      if (result.success) {
        console.log('✅ Image uploaded successfully to ImageKit:', result.data.image_url);
        return result;
      } else {
        throw new Error(result.message || 'Failed to upload to ImageKit');
      }
      
    } catch (error) {
      console.error('Error uploading image to ImageKit:', error);
      
      // Fallback to API service if ImageKit fails
      try {
        console.log('🔄 Falling back to API service for image upload...');
        const formData = new FormData();
        formData.append('image', file);
        if (productId) {
          formData.append('productId', productId);
        }
        
        return await apiService.upload('/admin/products/upload-image', formData);
      } catch (fallbackError) {
        console.error('Both ImageKit and API fallback failed:', fallbackError);
        throw new Error('Failed to upload image: ' + (error.message || 'Unknown error'));
      }
    }
  }

  // Get product categories
  async getCategories() {
    if (this.useSupabase) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('name');
        
        if (error) {
          console.error('Supabase error:', error);
          return {
            success: false,
            data: [],
            message: error.message || 'Failed to load categories'
          };
        }
        
        return {
          success: true,
          data: data || [],
          message: 'Categories loaded successfully'
        };
      } catch (error) {
        console.error('Supabase error:', error);
        return {
          success: false,
          data: [],
          message: error.message || 'Failed to load categories'
        };
      }
    }

    // Fallback to traditional API
    try {
      return await apiService.get('/categories');
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  // Real-time product synchronization
  notifyProductChange(action, productData) {
    // Dispatch custom event for real-time updates
    const event = new CustomEvent('productChange', {
      detail: { action, product: productData }
    });
    window.dispatchEvent(event);
  }

  // Listen for product changes (used by ProductContext)
  onProductChange(callback) {
    const handler = (event) => {
      callback(event.detail);
    };
    window.addEventListener('productChange', handler);
    
    // Return cleanup function
    return () => {
      window.removeEventListener('productChange', handler);
    };
  }

  // BULK OPERATIONS
  
  // Bulk update products (Admin Dashboard)
  async bulkUpdateProducts(productIds, updateData) {
    try {
      return await apiService.patch('/admin/products/bulk-update', {
        ids: productIds,
        data: updateData
      });
    } catch (error) {
      console.error('Error bulk updating products:', error);
      throw error;
    }
  }

  // Bulk delete products (Admin Dashboard)
  async bulkDeleteProducts(productIds) {
    try {
      const response = await apiService.delete('/admin/products/bulk-delete', {
        body: JSON.stringify({ ids: productIds }),
        headers: { 'Content-Type': 'application/json' }
      });
      
      // Trigger real-time update for each deleted product
      productIds.forEach(id => {
        this.notifyProductChange('deleted', { id });
      });
      
      return response;
    } catch (error) {
      console.error('Error bulk deleting products:', error);
      throw error;
    }
  }

  // INVENTORY MANAGEMENT
  
  // Update product stock
  async updateProductStock(id, quantity) {
    try {
      const response = await apiService.patch(`/admin/products/${id}/stock`, {
        quantity,
        inStock: quantity > 0
      });
      
      // Trigger real-time update
      this.notifyProductChange('updated', response.data);
      
      return response;
    } catch (error) {
      console.error('Error updating product stock:', error);
      throw error;
    }
  }

  // Get low stock products
  async getLowStockProducts(threshold = 10) {
    try {
      return await apiService.get(`/admin/products/low-stock?threshold=${threshold}`);
    } catch (error) {
      console.error('Error fetching low stock products:', error);
      throw error;
    }
  }

  // ANALYTICS
  
  // Get product analytics
  async getProductAnalytics(productId, period = '30d') {
    try {
      return await apiService.get(`/admin/products/${productId}/analytics?period=${period}`);
    } catch (error) {
      console.error('Error fetching product analytics:', error);
      throw error;
    }
  }

  // Get top selling products
  async getTopSellingProducts(limit = 10) {
    try {
      return await apiService.get(`/admin/products/top-selling?limit=${limit}`);
    } catch (error) {
      console.error('Error fetching top selling products:', error);
      throw error;
    }
  }
}

// Create singleton instance
const productService = new ProductService();

export default productService;

// Export specific methods for convenience
export const {
  getAllProducts,
  getProductById,
  getFeaturedProducts,
  getProductsByCategory,
  getRelatedProducts,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  getCategories,
  onProductChange
} = productService;