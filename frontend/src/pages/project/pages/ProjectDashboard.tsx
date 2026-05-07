import React from 'react';
import ActiveCohorts from '../../../components/project/dashboard/ActiveCohorts';
import HostWorkspace from '../../../components/project/dashboard/HostWorkspace';
import ActivityLog from '../../../components/project/dashboard/ActivityLog';
import ApplicationTracker from '../../../components/project/dashboard/ApplicationTracker';
import KanbanBoard from '../../../components/project/dashboard/KanbanBoard';
import { useProject } from '../../../context/ProjectContext';
import { useAuthStore } from '../../../store/authStore';
import { FolderKanban, ClipboardCheck, Users, Briefcase, Sparkles, Layers, Activity } from 'lucide-react';

const ProjectDashboard: React.FC = () => {
  const { hostedProjects, enrolledProjects, tasks, applications, isLoading } = useProject();
  const { user } = useAuthStore();

  const myTasks = tasks; 
  const myApps = applications; 
  
  const activeTasks = myTasks.filter(t => t.status !== 'done').length;
  const pendingReviews = myTasks.filter(t => t.status === 'in-review').length;

  return (
    <div className="mx-auto space-y-8 pb-12 transition-colors duration-300">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-900/80 dark:to-indigo-900/80 rounded-3xl p-8 md:p-10 shadow-lg shadow-blue-500/10">
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
        <div className="absolute right-0 top-0 w-1/2 h-full bg-white opacity-5 mix-blend-overlay transform skew-x-12 translate-x-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3 tracking-tight mb-2">
              Welcome back, {user?.name?.split(' ')[0]}! 
              <Sparkles className="text-amber-400 animate-pulse" size={28} />
            </h1>
            <p className="text-blue-100 font-medium text-sm md:text-base max-w-xl">
              Here is an overview of your active projects, pending tasks, and recent applications.
            </p>
          </div>

          {/* Banner Mini-Stats */}
          <div className="flex flex-wrap gap-4 md:gap-8 bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/20 rounded-2xl p-5 shadow-inner">
            <div className="flex flex-col">
              <span className="text-3xl font-black text-white leading-none">{hostedProjects.length}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-200 mt-1.5 flex items-center gap-1">
                <Layers size={12} /> Hosted
              </span>
            </div>
            <div className="w-px bg-white/20 hidden sm:block"></div>
            <div className="flex flex-col">
              <span className="text-3xl font-black text-white leading-none">{enrolledProjects.length}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-200 mt-1.5 flex items-center gap-1">
                <Briefcase size={12} /> Enrolled
              </span>
            </div>
            <div className="w-px bg-white/20 hidden sm:block"></div>
            <div className="flex flex-col">
              <span className="text-3xl font-black text-white leading-none">{activeTasks}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-200 mt-1.5 flex items-center gap-1">
                <Activity size={12} /> Active Tasks
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Projects */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
          <div className="flex items-center gap-5">
            <div className="h-14 w-14 shrink-0 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
              <FolderKanban size={26} strokeWidth={2} />
            </div>
            <div>
              <h4 className="text-3xl font-black text-slate-900 dark:text-white leading-none mb-1">
                {hostedProjects.length + enrolledProjects.length}
              </h4>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total Projects
              </p>
            </div>
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
          <div className="flex items-center gap-5">
            <div className="h-14 w-14 shrink-0 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <ClipboardCheck size={26} strokeWidth={2} />
            </div>
            <div>
              <h4 className="text-3xl font-black text-slate-900 dark:text-white leading-none mb-1">
                {myTasks.filter(t => t.status === 'done').length}
              </h4>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Completed Tasks
              </p>
            </div>
          </div>
        </div>

        {/* Applications Sent */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
          <div className="flex items-center gap-5">
            <div className="h-14 w-14 shrink-0 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
              <Briefcase size={26} strokeWidth={2} />
            </div>
            <div>
              <h4 className="text-3xl font-black text-slate-900 dark:text-white leading-none mb-1">
                {myApps.length}
              </h4>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Applications Sent
              </p>
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
          <div className="flex items-center gap-5">
            <div className="h-14 w-14 shrink-0 rounded-xl bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center text-violet-600 dark:text-violet-400 group-hover:scale-110 transition-transform">
              <Users size={26} strokeWidth={2} />
            </div>
            <div>
              <h4 className="text-3xl font-black text-slate-900 dark:text-white leading-none mb-1">
                {hostedProjects.reduce((sum, p) => sum + (p.currentParticipants || 0), 0)}
              </h4>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Team Members
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Sections Wrapper */}
      <div className="space-y-8">
        
        {/* Active Projects Container */}
        <div className="rounded-3xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50">
          <ActiveCohorts />
        </div>

        {/* Host Workspace Container */}
        <div className="rounded-3xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50">
          <HostWorkspace />
        </div>

        {/* Two Column Grid: Activity & Tracker */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="rounded-3xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50 h-full">
            <ActivityLog />
          </div>
          <div className="rounded-3xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50 h-full">
            <ApplicationTracker />
          </div>
        </div>

        {/* Kanban Board Container */}
        <div className="rounded-3xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50">
          <KanbanBoard />
        </div>

      </div>
    </div>
  );
};

export default ProjectDashboard;