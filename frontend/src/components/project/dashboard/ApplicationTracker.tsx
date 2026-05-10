import React from 'react';
import { useProject } from '../../../context/ProjectContext';
import { useAuthStore } from '../../../store/authStore';
import { ApplicationStatus } from '../../../types';
import { 
  Briefcase, 
  Clock, 
  Eye, 
  Bookmark, 
  CheckCircle2, 
  XCircle,
  FolderGit2,
  ChevronRight,
  Send
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
    bgClass: 'bg-amber-100/60 dark:bg-amber-500/10',
    borderClass: 'border-amber-200/80 dark:border-amber-500/20'
  },
  { 
    status: 'reviewing', 
    label: 'Reviewing', 
    icon: Eye, 
    colorClass: 'text-blue-600 dark:text-blue-400',
    bgClass: 'bg-blue-100/60 dark:bg-blue-500/10',
    borderClass: 'border-blue-200/80 dark:border-blue-500/20'
  },
  { 
    status: 'shortlisted', 
    label: 'Shortlisted', 
    icon: Bookmark, 
    colorClass: 'text-violet-600 dark:text-violet-400',
    bgClass: 'bg-violet-100/60 dark:bg-violet-500/10',
    borderClass: 'border-violet-200/80 dark:border-violet-500/20'
  },
  { 
    status: 'hired', 
    label: 'Accepted', 
    icon: CheckCircle2, 
    colorClass: 'text-emerald-600 dark:text-emerald-400',
    bgClass: 'bg-emerald-100/60 dark:bg-emerald-500/10',
    borderClass: 'border-emerald-200/80 dark:border-emerald-500/20'
  },
  { 
    status: 'rejected', 
    label: 'Rejected', 
    icon: XCircle, 
    colorClass: 'text-rose-600 dark:text-rose-400',
    bgClass: 'bg-rose-100/60 dark:bg-rose-500/10',
    borderClass: 'border-rose-200/80 dark:border-rose-500/20'
  },
];

const ApplicationTracker: React.FC = () => {
  const { applications, projects } = useProject();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  const myApps = applications.filter(a => a.userId === user?._id);

  return (
    <div className="flex flex-col h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2rem] p-6 shadow-xl shadow-slate-200/20 dark:shadow-slate-900/40 border border-slate-200/80 dark:border-slate-800 animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-5 mb-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-xl">
            <Briefcase className="text-blue-600 dark:text-blue-400" size={22} />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Application Tracker
          </h2>
        </div>
        <span className="px-3.5 py-1.5 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 rounded-full text-[11px] font-extrabold uppercase tracking-widest ring-1 ring-inset ring-slate-200 dark:ring-slate-700/50 shadow-sm">
          {myApps.length} Apps
        </span>
      </div>

      {myApps.length === 0 ? (
        /* Global Empty State */
        <div className="flex-1 flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-200 dark:border-slate-800/80 rounded-[1.5rem] bg-gradient-to-b from-slate-50/50 to-white dark:from-slate-800/10 dark:to-slate-900/20 m-2 relative overflow-hidden group">
          <div className="absolute inset-0 bg-grid-slate-100/[0.05] dark:bg-grid-slate-700/[0.05] bg-[size:20px_20px]" />
          <div className="relative w-20 h-20 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-5 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 ring-1 ring-slate-100 dark:ring-slate-700 group-hover:-translate-y-2 transition-transform duration-500 ease-out">
            <Send size={36} className="text-blue-500 dark:text-blue-400 ml-1" />
          </div>
          <h3 className="relative text-lg font-bold text-slate-900 dark:text-white mb-1.5">No Applications Yet</h3>
          <p className="relative text-sm font-medium text-slate-500 dark:text-slate-400 max-w-[240px] mb-6">
            Find an exciting project and submit your first application to get started.
          </p>
          <button 
            onClick={() => navigate('/project/explore')}
            className="relative px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_25px_rgba(37,99,235,0.35)] hover:-translate-y-0.5 active:translate-y-0.5 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            Explore Projects
          </button>
        </div>
      ) : (
        /* Horizontally Scrollable Kanban Wrapper */
        <div className="relative flex-1 min-h-[400px]">
          <div className="absolute inset-0 overflow-x-auto flex gap-5 snap-x snap-mandatory pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            
            {COLUMN_CONFIG.map((col, index) => {
              const items = myApps.filter(a => a.status === col.status);
              const Icon = col.icon;
              
              return (
                <div 
                  key={col.status} 
                  style={{ animationDelay: `${index * 100}ms` }}
                  className={`flex flex-col w-[280px] shrink-0 snap-start rounded-[1.5rem] border ${col.borderClass} bg-slate-50/40 dark:bg-slate-800/20 animate-in slide-in-from-right-8 fade-in duration-500 fill-mode-both`}
                >
                  {/* Column Header */}
                  <div className={`flex items-center justify-between p-4 border-b ${col.borderClass} ${col.bgClass} rounded-t-[1.5rem]`}>
                    <div className="flex items-center gap-2.5">
                      <Icon size={16} strokeWidth={2.5} className={col.colorClass} />
                      <span className={`text-xs font-black uppercase tracking-widest ${col.colorClass}`}>
                        {col.label}
                      </span>
                    </div>
                    <span className={`flex items-center justify-center w-6 h-6 rounded-full bg-white dark:bg-slate-900 border ${col.borderClass} text-[11px] font-bold shadow-sm ${col.colorClass}`}>
                      {items.length}
                    </span>
                  </div>

                  {/* Column Items */}
                  <div className="flex flex-col gap-3 p-3 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex-1">
                    {items.map((app, itemIndex) => {
                      const project = projects.find(p => (p.id === app.projectId || (p as any)._id === app.projectId));
                      const role = project?.roles.find(r => (r.id === app.roleId || (r as any)._id === app.roleId));
                      
                      return (
                        <div 
                          key={app._id || app.id} 
                          style={{ animationDelay: `${(index * 100) + (itemIndex * 75)}ms` }}
                          onClick={() => project && navigate(`/project/${project.id || (project as any)._id}`)}
                          className="group relative flex flex-col bg-white dark:bg-slate-900/90 backdrop-blur border border-slate-200/80 dark:border-slate-700/80 rounded-[1rem] p-4 cursor-pointer transition-all duration-300 ease-out hover:shadow-[0_12px_24px_-8px_rgba(0,0,0,0.1)] dark:hover:shadow-blue-900/20 hover:border-blue-300/60 dark:hover:border-blue-500/40 hover:-translate-y-1 animate-in slide-in-from-bottom-4 fade-in fill-mode-both"
                        >
                          {/* Project Name */}
                          <div className="flex items-start gap-2.5 mb-3">
                            <FolderGit2 size={16} className="text-slate-400 dark:text-slate-500 mt-0.5 shrink-0 transition-colors group-hover:text-blue-500" />
                            <div className="text-sm font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                              {project?.title || 'Unknown Project'}
                            </div>
                          </div>
                          
                          {/* Role Name */}
                          <div className="flex items-center gap-2 mt-auto pt-3 border-t border-slate-100 dark:border-slate-800">
                            <span className="text-[13px] font-medium text-slate-500 dark:text-slate-400 truncate flex-1 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                              {role?.title || 'Unknown Role'}
                            </span>
                            <div className="bg-slate-50 dark:bg-slate-800 rounded-full p-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-300 ease-out">
                              <ChevronRight size={14} className="text-blue-500 dark:text-blue-400" />
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* Column Empty State */}
                    {items.length === 0 && (
                      <div className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-slate-200/60 dark:border-slate-700/40 rounded-[1rem] bg-white/30 dark:bg-slate-900/30 text-slate-400 dark:text-slate-500 m-1">
                        <span className="text-[11px] font-bold uppercase tracking-widest opacity-60">No items</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationTracker;