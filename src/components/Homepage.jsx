import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUI, useProducts } from './App';

const Homepage = () => {
  const { navigateTo } = useUI();
  const { getAllProducts, getFeaturedProducts, getCategories } = useProducts();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(true);
  const [featuredError, setFeaturedError] = useState(null);
  
  // Premium products state
  const [premiumProducts, setPremiumProducts] = useState([]);
  const [isLoadingPremium, setIsLoadingPremium] = useState(true);
  const [premiumError, setPremiumError] = useState(null);
  
  // Categories state
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);
  
  // Screen size state for responsive product count
  const [isMobile, setIsMobile] = useState(false);
  
  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        console.log('🌟 Loading featured products...');
        setIsLoadingFeatured(true);
        setFeaturedError(null);
        
        const response = await getFeaturedProducts();
        console.log('🌟 Featured products response:', response);
        
        // Handle both direct array and response object
        let featured = [];
        if (response && response.data) {
          featured = response.data;
        } else if (Array.isArray(response)) {
          featured = response;
        }
        
        const limitedFeatured = featured.slice(0, 6);
        setFeaturedProducts(limitedFeatured);
        
        console.log('✅ Featured products loaded:', limitedFeatured.length);
      } catch (error) {
        console.error('❌ Error loading featured products:', error);
        setFeaturedError(error.message);
        setFeaturedProducts([]); // Fallback to empty array
      } finally {
        setIsLoadingFeatured(false);
      }
    };
    
    loadFeaturedProducts();
  }, [getFeaturedProducts]);

  // Load latest products for showcase section
  useEffect(() => {
    const loadLatestProducts = async () => {
      try {
        console.log('🆕 Loading latest products...');
        setIsLoadingPremium(true);
        setPremiumError(null);
        
        const response = await getAllProducts();
        console.log('🆕 Latest products response:', response);
        
        // Handle both direct array and response object
        let products = [];
        if (response && response.data) {
          products = response.data;
        } else if (Array.isArray(response)) {
          products = response;
        }
        
        // Take products based on screen size: 4 for mobile, 3 for desktop
        const productCount = isMobile ? 4 : 3;
        const latestShowcase = products.slice(0, productCount);
        setPremiumProducts(latestShowcase);
        
        console.log('✅ Latest products loaded:', latestShowcase.length);
        
        // If we have products, clear any previous error
        if (latestShowcase.length > 0) {
          setPremiumError(null);
        } else {
          // If no products but no error, show a different message
          if (!response.error) {
            setPremiumError('No products available in the database');
          }
        }
      } catch (error) {
        console.error('❌ Error loading latest products:', error);
        setPremiumError(error.message);
        setPremiumProducts([]);
      } finally {
        setIsLoadingPremium(false);
      }
    };
    
    loadLatestProducts();
  }, [getAllProducts]);

  // Load categories for exploration section
  useEffect(() => {
    const loadCategories = async () => {
      try {
        console.log('🏷️ Loading categories...');
        setIsLoadingCategories(true);
        setCategoriesError(null);
        
        const response = await getCategories();
        console.log('🏷️ Categories response:', response);
        
        // Handle both direct array and response object
        let cats = [];
        if (response && response.data) {
          cats = response.data;
        } else if (Array.isArray(response)) {
          cats = response;
        }
        
        setCategories(cats);
        
        console.log('✅ Categories loaded:', cats.length);
      } catch (error) {
        console.error('❌ Error loading categories:', error);
        setCategoriesError(error.message);
        setCategories([]);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    
    loadCategories();
  }, [getCategories]);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">

      {/* DEMILAND Hero Section with Banner Background */}
      <section className="relative overflow-hidden hero-full-screen" style={{ 
        height: '100vh', 
        paddingTop: 'env(safe-area-inset-top)',
        marginTop: 'calc(-1 * env(safe-area-inset-top))'
      }}>
        {/* Desktop Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat hidden md:block"
          style={{
            backgroundImage: `url('https://ik.imagekit.io/oriwj2eis/Demiland_imgs/demiland_banner.jpg?updatedAt=1752315169814')`,
          }}
        />
        
        {/* Mobile Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat md:hidden"
          style={{
            backgroundImage: `url('https://ik.imagekit.io/oriwj2eis/Demiland_imgs/demiland_banner_phoneScreen.jpg?updatedAt=1752315169807')`,
          }}
        />
        
        {/* Content positioned at bottom with responsive design */}
        <div className="relative z-10 h-full flex flex-col justify-end" style={{ 
          paddingBottom: 'calc(5rem + env(safe-area-inset-bottom))'
        }}>
          <div className="max-w-6xl mx-auto px-6 w-full">
            <motion.div 
              className="max-w-xl md:max-w-2xl"
              variants={stagger}
              initial="initial"
              animate="animate"
            >
              {/* Enhanced Mobile CTA - No Background Container */}
              <motion.div
                className="md:backdrop-blur-none md:bg-transparent md:border-transparent md:rounded-none md:p-0 md:shadow-none"
                variants={fadeIn}
              >
                <motion.p 
                  className="text-lg md:text-xl text-white mb-8 leading-relaxed text-left font-semibold md:font-light drop-shadow-lg"
                  variants={fadeIn}
                >
                  Discover DEMILAND's exquisite collection of premium cosmetics 
                  where elegance meets innovation in every luxurious detail.
                </motion.p>

                <motion.div 
                  className="flex flex-col gap-4 items-start md:flex-row md:gap-6"
                  variants={fadeIn}
                >
                <motion.button 
                  className="bg-white text-demiland-800 px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors duration-200 shadow-xl md:px-8 text-sm md:text-base"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigateTo('shop')}
                >
                  Shop Collection
                </motion.button>
                <motion.button 
                  className="border-2 border-white text-white px-6 py-3 rounded-full font-medium hover:bg-white hover:text-demiland-800 transition-colors duration-200 md:px-8 text-sm md:text-base"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigateTo('about')}
                >
                  Discover Story
                </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Premium Product Showcase */}
      <section className="py-20 bg-gradient-to-br from-demiland-50 to-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            variants={fadeIn}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-light text-charcoal-800 mb-6">Latest Products</h2>
            <p className="text-xl text-charcoal-600 max-w-3xl mx-auto leading-relaxed">
              Discover our newest arrivals featuring innovative formulations and cutting-edge beauty solutions
            </p>
          </motion.div>

          {/* Latest Products Grid */}
          {/* Loading State */}
          {isLoadingPremium && (
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {[1, 2, 3].map((index) => (
                <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse">
                  <div className="aspect-square bg-gray-200"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-16 bg-gray-200 rounded"></div>
                    <div className="h-10 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {premiumError && !isLoadingPremium && (
            <div className="text-center py-12">
              <p className="text-red-600 mb-2">Failed to load latest products</p>
              <p className="text-sm text-gray-600 mb-4">Error: {premiumError}</p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-demiland-700 text-white px-6 py-2 rounded-full hover:bg-demiland-800"
              >
                Retry
              </button>
            </div>
          )}

          {/* Latest Products Grid */}
          {!isLoadingPremium && !premiumError && (
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-8 mb-16"
              variants={stagger}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {premiumProducts.length > 0 ? premiumProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
                  variants={fadeIn}
                  whileHover={{ y: -10 }}
                  onClick={() => navigateTo('product-detail', { productId: product.id })}
                >
                  <div className="aspect-square bg-gradient-to-br from-demiland-100 to-demiland-200 flex items-center justify-center overflow-hidden">
                    {product.image_url || product.image ? (
                      <img 
                        src={product.image_url || product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="w-24 h-24 bg-gradient-to-br from-demiland-400 to-demiland-600 rounded-full flex items-center justify-center" style={{ display: product.image_url || product.image ? 'none' : 'flex' }}>
                      <span className="text-white text-2xl font-light">✨</span>
                    </div>
                  </div>
                  <div className="p-3 md:p-6">
                    <p className="text-demiland-600 text-xs md:text-sm font-medium mb-1 md:mb-2 text-left">{product.category || 'Latest Collection'}</p>
                    <h3 className="text-base md:text-2xl font-light text-charcoal-800 mb-2 md:mb-4 group-hover:text-demiland-600 transition-colors text-left line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-charcoal-600 text-xs md:text-sm leading-relaxed mb-3 md:mb-6 line-clamp-2 md:line-clamp-3 text-left">
                      {product.description || 'Latest innovative cosmetic crafted with cutting-edge technology for modern beauty enthusiasts.'}
                    </p>
                    <motion.button 
                      className="w-full bg-demiland-700 text-white py-2 md:py-3 rounded-full text-xs md:text-base font-medium hover:bg-demiland-800 transition-all duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateTo('product-detail', { productId: product.id });
                      }}
                    >
                      Discover More
                    </motion.button>
                  </div>
                </motion.div>
              )) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-600 mb-4">No latest products available</p>
                  <button 
                    onClick={() => navigateTo('shop')}
                    className="bg-demiland-700 text-white px-6 py-2 rounded-full hover:bg-demiland-800"
                  >
                    Browse All Products
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* View Collection CTA */}
          <motion.div 
            className="text-center"
            variants={fadeIn}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.button 
              onClick={() => navigateTo('shop')}
              className="bg-gradient-to-r from-demiland-600 to-demiland-700 text-white px-10 py-4 rounded-full font-medium hover:from-demiland-700 hover:to-demiland-800 transition-all duration-300 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Complete Collection
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Category Exploration */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            variants={fadeIn}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-light text-charcoal-800 mb-6">Explore Collections</h2>
            <p className="text-xl text-charcoal-600 max-w-3xl mx-auto">
              Discover our curated beauty categories, each designed to enhance your natural elegance
            </p>
          </motion.div>

          {/* Loading State */}
          {isLoadingCategories && (
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((index) => (
                <div key={index} className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 animate-pulse">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                    <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto"></div>
                    <div className="h-16 bg-gray-300 rounded"></div>
                    <div className="h-8 bg-gray-300 rounded-full w-32 mx-auto"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {categoriesError && !isLoadingCategories && (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">Failed to load categories</p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-demiland-700 text-white px-6 py-2 rounded-full hover:bg-demiland-800"
              >
                Retry
              </button>
            </div>
          )}

          {/* Categories Grid */}
          {!isLoadingCategories && !categoriesError && (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
              variants={stagger}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {categories.length > 0 ? categories.slice(0, 3).map((category, index) => {
                // Get products for this category to use as background image
                const { products } = useProducts();
                const allProducts = products || [];
                
                // Find products in this category
                const categoryProducts = allProducts.filter(product => 
                  product.category && product.category.toLowerCase() === category.name.toLowerCase()
                );
                
                // Get background image: first product from category, or any product if category is empty
                const backgroundImage = categoryProducts.length > 0 
                  ? categoryProducts[0].image || categoryProducts[0].image_url
                  : allProducts.length > 0 
                    ? allProducts[0].image || allProducts[0].image_url
                    : null;
                
                // Category descriptions
                const categoryDescriptions = {
                  'Skincare': "Face makeup including foundation, concealer, and powder",
                  'Makeup': "Professional eye makeup for stunning looks",
                  'Tools': "Premium beauty tools for professional results at home",
                  'Eyes': "Professional eye makeup for stunning looks",
                  'Lips': "Luxurious lip products for every occasion",
                  'Complexion': "Flawless complexion products for perfect skin"
                };
                
                const description = categoryDescriptions[category.name] || 
                  `Premium ${category.name.toLowerCase()} collection designed to enhance your natural beauty`;
                
                return (
                  <motion.div
                    key={category.id}
                    className="relative overflow-hidden rounded-2xl cursor-pointer group min-h-[400px] md:min-h-[450px] shadow-2xl hover:shadow-3xl transition-shadow duration-300"
                    variants={fadeIn}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => navigateTo('shop', { category: category.name })}
                  >
                    {/* Background Image */}
                    {backgroundImage && (
                      <div 
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{
                          backgroundImage: `url(${backgroundImage})`
                        }}
                      />
                    )}
                    
                    {/* Fallback background if no image */}
                    {!backgroundImage && (
                      <div className="absolute inset-0 bg-gradient-to-br from-demiland-200 to-demiland-400" />
                    )}
                    
                    {/* Gradient Overlay - Full coverage */}
                    <div 
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(180deg, rgba(190, 162, 219, 0.02) 0%, rgba(114, 96, 132, 0.307109) 20.74%, rgba(80, 68, 93, 0.594219) 41.47%, rgba(50, 42, 59, 0.709063) 57.63%, rgba(50, 42, 58, 0.93875) 93.75%)`
                      }}
                    />
                    
                    {/* Decorative Elements */}
                    <div className="absolute top-4 right-4 w-8 h-8 bg-white/10 rounded-full"></div>
                    <div className="absolute top-8 right-8 w-4 h-4 bg-white/20 rounded-full"></div>
                    <div className="absolute bottom-4 left-4 w-6 h-6 bg-white/15 rounded-full"></div>
                    
                    {/* Content */}
                    <div className="relative z-10 p-6 md:p-8 h-full flex flex-col justify-end text-white">
                      <h3 className="text-xl md:text-2xl font-bold mb-2">{category.name}</h3>
                      <p className="text-white/80 text-sm md:text-base font-normal mb-4">Premium Collection</p>
                      <div className="w-full h-px bg-white/30 mb-4"></div>
                      <p className="text-white/80 text-xs md:text-sm leading-relaxed mb-6">
                        {description}
                      </p>
                      
                      {/* Button */}
                      <motion.button 
                        className="bg-white text-purple-800 px-6 py-3 rounded-full text-sm md:text-base font-medium hover:bg-white/90 transition-all duration-200 shadow-lg w-fit"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateTo('shop', { category: category.name });
                        }}
                      >
                        Explore Collection
                      </motion.button>
                    </div>
                  </motion.div>
                );
              }) : (
                // Fallback categories if database is empty
                [{
                  name: "Skincare",
                  description: "Face makeup including foundation, concealer, and powder"
                },
                {
                  name: "Makeup",
                  description: "Professional eye makeup for stunning looks"
                },
                {
                  name: "Tools",
                  description: "Premium beauty tools for professional results at home"
                }].map((category, index) => {
                  // Get products for background image
                  const { products } = useProducts();
                  const allProducts = products || [];
                  
                  // Find products in this category
                  const categoryProducts = allProducts.filter(product => 
                    product.category && product.category.toLowerCase() === category.name.toLowerCase()
                  );
                  
                  // Get background image: first product from category, or any product if category is empty
                  const backgroundImage = categoryProducts.length > 0 
                    ? categoryProducts[0].image || categoryProducts[0].image_url
                    : allProducts.length > 0 
                      ? allProducts[0].image || allProducts[0].image_url
                      : null;
                  
                  return (
                    <motion.div
                      key={index}
                      className="relative overflow-hidden rounded-2xl cursor-pointer group min-h-[400px] md:min-h-[450px] shadow-2xl hover:shadow-3xl transition-shadow duration-300"
                      variants={fadeIn}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                      onClick={() => navigateTo('shop', { category: category.name })}
                    >
                      {/* Background Image */}
                      {backgroundImage && (
                        <div 
                          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                          style={{
                            backgroundImage: `url(${backgroundImage})`
                          }}
                        />
                      )}
                      
                      {/* Fallback background if no image */}
                      {!backgroundImage && (
                        <div className="absolute inset-0 bg-gradient-to-br from-demiland-200 to-demiland-400" />
                      )}
                      
                      {/* Gradient Overlay - Full coverage */}
                      <div 
                        className="absolute inset-0"
                        style={{
                          background: `linear-gradient(180deg, rgba(190, 162, 219, 0.02) 0%, rgba(114, 96, 132, 0.307109) 20.74%, rgba(80, 68, 93, 0.594219) 41.47%, rgba(50, 42, 59, 0.709063) 57.63%, rgba(50, 42, 58, 0.93875) 93.75%)`
                        }}
                      />
                      
                      {/* Decorative Elements */}
                      <div className="absolute top-4 right-4 w-8 h-8 bg-white/10 rounded-full"></div>
                      <div className="absolute top-8 right-8 w-4 h-4 bg-white/20 rounded-full"></div>
                      <div className="absolute bottom-4 left-4 w-6 h-6 bg-white/15 rounded-full"></div>
                      
                      {/* Content */}
                      <div className="relative z-10 p-6 md:p-8 h-full flex flex-col justify-end text-white">
                        <h3 className="text-xl md:text-2xl font-bold mb-2">{category.name}</h3>
                        <p className="text-white/80 text-sm md:text-base font-normal mb-4">Premium Collection</p>
                        <div className="w-full h-px bg-white/30 mb-4"></div>
                        <p className="text-white/80 text-xs md:text-sm leading-relaxed mb-6">
                          {category.description}
                        </p>
                        
                        {/* Button */}
                        <motion.button 
                          className="bg-white text-purple-800 px-6 py-3 rounded-full text-sm md:text-base font-medium hover:bg-white/90 transition-all duration-200 shadow-lg w-fit"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigateTo('shop', { category: category.name });
                          }}
                        >
                          Explore Collection
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          )}
        </div>
      </section>



      {/* Premium Customer Stories */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            variants={fadeIn}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-light text-charcoal-800 mb-6">What Our Clients Say</h2>
            <p className="text-xl text-charcoal-600 max-w-3xl mx-auto">
              Real stories from women who have discovered their beauty confidence with DEMILAND
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 gap-8"
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                name: "Sarah Mitchell",
                role: "Fashion Designer",
                image: "/placeholder-customer-1.jpg",
                rating: 5,
                testimonial: "DEMILAND has completely transformed my beauty routine. The quality is exceptional and the results speak for themselves."
              },
              {
                name: "Jessica Chen",
                role: "Creative Director",
                image: "/placeholder-customer-2.jpg",
                rating: 5,
                testimonial: "Finally found a foundation that matches my skin perfectly. The coverage is flawless and it feels lightweight all day."
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-demiland-50 to-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300"
                variants={fadeIn}
                whileHover={{ y: -5 }}
              >
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-demiland-200 to-demiland-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl text-demiland-700">👤</span>
                  </div>
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-demiland-500 text-lg">★</span>
                    ))}
                  </div>
                </div>
                <p className="text-charcoal-600 text-center leading-relaxed mb-6 italic">
                  "{testimonial.testimonial}"
                </p>
                <div className="text-center">
                  <h4 className="text-lg font-medium text-charcoal-800 mb-1">{testimonial.name}</h4>
                  <p className="text-demiland-600 text-sm">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>




      {/* Enhanced DEMILAND Newsletter */}
      <section className="py-20 bg-gradient-to-br from-charcoal-800 via-demiland-900 to-charcoal-800">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div 
            className="grid lg:grid-cols-2 gap-12 items-center"
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {/* Newsletter Content */}
            <motion.div variants={fadeIn}>
              <h2 className="text-5xl font-light text-white mb-6">Join Our Beauty Circle</h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Be the first to discover new collections and receive exclusive beauty insights from DEMILAND
              </p>
              
              <div className="flex flex-col sm:flex-row max-w-lg gap-4 mb-8">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-6 py-4 bg-white/10 border border-white/20 rounded-full text-white placeholder-gray-400 outline-none focus:border-demiland-400 focus:bg-white/20 transition-all duration-200 backdrop-blur-sm"
                />
                <motion.button 
                  className="bg-demiland-500 text-white px-8 py-4 rounded-full font-medium hover:bg-demiland-600 transition-colors duration-200 shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Subscribe
                </motion.button>
              </div>
              
              <div className="flex flex-wrap gap-6 text-sm text-gray-300">
                <div className="flex items-center space-x-2">
                  <span className="text-demiland-400">✓</span>
                  <span>Exclusive offers</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-demiland-400">✓</span>
                  <span>Beauty tips</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-demiland-400">✓</span>
                  <span>New launches</span>
                </div>
              </div>
            </motion.div>

            {/* Newsletter Visual */}
            <motion.div 
              className="relative"
              variants={fadeIn}
              transition={{ delay: 0.2 }}
            >
              <div className="relative bg-gradient-to-br from-demiland-500/20 to-demiland-700/20 rounded-3xl p-8 backdrop-blur-sm border border-white/10">
                <div className="text-center space-y-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-demiland-400 to-demiland-600 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-3xl text-white">💌</span>
                  </div>
                  <h3 className="text-2xl font-light text-white mb-4">Stay Connected</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Join thousands of beauty enthusiasts who trust DEMILAND for their luxury beauty journey.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>


    </div>
  );
};

export default Homepage;