import React from 'react';
import { useProject } from '../../../context/ProjectContext';
import { useAuthStore } from '../../../store/authStore';
import { getProjectById } from '../../../data/mockData';
import { ApplicationStatus } from '../../../types';
import { 
  Briefcase, 
  Clock, 
  Eye, 
  Bookmark, 
  CheckCircle2, 
  XCircle,
  FolderGit2,
  ChevronRight
} from 'lucide-react';

interface ColumnConfig {
  status: ApplicationStatus;
  label: string;
  icon: React.ElementType;
  colorClass: string;
  bgClass: string;
  borderClass: string;
}

const COLUMN_CONFIG: ColumnConfig[] = [
  { 
    status: 'pending', 
    label: 'Pending', 
    icon: Clock, 
    colorClass: 'text-amber-600 dark:text-amber-400',
    bgClass: 'bg-amber-50 dark:bg-amber-500/10',
    borderClass: 'border-amber-200 dark:border-amber-500/20'
  },
  { 
    status: 'reviewing', 
    label: 'Reviewing', 
    icon: Eye, 
    colorClass: 'text-blue-600 dark:text-blue-400',
    bgClass: 'bg-blue-50 dark:bg-blue-500/10',
    borderClass: 'border-blue-200 dark:border-blue-500/20'
  },
  { 
    status: 'shortlisted', 
    label: 'Shortlisted', 
    icon: Bookmark, 
    colorClass: 'text-violet-600 dark:text-violet-400',
    bgClass: 'bg-violet-50 dark:bg-violet-500/10',
    borderClass: 'border-violet-200 dark:border-violet-500/20'
  },
  { 
    status: 'hired', 
    label: 'Accepted', 
    icon: CheckCircle2, 
    colorClass: 'text-emerald-600 dark:text-emerald-400',
    bgClass: 'bg-emerald-50 dark:bg-emerald-500/10',
    borderClass: 'border-emerald-200 dark:border-emerald-500/20'
  },
  { 
    status: 'rejected', 
    label: 'Rejected', 
    icon: XCircle, 
    colorClass: 'text-rose-600 dark:text-rose-400',
    bgClass: 'bg-rose-50 dark:bg-rose-500/10',
    borderClass: 'border-rose-200 dark:border-rose-500/20'
  },
];

const ApplicationTracker: React.FC = () => {
  const { applications } = useProject();
  const { user } = useAuthStore();
  const myApps = applications.filter(a => a.userId === user?._id);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
      
      {/* Header Section */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4 mb-5 shrink-0">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Briefcase className="text-blue-600 dark:text-blue-500" size={20} />
          Application Tracker
        </h2>
        <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full text-[11px] font-bold uppercase tracking-wider border border-slate-200 dark:border-slate-700">
          {myApps.length} Apps
        </span>
      </div>

      {/* Horizontally Scrollable Kanban Wrapper */}
      <div className="relative flex-1 min-h-[300px]">
        <div className="absolute inset-0 overflow-x-auto hide-scrollbar flex gap-4 snap-x snap-mandatory pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          
          {COLUMN_CONFIG.map(col => {
            const items = myApps.filter(a => a.status === col.status);
            const Icon = col.icon;
            
            return (
              <div 
                key={col.status} 
                className={`flex flex-col w-[240px] shrink-0 snap-start rounded-2xl border ${col.borderClass} bg-slate-50/50 dark:bg-slate-800/20`}
              >
                {/* Column Header */}
                <div className={`flex items-center justify-between p-3 border-b ${col.borderClass} ${col.bgClass} rounded-t-2xl`}>
                  <div className="flex items-center gap-2">
                    <Icon size={14} className={col.colorClass} />
                    <span className={`text-xs font-bold uppercase tracking-wider ${col.colorClass}`}>
                      {col.label}
                    </span>
                  </div>
                  <span className={`flex items-center justify-center w-5 h-5 rounded-full bg-white dark:bg-slate-900 border ${col.borderClass} text-[10px] font-bold shadow-sm ${col.colorClass}`}>
                    {items.length}
                  </span>
                </div>

                {/* Column Items */}
                <div className="flex flex-col gap-3 p-3 overflow-y-auto hide-scrollbar flex-1">
                  {items.map(app => {
                    const project = getProjectById(app.projectId);
                    const role = project?.roles.find(r => r.id === app.roleId);
                    
                    return (
                      <div 
                        key={app.id} 
                        className="group flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl p-3 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500/50 transition-all duration-200 cursor-default"
                      >
                        {/* Project Name */}
                        <div className="flex items-start gap-2 mb-2">
                          <FolderGit2 size={14} className="text-slate-400 mt-0.5 shrink-0" />
                          <div className="text-sm font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {project?.title || 'Unknown Project'}
                          </div>
                        </div>
                        
                        {/* Role Name */}
                        <div className="flex items-center gap-1.5 mt-auto pt-2 border-t border-slate-100 dark:border-slate-800">
                          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate flex-1">
                            {role?.title || 'Unknown Role'}
                          </span>
                          <ChevronRight size={14} className="text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    );
                  })}

                  {/* Empty State */}
                  {items.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-slate-200 dark:border-slate-700/50 rounded-xl bg-white/50 dark:bg-slate-900/50 text-slate-400 dark:text-slate-500">
                      <span className="text-[10px] font-bold uppercase tracking-widest">Empty</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          
        </div>
      </div>
    </div>
  );
};

export default ApplicationTracker;