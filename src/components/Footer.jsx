import React from 'react';
import { useUI } from './App';
import { Instagram, Facebook, Linkedin, Youtube } from 'lucide-react';

const Footer = () => {
  const { navigateTo } = useUI();

  return (
    <footer className="bg-charcoal-900 text-white py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="/demiland_logo_png.png" 
                alt="Demiland" 
                className="w-8 h-8 object-contain"
              />
              <span className="text-2xl font-medium text-demiland-400">DEMILAND</span>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6 max-w-md">
              Clean, cruelty-free luxury beauty products that enhance your natural glow.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-demiland-600 rounded-full flex items-center justify-center hover:bg-demiland-500 transition-colors cursor-pointer">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-demiland-600 rounded-full flex items-center justify-center hover:bg-demiland-500 transition-colors cursor-pointer">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-demiland-600 rounded-full flex items-center justify-center hover:bg-demiland-500 transition-colors cursor-pointer">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-demiland-600 rounded-full flex items-center justify-center hover:bg-demiland-500 transition-colors cursor-pointer">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Collections */}
          <div>
            <h3 className="text-lg font-medium mb-6 text-demiland-400">Shop</h3>
            <ul className="space-y-3">
              {[
                { name: 'All Products', action: () => navigateTo('shop', { category: 'all' }) },
                { name: 'New Arrivals', action: () => navigateTo('shop', { category: 'new-arrivals' }) },
                { name: 'Eyes', action: () => navigateTo('shop', { category: 'eyes' }) },
                { name: 'Lips', action: () => navigateTo('shop', { category: 'lips' }) },
                { name: 'Tools', action: () => navigateTo('shop', { category: 'tools' }) }
              ].map((item) => (
                <li key={item.name}>
                  <button 
                    onClick={item.action}
                    className="text-gray-400 hover:text-white transition-colors text-left"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h3 className="text-lg font-medium mb-6 text-demiland-400">Support</h3>
            <ul className="space-y-3">
              {[
                { name: 'Contact Us', action: () => navigateTo('contact') },
                { name: 'Shipping Info', action: () => navigateTo('contact') },
                { name: 'Returns', action: () => navigateTo('contact') },
                { name: 'Size Guide', action: () => navigateTo('contact') },
                { name: 'FAQ', action: () => navigateTo('contact') }
              ].map((item) => (
                <li key={item.name}>
                  <button 
                    onClick={item.action}
                    className="text-gray-400 hover:text-white transition-colors text-left"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-medium mb-6 text-demiland-400">Company</h3>
            <ul className="space-y-3">
              {[
                { name: 'About Us', action: () => navigateTo('about') },
                { name: 'Our Story', action: () => navigateTo('about') },
                { name: 'Careers', action: () => navigateTo('about') },
                { name: 'Press', action: () => navigateTo('about') },
                { name: 'Sustainability', action: () => navigateTo('about') }
              ].map((item) => (
                <li key={item.name}>
                  <button 
                    onClick={item.action}
                    className="text-gray-400 hover:text-white transition-colors text-left"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">© 2024 DEMILAND. All rights reserved.</p>
          <div className="flex space-x-6 text-sm">
            <button onClick={() => navigateTo('about')} className="text-gray-400 hover:text-white transition-colors">Privacy Policy</button>
            <button onClick={() => navigateTo('about')} className="text-gray-400 hover:text-white transition-colors">Terms of Service</button>
            <button onClick={() => navigateTo('about')} className="text-gray-400 hover:text-white transition-colors">Cookies</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;