# 🔧 Google Sign-In Error - Complete Fix Guide

## 🚨 The Problem

You're seeing: **"Google sign-in failed: An error occurred. Please try again."**

This happens because your GitHub Pages domain is not authorized in Firebase.

---

## ✅ Solution (5 minutes to fix)

### **Step 1: Add Your Domain to Firebase Authorized Domains**

1. **Go to Firebase Console:**
   - Visit: https://console.firebase.google.com/project/focusly-da00f/authentication/settings

2. **Click on "Settings" tab** (next to "Sign-in method")

3. **Scroll down to "Authorized domains" section**

4. **Click "Add domain"**

5. **Enter your GitHub Pages domain:**
   ```
   tqjb8mn2qp-netizen.github.io
   ```

6. **Click "Add"**

✅ **That's it! This is the main fix.**

---

### **Step 2: Verify Google Sign-In is Enabled**

1. **Go to "Sign-in method" tab:**
   https://console.firebase.google.com/project/focusly-da00f/authentication/providers

2. **Find "Google" in the list**

3. **Check if it says "Enabled"**
   - ✅ If yes, great!
   - ❌ If no, click on it and enable it:
     - Toggle "Enable" to ON
     - Select your support email
     - Click "Save"

---

### **Step 3: Test Your App**

1. **Wait 1-2 minutes** for Firebase to update

2. **Open your app:**
   - https://tqjb8mn2qp-netizen.github.io/Focusly/

3. **Click "Continue with Google"**

4. **You should see the Google sign-in popup!**

---

## 🔍 Why This Happens

Firebase restricts OAuth sign-ins to authorized domains for security. By default, only:
- `localhost`
- `*.firebaseapp.com` domains

are authorized. You need to manually add your custom domain.

---

## 🆘 Still Not Working?

### Check 1: Console Errors

1. Open browser console (F12)
2. Look for errors
3. Common issues:
   - `popup-blocked` → Allow popups in browser
   - `unauthorized-domain` → Domain not added (Step 1)
   - `network-error` → Check internet connection

### Check 2: Browser Popup Blocker

- Make sure popups are allowed for your site
- Chrome: Look for blocked popup icon in address bar
- Safari: Preferences → Websites → Pop-up Windows → Allow

### Check 3: Incognito Mode

Try in incognito/private mode to rule out extensions blocking it.

---

## 📋 Quick Checklist

- [ ] Added `tqjb8mn2qp-netizen.github.io` to authorized domains
- [ ] Google provider is enabled in Firebase
- [ ] Waited 1-2 minutes for changes to apply
- [ ] Cleared browser cache / tried incognito
- [ ] Allowed popups for your site
- [ ] Tested the sign-in

---

## 🎯 Expected Result

After fixing:

1. ✅ Click "Continue with Google"
2. ✅ Google popup opens
3. ✅ Select your Google account
4. ✅ Signed in successfully!
5. ✅ Your data syncs to Firebase!

---

## 🔗 Quick Links

**Firebase Console - Authorized Domains:**
https://console.firebase.google.com/project/focusly-da00f/authentication/settings

**Firebase Console - Sign-in Methods:**
https://console.firebase.google.com/project/focusly-da00f/authentication/providers

**Your Live App:**
https://tqjb8mn2qp-netizen.github.io/Focusly/

---

## 💡 Additional Domains (If needed later)

If you use other domains, add them too:
- Custom domain: `yourdomain.com`
- Staging: `staging.yourdomain.com`
- Development: `localhost` (already added by default)

---

**This fix takes 2 minutes. Add the domain and you're done! 🚀**
