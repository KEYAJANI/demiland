// Authentication Service for DEMILAND Frontend
// Updated to work with Express.js backend API

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class AuthService {
  constructor() {
    this.token = this.getStoredToken();
    this.user = this.getStoredUser();
    this.listeners = [];
  }

  // Event listeners for auth state changes
  onAuthChange(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  notifyListeners(action, user = null) {
    this.listeners.forEach(listener => {
      try {
        listener({ action, user });
      } catch (error) {
        console.error('Auth listener error:', error);
      }
    });
  }

  // Token management
  getStoredToken() {
    return localStorage.getItem('demiland_token');
  }

  getStoredUser() {
    const userData = localStorage.getItem('demiland_user');
    return userData ? JSON.parse(userData) : null;
  }

  setAuthData(token, user) {
    this.token = token;
    this.user = user;
    localStorage.setItem('demiland_token', token);
    localStorage.setItem('demiland_user', JSON.stringify(user));
  }

  clearAuthData() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('demiland_token');
    localStorage.removeItem('demiland_user');
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

    // Add token if available
    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      // Handle token expiration
      if (response.status === 403 && data.message?.includes('token')) {
        this.clearAuthData();
        this.notifyListeners('logout');
        throw new Error('Session expired. Please login again.');
      }

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

  // Initialize auth service
  async initialize() {
    console.log('🔄 Initializing AuthService...');
    
    // If we have stored token and user, verify token validity
    if (this.token && this.user) {
      try {
        const result = await this.makeRequest('/auth/verify');
        if (result.success) {
          console.log('✅ Token verified, user authenticated');
          return true;
        } else {
          console.log('❌ Token invalid, clearing auth data');
          this.clearAuthData();
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        this.clearAuthData();
      }
    }

    console.log('ℹ️  No valid authentication found');
    return false;
  }

  // Register new user
  async register(userData) {
    console.log('📝 Registering user:', userData.email);
    
    const result = await this.makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName || userData.first_name,
        lastName: userData.lastName || userData.last_name
      })
    });

    if (result.success && result.data) {
      const { user, token } = result.data;
      this.setAuthData(token, user);
      this.notifyListeners('register', user);
      
      console.log('✅ Registration successful:', user.email);
      return { success: true, data: user, message: result.message };
    }

    console.error('❌ Registration failed:', result.message);
    return result;
  }

  // Login user
  async login(credentials) {
    console.log('🔐 Logging in user:', credentials.email);
    
    const result = await this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password
      })
    });

    if (result.success && result.data) {
      const { user, token } = result.data;
      this.setAuthData(token, user);
      this.notifyListeners('login', user);
      
      console.log('✅ Login successful:', user.email);
      return { success: true, data: user, message: result.message };
    }

    console.error('❌ Login failed:', result.message);
    return result;
  }

  // Logout user
  async logout() {
    console.log('👋 Logging out user');
    
    this.clearAuthData();
    this.notifyListeners('logout');
    
    return { success: true, message: 'Logged out successfully' };
  }

  // Get current user
  getCurrentUser() {
    return this.user;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!(this.token && this.user);
  }

  // Check if user is admin
  isAdmin() {
    return this.user && (this.user.role === 'admin' || this.user.role === 'super-admin');
  }

  // Check if user has specific role
  hasRole(role) {
    return this.user && this.user.role === role;
  }

  // Update user profile
  async updateUserProfile(profileData) {
    console.log('📝 Updating user profile');
    
    const result = await this.makeRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });

    if (result.success && result.data) {
      // Update stored user data
      this.user = result.data;
      localStorage.setItem('demiland_user', JSON.stringify(this.user));
      
      console.log('✅ Profile updated successfully');
      return { success: true, data: result.data, message: result.message };
    }

    console.error('❌ Profile update failed:', result.message);
    return result;
  }

  // Change password
  async changePassword(passwordData) {
    console.log('🔒 Changing password');
    
    const result = await this.makeRequest('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })
    });

    if (result.success) {
      console.log('✅ Password changed successfully');
    } else {
      console.error('❌ Password change failed:', result.message);
    }

    return result;
  }

  // Upload profile picture
  async uploadProfilePicture(file) {
    console.log('📸 Profile picture upload not implemented yet');
    return { 
      success: false, 
      message: 'Profile picture upload will be implemented in future version' 
    };
  }

  // Request password reset
  async requestPasswordReset(email) {
    console.log('🔄 Password reset not implemented yet');
    return { 
      success: false, 
      message: 'Password reset will be implemented in future version' 
    };
  }

  // Reset password
  async resetPassword(token, newPassword) {
    console.log('🔄 Password reset not implemented yet');
    return { 
      success: false, 
      message: 'Password reset will be implemented in future version' 
    };
  }
}

// Create singleton instance
const authService = new AuthService();

export default authService;