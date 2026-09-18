import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { getAssetUrl } from '../api/client';
import { 
  Bookmark, 
  ChevronDown, 
  Layers,
  Palette,
  Globe,
  ArrowUpRight,
  ExternalLink,
  Github
} from 'lucide-react';

interface ProjectsProps {
  onSelectProject?: (projectId: string) => void;
}

export const Projects: React.FC<ProjectsProps> = ({ onSelectProject }) => {
  const { projects, isLoading } = usePortfolio();
  const [activeCategory, setActiveCategory] = useState<'all' | 'graphic-design' | 'web-building'>('all');
  const [bookmarkedIds, setBookmarkedIds] = useState<Record<string, boolean>>({});
  
  // Default to 6 projects initially as requested
  const [visibleCount, setVisibleCount] = useState<number>(6);

  // Exclude hidden projects on public showcase
  const publicProjects = projects.filter((p) => !p.hidden);

  const filteredProjects = activeCategory === 'all'
    ? publicProjects
    : publicProjects.filter((p) => p.category === activeCategory);

  const displayedProjects = filteredProjects.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProjects.length;

  const handleCategoryChange = (category: 'all' | 'graphic-design' | 'web-building') => {
    setActiveCategory(category);
    // Reset back to 6 whenever category filter changes
    setVisibleCount(6);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section
      id="projects"
      className="relative w-full py-20 sm:py-28 md:py-36 bg-[#faf8f5] dark:bg-[#090807] text-neutral-900 dark:text-[#f4ece1] border-t border-neutral-200/80 dark:border-neutral-900/60 overflow-hidden flex justify-center transition-colors duration-300"
    >
      {/* Subtle ambient light glows */}
      <div className="absolute top-1/4 -right-32 w-96 h-96 rounded-full bg-[#d6ad60]/5 dark:bg-[#d6ad60]/3 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 -left-32 w-96 h-96 rounded-full bg-[#c5a059]/5 dark:bg-[#c5a059]/3 blur-3xl pointer-events-none" />

      <div className="w-full max-w-7xl px-4 sm:px-6 md:px-12 lg:px-16 relative z-10">
        
        {/* Section Header & Category Filters */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-8 mb-10 sm:mb-14 pb-6 sm:pb-8 border-b border-neutral-200 dark:border-neutral-800/80">
          <div>
            <div className="flex items-center gap-3 mb-2.5">
              <span className="w-8 h-[2px] bg-[#d6ad60]" />
              <span className="text-xs font-semibold tracking-[0.28em] text-[#d6ad60] uppercase">
                03 / PORTFOLIO SHOWCASE
              </span>
            </div>
            <h2 className="font-serif-luxury text-2xl sm:text-4xl md:text-5xl text-neutral-900 dark:text-[#f4ece1] font-normal leading-tight">
              Selected <span className="text-[#d6ad60] italic">Creations</span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1.5 font-light">
              Crafted with optical precision in Graphic Design & Website Building.
            </p>
          </div>

          {/* Minimalist Category Filter Bar: Graphic Design & Website Building */}
          {/* Rule: For "All Projects", do NOT show number count. Only show "All Projects" */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
            {[
              { id: 'all', label: 'All Projects', icon: Layers },
              { id: 'graphic-design', label: 'Graphic Design', icon: Palette },
              { id: 'web-building', label: 'Website Building', icon: Globe },
            ].map((tab) => {
              const isActive = activeCategory === tab.id;
              const Icon = tab.icon;

              return (
                <button
                  key={tab.id}
                  onClick={() => handleCategoryChange(tab.id as any)}
                  className={`px-4 py-2 sm:py-2.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                    isActive
                      ? 'bg-neutral-900 text-white dark:bg-[#f4ece1] dark:text-[#090807] shadow-sm'
                      : 'bg-white dark:bg-[#141210] text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 hover:border-[#d6ad60]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 opacity-70" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Minimalist Projects Grid / Skeleton State: Zero demo projects rendered */}
        {isLoading && displayedProjects.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 animate-pulse">
            {[1, 2].map((idx) => (
              <div
                key={idx}
                className="flex flex-col rounded-2xl sm:rounded-3xl bg-neutral-100/70 dark:bg-[#110f0d]/60 border border-neutral-200/60 dark:border-neutral-800/60 p-5 sm:p-7"
              >
                <div className="aspect-[16/10] w-full rounded-xl bg-neutral-200/70 dark:bg-neutral-800/60 mb-5" />
                <div className="h-4 w-1/4 rounded bg-neutral-200/70 dark:bg-neutral-800/60 mb-3" />
                <div className="h-6 w-3/4 rounded bg-neutral-200/70 dark:bg-neutral-800/60 mb-3" />
                <div className="h-3 w-full rounded bg-neutral-200/50 dark:bg-neutral-800/40 mb-2" />
                <div className="h-3 w-2/3 rounded bg-neutral-200/50 dark:bg-neutral-800/40" />
              </div>
            ))}
          </div>
        ) : displayedProjects.length === 0 ? (
          <div className="w-full py-20 text-center flex flex-col items-center justify-center">
            <p className="font-outfit text-sm text-neutral-500 dark:text-neutral-400">
              No projects published in this category yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
          {displayedProjects.map((project) => {
            const isBookmarked = !!bookmarkedIds[project.id];
            const isGraphic = project.category === 'graphic-design';

            return (
              <article
                key={project.id}
                id={`project-card-${project.id}`}
                onClick={() => onSelectProject?.(project.id)}
                className="group relative flex flex-col rounded-2xl sm:rounded-3xl bg-white dark:bg-[#110f0d] border border-neutral-200/80 dark:border-neutral-800/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] hover:border-[#d6ad60]/60 dark:hover:border-[#d6ad60]/50 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.45)] transition-all duration-300 overflow-hidden cursor-pointer"
              >
                {/* 1. Cover Image: Fluid responsive aspect ratio (no overflow/overlapping) */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900">
                  <img
                    src={getAssetUrl(project.image)}
                    alt={project.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  {/* Subtle soft gradient fade at bottom */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />

                  {/* Category Pill Badge on Top-Left */}
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-outfit font-medium backdrop-blur-md bg-black/60 text-[#f4ece1] border border-white/10 shadow-sm">
                      {isGraphic ? <Palette className="w-3 h-3 text-[#d6ad60]" /> : <Globe className="w-3 h-3 text-[#d6ad60]" />}
                      <span>{isGraphic ? 'Graphic Design' : 'Website Building'}</span>
                    </span>
                  </div>

                  {/* Bookmark Button in Top-Right */}
                  <button
                    onClick={(e) => toggleBookmark(project.id, e)}
                    aria-label="Save project"
                    className={`absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full backdrop-blur-md border transition-all duration-200 flex items-center justify-center cursor-pointer shadow-sm ${
                      isBookmarked
                        ? 'bg-[#d6ad60] text-black border-[#d6ad60]'
                        : 'bg-white/90 dark:bg-black/60 text-neutral-700 dark:text-neutral-200 border-white/40 dark:border-white/10 hover:text-[#d6ad60] hover:scale-105'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* 2. Minimalist Content Body */}
                <div className="p-5 sm:p-6 flex flex-col justify-between flex-grow">
                  
                  <div>
                    {/* Category & Year Minimal Line */}
                    <div className="flex items-center justify-between text-[11px] font-outfit font-medium text-neutral-400 dark:text-neutral-500 mb-2">
                      <span className="uppercase tracking-wider font-semibold text-[#c5a059] dark:text-[#d6ad60]">
                        {isGraphic ? 'Graphic Design' : 'Website Building'}
                      </span>
                      <span>{project.year}</span>
                    </div>

                    {/* Title */}
                    <h3 className="font-outfit text-lg sm:text-xl font-bold text-neutral-900 dark:text-[#f4ece1] tracking-tight group-hover:text-[#d6ad60] transition-colors leading-snug">
                      {project.title}
                    </h3>

                    {/* Subtitle */}
                    {project.subtitle && (
                      <p className="font-sans text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1.5 line-clamp-2 leading-relaxed font-light">
                        {project.subtitle}
                      </p>
                    )}

                    {/* Category-Specific Metadata */}
                    {isGraphic ? (
                      <div className="mt-3 space-y-2">
                        {project.clientName && (
                          <div className="text-[11px] font-outfit text-neutral-600 dark:text-neutral-300 flex items-center gap-1.5">
                            <span className="text-neutral-400 uppercase tracking-wider text-[10px]">Client:</span>
                            <span className="font-semibold text-[#c5a059] dark:text-[#d6ad60]">{project.clientName}</span>
                          </div>
                        )}
                        {project.deliverables && (
                          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1 font-light">
                            <span className="text-neutral-400 uppercase tracking-wider text-[10px] font-semibold mr-1">Scope:</span>
                            {project.deliverables}
                          </p>
                        )}
                        {/* Design Tools Tags */}
                        {((project.designTools && project.designTools.length > 0) ? project.designTools : project.techStack).length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {((project.designTools && project.designTools.length > 0) ? project.designTools : project.techStack).slice(0, 3).map((tool, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] sm:text-[11px] font-outfit font-medium px-2 py-0.5 rounded-md bg-amber-500/10 dark:bg-amber-500/15 text-amber-700 dark:text-[#d6ad60] border border-amber-500/20"
                              >
                                {tool}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="mt-3 space-y-2">
                        {/* Web Tech Stack Tags */}
                        {project.techStack && project.techStack.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {project.techStack.slice(0, 3).map((tech, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] sm:text-[11px] font-outfit font-medium px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800/60 text-neutral-600 dark:text-neutral-400 border border-neutral-200/50 dark:border-neutral-700/50"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                        {/* Live / Github link hint */}
                        {(project.demoUrl || project.githubUrl) && (
                          <div className="flex items-center gap-2 text-[10px] text-neutral-400 pt-0.5">
                            {project.demoUrl && <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">&bull; Live Demo</span>}
                            {project.githubUrl && <span className="flex items-center gap-1 text-neutral-500 dark:text-neutral-400">&bull; Code Repo</span>}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 3. Minimalist Bottom Action Bar */}
                  <div className="pt-4 mt-5 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between">
                    <span className="text-[11px] font-outfit text-neutral-400 dark:text-neutral-500">
                      {isGraphic ? 'Explore Design Specs' : 'Explore Web Project'}
                    </span>

                    <div className="inline-flex items-center gap-1 text-xs font-outfit font-bold text-neutral-900 dark:text-white group-hover:text-[#d6ad60] dark:group-hover:text-[#d6ad60] transition-colors">
                      <span>View Details</span>
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>

                </div>
              </article>
            );
          })}
        </div>
        )}

        {/* 4. Centered "View More" (ভিউ মোর) Button Section */}
        {/* Rule: No "Showing X of Y projects (Loads 6 per step)" text. Only the clean button. */}
        {hasMore && (
          <div className="flex justify-center mt-12 sm:mt-16">
            <button
              onClick={handleLoadMore}
              className="group relative inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-white dark:bg-[#110f0d] border border-neutral-300 dark:border-neutral-800 hover:border-[#d6ad60] dark:hover:border-[#d6ad60] text-neutral-900 dark:text-[#f4ece1] text-xs sm:text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
            >
              <span>View More Projects</span>
              <span className="w-5 h-5 rounded-full bg-neutral-100 dark:bg-neutral-800 group-hover:bg-[#d6ad60] group-hover:text-black flex items-center justify-center transition-colors text-xs text-neutral-600 dark:text-neutral-400">
                <ChevronDown className="w-3 h-3 transition-transform duration-300 group-hover:translate-y-0.5" />
              </span>
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
