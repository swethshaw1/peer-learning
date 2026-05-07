import { Cohort, User, Project, Application, Task, ActivityItem } from '../types';

export const currentUserId = 'user-1';

export const cohorts: Cohort[] = [];
export const users: User[] = [
  {
    id: 'user-1',
    name: 'User',
    avatar: '',
    email: 'user@peerlearning.com',
    skills: [],
    role: 'Student',
    reputation: 5,
    completedProjects: 0,
    isVerified: true,
  }
];
export const projects: Project[] = [];
export const applications: Application[] = [];
export const tasks: Task[] = [];
export const activities: ActivityItem[] = [];

export function getUserById(id: string): User | undefined {
  return users.find(u => u.id === id);
}

export function getProjectById(id: string): Project | undefined {
  return projects.find(p => p.id === id);
}

export function getCohortById(id: string): Cohort | undefined {
  return cohorts.find(c => c.id === id);
}

export function getApplicationsForProject(projectId: string): Application[] {
  return applications.filter(a => a.projectId === projectId);
}

export function getApplicationsForUser(userId: string): Application[] {
  return applications.filter(a => a.userId === userId);
}

export function getTasksForProject(projectId: string): Task[] {
  return tasks.filter(t => t.projectId === projectId);
}

export function getTasksForUser(userId: string): Task[] {
  return tasks.filter(t => t.assigneeId === userId);
}

export function getHostedProjects(userId: string): Project[] {
  return projects.filter(p => p.hostId === userId);
}

export function getEnrolledProjects(userId: string): Project[] {
  return projects.filter(p =>
    p.roles.some(r => r.assignedUserId === userId) && p.hostId !== userId
  );
}

export function getProjectsForCohort(cohortId: string): Project[] {
  return projects.filter(p => p.cohortId === cohortId);
}
