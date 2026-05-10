import React from 'react';
import { Project } from '../../../types';
import { CheckCircle2, CircleDashed, Loader2, Target, Flag } from 'lucide-react';

interface MilestoneTrackerProps {
  project: Project;
}

const MilestoneTracker: React.FC<MilestoneTrackerProps> = ({ project }) => {
  const completedCount = project.milestones.filter(m => m.status === 'completed').length;
  const totalCount = project.milestones.length;

  if (totalCount === 0) {
    return (
      <div className="relative overflow-hidden flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] bg-gradient-to-b from-slate-50/50 to-white dark:from-slate-800/10 dark:to-slate-900/20 group animate-in fade-in duration-500">
        <div className="absolute inset-0 bg-grid-slate-100/[0.05] dark:bg-grid-slate-700/[0.05] bg-[size:20px_20px]" />
        <div className="relative w-20 h-20 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-5 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 ring-1 ring-slate-100 dark:ring-slate-700 group-hover:-translate-y-2 transition-transform duration-500 ease-out">
          <Flag size={36} className="text-slate-400 dark:text-slate-500" />
        </div>
        <h3 className="relative text-xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">No Milestones Defined</h3>
        <p className="relative text-sm font-medium text-slate-500 dark:text-slate-400 max-w-sm">
          This project hasn't mapped out any specific milestones or phases yet.
        </p>
      </div>
    );
  }

  const isFullyComplete = project.progress === 100;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-xl">
            <Target className="text-blue-600 dark:text-blue-400" size={22} />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Milestone Tracker
          </h2>
        </div>
        <span className={`px-3.5 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-widest ring-1 ring-inset shadow-sm transition-colors duration-300 ${
          isFullyComplete 
            ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 ring-emerald-200 dark:ring-emerald-500/30' 
            : 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 ring-blue-200 dark:ring-blue-500/30'
        }`}>
          {completedCount}/{totalCount} Completed
        </span>
      </div>

      {/* Overall Progress Card */}
      <div className="relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-[1.5rem] p-6 shadow-lg shadow-slate-200/20 dark:shadow-slate-900/40 group">
        <div className="relative z-10 flex items-end justify-between mb-4">
          <span className="text-[13px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            Overall Progress
          </span>
          <span className={`text-4xl font-black leading-none tracking-tighter ${isFullyComplete ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
            {project.progress}%
          </span>
        </div>
        <div className="relative z-10 w-full h-3.5 bg-slate-100 dark:bg-slate-800/80 rounded-full overflow-hidden shadow-inner ring-1 ring-inset ring-slate-200/50 dark:ring-slate-700/50">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ease-out relative ${
              isFullyComplete ? 'bg-gradient-to-r from-emerald-400 to-teal-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'
            }`} 
            style={{ width: `${project.progress}%` }} 
          >
             {/* Shimmer Effect */}
             <div className="absolute inset-0 bg-white/20 w-full h-full -skew-x-12 translate-x-[-100%] group-hover:animate-[shimmer_2s_infinite]" />
          </div>
        </div>
      </div>

      {/* Milestones List */}
      <div className="space-y-4 relative before:absolute before:inset-0 before:ml-[3.25rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-800 before:to-transparent">
        {project.milestones.map((milestone, index) => {
          const assignee = milestone.assigneeId && typeof milestone.assigneeId === 'object' ? milestone.assigneeId as any : null;
          
          // Styling logic
          const isCompleted = milestone.status === 'completed';
          const isInProgress = milestone.status === 'in-progress';
          
          const iconBg = isCompleted 
            ? 'bg-emerald-100/80 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 ring-4 ring-emerald-50 dark:ring-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
            : isInProgress 
              ? 'bg-blue-100/80 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 ring-4 ring-blue-50 dark:ring-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 ring-4 ring-slate-50 dark:ring-slate-800/50';

          const cardHoverBorder = isCompleted ? 'hover:border-emerald-300 dark:hover:border-emerald-500/50 hover:shadow-emerald-500/5' : 'hover:border-blue-300 dark:hover:border-blue-500/50 hover:shadow-blue-500/5';
          const barColor = isCompleted ? 'from-emerald-400 to-teal-500' : 'from-blue-400 to-indigo-500';

          return (
            <div 
              key={milestone.id} 
              style={{ animationDelay: `${index * 120}ms` }}
              className={`
                relative group flex flex-col sm:flex-row sm:items-center gap-5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border border-slate-200/80 dark:border-slate-800/80 rounded-[1.5rem] p-5 
                transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 z-10
                animate-in slide-in-from-bottom-8 fade-in fill-mode-both ${cardHoverBorder}
              `}
            >
              
              {/* Status Icon */}
              <div className={`w-14 h-14 shrink-0 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110 ${iconBg}`}>
                {isCompleted ? (
                  <CheckCircle2 size={24} strokeWidth={2.5} />
                ) : isInProgress ? (
                  <Loader2 size={24} strokeWidth={2.5} className="animate-spin" />
                ) : (
                  <CircleDashed size={24} strokeWidth={2.5} />
                )}
              </div>

              {/* Milestone Info */}
              <div className="flex-1 min-w-0 py-1">
                <h4 className={`text-base font-extrabold mb-1.5 truncate transition-colors duration-300 ${isCompleted ? 'text-slate-600 dark:text-slate-300' : 'text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400'}`}>
                  {milestone.name}
                </h4>
                
                <div className="flex flex-wrap items-center gap-2.5">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 line-clamp-1 flex-1 min-w-[200px]">
                    {milestone.description}
                  </p>
                  {assignee && (
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-slate-50 dark:bg-slate-800/80 ring-1 ring-inset ring-slate-200 dark:ring-slate-700/80 rounded-full text-[11px] font-bold text-slate-600 dark:text-slate-300 shrink-0 transition-colors group-hover:bg-slate-100 dark:group-hover:bg-slate-700">
                      {assignee.avatar ? (
                        <img src={assignee.avatar} alt={assignee.name} className="w-4 h-4 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-600" />
                      ) : (
                         <div className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[8px]">{assignee.name.charAt(0)}</div>
                      )}
                      {assignee.name}
                    </div>
                  )}
                </div>
              </div>

              {/* Milestone Progress (Mini) */}
              <div className="w-full sm:w-32 shrink-0 mt-3 sm:mt-0 pt-4 sm:pt-0 border-t border-slate-100 dark:border-slate-800/80 sm:border-0 pl-0 sm:pl-4 sm:border-l">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest sm:hidden">Progress</span>
                  <span className={`text-[13px] font-black tracking-tight ${isCompleted ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>
                    {milestone.progress}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800/80 rounded-full overflow-hidden shadow-inner ring-1 ring-inset ring-slate-200/50 dark:ring-slate-700/50">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r ${barColor}`}
                    style={{ width: `${milestone.progress}%` }}
                  />
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MilestoneTracker;