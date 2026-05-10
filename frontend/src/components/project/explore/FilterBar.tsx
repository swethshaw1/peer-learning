import React from 'react';
import { Search, Filter, Layers, X } from 'lucide-react';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedSkills: string[];
  onSkillToggle: (skill: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
}

const skills = ['React', 'Node.js', 'Python', 'TypeScript', 'Go', 'Next.js', 'AI/ML', 'DevOps'];
const statuses = ['All', 'Hiring', 'In Progress', 'Completed'];

const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedSkills,
  onSkillToggle,
  selectedStatus,
  onStatusChange,
}) => {
  return (
    <div className="flex flex-col gap-6 p-5 md:p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-[2rem] shadow-xl shadow-slate-200/10 dark:shadow-slate-900/40 animate-in fade-in slide-in-from-top-4 duration-500">
      
      {/* Top Row: Search and Status Filters */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5">
        
        {/* Search Input */}
        <div className="relative w-full xl:max-w-xl group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200/80 dark:border-slate-700/80 group-focus-within:border-blue-500 dark:group-focus-within:border-blue-500 transition-colors pointer-events-none z-10">
            <Search 
              size={14} 
              strokeWidth={2.5}
              className="text-slate-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors duration-300" 
            />
          </div>
          <input
            type="text"
            placeholder="Search projects by title, pitch, or tech stack..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full bg-slate-50/80 dark:bg-slate-800/40 ring-1 ring-inset ring-slate-200/80 dark:ring-slate-700/80 rounded-[1.25rem] pl-[3.25rem] pr-5 py-3.5 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent focus:bg-white dark:focus:bg-slate-900 transition-all duration-300 hover:ring-slate-300 dark:hover:ring-slate-600"
          />
        </div>

        {/* Status Segmented Control */}
        <div className="flex items-center p-1.5 bg-slate-50 dark:bg-slate-800/50 rounded-[1.25rem] ring-1 ring-inset ring-slate-200/60 dark:ring-slate-700/50 overflow-x-auto hide-scrollbar self-start xl:self-auto w-full xl:w-auto">
          {statuses.map(status => {
            const isActive = selectedStatus === status;
            return (
              <button
                key={status}
                onClick={() => onStatusChange(status)}
                className={`
                  flex items-center justify-center gap-2 whitespace-nowrap px-5 py-2.5 rounded-xl text-sm font-extrabold transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 flex-1 xl:flex-none
                  ${isActive 
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-200 dark:ring-slate-700' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/40 dark:hover:bg-slate-700/40'
                  }
                `}
              >
                {status === 'All' && <Layers size={14} strokeWidth={2.5} className={isActive ? 'text-blue-500 dark:text-blue-400' : 'text-slate-400'} />}
                {status}
              </button>
            );
          })}
        </div>
      </div>

      {/* Elegant Divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700/80 to-transparent opacity-70" />

      {/* Bottom Row: Skill Toggles */}
      <div className="flex flex-col md:flex-row md:items-start gap-4">
        <div className="flex items-center gap-2 text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest shrink-0 md:pt-2.5">
          <Filter size={14} strokeWidth={2.5} /> Skills
        </div>
        
        <div className="flex flex-wrap items-center gap-2.5">
          {skills.map(skill => {
            const isActive = selectedSkills.includes(skill);
            return (
              <button
                key={skill}
                onClick={() => onSkillToggle(skill)}
                className={`
                  px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 active:scale-95
                  ${isActive
                    ? 'bg-blue-50 dark:bg-blue-500/10 ring-1 ring-inset ring-blue-300 dark:ring-blue-500/30 text-blue-700 dark:text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.15)]'
                    : 'bg-white dark:bg-slate-900 ring-1 ring-inset ring-slate-200 dark:ring-slate-700/80 text-slate-600 dark:text-slate-300 hover:ring-slate-300 dark:hover:ring-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }
                `}
              >
                {skill}
              </button>
            );
          })}
          
          {/* Polished Clear Button */}
          {selectedSkills.length > 0 && (
            <button
              onClick={() => onSkillToggle('clear_all')}
              className="group flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all duration-300 ml-1 outline-none focus-visible:ring-2 focus-visible:ring-rose-500 active:scale-95"
            >
              <X size={14} strokeWidth={2.5} className="group-hover:rotate-90 transition-transform duration-300" />
              Clear Selection
            </button>
          )}
        </div>
      </div>

    </div>
  );
};

export default FilterBar;