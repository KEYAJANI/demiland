import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUI, useProducts } from './App';

const ProductDetail = ({ productId }) => {
  const { getProductById, products } = useProducts();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showFeatures, setShowFeatures] = useState(true);
  const { navigateTo } = useUI();

  useEffect(() => {
    if (productId) {
      const loadProduct = async () => {
        // Validate productId (can be UUID string or number)
        if (!productId || productId === 'undefined' || productId === 'null') {
          console.error('Invalid product ID:', productId);
          setProduct(null);
          return;
        }
        
        const productData = await getProductById(productId);
        setProduct(productData);
        
        if (productData) {
          // Get related products from the same category
          const related = products
            .filter(p => p.id !== productData.id && p.category === productData.category)
            .slice(0, 4);
          setRelatedProducts(related);
        }
      };
      loadProduct();
    }
  }, [productId, getProductById, products]);

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

  if (!product) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-demiland-200 border-t-demiland-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-charcoal-600">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      
      {/* Breadcrumb Navigation */}
      <motion.div 
        className="py-6 border-b border-demiland-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center space-x-2 text-sm text-charcoal-600">
            <button 
              onClick={() => navigateTo('home')}
              className="hover:text-demiland-600 transition-colors"
            >
              Home
            </button>
            <span>•</span>
            <button 
              onClick={() => navigateTo('shop')}
              className="hover:text-demiland-600 transition-colors"
            >
              Collection
            </button>
            <span>•</span>
            <span className="text-demiland-600 font-medium">{product.name}</span>
          </div>
        </div>
      </motion.div>

      {/* Product Hero Section */}
      <motion.section 
        className="py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            
            {/* Product Image Gallery */}
            <motion.div
              className="space-y-6"
              {...fadeInUp}
            >
              {/* Main Product Image */}
              <div className="aspect-square bg-gradient-to-br from-demiland-50 to-demiland-100 rounded-3xl overflow-hidden relative group">
                {product.image_url || product.image ? (
                  <img 
                    src={product.image_url || product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className="w-full h-full flex items-center justify-center text-gray-500 text-lg" style={{ display: 'none' }}>
                  No image available
                </div>
                
                {/* Product Badges */}
                <div className="absolute top-6 left-6 flex flex-col space-y-2">
                  {product.featured && (
                    <span className="bg-demiland-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                      Featured
                    </span>
                  )}
                </div>

                {/* DEMILAND Watermark */}
                <div className="absolute bottom-6 right-6 opacity-20">
                  <img 
                    src="/demiland_logo_png.png" 
                    alt="DEMILAND" 
                    className="w-12 h-12 object-contain"
                  />
                </div>
              </div>

              {/* Product Category Tag */}
              <div className="flex justify-center">
                <span className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-demiland-100 to-demiland-200 text-demiland-700 rounded-full text-sm font-medium">
                  {product.category} Collection
                </span>
              </div>
            </motion.div>

            {/* Product Information */}
            <motion.div
              className="space-y-8"
              {...fadeInUp}
              transition={{ delay: 0.2 }}
            >
              {/* Product Header */}
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <img 
                    src="/demiland_logo_png.png" 
                    alt="DEMILAND" 
                    className="w-8 h-8 object-contain"
                  />
                  <span className="text-demiland-600 font-medium">DEMILAND</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-light text-charcoal-800 mb-4 leading-tight">
                  {product.name}
                </h1>
                
              </div>

              {/* Product Description */}
              <div className="prose prose-lg max-w-none">
                <p className="text-charcoal-600 leading-relaxed text-lg">
                  {product.description}
                </p>
              </div>

              {/* Product Features & Ingredients Toggle */}
              <div className="space-y-6">
                <div className="flex space-x-1 bg-demiland-50 rounded-2xl p-1">
                  <button
                    onClick={() => setShowFeatures(true)}
                    className={`flex-1 py-3 px-6 rounded-xl text-sm font-medium transition-all duration-300 ${
                      showFeatures 
                        ? 'bg-white text-demiland-600 shadow-sm' 
                        : 'text-charcoal-600 hover:text-demiland-600'
                    }`}
                  >
                    Key Features
                  </button>
                  <button
                    onClick={() => setShowFeatures(false)}
                    className={`flex-1 py-3 px-6 rounded-xl text-sm font-medium transition-all duration-300 ${
                      !showFeatures 
                        ? 'bg-white text-demiland-600 shadow-sm' 
                        : 'text-charcoal-600 hover:text-demiland-600'
                    }`}
                  >
                    Ingredients
                  </button>
                </div>

                <motion.div
                  key={showFeatures ? 'features' : 'ingredients'}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gradient-to-br from-demiland-50 to-white p-8 rounded-2xl border border-demiland-100"
                >
                  {showFeatures ? (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-charcoal-800 mb-4">Key Features</h3>
                      <div className="grid gap-3">
                        {product.features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-demiland-400 rounded-full"></div>
                            <span className="text-charcoal-600">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-charcoal-800 mb-4">Ingredients</h3>
                      <p className="text-charcoal-600 text-sm leading-relaxed">
                        {product.ingredients}
                      </p>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <motion.button
                  onClick={() => navigateTo('shop')}
                  className="w-full bg-gradient-to-r from-demiland-500 to-demiland-600 text-white py-4 px-8 rounded-2xl font-medium hover:from-demiland-600 hover:to-demiland-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Explore More Products
                </motion.button>
                
                <motion.button
                  onClick={() => navigateTo('contact')}
                  className="w-full bg-transparent border-2 border-demiland-500 text-demiland-600 py-4 px-8 rounded-2xl font-medium hover:bg-demiland-500 hover:text-white transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Contact for Consultation
                </motion.button>
              </div>

              {/* Product Info */}
              <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100">
                <h4 className="text-lg font-medium text-charcoal-800 mb-4">Product Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-charcoal-600">Category:</span>
                    <span className="text-charcoal-800 font-medium">{product.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-charcoal-600">Availability:</span>
                    <span className={`font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-charcoal-600">Collection:</span>
                    <span className="text-charcoal-800 font-medium">DEMILAND {product.category}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <motion.section 
          className="py-20 bg-gradient-to-br from-demiland-50 to-white"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <div className="max-w-6xl mx-auto px-6">
            <motion.div className="text-center mb-16" variants={fadeInUp}>
              <h2 className="text-4xl font-light text-charcoal-800 mb-4">You Might Also Like</h2>
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-demiland-400 to-transparent mx-auto"></div>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.slice(0, 3).map((relatedProduct) => (
                <motion.div
                  key={relatedProduct.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-demiland-100 cursor-pointer"
                  variants={fadeInUp}
                  whileHover={{ y: -8 }}
                  onClick={() => navigateTo('product-detail', { productId: relatedProduct.id })}
                >
                  {/* Product Image */}
                  <div className="aspect-square bg-gradient-to-br from-demiland-50 to-demiland-100 overflow-hidden relative">
                    <img 
                      src={relatedProduct.image} 
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {relatedProduct.featured && (
                      <div className="absolute top-4 left-4 bg-demiland-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Featured
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <div className="mb-2">
                      <span className="text-sm text-demiland-600 font-medium">{relatedProduct.category}</span>
                    </div>
                    
                    <h3 className="text-lg font-medium text-charcoal-800 mb-3 group-hover:text-demiland-600 transition-colors">
                      {relatedProduct.name}
                    </h3>
                    
                    <p className="text-charcoal-600 text-sm mb-4 line-clamp-2">
                      {relatedProduct.description}
                    </p>

                    <button 
                      className="w-full bg-demiland-500 text-white py-2 rounded-full text-sm font-medium hover:bg-demiland-600 transition-colors duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateTo('product-detail', { productId: relatedProduct.id });
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* View All Products Button */}
            <motion.div 
              className="text-center mt-12"
              variants={fadeInUp}
            >
              <button
                onClick={() => navigateTo('shop')}
                className="bg-transparent border-2 border-demiland-500 text-demiland-600 py-3 px-8 rounded-full font-medium hover:bg-demiland-500 hover:text-white transition-all duration-300"
              >
                View All Products
              </button>
            </motion.div>
          </div>
        </motion.section>
      )}

    </div>
  );
};

export default ProductDetail;