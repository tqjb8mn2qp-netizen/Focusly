# 🚀 Firebase Setup - Complete Step-by-Step Guide

Follow this guide EXACTLY to add real user accounts to your Study Buddy app.

---

## ✅ What You'll Achieve

After following this guide:
- ✅ Real user accounts (not local storage)
- ✅ Users can sign up and sign in
- ✅ Data syncs across devices
- ✅ Never lose user data
- ✅ Professional authentication system

**Time needed: 1-2 hours**

---

## 📋 PHASE 1: Create Firebase Account & Project (15 minutes)

### Step 1.1: Create Google Account (if you don't have one)
1. Go to https://accounts.google.com
2. Click "Create account"
3. Fill in your details
4. Verify your email
5. ✅ Done!

### Step 1.2: Go to Firebase Console
1. Open your browser
2. Go to: **https://console.firebase.google.com**
3. You'll see the Firebase welcome page
4. Click **"Get started"** or **"Go to console"**

### Step 1.3: Create a New Project
1. Click **"Add project"** (big plus button or card)
2. Enter project name: **`study-buddy`** or **`focusly`**
3. Click **"Continue"**
4. Disable Google Analytics (toggle OFF) - you don't need it now
5. Click **"Create project"**
6. Wait 30 seconds while Firebase sets up
7. Click **"Continue"** when ready
8. ✅ You now have a Firebase project!

---

## 📋 PHASE 2: Enable Authentication (10 minutes)

### Step 2.1: Navigate to Authentication
1. You should see your Firebase project dashboard
2. On the left sidebar, find **"Build"** section
3. Click **"Authentication"**
4. Click **"Get started"** button

### Step 2.2: Enable Email/Password Sign-In
1. You'll see "Sign-in method" tab (should be selected)
2. Click on **"Email/Password"** row
3. Toggle the first switch to **"Enable"**
4. Leave "Email link" disabled
5. Click **"Save"**
6. ✅ Email authentication is now enabled!

### Step 2.3: (Optional) Enable Google Sign-In
1. Still in "Sign-in method" tab
2. Click on **"Google"** row
3. Toggle to **"Enable"**
4. Select your support email from dropdown
5. Click **"Save"**
6. ✅ Google authentication enabled!

---

## 📋 PHASE 3: Create Firestore Database (10 minutes)

### Step 3.1: Navigate to Firestore
1. On the left sidebar, find **"Build"** section
2. Click **"Firestore Database"**
3. Click **"Create database"** button

### Step 3.2: Choose Security Rules
1. Select **"Start in production mode"** (more secure)
2. Click **"Next"**

### Step 3.3: Choose Location
1. Select a location closest to your users:
   - **US:** `us-central1` or `us-east1`
   - **Europe:** `europe-west1`
   - **Asia:** `asia-southeast1`
2. Click **"Enable"**
3. Wait 1-2 minutes for database creation
4. ✅ Firestore database is ready!

### Step 3.4: Set Security Rules
1. Click **"Rules"** tab at the top
2. You'll see the rules editor
3. Replace ALL the text with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /userData/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

4. Click **"Publish"**
5. ✅ Security rules set!

---

## 📋 PHASE 4: Get Firebase Configuration (5 minutes)

### Step 4.1: Register Your Web App
1. Go back to Firebase project home (click project name at top)
2. In the center, you'll see **"Get started by adding Firebase to your app"**
3. Click the **Web icon** (`</>` symbol)
4. Enter app nickname: **`Study Buddy Web`**
5. Check the box **"Also set up Firebase Hosting"** (optional but recommended)
6. Click **"Register app"**

### Step 4.2: Copy Firebase Config
1. You'll see code like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "study-buddy-xxxxx.firebaseapp.com",
  projectId: "study-buddy-xxxxx",
  storageBucket: "study-buddy-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:xxxxxxxxxxxx"
};
```

2. **COPY THIS ENTIRE CONFIG** - you'll need it soon
3. Save it in a text file temporarily
4. Click **"Continue to console"**
5. ✅ Config saved!

---

## 📋 PHASE 5: Update Your App Code (30 minutes)

### Step 5.1: Create Firebase Config File

1. Open your project folder in VS Code or text editor
2. In `/home/user/webapp/` create a new file called **`firebase-config.js`**
3. Paste this code (replace with YOUR config from Step 4.2):

```javascript
// Firebase Configuration
// Replace these values with YOUR Firebase config from the console

const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get Firebase services
const auth = firebase.auth();
const db = firebase.firestore();

console.log('🔥 Firebase initialized successfully!');
```

4. **Replace** all the `YOUR_XXX` values with your actual Firebase config
5. Save the file
6. ✅ Config file created!

### Step 5.2: Update index.html

1. Open **`index.html`**
2. Find the closing `</body>` tag (near the end of the file)
3. **BEFORE** the `</body>` tag, add these Firebase SDK scripts:

```html
    <!-- Firebase SDK v9 (compat mode for easier integration) -->
    <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js"></script>
    
    <!-- Firebase Configuration -->
    <script src="firebase-config.js"></script>
    
    <!-- Authentication & App Scripts -->
    <script src="auth.js"></script>
    <script src="auth-ui.js"></script>
    <script src="app.js"></script>
```

**Important:** Make sure Firebase scripts load BEFORE your app scripts!

The order should be:
1. Firebase SDK scripts
2. firebase-config.js
3. auth.js
4. auth-ui.js
5. app.js

4. Save the file
5. ✅ HTML updated!

### Step 5.3: Create New Auth File with Firebase

1. Create a new file called **`auth-firebase.js`**
2. Copy this complete code:

```javascript
// Firebase Authentication Manager
// Real authentication using Firebase

class AuthManager {
    constructor() {
        this.user = null;
        this.unsubscribe = null;
        this.init();
    }

    init() {
        // Listen for auth state changes
        this.unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                this.user = {
                    id: user.uid,
                    email: user.email,
                    name: user.displayName || 'User',
                    emailVerified: user.emailVerified
                };
                console.log('[Auth] User signed in:', this.user.email);
            } else {
                this.user = null;
                console.log('[Auth] User signed out');
            }
        });
    }

    // ============================================
    // EMAIL/PASSWORD AUTHENTICATION
    // ============================================

    async signUpWithEmail(email, password, name) {
        try {
            // Create user account in Firebase
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            
            // Update profile name
            await userCredential.user.updateProfile({
                displayName: name
            });
            
            // Save user profile to Firestore
            await db.collection('users').doc(userCredential.user.uid).set({
                name: name,
                email: email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                gradeLevel: '11th Grade',
                dailyGoalMinutes: 120
            });
            
            console.log('[Auth] Sign-up successful:', email);
            
            return { 
                success: true, 
                user: {
                    id: userCredential.user.uid,
                    email: email,
                    name: name
                }
            };
        } catch (error) {
            console.error('[Auth] Sign-up failed:', error);
            return { success: false, error: this.getErrorMessage(error.code) };
        }
    }

    async signInWithEmail(email, password) {
        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            
            console.log('[Auth] Sign-in successful:', email);
            
            return { 
                success: true, 
                user: {
                    id: userCredential.user.uid,
                    email: userCredential.user.email,
                    name: userCredential.user.displayName
                }
            };
        } catch (error) {
            console.error('[Auth] Sign-in failed:', error);
            return { success: false, error: this.getErrorMessage(error.code) };
        }
    }

    // ============================================
    // GOOGLE OAUTH
    // ============================================

    async signInWithGoogle() {
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            const result = await auth.signInWithPopup(provider);
            
            // Check if user profile exists, if not create it
            const userDoc = await db.collection('users').doc(result.user.uid).get();
            if (!userDoc.exists) {
                await db.collection('users').doc(result.user.uid).set({
                    name: result.user.displayName,
                    email: result.user.email,
                    picture: result.user.photoURL,
                    provider: 'google',
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    gradeLevel: '11th Grade',
                    dailyGoalMinutes: 120
                });
            }
            
            console.log('[Auth] Google sign-in successful:', result.user.email);
            
            return { 
                success: true, 
                user: {
                    id: result.user.uid,
                    email: result.user.email,
                    name: result.user.displayName,
                    picture: result.user.photoURL
                }
            };
        } catch (error) {
            console.error('[Auth] Google sign-in failed:', error);
            return { success: false, error: this.getErrorMessage(error.code) };
        }
    }

    // ============================================
    // USER MANAGEMENT
    // ============================================

    isAuthenticated() {
        return auth.currentUser !== null;
    }

    getUser() {
        return this.user;
    }

    async logout() {
        try {
            await auth.signOut();
            this.user = null;
            console.log('[Auth] Logged out successfully');
        } catch (error) {
            console.error('[Auth] Logout failed:', error);
        }
    }

    // ============================================
    // PASSWORD RESET
    // ============================================

    async requestPasswordReset(email) {
        try {
            await auth.sendPasswordResetEmail(email);
            console.log('[Auth] Password reset email sent to:', email);
            return { success: true, message: 'Password reset link sent to your email' };
        } catch (error) {
            console.error('[Auth] Password reset failed:', error);
            return { success: false, error: this.getErrorMessage(error.code) };
        }
    }

    // ============================================
    // HELPER METHODS
    // ============================================

    getErrorMessage(errorCode) {
        const errorMessages = {
            'auth/email-already-in-use': 'Email already registered',
            'auth/invalid-email': 'Invalid email address',
            'auth/operation-not-allowed': 'Operation not allowed',
            'auth/weak-password': 'Password should be at least 6 characters',
            'auth/user-disabled': 'This account has been disabled',
            'auth/user-not-found': 'Invalid email or password',
            'auth/wrong-password': 'Invalid email or password',
            'auth/popup-closed-by-user': 'Sign-in popup was closed',
            'auth/network-request-failed': 'Network error. Check your connection'
        };
        
        return errorMessages[errorCode] || 'An error occurred. Please try again.';
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
}
```

3. Save the file
4. ✅ Firebase auth file created!

### Step 5.4: Update DataManager for Cloud Sync

1. Open **`app.js`**
2. Find the `save()` method in the `DataManager` class (around line 66)
3. Replace the `save()` method with this:

```javascript
async save() {
    // Save locally for offline support
    localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    
    // Save to Firestore if user is authenticated
    if (auth.currentUser) {
        try {
            await db.collection('userData').doc(auth.currentUser.uid).set({
                data: this.data,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log('[Data] Synced to cloud');
        } catch (error) {
            console.error('[Data] Cloud sync failed:', error);
            // Local save still works even if cloud sync fails
        }
    }
}
```

4. Find the `initializeData()` method (around line 15)
5. Replace it with this:

```javascript
async initializeData() {
    // Try to load from Firestore first if user is authenticated
    if (auth.currentUser) {
        try {
            const doc = await db.collection('userData').doc(auth.currentUser.uid).get();
            if (doc.exists) {
                this.data = doc.data().data;
                // Also save to localStorage for offline access
                localStorage.setItem(this.storageKey, JSON.stringify(this.data));
                console.log('[Data] Loaded from cloud');
                return;
            }
        } catch (error) {
            console.error('[Data] Failed to load from cloud:', error);
        }
    }
    
    // Fall back to localStorage
    const stored = localStorage.getItem(this.storageKey);
    if (!stored) {
        // First-time setup with demo data
        this.data = this.getDefaultData();
        this.save();
    } else {
        this.data = JSON.parse(stored);
    }
}
```

6. Save the file
7. ✅ Data sync enabled!

### Step 5.5: Update index.html to Use Firebase Auth

1. Open **`index.html`**
2. Find where you load `auth.js`:

```html
<script src="auth.js"></script>
```

3. Replace it with:

```html
<script src="auth-firebase.js"></script>
```

4. Save the file
5. ✅ Ready to use Firebase auth!

---

## 📋 PHASE 6: Test Your Setup (10 minutes)

### Step 6.1: Open Your App

1. Make sure your HTTP server is running
2. Open: **https://8000-immk5r2z04fqu7byp66c2-0e616f0a.sandbox.novita.ai**
3. Open browser console (F12 or right-click → Inspect → Console)

### Step 6.2: Check Console Messages

You should see:
```
🔥 Firebase initialized successfully!
[Auth] User signed out
```

If you see errors, check:
- Firebase config values are correct
- Firebase SDK scripts loaded
- No typos in code

### Step 6.3: Test Sign Up

1. Click **"Sign up"** (or switch to sign up view)
2. Enter:
   - Name: Your name
   - Email: your.test@email.com
   - Password: test123456
3. Click **"Create Account"**
4. Wait 2-3 seconds
5. You should be signed in!

### Step 6.4: Verify in Firebase Console

1. Go back to Firebase Console
2. Click **"Authentication"** in sidebar
3. Click **"Users"** tab
4. You should see your test user!
5. ✅ Sign up works!

### Step 6.5: Test Sign Out

1. In the app, go to **Profile** tab
2. Scroll to Account section
3. Click **"Sign Out"**
4. You should return to sign-in screen
5. ✅ Sign out works!

### Step 6.6: Test Sign In

1. Enter the same email and password
2. Click **"Sign In"**
3. You should be signed in again!
4. ✅ Sign in works!

### Step 6.7: Test Data Sync

1. Add an assignment or task
2. Check console for: `[Data] Synced to cloud`
3. Go to Firebase Console → Firestore Database
4. Click **"userData"** collection
5. Click your user ID
6. You should see your data!
7. ✅ Data sync works!

---

## 📋 PHASE 7: Test Multi-Device Sync (Optional)

### Step 7.1: Open on Different Device
1. Open the same app URL on your phone or different browser
2. Sign in with the same account
3. Your data should appear!
4. Add a task on one device
5. Refresh on the other device
6. The task should appear!
7. ✅ Multi-device sync works!

---

## 📋 PHASE 8: Deploy to Production (15 minutes)

### Step 8.1: Commit Changes

```bash
cd /home/user/webapp
git add .
git commit -m "feat: Add Firebase authentication and cloud sync

- Integrated Firebase Authentication
- Added Firestore database sync
- Real user accounts with email/password
- Google OAuth support
- Cloud data sync across devices
- Offline support with localStorage fallback"
git push origin main
git push origin main:gh-pages
```

### Step 8.2: Set Up GitHub Pages (if not done)

1. Go to: https://github.com/tqjb8mn2qp-netizen/Focusly/settings/pages
2. Source: Select `gh-pages` branch
3. Click "Save"
4. Wait 2-3 minutes
5. Your app will be live at: `https://tqjb8mn2qp-netizen.github.io/Focusly/`

### Step 8.3: Update Firebase Authorized Domains

1. Go to Firebase Console → Authentication
2. Click **"Settings"** tab at the top
3. Click **"Authorized domains"**
4. Click **"Add domain"**
5. Add: `tqjb8mn2qp-netizen.github.io`
6. Click **"Add"**
7. ✅ Domain authorized!

---

## 🎉 CONGRATULATIONS!

You now have:
- ✅ Real user authentication
- ✅ Cloud database storage
- ✅ Multi-device sync
- ✅ Secure user accounts
- ✅ Google OAuth (if enabled)
- ✅ Production-ready app!

---

## 🆘 Troubleshooting

### Problem: "Firebase is not defined"
**Solution:** Make sure Firebase SDK loads before firebase-config.js

### Problem: "Permission denied" in Firestore
**Solution:** Check your security rules in Firestore → Rules tab

### Problem: "Invalid API key"
**Solution:** Double-check your Firebase config values

### Problem: Sign-in works but data doesn't sync
**Solution:** Check browser console for errors, verify Firestore rules

### Problem: Can't see users in Firebase Console
**Solution:** Wait a few seconds and refresh, check email is verified

---

## 📞 Need Help?

If you get stuck:
1. Check the browser console (F12) for errors
2. Check Firebase Console for error messages
3. Review each step carefully
4. Let me know where you're stuck and I'll help!

---

## 🎯 Next Steps

After this is working:
1. Test thoroughly with multiple accounts
2. Add email verification (optional)
3. Add password strength requirements
4. Add profile picture upload (optional)
5. Deploy to custom domain (optional)

---

**You've got this! Take it step by step and don't rush. Each phase builds on the previous one.**

🚀 **Ready to start? Begin with PHASE 1!**
