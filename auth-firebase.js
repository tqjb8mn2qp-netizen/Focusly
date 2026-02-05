// Firebase Authentication Manager
// Real authentication using Firebase (with localStorage fallback)

class AuthManager {
    constructor() {
        this.user = null;
        this.unsubscribe = null;
        this.storageKey = 'studyBuddyAuth';
        this.usersKey = 'studyBuddyUsers';
        this.useFirebase = typeof auth !== 'undefined' && auth !== null;
        
        if (this.useFirebase) {
            console.log('[Auth] Using Firebase authentication');
        } else {
            console.log('[Auth] Using localStorage authentication (Firebase not configured)');
        }
        
        this.init();
    }

    init() {
        if (this.useFirebase) {
            // Firebase auth state listener
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
        } else {
            // Load from localStorage
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                try {
                    const data = JSON.parse(saved);
                    this.user = data.user;
                    this.token = data.token;
                } catch (e) {
                    console.error('[Auth] Failed to parse saved auth:', e);
                }
            }
        }
    }

    // ============================================
    // EMAIL/PASSWORD AUTHENTICATION
    // ============================================

    async signUpWithEmail(email, password, name) {
        if (this.useFirebase) {
            // Firebase sign up
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
                
                console.log('[Auth] Sign-up successful:', email);
                
                return { 
                    success: true, 
                    user: { id: userCredential.user.uid, email: email, name: name }
                };
            } catch (error) {
                console.error('[Auth] Sign-up failed:', error);
                return { success: false, error: this.getErrorMessage(error.code) };
            }
        } else {
            // localStorage sign up (fallback)
            try {
                if (!this.validateEmail(email)) {
                    throw new Error('Invalid email address');
                }
                if (password.length < 6) {
                    throw new Error('Password must be at least 6 characters');
                }
                
                const users = this.getAllUsers();
                if (users.find(u => u.email === email)) {
                    throw new Error('Email already registered');
                }
                
                const user = {
                    id: this.generateUserId(),
                    email,
                    name: name.trim(),
                    provider: 'email',
                    createdAt: new Date().toISOString()
                };
                
                const hashedPassword = await this.hashPassword(password);
                users.push({ ...user, password: hashedPassword });
                this.saveAllUsers(users);
                
                this.token = this.generateToken(user);
                this.user = user;
                this.save();
                
                console.log('[Auth] Sign-up successful (localStorage):', email);
                return { success: true, user };
            } catch (error) {
                console.error('[Auth] Sign-up failed:', error);
                return { success: false, error: error.message };
            }
        }
    }

    async signInWithEmail(email, password) {
        if (this.useFirebase) {
            // Firebase sign in
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
        } else {
            // localStorage sign in (fallback)
            try {
                if (!this.validateEmail(email)) {
                    throw new Error('Invalid email address');
                }
                
                const users = this.getAllUsers();
                const user = users.find(u => u.email === email);
                
                if (!user) {
                    throw new Error('Invalid email or password');
                }
                
                const passwordValid = await this.verifyPassword(password, user.password);
                if (!passwordValid) {
                    throw new Error('Invalid email or password');
                }
                
                const userData = { ...user };
                delete userData.password;
                
                this.token = this.generateToken(userData);
                this.user = userData;
                this.save();
                
                console.log('[Auth] Sign-in successful (localStorage):', email);
                return { success: true, user: userData };
            } catch (error) {
                console.error('[Auth] Sign-in failed:', error);
                return { success: false, error: error.message };
            }
        }
    }

    // ============================================
    // GOOGLE OAUTH
    // ============================================

    async signInWithGoogle() {
        if (!this.useFirebase) {
            return { 
                success: false, 
                error: 'Google Sign-In requires Firebase. Please set up Firebase configuration first.' 
            };
        }
        
        try {
            console.log('[Auth] Starting Google sign-in...');
            const provider = new firebase.auth.GoogleAuthProvider();
            
            console.log('[Auth] Opening Google sign-in popup...');
            const result = await auth.signInWithPopup(provider);
            
            console.log('[Auth] Google sign-in popup completed, checking user document...');
            const userDoc = await db.collection('users').doc(result.user.uid).get();
            if (!userDoc.exists) {
                console.log('[Auth] Creating new user document in Firestore...');
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
            console.error('[Auth] Google sign-in failed with code:', error.code);
            console.error('[Auth] Google sign-in error message:', error.message);
            console.error('[Auth] Full error:', error);
            
            // Log helpful debugging information
            if (error.code === 'auth/unauthorized-domain') {
                console.error('[Auth] 🚨 UNAUTHORIZED DOMAIN ERROR');
                console.error('[Auth] Your domain needs to be added to Firebase Console');
                console.error('[Auth] Go to: https://console.firebase.google.com/project/focusly-da00f/authentication/settings');
                console.error('[Auth] Add this domain to authorized domains:', window.location.hostname);
            }
            
            return { success: false, error: this.getErrorMessage(error.code) };
        }
    }

    // ============================================
    // APPLE SIGN IN
    // ============================================

    async signInWithApple() {
        if (!this.useFirebase) {
            return { 
                success: false, 
                error: 'Apple Sign-In requires Firebase. Please set up Firebase configuration first.' 
            };
        }
        
        try {
            const provider = new firebase.auth.OAuthProvider('apple.com');
            const result = await auth.signInWithPopup(provider);
            
            const userDoc = await db.collection('users').doc(result.user.uid).get();
            if (!userDoc.exists) {
                await db.collection('users').doc(result.user.uid).set({
                    name: result.user.displayName || 'Apple User',
                    email: result.user.email,
                    provider: 'apple',
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    gradeLevel: '11th Grade',
                    dailyGoalMinutes: 120
                });
            }
            
            console.log('[Auth] Apple sign-in successful:', result.user.email);
            
            return { 
                success: true, 
                user: {
                    id: result.user.uid,
                    email: result.user.email,
                    name: result.user.displayName || 'Apple User'
                }
            };
        } catch (error) {
            console.error('[Auth] Apple sign-in failed:', error);
            return { success: false, error: this.getErrorMessage(error.code) };
        }
    }

    // ============================================
    // USER MANAGEMENT
    // ============================================

    isAuthenticated() {
        if (this.useFirebase) {
            return auth.currentUser !== null;
        } else {
            return this.user !== null;
        }
    }

    getUser() {
        return this.user;
    }

    async logout() {
        if (this.useFirebase) {
            try {
                await auth.signOut();
                this.user = null;
                console.log('[Auth] Logged out successfully');
            } catch (error) {
                console.error('[Auth] Logout failed:', error);
            }
        } else {
            this.user = null;
            this.token = null;
            localStorage.removeItem(this.storageKey);
            console.log('[Auth] Logged out (localStorage)');
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
            'auth/popup-closed-by-user': 'Sign-in popup was closed before completing',
            'auth/cancelled-popup-request': 'Only one popup request is allowed at a time',
            'auth/popup-blocked': 'Sign-in popup was blocked by your browser. Please allow popups for this site.',
            'auth/unauthorized-domain': 'This domain is not authorized for OAuth operations. Please add this domain to your Firebase Console authorized domains list.',
            'auth/network-request-failed': 'Network error. Please check your internet connection and try again.',
            'auth/internal-error': 'An internal error occurred. Please try again in a few moments.',
            'auth/invalid-api-key': 'Invalid Firebase API key. Please check your configuration.',
            'auth/app-deleted': 'Firebase app has been deleted. Please contact support.',
            'auth/invalid-user-token': 'Your session has expired. Please sign in again.',
            'auth/user-token-expired': 'Your session has expired. Please sign in again.',
            'auth/web-storage-unsupported': 'Your browser does not support web storage. Please enable cookies.',
            'auth/timeout': 'The operation timed out. Please try again.'
        };
        
        return errorMessages[errorCode] || 'An error occurred. Please try again.';
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // ============================================
    // LOCALSTORAGE HELPER METHODS (Fallback)
    // ============================================
    
    save() {
        localStorage.setItem(this.storageKey, JSON.stringify({
            user: this.user,
            token: this.token
        }));
    }
    
    getAllUsers() {
        const saved = localStorage.getItem(this.usersKey);
        return saved ? JSON.parse(saved) : [];
    }
    
    saveAllUsers(users) {
        localStorage.setItem(this.usersKey, JSON.stringify(users));
    }
    
    async hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password + 'salt_study_buddy');
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
    
    async verifyPassword(password, hash) {
        const testHash = await this.hashPassword(password);
        return testHash === hash;
    }
    
    generateToken(user) {
        const payload = {
            userId: user.id,
            email: user.email,
            iat: Date.now(),
            exp: Date.now() + (7 * 24 * 60 * 60 * 1000)
        };
        return btoa(JSON.stringify(payload));
    }
    
    generateUserId() {
        return 'user_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}
