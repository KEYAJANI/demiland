import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUI, useAuth } from './App';

const Navbar = ({ isHomepage = false }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { navigateTo } = useUI();
  const { isLoggedIn, logout, user } = useAuth();
  
  // Debug auth state in Navbar
  console.log('🧭 Navbar Debug:', {
    isLoggedIn,
    hasUser: !!user,
    userEmail: user?.email,
    buttonText: isLoggedIn ? 'Sign Out' : 'Sign In',
    timestamp: new Date().toLocaleTimeString()
  });

  useEffect(() => {
    // Only add scroll listener on homepage
    if (!isHomepage) return;
    
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomepage]);

  return (
    <>
      {/* Transparent Navigation with Scroll Effect */}
      <motion.header 
        className={`fixed top-0 w-full navbar-ios-safe transition-all duration-300 ${
          isHomepage 
            ? (isScrolled || isMobileMenuOpen
                ? 'bg-white/95 backdrop-blur-sm border-b border-gray-100'
                : 'bg-transparent')
            : 'bg-white/95 backdrop-blur-sm border-b border-gray-100'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Left side: Logo and Mobile Menu with proper spacing */}
            <div className="flex items-center justify-between w-full md:w-auto">
              {/* Demiland Logo */}
              <motion.div 
                className="flex items-center space-x-3"
                whileHover={{ scale: 1.02 }}
                onClick={() => navigateTo('home')}
                style={{ cursor: 'pointer' }}
              >
                <img 
                  src="/demiland_logo_png.png" 
                  alt="Demiland" 
                  className="w-10 h-10 object-contain"
                />
                <span className={`text-xl font-medium transition-colors duration-300 ${
                  isHomepage 
                    ? (isScrolled || isMobileMenuOpen ? 'text-charcoal-800' : 'text-white')
                    : 'text-charcoal-800'
                }`}>DEMILAND</span>
              </motion.div>

              {/* Mobile Burger Menu */}
              <motion.button
                className={`md:hidden flex flex-col justify-center items-center w-8 h-8 transition-colors duration-300 ${
                  isHomepage 
                    ? (isScrolled || isMobileMenuOpen ? 'text-charcoal-800' : 'text-white')
                    : 'text-charcoal-800'
                }`}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span
                  className="w-6 h-0.5 bg-current mb-1.5 transition-all duration-300"
                  animate={{
                    rotate: isMobileMenuOpen ? 45 : 0,
                    y: isMobileMenuOpen ? 8 : 0,
                  }}
                />
                <motion.span
                  className="w-6 h-0.5 bg-current mb-1.5 transition-all duration-300"
                  animate={{
                    opacity: isMobileMenuOpen ? 0 : 1,
                  }}
                />
                <motion.span
                  className="w-6 h-0.5 bg-current transition-all duration-300"
                  animate={{
                    rotate: isMobileMenuOpen ? -45 : 0,
                    y: isMobileMenuOpen ? -8 : 0,
                  }}
                />
              </motion.button>
            </div>

            {/* Clean Navigation */}
            <nav className="hidden md:flex space-x-8">
              {[
                { name: 'Shop', page: 'shop' },
                { name: 'About', page: 'about' },
                { name: 'Contact', page: 'contact' }
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => navigateTo(item.page)}
                  className={`font-medium transition-colors duration-300 ${
                    isHomepage 
                      ? (isScrolled || isMobileMenuOpen
                          ? 'text-gray-600 hover:text-black' 
                          : 'text-white/80 hover:text-white')
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </nav>

            {/* Sign In/Sign Out Button - Only visible on desktop */}
            <motion.button 
              className={`hidden md:block px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                isHomepage 
                  ? (isScrolled || isMobileMenuOpen
                      ? 'bg-demiland-700 text-white hover:bg-demiland-800' 
                      : 'bg-gradient-to-r from-black/20 to-black/30 text-white border border-white/50 shadow-lg hover:bg-white hover:text-demiland-900 hover:border-demiland-200')
                  : 'bg-demiland-700 text-white hover:bg-demiland-800'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (isLoggedIn) {
                  logout();
                } else {
                  navigateTo('auth');
                }
              }}
            >
              {isLoggedIn ? 'Sign Out' : 'Sign In'}
            </motion.button>
          </div>

          {/* Mobile Menu Dropdown - Integrated within navbar */}
          <motion.div
            className="md:hidden overflow-hidden"
            initial={false}
            animate={{ height: isMobileMenuOpen ? 'auto' : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <nav className="px-6 py-6 border-t border-gray-200">
              {[
                { name: 'Shop', page: 'shop' },
                { name: 'About', page: 'about' },
                { name: 'Contact', page: 'contact' }
              ].map((item) => (
                <motion.button
                  key={item.name}
                  className="block w-full text-left py-3 text-lg font-medium text-charcoal-800 hover:text-demiland-600 transition-colors duration-200"
                  onClick={() => {
                    navigateTo(item.page);
                    setIsMobileMenuOpen(false);
                  }}
                  whileHover={{ x: 10 }}
                >
                  {item.name}
                </motion.button>
              ))}
              
              {/* Sign In/Sign Out button inside mobile menu */}
              <motion.button 
                className="w-full mt-4 bg-demiland-700 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-demiland-800 transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (isLoggedIn) {
                    logout();
                  } else {
                    navigateTo('auth');
                  }
                  setIsMobileMenuOpen(false);
                }}
              >
                {isLoggedIn ? 'Sign Out' : 'Sign In'}
              </motion.button>
            </nav>
          </motion.div>
        </div>
      </motion.header>
    </>
  );
};

export default Navbar;