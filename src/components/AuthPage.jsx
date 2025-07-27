import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useUI, useAuth } from './App';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { navigateTo } = useUI();
  const { login, register } = useAuth();
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const fadeInLeft = {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.8 }
  };

  const fadeInRight = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.8 }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegisterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRegisterData({
      ...registerData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🔑 Starting login process for:', loginData.email);
      
      // Add timeout to prevent infinite loading
      const loginPromise = login(loginData);
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Login timeout - please try again')), 15000); // 15 second timeout
      });
      
      const response = await Promise.race([loginPromise, timeoutPromise]);
      
      console.log('📝 Login response:', response);
      
      if (response.success) {
        console.log('✅ Login successful, navigating to home');
        navigateTo('home');
      } else {
        console.error('❌ Login failed:', response);
        setError(response.message || 'Invalid email or password. Please try again.');
      }
    } catch (error) {
      console.error('💥 Login failed with error:', error);
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    // Validate password confirmation
    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await register({
        email: registerData.email,
        password: registerData.password,
        firstName: registerData.firstName,
        lastName: registerData.lastName
      });
      
      // Registration successful - user is automatically logged in
      if (response.success) {
        console.log('✅ Registration successful, navigating to home');
        navigateTo('home');
      } else {
        setError(response.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="min-h-screen grid lg:grid-cols-2">
        
        {/* Left Side - Visual Branding Section */}
        <motion.div 
          className="relative bg-gradient-to-br from-demiland-400 via-demiland-500 to-demiland-600 flex items-center justify-center p-8 lg:p-12"
          {...fadeInLeft}
        >
          {/* Background Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-32 left-16 w-24 h-24 bg-white/20 rounded-full blur-lg"></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/15 rounded-full blur-md"></div>
            <div className="absolute bottom-20 right-1/3 w-20 h-20 bg-white/10 rounded-full blur-lg"></div>
          </div>
          
          {/* Main Content */}
          <div className="relative z-10 text-center text-white max-w-md">
            <motion.div
              className="mb-8"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.3 }}
            >
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                <img 
                  src="https://ik.imagekit.io/oriwj2eis/Demiland_imgs/demiland_logo_png.png?updatedAt=1752315168597" 
                  alt="DEMILAND luxury beauty cosmetics logo" 
                  className="w-14 h-14 object-contain filter brightness-0 invert"
                />
              </div>
              <h1 className="text-4xl font-light mb-4">DEMILAND</h1>
              <p className="text-xl font-light opacity-90 mb-8">Shine with your unique details</p>
            </motion.div>

            <motion.div
              className="space-y-6 text-left"
              variants={stagger}
              initial="initial"
              animate="animate"
            >
              {[
                { icon: '✨', text: 'Premium beauty experience' },
                { icon: '🎨', text: 'Artistry meets innovation' },
                { icon: '💎', text: 'Luxury redefined' }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-4"
                  variants={fadeInUp}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <span className="text-xl">{item.icon}</span>
                  </div>
                  <span className="text-lg opacity-90">{item.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Decorative Quote */}
            <motion.div
              className="mt-12 p-6 bg-white/10 rounded-2xl backdrop-blur-sm"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.8 }}
            >
              <p className="text-lg font-light italic opacity-90">
                &quot;Beauty lies in the details – where details make the difference.&quot;
              </p>
            </motion.div>
          </div>

          {/* Additional Decorative Pattern */}
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/20 to-transparent"></div>
        </motion.div>

        {/* Right Side - Authentication Forms */}
        <motion.div 
          className="flex items-center justify-center p-8 lg:p-12 bg-gray-50"
          {...fadeInRight}
        >
          <div className="w-full max-w-md space-y-8">
            
            {/* Form Header */}
            <motion.div 
              className="text-center"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
            >
              <h2 className="text-3xl font-light text-charcoal-800 mb-2">
                {isLogin ? 'Welcome Back' : 'Join DEMILAND'}
              </h2>
              <p className="text-charcoal-600">
                {isLogin ? 'Sign in to continue your beauty journey' : 'Create your account to get started'}
              </p>
            </motion.div>

            {/* Auth Toggle */}
            <motion.div 
              className="bg-white rounded-2xl p-2 flex shadow-sm border border-gray-200"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.2 }}
            >
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                  isLogin 
                    ? 'bg-demiland-700 text-white shadow-lg' 
                    : 'text-charcoal-600 hover:bg-gray-50'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                  !isLogin 
                    ? 'bg-demiland-700 text-white shadow-lg' 
                    : 'text-charcoal-600 hover:bg-gray-50'
                }`}
              >
                Sign Up
              </button>
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4"
              >
                <p className="text-red-700 text-sm">{error}</p>
              </motion.div>
            )}

            {/* Forms Container */}
            <motion.div 
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.4 }}
            >
              {/* Login Form */}
              {isLogin && (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <form onSubmit={handleLoginSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="loginEmail" className="block text-sm font-medium text-charcoal-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="loginEmail"
                        name="email"
                        required
                        autoComplete="email"
                        value={loginData.email}
                        onChange={handleLoginChange}
                        className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-demiland-400 focus:border-transparent outline-none transition-all duration-300"
                        placeholder="your.email@example.com"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="loginPassword" className="block text-sm font-medium text-charcoal-700 mb-2">
                        Password
                      </label>
                      <input
                        type="password"
                        id="loginPassword"
                        name="password"
                        required
                        autoComplete="current-password"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-demiland-400 focus:border-transparent outline-none transition-all duration-300"
                        placeholder="••••••••"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          id="rememberMe"
                          type="checkbox"
                          className="h-4 w-4 text-demiland-600 focus:ring-demiland-400 border-gray-300 rounded"
                        />
                        <label htmlFor="rememberMe" className="ml-2 block text-sm text-charcoal-600">
                          Remember me
                        </label>
                      </div>
                      <a href="#" className="text-sm text-demiland-600 hover:text-demiland-700 transition-colors">
                        Forgot password?
                      </a>
                    </div>
                    
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full py-4 px-6 rounded-xl font-medium shadow-lg transition-all duration-300 ${
                        isLoading 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-demiland-700 text-white hover:bg-demiland-800 hover:shadow-xl'
                      }`}
                      whileHover={!isLoading ? { scale: 1.02 } : {}}
                      whileTap={!isLoading ? { scale: 0.98 } : {}}
                    >
                      {isLoading ? 'Signing In...' : 'Sign In to DEMILAND'}
                    </motion.button>
                  </form>
                </motion.div>
              )}

              {/* Register Form */}
              {!isLogin && (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <form onSubmit={handleRegisterSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-charcoal-700 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          required
                          value={registerData.firstName}
                          onChange={handleRegisterChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-demiland-400 focus:border-transparent outline-none transition-all duration-300"
                          placeholder="First"
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-charcoal-700 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          required
                          value={registerData.lastName}
                          onChange={handleRegisterChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-demiland-400 focus:border-transparent outline-none transition-all duration-300"
                          placeholder="Last"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="registerEmail" className="block text-sm font-medium text-charcoal-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="registerEmail"
                        name="email"
                        required
                        value={registerData.email}
                        onChange={handleRegisterChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-demiland-400 focus:border-transparent outline-none transition-all duration-300"
                        placeholder="your.email@example.com"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="registerPassword" className="block text-sm font-medium text-charcoal-700 mb-2">
                        Password
                      </label>
                      <input
                        type="password"
                        id="registerPassword"
                        name="password"
                        required
                        value={registerData.password}
                        onChange={handleRegisterChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-demiland-400 focus:border-transparent outline-none transition-all duration-300"
                        placeholder="••••••••"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-charcoal-700 mb-2">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        required
                        value={registerData.confirmPassword}
                        onChange={handleRegisterChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-demiland-400 focus:border-transparent outline-none transition-all duration-300"
                        placeholder="••••••••"
                      />
                    </div>
                    
                    <div className="flex items-start">
                      <input
                        id="agreeToTerms"
                        name="agreeToTerms"
                        type="checkbox"
                        required
                        checked={registerData.agreeToTerms}
                        onChange={handleRegisterChange}
                        className="h-4 w-4 text-demiland-600 focus:ring-demiland-400 border-gray-300 rounded mt-1"
                      />
                      <label htmlFor="agreeToTerms" className="ml-3 block text-sm text-charcoal-600 leading-relaxed">
                        I agree to the{' '}
                        <a href="#" className="text-demiland-600 hover:text-demiland-700 transition-colors">Terms of Service</a>
                        {' '}and{' '}
                        <a href="#" className="text-demiland-600 hover:text-demiland-700 transition-colors">Privacy Policy</a>
                      </label>
                    </div>
                    
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full py-4 px-6 rounded-xl font-medium shadow-lg transition-all duration-300 ${
                        isLoading 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-demiland-700 text-white hover:bg-demiland-800 hover:shadow-xl'
                      }`}
                      whileHover={!isLoading ? { scale: 1.02 } : {}}
                      whileTap={!isLoading ? { scale: 0.98 } : {}}
                    >
                      {isLoading ? 'Creating Account...' : 'Create DEMILAND Account'}
                    </motion.button>
                  </form>
                </motion.div>
              )}
            </motion.div>

            {/* Back to Home */}
            <motion.div 
              className="text-center"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.6 }}
            >
              <button 
                onClick={() => navigateTo('home')}
                className="text-charcoal-600 hover:text-demiland-600 transition-colors flex items-center justify-center space-x-2 mx-auto"
              >
                <span>←</span>
                <span>Back to Home</span>
              </button>
            </motion.div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default AuthPage;