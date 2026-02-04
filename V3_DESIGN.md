# Study Buddy v3.0 - Enhanced Features Design Document

**Version:** 3.0  
**Date:** 2026-02-04  
**Status:** Implementation Ready

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [New Features Design](#new-features-design)
3. [Updated Screen List](#updated-screen-list)
4. [Updated User Flows](#updated-user-flows)
5. [MVP vs Premium Features](#mvp-vs-premium-features)
6. [UX Decisions & Rationale](#ux-decisions--rationale)
7. [Technical Implementation](#technical-implementation)

---

## Overview

### Goals for v3.0
- ✅ Add powerful features without complexity
- ✅ Maintain clean, beginner-friendly interface
- ✅ Keep performance fast (< 100ms UI updates)
- ✅ Preserve offline-first functionality
- ✅ Enhance student productivity

### Design Principles
1. **Progressive Disclosure** - Advanced features hidden until needed
2. **Smart Defaults** - Minimize required input
3. **Visual Clarity** - Color-coded categories, clear priorities
4. **Gentle Motivation** - Encourage without pressure
5. **Accessibility First** - Inclusive design for all students

---

## New Features Design

### 1. CUSTOM REMINDERS & PRIORITIES

#### Feature Breakdown

**Custom Reminder Times:**
- Default reminders: 1 day before, 1 hour before
- Custom: Set exact date/time for reminder
- Multiple reminders per item (up to 3 in free, unlimited in premium)
- Notification permission requested on first reminder setup

**Visual Priority Indicators:**
```
🔴 HIGH PRIORITY
- Red left border (4px thick)
- Red priority badge
- Appears at top of lists
- Countdown timer if < 24 hours

🟡 MEDIUM PRIORITY  
- Orange left border (4px thick)
- Orange priority badge
- Middle of lists
- Warning icon if < 3 days

🟢 LOW PRIORITY
- Green left border (2px thick)
- Green priority badge or no badge
- Bottom of lists
- Minimal visual emphasis
```

**Snooze & Repeat:**
- Snooze options: 10 min, 30 min, 1 hour, 3 hours
- Repeat patterns: Daily, Weekly, Custom days
- Snooze history tracked (shows pattern of procrastination)

#### UI Components

**Reminder Setup Modal:**
```
┌─────────────────────────────┐
│  Set Reminder               │
├─────────────────────────────┤
│  📅 Date: [Feb 5, 2026   ▼] │
│  ⏰ Time: [14:00         ▼] │
│  🔁 Repeat: [One-time    ▼] │
│                             │
│  🔔 Notification:           │
│  ● Browser notification     │
│  ○ Email (Premium)          │
│                             │
│  [Cancel]  [Set Reminder]   │
└─────────────────────────────┘
```

**Priority Selection:**
- Inline in all add/edit forms
- Quick toggle buttons
- Visual preview of how item will appear

---

### 2. HOMEWORK, EXAM & PROJECT CATEGORIES

#### Task Type System

**Categories:**
```javascript
{
  homework: {
    icon: '📝',
    color: '#4A90E2', // Blue
    label: 'Homework',
    weight: 10 // Default points
  },
  quiz: {
    icon: '📋',
    color: '#F5A623', // Orange
    label: 'Quiz',
    weight: 20
  },
  exam: {
    icon: '📚',
    color: '#D0021B', // Red
    label: 'Exam',
    weight: 50
  },
  project: {
    icon: '🎯',
    color: '#9013FE', // Purple
    label: 'Project',
    weight: 30
  }
}
```

**Data Model:**
```javascript
{
  id: 'uuid',
  title: 'Chapter 5 Test',
  type: 'exam', // homework, quiz, exam, project
  subjectId: 'uuid',
  dueDate: 'ISO date',
  priority: 'high', // low, medium, high
  weight: 50, // For grade calculation
  grade: null, // Set after completion
  completed: false,
  reminders: [
    { datetime: 'ISO', sent: false },
    { datetime: 'ISO', sent: false }
  ]
}
```

#### Visual Distinction

**Calendar View:**
```
┌─────────────────────────────┐
│ < February 2026          >  │
├─────────────────────────────┤
│  Mon  Tue  Wed  Thu  Fri    │
│   3    4    5    6    7     │
│              📝🎯           │
│              [2]            │
│  10   11   12   13   14     │
│  📚                         │
│  [1]                        │
└─────────────────────────────┘

Legend:
📝 Homework (Blue)
📋 Quiz (Orange)  
📚 Exam (Red)
🎯 Project (Purple)
```

**List View:**
```
┌─────────────────────────────┐
│ 📚 EXAM - Biology Ch 1-3    │
│ 🔴 High Priority            │
│ Due: Tomorrow 9:00 AM       │
│ ⚠️ 15 hours remaining       │
│ Grade: Not graded yet       │
└─────────────────────────────┘
```

---

### 3. GRADE TRACKER

#### Features

**Grade Input:**
- Add grades after completing assignments
- Support different grading systems:
  - Percentage (0-100%)
  - Letter grades (A+, A, A-, B+, etc.)
  - Points (e.g., 85/100)
  - Pass/Fail
- Optional: Target grade per subject

**Calculations:**

```javascript
// Subject Average
subjectAverage = Σ(grade × weight) / Σ(weight)

// Overall GPA (4.0 scale)
GPA = Σ(subjectGPA × credits) / Σ(credits)

// Grade Conversion
A+ (97-100) = 4.0
A  (93-96)  = 4.0
A- (90-92)  = 3.7
B+ (87-89)  = 3.3
B  (83-86)  = 3.0
...etc
```

**Visual Components:**

**Grades Screen:**
```
┌─────────────────────────────┐
│ Grade Tracker       🎓      │
├─────────────────────────────┤
│ Overall GPA: 3.65 / 4.0     │
│ ━━━━━━━━━━━━━━━━  91%      │
│                             │
│ 📘 Mathematics       A-     │
│ ━━━━━━━━━━━━━━  92%        │
│ Target: A (93%)  [+1%]      │
│                             │
│ 📗 Biology           B+     │
│ ━━━━━━━━━━━  87%           │
│ Target: A- (90%)  [+3%]     │
│                             │
│ 📙 History           A      │
│ ━━━━━━━━━━━━━━━  94%      │
│ Target: A (93%)  [✓]        │
│                             │
│ [View All Grades]           │
└─────────────────────────────┘
```

**Subject Detail:**
```
┌─────────────────────────────┐
│ ← Mathematics Grades        │
├─────────────────────────────┤
│ Current Average: 92% (A-)   │
│ Target: 93% (A)             │
│ ━━━━━━━━━━━━━━━━━  99%    │
│                             │
│ Recent Assignments:         │
│                             │
│ ✅ Homework Ch 5    95%     │
│    Weight: 10  Date: Feb 1  │
│                             │
│ ✅ Quiz Ch 4-5      88%     │
│    Weight: 20  Date: Jan 29 │
│                             │
│ ✅ Project         100%      │
│    Weight: 30  Date: Jan 25 │
│                             │
│ 🎯 UPCOMING:                │
│ ⏳ Exam Ch 1-6              │
│    Weight: 50  Due: Feb 10  │
│                             │
│ To reach 93%:               │
│ Need 93% or higher on exam  │
│                             │
│ [Add Grade]                 │
└─────────────────────────────┘
```

#### Grade Entry Modal:
```
┌─────────────────────────────┐
│ Add Grade                   │
├─────────────────────────────┤
│ Assignment: Homework Ch 5   │
│ Subject: Mathematics        │
│                             │
│ Grade Type:                 │
│ ● Percentage                │
│ ○ Letter Grade              │
│ ○ Points                    │
│                             │
│ Score: [95] %               │
│                             │
│ Weight: [10] points         │
│                             │
│ 💭 Notes (optional):        │
│ [Did well on geometry...]   │
│                             │
│ [Cancel]  [Save Grade]      │
└─────────────────────────────┘
```

---

### 4. WEEKLY SUMMARY & MOTIVATION

#### Features

**Summary Screen (New Tab):**
```
┌─────────────────────────────┐
│ Weekly Summary      📊      │
├─────────────────────────────┤
│ Week of Feb 3-9, 2026       │
│                             │
│ 🎯 YOU ACCOMPLISHED:        │
│                             │
│ ✅ 12 tasks completed       │
│ 📚 15.5 hours studied       │
│ 🔥 7-day streak maintained  │
│ 🏆 Level 18 reached!        │
│                             │
│ ─────────────────────────   │
│                             │
│ 📊 STUDY BREAKDOWN:         │
│ [Bar chart by subject]      │
│                             │
│ 📘 Math:      4.5h (29%)    │
│ 📗 Biology:   4.0h (26%)    │
│ 📙 History:   3.5h (23%)    │
│ 📕 English:   2.5h (16%)    │
│ 🧪 Chemistry: 1.0h (6%)     │
│                             │
│ ─────────────────────────   │
│                             │
│ 💡 INSIGHTS:                │
│                             │
│ • Your most productive      │
│   time: 2-4 PM (40%)        │
│                             │
│ • Chemistry needs more      │
│   attention (only 1 hour)   │
│                             │
│ • Great job maintaining     │
│   your streak! 🔥           │
│                             │
│ ─────────────────────────   │
│                             │
│ 🌟 THIS WEEK'S GOAL:        │
│ Study chemistry for at      │
│ least 30 minutes daily      │
│                             │
│ [Share Summary] [Download]  │
└─────────────────────────────┘
```

**Motivational Messages:**

System generates context-aware messages:

```javascript
const motivationalMessages = {
  streakMaintained: [
    "Amazing! You've studied {days} days in a row! 🔥",
    "Consistency is key! Keep up your {days}-day streak!",
    "You're on fire! {days} days straight! 🌟"
  ],
  goalAchieved: [
    "You crushed your weekly goal! 🎉",
    "Goal achieved! You studied {hours} hours this week!",
    "Impressive dedication this week! 💪"
  ],
  improvement: [
    "Your study time increased by {percent}% this week!",
    "You're making progress! {hours} more hours than last week!",
  ],
  balanced: [
    "Great balance across all subjects! 📚",
    "You're studying all subjects evenly - nice work!"
  ],
  needsAttention: [
    "{subject} could use a bit more love this week 💙",
    "Quick reminder: {subject} exam coming up!"
  ]
}
```

**Smart Suggestions:**

```javascript
// Analyze study patterns
patterns = {
  bestStudyTime: analyzeSessionsByHour(),
  // "You study best between 2-4 PM"
  
  longestStreak: findLongestStreak(),
  // "Your longest streak was 15 days!"
  
  favoriteSubject: mostStudiedSubject(),
  // "You love Mathematics! 4.5 hours this week"
  
  weakSubject: leastStudiedSubject(),
  // "Chemistry needs attention (1 hour)"
  
  averageSessionLength: calculateAvgSession(),
  // "Your average session: 35 minutes"
  
  bestDay: findMostProductiveDay(),
  // "You're most productive on Tuesdays"
}
```

---

### 5. QUICK ADD FEATURE

#### Implementation

**Floating Action Button (FAB):**
```
Position: Fixed bottom-right
Size: 56x56px
Icon: ➕
Color: Primary blue with shadow
Z-index: High

On click → Opens quick-add menu
```

**Quick Add Menu:**
```
┌─────────────────────────────┐
│   [×]                       │
│                             │
│  ⚡ Quick Add               │
│                             │
│  [Type or speak...]         │
│                             │
│  ──────────────────         │
│                             │
│  🎤 Voice Input             │
│  📝 Homework                │
│  📋 Quiz                    │
│  📚 Exam                    │
│  🎯 Project                 │
│  ✅ Simple Task             │
│                             │
└─────────────────────────────┘
```

**Quick Input Processing:**

```javascript
// Smart parsing of natural language
parseQuickInput("Math homework due tomorrow") 
→ {
  type: 'homework',
  subject: 'Mathematics',
  title: 'Math homework',
  dueDate: calculateTomorrow(),
  priority: 'medium'
}

parseQuickInput("Biology exam Feb 10 high priority")
→ {
  type: 'exam',
  subject: 'Biology',
  title: 'Biology exam',
  dueDate: '2026-02-10',
  priority: 'high'
}
```

**Voice Input (Web Speech API):**
```javascript
// Browser speech recognition
recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  const parsed = parseQuickInput(transcript);
  createTaskFromParsed(parsed);
}
```

---

### 6. CALENDAR VIEW

#### Design

**Monthly Calendar:**
```
┌─────────────────────────────────────────┐
│ < February 2026                      >  │
├─────────────────────────────────────────┤
│  Sun   Mon   Tue   Wed   Thu   Fri  Sat│
│        1     2     3     4     5     6  │
│                    📝              📚  │
│                    🎯                   │
│   7     8     9    10    11    12   13 │
│  📋          📝    📚                   │
│  14    15    16    17    18    19   20 │
│                                         │
│  21    22    23    24    25    26   27 │
│              📝    📋                   │
│  28    29                               │
│  📚                                     │
└─────────────────────────────────────────┘

Today: Feb 5 (highlighted)
Legend at bottom
Click day → See details
```

**Day Detail View:**
```
┌─────────────────────────────┐
│ ← Wednesday, Feb 5          │
├─────────────────────────────┤
│ 📝 Math Homework            │
│    Due: 11:59 PM 🟡         │
│    [Complete] [Edit]        │
│                             │
│ 🎯 Science Project          │
│    Due: 3:00 PM  🔴         │
│    [Complete] [Edit]        │
│                             │
│ ─────────────────────────   │
│                             │
│ Study Sessions:             │
│ ⏱️  Math (25 min)           │
│ ⏱️  Biology (50 min)        │
│                             │
│ Total: 1h 15m               │
│                             │
│ [+ Add Task]                │
└─────────────────────────────┘
```

---

## Updated Screen List

### Core Screens (5 → 7)

1. **Dashboard** (Enhanced)
   - Quick stats
   - Upcoming items with categories
   - Priority indicators
   - Quick add button
   - Today's summary

2. **Study Timer** (Same)
   - Pomodoro timer
   - Subject selection
   - Session tracking

3. **Tasks & Assignments** (Enhanced)
   - Category tabs (All/Homework/Quiz/Exam/Project)
   - Priority sorting
   - Calendar view option
   - Reminders visible
   - Grade entry option

4. **Statistics** (Enhanced)
   - Study time charts
   - Subject breakdown
   - Grade averages
   - GPA display

5. **Profile** (Same)
   - User settings
   - Data management

6. **📊 Weekly Summary** (NEW)
   - Weekly accomplishments
   - Study breakdown
   - Smart insights
   - Motivational messages
   - Suggestions

7. **🎓 Grades** (NEW)
   - Overall GPA
   - Subject grades
   - Target tracking
   - Grade entry
   - Progress charts

### Bottom Navigation Update:
```
🏠 Home | ⏱️ Study | ✅ Tasks | 📊 Summary | 👤 Profile
```

Or with 6 tabs:
```
🏠 Home | ⏱️ Timer | ✅ Tasks | 🎓 Grades | 📊 Summary | 👤 More
```

---

## Updated User Flows

### Flow 1: Adding Assignment with Reminders

```
User clicks Quick Add (FAB)
    ↓
Selects "📚 Exam"
    ↓
Quick input: "Biology Chapter 3 exam"
    ↓
System suggests:
- Type: Exam
- Subject: Biology (matched)
- Title: "Chapter 3 exam"
- Due date: [Needs input]
    ↓
User taps to expand full form
    ↓
Fills:
- Due: Feb 10, 9:00 AM
- Priority: High
- Weight: 50 points
    ↓
Clicks "Add Reminders"
    ↓
System suggests:
- 1 week before (Feb 3)
- 1 day before (Feb 9)
- 1 hour before (8:00 AM)
    ↓
User adjusts or confirms
    ↓
Clicks "Save"
    ↓
Exam added to:
- Dashboard (top, red border)
- Tasks tab (Exam category)
- Calendar (Feb 10, red)
- Reminders scheduled
    ↓
User sees toast: "✅ Exam added with 3 reminders"
```

### Flow 2: Completing Assignment & Adding Grade

```
User checks off "Math Homework"
    ↓
Item marked complete
    ↓
Popup appears: "Add grade for this assignment?"
    ↓
User clicks "Yes"
    ↓
Grade entry modal opens:
- Pre-filled: Math, Homework
- Weight: 10 (editable)
    ↓
User enters: 95%
    ↓
Clicks "Save Grade"
    ↓
System:
- Saves grade
- Recalculates Math average
- Updates overall GPA
- Awards XP (20 + bonus for A grade)
    ↓
Toast: "🎉 Great work! 95% on homework. Math average: 92%"
    ↓
User navigates to Grades tab
    ↓
Sees updated Math progress bar
    ↓
Sees suggestion: "Keep it up! 1% away from A target"
```

### Flow 3: Weekly Review

```
Sunday evening
    ↓
User opens app
    ↓
Notification: "Your weekly summary is ready! 📊"
    ↓
User taps notification or Summary tab
    ↓
Weekly Summary screen loads:
- Calculations run on data
- Charts generated
- Insights computed
- Motivational message selected
    ↓
User reads summary:
- "12 tasks completed ✅"
- "15.5 hours studied 📚"
- "7-day streak! 🔥"
    ↓
Sees insights:
- "You study best 2-4 PM"
- "Chemistry needs more time"
    ↓
Reads suggestion:
- "Goal for next week: 30min chemistry daily"
    ↓
User feels motivated!
    ↓
Optionally shares or downloads summary
    ↓
Plans next week based on insights
```

### Flow 4: Quick Add with Voice

```
User studying, needs to add task quickly
    ↓
Long-press Quick Add button
    ↓
Microphone activates
    ↓
User speaks: "Math homework chapter 5 due tomorrow"
    ↓
System processes:
- Transcribes speech
- Parses: type=homework, subject=math, due=tomorrow
- Creates draft
    ↓
Shows confirmation card with parsed data
    ↓
User reviews:
- Title: "Chapter 5"
- Type: Homework
- Subject: Math
- Due: Feb 6
- Priority: Medium (default)
    ↓
Clicks "Looks good" or edits if needed
    ↓
Task saved in < 5 seconds total
    ↓
Back to studying!
```

---

## MVP vs Premium Features

### FREE (Enhanced MVP)

**Existing Features (Keep):**
- ✅ All core study timer features
- ✅ Unlimited subjects
- ✅ Unlimited study sessions
- ✅ Basic statistics (current week)
- ✅ Streak tracking
- ✅ XP and leveling
- ✅ Local data storage

**New FREE Features:**
- ✅ Task categories (Homework/Quiz/Exam/Project)
- ✅ Priority levels (Low/Medium/High)
- ✅ Up to 3 reminders per item
- ✅ Basic grade tracking
- ✅ Subject grade averages
- ✅ Weekly summary (basic)
- ✅ Calendar view (current month)
- ✅ Quick add (text only)
- ✅ 50 active assignments limit
- ✅ 30 active tasks limit

### PREMIUM ($4.99/month or $39.99/year)

**Enhanced Existing:**
- ✅ Unlimited reminders per item
- ✅ Email reminders (in addition to browser)
- ✅ SMS reminders (optional)
- ✅ Historical statistics (all-time)
- ✅ Advanced analytics
- ✅ Unlimited assignments
- ✅ Unlimited tasks

**New PREMIUM Features:**
- ✅ **Cloud Backup & Sync**
  - Automatic cloud backup
  - Sync across all devices
  - Web dashboard access
  - Restore from any point
  
- ✅ **Advanced Grade Tracking**
  - Detailed grade analytics
  - What-if grade calculator
  - Grade predictions
  - Trend analysis
  - Export grade reports (PDF)
  
- ✅ **Smart Insights**
  - AI-powered study suggestions
  - Personalized study schedule
  - Productivity patterns
  - Predictive reminders
  - Custom motivation themes
  
- ✅ **Enhanced Calendar**
  - Multi-month view
  - Calendar export (iCal, Google)
  - Recurring tasks
  - Time blocking
  
- ✅ **Quick Add Pro**
  - Voice input
  - Smart task parsing (ML-powered)
  - Bulk add
  - Import from photos (OCR)
  
- ✅ **Weekly Summary Pro**
  - Detailed analytics
  - Comparison with peers (anonymous)
  - Study efficiency score
  - Downloadable PDF reports
  - Share to social media
  
- ✅ **Customization**
  - Custom categories
  - Custom reminder sounds
  - Theme customization
  - Widget layouts

### Feature Comparison Table

| Feature | Free | Premium |
|---------|------|---------|
| **Core Features** |
| Study Timer | ✅ | ✅ |
| Subjects | ✅ Unlimited | ✅ Unlimited |
| Study Sessions | ✅ Unlimited | ✅ Unlimited |
| **Tasks & Organization** |
| Active Assignments | ⚠️ 50 max | ✅ Unlimited |
| Active Tasks | ⚠️ 30 max | ✅ Unlimited |
| Task Categories | ✅ | ✅ |
| Priority Levels | ✅ | ✅ |
| Reminders per Item | ⚠️ 3 max | ✅ Unlimited |
| Recurring Tasks | ❌ | ✅ |
| **Grade Tracking** |
| Basic Grade Input | ✅ | ✅ |
| Subject Averages | ✅ | ✅ |
| Overall GPA | ✅ | ✅ |
| Grade Analytics | ❌ | ✅ |
| What-if Calculator | ❌ | ✅ |
| Grade Predictions | ❌ | ✅ |
| **Statistics** |
| Current Week | ✅ | ✅ |
| Historical Data | ❌ | ✅ All-time |
| Study Insights | ⚠️ Basic | ✅ Advanced AI |
| **Calendar** |
| Current Month | ✅ | ✅ |
| Multi-month View | ❌ | ✅ |
| Calendar Export | ❌ | ✅ |
| **Quick Add** |
| Text Input | ✅ | ✅ |
| Voice Input | ❌ | ✅ |
| Smart Parsing | ⚠️ Basic | ✅ ML-Powered |
| **Data & Sync** |
| Local Storage | ✅ | ✅ |
| Cloud Backup | ❌ | ✅ Auto |
| Multi-device Sync | ❌ | ✅ Real-time |
| Data Export | ✅ JSON | ✅ JSON + PDF |
| **Weekly Summary** |
| Basic Summary | ✅ | ✅ |
| Detailed Analytics | ❌ | ✅ |
| PDF Report | ❌ | ✅ |
| **Support** |
| Community Support | ✅ | ✅ |
| Priority Support | ❌ | ✅ |
| **Price** | **FREE** | **$4.99/mo or $39.99/yr** |

---

## UX Decisions & Rationale

### Decision 1: Category Icons Instead of Colors Only

**Why:**
- Colorblind accessibility
- Faster visual scanning
- Works in grayscale
- International recognition

**Implementation:**
- 📝 Homework (Blue + Icon)
- 📋 Quiz (Orange + Icon)
- 📚 Exam (Red + Icon)
- 🎯 Project (Purple + Icon)

### Decision 2: Gentle Reminders, Not Pressure

**Why:**
- Students already face pressure
- Avoid anxiety-inducing notifications
- Positive psychology approach
- Encourage without guilt

**Examples:**
- ✅ "Gentle reminder: Math homework due tomorrow"
- ❌ "URGENT! You're running out of time!"
- ✅ "You've got this! Chemistry exam in 2 days"
- ❌ "Warning: You're behind schedule"

### Decision 3: Optional Grade Tracking

**Why:**
- Not all students want to track grades
- Some schools don't use traditional grading
- Reduces pressure for some users
- Can be enabled later

**Implementation:**
- Disabled by default
- Prompt: "Want to track grades for better insights?"
- Can enable per subject
- Easy to hide if not used

### Decision 4: Weekly Summary on Sundays

**Why:**
- Natural week end reflection
- Time to plan next week
- Less intrusive than daily
- Aligns with school week (Mon-Fri)

**Customization:**
- Can choose different day (Premium)
- Can disable notifications
- Always accessible in Summary tab

### Decision 5: Quick Add with Progressive Disclosure

**Why:**
- Fast for power users
- Not overwhelming for beginners
- Learns user patterns
- Reduces friction

**Flow:**
1. FAB visible (simple +)
2. Click → Quick menu (fast options)
3. Select type → Smart input
4. Auto-fill when possible
5. Expand for more details if needed

### Decision 6: Calendar View as Option, Not Default

**Why:**
- List view easier for most students
- Calendar better for visual planners
- Toggle available
- Saves screen space

**Implementation:**
- List view default
- Calendar icon in header
- Remembers preference
- Both views equally accessible

### Decision 7: Grade Target is Aspirational, Not Required

**Why:**
- Motivation tool, not pressure
- Optional per subject
- Shows "path to goal"
- Positive framing

**Example:**
- Current: 87% (B+)
- Target: 90% (A-)
- Message: "Great progress! 3% away from your goal"
- Not: "You're falling short"

### Decision 8: Smart Suggestions, Not Mandates

**Why:**
- Insights are helpful
- Mandates create resistance
- User maintains control
- Gentle nudges work better

**Tone:**
- ✅ "You might enjoy studying chemistry in the evening"
- ❌ "You must study chemistry every evening"
- ✅ "Consider spending more time on history this week"
- ❌ "You need to study history more!"

### Decision 9: Accessibility Built-in, Not Added Later

**Why:**
- Inclusive from start
- Easier to maintain
- Reaches more students
- Legal compliance (ADA, WCAG)

**Features:**
- Minimum font size: 16px
- High contrast ratios (4.5:1)
- Colorblind-safe palette
- Screen reader support
- Keyboard navigation
- Adjustable text size
- Focus indicators

### Decision 10: Offline-First, Cloud-Optional

**Why:**
- Works in schools with bad WiFi
- No dependency on servers
- Privacy-conscious
- Faster performance
- Cloud as backup, not requirement

**Implementation:**
- localStorage primary
- Cloud sync optional (Premium)
- Sync when online
- Conflict resolution
- Local always works

---

## Technical Implementation

### Data Model Updates

```javascript
// Enhanced Assignment/Task Model
{
  id: 'uuid',
  title: 'Chapter 5 Test',
  type: 'exam', // homework, quiz, exam, project
  subjectId: 'uuid',
  dueDate: 'ISO datetime',
  priority: 'high', // low, medium, high
  weight: 50, // For grade calculation
  grade: {
    score: 95,
    scoreType: 'percentage', // percentage, letter, points, passFail
    maxScore: 100, // If points
    letterGrade: 'A', // If letter
    dateGraded: 'ISO date',
    notes: 'Did well on essay portion'
  },
  completed: false,
  completedAt: null,
  reminders: [
    {
      id: 'uuid',
      datetime: 'ISO datetime',
      repeat: 'none', // none, daily, weekly, custom
      repeatDays: [], // [1,3,5] for Mon, Wed, Fri
      sent: false,
      snoozedUntil: null,
      snoozeCount: 0
    }
  ],
  createdAt: 'ISO date',
  updatedAt: 'ISO date'
}

// Subject Model Enhancement
{
  id: 'uuid',
  name: 'Mathematics',
  color: '#3498DB',
  icon: '📘',
  totalMinutes: 1500,
  gradeTarget: 93, // Optional target percentage
  currentGrade: 92.5,
  gradeHistory: [
    {
      assignmentId: 'uuid',
      score: 95,
      weight: 10,
      date: 'ISO date'
    }
  ],
  credits: 4 // For GPA calculation
}

// Weekly Summary Model
{
  weekStart: 'ISO date',
  weekEnd: 'ISO date',
  tasksCompleted: 12,
  studyMinutes: 930, // 15.5 hours
  streakDays: 7,
  levelReached: 18,
  subjectBreakdown: [
    { subjectId: 'uuid', minutes: 270, percentage: 29 }
  ],
  mostProductiveTime: { start: 14, end: 16, percentage: 40 },
  insights: [
    { type: 'productive_time', message: 'Your most productive time: 2-4 PM' },
    { type: 'needs_attention', message: 'Chemistry needs more attention', subjectId: 'uuid' }
  ],
  motivationalMessage: 'Amazing! You've studied 7 days in a row! 🔥',
  goalForNextWeek: 'Study chemistry for at least 30 minutes daily'
}

// User Preferences Enhancement
{
  userId: 'uuid',
  preferences: {
    weekStartDay: 0, // 0 = Sunday
    summaryNotifications: true,
    reminderNotifications: true,
    gradeTrackingEnabled: true,
    fontSize: 'medium', // small, medium, large
    colorBlindMode: false,
    defaultTaskPriority: 'medium',
    defaultReminderTime: 3600000, // 1 hour in ms
    voiceInputEnabled: false // Premium
  }
}
```

### New Classes/Modules

```javascript
// ReminderManager.js
class ReminderManager {
  scheduleReminder(reminder) {
    // Use setTimeout or Notification API
  }
  
  cancelReminder(reminderId) {
    // Clear scheduled notification
  }
  
  snoozeReminder(reminderId, duration) {
    // Reschedule for later
  }
  
  checkDueReminders() {
    // Called periodically to send notifications
  }
}

// GradeCalculator.js
class GradeCalculator {
  calculateSubjectAverage(grades) {
    // Weighted average
  }
  
  calculateGPA(subjects) {
    // Overall GPA on 4.0 scale
  }
  
  convertToLetterGrade(percentage) {
    // Percentage → Letter
  }
  
  whatIfCalculation(currentGrades, upcomingWeight, targetGrade) {
    // "What score do I need?"
  }
  
  predictFinalGrade(currentGrades, remainingAssignments) {
    // Based on average performance
  }
}

// InsightsEngine.js
class InsightsEngine {
  analyzeStudyPatterns(sessions) {
    // Find best study times, patterns
  }
  
  generateWeeklySummary(userData) {
    // Compile all weekly data
  }
  
  generateMotivationalMessage(context) {
    // Context-aware motivation
  }
  
  identifyTrends(historicalData) {
    // Improvement, decline, consistency
  }
  
  suggestGoals(currentPerformance) {
    // Realistic next week goals
  }
}

// QuickAddParser.js
class QuickAddParser {
  parseText(input) {
    // "Math homework due tomorrow" → structured data
  }
  
  parseVoice(transcript) {
    // Voice → text → structured data
  }
  
  extractType(text) {
    // Identify homework, quiz, exam, project
  }
  
  extractSubject(text, knownSubjects) {
    // Match to existing subjects
  }
  
  extractDueDate(text) {
    // "tomorrow", "next Monday", "Feb 10"
  }
  
  extractPriority(text) {
    // "urgent", "important", "high priority"
  }
}

// CalendarManager.js
class CalendarManager {
  generateMonthView(year, month, items) {
    // Create calendar grid with items
  }
  
  getItemsForDate(date) {
    // Filter items by specific date
  }
  
  exportToICal(items) {
    // Generate .ics file
  }
  
  importFromICal(icsData) {
    // Parse .ics file
  }
}
```

### Performance Optimizations

```javascript
// Lazy loading for heavy features
const CalendarView = lazy(() => import('./CalendarView'));
const GradeTracker = lazy(() => import('./GradeTracker'));
const WeeklySummary = lazy(() => import('./WeeklySummary'));

// Debounce expensive calculations
const debouncedGradeCalc = debounce(calculateAllGrades, 300);
const debouncedInsights = debounce(generateInsights, 500);

// Cache computed values
let gradeCache = {
  subjectAverages: {},
  overallGPA: null,
  lastCalculated: null
};

// Recalculate only when data changes
if (hasGradeDataChanged() || isCacheStale()) {
  recalculateGrades();
} else {
  return gradeCache;
}

// Virtualized lists for long assignment lists
import { FixedSizeList } from 'react-window';

// Indexed DB for large datasets (Premium)
const db = await openDB('studyBuddy', 1, {
  upgrade(db) {
    db.createObjectStore('sessions', { keyPath: 'id' });
    db.createObjectStore('grades', { keyPath: 'id' });
  }
});
```

---

## Summary

### What's New in v3.0

1. ✅ **Custom Reminders** - Schedule notifications, snooze, repeat
2. ✅ **Task Categories** - Homework, Quiz, Exam, Project
3. ✅ **Grade Tracker** - Input grades, calculate GPA, track targets
4. ✅ **Weekly Summary** - Insights, motivation, smart suggestions
5. ✅ **Quick Add** - Fast task creation, voice input (Premium)
6. ✅ **Calendar View** - Visual planning with color-coded categories
7. ✅ **Enhanced Accessibility** - Better fonts, colors, navigation

### Maintained Principles

- ✅ Clean, simple interface
- ✅ Fast performance (< 100ms UI)
- ✅ Offline-first functionality
- ✅ Privacy-respecting
- ✅ Student-friendly design
- ✅ Progressive feature disclosure
- ✅ Generous free tier

### Implementation Priority

**Phase 1 (Core):**
1. Task categories
2. Priority indicators
3. Basic reminders
4. Grade input
5. Weekly summary

**Phase 2 (Enhancement):**
1. Calendar view
2. Smart insights
3. Quick add (text)
4. Grade calculator

**Phase 3 (Premium):**
1. Cloud sync
2. Voice input
3. Advanced analytics
4. ML-powered suggestions

---

**Ready for implementation!** 🚀
