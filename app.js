// ============================================
// STUDY BUDDY - FULL FUNCTIONAL WEB APP
// ============================================

// ============================================
// DATA MODELS & STORAGE
// ============================================

class DataManager {
    constructor() {
        this.storageKey = 'studyBuddyData';
        this.initializeData();
    }

    initializeData() {
        const stored = localStorage.getItem(this.storageKey);
        if (!stored) {
            // First-time setup with demo data
            this.data = this.getDefaultData();
            this.save();
        } else {
            this.data = JSON.parse(stored);
        }
    }

    getDefaultData() {
        return {
            user: {
                name: 'Student',
                level: 1,
                xp: 0,
                maxXp: 100,
                currentStreak: 0,
                longestStreak: 0,
                totalStudyMinutes: 0,
                badges: [],
                dailyGoalMinutes: 120,
                gradeLevel: '11th Grade',
                createdAt: new Date().toISOString(),
                lastLoginDate: new Date().toDateString()
            },
            timerPreferences: {
                mode: 'pomodoro',
                customWorkMinutes: 25,
                customBreakMinutes: 5
            },
            subjects: [
                { id: this.generateId(), name: 'Mathematics', color: '#3498DB', icon: '📘', totalMinutes: 0 },
                { id: this.generateId(), name: 'Biology', color: '#27AE60', icon: '📗', totalMinutes: 0 },
                { id: this.generateId(), name: 'History', color: '#E67E22', icon: '📙', totalMinutes: 0 },
                { id: this.generateId(), name: 'English', color: '#E74C3C', icon: '📕', totalMinutes: 0 },
                { id: this.generateId(), name: 'Chemistry', color: '#9B59B6', icon: '🧪', totalMinutes: 0 }
            ],
            schedule: [],
            assignments: [],
            tasks: [],
            studySessions: [],
            dailyLogs: []
        };
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    save() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    }

    // User operations
    updateUser(updates) {
        this.data.user = { ...this.data.user, ...updates };
        this.save();
    }
    
    // Timer preferences
    updateTimerPreferences(updates) {
        if (!this.data.timerPreferences) {
            this.data.timerPreferences = { mode: 'pomodoro', customWorkMinutes: 25, customBreakMinutes: 5 };
        }
        this.data.timerPreferences = { ...this.data.timerPreferences, ...updates };
        this.save();
    }
    
    getTimerPreferences() {
        if (!this.data.timerPreferences) {
            this.data.timerPreferences = { mode: 'pomodoro', customWorkMinutes: 25, customBreakMinutes: 5 };
        }
        return this.data.timerPreferences;
    }

    // Subject operations
    addSubject(name, color, icon) {
        const subject = {
            id: this.generateId(),
            name,
            color,
            icon,
            totalMinutes: 0
        };
        this.data.subjects.push(subject);
        this.save();
        return subject;
    }

    getSubject(id) {
        return this.data.subjects.find(s => s.id === id);
    }

    // Category definitions
    getCategories() {
        return {
            homework: { icon: '📝', color: '#4A90E2', label: 'Homework', weight: 10 },
            quiz: { icon: '📋', color: '#F5A623', label: 'Quiz', weight: 20 },
            exam: { icon: '📚', color: '#D0021B', label: 'Exam', weight: 50 },
            project: { icon: '🎯', color: '#9013FE', label: 'Project', weight: 30 }
        };
    }

    getDefaultWeight(type) {
        const categories = this.getCategories();
        return categories[type]?.weight || 10;
    }

    getCategoryInfo(type) {
        const categories = this.getCategories();
        return categories[type] || categories.homework;
    }

    // Assignment operations
    addAssignment(title, subjectId, dueDate, priority, description = '', type = 'homework') {
        const assignment = {
            id: this.generateId(),
            title,
            subjectId,
            dueDate: new Date(dueDate).toISOString(),
            priority,
            description,
            type, // NEW: homework, quiz, exam, project
            grade: null, // NEW: for grade tracking
            weight: this.getDefaultWeight(type), // NEW
            completed: false,
            createdAt: new Date().toISOString()
        };
        this.data.assignments.push(assignment);
        this.save();
        return assignment;
    }

    toggleAssignment(id) {
        const assignment = this.data.assignments.find(a => a.id === id);
        if (assignment) {
            assignment.completed = !assignment.completed;
            if (assignment.completed) {
                assignment.completedAt = new Date().toISOString();
                this.addXP(20);
            } else {
                delete assignment.completedAt;
            }
            this.save();
        }
        return assignment;
    }

    deleteAssignment(id) {
        this.data.assignments = this.data.assignments.filter(a => a.id !== id);
        this.save();
    }

    // Grade operations
    addGrade(assignmentId, score, maxScore = 100) {
        const assignment = this.data.assignments.find(a => a.id === assignmentId);
        if (assignment) {
            assignment.grade = {
                score,
                maxScore,
                percentage: (score / maxScore) * 100,
                dateGraded: new Date().toISOString()
            };
            this.save();
            this.updateSubjectGrade(assignment.subjectId);
        }
        return assignment;
    }

    updateSubjectGrade(subjectId) {
        const subject = this.getSubject(subjectId);
        if (!subject) return;

        const gradedAssignments = this.data.assignments.filter(a => 
            a.subjectId === subjectId && a.grade && a.completed
        );

        if (gradedAssignments.length === 0) {
            subject.currentGrade = null;
            return;
        }

        // Calculate weighted average
        let totalWeightedScore = 0;
        let totalWeight = 0;

        gradedAssignments.forEach(a => {
            totalWeightedScore += a.grade.percentage * a.weight;
            totalWeight += a.weight;
        });

        subject.currentGrade = totalWeight > 0 ? totalWeightedScore / totalWeight : null;
        this.save();
    }

    calculateGPA() {
        const subjectsWithGrades = this.data.subjects.filter(s => s.currentGrade != null);
        if (subjectsWithGrades.length === 0) return null;

        const totalGPA = subjectsWithGrades.reduce((sum, s) => {
            return sum + this.percentageToGPA(s.currentGrade);
        }, 0);

        return (totalGPA / subjectsWithGrades.length).toFixed(2);
    }

    percentageToGPA(percentage) {
        if (percentage >= 97) return 4.0;
        if (percentage >= 93) return 4.0;
        if (percentage >= 90) return 3.7;
        if (percentage >= 87) return 3.3;
        if (percentage >= 83) return 3.0;
        if (percentage >= 80) return 2.7;
        if (percentage >= 77) return 2.3;
        if (percentage >= 73) return 2.0;
        if (percentage >= 70) return 1.7;
        if (percentage >= 67) return 1.3;
        if (percentage >= 65) return 1.0;
        return 0.0;
    }

    getLetterGrade(percentage) {
        if (percentage >= 97) return 'A+';
        if (percentage >= 93) return 'A';
        if (percentage >= 90) return 'A-';
        if (percentage >= 87) return 'B+';
        if (percentage >= 83) return 'B';
        if (percentage >= 80) return 'B-';
        if (percentage >= 77) return 'C+';
        if (percentage >= 73) return 'C';
        if (percentage >= 70) return 'C-';
        if (percentage >= 67) return 'D+';
        if (percentage >= 65) return 'D';
        return 'F';
    }

    // Task operations
    addTask(title, dueDate, priority = 'medium') {
        const task = {
            id: this.generateId(),
            title,
            dueDate: dueDate ? new Date(dueDate).toISOString() : null,
            priority,
            completed: false,
            createdAt: new Date().toISOString()
        };
        this.data.tasks.push(task);
        this.save();
        return task;
    }

    toggleTask(id) {
        const task = this.data.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            if (task.completed) {
                task.completedAt = new Date().toISOString();
                this.addXP(5);
            } else {
                delete task.completedAt;
            }
            this.save();
        }
        return task;
    }

    deleteTask(id) {
        this.data.tasks = this.data.tasks.filter(t => t.id !== id);
        this.save();
    }

    // Study session operations
    addStudySession(subjectId, durationMinutes) {
        const session = {
            id: this.generateId(),
            subjectId,
            durationMinutes,
            date: new Date().toISOString(),
            completedAt: new Date().toISOString()
        };
        
        this.data.studySessions.push(session);
        
        // Update subject total
        const subject = this.getSubject(subjectId);
        if (subject) {
            subject.totalMinutes += durationMinutes;
        }
        
        // Update user total
        this.data.user.totalStudyMinutes += durationMinutes;
        
        // Update daily log
        this.updateDailyLog(durationMinutes);
        
        // Add XP
        this.addXP(10);
        
        this.save();
        return session;
    }

    updateDailyLog(minutes) {
        const today = new Date().toDateString();
        let log = this.data.dailyLogs.find(l => l.date === today);
        
        if (!log) {
            log = {
                date: today,
                studyMinutes: 0,
                goalMet: false
            };
            this.data.dailyLogs.push(log);
        }
        
        log.studyMinutes += minutes;
        log.goalMet = log.studyMinutes >= this.data.user.dailyGoalMinutes;
        
        this.updateStreak();
    }

    updateStreak() {
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        
        const todayLog = this.data.dailyLogs.find(l => l.date === today);
        const yesterdayLog = this.data.dailyLogs.find(l => l.date === yesterday);
        
        if (todayLog && todayLog.studyMinutes > 0) {
            if (this.data.user.lastLoginDate !== today) {
                if (yesterdayLog && yesterdayLog.studyMinutes > 0) {
                    this.data.user.currentStreak++;
                } else if (this.data.user.lastLoginDate !== yesterday) {
                    this.data.user.currentStreak = 1;
                }
            }
            
            if (this.data.user.currentStreak > this.data.user.longestStreak) {
                this.data.user.longestStreak = this.data.user.currentStreak;
            }
        }
        
        this.data.user.lastLoginDate = today;
    }

    getTodayStudyMinutes() {
        const today = new Date().toDateString();
        const log = this.data.dailyLogs.find(l => l.date === today);
        return log ? log.studyMinutes : 0;
    }

    getWeeklyStats() {
        const stats = [];
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(Date.now() - i * 86400000);
            const dateStr = date.toDateString();
            const dayName = days[date.getDay()];
            
            const log = this.data.dailyLogs.find(l => l.date === dateStr);
            const minutes = log ? log.studyMinutes : 0;
            
            stats.push({
                day: dayName,
                hours: (minutes / 60).toFixed(1),
                minutes: minutes
            });
        }
        
        return stats;
    }

    // XP and Leveling
    addXP(amount) {
        this.data.user.xp += amount;
        
        while (this.data.user.xp >= this.data.user.maxXp) {
            this.data.user.xp -= this.data.user.maxXp;
            this.data.user.level++;
            this.data.user.maxXp = Math.floor(this.data.user.maxXp * 1.2);
            this.showNotification(`🎉 Level Up! You're now level ${this.data.user.level}!`);
        }
    }

    showNotification(message) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Study Buddy', { body: message, icon: '📚' });
        }
    }

    // Clear all data (for testing)
    clearAllData() {
        localStorage.removeItem(this.storageKey);
        this.initializeData();
    }

    exportData() {
        return JSON.stringify(this.data, null, 2);
    }

    importData(jsonString) {
        try {
            this.data = JSON.parse(jsonString);
            this.save();
            return true;
        } catch (e) {
            return false;
        }
    }
}

// ============================================
// TIMER CLASS
// ============================================

class PomodoroTimer {
    constructor(onTick, onComplete) {
        this.onTick = onTick;
        this.onComplete = onComplete;
        this.isRunning = false;
        this.isPaused = false;
        this.timeLeft = 25 * 60; // seconds
        this.totalTime = 25 * 60;
        this.interval = null;
        this.mode = 'pomodoro'; // pomodoro, deepFocus, custom
        this.sessionCount = 0;
        this.customWorkMinutes = 25; // NEW: custom work duration
        this.customBreakMinutes = 5; // NEW: custom break duration
    }

    setMode(mode) {
        this.mode = mode;
        switch(mode) {
            case 'pomodoro':
                this.timeLeft = 25 * 60;
                this.totalTime = 25 * 60;
                break;
            case 'deepFocus':
                this.timeLeft = 50 * 60;
                this.totalTime = 50 * 60;
                break;
            case 'custom':
                // Use custom work minutes
                this.timeLeft = this.customWorkMinutes * 60;
                this.totalTime = this.customWorkMinutes * 60;
                break;
        }
    }

    setCustomTime(minutes) {
        this.timeLeft = minutes * 60;
        this.totalTime = minutes * 60;
    }
    
    setCustomWork(minutes) {
        this.customWorkMinutes = minutes;
        if (this.mode === 'custom' && !this.isRunning && !this.isPaused) {
            this.setCustomTime(minutes);
        }
    }
    
    setCustomBreak(minutes) {
        this.customBreakMinutes = minutes;
    }

    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.isPaused = false;
        
        this.interval = setInterval(() => {
            if (this.timeLeft > 0) {
                this.timeLeft--;
                this.onTick(this.timeLeft, this.totalTime);
            } else {
                this.complete();
            }
        }, 1000);
    }

    pause() {
        this.isPaused = true;
        clearInterval(this.interval);
        this.isRunning = false;
    }

    resume() {
        if (this.isPaused) {
            this.isPaused = false;
            this.start();
        }
    }

    stop() {
        this.isRunning = false;
        this.isPaused = false;
        clearInterval(this.interval);
        this.timeLeft = this.totalTime;
        this.onTick(this.timeLeft, this.totalTime);
    }

    complete() {
        this.stop();
        this.sessionCount++;
        const minutes = Math.floor(this.totalTime / 60);
        this.onComplete(minutes);
    }

    formatTime() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    getProgress() {
        return ((this.totalTime - this.timeLeft) / this.totalTime) * 100;
    }
}

// ============================================
// UI RENDERER
// ============================================

class UIRenderer {
    constructor(dataManager) {
        this.dm = dataManager;
        this.currentScreen = 'dashboard';
        this.timer = new PomodoroTimer(
            (timeLeft, totalTime) => this.updateTimerDisplay(timeLeft, totalTime),
            (minutes) => this.onTimerComplete(minutes)
        );
        this.selectedSubjectId = null;
    }

    updateTimerDisplay(timeLeft, totalTime) {
        const display = document.querySelector('.timer-time');
        if (display) {
            display.textContent = this.timer.formatTime();
        }
        
        const progress = this.timer.getProgress();
        const circle = document.querySelector('.timer-display');
        if (circle) {
            circle.style.background = `conic-gradient(
                var(--teal) ${progress}%, 
                rgba(74,144,226,0.2) ${progress}%
            )`;
        }
    }

    onTimerComplete(minutes) {
        // Save study session
        if (this.selectedSubjectId) {
            this.dm.addStudySession(this.selectedSubjectId, minutes);
        }
        
        // Show notification
        this.showToast(`🎉 Great work! You studied for ${minutes} minutes!`);
        
        // Request notification permission if not granted
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
        
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Study Session Complete!', {
                body: `Great work! You studied for ${minutes} minutes.`,
                icon: '🎉'
            });
        }
        
        // Refresh current screen
        this.render(this.currentScreen);
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 60px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--success-green);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 1000;
            animation: slideInDown 0.3s ease-out;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    getGreeting() {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    }

    renderDashboard() {
        const user = this.dm.data.user;
        const todayMinutes = this.dm.getTodayStudyMinutes();
        const goalProgress = (todayMinutes / user.dailyGoalMinutes) * 100;
        
        // Get today's assignments (next 3)
        const upcomingAssignments = this.dm.data.assignments
            .filter(a => !a.completed)
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
            .slice(0, 3);

        return `
            <div class="screen">
                <!-- Greeting Card -->
                <div class="card greeting-card">
                    <div class="greeting">${this.getGreeting()}, ${user.name}! ${this.getGreeting().includes('morning') ? '☀️' : this.getGreeting().includes('afternoon') ? '🌤️' : '🌙'}</div>
                    <div class="streak-info">
                        <span>🔥</span>
                        <span>${user.currentStreak}-day streak</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${Math.min(goalProgress, 100)}%"></div>
                    </div>
                    <div class="goal-text">
                        Daily Goal: ${Math.floor(todayMinutes / 60)}h ${todayMinutes % 60}m / ${Math.floor(user.dailyGoalMinutes / 60)}h ${user.dailyGoalMinutes % 60}m (${Math.round(goalProgress)}%)
                    </div>
                </div>

                <!-- Upcoming Assignments -->
                <div class="card">
                    <div class="card-header">Upcoming Assignments (${upcomingAssignments.length})</div>
                    ${upcomingAssignments.length > 0 ? upcomingAssignments.map(assignment => {
                        const subject = this.dm.getSubject(assignment.subjectId);
                        const categoryInfo = this.dm.getCategoryInfo(assignment.type || 'homework');
                        const dueDate = new Date(assignment.dueDate);
                        const daysUntil = Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24));
                        const dueText = daysUntil === 0 ? 'Today' : 
                                       daysUntil === 1 ? 'Tomorrow' : 
                                       daysUntil < 0 ? 'Overdue' :
                                       `${daysUntil} days`;
                        
                        const priorityColor = assignment.priority === 'high' ? '#D0021B' : 
                                            assignment.priority === 'medium' ? '#F5A623' : '#7ED321';
                        
                        return `
                            <div class="assignment-item ${assignment.priority}-priority" onclick="app.toggleAssignment('${assignment.id}')" style="border-left: 4px solid ${priorityColor};">
                                <span class="assignment-checkbox">${assignment.completed ? '☑️' : '☐'}</span>
                                <div class="assignment-details">
                                    <div class="assignment-title">
                                        <span style="font-size: 18px; margin-right: 6px;">${categoryInfo.icon}</span>
                                        ${assignment.title}
                                    </div>
                                    <div class="assignment-meta">
                                        <span class="category-badge" style="background: ${categoryInfo.color}20; color: ${categoryInfo.color}; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">${categoryInfo.label.toUpperCase()}</span>
                                        <span>•</span>
                                        <span>${subject.icon} ${subject.name}</span>
                                        <span>•</span>
                                        <span>Due: ${dueText}</span>
                                        <span class="priority-badge priority-${assignment.priority}">${assignment.priority.toUpperCase()}</span>
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('') : '<p style="text-align: center; color: var(--medium-gray); padding: 20px;">No assignments yet! Add one to get started.</p>'}
                    <button class="btn btn-secondary" style="margin-top: 12px;" onclick="app.showAddAssignmentModal()">
                        ➕ Add Assignment
                    </button>
                </div>

                <!-- Quick Actions -->
                <div class="quick-actions">
                    <button class="quick-action-btn" onclick="app.navigateToScreen('study')">
                        <span class="quick-action-icon">▶️</span>
                        <span class="quick-action-label">Start Timer</span>
                    </button>
                    <button class="quick-action-btn" onclick="app.showAddTaskModal()">
                        <span class="quick-action-icon">➕</span>
                        <span class="quick-action-label">Add Task</span>
                    </button>
                </div>
            </div>
        `;
    }

    renderStudy() {
        const user = this.dm.data.user;
        const todayMinutes = this.dm.getTodayStudyMinutes();
        const goalProgress = (todayMinutes / user.dailyGoalMinutes) * 100;
        const subjects = this.dm.data.subjects;
        
        if (!this.selectedSubjectId && subjects.length > 0) {
            this.selectedSubjectId = subjects[0].id;
        }

        const motivationalQuotes = [
            "Success is the sum of small efforts repeated day in and day out.",
            "The secret to getting ahead is getting started.",
            "Don't watch the clock; do what it does. Keep going.",
            "Education is the passport to the future.",
            "The only way to do great work is to love what you do.",
            "Believe you can and you're halfway there."
        ];
        const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

        return `
            <div class="screen">
                <div class="screen-header">
                    <div class="screen-title">Study Timer</div>
                </div>

                <div class="card">
                    <div class="timer-select">
                        <label>Select Subject</label>
                        <select id="subject-selector" onchange="app.selectedSubjectId = this.value">
                            ${subjects.map(s => `
                                <option value="${s.id}" ${s.id === this.selectedSubjectId ? 'selected' : ''}>
                                    ${s.icon} ${s.name}
                                </option>
                            `).join('')}
                        </select>
                    </div>

                    <div class="timer-mode-selector">
                        <div class="mode-option ${this.timer.mode === 'pomodoro' ? 'selected' : ''}" onclick="app.setTimerMode('pomodoro')">
                            <div class="mode-radio"></div>
                            <div>
                                <div style="font-weight: 600;">Pomodoro (25/5)</div>
                                <div style="font-size: 13px; color: var(--medium-gray);">25 min work, 5 min break</div>
                            </div>
                        </div>
                        <div class="mode-option ${this.timer.mode === 'deepFocus' ? 'selected' : ''}" onclick="app.setTimerMode('deepFocus')">
                            <div class="mode-radio"></div>
                            <div>
                                <div style="font-weight: 600;">Deep Focus (50/10)</div>
                                <div style="font-size: 13px; color: var(--medium-gray);">50 min work, 10 min break</div>
                            </div>
                        </div>
                        <div class="mode-option ${this.timer.mode === 'custom' ? 'selected' : ''}" onclick="app.setTimerMode('custom')">
                            <div class="mode-radio"></div>
                            <div>
                                <div style="font-weight: 600;">Custom ⚙️</div>
                                <div style="font-size: 13px; color: var(--medium-gray);">Set your own time</div>
                            </div>
                        </div>
                    </div>

                    ${this.timer.mode === 'custom' && !this.timer.isRunning && !this.timer.isPaused ? `
                        <div class="custom-timer-controls" style="margin-top: 16px; padding: 16px; background: var(--bg-color); border-radius: 12px;">
                            <div style="margin-bottom: 12px;">
                                <label style="font-size: 14px; font-weight: 600; margin-bottom: 4px; display: block;">Work Duration (minutes)</label>
                                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 8px;">
                                    <button class="preset-btn ${this.timer.customWorkMinutes === 15 ? 'active' : ''}" onclick="app.setCustomWork(15)">15</button>
                                    <button class="preset-btn ${this.timer.customWorkMinutes === 25 ? 'active' : ''}" onclick="app.setCustomWork(25)">25</button>
                                    <button class="preset-btn ${this.timer.customWorkMinutes === 45 ? 'active' : ''}" onclick="app.setCustomWork(45)">45</button>
                                    <button class="preset-btn ${this.timer.customWorkMinutes === 60 ? 'active' : ''}" onclick="app.setCustomWork(60)">60</button>
                                </div>
                                <input type="number" id="custom-work" class="modal-input" value="${this.timer.customWorkMinutes || 25}" min="1" max="180" placeholder="Enter minutes" onchange="app.setCustomWork(parseInt(this.value))">
                            </div>
                            <div>
                                <label style="font-size: 14px; font-weight: 600; margin-bottom: 4px; display: block;">Break Duration (minutes)</label>
                                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 8px;">
                                    <button class="preset-btn ${this.timer.customBreakMinutes === 5 ? 'active' : ''}" onclick="app.setCustomBreak(5)">5</button>
                                    <button class="preset-btn ${this.timer.customBreakMinutes === 10 ? 'active' : ''}" onclick="app.setCustomBreak(10)">10</button>
                                    <button class="preset-btn ${this.timer.customBreakMinutes === 15 ? 'active' : ''}" onclick="app.setCustomBreak(15)">15</button>
                                    <button class="preset-btn ${this.timer.customBreakMinutes === 20 ? 'active' : ''}" onclick="app.setCustomBreak(20)">20</button>
                                </div>
                                <input type="number" id="custom-break" class="modal-input" value="${this.timer.customBreakMinutes || 5}" min="1" max="60" placeholder="Enter minutes" onchange="app.setCustomBreak(parseInt(this.value))">
                            </div>
                        </div>
                    ` : ''}

                    <div class="timer-display">
                        <div class="timer-time">${this.timer.formatTime()}</div>
                    </div>

                    ${!this.timer.isRunning && !this.timer.isPaused ? `
                        <button class="btn btn-primary" onclick="app.startTimer()">
                            ▶️ Start Focus Session
                        </button>
                    ` : ''}
                    
                    ${this.timer.isRunning ? `
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                            <button class="btn btn-secondary" onclick="app.pauseTimer()">
                                ⏸️ Pause
                            </button>
                            <button class="btn btn-secondary" onclick="app.stopTimer()">
                                ⏹️ Stop
                            </button>
                        </div>
                    ` : ''}
                    
                    ${this.timer.isPaused ? `
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                            <button class="btn btn-primary" onclick="app.resumeTimer()">
                                ▶️ Resume
                            </button>
                            <button class="btn btn-secondary" onclick="app.stopTimer()">
                                ⏹️ Stop
                            </button>
                        </div>
                    ` : ''}

                    <div class="motivation-box" style="margin-top: 16px;">
                        🎯 "${randomQuote}"
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">Today's Progress</div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <div style="font-size: 32px; font-weight: 700; color: var(--primary-blue);">
                                ${Math.floor(todayMinutes / 60)}h ${todayMinutes % 60}m
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
                        <div class="progress-fill" style="width: ${Math.min(goalProgress, 100)}%; background: var(--success-green);"></div>
                    </div>
                    <div style="text-align: center; margin-top: 8px; font-size: 13px; color: var(--medium-gray);">
                        ${Math.round(goalProgress)}% of daily goal
                    </div>
                </div>
            </div>
        `;
    }

    renderTasks() {
        const tasks = this.dm.data.tasks;
        const today = new Date().toDateString();
        
        const todayTasks = tasks.filter(t => {
            if (!t.dueDate) return !t.completed;
            const taskDate = new Date(t.dueDate).toDateString();
            return taskDate === today && !t.completed;
        });
        
        const upcomingTasks = tasks.filter(t => {
            if (!t.dueDate) return false;
            const taskDate = new Date(t.dueDate);
            return taskDate > new Date() && !t.completed;
        });
        
        const completedToday = tasks.filter(t => {
            if (!t.completedAt) return false;
            return new Date(t.completedAt).toDateString() === today;
        });
        
        const totalToday = todayTasks.length + completedToday.length;
        const completionRate = totalToday > 0 ? (completedToday.length / totalToday) * 100 : 0;

        return `
            <div class="screen">
                <div class="screen-header">
                    <div class="screen-title">Tasks</div>
                    <button class="icon-btn" onclick="app.showAddTaskModal()">➕</button>
                </div>

                ${todayTasks.length > 0 || completedToday.length > 0 ? `
                    <div class="card">
                        <div class="card-header">Today (${totalToday})</div>
                        ${todayTasks.map(task => `
                            <div class="assignment-item ${task.priority}-priority" style="cursor: pointer;">
                                <span class="assignment-checkbox" onclick="app.toggleTask('${task.id}')">${task.completed ? '☑️' : '☐'}</span>
                                <div class="assignment-details" style="flex: 1;">
                                    <div class="assignment-title">${task.title}</div>
                                    <div class="assignment-meta">
                                        <span class="priority-badge priority-${task.priority}">${task.priority.toUpperCase()}</span>
                                    </div>
                                </div>
                                <button class="icon-btn" style="width: 32px; height: 32px; font-size: 16px;" onclick="app.deleteTask('${task.id}')" title="Delete">🗑️</button>
                            </div>
                        `).join('')}
                        ${completedToday.map(task => `
                            <div class="assignment-item" style="opacity: 0.6; text-decoration: line-through; cursor: pointer;">
                                <span class="assignment-checkbox" onclick="app.toggleTask('${task.id}')">☑️</span>
                                <div class="assignment-details" style="flex: 1;">
                                    <div class="assignment-title">${task.title}</div>
                                    <div class="assignment-meta">
                                        <span style="color: var(--success-green);">✓ Completed</span>
                                    </div>
                                </div>
                                <button class="icon-btn" style="width: 32px; height: 32px; font-size: 16px;" onclick="app.deleteTask('${task.id}')" title="Delete">🗑️</button>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}

                ${upcomingTasks.length > 0 ? `
                    <div class="card">
                        <div class="card-header">Upcoming (${upcomingTasks.length})</div>
                        ${upcomingTasks.map(task => {
                            const dueDate = new Date(task.dueDate);
                            const daysUntil = Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24));
                            const dueText = daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days`;
                            
                            return `
                                <div class="assignment-item ${task.priority}-priority" style="cursor: pointer;">
                                    <span class="assignment-checkbox" onclick="app.toggleTask('${task.id}')">${task.completed ? '☑️' : '☐'}</span>
                                    <div class="assignment-details" style="flex: 1;">
                                        <div class="assignment-title">${task.title}</div>
                                        <div class="assignment-meta">
                                            <span>${dueText}</span>
                                        </div>
                                    </div>
                                    <button class="icon-btn" style="width: 32px; height: 32px; font-size: 16px;" onclick="app.deleteTask('${task.id}')" title="Delete">🗑️</button>
                                </div>
                            `;
                        }).join('')}
                    </div>
                ` : ''}

                ${totalToday > 0 ? `
                    <div class="card">
                        <div style="text-align: center; padding: 8px;">
                            <div style="font-size: 14px; color: var(--medium-gray); margin-bottom: 8px;">
                                Progress: ${completedToday.length}/${totalToday} completed today
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${completionRate}%; background: var(--warning-orange);"></div>
                            </div>
                        </div>
                    </div>
                ` : ''}

                ${tasks.length === 0 ? `
                    <div class="empty-state">
                        <div class="empty-icon">✅</div>
                        <div class="empty-title">No tasks yet</div>
                        <div class="empty-description">Create your first task to get organized</div>
                    </div>
                ` : ''}

                <button class="btn btn-primary" onclick="app.showAddTaskModal()">
                    ➕ Add New Task
                </button>
            </div>
        `;
    }

    renderStats() {
        const weeklyStats = this.dm.getWeeklyStats();
        const totalWeekMinutes = weeklyStats.reduce((sum, day) => sum + day.minutes, 0);
        const totalWeekHours = (totalWeekMinutes / 60).toFixed(1);
        
        const goalsMetThisWeek = weeklyStats.filter(day => 
            day.minutes >= this.dm.data.user.dailyGoalMinutes
        ).length;
        
        const subjects = this.dm.data.subjects
            .filter(s => s.totalMinutes > 0)
            .sort((a, b) => b.totalMinutes - a.totalMinutes);
        
        const maxHours = subjects.length > 0 ? Math.max(...subjects.map(s => s.totalMinutes / 60)) : 0;

        return `
            <div class="screen">
                <div class="screen-header">
                    <div class="screen-title">Statistics</div>
                </div>

                <div class="card">
                    <div class="card-header">This Week</div>
                    <div class="stat-card" style="box-shadow: none; padding: 16px 0;">
                        <div class="stat-value">${totalWeekHours} hrs</div>
                        <div class="stat-label">Total Study Time</div>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                        <div style="text-align: center;">
                            <div style="font-size: 24px; font-weight: 700; color: var(--success-green);">${goalsMetThisWeek}/7</div>
                            <div style="font-size: 13px; color: var(--medium-gray);">Goals Met</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 24px; font-weight: 700; color: var(--purple);">${this.dm.data.user.currentStreak} days</div>
                            <div style="font-size: 13px; color: var(--medium-gray);">Current Streak</div>
                        </div>
                    </div>
                </div>

                <div class="chart-container">
                    <div class="chart-title">📊 Study Time by Day</div>
                    <div class="bar-chart">
                        ${weeklyStats.map(stat => `
                            <div style="display: flex; flex-direction: column; align-items: center; flex: 1;">
                                <div class="bar-value">${stat.hours}h</div>
                                <div class="bar" style="height: ${stat.minutes > 0 ? Math.max((parseFloat(stat.hours) / 3) * 100, 10) : 5}%;"></div>
                                <div class="bar-label">${stat.day}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                ${subjects.length > 0 ? `
                    <div class="chart-container">
                        <div class="chart-title">📚 Time by Subject</div>
                        <div class="subject-list">
                            ${subjects.map(subject => {
                                const hours = (subject.totalMinutes / 60).toFixed(1);
                                const percentage = maxHours > 0 ? (subject.totalMinutes / 60 / maxHours) * 100 : 0;
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
                                        <div class="subject-hours">${hours}h</div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                ` : `
                    <div class="empty-state">
                        <div class="empty-icon">📊</div>
                        <div class="empty-title">No study data yet</div>
                        <div class="empty-description">Complete a study session to see your statistics</div>
                    </div>
                `}
            </div>
        `;
    }

    renderGrades() {
        const subjects = this.dm.data.subjects;
        const overallGPA = this.dm.calculateGPA();
        
        const subjectsWithGrades = subjects.filter(s => s.currentGrade != null);
        
        return `
            <div class="screen">
                <div class="screen-header">
                    <div class="screen-title">Grade Tracker</div>
                    <button class="icon-btn" title="Info">ℹ️</button>
                </div>

                ${overallGPA ? `
                    <div class="card" style="background: linear-gradient(135deg, var(--primary-blue) 0%, var(--purple) 100%); color: white;">
                        <div style="text-align: center;">
                            <div style="font-size: 14px; opacity: 0.9; margin-bottom: 8px;">Overall GPA</div>
                            <div style="font-size: 48px; font-weight: 700; margin-bottom: 8px;">${overallGPA}</div>
                            <div style="font-size: 16px; opacity: 0.9;">out of 4.0</div>
                        </div>
                    </div>
                ` : `
                    <div class="empty-state">
                        <div class="empty-icon">🎓</div>
                        <div class="empty-title">No grades yet</div>
                        <div class="empty-description">Complete assignments and add grades to track your progress</div>
                    </div>
                `}

                ${subjectsWithGrades.length > 0 ? `
                    <div class="card">
                        <div class="card-header">Subject Grades</div>
                        ${subjectsWithGrades.map(subject => {
                            const percentage = subject.currentGrade.toFixed(1);
                            const letterGrade = this.dm.getLetterGrade(subject.currentGrade);
                            const progressWidth = Math.min(subject.currentGrade, 100);
                            
                            return `
                                <div style="margin-bottom: 20px;">
                                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                        <div style="font-weight: 600; color: var(--dark-gray);">
                                            ${subject.icon} ${subject.name}
                                        </div>
                                        <div style="font-size: 20px; font-weight: 700; color: var(--primary-blue);">
                                            ${letterGrade}
                                        </div>
                                    </div>
                                    <div class="progress-bar" style="height: 10px;">
                                        <div class="progress-fill" style="width: ${progressWidth}%; background: ${subject.color};"></div>
                                    </div>
                                    <div style="text-align: center; margin-top: 4px; font-size: 13px; color: var(--medium-gray);">
                                        ${percentage}%
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                ` : ''}

                <div class="card">
                    <div class="card-header">How Grading Works</div>
                    <div style="font-size: 14px; color: var(--dark-gray); line-height: 1.6;">
                        <p style="margin-bottom: 12px;">
                            📝 Complete assignments and add your grades to track your academic progress.
                        </p>
                        <p style="margin-bottom: 12px;">
                            📊 Your subject average is calculated using weighted scores based on assignment types:
                        </p>
                        <ul style="margin-left: 20px; margin-bottom: 12px;">
                            <li>📝 Homework: 10 points</li>
                            <li>📋 Quiz: 20 points</li>
                            <li>🎯 Project: 30 points</li>
                            <li>📚 Exam: 50 points</li>
                        </ul>
                        <p>
                            🎓 Overall GPA is calculated on a 4.0 scale using standard letter grade conversions.
                        </p>
                    </div>
                </div>
            </div>
        `;
    }

    renderProfile() {
        const user = this.dm.data.user;
        const xpProgress = (user.xp / user.maxXp) * 100;
        const totalHours = Math.floor(user.totalStudyMinutes / 60);

        return `
            <div class="screen" style="padding: 0;">
                <div class="profile-header">
                    <div class="profile-avatar">👤</div>
                    <div class="profile-name">${user.name}</div>
                    <div class="profile-level">Level ${user.level} Scholar</div>
                    <div class="xp-progress">
                        <div class="xp-bar">
                            <div class="xp-fill" style="width: ${xpProgress}%;"></div>
                        </div>
                        <div class="xp-text">${user.xp} / ${user.maxXp} XP</div>
                    </div>
                </div>

                <div style="padding: 16px;">
                    <div class="stats-grid">
                        <div class="stat-box">
                            <div class="stat-box-value">🔥 ${user.currentStreak}</div>
                            <div class="stat-box-label">Day Streak</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-box-value">🏆 ${user.badges.length}</div>
                            <div class="stat-box-label">Badges</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-box-value">📚 ${totalHours}</div>
                            <div class="stat-box-label">Hours</div>
                        </div>
                    </div>

                    <div class="settings-section">
                        <div class="section-title">Account</div>
                        <div class="settings-list">
                            <div class="settings-item" onclick="app.editProfile()">
                                <span class="settings-icon">👤</span>
                                <span class="settings-label">Edit Profile</span>
                                <span class="settings-arrow">›</span>
                            </div>
                            <div class="settings-item">
                                <span class="settings-icon">🎓</span>
                                <span class="settings-label">Grade Level</span>
                                <span class="settings-value">${user.gradeLevel}</span>
                                <span class="settings-arrow">›</span>
                            </div>
                            <div class="settings-item" onclick="app.editDailyGoal()">
                                <span class="settings-icon">🎯</span>
                                <span class="settings-label">Daily Goal</span>
                                <span class="settings-value">${Math.floor(user.dailyGoalMinutes / 60)}h ${user.dailyGoalMinutes % 60}m</span>
                                <span class="settings-arrow">›</span>
                            </div>
                            <div class="settings-item" onclick="authUI.handleLogout()" style="color: var(--urgent-red);">
                                <span class="settings-icon">🚪</span>
                                <span class="settings-label">Sign Out</span>
                                <span class="settings-arrow">›</span>
                            </div>
                        </div>
                    </div>

                    <div class="settings-section">
                        <div class="section-title">Data</div>
                        <div class="settings-list">
                            <div class="settings-item" onclick="app.exportData()">
                                <span class="settings-icon">📤</span>
                                <span class="settings-label">Export Data</span>
                                <span class="settings-arrow">›</span>
                            </div>
                            <div class="settings-item" onclick="app.importData()">
                                <span class="settings-icon">📥</span>
                                <span class="settings-label">Import Data</span>
                                <span class="settings-arrow">›</span>
                            </div>
                            <div class="settings-item" onclick="app.clearData()">
                                <span class="settings-icon">🗑️</span>
                                <span class="settings-label">Clear All Data</span>
                                <span class="settings-arrow">›</span>
                            </div>
                        </div>
                    </div>

                    <div class="settings-section">
                        <div class="section-title">App</div>
                        <div class="settings-list">
                            <div class="settings-item">
                                <span class="settings-icon">ℹ️</span>
                                <span class="settings-label">About</span>
                                <span class="settings-value">v2.0.0</span>
                                <span class="settings-arrow">›</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    render(screenName) {
        this.currentScreen = screenName;
        const container = document.getElementById('app-container');
        
        switch(screenName) {
            case 'dashboard':
                container.innerHTML = this.renderDashboard();
                break;
            case 'study':
                container.innerHTML = this.renderStudy();
                this.updateTimerDisplay(this.timer.timeLeft, this.timer.totalTime);
                break;
            case 'tasks':
                container.innerHTML = this.renderTasks();
                break;
            case 'stats':
                container.innerHTML = this.renderStats();
                break;
            case 'grades':
                container.innerHTML = this.renderGrades();
                break;
            case 'profile':
                container.innerHTML = this.renderProfile();
                break;
        }
        
        // Update nav
        document.querySelectorAll('.nav-item').forEach(item => {
            if (item.dataset.screen === screenName) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        container.scrollTop = 0;
    }
}

// ============================================
// MODAL MANAGER
// ============================================

class ModalManager {
    showModal(title, content, onSave) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h2>${title}</h2>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">✕</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                    <button class="btn btn-primary" id="modal-save-btn">Save</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        document.getElementById('modal-save-btn').onclick = () => {
            if (onSave()) {
                modal.remove();
            }
        };
        
        // Focus first input
        setTimeout(() => {
            const firstInput = modal.querySelector('input, select, textarea');
            if (firstInput) firstInput.focus();
        }, 100);
    }

    prompt(title, message, defaultValue = '') {
        return new Promise((resolve) => {
            this.showModal(
                title,
                `<p>${message}</p><input type="text" id="prompt-input" value="${defaultValue}" class="modal-input">`,
                () => {
                    const value = document.getElementById('prompt-input').value.trim();
                    if (value) {
                        resolve(value);
                        return true;
                    }
                    return false;
                }
            );
        });
    }

    confirm(title, message) {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.className = 'modal-overlay';
            modal.innerHTML = `
                <div class="modal">
                    <div class="modal-header">
                        <h2>${title}</h2>
                    </div>
                    <div class="modal-body">
                        <p>${message}</p>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" id="cancel-btn">Cancel</button>
                        <button class="btn btn-primary" id="confirm-btn">Confirm</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            document.getElementById('cancel-btn').onclick = () => {
                modal.remove();
                resolve(false);
            };
            
            document.getElementById('confirm-btn').onclick = () => {
                modal.remove();
                resolve(true);
            };
        });
    }
}

// ============================================
// MAIN APP CLASS
// ============================================

class StudyBuddyApp {
    constructor() {
        this.dm = new DataManager();
        this.ui = new UIRenderer(this.dm);
        this.modal = new ModalManager();
        
        // Load timer preferences
        const timerPrefs = this.dm.getTimerPreferences();
        this.ui.timer.customWorkMinutes = timerPrefs.customWorkMinutes;
        this.ui.timer.customBreakMinutes = timerPrefs.customBreakMinutes;
        if (timerPrefs.mode) {
            this.ui.timer.mode = timerPrefs.mode;
        }
        
        // Request notification permission
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
        
        this.init();
    }

    init() {
        // Set up navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                this.navigateToScreen(item.dataset.screen);
            });
        });
        
        // Initial render
        this.navigateToScreen('dashboard');
        
        // Check streak on load
        this.dm.updateStreak();
        
        // Auto-save timer state periodically
        setInterval(() => this.dm.save(), 30000); // Every 30 seconds
    }

    navigateToScreen(screen) {
        this.ui.render(screen);
    }

    // Timer methods
    setTimerMode(mode) {
        this.ui.timer.setMode(mode);
        this.dm.updateTimerPreferences({ mode });
        this.ui.render('study');
    }
    
    setCustomWork(minutes) {
        if (minutes >= 1 && minutes <= 180) {
            this.ui.timer.setCustomWork(minutes);
            this.dm.updateTimerPreferences({ customWorkMinutes: minutes });
            this.ui.render('study');
        }
    }
    
    setCustomBreak(minutes) {
        if (minutes >= 1 && minutes <= 60) {
            this.ui.timer.setCustomBreak(minutes);
            this.dm.updateTimerPreferences({ customBreakMinutes: minutes });
            this.ui.render('study');
        }
    }

    startTimer() {
        const subjectSelect = document.getElementById('subject-selector');
        if (subjectSelect) {
            this.ui.selectedSubjectId = subjectSelect.value;
        }
        
        if (!this.ui.selectedSubjectId) {
            this.ui.showToast('⚠️ Please select a subject first');
            return;
        }
        
        this.ui.timer.start();
        this.ui.render('study');
    }

    pauseTimer() {
        this.ui.timer.pause();
        this.ui.render('study');
    }

    resumeTimer() {
        this.ui.timer.resume();
        this.ui.render('study');
    }

    stopTimer() {
        this.ui.timer.stop();
        this.ui.render('study');
    }

    // Assignment methods
    showAddAssignmentModal() {
        const subjects = this.dm.data.subjects;
        const categories = this.dm.getCategories();
        
        this.modal.showModal(
            'Add Assignment',
            `
                <input type="text" id="assignment-title" placeholder="Assignment title" class="modal-input">
                
                <label style="font-size: 14px; font-weight: 600; margin: 8px 0 4px; display: block;">Type</label>
                <select id="assignment-type" class="modal-input">
                    ${Object.entries(categories).map(([key, cat]) => 
                        `<option value="${key}">${cat.icon} ${cat.label}</option>`
                    ).join('')}
                </select>
                
                <label style="font-size: 14px; font-weight: 600; margin: 8px 0 4px; display: block;">Subject</label>
                <select id="assignment-subject" class="modal-input">
                    ${subjects.map(s => `<option value="${s.id}">${s.icon} ${s.name}</option>`).join('')}
                </select>
                
                <label style="font-size: 14px; font-weight: 600; margin: 8px 0 4px; display: block;">Due Date</label>
                <input type="date" id="assignment-due" class="modal-input" value="${new Date().toISOString().split('T')[0]}">
                
                <label style="font-size: 14px; font-weight: 600; margin: 8px 0 4px; display: block;">Priority</label>
                <select id="assignment-priority" class="modal-input">
                    <option value="low">🟢 Low Priority</option>
                    <option value="medium" selected>🟡 Medium Priority</option>
                    <option value="high">🔴 High Priority</option>
                </select>
                
                <textarea id="assignment-description" placeholder="Description (optional)" class="modal-input" rows="3"></textarea>
            `,
            () => {
                const title = document.getElementById('assignment-title').value.trim();
                const type = document.getElementById('assignment-type').value;
                const subjectId = document.getElementById('assignment-subject').value;
                const dueDate = document.getElementById('assignment-due').value;
                const priority = document.getElementById('assignment-priority').value;
                const description = document.getElementById('assignment-description').value.trim();
                
                if (title && subjectId && dueDate) {
                    this.dm.addAssignment(title, subjectId, dueDate, priority, description, type);
                    this.ui.showToast(`✅ ${categories[type].label} added!`);
                    this.ui.render(this.ui.currentScreen);
                    return true;
                }
                return false;
            }
        );
    }

    toggleAssignment(id) {
        const assignment = this.dm.data.assignments.find(a => a.id === id);
        if (!assignment) return;
        
        // If marking as complete and no grade yet, offer to add grade
        if (!assignment.completed && !assignment.grade) {
            this.dm.toggleAssignment(id);
            this.ui.render(this.ui.currentScreen);
            
            // Prompt to add grade
            setTimeout(() => {
                if (confirm(`✅ Assignment completed! Would you like to add a grade?`)) {
                    this.showAddGradeModal(id);
                }
            }, 300);
        } else {
            this.dm.toggleAssignment(id);
            this.ui.render(this.ui.currentScreen);
        }
    }

    showAddGradeModal(assignmentId) {
        const assignment = this.dm.data.assignments.find(a => a.id === assignmentId);
        if (!assignment) return;
        
        const subject = this.dm.getSubject(assignment.subjectId);
        const categoryInfo = this.dm.getCategoryInfo(assignment.type || 'homework');
        
        this.modal.showModal(
            'Add Grade',
            `
                <div style="margin-bottom: 16px;">
                    <div style="font-weight: 600; margin-bottom: 4px;">${assignment.title}</div>
                    <div style="font-size: 13px; color: var(--medium-gray);">
                        ${categoryInfo.icon} ${categoryInfo.label} • ${subject.icon} ${subject.name}
                    </div>
                </div>
                
                <label style="font-size: 14px; font-weight: 600; margin: 8px 0 4px; display: block;">Score (%)</label>
                <input type="number" id="grade-score" placeholder="95" min="0" max="100" class="modal-input">
                
                <label style="font-size: 14px; font-weight: 600; margin: 8px 0 4px; display: block;">Weight (points)</label>
                <input type="number" id="grade-weight" value="${assignment.weight}" class="modal-input">
                
                <div style="font-size: 12px; color: var(--medium-gray); margin-top: 8px;">
                    This grade will be used to calculate your ${subject.name} average and overall GPA.
                </div>
            `,
            () => {
                const score = parseFloat(document.getElementById('grade-score').value);
                const weight = parseInt(document.getElementById('grade-weight').value);
                
                if (score >= 0 && score <= 100 && weight > 0) {
                    assignment.weight = weight;
                    this.dm.addGrade(assignmentId, score, 100);
                    this.ui.showToast(`🎉 Grade added: ${score}%!`);
                    this.ui.render(this.ui.currentScreen);
                    return true;
                }
                return false;
            }
        );
    }

    // Task methods
    showAddTaskModal() {
        this.modal.showModal(
            'Add Task',
            `
                <input type="text" id="task-title" placeholder="Task title" class="modal-input">
                <input type="date" id="task-due" class="modal-input" value="${new Date().toISOString().split('T')[0]}">
                <select id="task-priority" class="modal-input">
                    <option value="low">Low Priority</option>
                    <option value="medium" selected>Medium Priority</option>
                    <option value="high">High Priority</option>
                </select>
            `,
            () => {
                const title = document.getElementById('task-title').value.trim();
                const dueDate = document.getElementById('task-due').value;
                const priority = document.getElementById('task-priority').value;
                
                if (title) {
                    this.dm.addTask(title, dueDate, priority);
                    this.ui.showToast('✅ Task added!');
                    this.ui.render(this.ui.currentScreen);
                    return true;
                }
                return false;
            }
        );
    }

    toggleTask(id) {
        this.dm.toggleTask(id);
        this.ui.render(this.ui.currentScreen);
    }

    deleteTask(id) {
        this.dm.deleteTask(id);
        this.ui.showToast('🗑️ Task deleted');
        this.ui.render(this.ui.currentScreen);
    }

    // Profile methods
    async editProfile() {
        const newName = await this.modal.prompt('Edit Name', 'Enter your name:', this.dm.data.user.name);
        if (newName) {
            this.dm.updateUser({ name: newName });
            this.ui.showToast('✅ Profile updated!');
            this.ui.render('profile');
        }
    }

    async editDailyGoal() {
        const hours = Math.floor(this.dm.data.user.dailyGoalMinutes / 60);
        const newHours = await this.modal.prompt('Daily Goal', 'Enter daily goal in hours:', hours);
        if (newHours && !isNaN(newHours) && newHours > 0) {
            this.dm.updateUser({ dailyGoalMinutes: parseInt(newHours) * 60 });
            this.ui.showToast('✅ Daily goal updated!');
            this.ui.render('profile');
        }
    }

    exportData() {
        const data = this.dm.exportData();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `study-buddy-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        this.ui.showToast('📤 Data exported!');
    }

    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const success = this.dm.importData(event.target.result);
                    if (success) {
                        this.ui.showToast('📥 Data imported successfully!');
                        this.ui.render(this.ui.currentScreen);
                    } else {
                        this.ui.showToast('❌ Import failed - invalid file');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }

    async clearData() {
        const confirmed = await this.modal.confirm(
            'Clear All Data',
            'Are you sure you want to delete all your data? This cannot be undone!'
        );
        
        if (confirmed) {
            this.dm.clearAllData();
            this.ui.showToast('🗑️ All data cleared');
            this.ui.render('dashboard');
        }
    }

    // Quick Add menu
    showQuickAddMenu() {
        const categories = this.dm.getCategories();
        
        this.modal.showModal(
            '⚡ Quick Add',
            `
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-top: 12px;">
                    ${Object.entries(categories).map(([key, cat]) => `
                        <button class="quick-add-option" onclick="app.quickAddAssignment('${key}'); document.querySelector('.modal-overlay').remove();" style="padding: 16px; background: ${cat.color}10; border: 2px solid ${cat.color}; border-radius: 12px; cursor: pointer; transition: all 0.2s;">
                            <div style="font-size: 32px; margin-bottom: 8px;">${cat.icon}</div>
                            <div style="font-weight: 600; color: ${cat.color};">${cat.label}</div>
                        </button>
                    `).join('')}
                </div>
                
                <button class="btn btn-secondary" style="margin-top: 16px;" onclick="app.showAddTaskModal(); document.querySelector('.modal-overlay').remove();">
                    ✅ Simple Task
                </button>
            `,
            () => { return true; }
        );
    }

    quickAddAssignment(type) {
        // Pre-fill type and show full form
        this.showAddAssignmentModal();
        setTimeout(() => {
            const typeSelect = document.getElementById('assignment-type');
            if (typeSelect) typeSelect.value = type;
        }, 100);
    }
}

// ============================================
// INITIALIZE APP
// ============================================

let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new StudyBuddyApp();
    window.app = app; // For debugging
});

// ============================================
// PWA INSTALL PROMPT & SERVICE WORKER
// ============================================

// Service Worker for offline support
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
            console.log('[PWA] Service Worker registered:', registration.scope);
            
            // Check for updates every hour
            setInterval(() => {
                registration.update();
            }, 60 * 60 * 1000);
        })
        .catch((error) => {
            console.log('[PWA] Service Worker registration failed:', error);
        });
}

// PWA Install Prompt
let deferredPrompt;
const installButton = document.createElement('button');
installButton.textContent = '📱 Install App';
installButton.className = 'install-prompt';
installButton.style.cssText = `
    position: fixed;
    bottom: 90px;
    left: 50%;
    transform: translateX(-50%);
    padding: 12px 24px;
    background: linear-gradient(135deg, #4A90E2, #667eea);
    color: white;
    border: none;
    border-radius: 25px;
    font-size: 15px;
    font-weight: 600;
    box-shadow: 0 4px 15px rgba(74, 144, 226, 0.4);
    cursor: pointer;
    z-index: 999;
    display: none;
    transition: all 0.3s;
`;

installButton.addEventListener('mouseover', () => {
    installButton.style.transform = 'translateX(-50%) scale(1.05)';
});

installButton.addEventListener('mouseout', () => {
    installButton.style.transform = 'translateX(-50%) scale(1)';
});

document.body.appendChild(installButton);

// Listen for install prompt
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Show install button (only on desktop/tablet)
    if (window.deviceDetector && window.deviceDetector.deviceType !== 'mobile') {
        installButton.style.display = 'block';
    }
    
    console.log('[PWA] Install prompt available');
});

// Handle install button click
installButton.addEventListener('click', async () => {
    if (!deferredPrompt) {
        return;
    }
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    console.log('[PWA] User choice:', outcome);
    
    if (outcome === 'accepted') {
        console.log('[PWA] App installed!');
    }
    
    deferredPrompt = null;
    installButton.style.display = 'none';
});

// Detect if app is installed
window.addEventListener('appinstalled', () => {
    console.log('[PWA] App successfully installed!');
    installButton.style.display = 'none';
    deferredPrompt = null;
    
    // Show success message
    if (window.app && window.app.ui) {
        window.app.ui.showToast('🎉 Study Buddy installed successfully!');
    }
});

// Check if running as PWA
function isPWA() {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone === true;
}

if (isPWA()) {
    console.log('[PWA] Running as installed app');
    document.body.classList.add('is-pwa');
}
