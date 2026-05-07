import React, { useState, useMemo } from 'react';
import { Telescope, SearchX, Sparkles, PlusCircle } from 'lucide-react';

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

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const filtered = useMemo(() => {
    return projects.filter(p => {
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
  }, [projects, searchQuery, selectedStatus, selectedSkills, selectedCohort]);

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
      <div className="mx-auto space-y-10">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <Telescope className="text-blue-600 dark:text-blue-500" size={32} />
              Explore Projects
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium mt-2 max-w-2xl leading-relaxed">
              Discover cutting-edge projects hosted by peers, filter by your preferred tech stack, and apply to roles that match your expertise.
            </p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:-translate-y-1 transition-all"
          >
            <PlusCircle size={20} />
            Launch Project
          </button>
        </div>

        {/* Trending / Recommended Section */}
        {recommended.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="text-amber-500" size={20} />
              Recommended for You
            </h2>
            <TrendingSection projects={recommended} />
          </div>
        )}

        {/* Filters */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-2 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 p-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Cohort</label>
              <select 
                value={selectedCohort}
                onChange={(e) => setSelectedCohort(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option value="All">All Cohorts</option>
                {cohorts.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
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
        <div>
          <div className="flex items-center justify-between mb-6 border-b border-slate-200 dark:border-slate-800/80 pb-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Project Catalog
            </h2>
            <span className="px-3.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full text-xs font-bold uppercase tracking-wider border border-slate-200 dark:border-slate-700">
              {filtered.length} {filtered.length === 1 ? 'Project' : 'Projects'} Found
            </span>
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white dark:bg-slate-900/50 border border-dashed border-slate-300 dark:border-slate-700/60 rounded-3xl shadow-sm">
              <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-5 border border-slate-200 dark:border-slate-700 shadow-inner">
                <SearchX size={32} className="text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                No projects found
              </h3>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">
                We couldn't find any projects matching your current search and filter criteria. Try adjusting them to see more results.
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-2.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-bold rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        <CreateProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
  );
};


export default ExploreProjects;