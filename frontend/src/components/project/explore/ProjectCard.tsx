import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  BadgeCheck, 
  UserPlus, 
  Activity, 
  CheckCircle2, 
  Layers,
  Sparkles
} from 'lucide-react';
import { Project } from '../../../types';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const navigate = useNavigate();
  const host = project.hostId && typeof project.hostId === 'object' ? project.hostId as { _id: string; name: string; avatar?: string; isVerified?: boolean } : null;
  const cohort = project.cohortId && typeof project.cohortId === 'object' ? project.cohortId as { _id: string; name: string } : null;
  
  const openRoles = project.roles.filter(r => !r.filled).length;
  const totalRoles = project.roles.length;
  const filledRoles = totalRoles - openRoles;

  const handleNavigation = () => {
    navigate(`/project/${project.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleNavigation();
    }
  };

  // Upgraded status badge with inset rings and premium contrast
  const renderStatusBadge = () => {
    switch (project.status) {
      case 'hiring':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50/80 dark:bg-amber-500/10 ring-1 ring-inset ring-amber-200/60 dark:ring-amber-500/30 text-[10px] font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400 shadow-sm">
            <Sparkles size={12} strokeWidth={2.5} /> Hiring
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50/80 dark:bg-emerald-500/10 ring-1 ring-inset ring-emerald-200/60 dark:ring-emerald-500/30 text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 shadow-sm">
            <CheckCircle2 size={12} strokeWidth={2.5} /> Completed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50/80 dark:bg-blue-500/10 ring-1 ring-inset ring-blue-200/60 dark:ring-blue-500/30 text-[10px] font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400 shadow-sm">
            <Activity size={12} strokeWidth={2.5} /> In Progress
          </span>
        );
    }
  };

  return (
    <div 
      onClick={handleNavigation}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`View project details for ${project.title}`}
      className="group relative flex flex-col h-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-[1.5rem] overflow-hidden cursor-pointer transition-all duration-500 ease-out hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.15)] dark:hover:shadow-blue-900/20 hover:border-blue-300/60 dark:hover:border-blue-500/40 hover:-translate-y-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
    >
      {/* Decorative Glowing Top Accent */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Subtle Ambient Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/10 dark:group-hover:bg-blue-500/20 transition-colors duration-500 pointer-events-none" />

      <div className="relative flex flex-col flex-1 p-6 z-10">
        
        {/* Header: Title & Badges */}
        <div className="mb-4">
          <div className="flex flex-wrap items-center gap-2 mb-3.5">
            {renderStatusBadge()}
            {cohort && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 dark:bg-slate-800/80 ring-1 ring-inset ring-slate-200 dark:ring-slate-700/80 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 shadow-sm">
                <Layers size={12} strokeWidth={2.5} /> {cohort.name}
              </span>
            )}
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
            {project.title}
          </h3>
        </div>

        {/* Pitch / Description */}
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-5 flex-1">
          {project.pitch}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-6 mt-auto">
          {project.techStack.slice(0, 4).map(tech => (
            <span 
              key={tech} 
              className="px-2.5 py-1 rounded-full bg-slate-50 dark:bg-slate-800/50 ring-1 ring-inset ring-slate-200 dark:ring-slate-700/80 text-[10px] font-bold text-slate-600 dark:text-slate-300"
            >
              {tech}
            </span>
          ))}
          {project.techStack.length > 4 && (
            <span className="px-2.5 py-1 rounded-full bg-slate-50 dark:bg-slate-800/50 ring-1 ring-inset ring-slate-200 dark:ring-slate-700/80 text-[10px] font-bold text-slate-500 dark:text-slate-400">
              +{project.techStack.length - 4}
            </span>
          )}
        </div>

        {/* Open Roles Section */}
        {openRoles > 0 && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 mb-6">
            <div className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
              <Users size={12} /> Available Roles
            </div>
            <div className="flex flex-wrap gap-2">
              {project.roles.filter(r => !r.filled).map(role => (
                <span 
                  key={role.id} 
                  className="px-2.5 py-1 rounded-lg bg-blue-50/50 dark:bg-blue-500/10 ring-1 ring-inset ring-blue-200/60 dark:ring-blue-500/30 text-[11px] font-bold text-blue-700 dark:text-blue-300"
                >
                  {role.title}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer: Host Info & Team Capacity */}
        <div className={`mt-auto pt-5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between ${openRoles === 0 ? 'mt-0' : ''}`}>
          
          {/* Mentor */}
          <div className="flex items-center gap-3">
            {host?.avatar ? (
              <img 
                src={host.avatar} 
                alt={host.name} 
                className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-700 bg-slate-100 dark:bg-slate-800 shrink-0 shadow-sm" 
              />
            ) : (
              <div className="w-9 h-9 rounded-full ring-2 ring-slate-100 dark:ring-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 shadow-sm">
                <span className="text-xs font-bold text-slate-500">
                  {host?.name?.charAt(0) || '?'}
                </span>
              </div>
            )}
            
            <div className="flex flex-col">
              <span className="text-sm font-extrabold text-slate-900 dark:text-white leading-none mb-1.5">
                {host?.name || 'Unknown User'}
              </span>
              {host?.isVerified ? (
                <span className="flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400 leading-none">
                  <BadgeCheck size={12} className="fill-blue-100 dark:fill-blue-500/20 text-blue-600 dark:text-blue-400" /> 
                  Verified
                </span>
              ) : (
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 leading-none">
                  Mentor
                </span>
              )}
            </div>
          </div>

          {/* Roles Count */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0 bg-slate-50 dark:bg-slate-800/50 px-2.5 py-1.5 rounded-lg ring-1 ring-inset ring-slate-200 dark:ring-slate-700/80">
            <Users size={14} className="text-slate-400 dark:text-slate-500" />
            <span>
              <strong className="text-slate-900 dark:text-white font-extrabold">{filledRoles}</strong> / {totalRoles}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProjectCard;