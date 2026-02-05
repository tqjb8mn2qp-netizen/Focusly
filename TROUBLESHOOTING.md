# 🔧 Google Sign-In Troubleshooting Guide

## ✅ Merge Conflicts - RESOLVED

The GitHub PR conflicts have been resolved. You can now merge the PR!

---

## 🚨 If Google Sign-In Still Not Working

### Step 1: Verify Domains in Firebase Console

**Go to:** https://console.firebase.google.com/project/focusly-da00f/authentication/settings

**Scroll to "Authorized domains"**

**Make sure you see BOTH these domains:**
- ✅ `localhost`
- ✅ `focusly-da00f.firebaseapp.com`
- ✅ `tqjb8mn2qp-netizen.github.io` ← **Your production domain**
- ✅ `8000-immk5r2z04fqu7byp66c2-0e616f0a.sandbox.novita.ai` ← **Your testing domain**

If missing, add them!

---

### Step 2: Check Google Provider is Enabled

**Go to:** https://console.firebase.google.com/project/focusly-da00f/authentication/providers

1. Find **"Google"** in the list
2. Make sure it says **"Enabled"** (not "Disabled")
3. If disabled:
   - Click on Google row
   - Toggle "Enable" to ON
   - Select your support email
   - Click "Save"

---

### Step 3: Clear Browser Cache

**Important:** Browser caching can cause issues

**Chrome/Edge:**
1. Press `Ctrl + Shift + Delete` (or `Cmd + Shift + Delete` on Mac)
2. Select "Cached images and files"
3. Select "All time"
4. Click "Clear data"

**Safari:**
1. Press `Cmd + Option + E`
2. Or: Safari → Preferences → Privacy → Manage Website Data → Remove All

**Firefox:**
1. Press `Ctrl + Shift + Delete`
2. Select "Cache"
3. Click "Clear Now"

---

### Step 4: Try in Incognito/Private Mode

This bypasses cache completely:
- **Chrome:** Ctrl + Shift + N
- **Safari:** Cmd + Shift + N  
- **Firefox:** Ctrl + Shift + P

Then test Google Sign-In again.

---

### Step 5: Check Browser Console for Errors

1. **Open your app** in browser
2. **Press F12** (or right-click → Inspect)
3. **Click "Console" tab**
4. **Click "Continue with Google"**
5. **Look for red error messages**

**Common errors and fixes:**

| Error | Meaning | Fix |
|-------|---------|-----|
| `auth/unauthorized-domain` | Domain not in Firebase | Add domain to Firebase Console |
| `auth/popup-blocked` | Browser blocked popup | Allow popups for your site |
| `auth/network-request-failed` | Internet issue | Check connection |
| `auth/internal-error` | Firebase config issue | Check API key is correct |

---

### Step 6: Verify Firebase Configuration

**Check your firebase-config.js has correct values:**

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDePb8G4fh2fgXI9_UDnT-y1nm2ePvGU0o",
  authDomain: "focusly-da00f.firebaseapp.com",
  projectId: "focusly-da00f",
  storageBucket: "focusly-da00f.firebasestorage.app",
  messagingSenderId: "552503567149",
  appId: "1:552503567149:web:29da8b78d7ef40680929a4"
};
```

These should match your Firebase Console:
https://console.firebase.google.com/project/focusly-da00f/settings/general

---

### Step 7: Test on Different Domain

**Test on sandbox first:**
- https://8000-immk5r2z04fqu7byp66c2-0e616f0a.sandbox.novita.ai/

**Then test on production:**
- https://tqjb8mn2qp-netizen.github.io/Focusly/

If one works but not the other, the domain that doesn't work is missing from Firebase authorized domains.

---

## 🎯 Expected Behavior

When working correctly:

1. ✅ Click "Continue with Google"
2. ✅ Google popup window opens
3. ✅ Select your Google account
4. ✅ Popup closes automatically
5. ✅ You're signed in! See welcome message
6. ✅ Dashboard loads with your name

---

## 📸 How to Share Error for Help

If still not working, please provide:

1. **Screenshot of browser console (F12 → Console tab)**
2. **Screenshot of the error message**
3. **Which URL you're testing** (sandbox or GitHub Pages)
4. **Screenshot of Firebase authorized domains list**

---

## 🔗 Quick Links

| What | Link |
|------|------|
| **Firebase Settings** | https://console.firebase.google.com/project/focusly-da00f/authentication/settings |
| **Firebase Providers** | https://console.firebase.google.com/project/focusly-da00f/authentication/providers |
| **Sandbox App** | https://8000-immk5r2z04fqu7byp66c2-0e616f0a.sandbox.novita.ai/ |
| **Production App** | https://tqjb8mn2qp-netizen.github.io/Focusly/ |
| **Pull Request** | https://github.com/tqjb8mn2qp-netizen/Focusly/pull/1 |

---

## ✅ Checklist

Before asking for help, make sure:

- [ ] Both domains added to Firebase authorized domains
- [ ] Google provider is enabled in Firebase
- [ ] Cleared browser cache
- [ ] Tried in incognito mode
- [ ] Checked browser console for errors
- [ ] Waited 2-3 minutes after adding domains
- [ ] Refreshed the page (Ctrl + F5)
- [ ] Popups are allowed in browser

---

**99% of issues are caused by:**
1. Domain not added to Firebase (most common)
2. Browser cache
3. Popup blocker

**Fix these three and it will work!** 🎉
