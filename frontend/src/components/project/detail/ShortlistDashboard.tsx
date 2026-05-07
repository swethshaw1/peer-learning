import React from 'react';
import { useProject } from '../../../context/ProjectContext';
import { Application, ApplicationStatus } from '../../../types';
import { Check, X, Star, Users, ChevronRight, UserMinus } from 'lucide-react';

interface ShortlistDashboardProps {
  projectId: string;
}

const pipelineStages: { status: ApplicationStatus; label: string; dotClass: string; bgClass: string }[] = [
  { status: 'reviewing', label: 'Reviewing', dotClass: 'bg-blue-500', bgClass: 'bg-slate-50 dark:bg-slate-800/40' },
  { status: 'shortlisted', label: 'Shortlisted', dotClass: 'bg-violet-500', bgClass: 'bg-violet-50/50 dark:bg-violet-900/10' },
  { status: 'hired', label: 'Hired', dotClass: 'bg-emerald-500', bgClass: 'bg-emerald-50/50 dark:bg-emerald-900/10' },
];

const ShortlistDashboard: React.FC<ShortlistDashboardProps> = ({ projectId }) => {
  const { applications, updateApplicationStatus, projects } = useProject();
  const project = projects.find(p => p.id === projectId);
  
  // Get all applications for this project
  // In a real app, we might need to fetch project-specific applications if not already in context
  const projectApps = applications.filter(a => a.projectId === projectId || (a.projectId as any).id === projectId || (a.projectId as any)._id === projectId);

  const getAppsForStage = (status: ApplicationStatus) => {
    if (status === 'reviewing') {
      return projectApps.filter(a => a.status === 'pending' || a.status === 'reviewing');
    }
    return projectApps.filter(a => a.status === status);
  };

  const rejected = projectApps.filter(a => a.status === 'rejected');

  return (
    <div className="space-y-6">
      
      {/* Header Area */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Users className="text-blue-600 dark:text-blue-500" size={20} />
          Applicant Pipeline
        </h2>
        <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full text-[11px] font-bold uppercase tracking-wider border border-slate-200 dark:border-slate-700">
          {projectApps.length} Total
        </span>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pipelineStages.map(stage => {
          const apps = getAppsForStage(stage.status);
          
          return (
            <div 
              key={stage.status} 
              className={`flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800/80 p-4 min-h-[400px] ${stage.bgClass}`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-5 px-1">
                <div className="flex items-center gap-2.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${stage.dotClass} shadow-sm`} />
                  <span className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                    {stage.label}
                  </span>
                </div>
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500 dark:text-slate-400 shadow-sm">
                  {apps.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="flex flex-col gap-3 flex-1">
                {apps.map(app => {
                  const applicant = app.userId as any; // Populated User
                  const role = project?.roles.find(r => r.id === app.roleId || (r as any)._id === app.roleId);
                  
                  return (
                    <div 
                      key={app.id} 
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500/50 transition-all duration-200 group"
                    >
                      {/* User Info */}
                      <div className="flex items-start gap-3 mb-3">
                        {applicant?.avatar ? (
                          <img 
                            src={applicant.avatar} 
                            alt={applicant.name} 
                            className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shrink-0" 
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                            <span className="text-sm font-bold text-slate-500">{applicant?.name?.charAt(0) || '?'}</span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
                            {applicant?.name || 'Unknown User'}
                          </div>
                          <div className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 truncate">
                            for {role?.title || 'Unknown Role'}
                          </div>
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {(applicant?.skills || []).slice(0, 3).map((s: string) => (
                          <span 
                            key={s} 
                            className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-[10px] font-bold text-slate-600 dark:text-slate-400"
                          >
                            {s}
                          </span>
                        ))}
                      </div>

                      {/* Reputation & Stats */}
                      {applicant && (
                        <div className="flex items-center gap-1.5 mb-3 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                          <Star size={12} className="text-amber-500 fill-amber-500" />
                          <span className="font-bold text-slate-900 dark:text-white">{applicant.reputation || 0}</span>
                          <span className="mx-1 opacity-50">•</span>
                          <span>{applicant.completedProjects || 0} projects</span>
                        </div>
                      )}

                      {/* Cover Note Snippet */}
                      <div className="relative p-3 mb-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700/50">
                        <p className="text-xs text-slate-600 dark:text-slate-400 italic line-clamp-3 leading-relaxed">
                          "{app.coverNote}"
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-1">
                        {stage.status === 'reviewing' && (
                          <>
                            <button 
                              onClick={() => updateApplicationStatus(app.id, 'shortlisted')}
                              className="flex-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white dark:bg-blue-500/10 dark:hover:bg-blue-600 dark:text-blue-400 dark:hover:text-white text-xs font-bold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            >
                              Shortlist
                            </button>
                            <button 
                              onClick={() => updateApplicationStatus(app.id, 'rejected')}
                              title="Reject Application"
                              className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 dark:text-rose-400 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500/50 shrink-0"
                            >
                              <X size={16} />
                            </button>
                          </>
                        )}
                        {stage.status === 'shortlisted' && (
                          <>
                            <button 
                              onClick={() => updateApplicationStatus(app.id, 'hired')}
                              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white dark:bg-emerald-500/10 dark:hover:bg-emerald-600 dark:text-emerald-400 dark:hover:text-white text-xs font-bold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                            >
                              <Check size={14} /> Hire
                            </button>
                            <button 
                              onClick={() => updateApplicationStatus(app.id, 'rejected')}
                              title="Reject Application"
                              className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 dark:text-rose-400 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500/50 shrink-0"
                            >
                              <X size={16} />
                            </button>
                          </>
                        )}
                        {stage.status === 'hired' && (
                          <div className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-lg cursor-default">
                            <Check size={14} /> Onboarded
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Empty State per Column */}
                {apps.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/20 text-slate-400 dark:text-slate-600">
                    <span className="text-xs font-bold uppercase tracking-widest">Empty</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Rejected Applicants Section */}
      {rejected.length > 0 && (
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800/50">
          <details className="group cursor-pointer outline-none">
            <summary className="flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors list-none outline-none [&::-webkit-details-marker]:hidden">
              <ChevronRight size={16} className="transition-transform group-open:rotate-90" />
              <div className="flex items-center gap-2">
                <UserMinus size={16} />
                Rejected Applicants
                <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full text-[10px]">
                  {rejected.length}
                </span>
              </div>
            </summary>
            
            <div className="flex flex-wrap gap-2 mt-4 pl-6 animate-in fade-in duration-300">
              {rejected.map(app => {
                const applicant = app.userId as any;
                return (
                  <div 
                    key={app.id} 
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-lg text-xs font-bold text-rose-700 dark:text-rose-400"
                  >
                    {applicant?.name || 'Unknown User'}
                  </div>
                );
              })}
            </div>
          </details>
        </div>
      )}

    </div>
  );
};

export default ShortlistDashboard;