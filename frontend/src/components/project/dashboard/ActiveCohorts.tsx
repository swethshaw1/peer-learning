import React from 'react';
import { useProject } from '../../../context/ProjectContext';
import { useAuthStore } from '../../../store/authStore';
import { getDaysUntil } from '../../../utils/helpers';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  ArrowRight, 
  Crown, 
  User, 
  UserPlus, 
  Activity,
  FolderGit2
} from 'lucide-react';

const ActiveCohorts: React.FC = () => {
  const { hostedProjects, enrolledProjects } = useProject();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const allProjects = [...hostedProjects, ...enrolledProjects].filter(p => p.status !== 'completed' && p.status !== 'archived');

  return (
    <div className="space-y-6">
      
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
          <FolderGit2 className="text-blue-600 dark:text-blue-500" size={20} />
          Active Projects
        </h2>
        <button 
          onClick={() => navigate('/project/explore')}
          className="group flex items-center gap-1.5 text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-lg px-2 py-1"
        >
          View All <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* Empty State */}
      {allProjects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-900/20">
          <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-100 dark:border-slate-700">
            <FolderGit2 size={28} className="text-slate-400 dark:text-slate-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No Active Projects</h3>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 max-w-sm mb-6">
            You are not currently hosting or participating in any active projects.
          </p>
          <button 
            onClick={() => navigate('/project/explore')}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-blue-500/20 active:scale-95"
          >
            Explore Projects
          </button>
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {allProjects.map(project => {
          const cohortName = typeof project.cohortId === 'object' ? (project.cohortId as any).name : 'Independent Project';
          const daysLeft = getDaysUntil(project.deadline);
          const isHost = project.hostId === user?._id;

          // Status and Role Styling Configurations
          const roleConfig = isHost 
            ? { icon: Crown, label: 'Host', classes: 'bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-500/20' }
            : { icon: User, label: 'Participant', classes: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' };

          const statusConfig = project.status === 'hiring'
            ? { icon: UserPlus, label: 'Hiring', classes: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20' }
            : { icon: Activity, label: 'In Progress', classes: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20' };

          // Deadline Warning Logic
          const deadlineColor = daysLeft <= 0 
            ? 'text-rose-600 dark:text-rose-400 font-bold' 
            : daysLeft <= 7 
              ? 'text-amber-600 dark:text-amber-400 font-bold' 
              : 'text-slate-500 dark:text-slate-400';

          return (
            <div
              key={project.id}
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/project/${project.id}`)}
              onKeyDown={(e) => e.key === 'Enter' && navigate(`/project/${project.id}`)}
              className="group flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 cursor-pointer transition-all duration-300 ease-out hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-300 dark:hover:border-blue-500/50 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {/* Badges Header */}
              <div className="flex items-center justify-between mb-4">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${roleConfig.classes}`}>
                  <roleConfig.icon size={14} />
                  {roleConfig.label}
                </span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${statusConfig.classes}`}>
                  <statusConfig.icon size={12} />
                  {statusConfig.label}
                </span>
              </div>

              {/* Title & Cohort */}
              <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {project.title}
              </h3>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-6 truncate">
                {cohortName}
              </p>

              {/* Progress Bar */}
              <div className="mb-6 mt-auto">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Progress
                  </span>
                  <span className="text-sm font-black text-slate-700 dark:text-slate-300">
                    {project.progress}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-700 ease-out rounded-full" 
                    style={{ width: `${project.progress}%` }} 
                  />
                </div>
              </div>

              {/* Footer Meta */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <Users size={14} className="text-slate-400" />
                  <span>
                    <strong className="text-slate-900 dark:text-white">{project.currentParticipants}</strong>/{project.maxParticipants} members
                  </span>
                </div>
                <div className={`flex items-center gap-1.5 text-xs font-medium ${deadlineColor}`}>
                  <Calendar size={14} className={daysLeft <= 7 ? '' : 'text-slate-400'} />
                  <span>{daysLeft > 0 ? `${daysLeft}d left` : 'Overdue'}</span>
                </div>
              </div>
              
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActiveCohorts;