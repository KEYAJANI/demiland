import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useUI } from './App';
import { Mail, MessageCircle, Building2, Phone, MapPin, Clock, Instagram, Send, Sparkles, Crown, ArrowRight } from 'lucide-react';

const ContactPage = () => {
  const { navigateTo } = useUI();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Form submitted:', formData);
      // Reset form after successful submission
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-20">

      {/* Enhanced Hero Section */}
      <motion.section 
        className="relative py-24 md:py-32 bg-gradient-to-br from-charcoal-50 via-white to-demiland-50 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Sophisticated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-96 h-96 bg-demiland-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-gradient-to-r from-demiland-100/10 to-purple-100/10 rounded-full blur-3xl"></div>
        </div>
        
        {/* Elegant Pattern Overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-32 left-32 w-24 h-24 border border-demiland-400 rounded-full"></div>
          <div className="absolute bottom-32 right-32 w-16 h-16 border border-purple-400 rounded-full"></div>
          <div className="absolute top-1/3 right-1/4 w-12 h-12 border border-demiland-300 rounded-full"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <motion.div
            className="mb-8"
            {...fadeInUp}
          >
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-demiland-100 to-purple-100 px-4 py-2 rounded-full mb-8">
              <Crown className="w-4 h-4 text-demiland-600" />
              <span className="text-sm font-medium text-demiland-700">Luxury Beauty Studio</span>
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-7xl lg:text-8xl font-light text-charcoal-800 mb-8 leading-tight"
            {...fadeInUp}
            transition={{ delay: 0.1 }}
          >
            Let's <span className="font-medium text-demiland-600">Connect</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-charcoal-600 max-w-3xl mx-auto leading-relaxed mb-12"
            {...fadeInUp}
            transition={{ delay: 0.2 }}
          >
            Experience the artistry of luxury cosmetics with personalized consultations from our beauty experts. 
            Where every detail is crafted to perfection.
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center"
            {...fadeInUp}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              className="group bg-demiland-700 text-white px-8 py-4 rounded-full font-medium text-lg shadow-lg hover:bg-demiland-800 transition-all duration-300 hover:shadow-xl"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigateTo('shop')}
            >
              <span className="flex items-center space-x-2">
                <span>Explore Collection</span>
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              </span>
            </motion.button>
            
            <motion.button
              className="group border-2 border-demiland-600 text-demiland-700 px-8 py-4 rounded-full font-medium text-lg hover:bg-demiland-600 hover:text-white transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex items-center space-x-2">
                <span>Book Consultation</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Elegant Contact Methods */}
      <motion.section 
        className="py-24 bg-white"
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <motion.div className="text-center mb-20" variants={fadeInUp}>
            <h2 className="text-4xl font-light text-charcoal-800 mb-4">Get in Touch</h2>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-demiland-400 to-transparent mx-auto"></div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                icon: Mail,
                title: "Luxury Correspondence",
                primary: "hello@demiland.com",
                secondary: "beauty@demiland.com",
                description: "Reach our beauty experts for personalized consultations and exclusive product recommendations",
                colorScheme: "from-blue-900 via-demiland-800 to-purple-900",
                bgGradient: "from-blue-50 to-demiland-50",
                accent: "Private · Exclusive · Curated"
              },
              {
                icon: Instagram,
                title: "Digital Atelier",
                primary: "@demiland_iq",
                secondary: "Instagram Community",
                description: "Join our exclusive circle for behind-the-scenes artistry, luxury collections, and beauty inspiration",
                colorScheme: "from-purple-900 via-pink-800 to-rose-900",
                bgGradient: "from-purple-50 to-pink-50",
                accent: "Inspiration · Community · Exclusive"
              },
              {
                icon: Building2,
                title: "Private Atelier",
                primary: "DEMILAND Studio",
                secondary: "London, United Kingdom",
                description: "Exclusive beauty experiences in our luxury studio. Bespoke consultations by appointment only",
                colorScheme: "from-demiland-900 via-purple-800 to-indigo-900",
                bgGradient: "from-demiland-50 to-purple-50",
                accent: "Luxury · Bespoke · Private"
              }
            ].map((contact, index) => (
              <motion.div
                key={index}
                className="group cursor-pointer"
                variants={fadeInUp}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.4 }}
              >
                <div className="relative overflow-hidden rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100">
                  {/* Elegant Header with Gradient */}
                  <div className={`h-24 bg-gradient-to-br ${contact.colorScheme} relative overflow-hidden`}>
                    {/* Subtle Pattern */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-2 left-4 w-12 h-12 border border-white/30 rounded-full"></div>
                      <div className="absolute top-4 right-6 w-6 h-6 border border-white/20 rounded-full"></div>
                      <div className="absolute bottom-2 left-8 w-8 h-8 border border-white/25 rounded-full"></div>
                    </div>
                    
                    {/* Icon */}
                    <div className="absolute top-4 right-4 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <contact.icon className="w-6 h-6 text-white" />
                    </div>
                    
                    {/* Elegant Number */}
                    <div className="absolute top-3 left-4 text-white/40 text-3xl font-light">
                      {(index + 1).toString().padStart(2, '0')}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-8">
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-charcoal-800 mb-2 group-hover:text-demiland-700 transition-colors">
                        {contact.title}
                      </h3>
                      
                      <div className="space-y-1 mb-4">
                        <p className="text-demiland-600 font-semibold text-lg">{contact.primary}</p>
                        <p className="text-charcoal-500 text-sm font-medium">{contact.secondary}</p>
                      </div>
                    </div>
                    
                    <p className="text-charcoal-600 leading-relaxed mb-6 text-sm">
                      {contact.description}
                    </p>
                    
                    {/* Accent Tags */}
                    <div className="mb-6">
                      <div className="flex flex-wrap gap-1 text-xs">
                        {contact.accent.split(' · ').map((tag, tagIndex) => (
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
                        Connect Now
                      </span>
                      <div className="w-8 h-8 rounded-full bg-demiland-100 group-hover:bg-demiland-200 flex items-center justify-center transition-colors">
                        <ArrowRight className="w-4 h-4 text-demiland-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Enhanced Contact Form & Studio Info */}
      <motion.section 
        className="py-24 bg-gradient-to-br from-gray-50 to-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            
            {/* Enhanced Contact Form */}
            <motion.div 
              className="bg-white/90 backdrop-blur-sm p-10 rounded-3xl shadow-xl border border-demiland-100/50"
              {...fadeInUp}
            >
              <div className="text-center mb-12">
                <div className="inline-flex items-center space-x-2 bg-demiland-50 px-4 py-2 rounded-full mb-6">
                  <MessageCircle className="w-4 h-4 text-demiland-600" />
                  <span className="text-sm font-medium text-demiland-700">Get in Touch</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-light text-charcoal-800 mb-4">
                  Begin Your <span className="font-medium text-demiland-600">Beauty Journey</span>
                </h3>
                <p className="text-charcoal-600 max-w-md mx-auto leading-relaxed">
                  Share your beauty goals with our experts and let us create a personalized experience just for you.
                </p>
                <div className="w-24 h-px bg-gradient-to-r from-transparent via-demiland-400 to-transparent mx-auto mt-6"></div>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-charcoal-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 bg-white/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-demiland-400 focus:border-transparent outline-none transition-all duration-300 placeholder-charcoal-400"
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-charcoal-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 bg-white/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-demiland-400 focus:border-transparent outline-none transition-all duration-300 placeholder-charcoal-400"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="subject" className="block text-sm font-medium text-charcoal-700">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 bg-white/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-demiland-400 focus:border-transparent outline-none transition-all duration-300"
                  >
                    <option value="">Select consultation type</option>
                    <option value="beauty-consultation">Beauty Consultation</option>
                    <option value="product-inquiry">Product Inquiry</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="press">Press & Media</option>
                    <option value="general">General Inquiry</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm font-medium text-charcoal-700">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 bg-white/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-demiland-400 focus:border-transparent outline-none transition-all duration-300 resize-none placeholder-charcoal-400"
                    placeholder="Tell us about your beauty goals and how we can help you achieve them..."
                  ></textarea>
                </div>
                
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full bg-gradient-to-r from-demiland-700 to-demiland-800 text-white py-4 px-8 rounded-2xl font-medium hover:from-demiland-800 hover:to-demiland-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                >
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </motion.button>
              </form>
            </motion.div>

            {/* Enhanced Studio Information */}
            <motion.div 
              className="space-y-8"
              {...fadeInUp}
              transition={{ delay: 0.2 }}
            >
              {/* DEMILAND Studio */}
              <div className="bg-gradient-to-br from-demiland-50 to-white p-10 rounded-3xl border border-demiland-100 shadow-sm">
                <div className="flex items-center space-x-4 mb-6">
                  <img 
                    src="https://ik.imagekit.io/oriwj2eis/Demiland_imgs/demiland_logo_png.png?updatedAt=1752315168597" 
                    alt="DEMILAND luxury beauty cosmetics logo" 
                    className="w-12 h-12 object-contain"
                  />
                  <h3 className="text-2xl font-light text-charcoal-800">DEMILAND Atelier</h3>
                </div>
                
                <div className="space-y-4 text-charcoal-600">
                  <p className="text-lg font-medium">Private Beauty Studio</p>
                  <p>Exclusive consultations and bespoke beauty experiences</p>
                  <p>Available by appointment only</p>
                  
                  <div className="pt-4 border-t border-demiland-100">
                    <p className="text-sm text-demiland-600 font-medium">Studio Address</p>
                    <p className="text-sm">CHASE BUSINESS CENTRE</p>
                    <p className="text-sm">39-41 CHASE SIDE</p>
                    <p className="text-sm">LONDON, UNITED KINGDOM N14 5EBP</p>
                  </div>
                  
                  <div className="pt-4 border-t border-demiland-100">
                    <p className="text-sm text-demiland-600 font-medium">Follow our journey</p>
                    <p className="text-sm">@demiland_iq for the latest collections</p>
                  </div>
                </div>
              </div>

              {/* Enhanced FAQ */}
              <div className="bg-gradient-to-br from-white to-demiland-50/30 p-10 rounded-3xl border border-demiland-100 shadow-lg">
                <div className="text-center mb-10">
                  <div className="inline-flex items-center space-x-2 bg-demiland-100 px-4 py-2 rounded-full mb-6">
                    <Sparkles className="w-4 h-4 text-demiland-600" />
                    <span className="text-sm font-medium text-demiland-700">Beauty Expertise</span>
                  </div>
                  <h3 className="text-2xl font-light text-charcoal-800 mb-4">Expert Guidance</h3>
                  <div className="w-16 h-px bg-gradient-to-r from-transparent via-demiland-400 to-transparent mx-auto"></div>
                </div>
                
                <div className="space-y-8">
                  {[
                    {
                      question: "How do I book a private DEMILAND consultation?",
                      answer: "Connect with us via hello@demiland.com or @demiland_iq to schedule your exclusive studio experience. Our beauty experts create bespoke consultations tailored to your unique style and goals.",
                      icon: Clock
                    },
                    {
                      question: "What makes DEMILAND collections unique?",
                      answer: "Our signature artistry combines luxury craftsmanship with innovative beauty technology. Each product is meticulously designed to enhance your natural elegance while delivering professional-grade results.",
                      icon: Crown
                    },
                    {
                      question: "Can I experience DEMILAND products before purchasing?",
                      answer: "Absolutely! Visit our private London atelier for hands-on product experiences. Our beauty experts will help you discover the perfect products for your unique beauty journey.",
                      icon: MapPin
                    },
                    {
                      question: "Do you offer personalized beauty solutions?",
                      answer: "Yes, bespoke beauty experiences are our specialty. From custom color matching to personalized application techniques, we create luxury solutions that celebrate your individual beauty.",
                      icon: Sparkles
                    }
                  ].map((faq, index) => (
                    <motion.div
                      key={index}
                      className="group bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-white/50 hover:bg-white/80 transition-all duration-300"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -2, scale: 1.01 }}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-demiland-100 to-demiland-200 rounded-full flex items-center justify-center flex-shrink-0 group-hover:from-demiland-200 group-hover:to-demiland-300 transition-colors">
                          <faq.icon className="w-5 h-5 text-demiland-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-charcoal-800 mb-3 group-hover:text-demiland-700 transition-colors duration-200">
                            {faq.question}
                          </h4>
                          <p className="text-charcoal-600 leading-relaxed text-sm">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {/* Call to Action */}
                <div className="mt-10 text-center">
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-demiland-200 to-transparent mb-6"></div>
                  <p className="text-charcoal-600 mb-4">Have more questions about our luxury beauty services?</p>
                  <motion.button
                    className="inline-flex items-center space-x-2 bg-demiland-700 text-white px-6 py-3 rounded-full font-medium hover:bg-demiland-800 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>Contact Our Experts</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Premium Social Experience Section */}
      <motion.section 
        className="py-24 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        {/* Sophisticated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal-900 via-demiland-900 to-purple-900"></div>
        
        {/* Elegant Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-80 h-80 border border-white/20 rounded-full"></div>
          <div className="absolute top-40 right-32 w-48 h-48 border border-white/15 rounded-full"></div>
          <div className="absolute bottom-20 left-40 w-64 h-64 border border-white/10 rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 border border-white/5 rounded-full"></div>
        </div>
        
        {/* Sophisticated Light Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
          <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-6">
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
                  <Instagram className="w-4 h-4 text-white/80" />
                  <span className="text-sm font-medium text-white/90">Digital Atelier</span>
                </div>
                <h2 className="text-5xl md:text-6xl font-light text-white mb-6 leading-tight">
                  Join Our <br />
                  <span className="font-medium bg-gradient-to-r from-white to-demiland-200 bg-clip-text text-transparent">
                    Beauty Circle
                  </span>
                </h2>
                <div className="w-24 h-px bg-gradient-to-r from-white/60 to-transparent mb-6"></div>
              </motion.div>
              
              <motion.p 
                className="text-xl text-white/80 leading-relaxed mb-8"
                variants={fadeInUp}
                transition={{ delay: 0.1 }}
              >
                Follow our journey for exclusive behind-the-scenes artistry, luxury collection previews, 
                and personalized beauty inspiration from the DEMILAND atelier.
              </motion.p>
              
              <motion.div 
                className="space-y-4 mb-8"
                variants={fadeInUp}
                transition={{ delay: 0.2 }}
              >
                {[
                  "Exclusive collection previews",
                  "Behind-the-scenes beauty artistry", 
                  "Personalized beauty inspiration",
                  "Private studio experiences"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-demiland-400 rounded-full"></div>
                    <span className="text-white/70 text-sm">{feature}</span>
                  </div>
                ))}
              </motion.div>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                variants={fadeInUp}
                transition={{ delay: 0.3 }}
              >
                <motion.button 
                  className="group bg-white text-charcoal-800 px-8 py-4 rounded-full font-medium text-lg shadow-xl hover:shadow-white/20 transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="flex items-center space-x-2">
                    <Instagram className="w-5 h-5" />
                    <span>Follow @demiland_iq</span>
                  </span>
                </motion.button>
                
                <motion.button 
                  className="group border-2 border-white/30 text-white px-8 py-4 rounded-full font-medium text-lg backdrop-blur-sm hover:border-white/60 hover:bg-white/10 transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigateTo('shop')}
                >
                  <span className="flex items-center space-x-2">
                    <span>View Collection</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </motion.button>
              </motion.div>
            </motion.div>
            
            {/* Visual Side */}
            <motion.div 
              className="relative"
              variants={fadeInUp}
              transition={{ delay: 0.4 }}
            >
              <div className="relative">
                {/* Main Social Card */}
                <div className="bg-gradient-to-br from-white/20 to-white/5 rounded-3xl p-8 backdrop-blur-sm border border-white/20">
                  <div className="text-center">
                    {/* Instagram Icon */}
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                      <Instagram className="w-10 h-10 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-light text-white mb-2">
                      @demiland_iq
                    </h3>
                    <p className="text-white/70 mb-6">
                      Luxury Beauty Atelier
                    </p>
                    
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {[
                        { number: "15K+", label: "Followers" },
                        { number: "2.8K", label: "Posts" },
                        { number: "∞", label: "Inspiration" }
                      ].map((stat, index) => (
                        <div key={index} className="text-center">
                          <div className="text-lg font-medium text-white">{stat.number}</div>
                          <div className="text-white/60 text-xs">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Quote */}
                    <div className="border-t border-white/20 pt-6">
                      <p className="text-white/80 text-sm italic">
                        "Where details make the difference"
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute -top-6 -right-6 w-12 h-12 bg-white/20 rounded-full backdrop-blur-sm"></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full backdrop-blur-sm"></div>
                <div className="absolute top-1/2 -right-8 w-8 h-8 bg-demiland-400/30 rounded-full backdrop-blur-sm"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

    </div>
  );
};

export default ContactPage;