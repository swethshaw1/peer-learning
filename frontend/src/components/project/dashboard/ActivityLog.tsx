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
  Check
} from 'lucide-react';
import { ActivityType } from '../../../types';

// Centralized configuration for activity styling
const ACTIVITY_CONFIG: Record<ActivityType, { icon: React.ElementType; bg: string; color: string; border: string }> = {
  task_rejected: { 
    icon: AlertCircle, 
    bg: 'bg-rose-50 dark:bg-rose-500/10', 
    color: 'text-rose-600 dark:text-rose-400', 
    border: 'border-rose-200 dark:border-rose-500/20' 
  },
  new_applicant: { 
    icon: UserPlus, 
    bg: 'bg-blue-50 dark:bg-blue-500/10', 
    color: 'text-blue-600 dark:text-blue-400', 
    border: 'border-blue-200 dark:border-blue-500/20' 
  },
  deadline: { 
    icon: Clock, 
    bg: 'bg-amber-50 dark:bg-amber-500/10', 
    color: 'text-amber-600 dark:text-amber-400', 
    border: 'border-amber-200 dark:border-amber-500/20' 
  },
  task_submitted: { 
    icon: FileText, 
    bg: 'bg-violet-50 dark:bg-violet-500/10', 
    color: 'text-violet-600 dark:text-violet-400', 
    border: 'border-violet-200 dark:border-violet-500/20' 
  },
  accepted: { 
    icon: CheckCircle2, 
    bg: 'bg-emerald-50 dark:bg-emerald-500/10', 
    color: 'text-emerald-600 dark:text-emerald-400', 
    border: 'border-emerald-200 dark:border-emerald-500/20' 
  },
  review_given: { 
    icon: MessageSquare, 
    bg: 'bg-indigo-50 dark:bg-indigo-500/10', 
    color: 'text-indigo-600 dark:text-indigo-400', 
    border: 'border-indigo-200 dark:border-indigo-500/20' 
  },
  milestone_completed: { 
    icon: Flag, 
    bg: 'bg-emerald-50 dark:bg-emerald-500/10', 
    color: 'text-emerald-600 dark:text-emerald-400', 
    border: 'border-emerald-200 dark:border-emerald-500/20' 
  },
  general: { 
    icon: Star, 
    bg: 'bg-slate-100 dark:bg-slate-800', 
    color: 'text-slate-500 dark:text-slate-400', 
    border: 'border-slate-200 dark:border-slate-700' 
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
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-3xl shadow-sm overflow-hidden">
      
      {/* Header Section */}
      <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800/80 shrink-0 bg-white dark:bg-slate-900 z-10">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BellRing className="text-blue-600 dark:text-blue-500" size={20} />
            Activity Feed
          </h2>
          {unreadCount > 0 && (
            <span className="flex items-center justify-center px-2 py-0.5 min-w-[24px] h-6 bg-rose-500 text-white text-[11px] font-black rounded-full shadow-sm">
              {unreadCount}
            </span>
          )}
        </div>
        
        {unreadCount > 0 && (
          <button 
            onClick={handleMarkAllRead}
            className="group flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg px-2 py-1"
          >
            <Check size={14} className="group-hover:scale-110 transition-transform" /> 
            <span className="hidden sm:inline">Mark all read</span>
          </button>
        )}
      </div>

      {/* Scrollable Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 hide-scrollbar min-h-[400px]">
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
                className={`
                  group relative flex items-start gap-4 p-4 rounded-2xl border transition-all duration-300
                  ${isUnread 
                    ? 'bg-blue-50/40 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800/50 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:shadow-sm' 
                    : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:border-slate-200 dark:hover:border-slate-700/50 cursor-default'
                  }
                `}
              >
                {/* Indicator Dot for Unread */}
                {isUnread && (
                  <div className="absolute top-1/2 -translate-y-1/2 left-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                )}

                {/* Activity Icon */}
                <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center border shadow-sm transition-transform group-hover:scale-110 ${config.bg} ${config.color} ${config.border}`}>
                  <Icon size={18} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <div 
                    className={`text-sm leading-snug mb-1 
                      [&>strong]:font-bold [&>strong]:text-slate-900 dark:[&>strong]:text-white 
                      ${isUnread ? 'text-slate-800 dark:text-slate-200 font-medium' : 'text-slate-600 dark:text-slate-400'}
                    `}
                    dangerouslySetInnerHTML={{ __html: activity.message }}
                  />
                  
                  {activity.detail && (
                    <div className="text-xs font-medium text-slate-500 dark:text-slate-500 mb-2 line-clamp-2">
                      {activity.detail}
                    </div>
                  )}
                  
                  <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    {formatRelativeTime(activity.timestamp)}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center h-full py-12 text-center">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 border border-slate-100 dark:border-slate-700">
              <BellRing size={28} className="text-slate-300 dark:text-slate-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">No Recent Activity</h3>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              You're all caught up!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLog;