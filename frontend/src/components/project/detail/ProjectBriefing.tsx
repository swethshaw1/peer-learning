import React from 'react';
import { Calendar, Users, Clock, Star, Activity, CheckCircle2, Layers, Target, Code2, Sparkles } from 'lucide-react';
import { Project } from '../../../types';
import { formatDate, getDaysUntil, getStatusLabel } from '../../../utils/helpers';

interface ProjectBriefingProps {
  project: Project;
}

const ProjectBriefing: React.FC<ProjectBriefingProps> = ({ project }) => {
  const host = project.hostId && typeof project.hostId === 'object' ? project.hostId as { _id: string; name: string; avatar?: string; role?: string; reputation?: number; completedProjects?: number } : null;
  const cohort = project.cohortId && typeof project.cohortId === 'object' ? project.cohortId as { _id: string; name: string } : null;
  const daysLeft = getDaysUntil(project.deadline);

  // Premium status badge styling with inset rings
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 ring-emerald-200/80 dark:ring-emerald-500/30';
      case 'hiring':
        return 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 ring-amber-200/80 dark:ring-amber-500/30';
      default:
        return 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 ring-blue-200/80 dark:ring-blue-500/30';
    }
  };

  // Helper for deadline text coloring
  const deadlineColor = 
    daysLeft < 0 ? 'text-rose-600 dark:text-rose-400 font-bold' : 
    daysLeft <= 7 ? 'text-amber-600 dark:text-amber-400 font-bold' : 
    'text-slate-600 dark:text-slate-300';

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      
      {/* Header Section (Title & Host) */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        
        {/* Left: Main Details */}
        <div className="flex-1 space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-500 fill-mode-both delay-100">
          <div className="flex flex-wrap items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest ring-1 ring-inset shadow-sm ${getStatusStyles(project.status)}`}>
              {project.status === 'hiring' ? <Sparkles size={13} /> : <Activity size={13} />}
              {getStatusLabel(project.status)}
            </span>
            {cohort && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest bg-slate-50 dark:bg-slate-800/50 ring-1 ring-inset ring-slate-200 dark:ring-slate-700/80 text-slate-600 dark:text-slate-300 shadow-sm">
                <Layers size={13} />
                {cohort.name}
              </span>
            )}
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight drop-shadow-sm">
            {project.title}
          </h1>
          
          <p className="text-base md:text-lg font-medium text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
            {project.pitch}
          </p>

          {/* Premium Meta Info Bar */}
          <div className="flex flex-wrap items-center gap-6 md:gap-10 p-5 md:px-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[1.5rem] border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-slate-900/40">
            <div className="flex items-center gap-3 group">
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl group-hover:scale-110 group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10 transition-all duration-300">
                <Calendar size={18} className="text-slate-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" /> 
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Timeline</span>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{formatDate(project.createdAt)} — {formatDate(project.deadline)}</span>
              </div>
            </div>
            
            <div className="w-px h-10 bg-slate-200/80 dark:bg-slate-700/80 hidden md:block" />

            <div className="flex items-center gap-3 group">
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl group-hover:scale-110 transition-all duration-300">
                <Clock size={18} className={`transition-colors ${daysLeft <= 7 && daysLeft >= 0 ? 'text-amber-500' : daysLeft < 0 ? 'text-rose-500' : 'text-slate-400 group-hover:text-blue-500'}`} /> 
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Status</span>
                <span className={`text-sm font-bold ${deadlineColor}`}>
                  {daysLeft > 0 ? `${daysLeft} days remaining` : daysLeft === 0 ? 'Due today' : 'Deadline passed'}
                </span>
              </div>
            </div>

            <div className="w-px h-10 bg-slate-200/80 dark:bg-slate-700/80 hidden md:block" />

            <div className="flex items-center gap-3 group">
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl group-hover:scale-110 group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10 transition-all duration-300">
                <Users size={18} className="text-slate-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" /> 
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Team Size</span>
                <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
                  <strong className="text-slate-900 dark:text-white">{project.currentParticipants}</strong> / {project.maxParticipants} filled
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Host Card */}
        <div className="w-full lg:w-80 shrink-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-[2rem] p-6 flex flex-col items-center text-center shadow-xl shadow-slate-200/20 dark:shadow-slate-900/40 relative overflow-hidden transition-transform duration-500 hover:-translate-y-1 hover:shadow-2xl animate-in slide-in-from-bottom-8 fade-in duration-500 fill-mode-both delay-150">
          {/* Decorative Banner Background */}
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20" />
          
          <div className="relative text-[10px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-5 bg-blue-50 dark:bg-blue-500/20 px-3 py-1 rounded-full ring-1 ring-inset ring-blue-500/20">
            Project Mentor
          </div>
          
          <div className="relative mb-4">
            {host?.avatar ? (
              <img 
                src={host.avatar} 
                alt={host.name} 
                className="w-20 h-20 rounded-full object-cover ring-4 ring-white dark:ring-slate-900 shadow-md bg-slate-50 dark:bg-slate-800" 
              />
            ) : (
              <div className="w-20 h-20 rounded-full ring-4 ring-white dark:ring-slate-900 shadow-md bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center">
                <span className="text-2xl font-black text-slate-500 dark:text-slate-400">{host?.name?.charAt(0) || '?'}</span>
              </div>
            )}
            {/* Status Dot */}
            <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
          </div>
          
          <div className="relative text-xl font-extrabold text-slate-900 dark:text-white leading-tight">
            {host?.name || 'Unknown Mentor'}
          </div>
          <div className="relative text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1 mb-6">
            {host?.role || 'Senior Developer'}
          </div>
          
          <div className="relative w-full flex items-center justify-center gap-4 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 rounded-2xl ring-1 ring-inset ring-slate-200 dark:ring-slate-700/50">
            <div className="flex items-center gap-1.5">
              <Star size={16} className="text-amber-500 fill-amber-500 drop-shadow-sm" />
              <span className="text-slate-900 dark:text-white text-sm">{host?.reputation || 0}</span>
              <span className="opacity-70 text-[10px] uppercase tracking-wider ml-0.5">Rep</span>
            </div>
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700" />
            <div className="flex items-center gap-1.5">
              <span className="text-slate-900 dark:text-white text-sm">{host?.completedProjects || 0}</span>
              <span className="opacity-70 text-[10px] uppercase tracking-wider">Projects</span>
            </div>
          </div>
        </div>
        
      </div>

      {/* Two Column Grid for Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        
        {/* Problem Statement */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-[2rem] p-6 md:p-8 shadow-xl shadow-slate-200/10 dark:shadow-slate-900/40 animate-in slide-in-from-bottom-8 fade-in duration-500 fill-mode-both delay-200">
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-5 flex items-center gap-3 tracking-tight">
            <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-xl">
              <Target className="text-blue-600 dark:text-blue-400" size={20} />
            </div>
            Problem Statement
          </h3>
          <p className="text-sm md:text-base font-medium text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap bg-slate-50/50 dark:bg-slate-800/30 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/50">
            {project.problemStatement}
          </p>
        </div>

        {/* Tech Stack */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-[2rem] p-6 md:p-8 shadow-xl shadow-slate-200/10 dark:shadow-slate-900/40 animate-in slide-in-from-bottom-8 fade-in duration-500 fill-mode-both delay-300">
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-6 flex items-center gap-3 tracking-tight">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl">
              <Code2 className="text-indigo-600 dark:text-indigo-400" size={20} />
            </div>
            Tech Stack
          </h3>
          <div className="flex flex-wrap gap-3">
            {project.techStack.map(tech => (
              <span 
                key={tech} 
                className="px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-full text-sm font-bold ring-1 ring-inset ring-slate-200 dark:ring-slate-700 shadow-sm transition-all duration-300 hover:ring-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 dark:hover:ring-indigo-500/50 hover:text-indigo-700 dark:hover:text-indigo-300 hover:-translate-y-0.5 cursor-default"
              >
                {tech}
              </span>
            ))}
            {project.techStack.length === 0 && (
              <span className="text-sm font-medium text-slate-400 italic bg-slate-50 dark:bg-slate-800/50 px-4 py-2 rounded-xl">
                No technologies specified.
              </span>
            )}
          </div>
        </div>

      </div>

      {/* Team Roles */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-[2rem] p-6 md:p-8 shadow-xl shadow-slate-200/10 dark:shadow-slate-900/40 animate-in slide-in-from-bottom-8 fade-in duration-500 fill-mode-both delay-[400ms]">
        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-6 flex items-center gap-3 tracking-tight">
          <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl">
            <Users className="text-emerald-600 dark:text-emerald-400" size={20} />
          </div>
          Team Roles
        </h3>
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {project.roles.map(role => {
            const assignee = role.assignedUserId && typeof role.assignedUserId === 'object' ? role.assignedUserId as any : null;
            const isOpen = !role.filled || !assignee;
            
            return (
              <div 
                key={role.id} 
                className={`group flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-[1.25rem] transition-all duration-300 ease-out ${
                  isOpen 
                    ? 'bg-white dark:bg-slate-900/50 ring-1 ring-inset ring-slate-200 dark:ring-slate-700 hover:ring-blue-300 dark:hover:ring-blue-500/50 hover:shadow-[0_8px_20px_-6px_rgba(59,130,246,0.15)] dark:hover:shadow-blue-900/20 hover:-translate-y-0.5' 
                    : 'bg-slate-50/80 dark:bg-slate-800/40 ring-1 ring-inset ring-slate-200/50 dark:ring-slate-700/50 opacity-90 hover:opacity-100'
                }`}
              >
                <div className="mb-4 sm:mb-0 pr-4">
                  <div className={`font-extrabold text-lg leading-tight mb-1.5 transition-colors ${isOpen ? 'text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}>
                    {role.title}
                  </div>
                  <div className="text-[13px] font-semibold text-slate-500 dark:text-slate-400 flex flex-wrap gap-x-2 gap-y-1">
                    {role.skillsRequired.map((skill, i) => (
                      <React.Fragment key={skill}>
                        <span>{skill}</span>
                        {i < role.skillsRequired.length - 1 && <span className="opacity-40">•</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                
                <div className="shrink-0 flex items-center justify-end sm:justify-start">
                  {!isOpen && assignee ? (
                    <div className="flex items-center gap-3 px-3 py-2 bg-white dark:bg-slate-800/80 rounded-xl ring-1 ring-inset ring-slate-200 dark:ring-slate-700 shadow-sm">
                      <img 
                        src={assignee.avatar} 
                        alt={assignee.name} 
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-700 bg-slate-50 dark:bg-slate-900"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate max-w-[120px] leading-tight">
                          {assignee.name.split(' ')[0]}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mt-0.5">
                          <CheckCircle2 size={12} strokeWidth={3} /> Filled
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-widest bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 ring-1 ring-inset ring-blue-200/80 dark:ring-blue-500/30 group-hover:bg-blue-600 group-hover:text-white dark:group-hover:text-white transition-colors duration-300 shadow-sm">
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