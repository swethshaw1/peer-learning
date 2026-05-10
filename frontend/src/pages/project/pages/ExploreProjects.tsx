import React, { useState, useMemo } from 'react';
import { Telescope, SearchX, Sparkles, PlusCircle, ChevronDown, Layers } from 'lucide-react';

import FilterBar from '../../../components/project/explore/FilterBar';
import ProjectCard from '../../../components/project/explore/ProjectCard';
import TrendingSection from '../../../components/project/explore/TrendingSection';
import CreateProjectModal from '../../../components/project/explore/CreateProjectModal';
import { useProject } from '../../../context/ProjectContext';
import { useAuthStore } from '../../../store/authStore';
import { useCohort } from '../../../context/CohortContext';

const statusMap: Record<string, string> = {
  'All': '',
  'Hiring': 'hiring',
  'In Progress': 'in-progress',
  'Completed': 'completed',
};

const ExploreProjects: React.FC = () => {
  const { projects } = useProject();
  const { user } = useAuthStore();
  const { cohorts } = useCohort();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedCohort, setSelectedCohort] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle skill toggle including the 'clear_all' signal from FilterBar
  const handleSkillToggle = (skill: string) => {
    if (skill === 'clear_all') {
      setSelectedSkills([]);
      return;
    }
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const filtered = useMemo(() => {
    return projects.filter(p => {
      // Don't show own projects in Explore
      if (p.hostId === user?._id || (p as any).hostId?._id === user?._id) return false;
      // Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const match = p.title.toLowerCase().includes(q) ||
          p.pitch.toLowerCase().includes(q) ||
          p.techStack.some(t => t.toLowerCase().includes(q));
        if (!match) return false;
      }
      // Status
      if (selectedStatus !== 'All' && p.status !== statusMap[selectedStatus]) return false;
      // Cohort
      if (selectedCohort !== 'All' && p.cohortId !== selectedCohort) return false;
      // Skills
      if (selectedSkills.length > 0) {
        const hasSkill = selectedSkills.some(s => p.techStack.some(t => t.toLowerCase().includes(s.toLowerCase())));
        if (!hasSkill) return false;
      }
      return true;
    });
  }, [projects, searchQuery, selectedStatus, selectedSkills, selectedCohort, user?._id]);

  // Recommended: projects matching user's skills
  const recommended = useMemo(() => {
    return projects
      .filter(p => p.status === 'hiring')
      .filter(p => p.techStack.some(t => (user?.skills || []).some(s => t.toLowerCase().includes(s.toLowerCase()))))
      .slice(0, 4);
  }, [projects, user?.skills]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSkills([]);
    setSelectedStatus('All');
    setSelectedCohort('All');
  };

  return (
    <div className="mx-auto space-y-10 md:space-y-12 animate-in fade-in duration-700 ease-out">
      
      {/* Page Header */}
      <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-6 z-10">
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-12 -left-12 w-64 h-64 bg-blue-500/10 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[11px] font-extrabold uppercase tracking-widest ring-1 ring-inset ring-blue-500/20 mb-4 shadow-sm">
            <Sparkles size={12} strokeWidth={2.5} /> Discover
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3 leading-tight mb-3">
            Explore Projects
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium max-w-2xl leading-relaxed md:text-lg">
            Discover cutting-edge projects hosted by peers, filter by your preferred tech stack, and apply to roles that match your expertise.
          </p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="relative group flex items-center justify-center gap-2.5 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-extrabold text-sm uppercase tracking-widest shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
        >
          <div className="absolute inset-0 bg-white/20 w-full h-full -skew-x-12 translate-x-[-100%] group-hover:animate-[shimmer_2s_infinite]" />
          <PlusCircle size={20} strokeWidth={2.5} />
          Launch Project
        </button>
      </div>

      {/* Trending / Recommended Section */}
      {recommended.length > 0 && (
        <TrendingSection projects={recommended} />
      )}

      {/* Filters Area */}
      <div className="space-y-4 animate-in slide-in-from-bottom-8 fade-in duration-500 delay-150 fill-mode-both">
        
        {/* Cohort Select (Sleek Inline Control) */}
        <div className="flex justify-end">
          <div className="flex items-center gap-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-2xl ring-1 ring-inset ring-slate-200/80 dark:ring-slate-800 shadow-sm">
            <Layers size={14} className="text-slate-400" />
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest hidden sm:block">Cohort</label>
            <div className="relative">
              <select 
                value={selectedCohort}
                onChange={(e) => setSelectedCohort(e.target.value)}
                className="bg-transparent border-none text-sm font-bold text-slate-700 dark:text-slate-200 focus:ring-0 pr-8 py-1 appearance-none cursor-pointer outline-none"
              >
                <option value="All">All Cohorts</option>
                {cohorts.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Main Filter Bar */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedSkills={selectedSkills}
          onSkillToggle={handleSkillToggle}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
        />
      </div>

      {/* Results Section */}
      <div className="animate-in slide-in-from-bottom-8 fade-in duration-500 delay-300 fill-mode-both">
        <div className="flex items-center justify-between mb-8 border-b border-slate-200/60 dark:border-slate-800/60 pb-5">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Project Catalog
          </h2>
          <span className="px-3.5 py-1.5 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 rounded-full text-[11px] font-extrabold uppercase tracking-widest ring-1 ring-inset ring-slate-200 dark:ring-slate-700/50 shadow-sm">
            {filtered.length} {filtered.length === 1 ? 'Match' : 'Matches'}
          </span>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {filtered.map((project, index) => (
              <div 
                key={project.id}
                style={{ animationDelay: `${index * 75}ms` }} 
                className="animate-in slide-in-from-bottom-4 fade-in fill-mode-both duration-500 h-full"
              >
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        ) : (
          /* Premium Empty State */
          <div className="relative overflow-hidden flex flex-col items-center justify-center py-24 px-4 text-center border-2 border-dashed border-slate-200/80 dark:border-slate-800 rounded-[2rem] bg-gradient-to-b from-slate-50/50 to-white dark:from-slate-800/10 dark:to-slate-900/20 group">
            <div className="absolute inset-0 bg-grid-slate-100/[0.05] dark:bg-grid-slate-700/[0.05] bg-[size:20px_20px]" />
            <div className="relative w-24 h-24 bg-white dark:bg-slate-800 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 ring-1 ring-slate-100 dark:ring-slate-700 group-hover:-translate-y-2 transition-transform duration-500 ease-out">
              <SearchX size={40} className="text-slate-400 dark:text-slate-500" strokeWidth={1.5} />
            </div>
            <h3 className="relative text-2xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
              No projects found
            </h3>
            <p className="relative text-base font-medium text-slate-500 dark:text-slate-400 max-w-md mb-8 leading-relaxed">
              We couldn't find any projects matching your current search and filter criteria. Try adjusting them to explore more.
            </p>
            <button
              onClick={clearFilters}
              className="relative px-8 py-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-extrabold uppercase tracking-widest rounded-xl transition-all duration-300 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Creation Modal */}
      <CreateProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default ExploreProjects;