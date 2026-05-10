import React from 'react';
import { useProject } from '../../../context/ProjectContext';
import { Application, ApplicationStatus } from '../../../types';
import { Check, X, Star, Users, ChevronRight, UserMinus, Quote } from 'lucide-react';

interface ShortlistDashboardProps {
  projectId: string;
}

const pipelineStages: { status: ApplicationStatus; label: string; dotClass: string; bgClass: string; borderClass: string }[] = [
  { status: 'reviewing', label: 'Reviewing', dotClass: 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]', bgClass: 'bg-slate-50/40 dark:bg-slate-800/20', borderClass: 'ring-slate-200/60 dark:ring-slate-700/50' },
  { status: 'shortlisted', label: 'Shortlisted', dotClass: 'bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.6)]', bgClass: 'bg-violet-50/30 dark:bg-violet-900/10', borderClass: 'ring-violet-200/60 dark:ring-violet-500/30' },
  { status: 'hired', label: 'Hired', dotClass: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]', bgClass: 'bg-emerald-50/30 dark:bg-emerald-900/10', borderClass: 'ring-emerald-200/60 dark:ring-emerald-500/30' },
];

const ShortlistDashboard: React.FC<ShortlistDashboardProps> = ({ projectId }) => {
  const { projectApplications, fetchProjectApplications, updateApplicationStatus, projects } = useProject();
  const project = projects.find(p => p.id === projectId || p._id === projectId);
  
  React.useEffect(() => {
    fetchProjectApplications(projectId);
  }, [projectId]);

  const projectApps = projectApplications;

  const getAppsForStage = (status: ApplicationStatus) => {
    if (status === 'reviewing') {
      return projectApps.filter(a => a.status === 'pending' || a.status === 'reviewing');
    }
    return projectApps.filter(a => a.status === status);
  };

  const rejected = projectApps.filter(a => a.status === 'rejected');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header Area */}
      <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-xl">
            <Users className="text-blue-600 dark:text-blue-400" size={22} />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Applicant Pipeline
          </h2>
        </div>
        <span className="px-3.5 py-1.5 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 rounded-full text-[11px] font-extrabold uppercase tracking-widest ring-1 ring-inset ring-slate-200 dark:ring-slate-700/50 shadow-sm">
          {projectApps.length} Total
        </span>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
        {pipelineStages.map((stage, stageIndex) => {
          const apps = getAppsForStage(stage.status);
          
          return (
            <div 
              key={stage.status} 
              style={{ animationDelay: `${stageIndex * 150}ms` }}
              className={`flex flex-col rounded-[1.5rem] ring-1 ring-inset ${stage.borderClass} p-4 min-h-[450px] animate-in slide-in-from-bottom-8 fade-in duration-500 fill-mode-both ${stage.bgClass}`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-5 px-2">
                <div className="flex items-center gap-2.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${stage.dotClass}`} />
                  <span className="text-[13px] font-black text-slate-900 dark:text-white uppercase tracking-widest">
                    {stage.label}
                  </span>
                </div>
                <span className={`flex items-center justify-center min-w-[24px] h-6 px-1.5 rounded-full bg-white dark:bg-slate-900 ring-1 ring-inset ${stage.borderClass} text-[11px] font-black text-slate-500 dark:text-slate-400 shadow-sm`}>
                  {apps.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="flex flex-col gap-4 flex-1">
                {apps.map((app, appIndex) => {
                  const applicant = app.userId as any; // Populated User
                  const role = project?.roles.find(r => (r._id || r.id) === app.roleId);
                  
                  return (
                    <div 
                      key={app._id || app.id} 
                      style={{ animationDelay: `${(stageIndex * 150) + (appIndex * 100)}ms` }}
                      className="group flex flex-col bg-white/90 dark:bg-slate-900/90 backdrop-blur-md ring-1 ring-inset ring-slate-200/80 dark:ring-slate-700/80 rounded-[1.25rem] p-5 shadow-sm hover:shadow-[0_12px_24px_-8px_rgba(0,0,0,0.1)] dark:hover:shadow-blue-900/20 hover:ring-blue-300/60 dark:hover:ring-blue-500/40 transition-all duration-300 ease-out hover:-translate-y-1 animate-in slide-in-from-bottom-4 fade-in fill-mode-both"
                    >
                      {/* User Info */}
                      <div className="flex items-start gap-3.5 mb-4">
                        {applicant?.avatar ? (
                          <img 
                            src={applicant.avatar} 
                            alt={applicant.name} 
                            className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800 bg-slate-100 dark:bg-slate-800 shrink-0 shadow-sm" 
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-full ring-2 ring-slate-100 dark:ring-slate-800 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center shrink-0 shadow-sm">
                            <span className="text-sm font-black text-slate-500 dark:text-slate-400">{applicant?.name?.charAt(0) || '?'}</span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0 pt-0.5">
                          <div className="text-sm font-extrabold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                            {applicant?.name || 'Unknown User'}
                          </div>
                          <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            <span className="opacity-70">for</span> <span className="text-blue-600 dark:text-blue-400">{role?.title || 'Unknown Role'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {(applicant?.skills || []).slice(0, 3).map((s: string) => (
                          <span 
                            key={s} 
                            className="px-2.5 py-1 bg-slate-50 dark:bg-slate-800/80 ring-1 ring-inset ring-slate-200 dark:ring-slate-700 rounded-full text-[10px] font-extrabold text-slate-600 dark:text-slate-300"
                          >
                            {s}
                          </span>
                        ))}
                      </div>

                      {/* Reputation & Stats */}
                      {applicant && (
                        <div className="flex items-center gap-3 mb-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/30 py-1.5 px-3 rounded-lg ring-1 ring-inset ring-slate-100 dark:ring-slate-800/50 w-fit">
                          <div className="flex items-center gap-1.5">
                            <Star size={13} className="text-amber-500 fill-amber-500 drop-shadow-sm" />
                            <span className="text-slate-900 dark:text-white">{applicant.reputation || 0}</span>
                          </div>
                          <div className="w-px h-3 bg-slate-300 dark:bg-slate-700" />
                          <div>
                            <span className="text-slate-900 dark:text-white">{applicant.completedProjects || 0}</span> projects
                          </div>
                        </div>
                      )}

                      {/* Cover Note Snippet */}
                      {app.coverNote && (
                        <div className="relative p-3.5 mb-5 bg-slate-50/80 dark:bg-slate-800/40 rounded-xl ring-1 ring-inset ring-slate-100 dark:ring-slate-700/50 group/note hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors">
                          <Quote size={12} className="absolute top-2.5 left-2.5 text-slate-300 dark:text-slate-600" />
                          <p className="text-[13px] text-slate-600 dark:text-slate-400 italic line-clamp-3 leading-relaxed pl-4">
                            {app.coverNote}
                          </p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-2.5 pt-2 mt-auto border-t border-slate-100 dark:border-slate-800/80">
                        {stage.status === 'reviewing' && (
                          <>
                            <button 
                              onClick={() => updateApplicationStatus((app as any)._id || app.id, 'shortlisted')}
                              className="flex-1 px-4 py-2 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white dark:bg-blue-500/10 dark:hover:bg-blue-600 dark:text-blue-400 dark:hover:text-white text-xs font-extrabold uppercase tracking-widest rounded-xl transition-all duration-300 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 shadow-sm"
                            >
                              Shortlist
                            </button>
                            <button 
                              onClick={() => updateApplicationStatus((app as any)._id || app.id, 'rejected')}
                              title="Reject Application"
                              className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 dark:text-rose-400 rounded-xl transition-all duration-300 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/50 shrink-0 shadow-sm"
                            >
                              <X size={18} strokeWidth={2.5} />
                            </button>
                          </>
                        )}
                        {stage.status === 'shortlisted' && (
                          <>
                            <button 
                              onClick={() => updateApplicationStatus((app as any)._id || app.id, 'hired')}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white dark:bg-emerald-500/10 dark:hover:bg-emerald-600 dark:text-emerald-400 dark:hover:text-white text-xs font-extrabold uppercase tracking-widest rounded-xl transition-all duration-300 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 shadow-sm"
                            >
                              <Check size={16} strokeWidth={2.5} /> Hire
                            </button>
                            <button 
                              onClick={() => updateApplicationStatus((app as any)._id || app.id, 'rejected')}
                              title="Reject Application"
                              className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 dark:text-rose-400 rounded-xl transition-all duration-300 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/50 shrink-0 shadow-sm"
                            >
                              <X size={18} strokeWidth={2.5} />
                            </button>
                          </>
                        )}
                        {stage.status === 'hired' && (
                          <div className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-50/50 dark:bg-emerald-500/5 ring-1 ring-inset ring-emerald-200/50 dark:ring-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-extrabold uppercase tracking-widest rounded-xl cursor-default opacity-80">
                            <Check size={16} strokeWidth={2.5} /> Onboarded
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Empty State per Column */}
                {apps.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-200/60 dark:border-slate-700/40 rounded-[1.25rem] bg-white/30 dark:bg-slate-900/20 text-slate-400 dark:text-slate-500 m-1">
                    <span className="text-[11px] font-bold uppercase tracking-widest opacity-60">No applicants</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Rejected Applicants Section */}
      {rejected.length > 0 && (
        <div className="mt-10 pt-8 border-t border-slate-200/60 dark:border-slate-800/60">
          <details className="group cursor-pointer outline-none bg-slate-50/50 dark:bg-slate-900/30 rounded-[1.5rem] ring-1 ring-inset ring-slate-200/60 dark:ring-slate-800/50 transition-all hover:bg-slate-50 dark:hover:bg-slate-900/50">
            <summary className="flex items-center gap-3 p-5 text-sm font-extrabold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors list-none outline-none [&::-webkit-details-marker]:hidden">
              <div className="p-1.5 bg-slate-200/50 dark:bg-slate-800 rounded-lg group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
                <ChevronRight size={16} className="transition-transform duration-300 group-open:rotate-90" />
              </div>
              <div className="flex items-center gap-2.5">
                <UserMinus size={18} />
                <span className="tracking-tight">Rejected Applicants</span>
                <span className="flex items-center justify-center min-w-[24px] h-6 px-1.5 bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full text-[11px] ml-1">
                  {rejected.length}
                </span>
              </div>
            </summary>
            
            <div className="flex flex-wrap gap-2.5 px-6 pb-6 pt-1 animate-in slide-in-from-top-4 fade-in duration-300">
              {rejected.map(app => {
                const applicant = app.userId as any;
                return (
                  <div 
                    key={app._id || app.id} 
                    className="flex items-center gap-2 px-3.5 py-1.5 bg-rose-50 dark:bg-rose-500/5 ring-1 ring-inset ring-rose-200/60 dark:ring-rose-500/20 rounded-full text-xs font-bold text-rose-700 dark:text-rose-400 transition-colors hover:bg-rose-100 dark:hover:bg-rose-500/10"
                  >
                    {applicant?.avatar ? (
                       <img src={applicant.avatar} alt={applicant.name} className="w-4 h-4 rounded-full object-cover" />
                    ) : (
                      <div className="w-4 h-4 rounded-full bg-rose-200 dark:bg-rose-500/30 flex items-center justify-center text-[8px]">{applicant?.name?.charAt(0) || '?'}</div>
                    )}
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