# 🚀 Firebase Deployment - Quick Commands

## First Time Setup

```bash
# 1. Install Firebase CLI
npm install -g firebase-tools

# 2. Login
firebase login

# 3. Update your project ID in .firebaserc
# Replace "your-project-id" with your actual Firebase project ID from console.firebase.google.com
```

---

## Deploy Commands

```bash
# Build the app
npm run build

# Deploy everything (hosting + firestore)
npm run deploy

# Deploy only hosting
npm run deploy:hosting

# Deploy only firestore rules
npm run deploy:firestore
```

---

## Quick Deploy (Most Common)

```bash
npm run build && firebase deploy --only hosting
```

Or simply:
```bash
npm run deploy:hosting
```

---

## View Your Site

```bash
firebase open hosting:site
```

Your site will be at: `https://YOUR-PROJECT-ID.web.app`

---

## Check Status

```bash
# List hosting sites
firebase hosting:sites:list

# View deployment history
firebase hosting:channel:list
```

---

## 🔧 Before First Deploy

1. ✅ Update `.firebaserc`:
   ```json
   {
     "projects": {
       "default": "your-actual-project-id"
     }
   }
   ```

2. ✅ Make sure Firebase project exists at: https://console.firebase.google.com

3. ✅ Test build locally:
   ```bash
   npm run build
   npm run preview
   ```

4. ✅ Deploy!
   ```bash
   npm run deploy:hosting
   ```

---

**See FIREBASE_HOSTING.md for detailed guide!**
