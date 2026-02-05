// Firebase Configuration
// IMPORTANT: Replace these values with YOUR actual Firebase config
// Get these from: Firebase Console → Project Settings → Your apps → Web app

const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Check if Firebase is configured
const isFirebaseConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY_HERE";

if (isFirebaseConfigured) {
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  // Get Firebase services
  window.auth = firebase.auth();
  window.db = firebase.firestore();

  console.log('🔥 Firebase initialized successfully!');
} else {
  console.warn('⚠️ Firebase not configured yet. App will use localStorage only.');
  console.warn('📖 See FIREBASE_SETUP_COMPLETE.md for setup instructions.');
  
  // Set auth and db to undefined so app knows Firebase isn't available
  window.auth = undefined;
  window.db = undefined;
}
