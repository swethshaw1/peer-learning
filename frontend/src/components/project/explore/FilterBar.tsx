import React from 'react';
import { Search, Filter, Layers } from 'lucide-react';

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
    <div className="flex flex-col gap-5 p-4 md:p-5">
      
      {/* Top Row: Search and Status Filters */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full xl:max-w-md group">
          <Search 
            size={18} 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none" 
          />
          <input
            type="text"
            placeholder="Search projects by title, pitch, or tech stack..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-xl pl-11 pr-4 py-2.5 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all shadow-sm"
          />
        </div>

        {/* Status Segmented Control */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/50 overflow-x-auto hide-scrollbar self-start xl:self-auto">
          {statuses.map(status => {
            const isActive = selectedStatus === status;
            return (
              <button
                key={status}
                onClick={() => onStatusChange(status)}
                className={`
                  flex items-center gap-1.5 whitespace-nowrap px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                  ${isActive 
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm border border-slate-200/50 dark:border-slate-700/50' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 border border-transparent'
                  }
                `}
              >
                {status === 'All' && <Layers size={14} className={isActive ? 'text-blue-500' : 'text-slate-400'} />}
                {status}
              </button>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-slate-100 dark:bg-slate-800/80" />

      {/* Bottom Row: Skill Toggles */}
      <div className="flex items-start md:items-center gap-3">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest shrink-0 pt-2 md:pt-0">
          <Filter size={14} /> Skills:
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {skills.map(skill => {
            const isActive = selectedSkills.includes(skill);
            return (
              <button
                key={skill}
                onClick={() => onSkillToggle(skill)}
                className={`
                  px-3 py-1.5 rounded-full text-[11px] font-bold transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-slate-900
                  ${isActive
                    ? 'bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-400 shadow-sm shadow-blue-500/5'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }
                `}
              >
                {skill}
              </button>
            );
          })}
          
          {/* Helper clear button if skills are selected */}
          {selectedSkills.length > 0 && (
            <button
              onClick={() => onSkillToggle('clear_all')} // You can handle this in the parent to clear all
              className="px-3 py-1.5 rounded-full text-[11px] font-bold text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 underline decoration-slate-300 dark:decoration-slate-700 underline-offset-2 transition-colors ml-1 outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              Clear Skills
            </button>
          )}
        </div>
      </div>

    </div>
  );
};

export default FilterBar;