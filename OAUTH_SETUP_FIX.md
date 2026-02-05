# 🚨 Fixing "Internal Error" for Google Sign-In

## The Problem

You're seeing: **"Google sign-in failed: An internal error occurred. Please try again in a few moments."**

This is Firebase error code `auth/internal-error`, which usually means the **OAuth consent screen** isn't properly configured in Google Cloud Console.

---

## ✅ Solution: Configure OAuth Consent Screen

### **Step 1: Go to Google Cloud Console**

**Open:** https://console.cloud.google.com/apis/credentials/consent?project=focusly-da00f

(This link goes directly to your project's OAuth consent screen)

---

### **Step 2: Configure OAuth Consent Screen**

You'll see one of these scenarios:

#### **Scenario A: No OAuth consent screen configured yet**

1. Click **"CONFIGURE CONSENT SCREEN"**
2. Select **"External"** (allows anyone with Google account)
3. Click **"CREATE"**

#### **Scenario B: OAuth consent screen exists**

Just verify the settings below.

---

### **Step 3: Fill in Required Information**

**App Information:**
- **App name:** `Study Buddy` (or `Focusly`)
- **User support email:** Select your email from dropdown
- **App logo:** (Optional - skip for now)

**App Domain:**
- **Application home page:** `https://tqjb8mn2qp-netizen.github.io/Focusly/`
- **Privacy Policy:** (Optional - can skip)
- **Terms of Service:** (Optional - can skip)

**Authorized domains:**
- Click **"+ ADD DOMAIN"**
- Add: `github.io`
- Add: `novita.ai` (for sandbox testing)

**Developer contact information:**
- **Email:** Your email address

**Click "SAVE AND CONTINUE"**

---

### **Step 4: Scopes**

On the "Scopes" page:

1. Click **"ADD OR REMOVE SCOPES"**
2. Select these scopes (they should already be there):
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
   - `openid`
3. Click **"UPDATE"**
4. Click **"SAVE AND CONTINUE"**

---

### **Step 5: Test Users (Optional)**

If your app is in "Testing" mode:

1. Click **"+ ADD USERS"**
2. Add your email address
3. Click **"ADD"**
4. Click **"SAVE AND CONTINUE"**

**OR** skip this and publish the app (next step)

---

### **Step 6: Publish Your App**

1. Click **"BACK TO DASHBOARD"** (top left)
2. You'll see **"Publishing status: Testing"**
3. Click **"PUBLISH APP"**
4. Click **"CONFIRM"**

**Status will change to "In production"** ✅

---

## 🎯 After Configuration

1. **Wait 1-2 minutes** for Google to update
2. **Clear browser cache** (Ctrl + Shift + Delete)
3. **Refresh your app** (Ctrl + F5)
4. **Try Google Sign-In again**

**It should work now!** ✅

---

## 🔍 Alternative: Check API Key Restrictions

If the above doesn't work, check API key restrictions:

**Go to:** https://console.cloud.google.com/apis/credentials?project=focusly-da00f

1. Find your **Browser key** (starts with `AIza...`)
2. Click on it
3. Under **"Application restrictions"**, select **"None"**
4. Under **"API restrictions"**, select **"Don't restrict key"**
5. Click **"SAVE"**

---

## 📋 Quick Links

| What | Link |
|------|------|
| **OAuth Consent Screen** | https://console.cloud.google.com/apis/credentials/consent?project=focusly-da00f |
| **API Credentials** | https://console.cloud.google.com/apis/credentials?project=focusly-da00f |
| **Firebase Console** | https://console.firebase.google.com/project/focusly-da00f |
| **Test App** | https://8000-immk5r2z04fqu7byp66c2-0e616f0a.sandbox.novita.ai/ |

---

## ✅ Summary

**The "internal error" means:**
- OAuth consent screen not configured OR
- App is in "Testing" mode with restricted users OR
- API key has restrictions

**Fix by:**
1. Configure OAuth consent screen (5 minutes)
2. Publish the app to production
3. Clear cache and test

**This should fix it!** 🚀

---

## 🆘 Still Not Working?

If you still see errors after this:

1. Take screenshot of OAuth consent screen status page
2. Take screenshot of browser console (F12)
3. Check if billing is enabled on Firebase (shouldn't be required for Spark plan though)

Share those screenshots and I'll help debug further!
