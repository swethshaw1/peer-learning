import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { projectApi, applicationApi, taskApi, notificationApi } from '../api';
import { useAuthStore } from '../store/authStore';
import { useCohort } from './CohortContext';
import { Project, Application, Task, ActivityItem, User, Cohort, ApplicationStatus, TaskStatus } from '../types'

interface ProjectContextType {
  projects: Project[];
  hostedProjects: Project[];
  enrolledProjects: Project[];
  applications: Application[];
  projectApplications: Application[];
  tasks: Task[];
  projectTasks: Task[];
  activities: ActivityItem[];
  isLoading: boolean;
  refreshData: () => Promise<void>;
  updateApplicationStatus: (appId: string, status: ApplicationStatus) => Promise<void>;
  fetchProjectApplications: (projectId: string) => Promise<void>;
  fetchProjectTasks: (projectId: string) => Promise<void>;
  updateTaskStatus: (taskId: string, status: TaskStatus) => Promise<void>;
  createTask: (data: any) => Promise<void>;
  createProject: (data: any) => Promise<Project>;
  submitTask: (taskId: string, data: any) => Promise<void>;
  reviewTask: (taskId: string, data: { status: string; feedback: string }) => Promise<void>;
  markActivityRead: (actId: string) => Promise<void>;
}


const ProjectContext = createContext<ProjectContextType | null>(null);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const { user } = useAuthStore();
  const { activeCohort, allCohorts } = useCohort();
  const [hostedProjects, setHostedProjects] = useState<Project[]>([]);
  const [enrolledProjects, setEnrolledProjects] = useState<Project[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [projectApplications, setProjectApplications] = useState<Application[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projectTasks, setProjectTasks] = useState<Task[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Find the ID of the active cohort name
  const activeCohortId = allCohorts.find(c => c.name === activeCohort)?._id;

  const refreshData = useCallback(async () => {
    if (!user?._id) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const [hRes, eRes, aRes, tRes, nRes, allRes] = await Promise.all([
        projectApi.getHosted(user._id),
        projectApi.getEnrolled(user._id, { cohortId: activeCohortId }),
        applicationApi.getByUser(user._id),
        taskApi.getByUser(user._id),
        projectApi.getActivities(user._id),
        projectApi.getAll({ cohortId: activeCohortId })
      ]);

      if (hRes.data.success) setHostedProjects(hRes.data.data);
      if (eRes.data.success) setEnrolledProjects(eRes.data.data);
      if (aRes.data.success) setApplications(aRes.data.data);
      if (tRes.data.success) setTasks(tRes.data.data);
      if (nRes.data.success) setActivities(nRes.data.data);
      if (allRes.data.success) setAllProjects(allRes.data.data);

    } catch (err) {
      console.error('Project data fetch failed:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?._id, activeCohortId]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const fetchProjectApplications = async (projectId: string) => {
    try {
      const res = await applicationApi.getByProject(projectId);
      if (res.data.success) {
        setProjectApplications(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch project applications', err);
    }
  };

  const updateApplicationStatus = async (appId: string, status: ApplicationStatus) => {
    try {
      const res = await applicationApi.updateStatus(appId, status);
      await refreshData();

      // If we have the project ID from the updated application, refresh that project's pipeline
      if (res.data?.data?.projectId) {
        await fetchProjectApplications(res.data.data.projectId);
      }
    } catch (err) {
      console.error('Failed to update application status', err);
    }
  };

  const updateTaskStatus = async (taskId: string, status: TaskStatus) => {
    try {
      await taskApi.updateStatus(taskId, status);
      await refreshData();
    } catch (err) {
      console.error('Failed to update task status', err);
    }
  };

  const fetchProjectTasks = async (projectId: string) => {
    try {
      const res = await taskApi.getByProject(projectId);
      if (res.data.success) setProjectTasks(res.data.data);
    } catch (err) {
      console.error('Failed to fetch project tasks', err);
    }
  };

  const createProject = async (data: any) => {
    try {
      const res = await projectApi.create(data);
      await refreshData();
      return res.data.data;
    } catch (err) {
      console.error('Failed to create project', err);
      throw err;
    }
  };

  const createTask = async (data: any) => {
    try {
      await taskApi.create(data);
      await refreshData();
    } catch (err) {
      console.error('Failed to create task', err);
      throw err;
    }
  };

  const submitTask = async (taskId: string, data: any) => {
    try {
      await taskApi.submit(taskId, data);
      await refreshData();
    } catch (err) {
      console.error('Failed to submit task', err);
      throw err;
    }
  };

  const reviewTask = async (taskId: string, data: { status: string; feedback: string }) => {
    try {
      await taskApi.review(taskId, data);
      await refreshData();
    } catch (err) {
      console.error('Failed to review task', err);
      throw err;
    }
  };

  const markActivityRead = async (actId: string) => {
    try {
      await notificationApi.markRead(actId);
      await refreshData();
    } catch (err) {
      console.error('Failed to mark activity read', err);
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projects: allProjects,
        hostedProjects,
        enrolledProjects,
        applications,
        projectApplications,
        tasks,
        projectTasks,
        activities,
        isLoading,
        refreshData,
        updateApplicationStatus,
        fetchProjectApplications,
        fetchProjectTasks,
        updateTaskStatus,
        createTask,
        createProject,
        submitTask,
        reviewTask,
        markActivityRead,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );

}

export function useProject() {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error('useProject must be used within ProjectProvider');
  return ctx;
}
