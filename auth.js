// Authentication Manager
// Handles sign-up, sign-in, OAuth (Google, Apple), and token management

class AuthManager {
    constructor() {
        this.storageKey = 'studyBuddyAuth';
        this.user = null;
        this.token = null;
        this.init();
    }

    init() {
        // Load saved auth state
        const saved = localStorage.getItem(this.storageKey);
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.user = data.user;
                this.token = data.token;
                
                // Verify token is still valid
                if (this.token && this.isTokenExpired()) {
                    this.logout();
                }
            } catch (e) {
                console.error('[Auth] Failed to parse saved auth:', e);
            }
        }
    }

    save() {
        localStorage.setItem(this.storageKey, JSON.stringify({
            user: this.user,
            token: this.token
        }));
    }

    // ============================================
    // EMAIL/PASSWORD AUTHENTICATION
    // ============================================

    async signUpWithEmail(email, password, name) {
        try {
            // Validate inputs
            if (!this.validateEmail(email)) {
                throw new Error('Invalid email address');
            }
            if (password.length < 6) {
                throw new Error('Password must be at least 6 characters');
            }
            if (!name || name.trim().length < 2) {
                throw new Error('Name must be at least 2 characters');
            }

            // In production, this would call your backend API
            // For now, we'll simulate with localStorage
            const users = this.getAllUsers();
            
            // Check if email already exists
            if (users.find(u => u.email === email)) {
                throw new Error('Email already registered');
            }

            // Create new user
            const user = {
                id: this.generateUserId(),
                email,
                name: name.trim(),
                provider: 'email',
                createdAt: new Date().toISOString(),
                emailVerified: false
            };

            // Hash password (in production, do this on backend!)
            const hashedPassword = await this.hashPassword(password);
            
            // Save user
            users.push({ ...user, password: hashedPassword });
            this.saveAllUsers(users);

            // Create session
            this.token = this.generateToken(user);
            this.user = user;
            this.save();

            console.log('[Auth] Sign-up successful:', user.email);
            return { success: true, user };
        } catch (error) {
            console.error('[Auth] Sign-up failed:', error);
            return { success: false, error: error.message };
        }
    }

    async signInWithEmail(email, password) {
        try {
            // Validate inputs
            if (!this.validateEmail(email)) {
                throw new Error('Invalid email address');
            }
            if (!password) {
                throw new Error('Password is required');
            }

            // Get all users
            const users = this.getAllUsers();
            const user = users.find(u => u.email === email);

            if (!user) {
                throw new Error('Invalid email or password');
            }

            // Verify password
            const passwordValid = await this.verifyPassword(password, user.password);
            if (!passwordValid) {
                throw new Error('Invalid email or password');
            }

            // Create session
            const userData = { ...user };
            delete userData.password;

            this.token = this.generateToken(userData);
            this.user = userData;
            this.save();

            console.log('[Auth] Sign-in successful:', user.email);
            return { success: true, user: userData };
        } catch (error) {
            console.error('[Auth] Sign-in failed:', error);
            return { success: false, error: error.message };
        }
    }

    // ============================================
    // GOOGLE OAUTH
    // ============================================

    async signInWithGoogle() {
        try {
            // Check if Google API is loaded
            if (typeof google === 'undefined') {
                throw new Error('Google API not loaded. Please check your internet connection.');
            }

            // Initialize Google Sign-In
            // In production, you'd use Google's official library
            const mockGoogleUser = await this.mockGoogleSignIn();
            
            // Get or create user
            const users = this.getAllUsers();
            let user = users.find(u => u.email === mockGoogleUser.email);

            if (!user) {
                // Create new user from Google account
                user = {
                    id: this.generateUserId(),
                    email: mockGoogleUser.email,
                    name: mockGoogleUser.name,
                    picture: mockGoogleUser.picture,
                    provider: 'google',
                    createdAt: new Date().toISOString(),
                    emailVerified: true
                };
                users.push(user);
                this.saveAllUsers(users);
            }

            // Create session
            this.token = this.generateToken(user);
            this.user = user;
            this.save();

            console.log('[Auth] Google sign-in successful:', user.email);
            return { success: true, user };
        } catch (error) {
            console.error('[Auth] Google sign-in failed:', error);
            return { success: false, error: error.message };
        }
    }

    mockGoogleSignIn() {
        // Simulate Google Sign-In popup
        return new Promise((resolve, reject) => {
            // In production, this would open Google's OAuth popup
            // For demo, we'll use a custom prompt
            const email = prompt('Demo: Enter your Google email:');
            if (!email) {
                reject(new Error('Sign-in cancelled'));
                return;
            }

            const name = email.split('@')[0];
            resolve({
                email,
                name: name.charAt(0).toUpperCase() + name.slice(1),
                picture: `https://ui-avatars.com/api/?name=${name}&background=4A90E2&color=fff`
            });
        });
    }

    // ============================================
    // APPLE SIGN IN
    // ============================================

    async signInWithApple() {
        try {
            // Check if Apple ID API is loaded
            if (typeof AppleID === 'undefined') {
                throw new Error('Apple Sign In not available on this device.');
            }

            // Initialize Apple Sign-In
            // In production, you'd use Apple's official library
            const mockAppleUser = await this.mockAppleSignIn();
            
            // Get or create user
            const users = this.getAllUsers();
            let user = users.find(u => u.email === mockAppleUser.email);

            if (!user) {
                // Create new user from Apple account
                user = {
                    id: this.generateUserId(),
                    email: mockAppleUser.email,
                    name: mockAppleUser.name || 'Apple User',
                    provider: 'apple',
                    createdAt: new Date().toISOString(),
                    emailVerified: true
                };
                users.push(user);
                this.saveAllUsers(users);
            }

            // Create session
            this.token = this.generateToken(user);
            this.user = user;
            this.save();

            console.log('[Auth] Apple sign-in successful:', user.email);
            return { success: true, user };
        } catch (error) {
            console.error('[Auth] Apple sign-in failed:', error);
            return { success: false, error: error.message };
        }
    }

    mockAppleSignIn() {
        // Simulate Apple Sign-In
        return new Promise((resolve, reject) => {
            // In production, this would open Apple's OAuth popup
            // For demo, we'll use a custom prompt
            const email = prompt('Demo: Enter your Apple ID email:');
            if (!email) {
                reject(new Error('Sign-in cancelled'));
                return;
            }

            const name = prompt('Demo: Enter your name (optional):');
            resolve({
                email,
                name: name || null
            });
        });
    }

    // ============================================
    // TOKEN MANAGEMENT
    // ============================================

    generateToken(user) {
        // In production, this would be a JWT from your backend
        // For demo, we'll create a simple token
        const payload = {
            userId: user.id,
            email: user.email,
            iat: Date.now(),
            exp: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
        };
        return btoa(JSON.stringify(payload));
    }

    decodeToken(token) {
        try {
            return JSON.parse(atob(token));
        } catch (e) {
            return null;
        }
    }

    isTokenExpired() {
        if (!this.token) return true;
        
        const decoded = this.decodeToken(this.token);
        if (!decoded || !decoded.exp) return true;
        
        return Date.now() > decoded.exp;
    }

    // ============================================
    // USER MANAGEMENT
    // ============================================

    getAllUsers() {
        const saved = localStorage.getItem('studyBuddyUsers');
        return saved ? JSON.parse(saved) : [];
    }

    saveAllUsers(users) {
        localStorage.setItem('studyBuddyUsers', JSON.stringify(users));
    }

    isAuthenticated() {
        return this.user !== null && this.token !== null && !this.isTokenExpired();
    }

    getUser() {
        return this.user;
    }

    logout() {
        this.user = null;
        this.token = null;
        localStorage.removeItem(this.storageKey);
        console.log('[Auth] Logged out');
    }

    // ============================================
    // PASSWORD UTILITIES
    // ============================================

    async hashPassword(password) {
        // In production, use bcrypt on backend!
        // For demo, we'll use a simple hash
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

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    generateUserId() {
        return 'user_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // ============================================
    // PASSWORD RESET
    // ============================================

    async requestPasswordReset(email) {
        // In production, send reset email via backend
        console.log('[Auth] Password reset requested for:', email);
        return { success: true, message: 'Password reset link sent to your email' };
    }
}
