import React from 'react';
import { Calendar, Users, Clock, Star, Activity, CheckCircle2, Layers, Target, Code2 } from 'lucide-react';
import { Project } from '../../../types';
import { getUserById, getCohortById } from '../../../data/mockData';
import { formatDate, getDaysUntil, getStatusLabel } from '../../../utils/helpers';

interface ProjectBriefingProps {
  project: Project;
}

const ProjectBriefing: React.FC<ProjectBriefingProps> = ({ project }) => {
  const host = project.hostId && typeof project.hostId === 'object' ? project.hostId as { _id: string; name: string; avatar?: string; role?: string; reputation?: number; completedProjects?: number } : null;
  const cohort = project.cohortId && typeof project.cohortId === 'object' ? project.cohortId as { _id: string; name: string } : null;
  const daysLeft = getDaysUntil(project.deadline);

  // Helper for status badge styling
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20';
      case 'hiring':
        return 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20';
      default:
        return 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20';
    }
  };

  // Helper for deadline text coloring
  const deadlineColor = 
    daysLeft <= 0 ? 'text-rose-600 dark:text-rose-400 font-bold' : 
    daysLeft <= 7 ? 'text-amber-600 dark:text-amber-400 font-bold' : 
    'text-slate-600 dark:text-slate-400';

  return (
    <div className="space-y-6 md:space-y-8">
      
      {/* Header Section (Title & Host) */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        
        {/* Left: Main Details */}
        <div className="flex-1 space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border ${getStatusStyles(project.status)}`}>
              <Activity size={14} />
              {getStatusLabel(project.status)}
            </span>
            {cohort && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                <Layers size={14} />
                {cohort.name}
              </span>
            )}
          </div>
          
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {project.title}
          </h1>
          
          <p className="text-base md:text-lg font-medium text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
            {project.pitch}
          </p>

          {/* Meta Info Bar */}
          <div className="flex flex-wrap items-center gap-4 md:gap-8 p-4 md:p-5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700/60">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400">
              <Calendar size={16} className="text-slate-400" /> 
              <span>{formatDate(project.createdAt)} — {formatDate(project.deadline)}</span>
            </div>
            <div className={`flex items-center gap-2 text-sm font-medium ${deadlineColor}`}>
              <Clock size={16} /> 
              <span>{daysLeft > 0 ? `${daysLeft} days left` : 'Deadline passed'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400">
              <Users size={16} className="text-slate-400" /> 
              <span><strong className="text-slate-900 dark:text-white">{project.currentParticipants}</strong>/{project.maxParticipants} members</span>
            </div>
          </div>
        </div>

        {/* Right: Host Card */}
        <div className="w-full lg:w-72 shrink-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col items-center text-center shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
            Project Mentor
          </div>
          
          {host?.avatar ? (
            <img 
              src={host.avatar} 
              alt={host.name} 
              className="w-16 h-16 rounded-full object-cover border-2 border-slate-100 dark:border-slate-800 mb-3 shadow-sm bg-slate-50 dark:bg-slate-800" 
            />
          ) : (
            <div className="w-16 h-16 rounded-full border-2 border-slate-100 dark:border-slate-800 mb-3 shadow-sm bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
              <span className="text-xl font-bold text-slate-500">{host?.name?.charAt(0) || '?'}</span>
            </div>
          )}
          
          <div className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
            {host?.name || 'Unknown Mentor'}
          </div>
          <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 mb-4">
            {host?.role || 'Member'}
          </div>
          
          <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700/50">
            <Star size={14} className="text-amber-500 fill-amber-500" />
            <span className="font-bold text-slate-900 dark:text-white">{host?.reputation || 0}</span>
            <span className="opacity-50 mx-1">•</span>
            <span>{host?.completedProjects || 0} projects</span>
          </div>
        </div>
        
      </div>

      {/* Two Column Grid for Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        
        {/* Problem Statement */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Target className="text-blue-600 dark:text-blue-500" size={20} />
            Problem Statement
          </h3>
          <p className="text-sm md:text-base font-medium text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
            {project.problemStatement}
          </p>
        </div>

        {/* Tech Stack */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
            <Code2 className="text-blue-600 dark:text-blue-500" size={20} />
            Tech Stack
          </h3>
          <div className="flex flex-wrap gap-2.5">
            {project.techStack.map(tech => (
              <span 
                key={tech} 
                className="px-4 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-bold border border-slate-200 dark:border-slate-700/80 shadow-sm transition-colors hover:bg-white dark:hover:bg-slate-800"
              >
                {tech}
              </span>
            ))}
            {project.techStack.length === 0 && (
              <span className="text-sm font-medium text-slate-400 italic">No technologies specified.</span>
            )}
          </div>
        </div>

      </div>

      {/* Team Roles */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
          <Users className="text-blue-600 dark:text-blue-500" size={20} />
          Team Roles
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {project.roles.map(role => {
            const assignee = role.assignedUserId ? getUserById(role.assignedUserId) : null;
            const isOpen = !role.filled || !assignee;
            
            return (
              <div 
                key={role.id} 
                className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border ${
                  isOpen 
                    ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500/50 shadow-sm transition-colors' 
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/50'
                }`}
              >
                <div className="mb-3 sm:mb-0 pr-4">
                  <div className="font-bold text-slate-900 dark:text-white text-base leading-tight mb-1">
                    {role.title}
                  </div>
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {role.skillsRequired.join(' • ')}
                  </div>
                </div>
                
                <div className="shrink-0 flex items-center justify-end sm:justify-start">
                  {!isOpen && assignee ? (
                    <div className="flex items-center gap-3 px-3 py-1.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                      <img 
                        src={assignee.avatar} 
                        alt={assignee.name} 
                        className="w-7 h-7 rounded-full object-cover border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                      />
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate max-w-[100px]">
                        {assignee.name.split(' ')[0]}
                      </span>
                      <span className="flex items-center gap-1 ml-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 size={14} /> Filled
                      </span>
                    </div>
                  ) : (
                    <span className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
                      Open Role
                    </span>
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

export default ProjectBriefing;