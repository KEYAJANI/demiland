# DEMILAND MySQL Migration Guide

This guide will help you migrate from Supabase (PostgreSQL) to MySQL without losing any data.

## 🚀 Quick Start

### Step 1: Install MySQL Dependencies
```bash
npm install mysql2 bcryptjs jsonwebtoken
```

### Step 2: Set Up MySQL Database
1. Install MySQL Server (8.0+ recommended)
2. Create database:
   ```sql
   CREATE DATABASE demiland_beauty CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. Run the schema migration:
   ```bash
   mysql -u your_username -p demiland_beauty < database-migration-mysql.sql
   ```

### Step 3: Export Your Supabase Data
```bash
node export-supabase-data.js
```
This creates `supabase-exports/` folder with your data.

### Step 4: Import Data to MySQL
```bash
mysql -u your_username -p demiland_beauty < supabase-exports/mysql-data-import.sql
```

### Step 5: Configure Environment
1. Copy the MySQL environment template:
   ```bash
   cp .env.mysql.example .env.local
   ```
2. Update `.env.local` with your MySQL credentials:
   ```env
   VITE_MYSQL_HOST=localhost
   VITE_MYSQL_PORT=3306
   VITE_MYSQL_USER=your_username
   VITE_MYSQL_PASSWORD=your_password
   VITE_MYSQL_DATABASE=demiland_beauty
   VITE_JWT_SECRET=your-secure-jwt-secret
   ```

### Step 6: Switch to MySQL Services
Update your service imports in the main application files:

**src/services/authService.js:**
```javascript
// Replace the import
import authService from './authService-mysql.js';
export default authService;
```

**src/services/productService.js:**
```javascript
// Replace the import  
import productService from './productService-mysql.js';
export default productService;
```

### Step 7: Test the Migration
```bash
node test-mysql-database.js
npm run dev
```

## 📋 Detailed Migration Steps

### 1. Database Schema Conversion

The PostgreSQL schema has been converted to MySQL with these changes:
- **UUID Primary Keys** → VARCHAR(36) with UUID() function
- **JSONB Columns** → JSON columns (MySQL 5.7+)
- **PostgreSQL ENUM** → MySQL ENUM types
- **INET Type** → VARCHAR(45) for IP addresses
- **Triggers** → ON UPDATE CURRENT_TIMESTAMP

### 2. Authentication System Changes

**Supabase Auth** → **Custom JWT Authentication**
- Password hashing with bcrypt
- JWT token management
- Session storage in MySQL
- Role-based access control maintained

### 3. Real-time Features Replacement

**Supabase Real-time** → **Polling System**
- Custom event system for UI updates
- Optional polling for real-time data
- WebSocket support can be added later

### 4. Service Layer Updates

All service files have MySQL versions:
- `mysql.js` - Database connection and helpers
- `authService-mysql.js` - JWT-based authentication
- `productService-mysql.js` - Product CRUD operations

## 🔧 Configuration Details

### MySQL Connection Settings
```javascript
const dbConfig = {
  host: 'localhost',
  port: 3306,
  user: 'your_username', 
  password: 'your_password',
  database: 'demiland_beauty',
  connectionLimit: 10,
  charset: 'utf8mb4'
};
```

### JWT Authentication Settings
```javascript
const JWT_SECRET = 'your-secure-secret-key';
const JWT_EXPIRES_IN = '7d'; // 7 days
```

## 🛠️ Testing & Validation

### Database Connection Test
```bash
node test-mysql-database.js
```

### Application Test
1. Start development server: `npm run dev`
2. Test login/registration
3. Test product loading
4. Test admin dashboard
5. Verify data integrity

### Common Issues & Solutions

**Connection Refused:**
- Ensure MySQL server is running
- Check host/port configuration
- Verify firewall settings

**Access Denied:**
- Check username/password
- Verify user permissions
- Grant necessary privileges

**Missing Tables:**
- Run the schema migration first
- Check database name

**JWT Errors:**
- Set a secure JWT_SECRET
- Check token expiration
- Verify token format

## 🔄 Real-time Updates

### Polling System (Current Implementation)
```javascript
// Start polling every 30 seconds
productService.startPolling(30000);

// Listen for changes
productService.onProductChange((change) => {
  console.log('Product changed:', change);
});

// Stop polling
productService.stopPolling();
```

### WebSocket Upgrade (Optional)
For true real-time updates, you can implement WebSocket:
1. Add WebSocket server (ws or socket.io)
2. Replace polling with WebSocket events
3. Update service layer to emit events

## 📦 Data Migration Verification

After migration, verify these data points:

### Products Table
```sql
SELECT COUNT(*) FROM products;
SELECT name, category, price FROM products LIMIT 5;
```

### Users Table  
```sql
SELECT COUNT(*) FROM users;
SELECT email, role FROM users WHERE role = 'admin';
```

### Categories Table
```sql
SELECT * FROM categories;
```

### Favorites Table
```sql
SELECT COUNT(*) FROM user_favorites;
```

## 🚀 Production Deployment

### Environment Variables
```env
# Production settings
NODE_ENV=production
VITE_ENVIRONMENT=production
VITE_JWT_SECRET=super-secure-production-secret

# MySQL (Production Database)
VITE_MYSQL_HOST=your-production-host
VITE_MYSQL_PORT=3306
VITE_MYSQL_USER=production_user
VITE_MYSQL_PASSWORD=production_password
VITE_MYSQL_DATABASE=demiland_beauty

# Optional: Keep ImageKit for images
VITE_IMAGEKIT_URL=your-imagekit-url
VITE_IMAGEKIT_PUBLIC_KEY=your-imagekit-key
```

### Database Security
1. Create dedicated database user with limited permissions
2. Use connection pooling
3. Enable SSL connections
4. Regular backups
5. Monitor connection limits

### Performance Optimization
1. **Indexes**: Already included in migration schema
2. **Connection Pooling**: Configured in mysql.js
3. **Query Optimization**: Use EXPLAIN for slow queries
4. **Caching**: Consider Redis for session storage

## 📊 Migration Comparison

| Feature | Supabase | MySQL Migration |
|---------|----------|-----------------|
| Database | PostgreSQL | MySQL 8.0+ |
| Authentication | Supabase Auth | JWT + bcrypt |
| Real-time | Native WebSocket | Polling + Events |
| File Storage | Supabase Storage | Keep ImageKit |
| Admin Panel | Row Level Security | Role-based checks |
| Scaling | Managed | Self-managed |

## 🎯 Next Steps After Migration

1. **Test all functionality** thoroughly
2. **Monitor performance** and optimize as needed
3. **Set up backups** for your MySQL database
4. **Consider Redis** for session caching
5. **Implement WebSocket** for true real-time features
6. **Monitor logs** for any issues

## 🆘 Rollback Plan

If you need to rollback to Supabase:
1. Keep your Supabase project active during migration
2. Your exported data is in `supabase-exports/`
3. Original service files are preserved
4. Update imports back to Supabase services
5. Restore `.env.local` with Supabase credentials

## 📞 Support

If you encounter issues:
1. Check MySQL error logs
2. Verify environment variables
3. Test database connection
4. Check application logs
5. Validate data integrity

The migration preserves all your data and functionality while giving you full control over your database infrastructure.