# 🔐 Setting Up Real User Accounts - Backend Guide

## ⚠️ Current Issue

Right now, your app uses **LOCAL STORAGE** for user accounts:
- User signs up → Account stored in their browser
- User on different device → Can't access their account
- User clears browser → Account is gone forever
- No real database → No real user management

**This is DEMO MODE, not production-ready!**

---

## ✅ Solution: Add a Real Backend

You need 3 things for real user accounts:
1. **Database** - Store user accounts and data
2. **API Server** - Handle authentication requests
3. **Secure Authentication** - JWT tokens, password encryption

---

## 🚀 Best Options for Your App

### Option 1: Firebase (Easiest - Recommended)

**Why Firebase?**
- ✅ Built-in authentication (email, Google, Apple)
- ✅ Real-time database
- ✅ Free tier (50K users)
- ✅ No server management
- ✅ 1-2 hours setup time

**What You Get:**
- Real user accounts
- Cloud database
- Automatic sync across devices
- Email verification
- Password reset
- OAuth (Google, Apple, Facebook)

---

### Option 2: Supabase (Open Source)

**Why Supabase?**
- ✅ Open source Firebase alternative
- ✅ PostgreSQL database
- ✅ Built-in auth
- ✅ Free tier (50K users)
- ✅ Can self-host

**What You Get:**
- Everything Firebase has
- SQL database (more powerful)
- Row-level security
- Self-hosting option

---

### Option 3: Custom Backend (Most Control)

**Why Custom?**
- ✅ Complete control
- ✅ Custom business logic
- ✅ No vendor lock-in
- ❌ More work to maintain

**Stack:**
- Node.js + Express
- MongoDB or PostgreSQL
- JWT authentication
- bcrypt for passwords

---

## 📋 Setup Guide: Firebase (Recommended)

### Step 1: Create Firebase Project

1. Go to https://console.firebase.google.com
2. Click "Add project"
3. Enter project name: "Study-Buddy" or "Focusly"
4. Disable Google Analytics (optional)
5. Click "Create project"

### Step 2: Enable Authentication

1. In Firebase console, go to **Authentication**
2. Click "Get started"
3. Enable sign-in methods:
   - ✅ Email/Password
   - ✅ Google (optional)
   - ✅ Apple (optional)

### Step 3: Create Firestore Database

1. Go to **Firestore Database**
2. Click "Create database"
3. Start in **production mode**
4. Choose location (closest to your users)

### Step 4: Get Firebase Config

1. Go to Project Settings (⚙️ icon)
2. Scroll to "Your apps"
3. Click "Web" (</> icon)
4. Register app name: "Study Buddy Web"
5. Copy the config object:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "study-buddy-xxxxx.firebaseapp.com",
  projectId: "study-buddy-xxxxx",
  storageBucket: "study-buddy-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:xxxxx"
};
```

### Step 5: Install Firebase in Your App

Add to your `index.html` before closing `</body>`:

```html
<!-- Firebase SDK -->
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js"></script>

<!-- Initialize Firebase -->
<script>
  const firebaseConfig = {
    // Paste your config here
  };
  firebase.initializeApp(firebaseConfig);
</script>
```

### Step 6: Update auth.js

Replace your current `signUpWithEmail` with:

```javascript
async signUpWithEmail(email, password, name) {
    try {
        // Create user account in Firebase
        const userCredential = await firebase.auth()
            .createUserWithEmailAndPassword(email, password);
        
        // Update profile name
        await userCredential.user.updateProfile({
            displayName: name
        });
        
        // Save user data to Firestore
        await firebase.firestore()
            .collection('users')
            .doc(userCredential.user.uid)
            .set({
                name: name,
                email: email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        
        this.user = {
            id: userCredential.user.uid,
            email: email,
            name: name
        };
        
        return { success: true, user: this.user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}
```

Replace your `signInWithEmail` with:

```javascript
async signInWithEmail(email, password) {
    try {
        const userCredential = await firebase.auth()
            .signInWithEmailAndPassword(email, password);
        
        // Get user data from Firestore
        const userDoc = await firebase.firestore()
            .collection('users')
            .doc(userCredential.user.uid)
            .get();
        
        this.user = {
            id: userCredential.user.uid,
            email: userCredential.user.email,
            name: userDoc.data().name
        };
        
        return { success: true, user: this.user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}
```

### Step 7: Update app.js for Cloud Sync

Replace the DataManager `save()` method:

```javascript
async save() {
    // Save locally for offline support
    localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    
    // Save to Firestore if user is authenticated
    if (firebase.auth().currentUser) {
        await firebase.firestore()
            .collection('userData')
            .doc(firebase.auth().currentUser.uid)
            .set(this.data);
    }
}
```

### Step 8: Set Up Firestore Security Rules

In Firebase Console → Firestore → Rules:

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

Click "Publish"

---

## 📋 Setup Guide: Supabase

### Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Sign up with GitHub
3. Click "New project"
4. Enter project name and database password
5. Choose region
6. Wait for project setup (~2 minutes)

### Step 2: Get API Keys

1. Go to Project Settings → API
2. Copy:
   - Project URL
   - `anon` public key

### Step 3: Install Supabase

Add to `index.html`:

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script>
  const supabase = window.supabase.createClient(
    'YOUR_PROJECT_URL',
    'YOUR_ANON_KEY'
  );
</script>
```

### Step 4: Create Database Tables

In Supabase SQL Editor, run:

```sql
-- Users table (automatically created by auth)

-- User data table
CREATE TABLE user_data (
  id UUID REFERENCES auth.users PRIMARY KEY,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view their own data"
  ON user_data FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own data"
  ON user_data FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own data"
  ON user_data FOR UPDATE
  USING (auth.uid() = id);
```

### Step 5: Update auth.js for Supabase

```javascript
async signUpWithEmail(email, password, name) {
    try {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    name: name
                }
            }
        });
        
        if (error) throw error;
        
        this.user = {
            id: data.user.id,
            email: email,
            name: name
        };
        
        return { success: true, user: this.user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async signInWithEmail(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if (error) throw error;
        
        this.user = {
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata.name
        };
        
        return { success: true, user: this.user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}
```

---

## 📋 Setup Guide: Custom Backend (Advanced)

### Stack:
- **Backend**: Node.js + Express
- **Database**: MongoDB or PostgreSQL
- **Auth**: JWT + bcrypt
- **Hosting**: Heroku, Railway, or DigitalOcean

### File Structure:
```
backend/
├── server.js          # Express server
├── routes/
│   ├── auth.js        # Authentication routes
│   └── data.js        # User data routes
├── models/
│   ├── User.js        # User model
│   └── UserData.js    # Study data model
├── middleware/
│   └── auth.js        # JWT verification
└── package.json
```

### Basic Implementation:

**1. Install dependencies:**
```bash
npm init -y
npm install express mongoose bcryptjs jsonwebtoken cors dotenv
```

**2. server.js:**
```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/data', require('./routes/data'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

**3. models/User.js:**
```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

module.exports = mongoose.model('User', userSchema);
```

**4. routes/auth.js:**
```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Sign up
router.post('/signup', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        
        const user = new User({ email, password, name });
        await user.save();
        
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        res.json({ success: true, token, user: { id: user._id, email, name } });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Sign in
router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) throw new Error('Invalid credentials');
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error('Invalid credentials');
        
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        res.json({ success: true, token, user: { id: user._id, email, name: user.name } });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

module.exports = router;
```

**5. Update your auth.js to call the API:**
```javascript
async signUpWithEmail(email, password, name) {
    try {
        const response = await fetch('https://your-backend.com/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, name })
        });
        
        const data = await response.json();
        
        if (data.success) {
            this.token = data.token;
            this.user = data.user;
            this.save();
        }
        
        return data;
    } catch (error) {
        return { success: false, error: error.message };
    }
}
```

---

## 🎯 Recommendation

**Start with Firebase** because:
1. ✅ Fastest to set up (1-2 hours)
2. ✅ No server management
3. ✅ Built-in everything you need
4. ✅ Free tier is generous
5. ✅ Easy to migrate later if needed

**Next steps:**
1. Create Firebase project (10 minutes)
2. Add Firebase SDK to your app (5 minutes)
3. Update auth.js (30 minutes)
4. Update app.js for cloud sync (30 minutes)
5. Test with real accounts (15 minutes)
6. Deploy! (5 minutes)

**Total time: ~1.5 hours for real user accounts!**

---

## 📞 Need Help?

I can help you:
1. Set up Firebase step-by-step
2. Write the updated auth.js code
3. Configure Firestore security rules
4. Test the authentication flow

Just let me know which option you want to use!

---

## 🚀 Summary

**Current:** Demo mode with local storage (no real accounts)
**Solution:** Add Firebase for real authentication
**Result:** Real user accounts that work across devices!

**Your users will be able to:**
- ✅ Sign up once, access anywhere
- ✅ Recover password via email
- ✅ Sync data across devices
- ✅ Never lose their data
- ✅ Use real OAuth (Google, Apple)
