import React, { useState } from 'react';
import { motion } from 'framer-motion';

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1995-06-15',
    skinType: 'Combination',
    skinTone: 'Medium',
    beautyPreferences: ['Cruelty-free', 'Vegan', 'Natural ingredients'],
    newsletterSubscribed: true,
    smsNotifications: false
  });

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

  // Mock data
  const favoriteProducts = [
    { id: 1, name: "Luxury Lipstick", brand: "BeautyBrand", image: "lipstick.jpg", savedDate: "2024-01-10" },
    { id: 2, name: "Hydrating Serum", brand: "SkinCare Co", image: "serum.jpg", savedDate: "2024-01-08" },
    { id: 3, name: "Foundation Set", brand: "MakeupPro", image: "foundation.jpg", savedDate: "2024-01-05" },
    { id: 4, name: "Eye Palette", brand: "ColorMe", image: "palette.jpg", savedDate: "2024-01-03" }
  ];

  const orderHistory = [
    { id: 1, date: "2024-01-15", status: "Viewed", items: 3, total: 0.00, type: "Showroom Visit" },
    { id: 2, date: "2024-01-10", status: "Completed", items: 2, total: 0.00, type: "Virtual Try-On" },
    { id: 3, date: "2024-01-05", status: "Viewed", items: 5, total: 0.00, type: "Product Inquiry" }
  ];

  const beautyProfile = {
    skinType: ['Oily', 'Dry', 'Combination', 'Sensitive', 'Normal'],
    skinTone: ['Fair', 'Light', 'Medium', 'Tan', 'Deep', 'Rich'],
    concerns: ['Anti-aging', 'Acne', 'Dryness', 'Dark spots', 'Sensitivity', 'Pores'],
    preferences: ['Cruelty-free', 'Vegan', 'Natural ingredients', 'Organic', 'Fragrance-free', 'Hypoallergenic']
  };

  const notifications = [
    { id: 1, type: 'product', title: 'New Product Alert', message: 'Check out our latest lipstick collection!', date: '2024-01-15', read: false },
    { id: 2, type: 'promo', title: 'Special Offer', message: '20% off on skincare products this week', date: '2024-01-12', read: true },
    { id: 3, type: 'info', title: 'Beauty Tips', message: 'Learn how to achieve the perfect smoky eye look', date: '2024-01-10', read: true }
  ];

  const handleInputChange = (field, value) => {
    setProfileData({
      ...profileData,
      [field]: value
    });
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    // Save profile data
    console.log('Profile saved:', profileData);
  };

  const TabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <motion.div 
            className="space-y-8"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {/* Profile Header */}
            <motion.div 
              className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-8 text-white"
              variants={fadeInUp}
            >
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold">{profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}</span>
                </div>
                <div>
                  <h2 className="text-3xl font-bold">{profileData.firstName} {profileData.lastName}</h2>
                  <p className="text-xl opacity-90">{profileData.email}</p>
                  <p className="opacity-80">Member since January 2024</p>
                </div>
              </div>
            </motion.div>

            {/* Personal Information */}
            <motion.div 
              className="bg-white rounded-2xl p-8 shadow-sm"
              variants={fadeInUp}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Personal Information</h3>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors"
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-lg">{profileData.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-lg">{profileData.lastName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-lg">{profileData.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-lg">{profileData.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={profileData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-lg">{new Date(profileData.dateOfBirth).toLocaleDateString()}</p>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="mt-6 flex space-x-3">
                  <button
                    onClick={handleSaveProfile}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </motion.div>

            {/* Beauty Profile */}
            <motion.div 
              className="bg-white rounded-2xl p-8 shadow-sm"
              variants={fadeInUp}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Beauty Profile</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Skin Type</label>
                  <select
                    value={profileData.skinType}
                    onChange={(e) => handleInputChange('skinType', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    {beautyProfile.skinType.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Skin Tone</label>
                  <select
                    value={profileData.skinTone}
                    onChange={(e) => handleInputChange('skinTone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    {beautyProfile.skinTone.map(tone => (
                      <option key={tone} value={tone}>{tone}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Beauty Preferences</label>
                <div className="grid md:grid-cols-3 gap-3">
                  {beautyProfile.preferences.map(preference => (
                    <label key={preference} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={profileData.beautyPreferences.includes(preference)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleInputChange('beautyPreferences', [...profileData.beautyPreferences, preference]);
                          } else {
                            handleInputChange('beautyPreferences', profileData.beautyPreferences.filter(p => p !== preference));
                          }
                        }}
                        className="mr-2 text-pink-600 focus:ring-pink-500"
                      />
                      <span className="text-sm text-gray-700">{preference}</span>
                    </label>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        );

      case 'favorites':
        return (
          <motion.div variants={fadeInUp} initial="initial" animate="animate">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Favorite Products ({favoriteProducts.length})</h3>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                    whileHover={{ y: -5 }}
                  >
                    <div className="h-48 bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                      <span className="text-gray-500">{product.image}</span>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-800">{product.name}</h4>
                        <button className="text-red-500 hover:text-red-700">
                          <span className="text-xl">❤️</span>
                        </button>
                      </div>
                      <p className="text-pink-600 font-medium mb-3">{product.brand}</p>
                      <p className="text-xs text-gray-500 mb-3">Saved on {product.savedDate}</p>
                      <div className="flex space-x-2">
                        <button className="flex-1 bg-pink-600 text-white py-2 px-3 rounded-lg hover:bg-pink-700 transition-colors text-sm">
                          View Details
                        </button>
                        <button className="flex-1 bg-gray-100 text-gray-800 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                          Remove
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 'history':
        return (
          <motion.div variants={fadeInUp} initial="initial" animate="animate">
            <div className="bg-white rounded-2xl shadow-sm">
              <div className="p-8 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800">Activity History</h3>
                <p className="text-gray-600 mt-1">Your interactions with our beauty showroom</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orderHistory.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.items} products</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            order.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                            order.status === 'Viewed' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-pink-600 hover:text-pink-900">View Details</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        );

      case 'notifications':
        return (
          <motion.div variants={fadeInUp} initial="initial" animate="animate">
            <div className="space-y-6">
              {/* Notification Settings */}
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Notification Preferences</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800">Email Newsletter</h4>
                      <p className="text-sm text-gray-600">Receive beauty tips and product updates</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profileData.newsletterSubscribed}
                        onChange={(e) => handleInputChange('newsletterSubscribed', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800">SMS Notifications</h4>
                      <p className="text-sm text-gray-600">Get notified about exclusive offers</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profileData.smsNotifications}
                        onChange={(e) => handleInputChange('smsNotifications', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Recent Notifications */}
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Recent Notifications</h3>
                
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border ${
                        notification.read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-2xl">
                              {notification.type === 'product' ? '💄' : 
                               notification.type === 'promo' ? '🎉' : 'ℹ️'}
                            </span>
                            <h4 className="font-medium text-gray-800">{notification.title}</h4>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-2">{notification.date}</p>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                          <span className="text-xl">×</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return <div>Select a tab</div>;
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: '👤' },
    { id: 'favorites', name: 'Favorites', icon: '❤️' },
    { id: 'history', name: 'History', icon: '📝' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <span className="ml-2 text-xl font-semibold text-gray-800">BeautyBrand</span>
            </div>

            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-600 hover:text-pink-600 transition-colors">Home</a>
              <a href="#" className="text-gray-600 hover:text-pink-600 transition-colors">Products</a>
              <a href="#" className="text-gray-600 hover:text-pink-600 transition-colors">About</a>
              <a href="#" className="text-gray-600 hover:text-pink-600 transition-colors">Contact</a>
            </nav>

            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {profileData.firstName}!</span>
              <button className="bg-pink-600 text-white px-4 py-2 rounded-full hover:bg-pink-700 transition-colors">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <motion.div 
            className="lg:w-64"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-white">{profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}</span>
                </div>
                <h3 className="font-semibold text-gray-800">{profileData.firstName} {profileData.lastName}</h3>
                <p className="text-sm text-gray-600">Beauty Enthusiast</p>
              </div>
              
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id 
                        ? 'bg-pink-50 text-pink-600 border-l-4 border-pink-600' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-lg mr-3">{tab.icon}</span>
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="flex-1">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <TabContent />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;