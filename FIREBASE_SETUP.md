# Firebase Firestore Real-Time Integration Guide

## 🔥 Firebase Setup Complete!

Your application now has Firebase Firestore real-time listeners integrated! Follow the steps below to start using it.

---

## 📋 What's Been Added

### 1. **Firebase Configuration** (`src/config/firebase.js`)
- Initializes Firebase app
- Sets up Firestore database
- Sets up Firebase Authentication

### 2. **Firestore Service Layer** (`src/utils/firestoreService.js`)
- Complete CRUD operations for complaints
- Real-time listeners for automatic updates
- User management functions
- Timestamp conversion utilities

### 3. **Updated AppContext** (`src/context/AppContext.jsx`)
- Real-time Firestore listeners integrated
- Automatic state updates when data changes
- Toggle between mock data and Firestore
- Loading states for better UX

---

## 🚀 Getting Started

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project" or select an existing project
3. Follow the setup wizard
4. Enable Google Analytics (optional)

### Step 2: Set Up Firestore Database

1. In Firebase Console, go to **Build > Firestore Database**
2. Click "Create Database"
3. Choose a location (preferably close to your users)
4. Start in **Test Mode** (for development) or **Production Mode** (for security)

#### Test Mode Rules (Development):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

#### Production Mode Rules (Recommended):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Complaints collection
    match /complaints/{complaintId} {
      allow read: if true; // Public can read
      allow create: if request.auth != null; // Authenticated users can create
      allow update, delete: if request.auth != null && 
        (request.auth.token.role == 'admin' || 
         request.auth.token.role == 'official');
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Step 3: Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll to "Your apps" section
3. Click the **Web icon** (</>)
4. Register your app (name it "Smart City Portal")
5. Copy the `firebaseConfig` object

### Step 4: Configure Your Application

#### Option A: Using Environment Variables (Recommended)

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Firebase credentials in `.env`:
   ```env
   VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:xxxxx
   ```

3. Update `src/config/firebase.js` to use environment variables:
   ```javascript
   const firebaseConfig = {
     apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
     authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
     projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
     storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
     messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
     appId: import.meta.env.VITE_FIREBASE_APP_ID
   };
   ```

#### Option B: Direct Configuration

1. Open `src/config/firebase.js`
2. Replace the placeholder values with your actual Firebase config:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:xxxxx"
   };
   ```

### Step 5: Enable Firestore Mode

1. Open `src/context/AppContext.jsx`
2. Change `USE_FIRESTORE` to `true`:
   ```javascript
   const USE_FIRESTORE = true;
   ```

---

## 🎯 Features & Usage

### Real-Time Updates

When Firestore is enabled, your app will automatically:
- ✅ Sync data across all connected clients instantly
- ✅ Update UI when data changes (no refresh needed)
- ✅ Handle offline mode with local cache
- ✅ Resolve conflicts automatically

### Available Functions

#### In Components (via `useApp()` hook):
```javascript
import { useApp } from '../context/AppContext';

function MyComponent() {
  const { 
    complaints,      // All complaints (real-time)
    loading,         // Loading state
    useFirestore,    // Is Firestore enabled?
    addComplaint,    // Add new complaint
    updateComplaintStatus // Update complaint
  } = useApp();
  
  // Use them as before - now they're real-time!
}
```

#### Direct Firestore Service (in `src/utils/firestoreService.js`):
```javascript
import { 
  subscribeToComplaints,        // Listen to all complaints
  subscribeToUserComplaints,    // Listen to user's complaints
  subscribeToComplaint,         // Listen to single complaint
  addComplaint,                 // Add complaint
  updateComplaintStatus,        // Update status
  deleteComplaint,              // Delete complaint
  getComplaintById,             // Get single complaint
  getAllComplaints,             // Get all complaints (one-time)
  getComplaintsByCitizen,       // Get user's complaints
  getComplaintsByStatus         // Filter by status
} from '../utils/firestoreService';
```

### Example: Using Real-Time Listeners

```javascript
import { useEffect, useState } from 'react';
import { subscribeToComplaints } from '../utils/firestoreService';

function Dashboard() {
  const [complaints, setComplaints] = useState([]);
  
  useEffect(() => {
    // Subscribe to real-time updates
    const unsubscribe = subscribeToComplaints((updatedComplaints) => {
      setComplaints(updatedComplaints);
      console.log('Data updated in real-time!');
    });
    
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);
  
  return (
    <div>
      <h1>Real-Time Complaints: {complaints.length}</h1>
      {/* complaints auto-update when database changes */}
    </div>
  );
}
```

---

## 🔒 Security Best Practices

### 1. Firestore Security Rules

Always use proper security rules in production:
- Validate data types and required fields
- Check user authentication
- Implement role-based access control
- Prevent unauthorized modifications

### 2. Environment Variables

- **Never commit `.env` to git** (already in `.gitignore`)
- Use different Firebase projects for dev/staging/production
- Rotate API keys if exposed
- Use Firebase App Check for production

### 3. Data Validation

Add validation in your Firestore rules:
```javascript
match /complaints/{complaintId} {
  allow create: if request.auth != null 
    && request.resource.data.title is string
    && request.resource.data.description is string
    && request.resource.data.category in ['road', 'garbage', 'lighting', 'drainage']
    && request.resource.data.severity in ['low', 'medium', 'high'];
}
```

---

## 🧪 Testing

### Development Mode (Mock Data)
```javascript
// In AppContext.jsx
const USE_FIRESTORE = false;
```
- Uses local mock data
- No Firebase connection needed
- Great for development/testing
- No internet required

### Production Mode (Firestore)
```javascript
// In AppContext.jsx
const USE_FIRESTORE = true;
```
- Connects to Firebase
- Real-time synchronization
- Persistent data storage
- Multi-client sync

---

## 📊 Firestore Data Structure

### Complaints Collection
```
complaints/
  └── {complaintId}/
      ├── title: string
      ├── description: string
      ├── category: string
      ├── severity: string
      ├── status: string
      ├── latitude: number
      ├── longitude: number
      ├── citizenName: string
      ├── citizenId: string
      ├── assignedDepartment: string
      ├── createdAt: timestamp
      ├── resolvedAt: timestamp | null
      ├── duplicateCount: number
      └── isEscalated: boolean
```

### Users Collection
```
users/
  └── {userId}/
      ├── name: string
      ├── email: string
      ├── role: string
      ├── citizenId: string
      └── createdAt: timestamp
```

---

## 🐛 Troubleshooting

### Firebase Not Initializing
- Check if Firebase config is correct
- Verify API key is valid
- Ensure Firestore is enabled in Firebase Console
- Check browser console for errors

### Data Not Syncing
- Verify Firestore rules allow read/write
- Check internet connection
- Open browser DevTools > Network tab
- Look for failed Firestore requests

### Performance Issues
- Use pagination for large datasets
- Implement proper indexes (Firebase will suggest)
- Limit real-time listeners
- Use `getDocs()` for one-time reads instead of `onSnapshot()`

### Permission Denied Errors
- Check Firestore security rules
- Verify user authentication status
- Ensure user has proper role/permissions
- Test rules in Firebase Console

---

## 🚦 Migration from Mock Data

### Step 1: Seed Initial Data
```javascript
// Run once to populate Firestore with mock data
import { mockComplaints } from './data/mockData';
import { addComplaint } from './utils/firestoreService';

async function seedData() {
  for (const complaint of mockComplaints) {
    await addComplaint(complaint);
  }
  console.log('Data seeded successfully!');
}

// Call this once, then remove
seedData();
```

### Step 2: Enable Firestore
Change `USE_FIRESTORE` to `true` in `AppContext.jsx`

### Step 3: Test All Features
- Create new complaints
- Update complaint statuses
- View dashboards
- Check real-time sync

---

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Data Modeling](https://firebase.google.com/docs/firestore/data-model)
- [Security Rules Guide](https://firebase.google.com/docs/firestore/security/get-started)
- [Realtime Listeners](https://firebase.google.com/docs/firestore/query-data/listen)
- [Firebase Best Practices](https://firebase.google.com/docs/firestore/best-practices)

---

## 💡 Next Steps

1. ✅ Set up Firebase project
2. ✅ Configure application
3. ✅ Enable Firestore mode
4. 🔄 Test real-time sync
5. 🔒 Implement security rules
6. 🚀 Deploy to production

---

## ⚡ Quick Commands

```bash
# Development with mock data
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

**Need Help?** Check the Firebase Console for logs and diagnostics!

Happy coding! 🎉
