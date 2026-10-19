import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Get config from environment or localStorage
export const getFirebaseConfig = () => {
  const customConfig = localStorage.getItem('sikas_firebase_config');
  if (customConfig) {
    try {
      return JSON.parse(customConfig);
    } catch (e) {
      console.error("Invalid custom Firebase config in localStorage", e);
    }
  }

  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyKeyForDevelopment123456789",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "sikas-siswa-demo.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "sikas-siswa-demo",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "sikas-siswa-demo.appspot.com",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789012:web:abcdef1234567890"
  };
};

let app = null;
let auth = null;
let db = null;
let storage = null;
let isFirebaseConfigured = false;

try {
  const config = getFirebaseConfig();
  // Check if real config or default placeholder
  if (config.apiKey && !config.apiKey.includes('DummyKey')) {
    app = !getApps().length ? initializeApp(config) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    isFirebaseConfigured = true;
  }
} catch (error) {
  console.warn("Firebase not yet configured with production keys, using local store engine:", error.message);
}

export { app, auth, db, storage, isFirebaseConfigured };
