import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  FolderX, 
  LayoutDashboard, 
  Users, 
  CheckSquare, 
  MessageSquare, 
  Target 
} from 'lucide-react';

import ProjectBriefing from '../../../components/project/detail/ProjectBriefing';
import ApplicationPanel from '../../../components/project/detail/ApplicationPanel';
import ShortlistDashboard from '../../../components/project/detail/ShortlistDashboard';
import TaskBoard from '../../../components/project/detail/TaskBoard';
import ReviewFeedback from '../../../components/project/detail/ReviewFeedback';
import MilestoneTracker from '../../../components/project/detail/MilestoneTracker';
import { useProject } from '../../../context/ProjectContext';
import { useAuthStore } from '../../../store/authStore';

type DetailTab = 'overview' | 'hiring' | 'tasks' | 'reviews' | 'milestones';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects } = useProject();
  const { user } = useAuthStore();

  const project = projects.find(p => p.id === id || p._id === id);
  const [activeTab, setActiveTab] = useState<DetailTab>('overview');

  if (!project) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6 relative overflow-hidden group animate-in fade-in duration-500">
        <div className="absolute inset-0 bg-grid-slate-100/[0.05] dark:bg-grid-slate-700/[0.05] bg-[size:20px_20px]" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-rose-500/5 dark:bg-rose-500/10 rounded-full blur-3xl pointer-events-none transition-colors duration-500" />
        
        <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-[2rem] p-10 text-center max-w-md w-full shadow-2xl shadow-slate-200/20 dark:shadow-none flex flex-col items-center hover:-translate-y-1 transition-transform duration-500 ease-out">
          <div className="h-20 w-20 bg-rose-50 dark:bg-rose-500/10 rounded-3xl flex items-center justify-center mb-6 ring-1 ring-inset ring-rose-200/50 dark:ring-rose-500/20 shadow-inner group-hover:scale-110 transition-transform duration-500 ease-out">
            <FolderX size={36} className="text-rose-500 dark:text-rose-400" strokeWidth={2} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
            Project Not Found
          </h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-8 leading-relaxed px-4">
            The project you are looking for doesn't exist, has been removed, or you don't have permission to view it.
          </p>
          <button 
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-sm font-extrabold uppercase tracking-widest rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
            onClick={() => navigate('/project')}
          >
            <ArrowLeft size={16} strokeWidth={2.5} /> Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentUserId = user?._id || user?.id;
  const isHost = project.hostId === currentUserId || (project.hostId as any)?._id === currentUserId || (project.hostId as any)?.id === currentUserId;
  const isParticipant = project.roles.some(r => {
    const assignedId = r.assignedUserId;
    if (!assignedId) return false;
    return assignedId === currentUserId || (assignedId as any)?._id === currentUserId || (assignedId as any)?.id === currentUserId;
  });

  const tabs = [
    { key: 'overview', label: 'Overview', icon: LayoutDashboard, show: true },
    { key: 'hiring', label: 'Hiring Pipeline', icon: Users, show: isHost && (project.status === 'hiring' || project.status === 'in-progress') },
    { key: 'tasks', label: 'Tasks', icon: CheckSquare, show: isHost || project.status === 'in-progress' || project.status === 'completed' },
    { key: 'reviews', label: 'Reviews', icon: MessageSquare, show: isHost || project.status === 'in-progress' || project.status === 'completed' },
    { key: 'milestones', label: 'Milestones', icon: Target, show: true },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#0B1120] transition-colors duration-500 p-4 sm:p-6 md:p-8 pb-24 relative overflow-x-hidden">
      
      {/* Ambient Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 bg-blue-500/5 dark:bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="mx-auto space-y-8 animate-in fade-in duration-700 relative z-10">
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="group inline-flex items-center gap-2 text-sm font-extrabold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl px-3 py-2 -ml-3 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
          aria-label="Go back"
        >
          <ArrowLeft size={16} strokeWidth={2.5} className="transition-transform duration-300 ease-out group-hover:-translate-x-1" /> 
          Back to Projects
        </button>

        {/* Premium Segmented Tabs */}
        <div className="relative">
          <div className="flex overflow-x-auto pb-4 -mb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div 
              role="tablist"
              className="flex space-x-1.5 p-1.5 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-[1.25rem] ring-1 ring-inset ring-slate-200/80 dark:ring-slate-800 shadow-sm min-w-max"
            >
              {tabs.filter(t => t.show).map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    role="tab"
                    aria-selected={isActive}
                    className={`
                      flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-extrabold transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                      ${isActive
                        ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-[0_2px_10px_rgba(0,0,0,0.05)] dark:shadow-none ring-1 ring-inset ring-slate-200/50 dark:ring-slate-700/50'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/50'
                      }
                    `}
                    onClick={() => setActiveTab(tab.key as DetailTab)}
                  >
                    <Icon size={16} strokeWidth={isActive ? 2.5 : 2} className={`transition-colors duration-300 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-500'}`} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
          {/* Fading edge for horizontal scroll indicator on mobile */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-50 dark:from-[#0B1120] to-transparent pointer-events-none md:hidden" />
        </div>

        {/* Tab Content Wrapper */}
        {/* Using key to force re-animation when tab changes */}
        <div key={activeTab} className="mt-8 animate-in slide-in-from-bottom-8 fade-in duration-500 ease-out fill-mode-both">
          
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <ProjectBriefing project={project} />
              {!isHost && !isParticipant && project.status === 'hiring' && (
                <div className="animate-in slide-in-from-bottom-4 fade-in duration-500 delay-300 fill-mode-both">
                  <ApplicationPanel project={project} />
                </div>
              )}
            </div>
          )}

          {activeTab === 'hiring' && isHost && (
            <ShortlistDashboard projectId={project.id || (project as any)._id} />
          )}

          {activeTab === 'tasks' && (
            <TaskBoard projectId={project.id || (project as any)._id} />
          )}

          {activeTab === 'reviews' && (
            <ReviewFeedback projectId={project.id || (project as any)._id} isHost={isHost} />
          )}

          {activeTab === 'milestones' && (
            <MilestoneTracker project={project} />
          )}

        </div>

      </div>
    </div>
  );
};

export default ProjectDetail;