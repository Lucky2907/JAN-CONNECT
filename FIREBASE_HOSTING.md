# 🚀 Firebase Hosting Deployment Guide

## Quick Start - Deploy Your App in 5 Minutes!

### Prerequisites
- ✅ Node.js installed
- ✅ Firebase project created (https://console.firebase.google.com)
- ✅ Firebase CLI installed

---

## Step-by-Step Deployment

### 1️⃣ Install Firebase CLI (One-time)

```bash
npm install -g firebase-tools
```

### 2️⃣ Login to Firebase

```bash
firebase login
```

This will open a browser window. Sign in with your Google account.

### 3️⃣ Link Your Project

**Option A: If you have the project ID**
```bash
# Edit .firebaserc and replace "your-project-id" with your actual Firebase project ID
```

**Option B: Initialize Firebase**
```bash
firebase use --add
# Select your project from the list
# Give it an alias (e.g., "default")
```

### 4️⃣ Build Your App

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### 5️⃣ Deploy to Firebase!

```bash
# Deploy everything (hosting + firestore rules)
npm run deploy

# OR deploy only hosting
npm run deploy:hosting
```

### 6️⃣ View Your Live Site! 🎉

```bash
firebase open hosting:site
```

Your app is now live at: `https://YOUR-PROJECT-ID.web.app` or `https://YOUR-PROJECT-ID.firebaseapp.com`

---

## 🔄 Updating Your Deployed App

Whenever you make changes:

```bash
# 1. Build the latest changes
npm run build

# 2. Deploy
npm run deploy:hosting
```

---

## 🌐 Custom Domain Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Hosting** section
4. Click **"Add custom domain"**
5. Enter your domain (e.g., `www.mysmartcity.com`)
6. Follow the DNS configuration steps Firebase provides
7. Wait for SSL certificate provisioning (can take up to 24 hours)

---

## 📊 Viewing Analytics & Logs

### View Deployment History
```bash
firebase hosting:channel:list
```

### View Live Logs
```bash
firebase hosting:channel:open <channel-id>
```

### Firebase Console
Visit: https://console.firebase.google.com
- Go to **Hosting** to see:
  - Deployment history
  - Usage statistics
  - Custom domains
  - Hosting settings

---

## 🐛 Troubleshooting

### Build Fails
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Firebase CLI Issues
```bash
# Update Firebase CLI
npm install -g firebase-tools@latest

# Re-login
firebase logout
firebase login
```

### 404 Errors on Refresh
The `firebase.json` is already configured with rewrites for single-page apps. If you still get 404s:

```bash
# Re-deploy
npm run deploy:hosting
```

### Deployment Timeout
```bash
# Deploy with debug mode
firebase deploy --only hosting --debug
```

---

## ⚡ Pro Tips

### 1. Preview Before Deploy
```bash
firebase hosting:channel:deploy preview
```

### 2. Rollback to Previous Version
1. Go to Firebase Console > Hosting
2. Click on **Release history**
3. Find the previous deployment
4. Click options menu > **Rollback**

### 3. Set Up CI/CD with GitHub Actions

Create `.github/workflows/firebase-deploy.yml`:

```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches:
      - main

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Install Dependencies
        run: npm install
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: your-project-id
```

### 4. Environment Variables

Create `.env.production`:
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_PROJECT_ID=your-project-id
```

These are automatically included in the build.

---

## 📝 Configuration Files

### firebase.json
```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### .firebaserc
```json
{
  "projects": {
    "default": "your-project-id"
  }
}
```

---

## 🎯 Deployment Checklist

Before deploying to production:

- [ ] Update `.firebaserc` with your actual project ID
- [ ] Set production environment variables
- [ ] Test build locally: `npm run build && npm run preview`
- [ ] Remove console.logs
- [ ] Enable Firestore security rules
- [ ] Set up custom domain (optional)
- [ ] Enable caching headers (already configured)
- [ ] Test on mobile devices
- [ ] Run Lighthouse audit
- [ ] Set up monitoring/analytics

---

## 🆘 Need Help?

- **Firebase Documentation**: https://firebase.google.com/docs/hosting
- **Firebase CLI Reference**: https://firebase.google.com/docs/cli
- **Stack Overflow**: https://stackoverflow.com/questions/tagged/firebase-hosting
- **Firebase Support**: https://firebase.google.com/support

---

**Your app is ready to go live! 🚀**
