// Demo Data
const demoData = {
    user: {
        name: 'Alex',
        level: 15,
        xp: 750,
        maxXp: 1000,
        currentStreak: 5,
        longestStreak: 12,
        totalHours: 85,
        badges: 15,
        dailyGoal: 120, // minutes
        studiedToday: 96 // minutes
    },
    subjects: [
        { id: 1, name: 'Mathematics', color: '#3498DB', icon: '📘', hours: 25.5 },
        { id: 2, name: 'Biology', color: '#27AE60', icon: '📗', hours: 18.0 },
        { id: 3, name: 'History', color: '#E67E22', icon: '📙', hours: 12.5 },
        { id: 4, name: 'English', color: '#E74C3C', icon: '📕', hours: 15.0 },
        { id: 5, name: 'Chemistry', color: '#9B59B6', icon: '🧪', hours: 8.5 }
    ],
    schedule: [
        { id: 1, subject: 'Mathematics', teacher: 'Mr. Johnson', time: '9:00 - 10:30', icon: '📘' },
        { id: 2, subject: 'Biology', teacher: 'Dr. Smith', time: '10:45 - 12:15', icon: '📗' },
        { id: 3, subject: 'History', teacher: 'Ms. Davis', time: '1:00 - 2:15', icon: '📙' }
    ],
    assignments: [
        { id: 1, title: 'Math Problem Set', subject: 'Mathematics', due: 'Tomorrow', priority: 'high', icon: '📘' },
        { id: 2, title: 'Essay Draft', subject: 'English', due: 'Friday', priority: 'medium', icon: '📕' },
        { id: 3, title: 'Lab Report', subject: 'Chemistry', due: 'Next Week', priority: 'medium', icon: '🧪' }
    ],
    weeklyStats: [
        { day: 'M', hours: 2.0 },
        { day: 'T', hours: 2.5 },
        { day: 'W', hours: 1.5 },
        { day: 'T', hours: 2.0 },
        { day: 'F', hours: 1.5 },
        { day: 'S', hours: 1.0 },
        { day: 'S', hours: 0.8 }
    ]
};

// Screen Templates
const screens = {
    dashboard: `
        <div class="screen">
            <!-- Greeting Card -->
            <div class="card greeting-card">
                <div class="greeting">Good morning, ${demoData.user.name}! ☀️</div>
                <div class="streak-info">
                    <span>🔥</span>
                    <span>${demoData.user.currentStreak}-day streak</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${(demoData.user.studiedToday / demoData.user.dailyGoal) * 100}%"></div>
                </div>
                <div class="goal-text">
                    Daily Goal: ${Math.floor(demoData.user.studiedToday / 60)}h ${demoData.user.studiedToday % 60}m / ${Math.floor(demoData.user.dailyGoal / 60)}h (${Math.round((demoData.user.studiedToday / demoData.user.dailyGoal) * 100)}%)
                </div>
            </div>

            <!-- Today's Schedule -->
            <div class="card">
                <div class="card-header">Today's Schedule</div>
                ${demoData.schedule.map(item => `
                    <div class="schedule-item">
                        <span class="schedule-icon">${item.icon}</span>
                        <div class="schedule-details">
                            <div class="schedule-subject">${item.subject}</div>
                            <div class="schedule-time">${item.time} • ${item.teacher}</div>
                        </div>
                    </div>
                `).join('')}
                <button class="btn btn-secondary" style="margin-top: 12px;">
                    📅 View Full Schedule
                </button>
            </div>

            <!-- Upcoming Assignments -->
            <div class="card">
                <div class="card-header">Upcoming Assignments</div>
                ${demoData.assignments.map(item => `
                    <div class="assignment-item ${item.priority}-priority">
                        <span class="assignment-checkbox">☐</span>
                        <div class="assignment-details">
                            <div class="assignment-title">${item.title}</div>
                            <div class="assignment-meta">
                                <span>${item.icon} ${item.subject}</span>
                                <span>•</span>
                                <span>Due: ${item.due}</span>
                                <span class="priority-badge priority-${item.priority}">${item.priority.toUpperCase()}</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
                <button class="btn btn-secondary" style="margin-top: 12px;">
                    📝 View All Assignments
                </button>
            </div>

            <!-- Quick Actions -->
            <div class="quick-actions">
                <button class="quick-action-btn" onclick="navigateToScreen('study')">
                    <span class="quick-action-icon">▶️</span>
                    <span class="quick-action-label">Start Timer</span>
                </button>
                <button class="quick-action-btn" onclick="navigateToScreen('tasks')">
                    <span class="quick-action-icon">➕</span>
                    <span class="quick-action-label">Add Task</span>
                </button>
            </div>
        </div>
    `,
    
    study: `
        <div class="screen">
            <div class="screen-header">
                <div class="screen-title">Study Timer</div>
                <button class="icon-btn">⚙️</button>
            </div>

            <div class="card">
                <div class="timer-select">
                    <label>Select Subject</label>
                    <select>
                        ${demoData.subjects.map(s => `
                            <option value="${s.id}">${s.icon} ${s.name}</option>
                        `).join('')}
                    </select>
                </div>

                <div class="timer-mode-selector">
                    <div class="mode-option selected">
                        <div class="mode-radio"></div>
                        <div>
                            <div style="font-weight: 600;">Pomodoro (25/5)</div>
                            <div style="font-size: 13px; color: var(--medium-gray);">25 min work, 5 min break</div>
                        </div>
                    </div>
                    <div class="mode-option">
                        <div class="mode-radio"></div>
                        <div>
                            <div style="font-weight: 600;">Deep Focus (50/10)</div>
                            <div style="font-size: 13px; color: var(--medium-gray);">50 min work, 10 min break</div>
                        </div>
                    </div>
                    <div class="mode-option">
                        <div class="mode-radio"></div>
                        <div>
                            <div style="font-weight: 600;">Custom</div>
                            <div style="font-size: 13px; color: var(--medium-gray);">Set your own intervals</div>
                        </div>
                    </div>
                </div>

                <div class="timer-display">
                    <div class="timer-time">25:00</div>
                </div>

                <button class="btn btn-primary">
                    ▶️ Start Focus Session
                </button>

                <div class="motivation-box" style="margin-top: 16px;">
                    🎯 "Success is the sum of small efforts repeated day in and day out."
                </div>
            </div>

            <div class="card">
                <div class="card-header">Today's Progress</div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="font-size: 32px; font-weight: 700; color: var(--primary-blue);">
                            ${Math.floor(demoData.user.studiedToday / 60)}h ${demoData.user.studiedToday % 60}m
                        </div>
                        <div style="font-size: 14px; color: var(--medium-gray);">
                            Studied today
                        </div>
                    </div>
                    <div style="font-size: 48px;">
                        📚
                    </div>
                </div>
                <div class="progress-bar" style="margin-top: 16px;">
                    <div class="progress-fill" style="width: ${(demoData.user.studiedToday / demoData.user.dailyGoal) * 100}%; background: var(--success-green);"></div>
                </div>
                <div style="text-align: center; margin-top: 8px; font-size: 13px; color: var(--medium-gray);">
                    ${Math.round((demoData.user.studiedToday / demoData.user.dailyGoal) * 100)}% of daily goal
                </div>
            </div>
        </div>
    `,
    
    tasks: `
        <div class="screen">
            <div class="screen-header">
                <div class="screen-title">Tasks</div>
                <button class="icon-btn">➕</button>
            </div>

            <div class="card">
                <div class="card-header">Today (3)</div>
                <div class="assignment-item high-priority">
                    <span class="assignment-checkbox">☐</span>
                    <div class="assignment-details">
                        <div class="assignment-title">Buy notebooks</div>
                        <div class="assignment-meta">
                            <span class="priority-badge priority-high">HIGH</span>
                        </div>
                    </div>
                </div>
                <div class="assignment-item medium-priority">
                    <span class="assignment-checkbox">☐</span>
                    <div class="assignment-details">
                        <div class="assignment-title">Email advisor</div>
                        <div class="assignment-meta">
                            <span class="priority-badge priority-medium">MEDIUM</span>
                        </div>
                    </div>
                </div>
                <div class="assignment-item" style="opacity: 0.6; text-decoration: line-through;">
                    <span class="assignment-checkbox">☑️</span>
                    <div class="assignment-details">
                        <div class="assignment-title">Morning jog</div>
                        <div class="assignment-meta">
                            <span style="color: var(--success-green);">✓ Completed</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">Upcoming (2)</div>
                <div class="assignment-item medium-priority">
                    <span class="assignment-checkbox">☐</span>
                    <div class="assignment-details">
                        <div class="assignment-title">Library visit</div>
                        <div class="assignment-meta">
                            <span>Tomorrow</span>
                        </div>
                    </div>
                </div>
                <div class="assignment-item">
                    <span class="assignment-checkbox">☐</span>
                    <div class="assignment-details">
                        <div class="assignment-title">Group study meeting</div>
                        <div class="assignment-meta">
                            <span>Friday 3:00 PM</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card">
                <div style="text-align: center; padding: 8px;">
                    <div style="font-size: 14px; color: var(--medium-gray); margin-bottom: 8px;">
                        Progress: 1/5 completed today
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 20%; background: var(--warning-orange);"></div>
                    </div>
                </div>
            </div>

            <button class="btn btn-primary">
                ➕ Add New Task
            </button>
        </div>
    `,
    
    stats: `
        <div class="screen">
            <div class="screen-header">
                <div class="screen-title">Statistics</div>
                <button class="icon-btn">📅</button>
            </div>

            <div class="card">
                <div class="card-header">This Week</div>
                <div class="stat-card" style="box-shadow: none; padding: 16px 0;">
                    <div class="stat-value">12.3 hrs</div>
                    <div class="stat-label">Total Study Time</div>
                </div>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                    <div style="text-align: center;">
                        <div style="font-size: 24px; font-weight: 700; color: var(--success-green);">5/7</div>
                        <div style="font-size: 13px; color: var(--medium-gray);">Goals Met</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 24px; font-weight: 700; color: var(--purple);">12 days</div>
                        <div style="font-size: 13px; color: var(--medium-gray);">Current Streak</div>
                    </div>
                </div>
            </div>

            <div class="chart-container">
                <div class="chart-title">📊 Study Time by Day</div>
                <div class="bar-chart">
                    ${demoData.weeklyStats.map(stat => `
                        <div style="display: flex; flex-direction: column; align-items: center; flex: 1;">
                            <div class="bar-value">${stat.hours}h</div>
                            <div class="bar" style="height: ${(stat.hours / 3) * 100}%;"></div>
                            <div class="bar-label">${stat.day}</div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="chart-container">
                <div class="chart-title">📚 Time by Subject</div>
                <div class="subject-list">
                    ${demoData.subjects.map(subject => {
                        const maxHours = Math.max(...demoData.subjects.map(s => s.hours));
                        const percentage = (subject.hours / maxHours) * 100;
                        return `
                            <div class="subject-item">
                                <div class="subject-color" style="background: ${subject.color};">
                                    ${subject.icon}
                                </div>
                                <div class="subject-info">
                                    <div class="subject-name">${subject.name}</div>
                                    <div class="subject-progress">
                                        <div class="subject-progress-fill" style="width: ${percentage}%; background: ${subject.color};"></div>
                                    </div>
                                </div>
                                <div class="subject-hours">${subject.hours}h</div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>

            <div class="card" style="background: linear-gradient(135deg, var(--purple) 0%, var(--primary-blue) 100%); color: white; text-align: center;">
                <div style="font-size: 32px; margin-bottom: 8px;">🔒</div>
                <div style="font-weight: 600; margin-bottom: 8px;">Premium Feature</div>
                <div style="font-size: 14px; opacity: 0.9; margin-bottom: 16px;">
                    Unlock detailed analytics, historical data, and PDF reports
                </div>
                <button class="btn" style="background: white; color: var(--purple);">
                    ⭐ Upgrade to Premium
                </button>
            </div>
        </div>
    `,
    
    profile: `
        <div class="screen" style="padding: 0;">
            <div class="profile-header">
                <div class="profile-avatar">👤</div>
                <div class="profile-name">${demoData.user.name} Johnson</div>
                <div class="profile-level">Level ${demoData.user.level} Scholar</div>
                <div class="xp-progress">
                    <div class="xp-bar">
                        <div class="xp-fill" style="width: ${(demoData.user.xp / demoData.user.maxXp) * 100}%;"></div>
                    </div>
                    <div class="xp-text">${demoData.user.xp} / ${demoData.user.maxXp} XP</div>
                </div>
            </div>

            <div style="padding: 16px;">
                <div class="stats-grid">
                    <div class="stat-box">
                        <div class="stat-box-value">🔥 ${demoData.user.currentStreak}</div>
                        <div class="stat-box-label">Day Streak</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-box-value">🏆 ${demoData.user.badges}</div>
                        <div class="stat-box-label">Badges</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-box-value">📚 ${demoData.user.totalHours}</div>
                        <div class="stat-box-label">Hours</div>
                    </div>
                </div>

                <div class="settings-section">
                    <div class="section-title">Account</div>
                    <div class="settings-list">
                        <div class="settings-item">
                            <span class="settings-icon">👤</span>
                            <span class="settings-label">Edit Profile</span>
                            <span class="settings-arrow">›</span>
                        </div>
                        <div class="settings-item">
                            <span class="settings-icon">🎓</span>
                            <span class="settings-label">Grade Level</span>
                            <span class="settings-value">11th Grade</span>
                            <span class="settings-arrow">›</span>
                        </div>
                        <div class="settings-item">
                            <span class="settings-icon">🔔</span>
                            <span class="settings-label">Notifications</span>
                            <span class="settings-arrow">›</span>
                        </div>
                        <div class="settings-item">
                            <span class="settings-icon">🔒</span>
                            <span class="settings-label">Privacy</span>
                            <span class="settings-arrow">›</span>
                        </div>
                    </div>
                </div>

                <div class="settings-section">
                    <div class="section-title">Preferences</div>
                    <div class="settings-list">
                        <div class="settings-item">
                            <span class="settings-icon">🎨</span>
                            <span class="settings-label">Theme</span>
                            <span class="settings-value">Light Mode</span>
                            <span class="settings-arrow">›</span>
                        </div>
                        <div class="settings-item">
                            <span class="settings-icon">🎯</span>
                            <span class="settings-label">Daily Goal</span>
                            <span class="settings-value">2 hours</span>
                            <span class="settings-arrow">›</span>
                        </div>
                        <div class="settings-item">
                            <span class="settings-icon">🔊</span>
                            <span class="settings-label">Sounds</span>
                            <span class="settings-value">ON</span>
                            <span class="settings-arrow">›</span>
                        </div>
                    </div>
                </div>

                <div class="settings-section">
                    <div class="section-title">App</div>
                    <div class="settings-list">
                        <div class="settings-item">
                            <span class="settings-icon">⭐</span>
                            <span class="settings-label">Rate App</span>
                            <span class="settings-arrow">›</span>
                        </div>
                        <div class="settings-item">
                            <span class="settings-icon">💎</span>
                            <span class="settings-label">Upgrade to Premium</span>
                            <span class="settings-arrow">›</span>
                        </div>
                        <div class="settings-item">
                            <span class="settings-icon">📖</span>
                            <span class="settings-label">Help & Tutorial</span>
                            <span class="settings-arrow">›</span>
                        </div>
                        <div class="settings-item">
                            <span class="settings-icon">📧</span>
                            <span class="settings-label">Contact Support</span>
                            <span class="settings-arrow">›</span>
                        </div>
                        <div class="settings-item">
                            <span class="settings-icon">ℹ️</span>
                            <span class="settings-label">About</span>
                            <span class="settings-value">v1.0.0</span>
                            <span class="settings-arrow">›</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
};

// Navigation Logic
let currentScreen = 'dashboard';

function navigateToScreen(screenName) {
    // Update current screen
    currentScreen = screenName;
    
    // Update app container
    const appContainer = document.getElementById('app-container');
    appContainer.innerHTML = screens[screenName];
    
    // Update nav buttons
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        if (item.dataset.screen === screenName) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    // Scroll to top
    appContainer.scrollTop = 0;
}

// Initialize App
function initApp() {
    // Load dashboard initially
    navigateToScreen('dashboard');
    
    // Add nav click listeners
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navigateToScreen(item.dataset.screen);
        });
    });
    
    // Add reset button listener
    const resetBtn = document.getElementById('reset-demo');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            navigateToScreen('dashboard');
            alert('Demo reset! 🔄');
        });
    }
    
    // Add interactivity to mode options
    document.addEventListener('click', (e) => {
        if (e.target.closest('.mode-option')) {
            const modeOptions = document.querySelectorAll('.mode-option');
            modeOptions.forEach(opt => opt.classList.remove('selected'));
            e.target.closest('.mode-option').classList.add('selected');
        }
    });
}

// Run on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Export for debugging
window.demoData = demoData;
window.navigateToScreen = navigateToScreen;
