# 🚀 Deployment Guide

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

## Deployment Options

### 1. Firebase Hosting (Recommended for Firebase Projects)

**One-time setup:**
```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project (if not already done)
firebase init

# Select:
# - Hosting: Configure files for Firebase Hosting
# - Firestore: Deploy rules and create indexes
# Choose "Use an existing project" and select your Firebase project
# Set public directory to: dist
# Configure as single-page app: Yes
# Set up automatic builds with GitHub: No (optional)
```

**Update .firebaserc with your project ID:**
```json
{
  "projects": {
    "default": "your-actual-project-id"
  }
}
```

**Deploy commands:**
```bash
# Build and deploy everything (hosting + firestore rules)
npm run deploy

# Deploy only hosting
npm run deploy:hosting

# Deploy only firestore rules
npm run deploy:firestore

# Or use Firebase CLI directly
firebase deploy
```

**View your deployed site:**
```bash
firebase open hosting:site
```

Your site will be live at: `https://your-project-id.web.app`

**Custom domain setup:**
1. Go to Firebase Console > Hosting
2. Click "Add custom domain"
3. Follow DNS configuration steps

### 2. Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

**Or use Vercel Dashboard**:
1. Go to vercel.com
2. Import your GitHub repository
3. Deploy automatically

### 3. Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

**Or use Netlify Dashboard**:
1. Drag and drop `dist/` folder
2. Or connect GitHub repository

### 4. GitHub Pages

Add to `vite.config.js`:
```javascript
export default defineConfig({
  plugins: [react()],
  base: '/your-repo-name/',
  server: {
    port: 3000
  }
})
```

```bash
npm run build
npx gh-pages -d dist
```

### 5. Docker

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

Build and run:
```bash
docker build -t smart-city-portal .
docker run -p 3000:3000 smart-city-portal
```

## Environment Variables

Create `.env` file:
```env
VITE_API_URL=https://your-api.com
VITE_MAP_TOKEN=your-mapbox-token
```

## Production Checklist

- [ ] Remove console.logs
- [ ] Enable analytics
- [ ] Add error boundary
- [ ] Implement real authentication
- [ ] Add loading states
- [ ] Optimize images
- [ ] Enable PWA features
- [ ] Add helmet for SEO
- [ ] Setup monitoring (Sentry)
- [ ] Configure CORS
- [ ] Add rate limiting
- [ ] Enable HTTPS

## Performance Optimization

### Code Splitting
```javascript
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
```

### Image Optimization
- Use WebP format
- Lazy load images
- Implement CDN

### Bundle Size
```bash
npm run build -- --mode production
npm run analyze
```

## Security

- Implement real JWT authentication
- Add CSRF protection
- Sanitize user inputs
- Use HTTPS only
- Implement rate limiting
- Add security headers

## Monitoring

### Setup Sentry
```bash
npm install @sentry/react
```

### Google Analytics
```javascript
// Add to index.html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
```

---

**Ready to impress at the hackathon! 🏆**
