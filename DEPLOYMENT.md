# 🚀 Demiland Deployment Guide

## Quick Setup Overview

This guide will help you deploy your Demiland beauty brand project using the three-tier architecture:
- **Production** (main branch) → `demiland.onrender.com`
- **Staging** (dev branch) → `demiland-dev.onrender.com`  
- **Local Development** → `localhost:5173`

## 📋 Prerequisites

- [x] GitHub repository: https://github.com/KEYAJANI/demiland.git
- [x] Render account with API key: `rnd_U80z3JSon20YKJlshbJ3SVhqzTDJ`
- [x] Supabase project credentials
- [ ] GitHub branches pushed (manual step required)

## 🔧 Step 1: Push Code to GitHub

Since Git credentials aren't configured in the current environment, you'll need to push manually:

```bash
# Navigate to your project directory
cd /mnt/c/Users/Karrar/Desktop/Beauty_Brand_Wireframes

# Switch to main branch and push
git checkout main
git push -u origin main

# Push dev branch
git checkout dev  
git push -u origin dev
```

## 🌐 Step 2: Create Render Services

### Production Site (Main Branch)

1. **Go to Render Dashboard**: https://dashboard.render.com/
2. **Create New Static Site**:
   - **Name**: `demiland-production`
   - **Repository**: `https://github.com/KEYAJANI/demiland.git`
   - **Branch**: `main`
   - **Build Command**: `npm ci && npm run build:prod`
   - **Publish Directory**: `dist`
   - **Auto-Deploy**: `Yes`

3. **Environment Variables** (Add in Render dashboard):
   ```
   NODE_ENV=production
   VITE_ENVIRONMENT=production
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   VITE_APP_NAME=DEMILAND
   VITE_APP_VERSION=1.0.0
   ```

### Staging Site (Dev Branch)

1. **Create Second Static Site**:
   - **Name**: `demiland-staging`
   - **Repository**: `https://github.com/KEYAJANI/demiland.git`
   - **Branch**: `dev`
   - **Build Command**: `npm ci && npm run build:staging`
   - **Publish Directory**: `dist`
   - **Auto-Deploy**: `Yes`

2. **Environment Variables**:
   ```
   NODE_ENV=staging
   VITE_ENVIRONMENT=staging
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   VITE_APP_NAME=DEMILAND-DEV
   VITE_APP_VERSION=1.0.0-dev
   VITE_DEBUG_MODE=true
   ```

## 🔐 Step 3: Configure Environment Variables

### Local Development
1. Copy environment template:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your Supabase credentials in `.env.local`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

### Production & Staging
- Set environment variables in Render dashboard for each service
- Use different Supabase projects for production and staging (recommended)
- Never commit actual credentials to Git

## 🎯 Step 4: Verify Deployment

### Check Build Status
1. Monitor build logs in Render dashboard
2. Verify both sites deploy successfully
3. Test functionality on both environments

### Expected URLs
- **Production**: `https://demiland-production.onrender.com`
- **Staging**: `https://demiland-staging.onrender.com`
- **Local**: `http://localhost:5173`

## 🔄 Development Workflow

### For Feature Development
1. Create feature branch from `dev`
2. Make changes locally
3. Test with `npm run dev`
4. Push to feature branch
5. Create PR to `dev` branch
6. Test on staging environment
7. Merge to `dev` for staging deployment

### For Production Releases
1. Test thoroughly on staging
2. Create PR from `dev` to `main`
3. Review and merge to `main`
4. Production automatically deploys

## 🛠️ Available Commands

### Local Development
```bash
npm run dev              # Start development server
npm run build           # Build for production
npm run preview         # Preview production build
npm run lint            # Check code quality
npm run type-check      # TypeScript checking
```

### Deployment
```bash
npm run build:prod      # Production build
npm run build:staging   # Staging build
npm run test:build      # Test build locally
npm run clean           # Clean build artifacts
```

## 🔧 Troubleshooting

### Build Failures
- Check Render build logs
- Verify all environment variables are set
- Ensure dependencies are in `package.json`
- Check for TypeScript/ESLint errors

### Environment Issues
- Verify Supabase credentials are correct
- Check environment variable names (case-sensitive)
- Ensure `.env.local` is not committed to Git

### Performance Issues
- Monitor build times in Render
- Check chunk sizes in build output
- Verify asset optimization is working

## 🔗 Important Links

- **GitHub Repository**: https://github.com/KEYAJANI/demiland.git
- **Render Dashboard**: https://dashboard.render.com/
- **Supabase Dashboard**: https://supabase.com/dashboard
- **Project Documentation**: See `CLAUDE.md` for technical details

## 📞 Support

For deployment issues:
1. Check Render build logs first
2. Verify environment variables
3. Test build locally with `npm run test:build`
4. Review this documentation for common solutions

---

**🎉 Congratulations!** Your Demiland beauty brand is now ready for professional deployment with automatic CI/CD pipeline.