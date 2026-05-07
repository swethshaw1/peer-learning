import React from 'react';
import { useProject } from '../../../context/ProjectContext';
import { getTasksForProject } from '../../../data/mockData';
import { useNavigate } from 'react-router-dom';
import { FolderKanban, ArrowRight } from 'lucide-react';

const HostWorkspace: React.FC = () => {
  const { hostedProjects, applications } = useProject();
  const navigate = useNavigate();

  if (hostedProjects.length === 0) return null;

  return (
    <div className="space-y-6">
      
      {/* Workspace Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FolderKanban className="text-violet-600 dark:text-violet-500" size={20} />
          Host Workspace
        </h2>
        <span className="px-3 py-1 bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400 border border-violet-200 dark:border-violet-500/20 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm">
          {hostedProjects.length} Hosted
        </span>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {hostedProjects.map(project => {
          const projectApps = applications.filter(a => a.projectId === project.id);
          const pendingApps = projectApps.filter(a => a.status === 'pending' || a.status === 'reviewing').length;
          const projectTasks = getTasksForProject(project.id);
          const tasksInReview = projectTasks.filter(t => t.status === 'in-review').length;
          const tasksRevision = projectTasks.filter(t => t.status === 'revision').length;

          return (
            <div
              key={project.id}
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/project/${project.id}`)}
              onKeyDown={(e) => e.key === 'Enter' && navigate(`/project/${project.id}`)}
              className="group flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 cursor-pointer transition-all duration-300 ease-out hover:shadow-xl hover:shadow-violet-500/5 hover:border-violet-300 dark:hover:border-violet-500/50 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            >
              {/* Project Title */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight line-clamp-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                  {project.title}
                </h3>
                <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-violet-50 dark:group-hover:bg-violet-500/10 transition-colors">
                  <ArrowRight size={16} className="text-slate-400 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>

              {/* Actionable Stats Block */}
              <div className="flex items-center justify-between p-3 mb-5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-700/50">
                <div className="flex flex-col items-center flex-1">
                  <span className={`text-xl font-black leading-none ${pendingApps > 0 ? 'text-amber-500' : 'text-slate-300 dark:text-slate-600'}`}>
                    {pendingApps}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1.5">Apps</span>
                </div>
                <div className="w-px h-8 bg-slate-200 dark:bg-slate-700/80" />
                
                <div className="flex flex-col items-center flex-1">
                  <span className={`text-xl font-black leading-none ${tasksInReview > 0 ? 'text-blue-500' : 'text-slate-300 dark:text-slate-600'}`}>
                    {tasksInReview}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1.5">Review</span>
                </div>
                <div className="w-px h-8 bg-slate-200 dark:bg-slate-700/80" />
                
                <div className="flex flex-col items-center flex-1">
                  <span className={`text-xl font-black leading-none ${tasksRevision > 0 ? 'text-rose-500' : 'text-slate-300 dark:text-slate-600'}`}>
                    {tasksRevision}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1.5">Fixes</span>
                </div>
              </div>

              {/* Project Health Progress */}
              <div className="mt-auto pt-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                    Project Health
                  </span>
                  <span className="text-xs font-black text-slate-700 dark:text-slate-300">
                    {project.progress}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-700 ease-out" 
                    style={{ width: `${project.progress}%` }} 
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

export default HostWorkspace;