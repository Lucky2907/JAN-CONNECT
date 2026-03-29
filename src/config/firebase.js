import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-f0zr-cwIxlDiRniwymf1DXpiza3n7kA",
  authDomain: "vega-caf5c.firebaseapp.com",
  projectId: "vega-caf5c",
  storageBucket: "vega-caf5c.firebasestorage.app",
  messagingSenderId: "353719267367",
  appId: "1:353719267367:web:78882bab1347f7e3f85e02",
  measurementId: "G-C0CD8J2E9G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Authentication
export const auth = getAuth(app);

export const ensureFirebaseAuth = async () => {
  if (auth.currentUser) {
    return auth.currentUser;
  }

  const result = await signInAnonymously(auth);
  return result.user;
};

export default app;
