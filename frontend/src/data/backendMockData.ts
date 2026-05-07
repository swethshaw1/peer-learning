// Consolidated Mock Data for Backend Update Reference

import type { User, Cohort, Course, DiscussionPost, LeaderboardEntry, Project, Application, Task, ActivityItem } from '../types';

// ─── From src/store/authStore.ts ─────────────────────────────────────────────
export const MOCK_USERS: Record<string, User> = {
  'harshit@peerlearn.dev': {
    _id: 'u1',
    name: 'Harshit Sharma',
    email: 'harshit@peerlearn.dev',
    role: 'student',
    points: 3840,
    badges: [
      { _id: 'b1', name: 'First Steps', icon: '🎓', description: 'Enrolled in first course', color: '#6366f1', earnedAt: '2026-01-12T10:00:00Z' },
      { _id: 'b2', name: 'Fast Learner', icon: '⚡', description: 'Completed 3 lessons in a day', color: '#f59e0b', earnedAt: '2026-01-15T14:30:00Z' },
      { _id: 'b3', name: 'Team Player', icon: '🤝', description: 'Joined a cohort', color: '#10b981', earnedAt: '2026-01-18T09:15:00Z' },
      { _id: 'b4', name: 'Deep Diver', icon: '🔬', description: 'Completed an Advanced module', color: '#8b5cf6', earnedAt: '2026-02-03T16:00:00Z' },
      { _id: 'b5', name: 'Consistent', icon: '🔥', description: 'Kept a 7-day learning streak', color: '#ef4444', earnedAt: '2026-02-10T08:00:00Z' },
      { _id: 'b6', name: 'Forum Star', icon: '💬', description: 'Got 10 upvotes on a discussion', color: '#06b6d4', earnedAt: '2026-03-01T11:45:00Z' },
    ],
    enrolledCourses: ['1', '2', '3'],
    enrolledCohorts: ['c1'],
    createdAt: '2026-01-10T08:00:00Z',
  },
  'sneha@peerlearn.dev': {
    _id: 'u2',
    name: 'Sneha Patel',
    email: 'sneha@peerlearn.dev',
    role: 'student',
    points: 4820,
    badges: [
      { _id: 'b1', name: 'First Steps', icon: '🎓', description: 'Enrolled in first course', color: '#6366f1', earnedAt: '2026-01-10T10:00:00Z' },
      { _id: 'b2', name: 'Fast Learner', icon: '⚡', description: 'Completed 3 lessons in a day', color: '#f59e0b', earnedAt: '2026-01-13T14:30:00Z' },
      { _id: 'b3', name: 'Team Player', icon: '🤝', description: 'Joined a cohort', color: '#10b981', earnedAt: '2026-01-16T09:15:00Z' },
      { _id: 'b4', name: 'Deep Diver', icon: '🔬', description: 'Completed an Advanced module', color: '#8b5cf6', earnedAt: '2026-01-28T16:00:00Z' },
      { _id: 'b5', name: 'Consistent', icon: '🔥', description: 'Kept a 7-day learning streak', color: '#ef4444', earnedAt: '2026-02-05T08:00:00Z' },
      { _id: 'b6', name: 'Forum Star', icon: '💬', description: 'Got 10 upvotes on a discussion', color: '#06b6d4', earnedAt: '2026-02-20T11:45:00Z' },
      { _id: 'b7', name: 'Top Learner', icon: '🏆', description: 'Ranked #1 on the leaderboard', color: '#f59e0b', earnedAt: '2026-03-01T00:00:00Z' },
    ],
    enrolledCourses: ['1', '2', '3', '4', '5'],
    enrolledCohorts: ['c1'],
    createdAt: '2026-01-10T07:00:00Z',
  },
  'aman@peerlearn.dev': {
    _id: 'u3',
    name: 'Aman Verma',
    email: 'aman@peerlearn.dev',
    role: 'mentor',
    points: 9200,
    badges: [
      { _id: 'b1', name: 'First Steps', icon: '🎓', description: 'Enrolled in first course', color: '#6366f1' },
      { _id: 'b2', name: 'Mentor', icon: '🧑‍🏫', description: 'Leading an active cohort', color: '#8b5cf6' },
      { _id: 'b3', name: 'Top Learner', icon: '🏆', description: 'Ranked #1 on the leaderboard', color: '#f59e0b' },
    ],
    enrolledCourses: [],
    enrolledCohorts: [],
    createdAt: '2025-12-01T08:00:00Z',
  },
};

// ─── From src/lib/mockData.ts ─────────────────────────────────────────────
const THUMBS = {
  js: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&q=80',
  react: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&q=80',
  node: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=80',
  python: 'https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?w=400&q=80',
  css: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
  git: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400&q=80',
  mongo: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&q=80',
  ts: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&q=80',
  dsa: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&q=80',
  system: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=80',
  flutter: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&q=80',
  devops: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400&q=80',
};

export const MOCK_COURSES: Course[] = [
  {
    _id: '1',
    title: 'JavaScript: From Zero to Hero',
    description: 'The most comprehensive JavaScript course. Master variables, closures, async/await, the event loop, DOM manipulation, ES6+ features, and build 5 real projects along the way.',
    difficulty: 'Beginner',
    category: 'Web Dev',
    thumbnail: THUMBS.js,
    tags: ['JavaScript', 'ES6', 'DOM', 'Async'],
    totalModules: 8,
    totalLessons: 47,
    completedLessons: 21,
    progressPercent: 45,
    isEnrolled: true,
    createdAt: '',
    modules: [
      {
        _id: 'm1', title: 'Getting Started', completedCount: 3,
        lessons: [
          { _id: 'l1', title: 'What is JavaScript & How Browsers Work', type: 'video', duration: '9m', isCompleted: true },
          { _id: 'l2', title: 'Setting Up VS Code + Extensions', type: 'article', isCompleted: true },
          { _id: 'l3', title: 'Your First "Hello World" Program', type: 'video', duration: '6m', isCompleted: true },
        ],
      },
      {
        _id: 'm2', title: 'Variables, Types & Operators', completedCount: 3,
        lessons: [
          { _id: 'l4', title: 'var vs let vs const — The Real Difference', type: 'video', duration: '14m', isCompleted: true },
          { _id: 'l5', title: 'Primitive Types Deep Dive', type: 'video', duration: '11m', isCompleted: true },
          { _id: 'l6', title: 'Type Coercion & Equality Traps', type: 'article', isCompleted: true },
        ],
      },
      {
        _id: 'm3', title: 'Functions & Scope', completedCount: 3,
        lessons: [
          { _id: 'l7', title: 'Function Declarations vs Expressions', type: 'video', duration: '13m', isCompleted: true },
          { _id: 'l8', title: 'Arrow Functions & the `this` Keyword', type: 'video', duration: '16m', isCompleted: true },
          { _id: 'l9', title: 'Closures Explained with Real Examples', type: 'video', duration: '18m', isCompleted: true },
        ],
      },
      {
        _id: 'm4', title: 'Arrays & Objects', completedCount: 3,
        lessons: [
          { _id: 'l10', title: 'Array Methods: map, filter, reduce', type: 'video', duration: '20m', isCompleted: true },
          { _id: 'l11', title: 'Destructuring & Spread Operator', type: 'video', duration: '12m', isCompleted: true },
          { _id: 'l12', title: 'Object-Oriented JS with Classes', type: 'article', isCompleted: true },
        ],
      },
      {
        _id: 'm5', title: 'Async JavaScript', completedCount: 3,
        lessons: [
          { _id: 'l13', title: 'The Event Loop Visualized', type: 'video', duration: '22m', isCompleted: true },
          { _id: 'l14', title: 'Promises from Scratch', type: 'video', duration: '19m', isCompleted: true },
          { _id: 'l15', title: 'Async/Await Best Practices', type: 'video', duration: '17m', isCompleted: true },
        ],
      },
      {
        _id: 'm6', title: 'DOM Manipulation', completedCount: 3,
        lessons: [
          { _id: 'l16', title: 'Selecting & Modifying DOM Elements', type: 'video', duration: '15m', isCompleted: true },
          { _id: 'l17', title: 'Event Listeners & Event Delegation', type: 'video', duration: '18m', isCompleted: true },
          { _id: 'l18', title: 'Building a Todo App — DOM Project', type: 'video', duration: '25m', isCompleted: true },
        ],
      },
      {
        _id: 'm7', title: 'Fetch API & REST', completedCount: 3,
        lessons: [
          { _id: 'l19', title: 'Making HTTP Requests with Fetch', type: 'video', duration: '14m', isCompleted: true },
          { _id: 'l20', title: 'Working with JSON APIs', type: 'video', duration: '16m', isCompleted: true },
          { _id: 'l21', title: 'Weather App Project', type: 'video', duration: '30m', isCompleted: true },
        ],
      },
      {
        _id: 'm8', title: 'Modern JS Tooling', completedCount: 0,
        lessons: [
          { _id: 'l22', title: 'NPM & Module Bundlers', type: 'video', duration: '12m', isCompleted: false },
          { _id: 'l23', title: 'Debugging in Chrome DevTools', type: 'article', isCompleted: false },
          { _id: 'l24', title: 'Capstone: Build a Kanban Board', type: 'video', duration: '45m', isCompleted: false },
          { _id: 'l25', title: 'Further Reading & Resources', type: 'resource', isCompleted: false },
        ],
      },
    ],
  },
  {
    _id: '2',
    title: 'React + TypeScript Masterclass',
    description: 'Build production-grade React apps with TypeScript. Covers hooks, context, Zustand, React Query, component patterns, testing, and deploying to Vercel.',
    difficulty: 'Intermediate',
    category: 'Web Dev',
    thumbnail: THUMBS.react,
    tags: ['React', 'TypeScript', 'Hooks', 'Zustand'],
    totalModules: 7,
    totalLessons: 38,
    completedLessons: 8,
    progressPercent: 21,
    isEnrolled: true,
    createdAt: '',
    modules: [
      {
        _id: 'm1', title: 'React Fundamentals Recap', completedCount: 3,
        lessons: [
          { _id: 'l1', title: 'JSX & Virtual DOM Explained', type: 'video', duration: '12m', isCompleted: true },
          { _id: 'l2', title: 'Props, State & Re-renders', type: 'video', duration: '15m', isCompleted: true },
          { _id: 'l3', title: 'Component Composition Patterns', type: 'article', isCompleted: true },
        ]
      },
      {
        _id: 'm2', title: 'TypeScript for React Devs', completedCount: 3,
        lessons: [
          { _id: 'l4', title: 'Types vs Interfaces', type: 'video', duration: '11m', isCompleted: true },
          { _id: 'l5', title: 'Typing Props, State & Events', type: 'video', duration: '18m', isCompleted: true },
          { _id: 'l6', title: 'Generics in React Components', type: 'video', duration: '16m', isCompleted: true },
        ]
      },
      {
        _id: 'm3', title: 'Hooks Deep Dive', completedCount: 2,
        lessons: [
          { _id: 'l7', title: 'useEffect Patterns & Pitfalls', type: 'video', duration: '22m', isCompleted: true },
          { _id: 'l8', title: 'useRef, useCallback & useMemo', type: 'video', duration: '19m', isCompleted: true },
          { _id: 'l9', title: 'Building Custom Hooks', type: 'video', duration: '20m', isCompleted: false },
        ]
      },
      {
        _id: 'm4', title: 'State Management', completedCount: 0,
        lessons: [
          { _id: 'l10', title: 'Context API at Scale', type: 'video', duration: '16m', isCompleted: false },
          { _id: 'l11', title: 'Zustand from Scratch', type: 'video', duration: '20m', isCompleted: false },
          { _id: 'l12', title: 'React Query for Server State', type: 'video', duration: '24m', isCompleted: false },
        ]
      },
      {
        _id: 'm5', title: 'Routing & Forms', completedCount: 0,
        lessons: [
          { _id: 'l13', title: 'React Router v6 in Depth', type: 'video', duration: '18m', isCompleted: false },
          { _id: 'l14', title: 'React Hook Form + Zod Validation', type: 'video', duration: '22m', isCompleted: false },
        ]
      },
      {
        _id: 'm6', title: 'Testing React Apps', completedCount: 0,
        lessons: [
          { _id: 'l15', title: 'Unit Testing with Vitest', type: 'video', duration: '18m', isCompleted: false },
          { _id: 'l16', title: 'Component Testing with Testing Library', type: 'video', duration: '20m', isCompleted: false },
        ]
      },
      {
        _id: 'm7', title: 'Capstone Project', completedCount: 0,
        lessons: [
          { _id: 'l17', title: 'Build a Full Dashboard App', type: 'video', duration: '60m', isCompleted: false },
          { _id: 'l18', title: 'Deploy to Vercel', type: 'article', isCompleted: false },
        ]
      },
    ],
  },
  {
    _id: '3',
    title: 'Node.js & Express — Backend Engineering',
    description: 'Build scalable REST APIs with Node.js, Express, and MongoDB. Learn authentication, middleware, file uploads, caching with Redis, and deploy to Railway.',
    difficulty: 'Intermediate',
    category: 'Backend',
    thumbnail: THUMBS.node,
    tags: ['Node.js', 'Express', 'REST', 'JWT', 'Redis'],
    totalModules: 6,
    totalLessons: 32,
    completedLessons: 0,
    progressPercent: 0,
    isEnrolled: true,
    createdAt: '',
    modules: [
      {
        _id: 'm1', title: 'Node.js Core', completedCount: 0,
        lessons: [
          { _id: 'l1', title: 'How Node.js Works — Event Loop & V8', type: 'video', duration: '16m', isCompleted: false },
          { _id: 'l2', title: 'Modules: CommonJS vs ESModules', type: 'video', duration: '12m', isCompleted: false },
          { _id: 'l3', title: 'File System, Streams & Buffers', type: 'article', isCompleted: false },
        ]
      },
      {
        _id: 'm2', title: 'Express Framework', completedCount: 0,
        lessons: [
          { _id: 'l4', title: 'Setting Up Express + Project Structure', type: 'video', duration: '14m', isCompleted: false },
          { _id: 'l5', title: 'Routing Patterns & Controllers', type: 'video', duration: '18m', isCompleted: false },
          { _id: 'l6', title: 'Middleware: Built-in & Custom', type: 'video', duration: '15m', isCompleted: false },
          { _id: 'l7', title: 'Error Handling Middleware', type: 'article', isCompleted: false },
        ]
      },
      {
        _id: 'm3', title: 'Authentication & Security', completedCount: 0,
        lessons: [
          { _id: 'l8', title: 'JWT Auth from Scratch', type: 'video', duration: '24m', isCompleted: false },
          { _id: 'l9', title: 'Bcrypt, Rate Limiting & Helmet', type: 'video', duration: '18m', isCompleted: false },
          { _id: 'l10', title: 'Role-Based Access Control (RBAC)', type: 'video', duration: '20m', isCompleted: false },
        ]
      },
      {
        _id: 'm4', title: 'Database Integration', completedCount: 0,
        lessons: [
          { _id: 'l11', title: 'Mongoose Models & Schema Design', type: 'video', duration: '20m', isCompleted: false },
          { _id: 'l12', title: 'Aggregation Pipelines', type: 'video', duration: '22m', isCompleted: false },
          { _id: 'l13', title: 'Redis Caching Strategies', type: 'video', duration: '18m', isCompleted: false },
        ]
      },
      {
        _id: 'm5', title: 'File Uploads & Email', completedCount: 0,
        lessons: [
          { _id: 'l14', title: 'File Uploads with Multer & Cloudinary', type: 'video', duration: '20m', isCompleted: false },
          { _id: 'l15', title: 'Sending Emails with Nodemailer', type: 'article', isCompleted: false },
        ]
      },
      {
        _id: 'm6', title: 'Deploy & Production', completedCount: 0,
        lessons: [
          { _id: 'l16', title: 'Environment Variables & Config', type: 'article', isCompleted: false },
          { _id: 'l17', title: 'Deploy to Railway', type: 'video', duration: '16m', isCompleted: false },
          { _id: 'l18', title: 'API Documentation with Swagger', type: 'video', duration: '14m', isCompleted: false },
        ]
      },
    ],
  },
];

export const MY_COURSES = MOCK_COURSES.filter(c => c.isEnrolled);
export const MOCK_BOOKMARKS: Course[] = [MOCK_COURSES[0]];
export const MOCK_COHORTS: Cohort[] = [
  {
    _id: 'c1',
    name: 'Web Dev Cohort — Jan 2026',
    description: 'A 6-month intensive cohort covering the full MERN stack.',
    mentor: { _id: 'm1', name: 'Aman Verma', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aman' },
    activeMembers: 48,
    startDate: '2026-01-10',
    endDate: '2026-06-30',
    tags: ['React', 'Node.js', 'MongoDB', 'Full Stack'],
    isEnrolled: true,
  },
];

export const MOCK_DISCUSSIONS: DiscussionPost[] = [];
export const MOCK_LEADERBOARD: LeaderboardEntry[] = [];

// ─── From src/data/mockData.ts ─────────────────────────────────────────────
export const currentUserId = 'user-1';

export const cohorts: Cohort[] = [
  {
    id: 'cohort-1',
    name: 'Spring 2026 Web Dev Batch',
    description: 'Full-stack web development projects using modern frameworks',
    startDate: '2026-03-01',
    endDate: '2026-06-30',
    status: 'active',
  },
];

export const users: User[] = [
  {
    id: 'user-1',
    name: 'Sahil Kumar',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Sahil',
    email: 'sahil@peerlearning.com',
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    role: 'Full Stack Developer',
    reputation: 4.8,
    completedProjects: 5,
    isVerified: true,
  },
];

export const projects: Project[] = [];
export const applications: Application[] = [];
export const tasks: Task[] = [];
export const activities: ActivityItem[] = [];
