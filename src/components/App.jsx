import React, { useState, createContext, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';
import productService from '../services/productService.js';
import authService from '../services/authService.js';
// MySQL-based authentication - no Supabase dependency

// Import all page components
import Homepage from './Homepage';
import ShopPage from './ShopPage';
import AboutPage from './AboutPage';
import ContactPage from './ContactPage';
import AuthPage from './AuthPage';
import AdminDashboard from './AdminDashboard';
import ProductDetail from './ProductDetail';
import UserProfile from './UserProfile';
import Navbar from './Navbar';
import Footer from './Footer';
import AdminButton from './AdminButton';

// Create contexts for global state management
const AuthContext = createContext();
const ProductContext = createContext();
const UIContext = createContext();

// PWA Detection utility
const isPWA = () => {
  return window.matchMedia('(display-mode: standalone)').matches || 
         window.navigator.standalone === true ||
         document.referrer.includes('android-app://');
};

// Auth Context Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('user'); // 'user', 'admin', 'super-admin'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  // Initialize authentication state - INSTANT, no delays
  const initializeAuth = () => {
    console.log('🚀 Starting instant auth initialization');
    
    // ALWAYS set up auth listener first - regardless of cached user
    setupAuthListener();
    
    // Instantly restore user from localStorage - no async delays
    const cachedUser = localStorage.getItem('demiland_user');
    
    if (cachedUser) {
      try {
        const parsedUser = JSON.parse(cachedUser);
        console.log('⚡ Instantly restoring user from cache:', parsedUser);
        console.log('🔧 Auth Debug - Cached user role:', parsedUser.role);
        console.log('🔧 Auth Debug - Is admin?', parsedUser.role === 'admin' || parsedUser.role === 'super-admin');
        setUser(parsedUser);
        setIsLoggedIn(true);
        setUserRole(parsedUser.role || 'user');
        setLoading(false); // User is instantly available - no loading state
        
        // Optionally validate session in background (less aggressive)
        setTimeout(() => validateSessionInBackground(parsedUser), 2000);
        return; // Exit early - user is instantly logged in
      } catch (error) {
        console.error('Failed to parse cached user:', error);
        localStorage.removeItem('demiland_user'); // Clean up invalid cache
      }
    }
    
    // Only if no cached user, start async initialization
    setLoading(true);
    performAsyncAuthInitialization();
  };
  
  // Set up auth listener - extracted so it runs ALWAYS
  const setupAuthListener = () => {
    console.log('🎧 Setting up auth state listener...');
    
    // Set up auth state listener
    authService.onAuthChange(({ action, user: authUser }) => {
      console.log('🔄 Auth state changed in React:', action, authUser);
      
      if (action === 'login' || action === 'register') {
        console.log('✅ Processing login/register in React:', authUser);
        console.log('🔐 User role from authService:', authUser?.role);
        
        // Use functional updates to avoid stale closure issues
        setUser(() => {
          console.log('📝 Setting user state:', authUser);
          return authUser;
        });
        
        setIsLoggedIn(() => {
          console.log('📝 Setting isLoggedIn to true');
          return true;
        });
        
        setUserRole(() => {
          const role = authUser?.role || 'user';
          console.log('📝 Setting userRole state:', role);
          return role;
        });
        
        setError(() => {
          console.log('📝 Clearing error state');
          return null;
        });
        
        // Cache user in localStorage for refresh persistence
        if (authUser) {
          localStorage.setItem('demiland_user', JSON.stringify(authUser));
          console.log('💾 Cached user to localStorage with role:', authUser.role);
        }
        
        console.log('🏠 User login state update complete');
        
        // Force a slight delay to ensure state propagation
        setTimeout(() => {
          console.log('🔍 Post-login state check - should be logged in now');
        }, 100);
        
      } else if (action === 'logout') {
        console.log('👋 Processing logout in React');
        
        setUser(() => {
          console.log('📝 Clearing user state');
          return null;
        });
        
        setIsLoggedIn(() => {
          console.log('📝 Setting isLoggedIn to false');
          return false;
        });
        
        setUserRole(() => {
          console.log('📝 Resetting userRole to user');
          return 'user';
        });
        
        setError(() => {
          console.log('📝 Clearing error state');
          return null;
        });
        
        localStorage.removeItem('demiland_user');
        console.log('🏠 User logout state update complete');
      }
    });
    
    console.log('✅ Auth listener setup complete');
  };
  
  // Background validation - very gentle and non-disruptive
  const validateSessionInBackground = async (cachedUser) => {
    try {
      console.log('🔄 Gentle background session check...');
      
      // Use MySQL auth service to check current session
      const currentUser = authService.getCurrentUser();
      
      if (currentUser && currentUser.role !== cachedUser.role) {
        console.log('📊 Role updated in background:', currentUser.role);
        const updatedUser = { ...cachedUser, role: currentUser.role };
        setUser(updatedUser);
        setUserRole(currentUser.role);
        localStorage.setItem('demiland_user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.log('ℹ️ Background validation skipped due to:', error.message);
      // Completely ignore background validation errors
    }
  };
  
  // Only for users without cached data
  const performAsyncAuthInitialization = async () => {
    try {
      const isInitialized = await authService.initialize();
      if (isInitialized) {
        const currentUser = authService.getCurrentUser();
        console.log('🔄 Auth service initialized with user:', currentUser);
        setUser(currentUser);
        setIsLoggedIn(true);
        setUserRole(currentUser.role || 'user');
      } else {
        setUser(null);
        setIsLoggedIn(false);
        setUserRole('user');
      }
      
      // Auth listener is already set up in setupAuthListener()
      console.log('📱 Async auth initialization complete - listener already active');
      
    } catch (error) {
      console.error('Auth initialization failed:', error);
      setError('Authentication initialization failed');
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(credentials);
      if (response.success) {
        // User state will be set by auth listener
        return response;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.register(userData);
      if (response.success) {
        // User state will be set by auth listener
        return response;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Registration failed:', error);
      setError(error.message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setIsLoggedIn(false);
      setUserRole('user');
      setError(null);
      localStorage.removeItem('demiland_user'); // Ensure cache is cleared
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout fails, clear local state
      setUser(null);
      setIsLoggedIn(false);
      setUserRole('user');
      localStorage.removeItem('demiland_user'); // Ensure cache is cleared
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateUserProfile = async (profileData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.updateUserProfile(profileData);
      if (response.success) {
        const updatedUser = { ...user, ...response.data };
        setUser(updatedUser);
        return response;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Profile update failed:', error);
      setError(error.message || 'Profile update failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const changePassword = async (passwordData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.changePassword(passwordData);
      if (response.success) {
        return response;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Password change failed:', error);
      setError(error.message || 'Password change failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Upload profile picture
  const uploadProfilePicture = async (file) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.uploadProfilePicture(file);
      if (response.success) {
        setUser(prev => ({
          ...prev,
          profile_picture: response.data.profile_picture
        }));
        return response;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Profile picture upload failed:', error);
      setError(error.message || 'Profile picture upload failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return user && user.role === role;
  };

  // Check if user is admin
  const isAdmin = () => {
    return hasRole('admin') || hasRole('super-admin');
  };

  // Request password reset
  const requestPasswordReset = async (email) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.requestPasswordReset(email);
      return response;
    } catch (error) {
      console.error('Password reset request failed:', error);
      setError(error.message || 'Password reset request failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (token, newPassword) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.resetPassword(token, newPassword);
      return response;
    } catch (error) {
      console.error('Password reset failed:', error);
      setError(error.message || 'Password reset failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Email verification methods removed - users are automatically logged in after registration

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn,
      userRole,
      loading,
      error,
      login,
      register,
      logout,
      updateUserProfile,
      changePassword,
      uploadProfilePicture,
      hasRole,
      isAdmin,
      requestPasswordReset,
      resetPassword,
      setUser,
      setError
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Product Context Provider
export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: [0, 200],
    brand: 'all',
    rating: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize products and categories on mount
  useEffect(() => {
    loadProducts();
    loadCategories();
    
    // Set up real-time product updates
    const unsubscribe = productService.onProductChange(handleProductChange);
    return unsubscribe;
  }, []);

  // Load products from Supabase only
  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.getAllProducts();
      if (response.success) {
        setProducts(response.data || []);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Failed to load products from Supabase:', error);
      setProducts([]);
      setError('Failed to load products. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // Load categories from Supabase only
  const loadCategories = async () => {
    try {
      const response = await productService.getCategories();
      if (response.success) {
        setCategories(response.data || []);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Failed to load categories from Supabase:', error);
      setCategories([]);
    }
  };

  // Handle real-time product changes
  const handleProductChange = ({ action, product }) => {
    setProducts(prevProducts => {
      switch (action) {
        case 'created':
          return [...prevProducts, product];
        case 'updated':
          return prevProducts.map(p => p.id === product.id ? product : p);
        case 'deleted':
          return prevProducts.filter(p => p.id !== product.id);
        default:
          return prevProducts;
      }
    });
  };

  // Search products
  const searchProducts = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.searchProducts(query, filters);
      if (response.success) {
        setProducts(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  };

  // Get all products (needed by Homepage)
  const getAllProducts = async (params = {}) => {
    try {
      const response = await productService.getAllProducts(params);
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Failed to get all products:', error);
      throw error;
    }
  };

  // Get products by category
  const getProductsByCategory = async (category) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.getProductsByCategory(category);
      if (response.success) {
        return response.data; // Return filtered products instead of setting global state
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Failed to get products by category:', error);
      setError('Failed to load products');
      // Return empty array if API fails
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get product by ID
  const getProductById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      // Validate the ID first (handles both UUIDs and numbers)
      if (!id || id === 'undefined' || id === 'null') {
        throw new Error('Invalid product ID');
      }
      
      const response = await productService.getProductById(id);
      if (response.success) {
        setSelectedProduct(response.data);
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Failed to get product:', error);
      setError('Failed to load product');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get featured products
  const getFeaturedProducts = async () => {
    try {
      const response = await productService.getFeaturedProducts();
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Failed to get featured products:', error);
      return [];
    }
  };

  // Get categories (needed by Homepage)
  const getCategories = async () => {
    try {
      const response = await productService.getCategories();
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Failed to get categories:', error);
      return [];
    }
  };

  // Favorites management
  const addToFavorites = (productId) => {
    setFavorites(prev => [...prev, productId]);
  };

  const removeFromFavorites = (productId) => {
    setFavorites(prev => prev.filter(id => id !== productId));
  };

  const toggleFavorite = (productId) => {
    setFavorites(prev => {
      const isFavorite = prev.includes(productId);
      if (isFavorite) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  // Admin operations
  const createProduct = async (productData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.createProduct(productData);
      if (response.success) {
        // Product will be added to state via real-time update
        return response;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Failed to create product:', error);
      setError('Failed to create product');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id, productData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.updateProduct(id, productData);
      if (response.success) {
        // Product will be updated in state via real-time update
        return response;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Failed to update product:', error);
      setError('Failed to update product');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.deleteProduct(id);
      if (response.success) {
        // Product will be removed from state via real-time update
        return response;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
      setError('Failed to delete product');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductContext.Provider value={{
      products,
      setProducts,
      categories,
      setCategories,
      selectedProduct,
      setSelectedProduct,
      favorites,
      addToFavorites,
      removeFromFavorites,
      toggleFavorite,
      searchQuery,
      setSearchQuery,
      filters,
      setFilters,
      loading,
      error,
      // API methods
      loadProducts,
      getAllProducts,
      searchProducts,
      getProductsByCategory,
      getProductById,
      getFeaturedProducts,
      getCategories,
      // Admin methods
      createProduct,
      updateProduct,
      deleteProduct
    }}>
      {children}
    </ProductContext.Provider>
  );
};

// UI Context Provider
export const UIProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState('home');
  const [pageParams, setPageParams] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [theme, setTheme] = useState('light');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [confirmationDialog, setConfirmationDialog] = useState(null);
  const [isPWAMode, setIsPWAMode] = useState(false);

  // Detect PWA mode on component mount
  useEffect(() => {
    setIsPWAMode(isPWA());
    
    // Add event listener for display mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = () => setIsPWAMode(isPWA());
    
    mediaQuery.addEventListener('change', handleDisplayModeChange);
    return () => mediaQuery.removeEventListener('change', handleDisplayModeChange);
  }, []);

  const showNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(notif => notif.id !== id));
    }, 5000);
  };

  const showConfirmation = (message, onConfirm, onCancel = () => {}) => {
    return new Promise((resolve) => {
      setConfirmationDialog({
        message,
        onConfirm: () => {
          onConfirm();
          setConfirmationDialog(null);
          resolve(true);
        },
        onCancel: () => {
          onCancel();
          setConfirmationDialog(null);
          resolve(false);
        }
      });
    });
  };

  const navigateTo = (page, params = {}) => {
    setCurrentPage(page);
    setPageParams(params);
    // Scroll to top of page on navigation
    window.scrollTo(0, 0);
  };

  return (
    <UIContext.Provider value={{
      currentPage,
      setCurrentPage,
      pageParams,
      navigateTo,
      isLoading,
      setIsLoading,
      notifications,
      showNotification,
      confirmationDialog,
      showConfirmation,
      theme,
      setTheme,
      sidebarOpen,
      setSidebarOpen,
      isPWAMode
    }}>
      {children}
    </UIContext.Provider>
  );
};

// Custom hooks for easier context usage
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};

// Loading Component
const LoadingSpinner = () => {
  const { isLoading } = useUI();
  
  if (!isLoading) return null;
  
  return (
    <motion.div 
      className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="text-center">
        <motion.div
          className="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full mx-auto mb-4"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p className="text-gray-600">Loading...</p>
      </div>
    </motion.div>
  );
};

// Enhanced Notification Component
const NotificationContainer = () => {
  const { notifications } = useUI();

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5" />;
      case 'error': return <XCircle className="w-5 h-5" />;
      case 'warning': return <AlertTriangle className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  const getStyles = (type) => {
    switch (type) {
      case 'success': return 'bg-gradient-to-r from-green-500 to-emerald-600 border-green-400';
      case 'error': return 'bg-gradient-to-r from-red-500 to-rose-600 border-red-400';
      case 'warning': return 'bg-gradient-to-r from-amber-500 to-orange-600 border-amber-400';
      default: return 'bg-gradient-to-r from-demiland-500 to-demiland-600 border-demiland-400';
    }
  };

  return (
    <div className="fixed top-4 right-4 space-y-3 z-50">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.9 }}
            className={`relative px-4 py-3 rounded-xl shadow-lg text-white max-w-sm border backdrop-blur-sm ${getStyles(notification.type)}`}
          >
            <div className="flex items-center space-x-3">
              {getIcon(notification.type)}
              <p className="font-medium text-sm">{notification.message}</p>
            </div>
            <div className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-full animate-pulse" style={{
              width: '100%',
              animation: 'shrink 5s linear forwards'
            }}></div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// Confirmation Dialog Component
const ConfirmationDialog = () => {
  const { confirmationDialog } = useUI();

  if (!confirmationDialog) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-demiland-100"
        >
          <div className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Confirm Action</h3>
                <p className="text-sm text-gray-600">Please confirm your decision</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6 leading-relaxed">
              {confirmationDialog.message}
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={confirmationDialog.onCancel}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmationDialog.onConfirm}
                className="flex-1 px-4 py-2 text-white bg-gradient-to-r from-red-500 to-rose-600 rounded-xl hover:from-red-600 hover:to-rose-700 transition-all duration-200 font-medium shadow-lg"
              >
                Confirm
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Router Component (Simple routing without external dependencies)
const Router = () => {
  const { currentPage, pageParams } = useUI();
  const { isLoggedIn, isAdmin } = useAuth();

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Homepage key="home" />;
      case 'products':
        return <ShopPage key="products" />;
      case 'shop':
        return <ShopPage key="shop" />;
      case 'about':
        return <AboutPage key="about" />;
      case 'contact':
        return <ContactPage key="contact" />;
      case 'auth':
        return <AuthPage key="auth" />;
      case 'product-detail':
        return <ProductDetail key="product-detail" productId={pageParams.productId} />;
      case 'profile':
        return isLoggedIn ? <UserProfile key="profile" /> : <AuthPage key="auth" />;
      case 'admin':
        return (isLoggedIn && isAdmin()) ? <AdminDashboard key="admin" /> : <Homepage key="home" />;
      default:
        return <Homepage key="home" />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentPage}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.3 }}
      >
        {renderPage()}
      </motion.div>
    </AnimatePresence>
  );
};

// Main App Component
const App = () => {
  const [isInitialized, setIsInitialized] = useState(true);
  const { currentPage } = useUI();

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-orange-400 flex items-center justify-center">
        <div className="text-center text-white">
          <motion.div
            className="w-20 h-20 border-4 border-white border-t-transparent rounded-full mx-auto mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.h1 
            className="text-4xl font-bold mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            BeautyBrand
          </motion.h1>
          <motion.p 
            className="text-xl opacity-80"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            Loading your beauty experience...
          </motion.p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="App">
      <Navbar isHomepage={currentPage === 'home'} />
      <Router />
      <Footer />
      <NotificationContainer />
      <ConfirmationDialog />
      <LoadingSpinner />
      <AdminButton />
    </div>
  );
};

// Demo Component for Development (shows navigation buttons)
export const DevNavigation = () => {
  const { navigateTo, currentPage } = useUI();
  const { isLoggedIn, userRole } = useAuth();

  const pages = [
    { id: 'home', name: 'Home', icon: '🏠' },
    { id: 'shop', name: 'Shop', icon: '💄' },
    { id: 'about', name: 'About', icon: 'ℹ️' },
    { id: 'contact', name: 'Contact', icon: '📞' },
    { id: 'auth', name: 'Login/Register', icon: '🔐' },
    { id: 'product-detail', name: 'Product Detail', icon: '🔍' },
    { id: 'profile', name: 'Profile', icon: '👤' },
    { id: 'admin', name: 'Admin', icon: '⚙️' }
  ];

  return (
    <motion.div 
      className="hidden md:fixed bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 z-40"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
    >
      <h3 className="text-sm font-semibold text-gray-800 mb-3">Development Navigation</h3>
      <div className="grid grid-cols-2 gap-2">
        {pages.map((page) => (
          <button
            key={page.id}
            onClick={() => navigateTo(page.id)}
            className={`text-xs px-3 py-2 rounded-lg transition-colors ${
              currentPage === page.id 
                ? 'bg-pink-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="mr-1">{page.icon}</span>
            {page.name}
          </button>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
        Status: {isLoggedIn ? `Logged in as ${userRole}` : 'Not logged in'}
      </div>
    </motion.div>
  );
};

// Main App wrapper with providers
const MainApp = () => {
  return (
    <UIProvider>
      <AuthProvider>
        <ProductProvider>
          <App />
        </ProductProvider>
      </AuthProvider>
    </UIProvider>
  );
};

export default MainApp;