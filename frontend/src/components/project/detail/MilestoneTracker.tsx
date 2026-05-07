import React from 'react';
import { Project } from '../../../types';
import { getUserById } from '../../../data/mockData';
import { CheckCircle2, CircleDashed, Loader2, Target, Flag } from 'lucide-react';

interface MilestoneTrackerProps {
  project: Project;
}

const MilestoneTracker: React.FC<MilestoneTrackerProps> = ({ project }) => {
  const completedCount = project.milestones.filter(m => m.status === 'completed').length;
  const totalCount = project.milestones.length;

  if (totalCount === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-900/20">
        <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-100 dark:border-slate-700">
          <Flag size={28} className="text-slate-400 dark:text-slate-500" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No Milestones</h3>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 max-w-sm">
          This project hasn't defined any specific milestones yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      
      {/* Header Section */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <Target className="text-blue-600 dark:text-blue-500" size={20} />
          Milestone Tracker
        </h2>
        <span className="px-3.5 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 rounded-full text-[11px] font-bold uppercase tracking-wider">
          {completedCount}/{totalCount} Completed
        </span>
      </div>

      {/* Overall Progress Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex items-end justify-between mb-3">
          <span className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">
            Overall Progress
          </span>
          <span className="text-3xl font-black text-slate-900 dark:text-white leading-none">
            {project.progress}%
          </span>
        </div>
        <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-1000 ease-out" 
            style={{ width: `${project.progress}%` }} 
          />
        </div>
      </div>

      {/* Milestones List */}
      <div className="space-y-3">
        {project.milestones.map((milestone) => {
          const assignee = milestone.assigneeId ? getUserById(milestone.assigneeId) : null;
          
          // Determine styles based on milestone status
          const isCompleted = milestone.status === 'completed';
          const isInProgress = milestone.status === 'in-progress';
          
          const iconBg = isCompleted 
            ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
            : isInProgress 
              ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400'
              : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500';

          const barColor = isCompleted ? 'bg-emerald-500' : 'bg-blue-500';

          return (
            <div 
              key={milestone.id} 
              className="group flex flex-col sm:flex-row sm:items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 md:p-5 transition-all duration-200 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500/50"
            >
              
              {/* Status Icon */}
              <div className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center border shadow-sm transition-transform group-hover:scale-105 ${iconBg}`}>
                {isCompleted ? (
                  <CheckCircle2 size={22} />
                ) : isInProgress ? (
                  <Loader2 size={22} className="animate-spin" />
                ) : (
                  <CircleDashed size={22} />
                )}
              </div>

              {/* Milestone Info */}
              <div className="flex-1 min-w-0">
                <h4 className={`text-base font-bold mb-1 truncate transition-colors ${isCompleted ? 'text-slate-700 dark:text-slate-300' : 'text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400'}`}>
                  {milestone.name}
                </h4>
                
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 line-clamp-1">
                    {milestone.description}
                  </p>
                  {assignee && (
                    <>
                      <span className="text-slate-300 dark:text-slate-600 hidden sm:block">•</span>
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md text-[10px] font-bold text-slate-600 dark:text-slate-400 shrink-0">
                        {assignee.avatar ? (
                          <img src={assignee.avatar} alt={assignee.name} className="w-3.5 h-3.5 rounded-full object-cover" />
                        ) : null}
                        {assignee.name}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Milestone Progress (Mini) */}
              <div className="w-full sm:w-28 shrink-0 mt-3 sm:mt-0 pt-3 sm:pt-0 border-t border-slate-100 dark:border-slate-800 sm:border-0">
                <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest sm:hidden">Progress</span>
                  <span className={`text-xs font-black ${isCompleted ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                    {milestone.progress}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
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