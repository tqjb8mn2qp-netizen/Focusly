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
                        <div class="auth-logo-icon">🎓</div>
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
                            <span class="auth-social-icon">🔵</span>
                            <span>Continue with Google</span>
                        </button>
                        <button class="auth-social-button apple" id="apple-signin">
                            <span class="auth-social-icon">🍎</span>
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
                        <div class="auth-logo-icon">🎓</div>
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
                            <span class="auth-social-icon">🔵</span>
                            <span>Continue with Google</span>
                        </button>
                        <button class="auth-social-button apple" id="apple-signup">
                            <span class="auth-social-icon">🍎</span>
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
                        <div class="auth-logo-icon">🔑</div>
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
