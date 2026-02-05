// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDePb8G4fh2fgXI9_UDnT-y1nm2ePvGU0o",
  authDomain: "focusly-da00f.firebaseapp.com",
  projectId: "focusly-da00f",
  storageBucket: "focusly-da00f.firebasestorage.app",
  messagingSenderId: "552503567149",
  appId: "1:552503567149:web:29da8b78d7ef40680929a4",
  measurementId: "G-RBw5L288PQ"
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
