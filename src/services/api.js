// Base API configuration and utilities for DEMILAND backend integration
// Updated to work with Supabase backend
import { supabase, dbHelpers } from './supabase.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = this.getStoredToken();
    this.useSupabase = true; // Flag to use Supabase instead of REST API
  }

  // Token management
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('demiland_token', token);
    } else {
      localStorage.removeItem('demiland_token');
    }
  }

  getStoredToken() {
    return localStorage.getItem('demiland_token');
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('demiland_token');
  }

  // Base request method with JWT handling
  // Updated to work with both Supabase and traditional REST API
  async request(endpoint, options = {}) {
    // If using Supabase, delegate to Supabase methods
    if (this.useSupabase) {
      return this.handleSupabaseRequest(endpoint, options);
    }

    // Traditional REST API handling (fallback)
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add JWT token if available
    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);
      
      // Handle different response types
      if (!response.ok) {
        // Handle authentication errors
        if (response.status === 401) {
          this.clearToken();
          // Redirect to login or refresh token
          throw new Error('Authentication required');
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP Error: ${response.status}`);
      }

      // Handle empty responses
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return response;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Handle Supabase requests
  async handleSupabaseRequest(endpoint, options = {}) {
    try {
      // Map REST API endpoints to Supabase operations
      const { method = 'GET', body } = options;
      
      // For Supabase, we'll return a standard API response format
      const createResponse = (data, error = null) => ({
        success: !error,
        data: error ? null : data,
        error: error ? error.message : null,
        message: error ? error.message : 'Success'
      });

      // Basic endpoint routing - this will be expanded as needed
      if (endpoint.startsWith('/auth/')) {
        return createResponse(null, new Error('Auth endpoints handled by authService'));
      }

      if (endpoint.startsWith('/products')) {
        return createResponse(null, new Error('Product endpoints handled by productService'));
      }

      // Default fallback to traditional REST
      this.useSupabase = false;
      const result = await this.request(endpoint, options);
      this.useSupabase = true;
      return result;

    } catch (error) {
      console.error('Supabase request failed:', error);
      return {
        success: false,
        data: null,
        error: error.message,
        message: error.message
      };
    }
  }

  // HTTP Methods
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // File upload method
  async upload(endpoint, formData) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      method: 'POST',
      body: formData,
      headers: {},
    };

    // Add JWT token if available (don't set Content-Type for FormData)
    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        if (response.status === 401) {
          this.clearToken();
          throw new Error('Authentication required');
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;

// Export commonly used HTTP methods for convenience
export const { get, post, put, patch, delete: del, upload } = apiService;

// Export for direct access to the service instance
export { apiService };