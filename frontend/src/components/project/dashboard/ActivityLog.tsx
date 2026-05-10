import React from 'react';
import { useProject } from '../../../context/ProjectContext';
import { formatRelativeTime } from '../../../utils/helpers';
import { 
  AlertCircle, 
  UserPlus, 
  Clock, 
  FileText, 
  CheckCircle2, 
  Star, 
  MessageSquare, 
  Flag,
  BellRing,
  Check,
  CheckCheck
} from 'lucide-react';
import { ActivityType } from '../../../types';

// Upgraded configuration with modern rings, deeper contrast, and refined palettes
const ACTIVITY_CONFIG: Record<ActivityType, { icon: React.ElementType; bg: string; color: string; border: string }> = {
  task_rejected: { 
    icon: AlertCircle, 
    bg: 'bg-rose-100 dark:bg-rose-500/20', 
    color: 'text-rose-600 dark:text-rose-300', 
    border: 'ring-1 ring-inset ring-rose-200 dark:ring-rose-500/30' 
  },
  new_applicant: { 
    icon: UserPlus, 
    bg: 'bg-blue-100 dark:bg-blue-500/20', 
    color: 'text-blue-600 dark:text-blue-300', 
    border: 'ring-1 ring-inset ring-blue-200 dark:ring-blue-500/30' 
  },
  deadline: { 
    icon: Clock, 
    bg: 'bg-amber-100 dark:bg-amber-500/20', 
    color: 'text-amber-600 dark:text-amber-300', 
    border: 'ring-1 ring-inset ring-amber-200 dark:ring-amber-500/30' 
  },
  task_submitted: { 
    icon: FileText, 
    bg: 'bg-violet-100 dark:bg-violet-500/20', 
    color: 'text-violet-600 dark:text-violet-300', 
    border: 'ring-1 ring-inset ring-violet-200 dark:ring-violet-500/30' 
  },
  accepted: { 
    icon: CheckCircle2, 
    bg: 'bg-emerald-100 dark:bg-emerald-500/20', 
    color: 'text-emerald-600 dark:text-emerald-300', 
    border: 'ring-1 ring-inset ring-emerald-200 dark:ring-emerald-500/30' 
  },
  review_given: { 
    icon: MessageSquare, 
    bg: 'bg-indigo-100 dark:bg-indigo-500/20', 
    color: 'text-indigo-600 dark:text-indigo-300', 
    border: 'ring-1 ring-inset ring-indigo-200 dark:ring-indigo-500/30' 
  },
  milestone_completed: { 
    icon: Flag, 
    bg: 'bg-emerald-100 dark:bg-emerald-500/20', 
    color: 'text-emerald-600 dark:text-emerald-300', 
    border: 'ring-1 ring-inset ring-emerald-200 dark:ring-emerald-500/30' 
  },
  general: { 
    icon: Star, 
    bg: 'bg-slate-100 dark:bg-slate-800/50', 
    color: 'text-slate-600 dark:text-slate-300', 
    border: 'ring-1 ring-inset ring-slate-200 dark:ring-slate-700/50' 
  },
};

const ActivityLog: React.FC = () => {
  const { activities, markActivityRead } = useProject();

  const sorted = [...activities].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const unreadCount = sorted.filter(a => !a.read).length;

  const handleMarkAllRead = () => {
    activities.forEach(a => {
      if (!a.read) markActivityRead(a.id);
    });
  };

  return (
    <div className="flex flex-col h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-[2rem] shadow-xl shadow-slate-200/20 dark:shadow-slate-900/40 overflow-hidden animate-in fade-in duration-500">
      
      {/* Header Section (Sticky with Blur) */}
      <div className="relative flex items-center justify-between p-6 border-b border-slate-200/60 dark:border-slate-800/60 shrink-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-xl">
            <BellRing className="text-blue-600 dark:text-blue-400" size={20} />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
            Activity Feed
          </h2>
          {unreadCount > 0 && (
            <span className="flex items-center justify-center px-2 py-0.5 min-w-[24px] h-6 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[11px] font-black rounded-full shadow-[0_0_12px_rgba(244,63,94,0.4)] animate-in zoom-in duration-300">
              {unreadCount}
            </span>
          )}
        </div>
        
        {unreadCount > 0 && (
          <button 
            onClick={handleMarkAllRead}
            className="group flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 bg-slate-50 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-500/10 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg px-3 py-2"
          >
            <Check size={14} className="group-hover:scale-110 transition-transform duration-300" /> 
            <span className="hidden sm:inline">Mark all read</span>
          </button>
        )}
      </div>

      {/* Scrollable Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2 hide-scrollbar min-h-[400px]">
        {sorted.length > 0 ? (
          sorted.map((activity, index) => {
            const config = ACTIVITY_CONFIG[activity.type] || ACTIVITY_CONFIG.general;
            const Icon = config.icon;
            const isUnread = !activity.read;
            const itemKey = (activity as any)._id || activity.id || `activity-${index}`;

            return (
              <div
                key={itemKey}
                role="button"
                tabIndex={0}
                onClick={() => !activity.read && markActivityRead(activity.id)}
                onKeyDown={(e) => e.key === 'Enter' && !activity.read && markActivityRead(activity.id)}
                style={{ animationDelay: `${index * 50}ms` }}
                className={`
                  group relative flex items-start gap-4 p-4 rounded-[1.25rem] transition-all duration-500 ease-out animate-in slide-in-from-right-4 fade-in fill-mode-both focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                  ${isUnread 
                    ? 'bg-blue-50/50 dark:bg-blue-500/5 hover:bg-blue-50 dark:hover:bg-blue-500/10 border border-blue-100/50 dark:border-blue-500/20 cursor-pointer shadow-sm hover:shadow-md hover:shadow-blue-500/5 hover:-translate-y-0.5' 
                    : 'bg-transparent border border-transparent hover:bg-slate-50/80 dark:hover:bg-slate-800/40 hover:border-slate-200/50 dark:hover:border-slate-700/50 cursor-default'
                  }
                `}
              >
                {/* Glowing Indicator Dot for Unread */}
                {isUnread && (
                  <div className="absolute top-1/2 -translate-y-1/2 left-2 w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-pulse" />
                )}

                {/* Activity Icon */}
                <div className={`relative w-11 h-11 shrink-0 rounded-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110 ${config.bg} ${config.color} ${config.border} ${isUnread ? 'ml-2' : 'ml-0'}`}>
                  <Icon size={18} strokeWidth={2.5} />
                  {isUnread && (
                    <div className="absolute inset-0 rounded-full ring-2 ring-blue-500/20 scale-110" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <div 
                    className={`text-sm leading-relaxed mb-1.5 transition-colors duration-300
                      [&>strong]:font-extrabold [&>strong]:text-slate-900 dark:[&>strong]:text-white 
                      ${isUnread ? 'text-slate-800 dark:text-slate-200 font-semibold' : 'text-slate-600 dark:text-slate-400 font-medium'}
                    `}
                    dangerouslySetInnerHTML={{ __html: activity.message }}
                  />
                  
                  {activity.detail && (
                    <div className="text-[13px] font-medium text-slate-500/90 dark:text-slate-400 mb-2.5 line-clamp-2 bg-slate-50/50 dark:bg-slate-800/30 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/50">
                      {activity.detail}
                    </div>
                  )}
                  
                  <div className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                    {formatRelativeTime(activity.timestamp)}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          /* Premium Empty State */
          <div className="relative overflow-hidden flex flex-col items-center justify-center h-full min-h-[350px] text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[1.5rem] bg-gradient-to-b from-slate-50/50 to-white dark:from-slate-800/10 dark:to-slate-900/20 m-2 group">
             <div className="absolute inset-0 bg-grid-slate-100/[0.05] dark:bg-grid-slate-700/[0.05] bg-[size:20px_20px]" />
            <div className="relative w-20 h-20 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-5 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 ring-1 ring-slate-100 dark:ring-slate-700 group-hover:-translate-y-2 transition-transform duration-500 ease-out">
              <CheckCheck size={36} className="text-blue-500 dark:text-blue-400" />
            </div>
            <h3 className="relative text-lg font-bold text-slate-900 dark:text-white mb-1.5">No Recent Activity</h3>
            <p className="relative text-sm font-medium text-slate-500 dark:text-slate-400 max-w-[200px]">
              You're all caught up! New notifications will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLog;