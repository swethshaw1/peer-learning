import React from 'react';
import { useProject } from '../../../context/ProjectContext';
import { useNavigate } from 'react-router-dom';
import { FolderKanban, ArrowRight } from 'lucide-react';

const HostWorkspace: React.FC = () => {
  const { hostedProjects, applications, tasks } = useProject();
  const navigate = useNavigate();

  if (hostedProjects.length === 0) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Workspace Header */}
      <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-violet-50 dark:bg-violet-500/10 rounded-xl">
            <FolderKanban className="text-violet-600 dark:text-violet-400" size={22} />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Host Workspace
          </h2>
        </div>
        <span className="px-3.5 py-1.5 bg-violet-50/80 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 ring-1 ring-inset ring-violet-200/80 dark:ring-violet-500/30 rounded-full text-[11px] font-extrabold uppercase tracking-widest shadow-sm">
          {hostedProjects.length} Hosted
        </span>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {hostedProjects.map((project, index) => {
          const projectApps = applications.filter(a => a.projectId === project.id);
          const pendingApps = projectApps.filter(a => a.status === 'pending' || a.status === 'reviewing').length;
          const projectTasks = tasks.filter(t => t.projectId === project.id || (project._id && t.projectId === project._id));
          const tasksInReview = projectTasks.filter(t => t.status === 'in-review').length;
          const tasksRevision = projectTasks.filter(t => t.status === 'revision').length;

          return (
            <div
              key={project.id}
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/project/${project.id}`)}
              onKeyDown={(e) => e.key === 'Enter' && navigate(`/project/${project.id}`)}
              style={{ animationDelay: `${index * 75}ms` }}
              className="group flex flex-col bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-[1.5rem] p-6 cursor-pointer transition-all duration-500 ease-out hover:shadow-[0_20px_40px_-15px_rgba(139,92,246,0.15)] dark:hover:shadow-violet-900/20 hover:border-violet-300/60 dark:hover:border-violet-500/40 hover:-translate-y-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:border-transparent animate-in slide-in-from-bottom-4 fade-in fill-mode-both"
            >
              {/* Project Title */}
              <div className="flex items-start justify-between gap-4 mb-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-300">
                  {project.title}
                </h3>
                <div className="w-9 h-9 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center shrink-0 group-hover:bg-violet-50 dark:group-hover:bg-violet-500/20 transition-all duration-300 group-hover:shadow-sm">
                  <ArrowRight size={16} className="text-slate-400 dark:text-slate-500 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-transform duration-300 ease-out group-hover:translate-x-0.5" />
                </div>
              </div>

              {/* Actionable Stats Block */}
              <div className="flex items-center justify-between p-4 mb-6 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-700/50 group-hover:bg-slate-50 dark:group-hover:bg-slate-800/60 transition-colors duration-300">
                <div className="flex flex-col items-center flex-1">
                  <span className={`text-2xl font-black leading-none tracking-tight ${pendingApps > 0 ? 'text-amber-500 dark:text-amber-400 drop-shadow-sm' : 'text-slate-300 dark:text-slate-600'}`}>
                    {pendingApps}
                  </span>
                  <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-2">Apps</span>
                </div>
                <div className="w-px h-10 bg-slate-200/80 dark:bg-slate-700/80" />
                
                <div className="flex flex-col items-center flex-1">
                  <span className={`text-2xl font-black leading-none tracking-tight ${tasksInReview > 0 ? 'text-blue-500 dark:text-blue-400 drop-shadow-sm' : 'text-slate-300 dark:text-slate-600'}`}>
                    {tasksInReview}
                  </span>
                  <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-2">Review</span>
                </div>
                <div className="w-px h-10 bg-slate-200/80 dark:bg-slate-700/80" />
                
                <div className="flex flex-col items-center flex-1">
                  <span className={`text-2xl font-black leading-none tracking-tight ${tasksRevision > 0 ? 'text-rose-500 dark:text-rose-400 drop-shadow-sm' : 'text-slate-300 dark:text-slate-600'}`}>
                    {tasksRevision}
                  </span>
                  <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-2">Fixes</span>
                </div>
              </div>

              {/* Project Health Progress */}
              <div className="mt-auto pt-2">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Project Health
                  </span>
                  <span className="text-sm font-extrabold text-slate-700 dark:text-slate-300">
                    {project.progress}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-1000 ease-out rounded-full relative" 
                    style={{ width: `${project.progress}%` }} 
                  >
                     {/* Subtle shine effect on hover */}
                     <div className="absolute inset-0 bg-white/20 w-full h-full -skew-x-12 translate-x-[-100%] group-hover:animate-[shimmer_2s_infinite]" />
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HostWorkspace;