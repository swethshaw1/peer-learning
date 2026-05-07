import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Project } from '../../../types';
import ProjectCard from './ProjectCard';

interface TrendingSectionProps {
  projects: Project[];
}

const TrendingSection: React.FC<TrendingSectionProps> = ({ projects }) => {
  if (projects.length === 0) return null;

  return (
    <section 
      aria-label="Recommended Projects" 
      className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out"
    >
      {/* Header Area */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5 tracking-tight">
          <Sparkles className="text-amber-500 animate-pulse" size={24} />
          Recommended for You
        </h2>
        {/* Subtle scroll hint for desktop users */}
        <span className="hidden md:flex items-center gap-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-full">
          Swipe or Scroll <ArrowRight size={14} className="animate-bounce-x" />
        </span>
      </div>

      {/* Carousel Container */}
      <div className="relative -mx-4 px-4 md:mx-0 md:px-0 group">
        
        {/* Edge fade gradients to indicate overflow scrolling */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-r from-slate-50 dark:from-[#0F172A] to-transparent z-10 transition-opacity duration-300 opacity-0 md:group-hover:opacity-100" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-l from-slate-50 dark:from-[#0F172A] to-transparent z-10 transition-opacity duration-300 md:opacity-100" />

        {/* Scrollable Track */}
        <div 
          className="flex overflow-x-auto gap-5 pb-6 pt-2 snap-x snap-mandatory scroll-smooth 
                     [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {projects.map((project) => (
            <div 
              key={project.id} 
              className="min-w-[85vw] max-w-[85vw] sm:min-w-[340px] sm:max-w-[340px] lg:min-w-[380px] lg:max-w-[380px] snap-start shrink-0 flex h-auto"
            >
              {/* Card Wrapper for uniform height and hover states */}
              <div className="w-full h-full transition-transform duration-300 ease-out hover:-translate-y-1.5 will-change-transform">
                 <ProjectCard project={project} />
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
};

export default TrendingSection;