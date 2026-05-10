import React, { useRef, useState, useEffect } from 'react';
import { Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { Project } from '../../../types';
import ProjectCard from './ProjectCard';

interface TrendingSectionProps {
  projects: Project[];
}

const TrendingSection: React.FC<TrendingSectionProps> = ({ projects }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Check scroll position to determine arrow visibility
  const checkScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    // Add a small buffer (e.g., 2px) to account for fractional pixel rounding errors
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 2);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [projects]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = window.innerWidth < 640 ? 300 : 400; // Adjust scroll distance based on screen size
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  if (projects.length === 0) return null;

  return (
    <section 
      aria-label="Recommended Projects" 
      className="mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out"
    >
      {/* Header Area */}
      <div className="flex items-end justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 dark:bg-amber-500/10 rounded-xl shrink-0 ring-1 ring-inset ring-amber-200/50 dark:ring-amber-500/30">
            <Sparkles className="text-amber-500 animate-[pulse_2s_ease-in-out_infinite]" size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-1">
              Top Picks For You
            </h2>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              Curated projects matching your skills
            </p>
          </div>
        </div>

        {/* Custom Navigation Arrows (Desktop) */}
        <div className="hidden md:flex items-center gap-2">
          <button 
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
            className="p-2.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <ArrowLeft size={18} strokeWidth={2.5} />
          </button>
          <button 
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            aria-label="Scroll right"
            className="p-2.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <ArrowRight size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative -mx-4 px-4 md:mx-0 md:px-0 group">
        
        {/* Elegant Fade Gradients */}
        <div className={`pointer-events-none absolute left-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-r from-slate-50 via-slate-50/80 dark:from-[#0B1120] dark:via-[#0B1120]/80 to-transparent z-10 transition-opacity duration-300 ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`pointer-events-none absolute right-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-l from-slate-50 via-slate-50/80 dark:from-[#0B1120] dark:via-[#0B1120]/80 to-transparent z-10 transition-opacity duration-300 ${canScrollRight ? 'opacity-100' : 'opacity-0'}`} />

        {/* Scrollable Track */}
        <div 
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="flex overflow-x-auto gap-5 md:gap-6 pb-8 pt-2 snap-x snap-mandatory scroll-smooth 
                     [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {projects.map((project, index) => (
            <div 
              key={project.id} 
              style={{ animationDelay: `${index * 100}ms` }}
              className="min-w-[85vw] max-w-[85vw] sm:min-w-[340px] sm:max-w-[340px] lg:min-w-[400px] lg:max-w-[400px] snap-center sm:snap-start shrink-0 flex h-auto animate-in slide-in-from-right-8 fade-in duration-500 fill-mode-both"
            >
              <div className="w-full h-full pb-2"> {/* Added pb-2 to prevent shadow clipping */}
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