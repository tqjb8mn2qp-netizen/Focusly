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
    // APPLE SIGN IN
    // ============================================

    async signInWithApple() {
        try {
            const provider = new firebase.auth.OAuthProvider('apple.com');
            const result = await auth.signInWithPopup(provider);
            
            // Check if user profile exists, if not create it
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
            'auth/cancelled-popup-request': 'Only one popup request is allowed at a time',
            'auth/popup-blocked': 'Sign-in popup was blocked by the browser',
            'auth/network-request-failed': 'Network error. Check your connection'
        };
        
        return errorMessages[errorCode] || 'An error occurred. Please try again.';
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
}
