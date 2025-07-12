# 🌟 Beauty Brand - React Wireframes

A comprehensive collection of React wireframes for a modern beauty brand web store with showroom functionality. This project showcases a complete user experience from homepage to admin dashboard, featuring premium cosmetics and skincare products in a digital showroom environment.

## 📋 Project Overview

This project contains fully functional React wireframes for:
- **Customer-facing pages**: Homepage, Products, About, Contact, Authentication
- **User dashboard**: Profile management, favorites, history
- **Admin panel**: Complete ERP system with user management, product catalog, analytics, and CRM
- **Product showcase**: Detailed product pages with reviews and recommendations

## 🎨 Design Philosophy

- **Modern & Clean**: Contemporary design with smooth animations
- **Mobile-First**: Responsive design that works on all devices
- **Premium Feel**: Gradient backgrounds, elegant typography, and sophisticated color schemes
- **User-Centric**: Intuitive navigation and clear information hierarchy

## 🚀 Tech Stack

### Frontend
- **React 18.2+** - Modern React with hooks and context
- **Framer Motion 10.16+** - Smooth animations and transitions
- **Tailwind CSS 3.3+** - Utility-first CSS framework
- **Vite** - Fast development build tool

### Features
- **State Management**: React Context API with custom hooks
- **Animation System**: Framer Motion for page transitions and micro-interactions
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Component Architecture**: Reusable, modular components
- **TypeScript Ready**: Prepared for TypeScript integration

## 📁 Project Structure

```
beauty-brand-wireframes/
├── src/
│   ├── components/
│   │   ├── App.jsx                 # Main application component
│   │   ├── Homepage.jsx            # Landing page
│   │   ├── ProductsPage.jsx        # Product catalog with filters
│   │   ├── ProductDetail.jsx       # Individual product view
│   │   ├── AboutPage.jsx           # Company information
│   │   ├── ContactPage.jsx         # Contact form and info
│   │   ├── AuthPage.jsx            # Login/Register forms
│   │   ├── UserProfile.jsx         # User dashboard
│   │   └── AdminDashboard.jsx      # Admin ERP system
│   ├── styles/
│   └── utils/
├── package.json
└── README.md
```

## 🎯 Key Features

### 🏠 Homepage
- Hero section with dynamic background
- Featured products carousel
- Company values showcase
- Newsletter signup
- Animated elements with Framer Motion

### 💄 Products Page
- Advanced filtering system (category, price, brand, rating)
- Grid/List view toggle
- Search functionality
- Product favoriting
- Pagination with load more

### 🔍 Product Detail
- Image gallery with thumbnails
- Shade selection for cosmetics
- Customer reviews and ratings
- Product specifications
- Related products suggestions
- AR try-on placeholder

### 👤 User Profile
- Personal information management
- Beauty profile customization
- Favorite products collection
- Activity history tracking
- Notification preferences

### ⚙️ Admin Dashboard
- **Overview**: Key metrics and quick actions
- **User Management**: Customer database with search and filters
- **Product Management**: Add/edit/delete products with category management
- **Analytics**: Traffic charts and popular products
- **CRM**: Email campaigns and customer inquiries
- **Role-based access**: Different permissions for admin levels

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 16.0.0 or higher
- npm 8.0.0 or higher

### Installation

1. **Clone or download the project files**
   ```bash
   # If using git
   git clone [repository-url]
   cd beauty-brand-wireframes
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Tailwind CSS**
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

4. **Configure Tailwind CSS**
   
   Update `tailwind.config.js`:
   ```javascript
   module.exports = {
     content: [
       "./index.html",
       "./src/**/*.{js,ts,jsx,tsx}",
     ],
     theme: {
       extend: {
         colors: {
           pink: {
             50: '#fdf2f8',
             500: '#ec4899',
             600: '#db2777',
             700: '#be185d',
           },
           purple: {
             500: '#8b5cf6',
             600: '#7c3aed',
           }
         }
       },
     },
     plugins: [],
   }
   ```

5. **Add Tailwind directives to CSS**
   
   Create `src/index.css`:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

6. **Create a simple index.html**
   ```html
   <!DOCTYPE html>
   <html lang="en">
     <head>
       <meta charset="UTF-8" />
       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
       <title>Beauty Brand Wireframes</title>
     </head>
     <body>
       <div id="root"></div>
       <script type="module" src="/src/main.jsx"></script>
     </body>
   </html>
   ```

7. **Create main.jsx**
   ```javascript
   import React from 'react'
   import ReactDOM from 'react-dom/client'
   import App, { DevNavigation } from './App.jsx'
   import './index.css'

   ReactDOM.createRoot(document.getElementById('root')).render(
     <React.StrictMode>
       <App />
       <DevNavigation />
     </React.StrictMode>,
   )
   ```

8. **Start the development server**
   ```bash
   npm run dev
   ```

9. **Open in browser**
   Navigate to `http://localhost:5173`

## 🎮 Using the Wireframes

### Development Navigation
- Use the floating navigation panel (bottom-left) to switch between pages
- Test different user states (logged in/out, admin/user roles)
- All interactions are simulated with mock data

### Page Navigation
- **Homepage** → Main landing page with hero and features
- **Products** → Product catalog with filtering
- **Product Detail** → Individual product view
- **About** → Company information and values
- **Contact** → Contact form and information
- **Auth** → Login/Register forms
- **Profile** → User dashboard (requires login simulation)
- **Admin** → Admin panel (requires admin role simulation)

## 🎨 Customization Guide

### Colors
The project uses a pink and purple gradient theme. Update colors in:
- Tailwind config for global color scheme
- Gradient backgrounds in component styles
- Brand logo colors

### Animations
Framer Motion animations are configured in each component:
- `fadeInUp` - Standard fade and slide animation
- `staggerContainer` - Stagger children animations
- Page transitions in the Router component

### Layout
- Responsive breakpoints: `sm:` (640px), `md:` (768px), `lg:` (1024px), `xl:` (1280px)
- Max content width: `max-w-7xl` (1280px)
- Consistent spacing using Tailwind's spacing scale

## 📱 Responsive Design

All components are designed mobile-first:
- **Mobile** (320px+): Single column layouts, collapsible navigation
- **Tablet** (768px+): Two-column layouts, expanded navigation
- **Desktop** (1024px+): Multi-column layouts, full navigation bar

## 🔧 Component Architecture

### Context Providers
- **AuthContext**: User authentication state
- **ProductContext**: Product data and favorites
- **UIContext**: Navigation and UI state

### Custom Hooks
- `useAuth()`: Access authentication context
- `useProducts()`: Access product context  
- `useUI()`: Access UI context

### Shared Components
- Consistent header/navigation across pages
- Reusable product cards
- Form components with validation
- Loading states and notifications

## 🚀 Future Enhancements

### Phase 1: Core Features
- [ ] Real API integration
- [ ] User authentication system
- [ ] Product database
- [ ] File upload for images

### Phase 2: Advanced Features
- [ ] Payment integration (for future e-commerce)
- [ ] Email notification system
- [ ] Advanced analytics
- [ ] Multi-language support

### Phase 3: Premium Features
- [ ] AR/VR try-on functionality
- [ ] AI-powered recommendations
- [ ] Social media integration
- [ ] Advanced CRM features

## 📞 Support & Contact

For questions about implementation or customization:
- Review component code and comments
- Check Tailwind CSS documentation
- Refer to Framer Motion documentation
- Contact the development team

## 📄 License

MIT License - feel free to use this project as a foundation for your beauty brand website.

---

**Built with ❤️ for the modern beauty industry**

*This wireframe collection provides a solid foundation for developing a premium beauty brand website with showroom functionality. The modular architecture ensures easy customization and scalability for future enhancements.*