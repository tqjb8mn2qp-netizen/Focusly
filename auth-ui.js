// Authentication UI Integration
// Adds sign-in/sign-up screens and manages authentication flow

class AuthUI {
    constructor(authManager, app) {
        this.auth = authManager;
        this.app = app;
        this.currentView = 'signin'; // 'signin', 'signup', 'forgot'
    }

    // Check if user needs to authenticate
    checkAuth() {
        if (!this.auth.isAuthenticated()) {
            this.showAuthScreen();
            return false;
        }
        return true;
    }

    // Show authentication screen
    showAuthScreen() {
        const container = document.getElementById('app-container');
        if (!container) return;

        // Hide bottom nav and FAB
        const bottomNav = document.querySelector('.bottom-nav');
        const fab = document.querySelector('.fab');
        if (bottomNav) bottomNav.style.display = 'none';
        if (fab) fab.style.display = 'none';

        // Show auth screen
        container.innerHTML = this.renderAuthScreen();
        
        // Set up event listeners
        this.attachAuthListeners();
    }

    // Render authentication screen
    renderAuthScreen() {
        if (this.currentView === 'signup') {
            return this.renderSignUp();
        } else if (this.currentView === 'forgot') {
            return this.renderForgotPassword();
        } else {
            return this.renderSignIn();
        }
    }

    // Render Sign In screen
    renderSignIn() {
        return `
            <div class="auth-screen">
                <div class="auth-container">
                    <div class="auth-logo">
                        <svg class="auth-logo-icon-svg" width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="32" cy="32" r="32" fill="url(#grad1)"/>
                            <defs>
                                <linearGradient id="grad1" x1="0" y1="0" x2="64" y2="64">
                                    <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                                    <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
                                </linearGradient>
                            </defs>
                            <path d="M20 24 h24 v16 h-24 z" fill="white" opacity="0.9"/>
                            <circle cx="44" cy="20" r="8" fill="#F5A623" opacity="0.95"/>
                            <path d="M40 20 h8 M44 16 v8" stroke="white" stroke-width="2" stroke-linecap="round"/>
                            <path d="M26 30 h12 M26 35 h8" stroke="#4A90E2" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                        <h1 class="auth-logo-text">Study Buddy</h1>
                        <p class="auth-logo-tagline">Your Smart Study Companion</p>
                    </div>

                    <h2 class="auth-title">Welcome Back!</h2>
                    <p class="auth-subtitle">Sign in to continue your study journey</p>

                    <form class="auth-form" id="signin-form" onsubmit="return false;">
                        <div class="auth-input-group">
                            <label class="auth-label" for="signin-email">Email</label>
                            <input 
                                type="email" 
                                id="signin-email" 
                                class="auth-input" 
                                placeholder="your.email@example.com"
                                required
                                autocomplete="email"
                            >
                        </div>

                        <div class="auth-input-group">
                            <label class="auth-label" for="signin-password">Password</label>
                            <input 
                                type="password" 
                                id="signin-password" 
                                class="auth-input" 
                                placeholder="Enter your password"
                                required
                                autocomplete="current-password"
                            >
                        </div>

                        <div class="auth-forgot">
                            <a href="#" onclick="authUI.switchView('forgot'); return false;">Forgot password?</a>
                        </div>

                        <div id="signin-error" class="auth-error" style="display: none;"></div>

                        <button type="submit" class="auth-button" id="signin-button">
                            Sign In
                        </button>
                    </form>

                    <div class="auth-divider">or continue with</div>

                    <div class="auth-social-buttons">
                        <button class="auth-social-button google" id="google-signin">
                            <svg class="auth-social-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            <span>Continue with Google</span>
                        </button>
                        <button class="auth-social-button apple" id="apple-signin">
                            <svg class="auth-social-icon" width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.09l-.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                            </svg>
                            <span>Continue with Apple</span>
                        </button>
                    </div>

                    <div class="auth-footer">
                        Don't have an account? 
                        <a href="#" class="auth-link" onclick="authUI.switchView('signup'); return false;">Sign up</a>
                    </div>
                </div>
            </div>
        `;
    }

    // Render Sign Up screen
    renderSignUp() {
        return `
            <div class="auth-screen">
                <div class="auth-container">
                    <div class="auth-logo">
                        <svg class="auth-logo-icon-svg" width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="32" cy="32" r="32" fill="url(#grad2)"/>
                            <defs>
                                <linearGradient id="grad2" x1="0" y1="0" x2="64" y2="64">
                                    <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                                    <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
                                </linearGradient>
                            </defs>
                            <path d="M20 24 h24 v16 h-24 z" fill="white" opacity="0.9"/>
                            <circle cx="44" cy="20" r="8" fill="#F5A623" opacity="0.95"/>
                            <path d="M40 20 h8 M44 16 v8" stroke="white" stroke-width="2" stroke-linecap="round"/>
                            <path d="M26 30 h12 M26 35 h8" stroke="#4A90E2" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                        <h1 class="auth-logo-text">Study Buddy</h1>
                        <p class="auth-logo-tagline">Your Smart Study Companion</p>
                    </div>

                    <h2 class="auth-title">Create Account</h2>
                    <p class="auth-subtitle">Join thousands of students studying smarter</p>

                    <form class="auth-form" id="signup-form" onsubmit="return false;">
                        <div class="auth-input-group">
                            <label class="auth-label" for="signup-name">Full Name</label>
                            <input 
                                type="text" 
                                id="signup-name" 
                                class="auth-input" 
                                placeholder="John Doe"
                                required
                                autocomplete="name"
                            >
                        </div>

                        <div class="auth-input-group">
                            <label class="auth-label" for="signup-email">Email</label>
                            <input 
                                type="email" 
                                id="signup-email" 
                                class="auth-input" 
                                placeholder="your.email@example.com"
                                required
                                autocomplete="email"
                            >
                        </div>

                        <div class="auth-input-group">
                            <label class="auth-label" for="signup-password">Password</label>
                            <input 
                                type="password" 
                                id="signup-password" 
                                class="auth-input" 
                                placeholder="At least 6 characters"
                                required
                                autocomplete="new-password"
                            >
                        </div>

                        <div class="auth-checkbox-group">
                            <input type="checkbox" id="terms-checkbox" class="auth-checkbox" required>
                            <label for="terms-checkbox">
                                I agree to the <a href="/privacy.html" target="_blank" class="auth-link">Privacy Policy</a>
                            </label>
                        </div>

                        <div id="signup-error" class="auth-error" style="display: none;"></div>

                        <button type="submit" class="auth-button" id="signup-button">
                            Create Account
                        </button>
                    </form>

                    <div class="auth-divider">or sign up with</div>

                    <div class="auth-social-buttons">
                        <button class="auth-social-button google" id="google-signup">
                            <svg class="auth-social-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            <span>Continue with Google</span>
                        </button>
                        <button class="auth-social-button apple" id="apple-signup">
                            <svg class="auth-social-icon" width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.09l-.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                            </svg>
                            <span>Continue with Apple</span>
                        </button>
                    </div>

                    <div class="auth-footer">
                        Already have an account? 
                        <a href="#" class="auth-link" onclick="authUI.switchView('signin'); return false;">Sign in</a>
                    </div>
                </div>
            </div>
        `;
    }

    // Render Forgot Password screen
    renderForgotPassword() {
        return `
            <div class="auth-screen">
                <div class="auth-container">
                    <div class="auth-logo">
                        <svg class="auth-logo-icon-svg" width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="32" cy="32" r="32" fill="url(#grad3)"/>
                            <defs>
                                <linearGradient id="grad3" x1="0" y1="0" x2="64" y2="64">
                                    <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                                    <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
                                </linearGradient>
                            </defs>
                            <!-- Key Icon -->
                            <path d="M38 20 a6 6 0 1 1 0 12 a6 6 0 0 1 0 -12" fill="#F5A623" opacity="0.95"/>
                            <rect x="20" y="27" width="18" height="6" rx="1" fill="#F5A623" opacity="0.95"/>
                            <rect x="20" y="30" width="4" height="8" fill="#F5A623" opacity="0.95"/>
                            <rect x="28" y="30" width="4" height="8" fill="#F5A623" opacity="0.95"/>
                        </svg>
                    </div>

                    <h2 class="auth-title">Reset Password</h2>
                    <p class="auth-subtitle">Enter your email to receive a reset link</p>

                    <form class="auth-form" id="forgot-form" onsubmit="return false;">
                        <div class="auth-input-group">
                            <label class="auth-label" for="forgot-email">Email</label>
                            <input 
                                type="email" 
                                id="forgot-email" 
                                class="auth-input" 
                                placeholder="your.email@example.com"
                                required
                            >
                        </div>

                        <div id="forgot-error" class="auth-error" style="display: none;"></div>
                        <div id="forgot-success" style="display: none; color: #7ED321; font-size: 14px; margin-top: 8px;"></div>

                        <button type="submit" class="auth-button" id="forgot-button">
                            Send Reset Link
                        </button>
                    </form>

                    <div class="auth-footer">
                        Remember your password? 
                        <a href="#" class="auth-link" onclick="authUI.switchView('signin'); return false;">Sign in</a>
                    </div>
                </div>
            </div>
        `;
    }

    // Switch between auth views
    switchView(view) {
        this.currentView = view;
        this.showAuthScreen();
    }

    // Attach event listeners
    attachAuthListeners() {
        // Sign In form
        const signinForm = document.getElementById('signin-form');
        if (signinForm) {
            signinForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSignIn();
            });
        }

        // Sign Up form
        const signupForm = document.getElementById('signup-form');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSignUp();
            });
        }

        // Forgot Password form
        const forgotForm = document.getElementById('forgot-form');
        if (forgotForm) {
            forgotForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleForgotPassword();
            });
        }

        // Google Sign-In buttons
        const googleButtons = document.querySelectorAll('#google-signin, #google-signup');
        googleButtons.forEach(btn => {
            btn.addEventListener('click', () => this.handleGoogleSignIn());
        });

        // Apple Sign-In buttons
        const appleButtons = document.querySelectorAll('#apple-signin, #apple-signup');
        appleButtons.forEach(btn => {
            btn.addEventListener('click', () => this.handleAppleSignIn());
        });
    }

    // Handle Sign In
    async handleSignIn() {
        const email = document.getElementById('signin-email').value;
        const password = document.getElementById('signin-password').value;
        const button = document.getElementById('signin-button');
        const errorDiv = document.getElementById('signin-error');

        // Show loading
        button.disabled = true;
        button.innerHTML = '<span class="auth-loading"></span>';
        errorDiv.style.display = 'none';

        // Attempt sign in
        const result = await this.auth.signInWithEmail(email, password);

        if (result.success) {
            this.onAuthSuccess(result.user);
        } else {
            errorDiv.textContent = result.error;
            errorDiv.style.display = 'block';
            button.disabled = false;
            button.textContent = 'Sign In';
        }
    }

    // Handle Sign Up
    async handleSignUp() {
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const termsAccepted = document.getElementById('terms-checkbox').checked;
        const button = document.getElementById('signup-button');
        const errorDiv = document.getElementById('signup-error');

        if (!termsAccepted) {
            errorDiv.textContent = 'Please accept the Privacy Policy';
            errorDiv.style.display = 'block';
            return;
        }

        // Show loading
        button.disabled = true;
        button.innerHTML = '<span class="auth-loading"></span>';
        errorDiv.style.display = 'none';

        // Attempt sign up
        const result = await this.auth.signUpWithEmail(email, password, name);

        if (result.success) {
            this.onAuthSuccess(result.user);
        } else {
            errorDiv.textContent = result.error;
            errorDiv.style.display = 'block';
            button.disabled = false;
            button.textContent = 'Create Account';
        }
    }

    // Handle Google Sign In
    async handleGoogleSignIn() {
        const result = await this.auth.signInWithGoogle();
        if (result.success) {
            this.onAuthSuccess(result.user);
        } else {
            alert('Google sign-in failed: ' + result.error);
        }
    }

    // Handle Apple Sign In
    async handleAppleSignIn() {
        const result = await this.auth.signInWithApple();
        if (result.success) {
            this.onAuthSuccess(result.user);
        } else {
            alert('Apple sign-in failed: ' + result.error);
        }
    }

    // Handle Forgot Password
    async handleForgotPassword() {
        const email = document.getElementById('forgot-email').value;
        const button = document.getElementById('forgot-button');
        const errorDiv = document.getElementById('forgot-error');
        const successDiv = document.getElementById('forgot-success');

        button.disabled = true;
        button.innerHTML = '<span class="auth-loading"></span>';
        errorDiv.style.display = 'none';
        successDiv.style.display = 'none';

        const result = await this.auth.requestPasswordReset(email);

        if (result.success) {
            successDiv.textContent = result.message;
            successDiv.style.display = 'block';
            setTimeout(() => {
                this.switchView('signin');
            }, 3000);
        } else {
            errorDiv.textContent = result.error;
            errorDiv.style.display = 'block';
        }

        button.disabled = false;
        button.textContent = 'Send Reset Link';
    }

    // On successful authentication
    onAuthSuccess(user) {
        console.log('[Auth] Authentication successful:', user);
        
        // Update user data in app
        if (this.app && this.app.dm) {
            this.app.dm.updateUser({
                name: user.name,
                email: user.email
            });
        }

        // Show success toast
        if (this.app && this.app.ui) {
            this.app.ui.showToast(`🎉 Welcome ${user.name}!`);
        }

        // Navigate to main app
        setTimeout(() => {
            // Show bottom nav and FAB
            const bottomNav = document.querySelector('.bottom-nav');
            const fab = document.querySelector('.fab');
            if (bottomNav) bottomNav.style.display = 'flex';
            if (fab) fab.style.display = 'block';

            // Navigate to dashboard
            if (this.app) {
                this.app.navigateToScreen('dashboard');
            }
        }, 1000);
    }

    // Add logout button to profile screen
    addLogoutButton() {
        // This will be called from profile screen rendering
        return `
            <button class="btn btn-secondary" onclick="authUI.handleLogout()" style="margin-top: 16px;">
                🚪 Sign Out
            </button>
        `;
    }

    // Handle logout
    handleLogout() {
        if (confirm('Are you sure you want to sign out?')) {
            this.auth.logout();
            this.showAuthScreen();
        }
    }
}

// Initialize Auth globally
let authUI;
