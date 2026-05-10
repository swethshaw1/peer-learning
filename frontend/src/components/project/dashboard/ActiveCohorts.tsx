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

  const allProjects = [...hostedProjects, ...enrolledProjects].filter(
    p => p.status !== 'completed' && p.status !== 'archived'
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Section Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-xl">
            <FolderGit2 className="text-blue-600 dark:text-blue-400" size={22} />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Active Projects
          </h2>
        </div>
        <button 
          onClick={() => navigate('/project/explore')}
          className="group flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 rounded-lg px-3 py-1.5"
        >
          View All 
          <ArrowRight 
            size={16} 
            className="transition-transform duration-300 ease-out group-hover:translate-x-1" 
          />
        </button>
      </div>

      {/* Empty State */}
      {allProjects.length === 0 && (
        <div className="relative overflow-hidden flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] bg-gradient-to-b from-slate-50/50 to-white dark:from-slate-800/10 dark:to-slate-900/20 group">
          <div className="absolute inset-0 bg-grid-slate-100/[0.05] dark:bg-grid-slate-700/[0.05] bg-[size:20px_20px]" />
          <div className="relative w-20 h-20 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 ring-1 ring-slate-100 dark:ring-slate-700 group-hover:-translate-y-2 transition-transform duration-500 ease-out">
            <FolderGit2 size={36} className="text-blue-500 dark:text-blue-400" />
          </div>
          <h3 className="relative text-xl font-bold text-slate-900 dark:text-white mb-2">No Active Projects Yet</h3>
          <p className="relative text-base text-slate-500 dark:text-slate-400 max-w-sm mb-8">
            Your workspace is clear. Ready to start building or join an existing cohort?
          </p>
          <button 
            onClick={() => navigate('/project/explore')}
            className="relative flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_25px_rgba(37,99,235,0.35)] hover:-translate-y-0.5 active:translate-y-0.5 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
          >
            Explore Projects <ArrowRight size={18} />
          </button>
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {allProjects.map((project, index) => {
          const cohortName = typeof project.cohortId === 'object' ? (project.cohortId as any).name : 'Independent Project';
          const daysLeft = getDaysUntil(project.deadline);
          const isHost = project.hostId === user?._id;

          // Status and Role Styling Configurations
          const roleConfig = isHost 
            ? { icon: Crown, label: 'Host', classes: 'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300 ring-violet-200 dark:ring-violet-500/30' }
            : { icon: User, label: 'Participant', classes: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 ring-emerald-200 dark:ring-emerald-500/30' };

          const statusConfig = project.status === 'hiring'
            ? { icon: UserPlus, label: 'Hiring', classes: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 ring-amber-200 dark:ring-amber-500/30' }
            : { icon: Activity, label: 'In Progress', classes: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 ring-blue-200 dark:ring-blue-500/30' };

          // Deadline Warning Logic
          const deadlineColor = daysLeft <= 0 
            ? 'text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-500/10 px-2.5 py-1 rounded-md' 
            : daysLeft <= 7 
              ? 'text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-500/10 px-2.5 py-1 rounded-md' 
              : 'text-slate-500 dark:text-slate-400 px-2.5 py-1';

          return (
            <div
              key={project.id}
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/project/${project.id}`)}
              onKeyDown={(e) => e.key === 'Enter' && navigate(`/project/${project.id}`)}
              // Animation staggered delay for initial load
              style={{ animationDelay: `${index * 75}ms` }}
              className="group flex flex-col bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-[1.25rem] p-6 cursor-pointer transition-all duration-500 ease-out hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.15)] hover:border-blue-300/50 dark:hover:border-blue-500/30 hover:-translate-y-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-transparent animate-in slide-in-from-bottom-4 fade-in fill-mode-both"
            >
              {/* Badges Header */}
              <div className="flex items-center justify-between mb-5">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ring-1 ring-inset ${roleConfig.classes}`}>
                  <roleConfig.icon size={13} strokeWidth={2.5} />
                  {roleConfig.label}
                </span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ring-1 ring-inset ${statusConfig.classes}`}>
                  <statusConfig.icon size={13} strokeWidth={2.5} />
                  {statusConfig.label}
                </span>
              </div>

              {/* Title & Cohort */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1 mb-1.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  {project.title}
                </h3>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate flex items-center gap-1.5">
                  {cohortName}
                </p>
              </div>

              {/* Progress Bar Container */}
              <div className="mb-6 mt-auto">
                <div className="flex justify-between items-end mb-2.5">
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Progress
                  </span>
                  <span className="text-sm font-extrabold text-slate-700 dark:text-slate-200">
                    {project.progress}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-1000 ease-out rounded-full relative" 
                    style={{ width: `${project.progress}%` }} 
                  >
                    {/* Add a subtle shine effect on the progress bar */}
                    <div className="absolute inset-0 bg-white/20 w-full h-full -skew-x-12 translate-x-[-100%] group-hover:animate-[shimmer_2s_infinite]" />
                  </div>
                </div>
              </div>

              {/* Footer Meta */}
              <div className="pt-5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-2.5 py-1 rounded-md">
                  <Users size={14} className="text-slate-400 dark:text-slate-500" />
                  <span>
                    <span className="text-slate-900 dark:text-slate-200">{project.currentParticipants}</span>
                    <span className="opacity-60">/{project.maxParticipants}</span>
                  </span>
                </div>
                
                <div className={`flex items-center gap-1.5 text-xs transition-colors duration-300 ${deadlineColor}`}>
                  <Calendar size={14} className={daysLeft <= 7 ? '' : 'opacity-70'} />
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