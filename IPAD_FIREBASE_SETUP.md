# 📱 Firebase Setup Guide for iPad (GitHub Web Editor)

Since you're using an iPad, you can edit all files directly on GitHub.com! No VS Code needed.

---

## 🎯 Quick Links You'll Need

1. **Your GitHub Repo:** https://github.com/tqjb8mn2qp-netizen/Focusly
2. **Firebase Console:** https://console.firebase.google.com
3. **This guide:** Keep this tab open!

---

## ✅ Complete the Setup (Follow in Order)

### PHASE 1-4: Do First in Firebase Console
Complete Phases 1-4 from the main guide:
- ✅ Create Firebase project
- ✅ Enable authentication
- ✅ Create Firestore database
- ✅ Get your Firebase config

**Copy your Firebase config and save it in Notes app!**

---

### PHASE 5: Edit Files on GitHub (iPad Instructions)

## Step 1: Create firebase-config.js

1. **Open:** https://github.com/tqjb8mn2qp-netizen/Focusly

2. **Click:** "Add file" → "Create new file"

3. **File name:** `firebase-config.js`

4. **Paste this code:**
```javascript
// Firebase Configuration
const firebaseConfig = {
  apiKey: "PASTE_YOUR_API_KEY_HERE",
  authDomain: "PASTE_YOUR_AUTH_DOMAIN",
  projectId: "PASTE_YOUR_PROJECT_ID",
  storageBucket: "PASTE_YOUR_STORAGE_BUCKET",
  messagingSenderId: "PASTE_YOUR_SENDER_ID",
  appId: "PASTE_YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
console.log('🔥 Firebase initialized!');
```

5. **Replace** the PASTE_YOUR_XXX with your actual Firebase values

6. **Scroll down** → **"Commit changes"** → **"Commit changes"**

✅ Done!

---

## Step 2: Create auth-firebase.js

1. **Click:** "Add file" → "Create new file"

2. **File name:** `auth-firebase.js`

3. **Copy ALL this code** (tap and hold to select all):

```javascript
// Firebase Authentication Manager
class AuthManager {
    constructor() {
        this.user = null;
        this.init();
    }

    init() {
        auth.onAuthStateChanged((user) => {
            if (user) {
                this.user = {
                    id: user.uid,
                    email: user.email,
                    name: user.displayName || 'User'
                };
                console.log('[Auth] User signed in:', this.user.email);
            } else {
                this.user = null;
                console.log('[Auth] User signed out');
            }
        });
    }

    async signUpWithEmail(email, password, name) {
        try {
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            await userCredential.user.updateProfile({ displayName: name });
            
            await db.collection('users').doc(userCredential.user.uid).set({
                name: name,
                email: email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                gradeLevel: '11th Grade',
                dailyGoalMinutes: 120
            });
            
            return { 
                success: true, 
                user: { id: userCredential.user.uid, email: email, name: name }
            };
        } catch (error) {
            return { success: false, error: this.getErrorMessage(error.code) };
        }
    }

    async signInWithEmail(email, password) {
        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            return { 
                success: true, 
                user: {
                    id: userCredential.user.uid,
                    email: userCredential.user.email,
                    name: userCredential.user.displayName
                }
            };
        } catch (error) {
            return { success: false, error: this.getErrorMessage(error.code) };
        }
    }

    async signInWithGoogle() {
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            const result = await auth.signInWithPopup(provider);
            
            const userDoc = await db.collection('users').doc(result.user.uid).get();
            if (!userDoc.exists) {
                await db.collection('users').doc(result.user.uid).set({
                    name: result.user.displayName,
                    email: result.user.email,
                    picture: result.user.photoURL,
                    provider: 'google',
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            }
            
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
            return { success: false, error: this.getErrorMessage(error.code) };
        }
    }

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
        } catch (error) {
            console.error('[Auth] Logout failed:', error);
        }
    }

    async requestPasswordReset(email) {
        try {
            await auth.sendPasswordResetEmail(email);
            return { success: true, message: 'Password reset link sent' };
        } catch (error) {
            return { success: false, error: this.getErrorMessage(error.code) };
        }
    }

    getErrorMessage(errorCode) {
        const messages = {
            'auth/email-already-in-use': 'Email already registered',
            'auth/invalid-email': 'Invalid email address',
            'auth/weak-password': 'Password must be at least 6 characters',
            'auth/user-not-found': 'Invalid email or password',
            'auth/wrong-password': 'Invalid email or password',
            'auth/network-request-failed': 'Network error'
        };
        return messages[errorCode] || 'An error occurred';
    }

    validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
}
```

4. **Commit changes**

✅ Done!

---

## Step 3: Edit index.html

1. **Find index.html** in your file list → **Click it**

2. **Click the pencil icon** ✏️ (top right)

3. **Scroll all the way down** to find `</body>`

4. **BEFORE `</body>`**, add these lines:

```html
    <!-- Firebase SDK -->
    <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js"></script>
    
    <!-- Firebase Config -->
    <script src="firebase-config.js"></script>
```

5. **Find this line:**
```html
<script src="auth.js"></script>
```

6. **Change it to:**
```html
<script src="auth-firebase.js"></script>
```

7. **Commit changes:** Add message "Add Firebase SDK", click "Commit changes"

✅ Done!

---

## Step 4: Update app.js for Cloud Sync

1. **Find app.js** → **Click it** → **Click pencil** ✏️

2. **Use browser Find** (Safari menu → Find in page)

3. **Search for:** `save() {`

4. **You'll find the save method around line 66**

5. **Replace the entire save() method** with:

```javascript
    async save() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.data));
        
        if (auth.currentUser) {
            try {
                await db.collection('userData').doc(auth.currentUser.uid).set({
                    data: this.data,
                    lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
                });
                console.log('[Data] Synced to cloud');
            } catch (error) {
                console.error('[Data] Sync failed:', error);
            }
        }
    }
```

6. **Now search for:** `initializeData() {`

7. **Replace the entire initializeData() method** with:

```javascript
    async initializeData() {
        if (auth.currentUser) {
            try {
                const doc = await db.collection('userData').doc(auth.currentUser.uid).get();
                if (doc.exists) {
                    this.data = doc.data().data;
                    localStorage.setItem(this.storageKey, JSON.stringify(this.data));
                    console.log('[Data] Loaded from cloud');
                    return;
                }
            } catch (error) {
                console.error('[Data] Load failed:', error);
            }
        }
        
        const stored = localStorage.getItem(this.storageKey);
        if (!stored) {
            this.data = this.getDefaultData();
            this.save();
        } else {
            this.data = JSON.parse(stored);
        }
    }
```

8. **Commit changes**

✅ Done!

---

## 🎉 All Done! Now Test

1. **Wait 2-3 minutes** for GitHub Pages to update

2. **Open your app:** https://tqjb8mn2qp-netizen.github.io/Focusly/

3. **Open Safari Developer Console:**
   - Safari → Preferences → Advanced → Enable "Show Develop menu"
   - Develop → Show JavaScript Console

4. **Test sign up:**
   - Create a new account
   - Should see: "🔥 Firebase initialized!"
   - Should see: "[Auth] User signed in"

5. **Check Firebase Console:**
   - Go to Authentication → Users
   - Your user should appear!

6. **Test data sync:**
   - Add an assignment
   - Go to Firestore Database
   - Your data should be there!

---

## 📱 iPad Tips

### Copy/Paste on iPad:
- **Tap and hold** to select text
- **Drag handles** to select all
- **Tap "Copy"**
- **Tap and hold** in GitHub editor to paste

### Split Screen:
- **Drag this guide** to left side
- **Open GitHub** on right side
- Work with both visible!

### Safari Find:
- **Tap address bar**
- **Scroll down**
- **Find on Page**
- Search for code you need to replace

---

## ✅ Checklist

- [ ] Phase 1-4 done in Firebase Console
- [ ] Created firebase-config.js with your config
- [ ] Created auth-firebase.js  
- [ ] Updated index.html with Firebase SDK
- [ ] Changed auth.js to auth-firebase.js
- [ ] Updated save() method in app.js
- [ ] Updated initializeData() in app.js
- [ ] Tested sign up
- [ ] Verified user in Firebase Console
- [ ] Tested data sync

---

## 🆘 Having Trouble?

**Can't find where to paste code?**
- Look for line numbers on the left
- Use Safari's "Find on Page" feature

**Code looks wrong after pasting?**
- Make sure you selected ALL the code
- Check for any missing characters

**Changes not showing?**
- Wait 2-3 minutes for GitHub Pages to deploy
- Clear Safari cache: Settings → Safari → Clear History

**Need help?**
- Tell me which step you're on
- Share any error messages you see

---

## 🎯 Summary

You're editing files on GitHub.com (iPad-friendly)!

1. **Create** new files with "Add file"
2. **Edit** existing files with pencil icon ✏️
3. **Commit** after each change
4. **Wait** 2-3 minutes for deployment
5. **Test** your app!

**You got this! 🚀**
