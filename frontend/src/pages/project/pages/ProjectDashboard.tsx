import React from 'react';
import ActiveCohorts from '../../../components/project/dashboard/ActiveCohorts';
import HostWorkspace from '../../../components/project/dashboard/HostWorkspace';
import ActivityLog from '../../../components/project/dashboard/ActivityLog';
import ApplicationTracker from '../../../components/project/dashboard/ApplicationTracker';
import KanbanBoard from '../../../components/project/dashboard/KanbanBoard';
import { useProject } from '../../../context/ProjectContext';
import { useAuthStore } from '../../../store/authStore';
import { FolderKanban, ClipboardCheck, Users, Briefcase, Sparkles, Layers, Activity, Clock } from 'lucide-react';

const ProjectDashboard: React.FC = () => {
  const { hostedProjects, enrolledProjects, tasks, applications, isLoading } = useProject();
  const { user } = useAuthStore();

  const myTasks = tasks; 
  const myApps = applications; 
  
  const activeTasks = myTasks.filter(t => t.status !== 'done').length;
  const pendingReviews = myTasks.filter(t => t.status === 'in-review').length;

  return (
    <div className=" mx-auto space-y-10 md:space-y-12 pb-16 animate-in fade-in duration-700 ease-out">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 dark:from-blue-900/90 dark:via-indigo-900/90 dark:to-violet-900/90 rounded-[2rem] p-8 md:p-10 shadow-2xl shadow-blue-600/20 group">
        {/* Decorative Background Patterns */}
        <div className="absolute inset-0 opacity-[0.07] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay" />
        <div className="absolute right-0 top-0 w-2/3 h-full bg-gradient-to-l from-white/10 to-transparent mix-blend-overlay transform skew-x-12 translate-x-20 transition-transform duration-1000 group-hover:translate-x-10" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-8">
          <div className="animate-in slide-in-from-left-8 fade-in duration-700 delay-100 fill-mode-both">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-[11px] font-extrabold uppercase tracking-widest ring-1 ring-inset ring-white/30 mb-4 shadow-sm backdrop-blur-md">
              <Sparkles size={12} className="text-amber-300" /> Workspace Overview
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white flex items-center gap-3 tracking-tight mb-3 leading-tight drop-shadow-sm">
              Welcome back, {user?.name?.split(' ')[0] || 'Builder'}! 
            </h1>
            <p className="text-blue-100 font-medium text-base md:text-lg max-w-2xl leading-relaxed">
              Here is your command center. Track active cohorts, review team submissions, and manage your daily tasks.
            </p>
          </div>

          {/* Banner Mini-Stats (Glassmorphic) */}
          <div className="flex flex-wrap lg:flex-nowrap gap-5 md:gap-8 bg-white/10 dark:bg-black/20 backdrop-blur-md ring-1 ring-inset ring-white/20 rounded-[1.5rem] p-6 shadow-xl animate-in slide-in-from-right-8 fade-in duration-700 delay-200 fill-mode-both">
            <div className="flex flex-col">
              <span className="text-3xl md:text-4xl font-black text-white leading-none tracking-tighter drop-shadow-sm">{hostedProjects.length}</span>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-200 mt-2 flex items-center gap-1.5">
                <Layers size={14} /> Hosted
              </span>
            </div>
            <div className="w-px bg-white/20 hidden sm:block" />
            <div className="flex flex-col">
              <span className="text-3xl md:text-4xl font-black text-white leading-none tracking-tighter drop-shadow-sm">{enrolledProjects.length}</span>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-200 mt-2 flex items-center gap-1.5">
                <Briefcase size={14} /> Enrolled
              </span>
            </div>
            <div className="w-px bg-white/20 hidden sm:block" />
            <div className="flex flex-col">
              <span className="text-3xl md:text-4xl font-black text-white leading-none tracking-tighter drop-shadow-sm">{activeTasks}</span>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-200 mt-2 flex items-center gap-1.5">
                <Activity size={14} /> Active Tasks
              </span>
            </div>
            <div className="w-px bg-white/20 hidden sm:block" />
            <div className="flex flex-col">
              <span className={`text-3xl md:text-4xl font-black leading-none tracking-tighter drop-shadow-sm ${pendingReviews > 0 ? 'text-amber-300' : 'text-white'}`}>{pendingReviews}</span>
              <span className={`text-[10px] font-extrabold uppercase tracking-widest mt-2 flex items-center gap-1.5 ${pendingReviews > 0 ? 'text-amber-200' : 'text-blue-200'}`}>
                <Clock size={14} /> In Review
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Projects */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl ring-1 ring-inset ring-slate-200/80 dark:ring-slate-800 rounded-[1.5rem] p-6 shadow-xl shadow-slate-200/20 dark:shadow-slate-900/40 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1.5 transition-all duration-500 group animate-in slide-in-from-bottom-8 fade-in duration-500 delay-[100ms] fill-mode-both">
          <div className="flex items-center gap-5">
            <div className="h-14 w-14 shrink-0 rounded-[1rem] bg-blue-50 dark:bg-blue-500/10 ring-1 ring-inset ring-blue-200/50 dark:ring-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-500 shadow-inner">
              <FolderKanban size={26} strokeWidth={2.5} />
            </div>
            <div>
              <h4 className="text-3xl font-black text-slate-900 dark:text-white leading-none tracking-tight mb-1.5">
                {hostedProjects.length + enrolledProjects.length}
              </h4>
              <p className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Total Projects
              </p>
            </div>
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl ring-1 ring-inset ring-slate-200/80 dark:ring-slate-800 rounded-[1.5rem] p-6 shadow-xl shadow-slate-200/20 dark:shadow-slate-900/40 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1.5 transition-all duration-500 group animate-in slide-in-from-bottom-8 fade-in duration-500 delay-[200ms] fill-mode-both">
          <div className="flex items-center gap-5">
            <div className="h-14 w-14 shrink-0 rounded-[1rem] bg-emerald-50 dark:bg-emerald-500/10 ring-1 ring-inset ring-emerald-200/50 dark:ring-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-500 shadow-inner">
              <ClipboardCheck size={26} strokeWidth={2.5} />
            </div>
            <div>
              <h4 className="text-3xl font-black text-slate-900 dark:text-white leading-none tracking-tight mb-1.5">
                {myTasks.filter(t => t.status === 'done').length}
              </h4>
              <p className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Completed Tasks
              </p>
            </div>
          </div>
        </div>

        {/* Applications Sent */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl ring-1 ring-inset ring-slate-200/80 dark:ring-slate-800 rounded-[1.5rem] p-6 shadow-xl shadow-slate-200/20 dark:shadow-slate-900/40 hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-1.5 transition-all duration-500 group animate-in slide-in-from-bottom-8 fade-in duration-500 delay-[300ms] fill-mode-both">
          <div className="flex items-center gap-5">
            <div className="h-14 w-14 shrink-0 rounded-[1rem] bg-amber-50 dark:bg-amber-500/10 ring-1 ring-inset ring-amber-200/50 dark:ring-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform duration-500 shadow-inner">
              <Briefcase size={26} strokeWidth={2.5} />
            </div>
            <div>
              <h4 className="text-3xl font-black text-slate-900 dark:text-white leading-none tracking-tight mb-1.5">
                {myApps.length}
              </h4>
              <p className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Applications Sent
              </p>
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl ring-1 ring-inset ring-slate-200/80 dark:ring-slate-800 rounded-[1.5rem] p-6 shadow-xl shadow-slate-200/20 dark:shadow-slate-900/40 hover:shadow-2xl hover:shadow-violet-500/10 hover:-translate-y-1.5 transition-all duration-500 group animate-in slide-in-from-bottom-8 fade-in duration-500 delay-[400ms] fill-mode-both">
          <div className="flex items-center gap-5">
            <div className="h-14 w-14 shrink-0 rounded-[1rem] bg-violet-50 dark:bg-violet-500/10 ring-1 ring-inset ring-violet-200/50 dark:ring-violet-500/30 flex items-center justify-center text-violet-600 dark:text-violet-400 group-hover:scale-110 transition-transform duration-500 shadow-inner">
              <Users size={26} strokeWidth={2.5} />
            </div>
            <div>
              <h4 className="text-3xl font-black text-slate-900 dark:text-white leading-none tracking-tight mb-1.5">
                {hostedProjects.reduce((sum, p) => sum + (p.currentParticipants || 0), 0)}
              </h4>
              <p className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Team Capacity
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Sections Flow (Using the previously upgraded internal components directly) */}
      <div className="space-y-10 md:space-y-12 pt-4">
        
        {/* Active Projects */}
        <div className="animate-in slide-in-from-bottom-8 fade-in duration-700 delay-300 fill-mode-both">
          <ActiveCohorts />
        </div>

        {/* Host Workspace */}
        {hostedProjects.length > 0 && (
          <div className="animate-in slide-in-from-bottom-8 fade-in duration-700 delay-500 fill-mode-both">
            <HostWorkspace />
          </div>
        )}

        {/* Two Column Grid: Activity & Tracker */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch animate-in slide-in-from-bottom-8 fade-in duration-700 delay-700 fill-mode-both">
          <ActivityLog />
          <ApplicationTracker />
        </div>

        {/* Kanban Board Container */}
        <div className="animate-in slide-in-from-bottom-8 fade-in duration-700 delay-1000 fill-mode-both pt-4">
          <KanbanBoard />
        </div>

      </div>
    </div>
  );
};

export default ProjectDashboard;