# 📦 Study Buddy - Where Your Data Goes

## 🔒 Privacy-First Approach

**Your data stays on YOUR device. We don't collect, store, or sell your information.**

---

## 📍 Where is Your Data Stored?

### Current Storage: Browser LocalStorage

All your data is stored in your browser's **localStorage** - a local database on your device.

#### What This Means:
- ✅ **100% Private** - Only you can access your data
- ✅ **No Server** - Data never leaves your device
- ✅ **No Account Required** - Works offline
- ✅ **Fast** - Instant access, no internet needed
- ⚠️ **Device-Specific** - Data is only on the device you use

---

## 🗄️ What Data is Stored?

The app stores 3 main types of data in localStorage:

### 1. Authentication Data
**Storage Key:** `studyBuddyAuth`

Stored information:
```javascript
{
  user: {
    id: "user_123abc",
    email: "your@email.com",
    name: "Your Name",
    provider: "email" // or "google", "apple"
  },
  token: "session_token_here"
}
```

**Purpose:** Keeps you signed in between sessions

---

### 2. User Accounts Database
**Storage Key:** `studyBuddyUsers`

Stored information:
```javascript
[
  {
    id: "user_123abc",
    email: "your@email.com",
    name: "Your Name",
    password: "hashed_password",
    provider: "email",
    createdAt: "2026-02-04T10:30:00Z"
  }
]
```

**Purpose:** Stores registered user accounts (locally)

---

### 3. Study Buddy App Data
**Storage Key:** `studyBuddyData`

This is your main data - everything about your studying:

```javascript
{
  user: {
    name: "Student Name",
    level: 5,
    xp: 450,
    currentStreak: 7,
    totalStudyMinutes: 2400,
    badges: ["first_session", "week_warrior"],
    dailyGoalMinutes: 120
  },
  
  subjects: [
    { id: "sub1", name: "Mathematics", color: "#3498DB", icon: "📘" },
    { id: "sub2", name: "Biology", color: "#27AE60", icon: "📗" }
  ],
  
  assignments: [
    {
      id: "assign1",
      title: "Math Homework",
      subject: "Mathematics",
      dueDate: "2026-02-10",
      priority: "high",
      category: "homework",
      completed: false,
      grade: null
    }
  ],
  
  tasks: [
    {
      id: "task1",
      title: "Review notes",
      completed: false,
      createdAt: "2026-02-04"
    }
  ],
  
  studySessions: [
    {
      id: "session1",
      subject: "Mathematics",
      duration: 25,
      date: "2026-02-04",
      xpEarned: 30
    }
  ],
  
  dailyLogs: [
    {
      date: "2026-02-04",
      studyMinutes: 50,
      tasksCompleted: 3,
      xpEarned: 75
    }
  ]
}
```

---

## 🔍 How to View Your Data

### Option 1: Browser DevTools

1. Open your app in the browser
2. Press **F12** (or right-click → Inspect)
3. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
4. Click **Local Storage** → Your domain
5. You'll see three keys:
   - `studyBuddyAuth`
   - `studyBuddyUsers`
   - `studyBuddyData`

### Option 2: Export from App

1. Open Study Buddy
2. Go to **Profile** → **Export Data**
3. Download your data as JSON file
4. Open with any text editor to view

---

## 💾 Data Persistence

### When Your Data is Saved:
- ✅ Every time you add an assignment
- ✅ Every time you complete a task
- ✅ Every time you finish a study session
- ✅ Every time you earn XP
- ✅ When you sign in/out
- ✅ When you edit your profile

### When Your Data Persists:
- ✅ After closing the browser
- ✅ After restarting your computer
- ✅ After clearing cache (but NOT clearing site data)

### When Your Data is Lost:
- ❌ If you clear browser data/cookies
- ❌ If you use Incognito/Private mode
- ❌ If you switch to a different browser
- ❌ If you use a different device

---

## 🔐 Security & Privacy

### Current Security (Local Storage):

**Password Hashing:**
```javascript
// Passwords are hashed using SHA-256
const hashedPassword = await crypto.subtle.digest('SHA-256', password);
```

**Token-Based Authentication:**
```javascript
// Tokens expire after 7 days
token: {
  userId: "user123",
  exp: Date.now() + (7 * 24 * 60 * 60 * 1000)
}
```

### Limitations of LocalStorage:

⚠️ **Not Encrypted** - Data is stored in plain text on your device
⚠️ **No Backup** - If you clear data, it's gone
⚠️ **No Sync** - Can't access from multiple devices
⚠️ **JavaScript Access** - Any script on the page can read it

### Who Can See Your Data?

✅ **You** - Full access on your device
✅ **Browser Extensions** - Can potentially read localStorage
❌ **Websites** - Cannot access your data
❌ **Other Users** - Cannot see your data
❌ **Study Buddy Servers** - We don't have servers! Your data never leaves your device

---

## 🚀 Future Storage Options

For production use, here are better alternatives:

### Option 1: Firebase (Recommended)

**What Changes:**
- Data stored in Google's secure cloud
- Syncs across all your devices
- Automatic backups
- Real-time updates
- User authentication handled by Google

**Setup Required:**
```javascript
// Firebase config
firebase.initializeApp({
  apiKey: "your-api-key",
  authDomain: "focusly.firebaseapp.com",
  databaseURL: "https://focusly.firebaseio.com"
});
```

**Benefits:**
- ✅ Access from any device
- ✅ Never lose your data
- ✅ Secure authentication
- ✅ Free tier available

---

### Option 2: Supabase (Open Source Alternative)

**What Changes:**
- PostgreSQL database in the cloud
- Real-time subscriptions
- Built-in authentication
- Row-level security
- REST and GraphQL APIs

**Benefits:**
- ✅ Open source
- ✅ SQL database (more powerful)
- ✅ Self-hostable
- ✅ Free tier available

---

### Option 3: Custom Backend

**What You'd Need:**
- Node.js/Express server
- MongoDB/PostgreSQL database
- JWT authentication
- HTTPS/SSL certificate
- Hosting (AWS, DigitalOcean, Heroku)

**Benefits:**
- ✅ Complete control
- ✅ Custom features
- ✅ No third-party limits
- ❌ More complex to maintain

---

## 📤 Backing Up Your Data

### Method 1: Export Feature (Built-in)

1. Go to **Profile** → **Export Data**
2. Click **Export Data**
3. Save the JSON file somewhere safe
4. To restore: **Import Data** → Select your JSON file

### Method 2: Manual Backup

**Save this code in browser console:**
```javascript
// Backup all localStorage data
const backup = {
  auth: localStorage.getItem('studyBuddyAuth'),
  users: localStorage.getItem('studyBuddyUsers'),
  data: localStorage.getItem('studyBuddyData')
};
console.log(JSON.stringify(backup, null, 2));
// Copy the output and save to a file
```

### Method 3: Automatic Cloud Backup

**If using Firebase/Supabase:**
- Data is automatically backed up
- Multiple redundant copies
- Point-in-time recovery available

---

## 🔄 Data Migration

### Moving to a New Device:

**Current (LocalStorage only):**
1. Export data from old device
2. Install app on new device
3. Import data on new device

**Future (Cloud Storage):**
1. Sign in on new device
2. Data automatically syncs
3. Start using immediately!

---

## 📊 Data Size & Limits

### LocalStorage Limits:
- **Maximum:** ~5-10 MB per domain
- **Current Usage:** ~0.5-2 MB (typical)
- **What Uses Space:**
  - User profile: ~1 KB
  - Assignments: ~100 bytes each
  - Study sessions: ~150 bytes each
  - Tasks: ~50 bytes each

**You can store:**
- ~50,000 assignments
- ~100,000 tasks
- ~30,000 study sessions

**Before hitting the limit!**

---

## ❓ FAQ

### Q: Can I access my data from my phone and computer?
**A:** Not currently. With local storage, data is per-device. To sync across devices, you'd need cloud storage (Firebase/Supabase).

### Q: What happens if I clear my browser cache?
**A:** Your data is safe! Cache and localStorage are separate. But if you select "Clear cookies and site data," you'll lose everything.

### Q: Is my data encrypted?
**A:** Passwords are hashed, but other data is stored in plain text locally. For full encryption, consider adding a backend.

### Q: Can someone hack my data?
**A:** LocalStorage can be accessed by:
- Anyone with physical access to your unlocked device
- Malicious browser extensions
- XSS attacks (we have CSP protection)

Your data is not accessible over the internet.

### Q: How do I delete all my data?
**A:** Profile → **Clear All Data** (requires confirmation)

### Q: Can I use this at school?
**A:** Yes! It works completely offline. No internet required once loaded.

---

## 🎯 Recommendations

### For Personal Use:
✅ **Current setup is perfect!**
- Fast, private, works offline
- No setup needed
- Export data regularly as backup

### For Multiple Devices:
✅ **Add Firebase or Supabase**
- 1-2 days setup
- Free tier is generous
- Syncs automatically

### For School/Business:
✅ **Custom backend recommended**
- Better control and security
- Compliance with regulations
- Custom features possible

---

## 📞 Questions?

**Data Privacy Concerns?**
Your data never leaves your device with the current setup!

**Want Cloud Sync?**
Check `DEPLOYMENT_GUIDE.md` for Firebase setup instructions

**Technical Questions?**
Open an issue on GitHub: https://github.com/tqjb8mn2qp-netizen/Focusly/issues

---

**Summary:** Your Study Buddy data is stored locally on your device using browser localStorage. It's private, fast, and works offline - but only accessible from the device you're using. Export regularly to backup!

🔒 **Your data = Your control**
