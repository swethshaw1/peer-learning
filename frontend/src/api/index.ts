import api from '../lib/axios'
import type { Course, Cohort, DiscussionPost } from '../types'

// ─── Courses ─────────────────────────────────────────────────────────────────
export const courseApi = {
  getAll: (params?: { page?: number; limit?: number; category?: string; search?: string; cohortId?: string }) =>
    api.get('/courses', { params }),

  getById: (id: string) => api.get(`/courses/${id}`),

  enroll: (id: string) => api.post(`/courses/${id}/enroll`),

  getMyCourses: () => api.get('/courses/me/enrolled'),

  completeLesson: (courseId: string, lessonId: string) =>
    api.patch(`/courses/${courseId}/lessons/${lessonId}/complete`),

  getProgress: (courseId: string) => api.get(`/courses/${courseId}/progress`),
}

// ─── Cohorts ─────────────────────────────────────────────────────────────────
export const cohortApi = {
  getAll: () => api.get('/cohorts'),
  getById: (id: string) => api.get(`/cohorts/${id}`),
  join: (id: string) => api.post(`/cohorts/${id}/join`),
  leave: (id: string) => api.post(`/cohorts/${id}/leave`),
  getMyCohorts: () => api.get('/cohorts/me/enrolled'),
}

// ─── Discussion ───────────────────────────────────────────────────────────────
export const discussionApi = {
  getAll: (params?: { cohortId?: string; courseId?: string; page?: number }) =>
    api.get('/discussions', { params }),

  getById: (id: string) => api.get(`/discussions/${id}`),

  create: (data: Partial<DiscussionPost>) => api.post('/discussions', data),

  reply: (id: string, content: string) =>
    api.post(`/discussions/${id}/replies`, { content }),

  like: (id: string) => api.patch(`/discussions/${id}/like`),

  delete: (id: string) => api.delete(`/discussions/${id}`),
}

// ─── Leaderboard ─────────────────────────────────────────────────────────────
export const leaderboardApi = {
  getGlobal: () => api.get('/lms-leaderboard'),
  getCohort: (cohortId: string) => api.get(`/lms-leaderboard/cohort/${cohortId}`),
}

// ─── Bookmarks ────────────────────────────────────────────────────────────────
export const bookmarkApi = {
  getAll: () => api.get('/bookmarks'),
  add: (courseId: string) => api.post('/bookmarks', { courseId }),
  remove: (courseId: string) => api.delete(`/bookmarks/${courseId}`),
}

// ─── Projects ────────────────────────────────────────────────────────────────
export const projectApi = {
  getAll: (params?: { cohortId?: string }) => api.get('/projects', { params }),
  getById: (id: string) => api.get(`/projects/${id}`),
  create: (data: any) => api.post('/projects', data),
  getHosted: (userId: string, params?: { cohortId?: string }) => api.get(`/projects/user/${userId}/hosted`, { params }),
  getEnrolled: (userId: string, params?: { cohortId?: string }) => api.get(`/projects/user/${userId}/enrolled`, { params }),
  getActivities: (userId: string) => api.get(`/projects/user/${userId}/activities`),
}

// ─── Applications ────────────────────────────────────────────────────────────
export const applicationApi = {
  apply: (projectId: string, data: any) => api.post(`/projects/${projectId}/apply`, data),
  getByUser: (userId: string) => api.get(`/applications/user/${userId}`),
  getByProject: (projectId: string) => api.get(`/applications/project/${projectId}`),
  updateStatus: (id: string, status: string) => api.patch(`/applications/${id}/status`, { status }),
}

// ─── Tasks ───────────────────────────────────────────────────────────────────
export const taskApi = {
  getByProject: (projectId: string) => api.get(`/tasks/project/${projectId}`),
  getByUser: (userId: string) => api.get(`/tasks/user/${userId}`),
  updateStatus: (id: string, status: string) => api.patch(`/tasks/${id}/status`, { status }),
  submit: (id: string, data: any) => api.post(`/tasks/${id}/submit`, data),
  create: (data: any) => api.post('/tasks', data),
  review: (id: string, data: { status: string; feedback: string }) => api.post(`/tasks/${id}/review`, data),
}


// ─── Users ───────────────────────────────────────────────────────────────────
export const userApi = {
  login: (data: any) => api.post('/users/login', data),
  register: (data: any) => api.post('/users/register', data),
  getById: (id: string) => api.get(`/users/${id}`),
  update: (id: string, data: any) => api.patch(`/users/${id}`, data),
  updatePassword: (id: string, data: any) => api.put(`/users/${id}/password`, data),
}

// ─── Quiz & Rooms ────────────────────────────────────────────────────────────
export const quizApi = {
  submitResult: (data: any) => api.post('/results', data),
  submitRoomScore: (roomCode: string, data: any) => api.post(`/rooms/submit/${roomCode}`, data),
  getRoom: (roomCode: string) => api.get(`/rooms/${roomCode}`),
}

// ─── Notifications ───────────────────────────────────────────────────────────
export const notificationApi = {
  getAll: (userId: string) => api.get(`/notifications/user/${userId}`),
  markRead: (id: string) => api.patch(`/notifications/${id}/read`),
  markAllRead: (userId: string) => api.patch(`/notifications/user/${userId}/read-all`),
  delete: (id: string) => api.delete(`/notifications/${id}`),
}

// ─── Help Center ─────────────────────────────────────────────────────────────
export const helpApi = {
  createTicket: (data: any) => api.post('/help/ticket', data),
}

// ─── Dashboard ───────────────────────────────────────────────────────────────
export const dashboardApi = {
  getActiveRooms: () => api.get('/rooms/active'),
  getSummary: (cohortId?: string) => api.get('/dashboard/summary', { params: { cohortId } }),
  getActivity: (userId: string) => api.get(`/results/activity/${userId}`),
  getDashboardStats: (userId: string) => api.get(`/quiz/dashboard/${userId}`),
}
