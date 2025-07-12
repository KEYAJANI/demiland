import React from 'react';
import { motion } from 'framer-motion';
import { useUI, useAuth } from './App';

const AdminButton = () => {
  const { navigateTo } = useUI();
  const { isLoggedIn, user, isAdmin } = useAuth();

  // Debug logging for admin button visibility
  console.log('🔧 AdminButton Debug:', {
    isLoggedIn,
    hasUser: !!user,
    userEmail: user?.email,
    userRole: user?.role,
    userMetadata: user?.user_metadata,
    rawUserMetadata: user?.raw_user_meta_data,
    isAdminFunction: isAdmin(),
    isAdminCheck: user?.role === 'admin' || user?.role === 'super-admin',
    shouldShow: isLoggedIn && user && isAdmin(),
    timestamp: new Date().toLocaleTimeString()
  });
  
  // Extra debug when conditions don't match
  if (!isLoggedIn) {
    console.log('❌ AdminButton: Not logged in');
  } else if (!user) {
    console.log('❌ AdminButton: No user object');
  } else if (!isAdmin()) {
    console.log('❌ AdminButton: User is not admin:', user?.role);
  } else {
    console.log('✅ AdminButton: All conditions met - should be visible');
  }

  // Only show for admin users
  if (!isLoggedIn || !user || !isAdmin()) {
    return null;
  }

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.button
        onClick={() => navigateTo('admin')}
        className="w-16 h-16 bg-gradient-to-r from-demiland-600 to-demiland-700 hover:from-demiland-700 hover:to-demiland-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Admin Dashboard Icon */}
        <svg 
          className="w-8 h-8 transition-transform duration-300 group-hover:rotate-12" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
          />
        </svg>
      </motion.button>
      
      {/* Tooltip */}
      <motion.div
        className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-charcoal-800 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap"
        initial={{ opacity: 0, y: 10 }}
        whileHover={{ opacity: 1, y: 0 }}
      >
        Admin Dashboard
        {/* Tooltip Arrow */}
        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-charcoal-800"></div>
      </motion.div>
    </motion.div>
  );
};

export default AdminButton;