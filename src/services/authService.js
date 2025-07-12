import apiService from './api.js';
import { supabase, authHelpers, dbHelpers, TABLES } from './supabase.js';

// Authentication Service for DEMILAND - handles all auth-related API calls
// Updated to work with Supabase Auth
class AuthService {
  constructor() {
    this.currentUser = null;
    this.authListeners = [];
    this.useSupabase = true; // Use Supabase Auth by default
    
    // Listen to Supabase auth changes
    if (this.useSupabase) {
      this.setupSupabaseAuthListener();
    }
  }

  // Set up Supabase auth state listener
  setupSupabaseAuthListener() {
    supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Supabase auth event:', event, session);
      console.log('📧 Email confirmation status:', session?.user?.email_confirmed_at);
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'SIGNED_UP') {
        if (session?.user) {
          console.log('🔐 User signed in:', session.user);
          console.log('📧 Email confirmed at:', session.user.email_confirmed_at);
          console.log('🔍 About to query users table for ID:', session.user.id);
          
          try {
            // First check role from Supabase Auth user metadata (primary source)
            const roleFromAuth = session.user.user_metadata?.role || session.user.raw_user_meta_data?.role;
            console.log('🔐 Role from Supabase Auth metadata:', roleFromAuth);
            
            // Set user with role from auth metadata
            this.currentUser = {
              ...session.user,
              role: roleFromAuth || 'user',
              first_name: session.user.user_metadata?.first_name || '',
              last_name: session.user.user_metadata?.last_name || '',
              email: session.user.email
            };
            
            console.log('✅ User set from Supabase Auth with role:', this.currentUser.role);
            
            // For new signups, ensure profile exists in public.users
            if (event === 'SIGNED_UP') {
              console.log('🆕 New signup detected, ensuring profile exists...');
              try {
                await this.createUserProfile(session.user);
                console.log('✅ Profile creation completed for new user');
              } catch (profileError) {
                console.warn('⚠️ Profile creation failed for new user (non-critical):', profileError);
                // Continue - user can still use the app with auth-only data
              }
            }
            
            // For all events, try to get additional profile from database (non-blocking with timeout)
            try {
              const profilePromise = supabase
                .from(TABLES.USERS)
                .select('*')
                .eq('id', session.user.id)
                .single();
                
              const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Database query timeout')), 3000);
              });
              
              const { data: profile, error } = await Promise.race([profilePromise, timeoutPromise]);
                
              if (!error && profile) {
                console.log('📊 Found additional profile data:', profile);
                // Merge profile data but keep role from auth metadata as primary
                this.currentUser = {
                  ...this.currentUser,
                  ...profile,
                  role: roleFromAuth || profile.role || 'user' // Auth metadata takes precedence
                };
              } else if (event !== 'SIGNED_UP') {
                // For existing users (not new signups), try to create missing profile
                console.log('🔧 No profile found for existing user, creating one...');
                try {
                  await this.createUserProfile(session.user);
                  console.log('✅ Missing profile created for existing user');
                } catch (profileError) {
                  console.warn('⚠️ Profile creation failed (non-critical):', profileError);
                }
              }
            } catch (dbError) {
              console.log('ℹ️ Database profile query failed (non-critical):', dbError.message);
              // Continue with auth-only data - this is fine
            }
            
            console.log('👤 Setting current user:', this.currentUser);
            this.notifyAuthChange('login', this.currentUser);
            console.log('✅ Auth change notification sent');
          } catch (error) {
            console.error('💥 Error in auth listener:', error);
            // Set fallback user to prevent hanging
            this.currentUser = {
              ...session.user,
              role: 'user'
            };
            this.notifyAuthChange('login', this.currentUser);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        this.currentUser = null;
        this.notifyAuthChange('logout', null);
      }
    });
  }

  // Create user profile in database
  async createUserProfile(authUser) {
    try {
      console.log('📝 Creating user profile for:', authUser);
      
      const profileData = {
        id: authUser.id,
        email: authUser.email,
        first_name: authUser.user_metadata?.first_name || '',
        last_name: authUser.user_metadata?.last_name || '',
        phone: authUser.user_metadata?.phone || null,
        role: authUser.user_metadata?.role || 'user',
        email_verified: true, // Email verification is disabled
        is_active: true,
        password_hash: 'managed_by_supabase_auth' // Supabase Auth handles password hashing
      };

      console.log('📊 Profile data to insert:', profileData);

      const { data, error } = await supabase
        .from(TABLES.USERS)
        .insert([profileData])
        .select()
        .single();

      console.log('📋 Insert result:', { data, error });

      if (error) {
        console.error('❌ Database error creating user profile:', error);
        return { success: false, data: null, error };
      }

      console.log('✅ User profile created successfully:', data);
      
      this.currentUser = {
        ...authUser,
        ...data
      };
      
      return { success: true, data, error: null };
    } catch (error) {
      console.error('💥 Exception creating user profile:', error);
      return { success: false, data: null, error };
    }
  }

  // LOGIN & REGISTRATION
  
  // User login
  async login(credentials) {
    if (this.useSupabase) {
      try {
        console.log('🔑 Attempting login for:', credentials.email);
        
        // Add timeout to Supabase auth call
        const authPromise = authHelpers.signIn(
          credentials.email, 
          credentials.password
        );
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Authentication timeout - please check your network connection')), 10000);
        });
        
        const { data, error } = await Promise.race([authPromise, timeoutPromise]);
        
        if (error) {
          console.error('❌ Login error:', error);
          throw new Error(error.message);
        }
        
        console.log('✅ Login successful:', data.user?.email);
        console.log('📧 Email confirmed at:', data.user?.email_confirmed_at);
        
        // User data will be set via auth state listener
        return {
          success: true,
          data: {
            user: data.user,
            session: data.session
          },
          message: 'Login successful'
        };
      } catch (error) {
        console.error('Supabase login error:', error);
        
        // Handle email confirmation error specifically
        if (error.message && error.message.includes('Email not confirmed')) {
          return {
            success: false,
            error: 'email_not_confirmed',
            message: 'Please check your email and click the confirmation link, or contact support if you need assistance.'
          };
        }
        
        return {
          success: false,
          error: error.message,
          message: error.message
        };
      }
    }

    // Fallback to traditional API
    try {
      const response = await apiService.post('/auth/login', credentials);
      
      if (response.success) {
        // Store JWT token
        apiService.setToken(response.data.token);
        
        // Store user data
        this.currentUser = response.data.user;
        localStorage.setItem('demiland_user', JSON.stringify(this.currentUser));
        
        // Notify auth listeners
        this.notifyAuthChange('login', this.currentUser);
        
        return response;
      }
      
      throw new Error(response.message || 'Login failed');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // User registration
  async register(userData) {
    if (this.useSupabase) {
      try {
        console.log('📝 Attempting registration for:', userData.email);
        const { data, error } = await authHelpers.signUp(
          userData.email,
          userData.password,
          {
            first_name: userData.firstName || userData.first_name,
            last_name: userData.lastName || userData.last_name,
            phone: userData.phone
          }
        );
        
        if (error) {
          console.error('❌ Registration error:', error);
          throw new Error(error.message);
        }
        
        console.log('📊 Registration response:', { user: data.user, session: data.session });
        console.log('📧 Email confirmed at:', data.user?.email_confirmed_at);
        
        // User profile will be created via auth state listener
        // Check if user has session (logged in) or needs email confirmation
        if (data.session) {
          return {
            success: true,
            data: {
              user: data.user,
              session: data.session
            },
            message: 'Registration successful. You are now logged in!'
          };
        } else {
          // Email confirmation required
          return {
            success: true,
            data: {
              user: data.user,
              session: null
            },
            message: 'Registration successful. Please check your email to confirm your account before signing in.'
          };
        }
      } catch (error) {
        console.error('Supabase registration error:', error);
        
        // Handle specific registration errors
        if (error.message && error.message.includes('already registered')) {
          return {
            success: false,
            error: 'user_already_exists',
            message: 'This email is already registered. Please try logging in instead.'
          };
        }
        
        return {
          success: false,
          error: error.message,
          message: error.message
        };
      }
    }

    // Fallback to traditional API
    try {
      const response = await apiService.post('/auth/register', userData);
      
      if (response.success) {
        // Store JWT token
        apiService.setToken(response.data.token);
        
        // Store user data
        this.currentUser = response.data.user;
        localStorage.setItem('demiland_user', JSON.stringify(this.currentUser));
        
        // Notify auth listeners
        this.notifyAuthChange('register', this.currentUser);
        
        return response;
      }
      
      throw new Error(response.message || 'Registration failed');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // User logout
  async logout() {
    if (this.useSupabase) {
      try {
        const { error } = await authHelpers.signOut();
        
        if (error) {
          console.error('Supabase logout error:', error);
          // Even if logout fails, clear local state
        }
        
        // Clear current user (auth state listener will handle this)
        this.currentUser = null;
        
        return { success: true, message: 'Logout successful' };
      } catch (error) {
        console.error('Logout error:', error);
        // Clear local state even if logout fails
        this.currentUser = null;
        return { success: true, message: 'Logout completed' };
      }
    }

    // Fallback to traditional API
    try {
      // Call logout endpoint (optional - for server-side session cleanup)
      await apiService.post('/auth/logout').catch(() => {
        // Ignore logout endpoint errors
      });
      
      // Clear local storage
      apiService.clearToken();
      localStorage.removeItem('demiland_user');
      
      // Clear current user
      this.currentUser = null;
      
      // Notify auth listeners
      this.notifyAuthChange('logout', null);
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  // TOKEN MANAGEMENT
  
  // Refresh JWT token
  async refreshToken() {
    try {
      const response = await apiService.post('/auth/refresh');
      
      if (response.success) {
        apiService.setToken(response.data.token);
        return response;
      }
      
      throw new Error('Token refresh failed');
    } catch (error) {
      console.error('Token refresh error:', error);
      // If refresh fails, logout user
      await this.logout();
      throw error;
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    if (this.useSupabase) {
      return !!this.currentUser;
    }
    
    const token = apiService.getStoredToken();
    return !!token && !!this.currentUser;
  }

  // Get current user
  getCurrentUser() {
    if (this.useSupabase) {
      return this.currentUser;
    }
    
    if (!this.currentUser) {
      const storedUser = localStorage.getItem('demiland_user');
      if (storedUser) {
        try {
          this.currentUser = JSON.parse(storedUser);
        } catch (error) {
          console.error('Error parsing stored user:', error);
          localStorage.removeItem('demiland_user');
        }
      }
    }
    return this.currentUser;
  }

  // Check user role
  hasRole(role) {
    const user = this.getCurrentUser();
    return user && user.role === role;
  }

  // Check if user is admin
  isAdmin() {
    return this.hasRole('admin') || this.hasRole('super-admin');
  }

  // USER PROFILE MANAGEMENT
  
  // Get user profile
  async getUserProfile() {
    try {
      const response = await apiService.get('/user/profile');
      
      if (response.success) {
        this.currentUser = response.data;
        localStorage.setItem('demiland_user', JSON.stringify(this.currentUser));
        
        // Notify auth listeners
        this.notifyAuthChange('profile_update', this.currentUser);
      }
      
      return response;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  // Update user profile
  async updateUserProfile(profileData) {
    try {
      const response = await apiService.put('/user/profile', profileData);
      
      if (response.success) {
        this.currentUser = { ...this.currentUser, ...response.data };
        localStorage.setItem('demiland_user', JSON.stringify(this.currentUser));
        
        // Notify auth listeners
        this.notifyAuthChange('profile_update', this.currentUser);
      }
      
      return response;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  // Change password
  async changePassword(passwordData) {
    try {
      const response = await apiService.put('/user/change-password', passwordData);
      return response;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }

  // Upload profile picture
  async uploadProfilePicture(file) {
    try {
      const formData = new FormData();
      formData.append('profile_picture', file);
      
      const response = await apiService.upload('/user/profile-picture', formData);
      
      if (response.success) {
        this.currentUser.profile_picture = response.data.profile_picture;
        localStorage.setItem('demiland_user', JSON.stringify(this.currentUser));
        
        // Notify auth listeners
        this.notifyAuthChange('profile_update', this.currentUser);
      }
      
      return response;
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      throw error;
    }
  }

  // PASSWORD RESET
  
  // Request password reset
  async requestPasswordReset(email) {
    try {
      const response = await apiService.post('/auth/forgot-password', { email });
      return response;
    } catch (error) {
      console.error('Error requesting password reset:', error);
      throw error;
    }
  }

  // Reset password with token
  async resetPassword(token, newPassword) {
    try {
      const response = await apiService.post('/auth/reset-password', {
        token,
        password: newPassword
      });
      return response;
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  }

  // EMAIL VERIFICATION REMOVED
  // Email verification is disabled - users are automatically logged in after registration

  // ADMIN OPERATIONS
  
  // Get all users (Admin only)
  async getAllUsers(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.search) queryParams.append('search', params.search);
      if (params.role) queryParams.append('role', params.role);
      if (params.status) queryParams.append('status', params.status);
      
      const queryString = queryParams.toString();
      const endpoint = `/admin/users${queryString ? `?${queryString}` : ''}`;
      
      return await apiService.get(endpoint);
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  // Update user role (Admin only)
  async updateUserRole(userId, role) {
    try {
      const response = await apiService.patch(`/admin/users/${userId}/role`, { role });
      return response;
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  }

  // Deactivate user (Admin only)
  async deactivateUser(userId) {
    try {
      const response = await apiService.patch(`/admin/users/${userId}/deactivate`);
      return response;
    } catch (error) {
      console.error('Error deactivating user:', error);
      throw error;
    }
  }

  // Activate user (Admin only)
  async activateUser(userId) {
    try {
      const response = await apiService.patch(`/admin/users/${userId}/activate`);
      return response;
    } catch (error) {
      console.error('Error activating user:', error);
      throw error;
    }
  }

  // Delete user (Admin only)
  async deleteUser(userId) {
    try {
      const response = await apiService.delete(`/admin/users/${userId}`);
      return response;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  // AUTHENTICATION LISTENERS
  
  // Add auth change listener
  onAuthChange(callback) {
    this.authListeners.push(callback);
    
    // Return cleanup function
    return () => {
      this.authListeners = this.authListeners.filter(listener => listener !== callback);
    };
  }

  // Notify auth change listeners
  notifyAuthChange(action, userData) {
    this.authListeners.forEach(listener => {
      try {
        listener({ action, user: userData });
      } catch (error) {
        console.error('Error in auth listener:', error);
      }
    });
  }

  // INITIALIZATION
  
  // Initialize auth service (check for existing session)
  async initialize() {
    if (this.useSupabase) {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting Supabase session:', error);
          return false;
        }
        
        if (session?.user) {
          console.log('🔄 Initializing with existing session:', session.user.email);
          
          // Get role from Supabase Auth user metadata (primary source)
          const roleFromAuth = session.user.user_metadata?.role || session.user.raw_user_meta_data?.role;
          console.log('🔐 Role from Auth metadata during init:', roleFromAuth);
          
          // Set user with role from auth metadata
          this.currentUser = {
            ...session.user,
            role: roleFromAuth || 'user',
            first_name: session.user.user_metadata?.first_name || '',
            last_name: session.user.user_metadata?.last_name || '',
            email: session.user.email
          };
          
          console.log('✅ Initialized user with role:', this.currentUser.role);
          
          // Optional: Try to get additional profile from database (non-blocking with timeout)
          try {
            const profilePromise = supabase
              .from(TABLES.USERS)
              .select('*')
              .eq('id', session.user.id)
              .single();
              
            const timeoutPromise = new Promise((_, reject) => {
              setTimeout(() => reject(new Error('Database query timeout')), 3000);
            });
            
            const { data: profile, error: profileError } = await Promise.race([profilePromise, timeoutPromise]);
            
            if (!profileError && profile) {
              console.log('📊 Merged additional profile data during init');
              this.currentUser = {
                ...this.currentUser,
                ...profile,
                role: roleFromAuth || profile.role || 'user' // Auth metadata takes precedence
              };
            }
          } catch (dbError) {
            console.log('ℹ️ Database profile query failed during init (non-critical):', dbError.message);
          }
          
          return true;
        }
        
        return false;
      } catch (error) {
        console.error('Error initializing Supabase auth service:', error);
        return false;
      }
    }

    // Fallback to traditional API
    try {
      const token = apiService.getStoredToken();
      const storedUser = localStorage.getItem('demiland_user');
      
      if (token && storedUser) {
        try {
          this.currentUser = JSON.parse(storedUser);
          
          // Verify token is still valid
          await this.getUserProfile();
          
          return true;
        } catch (error) {
          // Token expired or invalid, clear storage
          await this.logout();
          return false;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error initializing auth service:', error);
      return false;
    }
  }
}

// Create singleton instance
const authService = new AuthService();

export default authService;

// Export specific methods for convenience
export const {
  login,
  register,
  logout,
  isAuthenticated,
  getCurrentUser,
  hasRole,
  isAdmin,
  getUserProfile,
  updateUserProfile,
  changePassword,
  uploadProfilePicture,
  onAuthChange,
  initialize
} = authService;