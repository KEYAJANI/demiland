import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth, useProducts, useUI } from './App.jsx';
import authService from '../services/authService.js';
import productService from '../services/productService.js';
// MySQL-based admin functionality - no Supabase dependency
import { 
  Users, Package, BarChart3, Plus, Edit, Trash2, Search, Eye, Menu, X, ArrowLeft,
  Crown, Sparkles, TrendingUp, UserCheck, ShoppingBag, Star, Filter, Download,
  Settings, Bell, LogOut, Home, Calendar, MessageSquare, Activity
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showUserEditModal, setShowUserEditModal] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    category: '',
    description: '',
    features: [],
    ingredients: '',
    inStock: true,
    featured: false,
    image_url: '',
    stockQuantity: 0
  });
  const [featuresInput, setFeaturesInput] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [userForm, setUserForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role: 'user',
    is_active: true
  });
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState(null);
  
  // Real data state
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    monthlyViews: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);
  const statsLoadedRef = useRef(false);
  const productsLoadedRef = useRef(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileView, setMobileView] = useState('dashboard'); // 'dashboard', 'users', 'products'
  const [isMobile, setIsMobile] = useState(false);
  
  // Get auth and product context (must be before useEffect)
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { showNotification, showConfirmation } = useUI();
  const { 
    products, 
    loading, 
    error, 
    createProduct, 
    updateProduct, 
    deleteProduct,
    categories,
    loadProducts
  } = useProducts();

  // Debug products data - separated from main useEffect to prevent loops
  useEffect(() => {
    console.log('🛍️ Products data changed:', {
      productsCount: products.length,
      loading,
      error,
      products: products.slice(0, 3) // Show first 3 products for debugging
    });
  }, [products, loading, error]); // Include products for debug logging
  
  // Function to refresh admin dashboard data from MySQL backend
  const refreshDashboardData = useCallback(async () => {
    try {
      console.log('🔄 Refreshing admin dashboard data...');
      
      const currentUser = authService.getCurrentUser();
      
      if (!currentUser || !authService.isAdmin()) {
        console.log('ℹ️ No admin user found');
        return;
      }
      
      console.log(`👤 Admin user: ${currentUser.email} (${currentUser.id})`);
      console.log('✅ Admin dashboard data ready');
      
    } catch (error) {
      console.error('❌ Dashboard refresh error:', error);
    }
  }, []);
  
  // Function to fetch dashboard statistics from MySQL backend
  const fetchDashboardStats = useCallback(async () => {
    if (statsLoadedRef.current) {
      console.log('📊 Stats already loaded, skipping...');
      return;
    }
    try {
      console.log('📡 Starting fetchDashboardStats...');
      setIsLoadingStats(true);
      
      // Fetch users from backend
      const response = await authService.makeRequest('/auth/users');
      
      if (response.success && response.data) {
        const users = response.data;
        setRecentUsers(users.slice(0, 5)); // Show recent 5 users
        setAllUsers(users);
        
        setDashboardStats(prev => ({
          ...prev,
          totalUsers: users.length
        }));
      }
      
      // Get products count from products context
      if (products && products.length > 0) {
        setDashboardStats(prev => ({
          ...prev,
          totalProducts: products.length,
          monthlyViews: Math.floor(Math.random() * 10000) + 5000 // Mock data
        }));
      }
      
      statsLoadedRef.current = true;
      
    } catch (error) {
      console.error('❌ Dashboard stats error:', error);
    } finally {
      setIsLoadingStats(false);
    }
  }, [products]);
  
  // Manual refresh function for dashboard data
  const manualSyncUsers = useCallback(async () => {
    setIsSyncing(true);
    setSyncMessage(null);
    
    try {
      console.log('🔄 Manual refresh triggered by user');
      
      // Refresh dashboard stats
      statsLoadedRef.current = false;
      await fetchDashboardStats();
      
      setSyncMessage({
        type: 'success',
        text: `✅ Dashboard data refreshed successfully!`
      });
      
    } catch (error) {
      console.error('❌ Manual refresh failed:', error);
      setSyncMessage({
        type: 'error',
        text: `❌ Refresh failed: ${error.message}`
      });
    } finally {
      setIsSyncing(false);
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setSyncMessage(null);
      }, 5000);
    }
  }, [fetchDashboardStats]);

  // Add a manual refresh function for debugging
  const refreshData = useCallback(() => {
    console.log('🔄 Manual data refresh triggered');
    statsLoadedRef.current = false;
    productsLoadedRef.current = false;
    fetchDashboardStats();
    if (loadProducts) {
      loadProducts();
    }
  }, [fetchDashboardStats, loadProducts]);
  
  // Initialize dashboard data once when user is authenticated and admin
  useEffect(() => {
    const initializeDashboard = async () => {
      if (!hasInitialized && user && authService.isAdmin() && !authLoading) {
        console.log('🔍 AdminDashboard initializing:', {
          user: !!user,
          isAdmin: authService.isAdmin(),
          authLoading
        });
        
        console.log('✅ Admin authenticated, initializing dashboard...');
        setHasInitialized(true);
        
        // Fetch dashboard stats
        try {
          fetchDashboardStats();
        } catch (error) {
          console.error('❌ Error fetching dashboard stats:', error);
        }
      }
    };
    
    initializeDashboard();
  }, [user, authLoading, hasInitialized, fetchDashboardStats, refreshDashboardData]);
  
  // Separate useEffect for loading products - only runs once when needed
  useEffect(() => {
    if (hasInitialized && products.length === 0 && !loading && !productsLoadedRef.current && loadProducts) {
      console.log('🔧 Loading products for admin dashboard...');
      productsLoadedRef.current = true;
      loadProducts();
    }
  }, [hasInitialized, products.length, loading, loadProducts]);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Sync activeTab with mobileView
  useEffect(() => {
    if (isMobile && mobileView !== 'dashboard') {
      setActiveTab(mobileView);
    }
  }, [mobileView, isMobile]);

  // Mobile Dashboard Card Component
  const MobileDashboardCard = ({ icon: Icon, title, description, onClick }) => (
    <motion.div
      className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 cursor-pointer border border-demiland-100/50 hover:border-demiland-200 transition-all duration-300"
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className="flex flex-col items-center text-center space-y-5">
        <div className="w-20 h-20 bg-gradient-to-br from-demiland-100 to-demiland-200 rounded-2xl flex items-center justify-center shadow-lg">
          <Icon size={36} className="text-demiland-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-charcoal-800 mb-2">{title}</h3>
          <p className="text-charcoal-600 text-sm font-medium">{description}</p>
        </div>
        <div className="w-12 h-1 bg-gradient-to-r from-demiland-400 to-demiland-600 rounded-full opacity-60"></div>
      </div>
    </motion.div>
  );

  // Mobile Dashboard Cards View
  const MobileDashboardCards = () => (
    <div className="min-h-screen bg-gradient-to-br from-demiland-50 via-white to-demiland-100/30 pt-24 md:pt-20">
      <div className="px-6 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-demiland-600 to-demiland-700 rounded-2xl flex items-center justify-center shadow-lg">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-charcoal-800">DEMILAND</h1>
          </div>
          <div className="inline-flex items-center space-x-2 bg-demiland-100/70 backdrop-blur-sm px-4 py-2 rounded-full mb-2">
            <Sparkles className="w-4 h-4 text-demiland-600" />
            <p className="text-sm font-semibold text-demiland-700">Admin Dashboard</p>
          </div>
          <p className="text-charcoal-600 font-medium">Luxury beauty brand management</p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 max-w-sm mx-auto">
          <MobileDashboardCard
            icon={Users}
            title="Users"
            description="Manage user accounts"
            onClick={() => setMobileView('users')}
          />
          <MobileDashboardCard
            icon={Package}
            title="Products"
            description="Manage product catalog"
            onClick={() => setMobileView('products')}
          />
        </div>
      </div>
    </div>
  );

  // Mobile Header with Back Button
  const MobileHeader = ({ title, onBack }) => (
    <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-demiland-200 px-6 py-4 flex items-center sticky top-0 z-40">
      <button
        onClick={onBack}
        className="p-3 text-charcoal-600 hover:text-demiland-600 mr-4 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl hover:bg-demiland-50 transition-all duration-300"
      >
        <ArrowLeft size={20} />
      </button>
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-br from-demiland-500 to-demiland-600 rounded-lg flex items-center justify-center">
          <Crown className="w-4 h-4 text-white" />
        </div>
        <h1 className="text-xl font-bold text-charcoal-800">{title}</h1>
      </div>
    </header>
  );

  // Mobile-Optimized TabContent
  const MobileTabContent = () => {
    switch (activeTab) {
      case 'users':
        return (
          <div className="space-y-4">
            {/* Mobile Add User Button */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Users</h2>
              <button 
                onClick={() => {
                  console.log('🔴 Mobile Add User button clicked');
                  setShowUserModal(true);
                }}
                className="bg-demiland-600 text-white px-4 py-3 rounded-xl hover:bg-demiland-700 transition-colors flex items-center space-x-2 text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                <span>Add User</span>
              </button>
            </div>

            {/* Mobile Search */}
            <div className="relative mb-6">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-demiland-500 focus:border-transparent text-base"
              />
            </div>
            
            {/* Mobile Users List */}
            <div className="space-y-3">
              {isLoadingStats ? (
                // Mobile Loading State
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                        <div className="flex-1">
                          <div className="w-32 h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                          <div className="w-40 h-3 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentUsers.length > 0 ? (
                recentUsers.map((user) => (
                  <div key={user.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="w-12 h-12 bg-demiland-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                          {user.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-900 font-medium text-base truncate">{user.name}</p>
                          <p className="text-gray-600 text-sm truncate">{user.email}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.status === 'active' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {user.status}
                            </span>
                            <span className="text-gray-500 text-xs">
                              Joined: {user.joinDate}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Mobile Action Buttons */}
                      <div className="flex items-center space-x-2 ml-3">
                        <button 
                          onClick={() => {
                            console.log('🔴 Mobile Edit User button clicked for:', user.name);
                            setSelectedUser(user);
                            setUserForm({
                              first_name: user.name.split(' ')[0] || '',
                              last_name: user.name.split(' ')[1] || '',
                              email: user.email,
                              password: '', // Always start with empty password field
                              role: user.role || 'user',
                              is_active: user.status === 'active'
                            });
                            setShowUserEditModal(true);
                          }}
                          className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => {
                            showConfirmation(
                              'Are you sure you want to delete this user? This action cannot be undone.',
                              async () => {
                                try {
                                  console.log('Deleting user from database:', user.id);
                                  
                                  // Delete user via backend API
                                  const response = await authService.makeRequest(`/auth/users/${user.id}`, {
                                    method: 'DELETE'
                                  });
                                  
                                  if (!response.success) throw new Error(response.message);
                                  
                                  console.log('✅ User deleted successfully from database');
                                  showNotification('User deleted successfully!', 'success');
                                  
                                  // Refresh data to remove deleted user from UI
                                  statsLoadedRef.current = false;
                                  fetchDashboardStats();
                                } catch (error) {
                                  console.error('❌ Failed to delete user:', error);
                                  showNotification('Failed to delete user: ' + error.message, 'error');
                                }
                              }
                            );
                          }}
                          className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                // Mobile Empty State
                <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg font-medium">No users found</p>
                  <p className="text-gray-500 text-sm mt-2">Users will appear here when they register</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'products':
        return (
          <div className="space-y-4">
            {/* Mobile Add Product Button */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Products</h2>
              <button 
                onClick={() => {
                  console.log('🔴 Mobile Add Product button clicked');
                  setShowProductModal(true);
                }}
                className="bg-demiland-600 text-white px-4 py-3 rounded-xl hover:bg-demiland-700 transition-colors flex items-center space-x-2 text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>

            {/* Mobile Search */}
            <div className="relative mb-6">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-demiland-500 focus:border-transparent text-base"
              />
            </div>
            
            {/* Mobile Products List */}
            <div className="space-y-3">
              {loading ? (
                // Mobile Loading State
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                      <div className="flex items-center space-x-3">
                        <div className="w-16 h-16 bg-gray-200 rounded-xl animate-pulse"></div>
                        <div className="flex-1">
                          <div className="w-32 h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                          <div className="w-24 h-3 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : products.length > 0 ? (
                products.map((product) => (
                  <div key={product.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="w-16 h-16 bg-demiland-100 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                          {product.image_url ? (
                            <img 
                              src={product.image_url} 
                              alt={product.name}
                              className="w-full h-full object-cover rounded-xl"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : (
                            <Package className="w-8 h-8 text-demiland-600" />
                          )}
                          <div className="w-full h-full items-center justify-center" style={{display: 'none'}}>
                            <Package className="w-8 h-8 text-demiland-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-900 font-medium text-base truncate">{product.name}</p>
                          <p className="text-gray-600 text-sm">{product.category}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              product.inStock 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {product.inStock ? 'In Stock' : 'Out of Stock'}
                            </span>
                            {product.featured && (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                                Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Mobile Action Buttons */}
                      <div className="flex items-center space-x-2 ml-3">
                        <button 
                          onClick={() => openEditModal(product)}
                          className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                // Mobile Empty State
                <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg font-medium">No products found</p>
                  <p className="text-gray-500 text-sm mt-2">Products will appear here when you add them</p>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return <div>Select a tab</div>;
    }
  };
  
  // Guard: Only allow admin users
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user || !authService.isAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">You need admin privileges to access this dashboard.</p>
          <button 
            onClick={() => window.history.back()}
            className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Dashboard stats and user data are now fetched from database in fetchDashboardStats()

  // Product management functions
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    
    // Check admin permissions
    if (!authService.isAdmin()) {
      showNotification('You do not have permission to create products.', 'error');
      return;
    }
    
    try {
      // Upload image if selected
      let imageUrl = '';
      if (selectedImage) {
        try {
          imageUrl = await uploadProductImage();
        } catch (imageError) {
          console.error('Image upload failed:', imageError);
          
          // Continue without image and show warning
          console.log('📸 Continuing product creation without image');
          showNotification('Image upload failed. Product will be created without image.', 'warning');
          imageUrl = '';
        }
      }
      
      // Convert features input to array
      const featuresArray = featuresInput
        .split('\n')
        .map(feature => feature.trim())
        .filter(feature => feature.length > 0);
      
      const productData = {
        ...productForm,
        features: featuresArray,
        image_url: imageUrl
      };
      
      console.log('🚀 AdminDashboard - Sending productData:', {
        name: productData.name,
        category: productData.category,
        image_url: productData.image_url,
        hasImageUrl: !!productData.image_url
      });
      
      await createProduct(productData);
      setShowProductModal(false);
      resetProductForm();
      
      if (selectedImage && !imageUrl) {
        showNotification('Product created successfully without image! You can edit the product later to add an image.', 'success');
      } else {
        showNotification('Product created successfully!', 'success');
      }
    } catch (error) {
      showNotification('Failed to create product: ' + error.message, 'error');
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    
    // Check admin permissions
    if (!authService.isAdmin()) {
      showNotification('You do not have permission to update products.', 'error');
      return;
    }
    
    try {
      // Upload new image if selected
      let imageUrl = productForm.image_url; // Keep existing image URL
      if (selectedImage) {
        try {
          imageUrl = await uploadProductImage();
        } catch (imageError) {
          console.error('Image upload failed:', imageError);
          
          // Continue without updating image and show warning
          console.log('📸 Continuing product update without changing image');
          showNotification('Image upload failed. Product will be updated without changing the image.', 'warning');
          imageUrl = productForm.image_url; // Keep existing image URL
        }
      }
      
      // Convert features input to array
      const featuresArray = featuresInput
        .split('\n')
        .map(feature => feature.trim())
        .filter(feature => feature.length > 0);
      
      const productData = {
        ...productForm,
        features: featuresArray,
        image_url: imageUrl
      };
      
      await updateProduct(selectedProduct.id, productData);
      setShowEditModal(false);
      resetProductForm();
      
      if (selectedImage && imageUrl === productForm.image_url) {
        showNotification('Product updated successfully! Note: Image upload failed, so the original image was kept.', 'success');
      } else {
        showNotification('Product updated successfully!', 'success');
      }
    } catch (error) {
      showNotification('Failed to update product: ' + error.message, 'error');
    }
  };

  const handleDeleteProduct = async (productId) => {
    // Check admin permissions
    if (!authService.isAdmin()) {
      showNotification('You do not have permission to delete products.', 'error');
      return;
    }
    
    showConfirmation(
      'Are you sure you want to delete this product?',
      async () => {
        try {
          await deleteProduct(productId);
          showNotification('Product deleted successfully!', 'success');
        } catch (error) {
          showNotification('Failed to delete product: ' + error.message, 'error');
        }
      }
    );
  };

  const handleImageSelection = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const uploadProductImage = async () => {
    if (!selectedImage) return null;
    
    try {
      setUploadingImage(true);
      console.log('📸 Uploading product image...');
      
      // Use productService instance to upload image
      const productService = (await import('../services/productService.js')).default;
      const imageUrl = await productService.uploadProductImage(selectedImage);
      
      console.log('✅ Image uploaded successfully:', imageUrl);
      return imageUrl;
    } catch (error) {
      console.error('❌ Image upload failed:', error);
      throw error;
    } finally {
      setUploadingImage(false);
    }
  };

  const resetProductForm = () => {
    setProductForm({
      name: '',
      category: '',
      description: '',
      features: [],
      ingredients: '',
      inStock: true,
      featured: false,
      image_url: '',
      stockQuantity: 0
    });
    setFeaturesInput('');
    setSelectedProduct(null);
    setSelectedImage(null);
    setImagePreview(null);
    setUploadingImage(false);
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setProductForm({
      name: product.name,
      category: product.category || '',
      description: product.description || '',
      features: product.features || [],
      ingredients: product.ingredients || '',
      inStock: product.inStock || true,
      featured: product.featured || false,
      image_url: product.image_url || '',
      stockQuantity: product.stockQuantity || 0
    });
    setFeaturesInput(Array.isArray(product.features) ? product.features.join('\n') : '');
    setShowEditModal(true);
  };

  const resetUserForm = () => {
    setUserForm({
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      role: 'user',
      is_active: true
    });
    setSelectedUser(null);
  };

  const inquiries = [
    { id: 1, name: "Lisa Wang", email: "lisa@email.com", subject: "Product Question", date: "2024-01-15", status: "pending" },
    { id: 2, name: "John Smith", email: "john@email.com", subject: "Partnership", date: "2024-01-14", status: "responded" },
    { id: 3, name: "Maria Garcia", email: "maria@email.com", subject: "General Inquiry", date: "2024-01-13", status: "pending" },
  ];

  const sidebarItems = [
    { 
      id: 'overview', 
      name: 'Overview', 
      description: 'Analytics & Insights',
      icon: TrendingUp 
    },
    { 
      id: 'users', 
      name: 'Users', 
      description: 'Customer Management',
      icon: UserCheck 
    },
    { 
      id: 'products', 
      name: 'Products', 
      description: 'Luxury Collections',
      icon: ShoppingBag 
    }
  ];

  const TabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recent Users Section */}
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-demiland-100">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-charcoal-800 mb-2">Recent Users</h3>
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-demiland-600" />
                      <span className="text-sm text-demiland-600 font-medium">Latest registrations</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {/* Manual Sync Button */}
                    <button
                      onClick={manualSyncUsers}
                      disabled={isSyncing}
                      className="bg-orange-500 text-white px-3 py-2 rounded-lg hover:bg-orange-600 disabled:bg-orange-300 transition-colors font-medium text-xs flex items-center space-x-2"
                      title="Ensure current user exists in public users table"
                    >
                      {isSyncing ? (
                        <>
                          <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Syncing...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          <span>Refresh Users</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setActiveTab('users')}
                      className="bg-demiland-600 text-white px-4 py-2 rounded-xl hover:bg-demiland-700 transition-colors font-medium text-sm"
                    >
                      View All
                    </button>
                  </div>
                </div>
                
                {/* Sync Status Message */}
                {syncMessage && (
                  <div className={`mb-6 p-4 rounded-2xl border-l-4 ${
                    syncMessage.type === 'success' ? 'bg-green-50 border-green-400 text-green-800' :
                    syncMessage.type === 'error' ? 'bg-red-50 border-red-400 text-red-800' :
                    syncMessage.type === 'warning' ? 'bg-yellow-50 border-yellow-400 text-yellow-800' :
                    'bg-blue-50 border-blue-400 text-blue-800'
                  }`}>
                    <p className="text-sm font-medium">{syncMessage.text}</p>
                  </div>
                )}
                
                <div className="space-y-4">
                  {isLoadingStats ? (
                    // Luxury Loading State
                    <div className="space-y-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center space-x-4 p-4 bg-demiland-50/50 rounded-2xl">
                          <div className="w-12 h-12 bg-demiland-200 rounded-full animate-pulse"></div>
                          <div className="flex-1">
                            <div className="w-32 h-4 bg-demiland-200 rounded animate-pulse mb-2"></div>
                            <div className="w-48 h-3 bg-demiland-100 rounded animate-pulse"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : recentUsers.length > 0 ? (
                    recentUsers.slice(0, 4).map((user) => (
                      <div 
                        key={user.id}
                        className="flex items-center space-x-4 p-4 bg-gradient-to-r from-demiland-50/50 to-transparent rounded-2xl hover:from-demiland-100/50 transition-all duration-300"
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-demiland-500 to-demiland-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                          {user.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <p className="text-charcoal-800 font-semibold">{user.name}</p>
                          <p className="text-charcoal-600 text-sm">{user.email}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {user.status}
                        </div>
                      </div>
                    ))
                  ) : (
                    // Elegant Empty State
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gradient-to-br from-demiland-100 to-demiland-200 rounded-full flex items-center justify-center mx-auto mb-6">
                        <UserCheck className="w-10 h-10 text-demiland-600" />
                      </div>
                      <h4 className="text-charcoal-800 font-semibold mb-2">No users yet</h4>
                      <p className="text-charcoal-600 text-sm">New user registrations will appear here</p>
                    </div>
                  )}
                </div>
            </div>

            {/* Recent Products Section */}
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-demiland-100">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-charcoal-800 mb-2">Product Overview</h3>
                    <div className="flex items-center space-x-2">
                      <Crown className="w-4 h-4 text-demiland-600" />
                      <span className="text-sm text-demiland-600 font-medium">Luxury collections</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('products')}
                    className="bg-demiland-600 text-white px-4 py-2 rounded-xl hover:bg-demiland-700 transition-colors font-medium text-sm"
                  >
                    Manage
                  </button>
                </div>
                
                <div className="space-y-4">
                  {loading ? (
                    // Luxury Loading State
                    <div className="space-y-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center space-x-4 p-4 bg-demiland-50/50 rounded-2xl">
                          <div className="w-12 h-12 bg-demiland-200 rounded-xl animate-pulse"></div>
                          <div className="flex-1">
                            <div className="w-32 h-4 bg-demiland-200 rounded animate-pulse mb-2"></div>
                            <div className="w-24 h-3 bg-demiland-100 rounded animate-pulse"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : products.length > 0 ? (
                    products.slice(0, 4).map((product) => (
                      <div 
                        key={product.id}
                        className="flex items-center space-x-4 p-4 bg-gradient-to-r from-demiland-50/50 to-transparent rounded-2xl hover:from-demiland-100/50 transition-all duration-300"
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-demiland-500 to-demiland-600 rounded-xl flex items-center justify-center shadow-lg">
                          <ShoppingBag className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-charcoal-800 font-semibold">{product.name}</p>
                          <p className="text-charcoal-600 text-sm">{product.category}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </div>
                      </div>
                    ))
                  ) : (
                    // Elegant Empty State
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gradient-to-br from-demiland-100 to-demiland-200 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="w-10 h-10 text-demiland-600" />
                      </div>
                      <h4 className="text-charcoal-800 font-semibold mb-2">No products yet</h4>
                      <p className="text-charcoal-600 text-sm">Add your first luxury product to get started</p>
                    </div>
                  )}
                </div>
            </div>
          </div>
        );

      case 'users':
        return (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-demiland-100">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-charcoal-800 mb-2">User Management</h3>
                  <div className="flex items-center space-x-2">
                    <UserCheck className="w-4 h-4 text-demiland-600" />
                    <span className="text-sm text-demiland-600 font-medium">Customer accounts</span>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <div className="relative">
                    <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-charcoal-400" />
                    <input
                      type="text"
                      placeholder="Search customers..."
                      className="pl-12 pr-4 py-3 border border-demiland-200 rounded-xl focus:ring-2 focus:ring-demiland-500 focus:border-demiland-300 bg-white/50 backdrop-blur-sm placeholder-charcoal-400 text-charcoal-800"
                    />
                  </div>
                  <button 
                    onClick={() => setShowUserModal(true)}
                    className="bg-gradient-to-r from-demiland-600 to-demiland-700 text-white px-6 py-3 rounded-xl hover:from-demiland-700 hover:to-demiland-800 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Customer</span>
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                {isLoadingStats ? (
                  // Loading State
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                      <div key={i} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                            <div>
                              <div className="w-32 h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                              <div className="w-40 h-3 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : recentUsers.length > 0 ? (
                  recentUsers.map((user) => (
                    <div key={user.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-gray-800 font-medium">{user.name}</p>
                            <p className="text-gray-600 text-sm">{user.email}</p>
                            <p className="text-gray-500 text-xs">Joined: {user.joinDate}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.status === 'active' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {user.status}
                          </span>
                          <button 
                            onClick={() => {
                              setSelectedUser(user);
                              setUserForm({
                                first_name: user.name.split(' ')[0] || '',
                                last_name: user.name.split(' ')[1] || '',
                                email: user.email,
                                role: user.role || 'user',
                                is_active: user.status === 'active'
                              });
                              setShowUserEditModal(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => {
                              showConfirmation(
                                'Are you sure you want to delete this user? This action cannot be undone.',
                                async () => {
                                  try {
                                    console.log('Deleting user from database:', user.id);
                                    
                                    // Delete user via backend API
                                    const response = await authService.makeRequest(`/auth/users/${user.id}`, {
                                      method: 'DELETE'
                                    });
                                    
                                    if (!response.success) {
                                      throw new Error(response.message);
                                    }
                                    
                                    console.log('✅ User deleted successfully from database');
                                    showNotification('User deleted successfully!', 'success');
                                    
                                    // Refresh data to remove deleted user from UI
                                    statsLoadedRef.current = false;
                                    fetchDashboardStats();
                                    
                                  } catch (error) {
                                    console.error('❌ Failed to delete user:', error);
                                    showNotification('Failed to delete user: ' + error.message, 'error');
                                  }
                                }
                              );
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  // Elegant Empty State
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-gradient-to-br from-demiland-100 to-demiland-200 rounded-full flex items-center justify-center mx-auto mb-6">
                      <UserCheck className="w-10 h-10 text-demiland-600" />
                    </div>
                    <h4 className="text-charcoal-800 font-semibold mb-2">No customers yet</h4>
                    <p className="text-charcoal-600 text-sm">New customer registrations will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'products':
        return (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-demiland-100">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-charcoal-800 mb-2">Product Catalog</h3>
                  <div className="flex items-center space-x-2">
                    <ShoppingBag className="w-4 h-4 text-demiland-600" />
                    <span className="text-sm text-demiland-600 font-medium">Luxury collections</span>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <div className="relative">
                    <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-charcoal-400" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      className="pl-12 pr-4 py-3 border border-demiland-200 rounded-xl focus:ring-2 focus:ring-demiland-500 focus:border-demiland-300 bg-white/50 backdrop-blur-sm placeholder-charcoal-400 text-charcoal-800"
                    />
                  </div>
                  <button 
                    onClick={() => setShowProductModal(true)}
                    className="bg-gradient-to-r from-demiland-600 to-demiland-700 text-white px-6 py-3 rounded-xl hover:from-demiland-700 hover:to-demiland-800 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Product</span>
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                {loading ? (
                  // Luxury Loading State
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                      <div key={i} className="p-6 bg-gradient-to-r from-demiland-50/50 to-transparent rounded-2xl">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-demiland-200 rounded-xl animate-pulse"></div>
                            <div>
                              <div className="w-36 h-4 bg-demiland-200 rounded-lg animate-pulse mb-2"></div>
                              <div className="w-28 h-3 bg-demiland-100 rounded-lg animate-pulse"></div>
                            </div>
                          </div>
                          <div className="flex space-x-3">
                            <div className="w-10 h-10 bg-demiland-200 rounded-xl animate-pulse"></div>
                            <div className="w-10 h-10 bg-demiland-200 rounded-xl animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : products.length > 0 ? (
                  products.map((product) => (
                    <div key={product.id} className="p-6 bg-gradient-to-r from-demiland-50/50 to-transparent rounded-2xl hover:from-demiland-100/50 transition-all duration-300 border border-demiland-100/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-demiland-100 to-demiland-200 rounded-xl flex items-center justify-center overflow-hidden shadow-lg">
                            {product.image_url ? (
                              <img 
                                src={product.image_url} 
                                alt={product.name}
                                className="w-full h-full object-cover rounded-xl"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : (
                              <ShoppingBag className="w-8 h-8 text-demiland-600" />
                            )}
                            <div className="w-full h-full items-center justify-center" style={{display: 'none'}}>
                              <ShoppingBag className="w-8 h-8 text-demiland-600" />
                            </div>
                          </div>
                          <div>
                            <p className="text-charcoal-800 font-semibold">{product.name}</p>
                            <p className="text-demiland-600 text-sm font-medium mb-1">{product.category}</p>
                            <p className="text-charcoal-600 text-xs">
                              {product.featured ? 'Featured' : 'Regular'} • {product.inStock ? 'In Stock' : 'Out of Stock'}
                              {product.stockQuantity !== undefined && ` • Qty: ${product.stockQuantity}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            product.inStock 
                              ? 'bg-emerald-100 text-emerald-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                          {product.featured && (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-demiland-100 to-demiland-200 text-demiland-700">
                              Featured
                            </span>
                          )}
                          <button 
                            onClick={() => openEditModal(product)}
                            className="p-2 text-demiland-600 hover:bg-demiland-100 rounded-xl transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-xl transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  // Elegant Empty State
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-gradient-to-br from-demiland-100 to-demiland-200 rounded-full flex items-center justify-center mx-auto mb-6">
                      <ShoppingBag className="w-10 h-10 text-demiland-600" />
                    </div>
                    <h4 className="text-charcoal-800 font-semibold mb-2">No products yet</h4>
                    <p className="text-charcoal-600 text-sm mb-6">Add your first luxury product to get started</p>
                    <button 
                      onClick={() => setShowProductModal(true)}
                      className="bg-gradient-to-r from-demiland-600 to-demiland-700 text-white px-6 py-3 rounded-xl hover:from-demiland-700 hover:to-demiland-800 transition-all duration-300 font-medium shadow-lg"
                    >
                      Add First Product
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );


      default:
        return <div>Select a tab</div>;
    }
  };

  // Mobile View Logic
  if (isMobile) {
    if (mobileView === 'dashboard') {
      return <MobileDashboardCards />;
    }
    
    if (mobileView === 'users') {
      return (
        <>
          <div className="min-h-screen bg-gray-50 pt-24 md:pt-20">
            <MobileHeader 
              title="Users" 
              onBack={() => setMobileView('dashboard')} 
            />
            <div className="p-4">
              <MobileTabContent />
            </div>
          </div>
          
          {/* Mobile User Modal */}
          {showUserModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <motion.div 
                className="bg-white rounded-xl shadow-xl max-w-sm w-full max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Add New User</h3>
                    <button
                      onClick={() => setShowUserModal(false)}
                      className="text-gray-400 hover:text-gray-600 p-1 min-w-[44px] min-h-[44px] flex items-center justify-center"
                    >
                      ✕
                    </button>
                  </div>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input
                        type="text"
                        value={userForm.first_name}
                        onChange={(e) => setUserForm({...userForm, first_name: e.target.value})}
                        className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-demiland-500 text-base"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        value={userForm.last_name}
                        onChange={(e) => setUserForm({...userForm, last_name: e.target.value})}
                        className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-demiland-500 text-base"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={userForm.email}
                        onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                        className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-demiland-500 text-base"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <input
                        type="password"
                        value={userForm.password}
                        onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                        className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-demiland-500 text-base"
                        required
                        minLength="6"
                        placeholder="Enter password (min 6 characters)"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                      <select
                        value={userForm.role}
                        onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                        className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-demiland-500 text-base"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowUserModal(false)}
                        className="px-4 py-3 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 min-h-[44px]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-3 bg-demiland-600 text-white rounded-xl hover:bg-demiland-700 min-h-[44px]"
                      >
                        Add User
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          )}

          {/* Mobile User Edit Modal */}
          {showUserEditModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <motion.div 
                className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl max-w-sm w-full max-h-[90vh] overflow-y-auto border border-demiland-200"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-charcoal-800 mb-2">Edit Customer</h3>
                      <div className="flex items-center space-x-2">
                        <UserCheck className="w-4 h-4 text-demiland-600" />
                        <span className="text-sm text-demiland-600 font-medium">Update account</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowUserEditModal(false)}
                      className="text-charcoal-400 hover:text-charcoal-600 p-2 rounded-xl hover:bg-demiland-50 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <form className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-charcoal-700 mb-2">First Name</label>
                      <input
                        type="text"
                        value={userForm.first_name}
                        onChange={(e) => setUserForm({...userForm, first_name: e.target.value})}
                        className="w-full px-4 py-3 border border-demiland-200 rounded-xl focus:ring-2 focus:ring-demiland-500 focus:border-demiland-300 bg-white/50 backdrop-blur-sm placeholder-charcoal-400 text-charcoal-800 transition-all duration-300"
                        placeholder="Enter first name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-charcoal-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        value={userForm.last_name}
                        onChange={(e) => setUserForm({...userForm, last_name: e.target.value})}
                        className="w-full px-4 py-3 border border-demiland-200 rounded-xl focus:ring-2 focus:ring-demiland-500 focus:border-demiland-300 bg-white/50 backdrop-blur-sm placeholder-charcoal-400 text-charcoal-800 transition-all duration-300"
                        placeholder="Enter last name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-charcoal-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        value={userForm.email}
                        onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                        className="w-full px-4 py-3 border border-demiland-200 rounded-xl focus:ring-2 focus:ring-demiland-500 focus:border-demiland-300 bg-white/50 backdrop-blur-sm placeholder-charcoal-400 text-charcoal-800 transition-all duration-300"
                        placeholder="customer@email.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-charcoal-700 mb-2">New Password (Optional)</label>
                      <input
                        type="password"
                        value={userForm.password}
                        onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                        className="w-full px-4 py-3 border border-demiland-200 rounded-xl focus:ring-2 focus:ring-demiland-500 focus:border-demiland-300 bg-white/50 backdrop-blur-sm placeholder-charcoal-400 text-charcoal-800 transition-all duration-300"
                        placeholder="Leave blank to keep current"
                        minLength="6"
                      />
                      <p className="text-xs text-charcoal-500 mt-1">
                        User will receive reset email
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-charcoal-700 mb-2">Account Role</label>
                      <select
                        value={userForm.role}
                        onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                        className="w-full px-4 py-3 border border-demiland-200 rounded-xl focus:ring-2 focus:ring-demiland-500 focus:border-demiland-300 bg-white/50 backdrop-blur-sm text-charcoal-800 transition-all duration-300"
                      >
                        <option value="user">Customer</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </div>
                    <div className="flex justify-end space-x-4 pt-6">
                      <button
                        type="button"
                        onClick={() => setShowUserEditModal(false)}
                        className="px-6 py-3 text-charcoal-600 border border-demiland-200 rounded-xl hover:bg-demiland-50 transition-all duration-300 font-medium min-h-[44px]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-3 bg-gradient-to-r from-demiland-600 to-demiland-700 text-white rounded-xl hover:from-demiland-700 hover:to-demiland-800 transition-all duration-300 font-medium shadow-lg hover:shadow-xl min-h-[44px]"
                      >
                        Update Customer
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </>
      );
    }
    
    if (mobileView === 'products') {
      return (
        <>
          <div className="min-h-screen bg-gray-50 pt-24 md:pt-20">
            <MobileHeader 
              title="Products" 
              onBack={() => setMobileView('dashboard')} 
            />
            <div className="p-4">
              <MobileTabContent />
            </div>
          </div>
          
          {/* Mobile Product Modal */}
          {showProductModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <motion.div 
                className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl max-w-sm w-full max-h-[90vh] overflow-y-auto border border-demiland-200"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-6 pt-24 md:pt-6">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-charcoal-800 mb-2">Add New Product</h3>
                      <div className="flex items-center space-x-2">
                        <ShoppingBag className="w-4 h-4 text-demiland-600" />
                        <span className="text-sm text-demiland-600 font-medium">Luxury collection</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setShowProductModal(false);
                        resetProductForm();
                      }}
                      className="text-charcoal-400 hover:text-charcoal-600 p-2 rounded-xl hover:bg-demiland-50 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <form onSubmit={handleCreateProduct} className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-charcoal-700 mb-2">Product Name</label>
                      <input
                        type="text"
                        value={productForm.name}
                        onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                        className="w-full px-4 py-3 border border-demiland-200 rounded-xl focus:ring-2 focus:ring-demiland-500 focus:border-demiland-300 bg-white/50 backdrop-blur-sm placeholder-charcoal-400 text-charcoal-800 transition-all duration-300"
                        placeholder="Enter product name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-charcoal-700 mb-2">Category</label>
                      <select
                        value={productForm.category}
                        onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                        className="w-full px-4 py-3 border border-demiland-200 rounded-xl focus:ring-2 focus:ring-demiland-500 focus:border-demiland-300 bg-white/50 backdrop-blur-sm text-charcoal-800 transition-all duration-300"
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="Eyes">Eyes</option>
                        <option value="Lips">Lips</option>
                        <option value="Complexion">Complexion</option>
                        <option value="Nails">Nails</option>
                        <option value="Tools">Tools</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-charcoal-700 mb-2">Description</label>
                      <textarea
                        value={productForm.description}
                        onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                        rows="3"
                        className="w-full px-4 py-3 border border-demiland-200 rounded-xl focus:ring-2 focus:ring-demiland-500 focus:border-demiland-300 bg-white/50 backdrop-blur-sm placeholder-charcoal-400 text-charcoal-800 transition-all duration-300"
                        placeholder="Describe the product"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-charcoal-700 mb-2">Features</label>
                      <textarea
                        value={featuresInput}
                        onChange={(e) => setFeaturesInput(e.target.value)}
                        rows="3"
                        className="w-full px-4 py-3 border border-demiland-200 rounded-xl focus:ring-2 focus:ring-demiland-500 focus:border-demiland-300 bg-white/50 backdrop-blur-sm placeholder-charcoal-400 text-charcoal-800 transition-all duration-300"
                        placeholder="Enter features (one per line)&#10;Example:&#10;Waterproof formula&#10;Long-lasting&#10;Easy application"
                      />
                      <p className="text-xs text-charcoal-500 mt-1 font-medium">Enter each feature on a new line</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-charcoal-700 mb-2">Ingredients</label>
                      <input
                        type="text"
                        value={productForm.ingredients}
                        onChange={(e) => setProductForm({...productForm, ingredients: e.target.value})}
                        className="w-full px-4 py-3 border border-demiland-200 rounded-xl focus:ring-2 focus:ring-demiland-500 focus:border-demiland-300 bg-white/50 backdrop-blur-sm placeholder-charcoal-400 text-charcoal-800 transition-all duration-300"
                        placeholder="Enter main ingredients"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-charcoal-700 mb-2">Product Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelection}
                        className="w-full px-4 py-3 border border-demiland-200 rounded-xl focus:ring-2 focus:ring-demiland-500 focus:border-demiland-300 bg-white/50 backdrop-blur-sm text-charcoal-800 transition-all duration-300"
                      />
                      {imagePreview && (
                        <div className="mt-3">
                          <img
                            src={imagePreview}
                            alt="Product preview"
                            className="w-24 h-24 object-cover rounded-xl border-2 border-demiland-200 shadow-lg"
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-charcoal-700 mb-2">Stock Quantity</label>
                      <input
                        type="number"
                        min="0"
                        value={productForm.stockQuantity}
                        onChange={(e) => setProductForm({...productForm, stockQuantity: parseInt(e.target.value) || 0})}
                        className="w-full px-4 py-3 border border-demiland-200 rounded-xl focus:ring-2 focus:ring-demiland-500 focus:border-demiland-300 bg-white/50 backdrop-blur-sm placeholder-charcoal-400 text-charcoal-800 transition-all duration-300"
                        placeholder="Enter stock quantity"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={productForm.inStock}
                          onChange={(e) => setProductForm({...productForm, inStock: e.target.checked})}
                          className="w-5 h-5 text-demiland-600 bg-white border-demiland-300 rounded focus:ring-demiland-500 focus:ring-2"
                        />
                        <span className="text-sm font-medium text-charcoal-700">In Stock</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={productForm.featured}
                          onChange={(e) => setProductForm({...productForm, featured: e.target.checked})}
                          className="w-5 h-5 text-demiland-600 bg-white border-demiland-300 rounded focus:ring-demiland-500 focus:ring-2"
                        />
                        <span className="text-sm font-medium text-charcoal-700">Featured Product</span>
                      </label>
                    </div>
                    <div className="flex justify-end space-x-4 pt-6">
                      <button
                        type="button"
                        onClick={() => {
                          setShowProductModal(false);
                          resetProductForm();
                        }}
                        className="px-6 py-3 text-charcoal-600 border border-demiland-200 rounded-xl hover:bg-demiland-50 transition-all duration-300 font-medium min-h-[44px]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-gradient-to-r from-demiland-600 to-demiland-700 text-white rounded-xl hover:from-demiland-700 hover:to-demiland-800 transition-all duration-300 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 min-h-[44px]"
                      >
                        {loading ? 'Creating...' : 'Create Product'}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          )}

          {/* Mobile Product Edit Modal */}
          {showEditModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <motion.div 
                className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl max-w-sm w-full max-h-[90vh] overflow-y-auto border border-demiland-200"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-charcoal-800 mb-2">Edit Product</h3>
                      <div className="flex items-center space-x-2">
                        <ShoppingBag className="w-4 h-4 text-demiland-600" />
                        <span className="text-sm text-demiland-600 font-medium">Update details</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowEditModal(false)}
                      className="text-charcoal-400 hover:text-charcoal-600 p-2 rounded-xl hover:bg-demiland-50 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <form className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-charcoal-700 mb-2">Product Name</label>
                      <input
                        type="text"
                        value={productForm.name}
                        onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                        className="w-full px-4 py-3 border border-demiland-200 rounded-xl focus:ring-2 focus:ring-demiland-500 focus:border-demiland-300 bg-white/50 backdrop-blur-sm placeholder-charcoal-400 text-charcoal-800 transition-all duration-300"
                        placeholder="Enter product name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-charcoal-700 mb-2">Category</label>
                      <select
                        value={productForm.category}
                        onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                        className="w-full px-4 py-3 border border-demiland-200 rounded-xl focus:ring-2 focus:ring-demiland-500 focus:border-demiland-300 bg-white/50 backdrop-blur-sm text-charcoal-800 transition-all duration-300"
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="Eyes">Eyes</option>
                        <option value="Lips">Lips</option>
                        <option value="Complexion">Complexion</option>
                        <option value="Nails">Nails</option>
                        <option value="Tools">Tools</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-charcoal-700 mb-2">Description</label>
                      <textarea
                        value={productForm.description}
                        onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                        rows="3"
                        className="w-full px-4 py-3 border border-demiland-200 rounded-xl focus:ring-2 focus:ring-demiland-500 focus:border-demiland-300 bg-white/50 backdrop-blur-sm placeholder-charcoal-400 text-charcoal-800 transition-all duration-300"
                        placeholder="Describe the product"
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={productForm.inStock}
                          onChange={(e) => setProductForm({...productForm, inStock: e.target.checked})}
                          className="w-5 h-5 text-demiland-600 bg-white border-demiland-300 rounded focus:ring-demiland-500 focus:ring-2"
                        />
                        <span className="text-sm font-medium text-charcoal-700">In Stock</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={productForm.featured}
                          onChange={(e) => setProductForm({...productForm, featured: e.target.checked})}
                          className="w-5 h-5 text-demiland-600 bg-white border-demiland-300 rounded focus:ring-demiland-500 focus:ring-2"
                        />
                        <span className="text-sm font-medium text-charcoal-700">Featured Product</span>
                      </label>
                    </div>
                    <div className="flex justify-end space-x-4 pt-6">
                      <button
                        type="button"
                        onClick={() => setShowEditModal(false)}
                        className="px-6 py-3 text-charcoal-600 border border-demiland-200 rounded-xl hover:bg-demiland-50 transition-all duration-300 font-medium min-h-[44px]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-3 bg-gradient-to-r from-demiland-600 to-demiland-700 text-white rounded-xl hover:from-demiland-700 hover:to-demiland-800 transition-all duration-300 font-medium shadow-lg hover:shadow-xl min-h-[44px]"
                      >
                        Update Product
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </>
      );
    }
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-demiland-50 via-white to-demiland-100 pt-24 md:pt-20">
      <div className="flex h-full min-h-[calc(100vh-5rem)] w-full overflow-x-hidden">
        {/* Mobile/Desktop Responsive Sidebar */}
        <div className={`bg-white border-r border-demiland-200 flex flex-col transition-all duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } w-full max-w-sm md:w-80 fixed left-0 top-20 h-[calc(100vh-5rem)] md:translate-x-0 md:relative md:top-0 md:h-auto z-30 shadow-lg md:shadow-none`}>
        {/* Luxury Brand Header */}
        <div className="p-6 border-b border-demiland-100 flex items-center justify-between bg-gradient-to-r from-demiland-50 to-white">
          <div className="text-center flex-1">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-demiland-600 to-demiland-700 rounded-full flex items-center justify-center">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-light text-charcoal-800">DEMILAND</h2>
            </div>
            <div className="inline-flex items-center space-x-2 bg-demiland-100 px-3 py-1 rounded-full">
              <Sparkles className="w-3 h-3 text-demiland-600" />
              <p className="text-xs font-medium text-demiland-700">Admin Atelier</p>
            </div>
          </div>
          {/* Mobile close button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-2 text-charcoal-600 hover:text-demiland-600 rounded-lg hover:bg-demiland-50 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Luxury Navigation */}
        <nav className="mt-8 px-6 flex-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                // Close sidebar on mobile after selection
                if (window.innerWidth < 768) {
                  setSidebarOpen(false);
                }
              }}
              className={`w-full flex items-center px-5 py-4 text-left rounded-2xl mb-3 transition-all duration-300 ${
                activeTab === item.id 
                  ? 'bg-gradient-to-r from-demiland-600 to-demiland-700 text-white shadow-xl shadow-demiland-200' 
                  : 'text-charcoal-600 hover:bg-gradient-to-r hover:from-demiland-50 hover:to-demiland-100 hover:text-demiland-700 hover:shadow-lg'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 transition-all duration-300 ${
                activeTab === item.id 
                  ? 'bg-white/20 shadow-lg' 
                  : 'bg-gradient-to-br from-demiland-100 to-demiland-200 group-hover:from-demiland-200 group-hover:to-demiland-300'
              }`}>
                <item.icon size={22} className={activeTab === item.id ? 'text-white' : 'text-demiland-600'} />
              </div>
              <div className="flex-1">
                <span className="font-semibold text-base block">{item.name}</span>
                <span className={`text-xs ${
                  activeTab === item.id ? 'text-white/80' : 'text-charcoal-500'
                }`}>
                  {item.description}
                </span>
              </div>
              {activeTab === item.id && (
                <div className="w-2 h-2 bg-white rounded-full" />
              )}
            </button>
          ))}
        </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col w-full min-w-0">
        {/* Responsive Header */}
        <header className="bg-white shadow-sm border-b border-demiland-200 px-4 md:px-8 py-4 md:py-6 flex-shrink-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-gray-800 mr-3"
              >
                <Menu size={20} />
              </button>
              <div>
                <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
                  {activeTab === 'overview' ? 'Dashboard Overview' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </h1>
                <p className="text-gray-600 mt-1 text-sm md:text-base">
                {activeTab === 'overview' ? 'Monitor your business metrics and activities' : 
                 activeTab === 'users' ? 'Manage user accounts and permissions' :
                 'Manage your product catalog'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Debug refresh button */}
              {process.env.NODE_ENV === 'development' && (
                <button 
                  onClick={refreshData}
                  className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                >
                  🔄 Refresh Data
                </button>
              )}
              <span className="text-sm text-gray-600">
                {user?.first_name || 'Admin user name'}
              </span>
            </div>
          </div>
        </header>

        {/* Responsive Content Area */}
        <main className="p-4 md:p-8 overflow-y-auto overflow-x-hidden flex-1 w-full">
          <TabContent />
        </main>
        </div>
      </div>
      
      {/* Mobile overlay when sidebar is open */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Responsive Product Creation Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <motion.div 
            className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl max-w-sm md:max-w-lg lg:max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-demiland-200"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6 md:p-8 pt-24 md:pt-8">
              <div className="flex justify-between items-center mb-6 md:mb-8">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-charcoal-800 mb-2">Add New Product</h3>
                  <div className="flex items-center space-x-2">
                    <ShoppingBag className="w-4 h-4 text-demiland-600" />
                    <span className="text-sm text-demiland-600 font-medium">Luxury collection management</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowProductModal(false);
                    resetProductForm();
                  }}
                  className="text-charcoal-400 hover:text-charcoal-600 p-2 rounded-xl hover:bg-demiland-50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleCreateProduct} className="space-y-6 md:space-y-8">
                {/* Responsive form grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-charcoal-700 mb-2">Product Name</label>
                    <input
                      type="text"
                      value={productForm.name}
                      onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                      className="w-full px-4 py-3 border border-demiland-200 rounded-xl focus:ring-2 focus:ring-demiland-500 focus:border-demiland-300 bg-white/50 backdrop-blur-sm placeholder-charcoal-400 text-charcoal-800 transition-all duration-300"
                      placeholder="Enter product name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-charcoal-700 mb-2">Category</label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                      className="w-full px-4 py-3 border border-demiland-200 rounded-xl focus:ring-2 focus:ring-demiland-500 focus:border-demiland-300 bg-white/50 backdrop-blur-sm text-charcoal-800 transition-all duration-300"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Eyes">Eyes</option>
                      <option value="Lips">Lips</option>
                      <option value="Complexion">Complexion</option>
                      <option value="Nails">Nails</option>
                      <option value="Tools">Tools</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-2">Description</label>
                  <textarea
                    value={productForm.description}
                    onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                    rows="3"
                    className="w-full px-4 py-3 border border-demiland-200 rounded-xl focus:ring-2 focus:ring-demiland-500 focus:border-demiland-300 bg-white/50 backdrop-blur-sm placeholder-charcoal-400 text-charcoal-800 transition-all duration-300"
                    placeholder="Describe the luxury product"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-2">Features</label>
                  <textarea
                    value={featuresInput}
                    onChange={(e) => setFeaturesInput(e.target.value)}
                    rows="4"
                    className="w-full px-4 py-3 border border-demiland-200 rounded-xl focus:ring-2 focus:ring-demiland-500 focus:border-demiland-300 bg-white/50 backdrop-blur-sm placeholder-charcoal-400 text-charcoal-800 transition-all duration-300"
                    placeholder="Enter luxury features (one per line)&#10;Example:&#10;Waterproof formula&#10;Long-lasting wear&#10;Premium application"
                  />
                  <p className="text-xs text-charcoal-500 mt-2">Enter each feature on a new line</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-2">Ingredients</label>
                  <input
                    type="text"
                    value={productForm.ingredients}
                    onChange={(e) => setProductForm({...productForm, ingredients: e.target.value})}
                    className="w-full px-4 py-3 border border-demiland-200 rounded-xl focus:ring-2 focus:ring-demiland-500 focus:border-demiland-300 bg-white/50 backdrop-blur-sm placeholder-charcoal-400 text-charcoal-800 transition-all duration-300"
                    placeholder="Enter premium ingredients"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-2">Product Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelection}
                    className="w-full px-4 py-3 border border-demiland-200 rounded-xl focus:ring-2 focus:ring-demiland-500 focus:border-demiland-300 bg-white/50 backdrop-blur-sm text-charcoal-800 transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-demiland-600 file:text-white hover:file:bg-demiland-700"
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Product preview"
                        className="w-24 h-24 object-cover rounded-xl border-2 border-demiland-200 shadow-sm"
                      />
                    </div>
                  )}
                  {uploadingImage && (
                    <div className="mt-2 text-sm text-demiland-600 font-medium">
                      Uploading image...
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-2">Stock Quantity</label>
                  <input
                    type="number"
                    min="0"
                    value={productForm.stockQuantity}
                    onChange={(e) => setProductForm({...productForm, stockQuantity: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-3 border border-demiland-200 rounded-xl focus:ring-2 focus:ring-demiland-500 focus:border-demiland-300 bg-white/50 backdrop-blur-sm placeholder-charcoal-400 text-charcoal-800 transition-all duration-300"
                    placeholder="Enter stock quantity"
                  />
                </div>
                <div className="flex items-center space-x-6">
                  <label className="flex items-center group cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.inStock}
                      onChange={(e) => setProductForm({...productForm, inStock: e.target.checked})}
                      className="mr-3 w-5 h-5 text-demiland-600 bg-white border-2 border-demiland-300 rounded focus:ring-demiland-500 focus:ring-2 transition-colors"
                    />
                    <span className="text-sm font-medium text-charcoal-700 group-hover:text-demiland-600 transition-colors">In Stock</span>
                  </label>
                  <label className="flex items-center group cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.featured}
                      onChange={(e) => setProductForm({...productForm, featured: e.target.checked})}
                      className="mr-3 w-5 h-5 text-demiland-600 bg-white border-2 border-demiland-300 rounded focus:ring-demiland-500 focus:ring-2 transition-colors"
                    />
                    <span className="text-sm font-medium text-charcoal-700 group-hover:text-demiland-600 transition-colors">Featured Product</span>
                  </label>
                </div>
                <div className="flex justify-end space-x-4 pt-6 border-t border-demiland-100">
                  <button
                    type="button"
                    onClick={() => {
                      setShowProductModal(false);
                      resetProductForm();
                    }}
                    className="px-6 py-3 text-charcoal-600 border-2 border-charcoal-300 rounded-xl hover:bg-charcoal-50 hover:border-charcoal-400 transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-gradient-to-r from-demiland-600 to-demiland-700 text-white rounded-xl hover:from-demiland-700 hover:to-demiland-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl flex items-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Create Product</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* Product Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <motion.div 
            className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl max-w-sm md:max-w-lg lg:max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-demiland-200"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-6 md:mb-8">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-charcoal-800 mb-2">Edit Product</h3>
                  <div className="flex items-center space-x-2">
                    <Edit className="w-4 h-4 text-demiland-600" />
                    <span className="text-sm text-demiland-600 font-medium">Update luxury product details</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    resetProductForm();
                  }}
                  className="text-charcoal-400 hover:text-charcoal-600 p-2 rounded-xl hover:bg-demiland-50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleUpdateProduct} className="space-y-6 md:space-y-8">
                {/* Responsive form grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-charcoal-700 mb-2">Product Name</label>
                    <input
                      type="text"
                      value={productForm.name}
                      onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                      className="w-full px-4 py-3 border border-demiland-200 rounded-xl focus:ring-2 focus:ring-demiland-500 focus:border-demiland-300 bg-white/50 backdrop-blur-sm placeholder-charcoal-400 text-charcoal-800 transition-all duration-300"
                      placeholder="Enter product name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-charcoal-700 mb-2">Category</label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                      className="w-full px-4 py-3 border border-demiland-200 rounded-xl focus:ring-2 focus:ring-demiland-500 focus:border-demiland-300 bg-white/50 backdrop-blur-sm text-charcoal-800 transition-all duration-300"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Eyes">Eyes</option>
                      <option value="Lips">Lips</option>
                      <option value="Complexion">Complexion</option>
                      <option value="Nails">Nails</option>
                      <option value="Tools">Tools</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-2">Description</label>
                  <textarea
                    value={productForm.description}
                    onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                    rows="3"
                    className="w-full px-4 py-3 border border-demiland-200 rounded-xl focus:ring-2 focus:ring-demiland-500 focus:border-demiland-300 bg-white/50 backdrop-blur-sm placeholder-charcoal-400 text-charcoal-800 transition-all duration-300"
                    placeholder="Describe the luxury product"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-2">Features</label>
                  <textarea
                    value={featuresInput}
                    onChange={(e) => setFeaturesInput(e.target.value)}
                    rows="4"
                    className="w-full px-4 py-3 border border-demiland-200 rounded-xl focus:ring-2 focus:ring-demiland-500 focus:border-demiland-300 bg-white/50 backdrop-blur-sm placeholder-charcoal-400 text-charcoal-800 transition-all duration-300"
                    placeholder="Enter luxury features (one per line)&#10;Example:&#10;Waterproof formula&#10;Long-lasting wear&#10;Premium application"
                  />
                  <p className="text-xs text-charcoal-500 mt-2">Enter each feature on a new line</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-2">Ingredients</label>
                  <input
                    type="text"
                    value={productForm.ingredients}
                    onChange={(e) => setProductForm({...productForm, ingredients: e.target.value})}
                    className="w-full px-4 py-3 border border-demiland-200 rounded-xl focus:ring-2 focus:ring-demiland-500 focus:border-demiland-300 bg-white/50 backdrop-blur-sm placeholder-charcoal-400 text-charcoal-800 transition-all duration-300"
                    placeholder="Enter premium ingredients"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-2">Product Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelection}
                    className="w-full px-4 py-3 border border-demiland-200 rounded-xl focus:ring-2 focus:ring-demiland-500 focus:border-demiland-300 bg-white/50 backdrop-blur-sm text-charcoal-800 transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-demiland-600 file:text-white hover:file:bg-demiland-700"
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Product preview"
                        className="w-24 h-24 object-cover rounded-xl border-2 border-demiland-200 shadow-sm"
                      />
                    </div>
                  )}
                  {uploadingImage && (
                    <div className="mt-2 text-sm text-demiland-600 font-medium">
                      Uploading image...
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-2">Stock Quantity</label>
                  <input
                    type="number"
                    min="0"
                    value={productForm.stockQuantity}
                    onChange={(e) => setProductForm({...productForm, stockQuantity: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-3 border border-demiland-200 rounded-xl focus:ring-2 focus:ring-demiland-500 focus:border-demiland-300 bg-white/50 backdrop-blur-sm placeholder-charcoal-400 text-charcoal-800 transition-all duration-300"
                    placeholder="Enter stock quantity"
                  />
                </div>
                <div className="flex items-center space-x-6">
                  <label className="flex items-center group cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.inStock}
                      onChange={(e) => setProductForm({...productForm, inStock: e.target.checked})}
                      className="mr-3 w-5 h-5 text-demiland-600 bg-white border-2 border-demiland-300 rounded focus:ring-demiland-500 focus:ring-2 transition-colors"
                    />
                    <span className="text-sm font-medium text-charcoal-700 group-hover:text-demiland-600 transition-colors">In Stock</span>
                  </label>
                  <label className="flex items-center group cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.featured}
                      onChange={(e) => setProductForm({...productForm, featured: e.target.checked})}
                      className="mr-3 w-5 h-5 text-demiland-600 bg-white border-2 border-demiland-300 rounded focus:ring-demiland-500 focus:ring-2 transition-colors"
                    />
                    <span className="text-sm font-medium text-charcoal-700 group-hover:text-demiland-600 transition-colors">Featured Product</span>
                  </label>
                </div>
                <div className="flex justify-end space-x-4 pt-6 border-t border-demiland-100">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      resetProductForm();
                    }}
                    className="px-6 py-3 text-charcoal-600 border-2 border-charcoal-300 rounded-xl hover:bg-charcoal-50 hover:border-charcoal-400 transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-gradient-to-r from-demiland-600 to-demiland-700 text-white rounded-xl hover:from-demiland-700 hover:to-demiland-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl flex items-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <Edit className="w-4 h-4" />
                        <span>Update Product</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* User Creation Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <motion.div 
            className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-demiland-200"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-6 md:mb-8">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-charcoal-800 mb-2">Add New Customer</h3>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-demiland-600" />
                    <span className="text-sm text-demiland-600 font-medium">Create new customer account</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowUserModal(false);
                    resetUserForm();
                  }}
                  className="text-charcoal-400 hover:text-charcoal-600 p-2 rounded-xl hover:bg-demiland-50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={async (e) => {
                e.preventDefault();
                try {
                  console.log('🚀 Creating user via admin endpoint:', userForm);
                  
                  // Create user via admin endpoint
                  const response = await authService.makeRequest('/auth/admin/users', {
                    method: 'POST',
                    body: JSON.stringify({
                      email: userForm.email,
                      password: userForm.password,
                      first_name: userForm.first_name,
                      last_name: userForm.last_name,
                      role: userForm.role,
                      is_active: userForm.is_active
                    })
                  });
                  
                  if (!response.success) {
                    throw new Error(response.message);
                  }
                  
                  console.log('✅ User created successfully:', response.data.id);
                  showNotification('Customer created successfully!', 'success');
                  
                  setShowUserModal(false);
                  resetUserForm();
                  
                  // Refresh data to show new user
                  statsLoadedRef.current = false;
                  fetchDashboardStats();
                  
                } catch (error) {
                  console.error('❌ Failed to create user:', error);
                  showNotification('Failed to create customer: ' + error.message, 'error');
                }
              }} className="space-y-6 md:space-y-8">
                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-2">First Name</label>
                  <input
                    type="text"
                    value={userForm.first_name}
                    onChange={(e) => setUserForm({...userForm, first_name: e.target.value})}
                    className="w-full px-4 py-3 border border-demiland-200 rounded-xl focus:ring-2 focus:ring-demiland-500 focus:border-demiland-300 bg-white/50 backdrop-blur-sm placeholder-charcoal-400 text-charcoal-800 transition-all duration-300"
                    placeholder="Enter first name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={userForm.last_name}
                    onChange={(e) => setUserForm({...userForm, last_name: e.target.value})}
                    className="w-full px-4 py-3 border border-demiland-200 rounded-xl focus:ring-2 focus:ring-demiland-500 focus:border-demiland-300 bg-white/50 backdrop-blur-sm placeholder-charcoal-400 text-charcoal-800 transition-all duration-300"
                    placeholder="Enter last name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                    className="w-full px-4 py-3 border border-demiland-200 rounded-xl focus:ring-2 focus:ring-demiland-500 focus:border-demiland-300 bg-white/50 backdrop-blur-sm placeholder-charcoal-400 text-charcoal-800 transition-all duration-300"
                    placeholder="customer@email.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-2">Password</label>
                  <input
                    type="password"
                    value={userForm.password}
                    onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                    className="w-full px-4 py-3 border border-demiland-200 rounded-xl focus:ring-2 focus:ring-demiland-500 focus:border-demiland-300 bg-white/50 backdrop-blur-sm placeholder-charcoal-400 text-charcoal-800 transition-all duration-300"
                    placeholder="Enter secure password (min 6 characters)"
                    required
                    minLength="6"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-2">Account Role</label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                    className="w-full px-4 py-3 border border-demiland-200 rounded-xl focus:ring-2 focus:ring-demiland-500 focus:border-demiland-300 bg-white/50 backdrop-blur-sm text-charcoal-800 transition-all duration-300"
                  >
                    <option value="user">Customer</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={userForm.is_active}
                    onChange={(e) => setUserForm({...userForm, is_active: e.target.checked})}
                    className="w-5 h-5 text-demiland-600 bg-white border-demiland-300 rounded focus:ring-demiland-500 focus:ring-2"
                  />
                  <span className="text-sm font-medium text-charcoal-700">Active Account</span>
                </div>
                <div className="flex justify-end space-x-4 pt-6 border-t border-demiland-100">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserModal(false);
                      resetUserForm();
                    }}
                    className="px-6 py-3 text-charcoal-600 border-2 border-charcoal-300 rounded-xl hover:bg-charcoal-50 hover:border-charcoal-400 transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-demiland-600 to-demiland-700 text-white rounded-xl hover:from-demiland-700 hover:to-demiland-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl flex items-center space-x-2"
                  >
                    <Users className="w-4 h-4" />
                    <span>Create Customer</span>
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* User Edit Modal */}
      {showUserEditModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start sm:items-center justify-center z-[9999] pt-4 sm:pt-0">
          <motion.div 
            className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl max-w-sm sm:max-w-md w-full mx-2 sm:mx-4 border border-demiland-200 max-h-[95vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4 sm:p-8">
              <div className="flex justify-between items-center mb-4 sm:mb-8">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-charcoal-800 mb-2">Edit Customer</h3>
                  <div className="flex items-center space-x-2">
                    <UserCheck className="w-4 h-4 text-demiland-600" />
                    <span className="text-sm text-demiland-600 font-medium">Update account details</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowUserEditModal(false);
                    resetUserForm();
                  }}
                  className="text-charcoal-400 hover:text-charcoal-600 p-2 rounded-xl hover:bg-demiland-50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={async (e) => {
                e.preventDefault();
                try {
                  console.log('Updating user:', selectedUser.id, userForm);
                  
                  // Update user via backend API
                  const updateData = {
                    first_name: userForm.first_name,
                    last_name: userForm.last_name,
                    email: userForm.email,
                    role: userForm.role,
                    is_active: userForm.is_active
                  };
                  
                  // Add password if provided
                  if (userForm.password && userForm.password.trim()) {
                    updateData.password = userForm.password;
                  }
                  
                  const response = await authService.makeRequest(`/auth/users/${selectedUser.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(updateData)
                  });
                  
                  if (!response.success) {
                    throw new Error(response.message);
                  }
                  
                  console.log('✅ User updated successfully:', response.data);
                  showNotification('User updated successfully!', 'success');
                  setShowUserEditModal(false);
                  resetUserForm();
                  
                  // Refresh data to show updated user
                  statsLoadedRef.current = false;
                  fetchDashboardStats();
                  
                } catch (error) {
                  console.error('❌ Failed to update user:', error);
                  showNotification('Failed to update user: ' + error.message, 'error');
                }
              }} className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-charcoal-700 mb-1 sm:mb-2">First Name</label>
                  <input
                    type="text"
                    value={userForm.first_name}
                    onChange={(e) => setUserForm({...userForm, first_name: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-demiland-200 rounded-xl focus:ring-2 focus:ring-demiland-500 focus:border-demiland-300 bg-white/50 backdrop-blur-sm placeholder-charcoal-400 text-charcoal-800 transition-all duration-300"
                    placeholder="Enter first name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-charcoal-700 mb-1 sm:mb-2">Last Name</label>
                  <input
                    type="text"
                    value={userForm.last_name}
                    onChange={(e) => setUserForm({...userForm, last_name: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-demiland-200 rounded-xl focus:ring-2 focus:ring-demiland-500 focus:border-demiland-300 bg-white/50 backdrop-blur-sm placeholder-charcoal-400 text-charcoal-800 transition-all duration-300"
                    placeholder="Enter last name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-charcoal-700 mb-1 sm:mb-2">Email Address</label>
                  <input
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-demiland-200 rounded-xl focus:ring-2 focus:ring-demiland-500 focus:border-demiland-300 bg-white/50 backdrop-blur-sm placeholder-charcoal-400 text-charcoal-800 transition-all duration-300"
                    placeholder="customer@email.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-charcoal-700 mb-1 sm:mb-2">New Password (Optional)</label>
                  <input
                    type="password"
                    value={userForm.password}
                    onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-demiland-200 rounded-xl focus:ring-2 focus:ring-demiland-500 focus:border-demiland-300 bg-white/50 backdrop-blur-sm placeholder-charcoal-400 text-charcoal-800 transition-all duration-300"
                    placeholder="Leave blank to keep current password"
                    minLength="6"
                  />
                  <p className="text-xs text-charcoal-500 mt-1">
                    If provided, user will receive a password reset email
                  </p>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-charcoal-700 mb-1 sm:mb-2">Account Role</label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-demiland-200 rounded-xl focus:ring-2 focus:ring-demiland-500 focus:border-demiland-300 bg-white/50 backdrop-blur-sm text-charcoal-800 transition-all duration-300"
                  >
                    <option value="user">Customer</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={userForm.is_active}
                    onChange={(e) => setUserForm({...userForm, is_active: e.target.checked})}
                    className="w-5 h-5 text-demiland-600 bg-white border-demiland-300 rounded focus:ring-demiland-500 focus:ring-2"
                  />
                  <span className="text-sm font-medium text-charcoal-700">Active Account</span>
                </div>
                <div className="flex justify-end space-x-2 sm:space-x-4 pt-4 sm:pt-8">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserEditModal(false);
                      resetUserForm();
                    }}
                    className="px-4 sm:px-6 py-2 sm:py-3 text-charcoal-600 border border-demiland-200 rounded-xl hover:bg-demiland-50 transition-all duration-300 font-medium text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-demiland-600 to-demiland-700 text-white rounded-xl hover:from-demiland-700 hover:to-demiland-800 transition-all duration-300 font-medium shadow-lg hover:shadow-xl text-sm sm:text-base"
                  >
                    Update Customer
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;