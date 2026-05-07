import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  CheckCircle, 
  BadgeCheck, 
  UserPlus, 
  Activity, 
  CheckCircle2, 
  Layers
} from 'lucide-react';
import { Project } from '../../../types';
import { getUserById, getCohortById } from '../../../data/mockData';

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

  // Helper to render the appropriate status badge
  const renderStatusBadge = () => {
    switch (project.status) {
      case 'hiring':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-500/10 border border-amber-200/50 dark:border-amber-500/20 text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            <UserPlus size={12} /> Hiring
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/50 dark:border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 size={12} /> Completed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-500/10 border border-blue-200/50 dark:border-blue-500/20 text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            <Activity size={12} /> In Progress
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
      className="group relative flex flex-col h-full bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ease-out hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none hover:border-blue-300 dark:hover:border-blue-500/50 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-[#0B1120]"
    >
      {/* Top Banner Accent */}
      <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-indigo-500 opacity-80 group-hover:opacity-100 transition-opacity" />

      <div className="flex flex-col flex-1 p-5">
        
        {/* Header: Title & Badges */}
        <div className="mb-3">
          <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
            {project.title}
          </h3>
          <div className="flex flex-wrap items-center gap-2">
            {renderStatusBadge()}
            {cohort && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <Layers size={12} /> {cohort.name}
              </span>
            )}
          </div>
        </div>

        {/* Pitch / Description */}
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4 flex-1">
          {project.pitch}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.techStack.slice(0, 4).map(tech => (
            <span 
              key={tech} 
              className="px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 text-[10px] font-bold text-slate-500 dark:text-slate-400"
            >
              {tech}
            </span>
          ))}
          {project.techStack.length > 4 && (
            <span className="px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 text-[10px] font-bold text-slate-500 dark:text-slate-400">
              +{project.techStack.length - 4}
            </span>
          )}
        </div>

        {/* Open Roles Section */}
        {openRoles > 0 && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 mb-5">
            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2.5">
              Available Roles
            </div>
            <div className="flex flex-wrap gap-2">
              {project.roles.filter(r => !r.filled).map(role => (
                <span 
                  key={role.id} 
                  className="px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-[11px] font-bold text-blue-600 dark:text-blue-400"
                >
                  {role.title}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer: Host Info & Team Capacity */}
        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          
          {/* Mentor */}
          <div className="flex items-center gap-2.5">
            {host?.avatar ? (
              <img 
                src={host.avatar} 
                alt={host.name} 
                className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shrink-0" 
              />
            ) : (
              <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-slate-500">
                  {host?.name?.charAt(0) || '?'}
                </span>
              </div>
            )}
            
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-900 dark:text-white leading-none mb-1">
                {host?.name || 'Unknown User'}
              </span>
              {host?.isVerified && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-blue-500 leading-none">
                  <BadgeCheck size={12} className="fill-blue-50 text-blue-500 dark:fill-blue-500/20" /> 
                  Verified
                </span>
              )}
            </div>
          </div>

          {/* Roles Count */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 shrink-0">
            <Users size={14} className="text-slate-400" />
            <span>
              <strong className="text-slate-900 dark:text-white">{filledRoles}</strong>/{totalRoles}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProjectCard;