export type CohortStatus = 'upcoming' | 'active' | 'completed';
export type ProjectStatus = 'hiring' | 'in-progress' | 'completed' | 'archived';
export type ApplicationStatus = 'pending' | 'reviewing' | 'shortlisted' | 'hired' | 'rejected';
export type TaskStatus = 'todo' | 'in-progress' | 'in-review' | 'revision' | 'done';
export type SubmissionReviewStatus = 'pending' | 'approved' | 'needs-revision';
export type ActivityType = 'task_rejected' | 'new_applicant' | 'deadline' | 'task_submitted' | 'accepted' | 'review_given' | 'milestone_completed' | 'general';
export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Badge {
  _id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  earnedAt?: string;
}

export interface User {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  avatar?: string;
  avatarColor?: string;
  role?: string;
  skills?: string[];
  reputation?: number;
  completedProjects?: number;
  isVerified?: boolean;
  badges?: Badge[];
  points?: number;
  enrolledCohorts?: string[];
  enrolledCourses?: string[];
  createdAt?: string;
}

export interface Cohort {
  id?: string;
  _id?: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status?: CohortStatus;
  mentor?: Pick<User, '_id' | 'name' | 'avatar'>;
  activeMembers?: number;
  banner?: string;
  tags?: string[];
  isEnrolled?: boolean;
}

export interface Role {
  id: string;
  title: string;
  description: string;
  skillsRequired: string[];
  filled: boolean;
  assignedUserId?: string;
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending';
  assigneeId?: string;
  progress: number;
}

export interface Project {
  id: string;
  title: string;
  pitch: string;
  description: string;
  problemStatement: string;
  techStack: string[];
  cohortId: string;
  hostId: string;
  roles: Role[];
  status: ProjectStatus;
  progress: number;
  milestones: Milestone[];
  createdAt: string;
  deadline: string;
  maxParticipants: number;
  currentParticipants: number;
}

export interface Application {
  id: string;
  userId: string;
  projectId: string;
  roleId: string;
  status: ApplicationStatus;
  resumeUrl: string;
  portfolioUrl?: string;
  coverNote: string;
  appliedAt: string;
}

export interface Feedback {
  id: string;
  submissionId: string;
  authorId: string;
  comment: string;
  type: 'approval' | 'revision' | 'general';
  createdAt: string;
}

export interface Submission {
  id: string;
  taskId: string;
  userId: string;
  fileUrl: string;
  fileName: string;
  description: string;
  submittedAt: string;
  reviewStatus: SubmissionReviewStatus;
  feedback: Feedback[];
  version: number;
}

export interface Task {
  id: string;
  projectId: string;
  assigneeId: string;
  title: string;
  description: string;
  status: TaskStatus;
  submissions: Submission[];
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export interface ActivityItem {
  id: string;
  type: ActivityType;
  message: string;
  detail: string;
  timestamp: string;
  actionUrl: string;
  read: boolean;
  projectId?: string;
}

// ─── LMS Specific Types ──────────────────────────────────────────────────────────

export interface Lesson {
  _id: string;
  title: string;
  type: 'video' | 'article' | 'resource';
  duration?: string;
  url?: string;
  isCompleted?: boolean;
}

export interface Module {
  _id: string;
  title: string;
  lessons: Lesson[];
  completedCount?: number;
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  thumbnail?: string;
  category: string;
  modules: Module[];
  totalModules: number;
  totalLessons: number;
  completedLessons?: number;
  progressPercent?: number;
  tags: string[];
  cohortId?: string;
  isEnrolled?: boolean;
  isBookmarked?: boolean;
  createdAt: string;
}

export interface Reply {
  _id: string;
  content: string;
  author: Pick<User, '_id' | 'name' | 'avatar'>;
  likes: number;
  createdAt: string;
}

export interface DiscussionPost {
  _id: string;
  title: string;
  content: string;
  author: Pick<User, '_id' | 'name' | 'avatar'>;
  cohortId?: string;
  courseId?: string;
  tags: string[];
  replies: Reply[];
  likes: number;
  views: number;
  createdAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  user: Pick<User, '_id' | 'name' | 'avatar'>;
  points: number;
  coursesCompleted: number;
  badges: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  pages: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchMe: () => Promise<void>;
}

export interface UserActivity {
  _id: string; // date string
  totalScore: number;
  quizzesTaken: number;
}

