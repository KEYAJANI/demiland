import React from 'react';
import { motion } from 'framer-motion';
import { useUI } from './App';
import { Sparkles, Palette, Star, Gem, Microscope, Crown, Eye, HandHeart, Wrench, Brush } from 'lucide-react';

const AboutPage = () => {
  const { navigateTo } = useUI();
  
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-white pt-20">

      {/* Enhanced Hero Section */}
      <motion.section 
        className="py-20 md:py-24 bg-gradient-to-br from-demiland-50 via-white to-demiland-100/50 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Decorative Elements */}
        <div className="absolute top-10 right-10 w-20 h-20 bg-demiland-200/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-10 w-32 h-32 bg-demiland-300/20 rounded-full blur-2xl"></div>
        
        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <motion.div
            className="mb-6"
            {...fadeInUp}
          >
            <div className="inline-flex items-center space-x-2 bg-demiland-100 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-demiland-600" />
              <span className="text-sm font-medium text-demiland-700">Our Story</span>
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-7xl font-light text-charcoal-800 mb-6 md:mb-8 leading-tight px-4 sm:px-0"
            {...fadeInUp}
            transition={{ delay: 0.1 }}
          >
            About <span className="font-medium text-demiland-600">DEMILAND</span>
          </motion.h1>
          
          <motion.p 
            className="text-lg sm:text-xl md:text-2xl text-charcoal-600 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0"
            {...fadeInUp}
            transition={{ delay: 0.2 }}
          >
            Where luxury meets innovation, and every detail tells a story of beauty, 
            <span className="text-demiland-600 font-medium"> elegance, and empowerment</span>
          </motion.p>
          
          <motion.div
            className="mt-12 flex flex-col sm:flex-row gap-4 justify-center"
            {...fadeInUp}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-center space-x-4 sm:space-x-8 text-xs sm:text-sm text-charcoal-500">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-demiland-500 rounded-full"></div>
                <span>Premium Quality</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-demiland-500 rounded-full"></div>
                <span>Innovative Design</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-demiland-500 rounded-full"></div>
                <span>Luxury Experience</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Our Story Section */}
      <motion.section 
        className="py-20 bg-white"
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={fadeInUp}>
              <h2 className="text-4xl font-bold text-charcoal-800 mb-6">Our Story</h2>
              <p className="text-lg text-charcoal-600 mb-6">
                In the ever-evolving world of beauty, DEMILAND shines as a brand dedicated to empowering the 
                modern woman who seeks excellence and elegance in every detail. We craft beauty with a professional 
                touch, offering a comprehensive range of beauty care products that combine high quality, 
                innovation, and ease of use.
              </p>
              <p className="text-lg text-charcoal-600 mb-6">
                Our distinctive collection includes eyelashes with diverse designs for both everyday and special 
                occasions, elegant artificial nails with superior quality, professional adhesives for lasting 
                wear, and carefully selected beauty accessories that add a professional touch to your look.
              </p>
              <p className="text-lg text-charcoal-600">
                At DEMILAND, we believe that beauty lies in the details. That's why we are committed to providing 
                innovative products that suit different tastes and lifestyles, giving you confidence and radiance 
                in every moment.
              </p>
            </motion.div>
            
            <motion.div 
              className="relative h-96 bg-gradient-to-br from-demiland-100 to-demiland-200 rounded-3xl overflow-hidden shadow-xl group"
              variants={fadeInUp}
              whileHover={{ scale: 1.02 }}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full"></div>
                <div className="absolute top-20 right-20 w-16 h-16 bg-white rounded-full"></div>
                <div className="absolute bottom-20 left-20 w-12 h-12 bg-white rounded-full"></div>
                <div className="absolute bottom-10 right-10 w-24 h-24 bg-white rounded-full"></div>
              </div>
              
              {/* Content */}
              <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-8">
                <div className="w-32 h-32 bg-gradient-to-br from-demiland-500 to-demiland-700 rounded-full flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <img 
                    src="/demiland_logo_png.png" 
                    alt="DEMILAND" 
                    className="w-16 h-16 object-contain filter brightness-0 invert"
                  />
                </div>
                <h3 className="text-2xl font-bold text-charcoal-800 mb-2">DEMILAND Heritage</h3>
                <p className="text-charcoal-600 leading-relaxed">
                  Crafting beauty excellence since inception, with a commitment to innovation and luxury that defines modern cosmetics.
                </p>
                
                {/* Decorative elements */}
                <div className="absolute top-6 right-6">
                  <Sparkles className="w-6 h-6 text-demiland-500 opacity-60" />
                </div>
                <div className="absolute bottom-6 left-6">
                  <Crown className="w-5 h-5 text-demiland-600 opacity-50" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Our Values Section */}
      <motion.section 
        className="py-20 bg-gradient-to-br from-demiland-50 to-white"
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" variants={fadeInUp}>
            <h2 className="text-4xl font-bold text-charcoal-800 mb-4">Our Values</h2>
            <p className="text-xl text-charcoal-600">The principles that guide everything we do</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: Sparkles,
                title: "Excellence",
                description: "Every DEMILAND product embodies the highest standards of luxury and sophistication in cosmetics.",
                color: "text-demiland-600"
              },
              {
                icon: Palette,
                title: "Artistry",
                description: "Beauty is an art form. Our products are designed to inspire creativity and self-expression.",
                color: "text-purple-600"
              },
              {
                icon: Star,
                title: "Premium Quality",
                description: "We use only the finest ingredients and advanced formulations to create exceptional beauty products.",
                color: "text-yellow-600"
              },
              {
                icon: Gem,
                title: "Luxury",
                description: "DEMILAND represents the epitome of luxury cosmetics, crafted for those who appreciate the finest things.",
                color: "text-pink-600"
              },
              {
                icon: Microscope,
                title: "Innovation",
                description: "Cutting-edge beauty technology meets timeless elegance in every DEMILAND creation.",
                color: "text-blue-600"
              },
              {
                icon: Crown,
                title: "Elegance",
                description: "Sophisticated design and refined aesthetics define the DEMILAND experience.",
                color: "text-indigo-600"
              }
            ].map((value, index) => {
              const IconComponent = value.icon;
              return (
                <motion.div
                  key={index}
                  className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center group border border-gray-100 hover:border-demiland-200"
                  variants={fadeInUp}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-demiland-100 to-demiland-200 flex items-center justify-center group-hover:from-demiland-200 group-hover:to-demiland-300 transition-colors duration-300`}>
                    <IconComponent className={`w-8 h-8 ${value.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-charcoal-800 mb-4 group-hover:text-demiland-700 transition-colors">{value.title}</h3>
                  <p className="text-charcoal-600 leading-relaxed">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Signature Artistry Section */}
      <motion.section 
        className="py-24 bg-gradient-to-b from-charcoal-50 to-white relative overflow-hidden"
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        {/* Elegant Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-96 h-96 bg-demiland-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div className="text-center mb-20" variants={fadeInUp}>
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-demiland-100 to-purple-100 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-demiland-600" />
              <span className="text-sm font-medium text-demiland-700">Signature Collections</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-light text-charcoal-800 mb-6">
              <span className="font-light">Signature</span> <span className="font-medium text-demiland-600">Artistry</span>
            </h2>
            <p className="text-xl md:text-2xl text-charcoal-600 max-w-3xl mx-auto leading-relaxed">
              Where precision meets artistry in our meticulously crafted beauty collections
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            {[
              { 
                name: "Ethereal Eyes", 
                subtitle: "The Art of Allure",
                description: "Handcrafted with ethereal precision, each lash tells a story of sophistication. From whisper-soft naturals to dramatic statement pieces that command attention.", 
                accent: "Dramatic · Natural · Ethereal",
                category: "eyes",
                colorScheme: "from-purple-900 via-demiland-800 to-charcoal-900"
              },
              { 
                name: "Sculpted Nails", 
                subtitle: "Architectural Elegance",
                description: "Where artistry meets engineering. Our nail collections embody architectural precision with designs that elevate your hands to works of art.",
                accent: "Sculptural · Refined · Artistic",
                category: "nails", 
                colorScheme: "from-rose-900 via-pink-800 to-purple-900"
              },
              { 
                name: "Professional Tools", 
                subtitle: "The Master's Arsenal",
                description: "Precision instruments for the discerning artist. Professional-grade tools and accessories that ensure your artistry endures with flawless perfection.",
                accent: "Professional · Lasting · Precise",
                category: "tools",
                colorScheme: "from-indigo-900 via-blue-800 to-charcoal-900"
              },
              { 
                name: "Flawless Complexion", 
                subtitle: "Perfect Canvas",
                description: "The foundation of beauty excellence. Carefully curated complexion products that create the perfect canvas for your artistic expression.",
                accent: "Flawless · Refined · Essential", 
                category: "complexion",
                colorScheme: "from-demiland-900 via-purple-800 to-indigo-900"
              }
            ].map((collection, index) => (
              <motion.div
                key={index}
                className="group cursor-pointer"
                variants={fadeInUp}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.4 }}
                onClick={() => navigateTo('shop', { category: collection.category })}
              >
                <div className="relative overflow-hidden rounded-3xl bg-white shadow-2xl hover:shadow-3xl transition-all duration-500">
                  {/* Elegant Header with Gradient */}
                  <div className={`h-32 bg-gradient-to-br ${collection.colorScheme} relative overflow-hidden`}>
                    {/* Subtle Pattern */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-4 left-4 w-16 h-16 border border-white/30 rounded-full"></div>
                      <div className="absolute top-8 right-8 w-8 h-8 border border-white/20 rounded-full"></div>
                      <div className="absolute bottom-6 left-8 w-12 h-12 border border-white/25 rounded-full"></div>
                    </div>
                    
                    {/* Elegant Number */}
                    <div className="absolute top-6 right-6 text-white/40 text-6xl font-light">
                      {(index + 1).toString().padStart(2, '0')}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-8">
                    <div className="mb-4">
                      <h3 className="text-2xl font-bold text-charcoal-800 mb-1 group-hover:text-demiland-700 transition-colors">
                        {collection.name}
                      </h3>
                      <p className="text-demiland-600 font-medium text-sm tracking-wide uppercase">
                        {collection.subtitle}
                      </p>
                    </div>
                    
                    <p className="text-charcoal-600 leading-relaxed mb-6 text-sm">
                      {collection.description}
                    </p>
                    
                    {/* Accent Tags */}
                    <div className="mb-6">
                      <div className="flex flex-wrap gap-1 text-xs">
                        {collection.accent.split(' · ').map((tag, tagIndex) => (
                          <span key={tagIndex} className="bg-demiland-50 text-demiland-700 px-2 py-1 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Elegant Divider */}
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-demiland-200 to-transparent mb-6"></div>
                    
                    {/* Call to Action */}
                    <div className="flex items-center justify-between">
                      <span className="text-demiland-600 font-medium text-sm group-hover:text-demiland-700 transition-colors">
                        Explore Collection
                      </span>
                      <div className="w-8 h-8 rounded-full bg-demiland-100 group-hover:bg-demiland-200 flex items-center justify-center transition-colors">
                        <span className="text-demiland-600 text-sm">→</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Mission Statement */}
      <motion.section 
        className="py-20 bg-gradient-to-r from-demiland-400 to-demiland-600"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.h2 
            className="text-4xl font-bold text-white mb-6"
            {...fadeInUp}
          >
            Our Mission
          </motion.h2>
          <motion.p 
            className="text-2xl text-white opacity-90 leading-relaxed"
            {...fadeInUp}
            transition={{ delay: 0.2 }}
          >
            "To empower the modern woman with innovative beauty products that celebrate her unique details. 
            At DEMILAND, we believe beauty lies in the details – where details make the difference."
          </motion.p>
        </div>
      </motion.section>


      {/* Begin Your Beauty Journey */}
      <motion.section 
        className="py-24 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        {/* Elegant Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal-900 via-demiland-900 to-purple-900"></div>
        
        {/* Sophisticated Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 border border-white/20 rounded-full"></div>
          <div className="absolute top-40 right-32 w-32 h-32 border border-white/15 rounded-full"></div>
          <div className="absolute bottom-32 left-40 w-48 h-48 border border-white/10 rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 border border-white/5 rounded-full"></div>
        </div>
        
        {/* Elegant Light Rays */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
          <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content Side */}
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <motion.div className="mb-8" variants={fadeInUp}>
                <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                  <Crown className="w-4 h-4 text-white/80" />
                  <span className="text-sm font-medium text-white/90">Exclusive Invitation</span>
                </div>
                <h2 className="text-5xl md:text-6xl font-light text-white mb-6 leading-tight">
                  Begin Your <br />
                  <span className="font-medium bg-gradient-to-r from-white to-demiland-200 bg-clip-text text-transparent">
                    Beauty Journey
                  </span>
                </h2>
                <div className="w-24 h-px bg-gradient-to-r from-white/60 to-transparent mb-6"></div>
              </motion.div>
              
              <motion.p 
                className="text-xl text-white/80 leading-relaxed mb-8"
                variants={fadeInUp}
                transition={{ delay: 0.1 }}
              >
                Step into a world where luxury meets artistry. Where every detail is crafted with precision, 
                and every moment becomes an expression of your unique beauty.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-6"
                variants={fadeInUp}
                transition={{ delay: 0.2 }}
              >
                <motion.button 
                  className="group relative bg-white text-charcoal-800 px-10 py-4 rounded-full font-medium text-lg overflow-hidden shadow-2xl hover:shadow-white/20 transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigateTo('shop')}
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <span>Explore Collection</span>
                    <Sparkles className="w-5 h-5" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-demiland-100 to-purple-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </motion.button>
                
                <motion.button 
                  className="group border-2 border-white/30 text-white px-10 py-4 rounded-full font-medium text-lg backdrop-blur-sm hover:border-white/60 hover:bg-white/10 transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigateTo('contact')}
                >
                  <span className="flex items-center space-x-2">
                    <span>Get Started</span>
                    <div className="w-5 h-5 rounded-full border border-white/60 flex items-center justify-center">
                      <span className="text-xs">→</span>
                    </div>
                  </span>
                </motion.button>
              </motion.div>
            </motion.div>
            
            {/* Visual Side */}
            <motion.div 
              className="relative"
              variants={fadeInUp}
              transition={{ delay: 0.3 }}
            >
              <div className="relative">
                {/* Elegant Frame */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-3xl backdrop-blur-sm border border-white/20"></div>
                
                {/* Content */}
                <div className="relative p-12 text-center">
                  {/* Decorative Logo */}
                  <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center backdrop-blur-sm border border-white/30">
                    <img 
                      src="/demiland_logo_png.png" 
                      alt="DEMILAND" 
                      className="w-16 h-16 object-contain filter brightness-0 invert"
                    />
                  </div>
                  
                  <h3 className="text-3xl font-light text-white mb-4">
                    DEMILAND
                  </h3>
                  <p className="text-white/70 text-lg leading-relaxed mb-8">
                    "Where details make the difference"
                  </p>
                  
                  {/* Elegant Stats */}
                  <div className="grid grid-cols-3 gap-6 text-center">
                    {[
                      { number: "15+", label: "Years" },
                      { number: "∞", label: "Artistry" },
                      { number: "100%", label: "Luxury" }
                    ].map((stat, index) => (
                      <div key={index} className="relative">
                        <div className="text-2xl font-light text-white mb-1">{stat.number}</div>
                        <div className="text-white/60 text-sm">{stat.label}</div>
                        {index < 2 && (
                          <div className="absolute top-1/2 -right-3 w-px h-8 bg-white/20 transform -translate-y-1/2"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-white/20 rounded-full backdrop-blur-sm"></div>
                <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-white/10 rounded-full backdrop-blur-sm"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

    </div>
  );
};

export default AboutPage;