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

  const project = projects.find(p => p.id === id);
  const [activeTab, setActiveTab] = useState<DetailTab>('overview');

  if (!project) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6 bg-slate-50 dark:bg-[#0F172A] transition-colors duration-300">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center max-w-md w-full shadow-xl shadow-slate-200/20 dark:shadow-none flex flex-col items-center">
          <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-5 border border-slate-200 dark:border-slate-700 shadow-inner">
            <FolderX size={32} className="text-slate-400 dark:text-slate-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
            Project Not Found
          </h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
            The project you are looking for doesn't exist, has been removed, or you don't have permission to view it.
          </p>
          <button 
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-blue-500/20 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            onClick={() => navigate('/project')}
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const isHost = project.hostId === user?._id;
  const isParticipant = project.roles.some(r => r.assignedUserId === user?._id);

  const tabs = [
    { key: 'overview', label: 'Overview', icon: LayoutDashboard, show: true },
    { key: 'hiring', label: 'Hiring Pipeline', icon: Users, show: isHost && (project.status === 'hiring' || project.status === 'in-progress') },
    { key: 'tasks', label: 'Tasks', icon: CheckSquare, show: project.status === 'in-progress' || project.status === 'completed' },
    { key: 'reviews', label: 'Reviews', icon: MessageSquare, show: project.status === 'in-progress' || project.status === 'completed' },
    { key: 'milestones', label: 'Milestones', icon: Target, show: true },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0F172A] transition-colors duration-300 p-4 md:p-8 pb-24">
      <div className="mx-auto space-y-6">
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg px-2 py-1 -ml-2"
          aria-label="Go back"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" /> 
          Back to previous
        </button>

        {/* Premium Segmented Tabs */}
        <div className="flex overflow-x-auto hide-scrollbar pb-2">
          <div className="flex space-x-1 p-1 bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 min-w-max shadow-inner">
            {tabs.filter(t => t.show).map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                    isActive
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/50 dark:border-slate-700/50'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/80 border border-transparent'
                  }`}
                  onClick={() => setActiveTab(tab.key as DetailTab)}
                >
                  <Icon size={16} className={isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Wrapper */}
        <div className="mt-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <ProjectBriefing project={project} />
              {!isHost && !isParticipant && project.status === 'hiring' && (
                <ApplicationPanel project={project} />
              )}
            </div>
          )}

          {activeTab === 'hiring' && isHost && (
            <ShortlistDashboard projectId={project.id} />
          )}

          {activeTab === 'tasks' && (
            <TaskBoard projectId={project.id} />
          )}

          {activeTab === 'reviews' && (
            <ReviewFeedback projectId={project.id} isHost={isHost} />
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