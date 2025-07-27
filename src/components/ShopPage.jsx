import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUI, useProducts } from './App';

const ShopPage = () => {
  const { products, categories, getProductsByCategory } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { navigateTo, pageParams } = useUI();
  
  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  const handleCategoryFilter = async (categoryId) => {
    console.log('🏷️ ShopPage: Filtering by category:', categoryId);
    setSelectedCategory(categoryId);
    
    if (categoryId === 'all') {
      console.log('📦 ShopPage: Showing all products:', products.length);
      setFilteredProducts(products);
    } else if (['new-arrivals', 'face'].includes(categoryId)) {
      // Handle static filter categories
      let filtered = [];
      
      switch (categoryId) {
        case 'new-arrivals':
          filtered = products.filter(product => product.featured === true);
          break;
        case 'face':
          filtered = products.filter(product => 
            product.category && ['complexion', 'foundation', 'face'].includes(product.category.toLowerCase())
          );
          break;
        default:
          filtered = products;
      }
      
      console.log(`✅ ShopPage: Static filter '${categoryId}' found ${filtered.length} products`);
      setFilteredProducts(filtered);
    } else {
      try {
        console.log('🔍 ShopPage: Calling getProductsByCategory with:', categoryId);
        const response = await getProductsByCategory(categoryId);
        console.log('📊 ShopPage: getProductsByCategory response:', response);
        
        // Handle both direct array and response object
        const filtered = response && response.data ? response.data : (Array.isArray(response) ? response : []);
        console.log('✅ ShopPage: Filtered products:', filtered.length, filtered);
        setFilteredProducts(filtered);
      } catch (error) {
        console.error('❌ ShopPage: Error filtering products:', error);
        // Show empty results if API fails
        setFilteredProducts([]);
      }
    }
  };

  const handleProductClick = (productId) => {
    // Ensure productId is valid before navigation (handles both UUIDs and numbers)
    if (productId && (typeof productId === 'string' || typeof productId === 'number')) {
      navigateTo('product-detail', { productId: productId.toString() });
    } else {
      console.error('Invalid product ID:', productId);
    }
  };

  // Apply category filter from navigation parameters (e.g., from footer links)
  useEffect(() => {
    if (pageParams && pageParams.category) {
      handleCategoryFilter(pageParams.category);
    }
  }, [pageParams]);

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
    <div className="min-h-screen bg-white pt-20">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-demiland-50 to-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.h1 
            className="text-5xl md:text-6xl font-light text-charcoal-800 mb-6"
            variants={fadeIn}
            initial="initial"
            animate="animate"
          >
            DEMILAND Collection
          </motion.h1>
          <motion.p 
            className="text-xl text-charcoal-600 max-w-2xl mx-auto"
            variants={fadeIn}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.2 }}
          >
            Discover our complete range of premium cosmetics designed to enhance your natural beauty
          </motion.p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-12 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            variants={stagger}
            initial="initial"
            animate="animate"
          >
            <motion.button
              key="all"
              onClick={() => handleCategoryFilter('all')}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === 'all'
                  ? 'bg-demiland-700 text-white shadow-lg'
                  : 'bg-gray-100 text-charcoal-600 hover:bg-demiland-100 hover:text-demiland-600'
              }`}
              variants={fadeIn}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              All Products
            </motion.button>
            
            {/* Additional Static Filter Buttons */}
            {[
              { key: 'new-arrivals', label: 'New Arrivals' },
              { key: 'face', label: 'Face' }
            ].map((filter) => (
              <motion.button
                key={filter.key}
                onClick={() => handleCategoryFilter(filter.key)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === filter.key
                    ? 'bg-demiland-700 text-white shadow-lg'
                    : 'bg-gray-100 text-charcoal-600 hover:bg-demiland-100 hover:text-demiland-600'
                }`}
                variants={fadeIn}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {filter.label}
              </motion.button>
            ))}
            {categories.map((category) => {
              // Convert category name to lowercase for filtering
              const categoryFilterKey = category.name.toLowerCase();
              return (
                <motion.button
                  key={category.id}
                  onClick={() => handleCategoryFilter(categoryFilterKey)}
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === categoryFilterKey
                      ? 'bg-demiland-700 text-white shadow-lg'
                      : 'bg-gray-100 text-charcoal-600 hover:bg-demiland-100 hover:text-demiland-600'
                  }`}
                  variants={fadeIn}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category.name}
                </motion.button>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8"
            variants={stagger}
            initial="initial"
            animate="animate"
            key={selectedCategory} // Re-trigger animation on category change
          >
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group cursor-pointer flex flex-col h-full"
                variants={fadeIn}
                whileHover={{ y: -8 }}
                onClick={() => handleProductClick(product.id)}
              >
                {/* Product Image */}
                <div className="aspect-square h-64 w-full flex-shrink-0 bg-gradient-to-br from-demiland-50 to-demiland-100 overflow-hidden relative">
                  {product.image_url || product.image ? (
                    <img 
                      src={product.image_url || product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm" style={{ display: 'none' }}>
                    No image available
                  </div>
                  {product.featured && (
                    <div className="absolute top-4 left-4 bg-demiland-700 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Featured
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="mb-2">
                    <span className="text-sm text-demiland-600 font-medium">{product.category}</span>
                  </div>
                  
                  <h3 className="text-lg font-medium text-charcoal-800 mb-3 group-hover:text-demiland-600 transition-colors">
                    {product.name}
                  </h3>
                  
                  <p className="text-charcoal-600 text-sm mb-4 line-clamp-2 flex-1">
                    {product.description}
                  </p>

                  <button 
                    className="w-full bg-demiland-700 text-white py-2 rounded-full text-sm font-medium hover:bg-demiland-800 transition-colors duration-200 mt-auto"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProductClick(product.id);
                    }}
                  >
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {filteredProducts.length === 0 && (
            <motion.div 
              className="text-center py-16"
              variants={fadeIn}
              initial="initial"
              animate="animate"
            >
              <h3 className="text-2xl font-light text-charcoal-600 mb-4">
                No products found in this category
              </h3>
              <button 
                onClick={() => handleCategoryFilter('all')}
                className="bg-demiland-700 text-white px-6 py-3 rounded-full font-medium hover:bg-demiland-800 transition-colors"
              >
                View All Products
              </button>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ShopPage;