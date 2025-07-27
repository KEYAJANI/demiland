# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm run dev` - Start development server (opens at http://localhost:5173)
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

### Code Quality
- `npm run lint` - Run ESLint to check code quality
- `npm run format` - Format code with Prettier

### Database & Backend
- `node test-database.js` - Test Supabase database connectivity
- `node test-mysql-database.js` - Test MySQL database connectivity
- `node src/services/supabase-test.js` - Run comprehensive Supabase service tests
- `node export-supabase-data.js` - Export Supabase data for MySQL migration
- Database schemas: `database-migration.sql` (PostgreSQL) and `database-migration-mysql.sql` (MySQL)
- Product data for import in `product-data-migration.json`
- MySQL migration guide in `MYSQL_MIGRATION_GUIDE.md`

### Installation
- `npm install` - Install all dependencies
- Node.js 16.0.0+ and npm 8.0.0+ required
- Create `.env.local` with Supabase credentials (see Environment Setup below)

## Project Architecture

### Tech Stack
- **React 18.2+** with hooks and Context API for state management
- **Vite** as build tool and development server
- **Tailwind CSS** for styling with custom Demiland brand configuration
- **Framer Motion** for animations and page transitions
- **Database Options**: Supabase (PostgreSQL) or MySQL with custom auth
- **Authentication**: Supabase Auth or JWT-based with bcrypt
- **ImageKit** for image storage and CDN (configured in imagekitService.js)
- **ESLint** for code quality

### Application Structure
This is a single-page React application with client-side routing implemented in `src/components/App.jsx`. The app uses React Context for global state management across three main contexts:

- **AuthContext**: User authentication, login/logout, role-based access
- **ProductContext**: Product data, favorites, search/filter state
- **UIContext**: Navigation state, loading states, notifications

### Component Organization
All components are in `src/components/` as standalone JSX files:

- `App.jsx` - Main application with routing, context providers, and dev navigation
- `Homepage.jsx` - Landing page with hero section and featured products
- `ProductsPage.jsx` - Product catalog with advanced filtering and search
- `ProductDetail.jsx` - Individual product view with image gallery and reviews
- `AboutPage.jsx` - Company information and values
- `ContactPage.jsx` - Contact form and business information
- `AuthPage.jsx` - Login/register forms with form validation
- `UserProfile.jsx` - User dashboard with tabs (profile, favorites, history, settings)
- `AdminDashboard.jsx` - Complete admin panel with 6 modules (overview, users, products, analytics, CRM, settings)

### State Management Pattern
The app uses a custom routing system in `App.jsx` with page state managed by `currentPage`. Context providers wrap the entire application to provide global state access through custom hooks:

```javascript
// Access contexts via custom hooks
const { user, isLoggedIn, login, logout } = useAuth();
const { products, favorites, toggleFavorite } = useProducts();
const { currentPage, setCurrentPage } = useUI();
```

### Styling System
- **Tailwind CSS** with custom configuration in `tailwind.config.js`
- Custom color palette: pink (primary), purple (secondary), orange (accent)
- Custom animations: fade-in, slide-up, bounce-gentle, float
- Responsive design with mobile-first approach
- Custom shadows and gradients for beauty brand aesthetic

### Data Layer Architecture
The application operates in a **hybrid mode** with intelligent fallbacks:

**Primary**: Supabase PostgreSQL database with real-time subscriptions
- Products, categories, users, and authentication managed through Supabase
- Real-time updates for admin dashboard operations
- Row Level Security (RLS) policies for data protection

**Fallback**: Mock data for development/offline mode
- Graceful degradation when Supabase is unavailable
- All components work seamlessly with either data source
- Maintains full functionality during development

### Service Layer Architecture
The application uses a sophisticated service layer in `src/services/` with support for both Supabase and MySQL:

**Core Services**:
- `supabase.js` - Supabase client configuration and database helpers
- `mysql.js` - MySQL connection service and database helpers
- `authService.js` - Authentication with Supabase Auth + user role management
- `authService-mysql.js` - JWT-based authentication for MySQL
- `productService.js` - Product CRUD operations with real-time subscriptions
- `productService-mysql.js` - MySQL-based product operations with polling
- `api.js` - API abstraction layer with fallback mechanisms
- `imagekitService.js` - Image upload and CDN management

**Authentication Flow**:
1. User registration/login through Supabase Auth
2. Automatic profile creation in public.users table
3. Role-based access control (user, admin, super-admin)
4. JWT token management with auto-refresh
5. Real-time auth state synchronization across contexts

## Development Guidelines

### Component Development
- Follow existing component patterns for consistency
- Use Framer Motion for all animations with consistent motion values
- Implement responsive design with Tailwind's mobile-first breakpoints
- Use custom hooks to access context data
- Maintain consistent spacing using Tailwind's spacing scale

### Animation Standards
- Use `motion.div` for all animated elements
- Standard animations: `fadeInUp`, `fadeIn`, `slideInRight`
- Page transitions with `AnimatePresence` and exit animations
- Stagger animations for lists using `staggerContainer` and `staggerChildren`

### Code Quality
- Run `npm run lint` before committing changes
- Use `npm run format` to maintain consistent code formatting
- Components should be self-contained with their own state when possible
- Follow React best practices: proper key props, avoid inline functions in JSX

### Adding New Pages
1. Create new component in `src/components/`
2. Import and add to the pages object in `App.jsx`
3. Add navigation option to DevNavigation component
4. Follow existing component structure and styling patterns

## Environment Setup

### Database Options

**Option 1: Supabase (Default)**
Create `.env.local` with:
```bash
# Supabase Configuration
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Optional: ImageKit Configuration
VITE_IMAGEKIT_URL=your-imagekit-url
VITE_IMAGEKIT_PUBLIC_KEY=your-imagekit-public-key
```

**Option 2: MySQL**
Copy template and configure:
```bash
cp .env.mysql.example .env.local
```
Update with your MySQL credentials:
```bash
# MySQL Configuration
VITE_MYSQL_HOST=localhost
VITE_MYSQL_PORT=3306
VITE_MYSQL_USER=your_username
VITE_MYSQL_PASSWORD=your_password
VITE_MYSQL_DATABASE=demiland_beauty
VITE_JWT_SECRET=your-secure-jwt-secret

# ImageKit (recommended to keep)
VITE_IMAGEKIT_URL=your-imagekit-url
VITE_IMAGEKIT_PUBLIC_KEY=your-imagekit-public-key
```

### Database Setup

**For Supabase (PostgreSQL):**
1. **Create Supabase Project**: Sign up at https://supabase.com
2. **Run Migration**: Execute `database-migration.sql` in Supabase SQL Editor
3. **Import Products**: Follow instructions in `setup-database.md`
4. **Test Connection**: Run `node test-database.js`

**For MySQL:**
1. **Install MySQL 8.0+** and create database: `CREATE DATABASE demiland_beauty;`
2. **Run Schema Migration**: `mysql -u username -p demiland_beauty < database-migration-mysql.sql`
3. **Export from Supabase** (if migrating): `node export-supabase-data.js`
4. **Import Data**: `mysql -u username -p demiland_beauty < supabase-exports/mysql-data-import.sql`
5. **Test Connection**: Run `node test-mysql-database.js`
6. **Migration Guide**: See `MYSQL_MIGRATION_GUIDE.md` for complete instructions

### Admin User Setup
To create admin users, update user metadata in Supabase Auth:
```json
{
  "role": "admin",
  "first_name": "Admin",
  "last_name": "User"
}
```

## Troubleshooting

### Common Issues

**"Missing Supabase environment variables" error**:
- Ensure `.env.local` exists with correct VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
- Restart development server after adding environment variables

**Products not loading**:
- Check database connection with `node test-database.js`
- Verify products table exists and contains data
- Check browser console for specific error messages

**Authentication not working**:
- Verify Supabase Auth is enabled in project settings
- Check RLS policies are properly configured
- Ensure user metadata includes required fields (role, first_name, last_name)

**Real-time updates not working**:
- Verify Realtime is enabled for your tables in Supabase
- Check network connectivity and WebSocket support

### Development vs Production
- **Development**: Uses hybrid mode with graceful fallbacks to mock data
- **Production**: Requires fully configured Supabase backend
- All components are designed to work in both modes seamlessly

## Deployment Architecture

### Three-Tier Deployment Strategy
The project is configured for professional deployment with:

**Production Environment (main branch)**
- URL: `demiland-production.onrender.com`
- Auto-deploys from `main` branch
- Optimized build with `npm run build:prod`
- Production Supabase configuration

**Staging Environment (dev branch)**
- URL: `demiland-staging.onrender.com`  
- Auto-deploys from `dev` branch
- Debug-enabled build with `npm run build:staging`
- Staging Supabase configuration

**Local Development**
- URL: `localhost:5173`
- Hot reload with `npm run dev`
- Development environment variables

### Deployment Commands
- `npm run build:prod` - Production optimized build
- `npm run build:staging` - Staging build with debug info
- `npm run test:build` - Test production build locally
- `npm run deploy:setup` - Copy environment template

### Infrastructure as Code
- `render.yaml` - Render.com deployment configuration
- `.github/workflows/deploy.yml` - GitHub Actions CI/CD
- Automatic deployments with branch-based environments

### Environment Variables by Environment
**All Environments:**
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key

**Production Specific:**
- `NODE_ENV=production`
- `VITE_ENVIRONMENT=production`
- Console logging disabled for performance

**Staging Specific:**
- `NODE_ENV=staging`
- `VITE_ENVIRONMENT=staging`
- `VITE_DEBUG_MODE=true`
- Enhanced debugging and logging

### Deployment Workflow
1. **Feature Development**: Work on feature branches from `dev`
2. **Staging Testing**: Merge to `dev` → auto-deploy to staging
3. **Production Release**: PR from `dev` to `main` → auto-deploy to production
4. **Quality Gates**: ESLint, TypeScript, and build checks on all PRs

See `DEPLOYMENT.md` for complete setup instructions.

This project is built as a production-ready beauty brand website with a comprehensive admin system, real-time features, professional e-commerce functionality, and enterprise-grade deployment pipeline.