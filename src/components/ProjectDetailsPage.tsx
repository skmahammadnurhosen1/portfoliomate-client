import React, { useEffect, useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  ExternalLink, 
  Github, 
  Calendar, 
  Clock, 
  Star, 
  Briefcase, 
  Palette, 
  Globe, 
  Share2, 
  Check, 
  Mail,
  Sparkles,
  Layers,
  Code2,
  CheckCheck,
  Compass,
  ShieldCheck,
  Maximize2
} from 'lucide-react';
import { Project } from '../types';
import { usePortfolio } from '../context/PortfolioContext';
import { getAssetUrl } from '../api/client';

interface ProjectDetailsPageProps {
  project: Project;
  onBack: () => void;
  onSelectProject: (projectId: string) => void;
  onNavigateContact?: () => void;
  onOpenCVModal?: () => void;
}

export const ProjectDetailsPage: React.FC<ProjectDetailsPageProps> = ({
  project,
  onBack,
  onSelectProject,
  onNavigateContact,
}) => {
  const { projects, personalInfo } = usePortfolio();
  const [copied, setCopied] = useState(false);
  const [isImageExpanded, setIsImageExpanded] = useState(false);

  // Scroll smoothly to top on project change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [project.id]);

  // Exclude hidden projects for navigation
  const availableProjects = projects.filter((p) => !p.hidden);
  const currentIndex = availableProjects.findIndex((p) => p.id === project.id);
  const prevProject = currentIndex > 0 
    ? availableProjects[currentIndex - 1] 
    : availableProjects[availableProjects.length - 1] || project;
  const nextProject = currentIndex < availableProjects.length - 1 
    ? availableProjects[currentIndex + 1] 
    : availableProjects[0] || project;

  const isGraphic = project.category === 'graphic-design';

  // Copy link handler
  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  // Curated, contextual deliverables based on category
  const deliverables = isGraphic
    ? [
        {
          title: 'Brand Visual Identity & Guidelines',
          desc: 'Comprehensive color palette, typography hierarchy, and logo usage rules for multi-platform cohesion.',
        },
        {
          title: 'Production-Ready Vector Assets',
          desc: 'Exported in scalable SVG, EPS, and high-resolution digital master files for print and web.',
        },
        {
          title: 'Marketing & Promotional Collateral',
          desc: 'Ready-to-use social media banners, advertisement templates, and commercial packaging mockups.',
        },
        {
          title: 'Print Specs (CMYK 300 DPI)',
          desc: 'Pre-flighted with precise bleed lines, crop marks, and color-calibrated color profiles.',
        },
      ]
    : [
        {
          title: 'Fluid Responsive Architecture',
          desc: 'Optimized layout delivering an effortless, adaptive experience across mobile, tablet, and ultra-wide screens.',
        },
        {
          title: 'Blazing Fast Performance',
          desc: 'Lightweight asset bundling, optimized image loading, and clean component execution for instant rendering.',
        },
        {
          title: 'Modern Interactive UI & Motion',
          desc: 'Tactile hover states, smooth micro-interactions, and accessible visual feedback across all elements.',
        },
        {
          title: 'Accessible & Search-Engine Ready',
          desc: 'Built with semantic HTML5, WCAG AA color contrast compliance, and streamlined SEO metadata structure.',
        },
      ];

  return (
    <div
      id="project-details-page"
      className="w-full min-h-screen bg-[#faf8f5] dark:bg-[#090807] text-neutral-900 dark:text-[#f4ece1] font-sans transition-colors duration-300 flex flex-col items-center pb-24 sm:pb-32 selection:bg-[#d6ad60] selection:text-black"
    >
      {/* Ambient background glow for refined modern depth */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-b from-amber-500/[0.04] dark:from-amber-500/[0.03] to-transparent blur-3xl" />
      </div>

      {/* Top Floating Header Strip */}
      <header className="sticky top-0 z-30 w-full backdrop-blur-xl bg-[#faf8f5]/85 dark:bg-[#090807]/85 border-b border-neutral-200/70 dark:border-neutral-900/80 transition-colors">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-12 py-3 sm:py-3.5 flex items-center justify-between gap-4">
          
          {/* Back to Projects Button */}
          <button
            id="back-to-projects-btn"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full border border-neutral-300/80 dark:border-neutral-800 bg-white/90 dark:bg-[#12100e]/90 text-neutral-800 dark:text-neutral-200 hover:border-[#d6ad60] hover:text-[#d6ad60] dark:hover:text-[#d6ad60] text-xs sm:text-sm font-outfit font-medium transition-all shadow-xs group cursor-pointer"
            aria-label="Back to projects"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-[#d6ad60]" />
            <span>Back to Projects</span>
          </button>

          {/* Center: Project Counter Pill */}
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-200/50 dark:bg-neutral-900/80 border border-neutral-300/60 dark:border-neutral-800 text-xs font-outfit font-medium text-neutral-600 dark:text-neutral-400">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d6ad60]" />
            <span>Project {currentIndex + 1} of {availableProjects.length}</span>
          </div>

          {/* Right: Share & Contact Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-[#141210] text-neutral-600 dark:text-neutral-400 hover:text-[#d6ad60] dark:hover:text-[#d6ad60] hover:border-[#d6ad60]/50 text-xs font-outfit font-medium transition-all cursor-pointer shadow-xs"
              title="Copy project link"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Share</span>
                </>
              )}
            </button>

            {onNavigateContact && (
              <button
                onClick={onNavigateContact}
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 text-xs font-outfit font-semibold hover:bg-[#d6ad60] dark:hover:bg-[#d6ad60] dark:hover:text-black transition-all cursor-pointer shadow-xs"
              >
                <Mail className="w-3.5 h-3.5 text-[#d6ad60] dark:text-neutral-900" />
                <span>Start a Project</span>
              </button>
            )}
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-12 pt-8 sm:pt-12 flex flex-col">
        
        {/* Project Header: Category Badge, Year */}
        <div className="flex flex-wrap items-center gap-2.5 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-outfit font-semibold bg-[#d6ad60]/15 dark:bg-[#d6ad60]/10 text-amber-800 dark:text-[#d6ad60] border border-[#d6ad60]/30">
            {isGraphic ? <Palette className="w-3.5 h-3.5 text-[#d6ad60]" /> : <Globe className="w-3.5 h-3.5 text-[#d6ad60]" />}
            <span>{isGraphic ? 'Graphic Design' : 'Website Building'}</span>
          </span>

          <span className="inline-flex items-center gap-1.5 text-xs font-outfit font-medium text-neutral-600 dark:text-neutral-400 px-3 py-1.5 rounded-full bg-white dark:bg-[#141210] border border-neutral-200 dark:border-neutral-800 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-neutral-400" />
            <span>{project.year}</span>
          </span>
        </div>

        {/* Project Title: Clean, Modern Display Typography with Outfit */}
        <h1 className="font-outfit text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-extrabold text-neutral-900 dark:text-white tracking-[-0.03em] leading-[1.12] mb-4">
          {project.title}
        </h1>

        {/* Subtitle / Punchline */}
        <p className="font-sans text-base sm:text-lg md:text-xl text-neutral-600 dark:text-neutral-300 font-normal leading-relaxed max-w-3xl mb-8">
          {project.subtitle}
        </p>

        {/* Modern Bento Metrics Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#12100e] border border-neutral-200/90 dark:border-neutral-800/90 shadow-[0_4px_24px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.4)] mb-8">
          
          {/* Spec 1: Role */}
          <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-neutral-50/70 dark:bg-neutral-900/40">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[#d6ad60] flex items-center justify-center flex-shrink-0">
              <Briefcase className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-outfit font-semibold uppercase tracking-wider text-neutral-400 block">Role</span>
              <span className="text-xs sm:text-sm font-outfit font-bold text-neutral-900 dark:text-neutral-100 truncate block">
                {project.role || (isGraphic ? 'Lead Graphic Designer' : 'Frontend Engineer')}
              </span>
            </div>
          </div>

          {/* Spec 2: Client (Graphic) vs Timeline (Web) */}
          <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-neutral-50/70 dark:bg-neutral-900/40">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[#d6ad60] flex items-center justify-center flex-shrink-0">
              {isGraphic ? <Sparkles className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-outfit font-semibold uppercase tracking-wider text-neutral-400 block">
                {isGraphic ? 'Client' : 'Timeline'}
              </span>
              <span className="text-xs sm:text-sm font-outfit font-bold text-neutral-900 dark:text-neutral-100 truncate block">
                {isGraphic ? (project.clientName || 'Brand Commission') : (project.duration || '7 Days Sprint')}
              </span>
            </div>
          </div>

          {/* Spec 3: Resolution (Graphic) vs Rating (Web) */}
          <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-neutral-50/70 dark:bg-neutral-900/40">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[#d6ad60] flex items-center justify-center flex-shrink-0">
              {isGraphic ? <Compass className="w-4 h-4" /> : <Star className="w-4 h-4 fill-[#d6ad60]" />}
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-outfit font-semibold uppercase tracking-wider text-neutral-400 block">
                {isGraphic ? 'Specs' : 'Rating'}
              </span>
              <span className="text-xs sm:text-sm font-outfit font-bold text-neutral-900 dark:text-neutral-100 truncate block">
                {isGraphic ? (project.dimensions || 'Vector & Print Ready') : (`${project.rating || '5.0'} / 5.0 Rating`)}
              </span>
            </div>
          </div>

          {/* Spec 4: Scope (Graphic) vs Engagement (Web) */}
          <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-neutral-50/70 dark:bg-neutral-900/40">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[#d6ad60] flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-outfit font-semibold uppercase tracking-wider text-neutral-400 block">
                {isGraphic ? 'Deliverables' : 'Engagement'}
              </span>
              <span className="text-xs sm:text-sm font-outfit font-bold text-neutral-900 dark:text-neutral-100 truncate block">
                {isGraphic ? (project.deliverables || 'Full Visual Identity') : (project.rate || 'Direct Client Work')}
              </span>
            </div>
          </div>

        </div>

        {/* Featured Showcase Display Frame */}
        <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-[#12100e] shadow-[0_12px_44px_rgba(0,0,0,0.06)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.55)] mb-6 group">
          
          {/* Top Frame Status Bar */}
          <div className="px-4 sm:px-6 py-2.5 border-b border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/80 dark:bg-neutral-900/60 flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-outfit font-medium text-neutral-600 dark:text-neutral-400">
              {project.title} &bull; Showcase Preview
            </span>

            <button
              onClick={() => setIsImageExpanded(!isImageExpanded)}
              className="inline-flex items-center gap-1.5 text-[11px] font-outfit font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>{isImageExpanded ? 'Standard View' : 'Expand Image'}</span>
            </button>
          </div>

          {/* Project Image */}
          <div className={`relative w-full ${isImageExpanded ? 'aspect-auto max-h-[85vh]' : 'aspect-[16/9.5] sm:aspect-[16/9]'} overflow-hidden bg-neutral-100 dark:bg-neutral-950 flex items-center justify-center transition-all duration-300`}>
            <img
              src={getAssetUrl(project.image)}
              alt={project.title}
              className="w-full h-full object-cover object-center group-hover:scale-[1.01] transition-transform duration-500"
              loading="eager"
            />
          </div>

        </div>

        {/* Action Link CTAs Row */}
        <div className="flex flex-wrap items-center gap-3 mb-12">
          {isGraphic ? (
            <>
              {project.behanceUrl && (
                <a
                  href={project.behanceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#0057ff] hover:bg-[#0043c7] text-white text-xs sm:text-sm font-outfit font-bold tracking-wide transition-all shadow-sm cursor-pointer"
                >
                  <Palette className="w-4 h-4" />
                  <span>View on Behance</span>
                  <ExternalLink className="w-4 h-4 stroke-[2.2]" />
                </a>
              )}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-neutral-900 dark:bg-[#f4ece1] text-white dark:text-[#090807] hover:bg-[#d6ad60] dark:hover:bg-[#d6ad60] dark:hover:text-black text-xs sm:text-sm font-outfit font-bold tracking-wide transition-all shadow-sm cursor-pointer"
                >
                  <span>Interactive Preview</span>
                  <ExternalLink className="w-4 h-4 stroke-[2.2]" />
                </a>
              )}
            </>
          ) : (
            <>
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-neutral-900 dark:bg-[#f4ece1] text-white dark:text-[#090807] hover:bg-[#d6ad60] dark:hover:bg-[#d6ad60] dark:hover:text-black text-xs sm:text-sm font-outfit font-bold tracking-wide transition-all shadow-sm cursor-pointer"
                >
                  <span>Launch Live Preview</span>
                  <ExternalLink className="w-4 h-4 stroke-[2.2]" />
                </a>
              )}

              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-[#12100e] text-neutral-800 dark:text-neutral-200 hover:border-[#d6ad60] hover:text-[#d6ad60] text-xs sm:text-sm font-outfit font-semibold transition-all shadow-2xs cursor-pointer"
                >
                  <Github className="w-4 h-4" />
                  <span>Source Code Repository</span>
                </a>
              )}
            </>
          )}
        </div>

        {/* 2-Column Clean Content Architecture */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start mb-16">
          
          {/* Left Column (8 cols): Project Story & Deliverables */}
          <div className="lg:col-span-8 flex flex-col space-y-7">
            
            {/* 1. Project Background & Objective */}
            <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#12100e] border border-neutral-200/90 dark:border-neutral-800/90 shadow-[0_2px_16px_rgba(0,0,0,0.02)]">
              <div className="flex items-center gap-2.5 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-[#d6ad60]" />
                <h2 className="font-outfit text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
                  Project Overview &amp; Objective
                </h2>
              </div>
              
              <div className="space-y-4 text-neutral-700 dark:text-neutral-300 text-[15px] sm:text-base leading-relaxed font-normal">
                <p>
                  {project.description}
                </p>
                <p className="text-neutral-600 dark:text-neutral-400 font-light">
                  {isGraphic 
                    ? 'Every visual design system was engineered from exploratory sketches into finalized vector masters. The goal was to establish strong emotional resonance, exceptional visual clarity, and lasting brand equity across touchpoints.'
                    : 'The project focuses on modern web architecture with rapid interaction response times, clean code organization, dynamic state updates, and an intuitive layout optimized for high conversion.'}
                </p>
              </div>
            </div>

            {/* 2. Key Deliverables & Outcomes */}
            <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#12100e] border border-neutral-200/90 dark:border-neutral-800/90 shadow-[0_2px_16px_rgba(0,0,0,0.02)]">
              <div className="flex items-center gap-2.5 mb-5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#d6ad60]" />
                <h2 className="font-outfit text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
                  Key Deliverables &amp; Solutions
                </h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {deliverables.map((item, idx) => (
                  <div 
                    key={idx}
                    className="p-4 rounded-xl sm:rounded-2xl bg-neutral-50 dark:bg-[#171412] border border-neutral-200/70 dark:border-neutral-800/80 flex flex-col justify-between space-y-2 hover:border-[#d6ad60]/40 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-[#d6ad60]/15 text-[#d6ad60] flex items-center justify-center flex-shrink-0">
                        <CheckCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                      <h3 className="font-outfit text-sm font-bold text-neutral-900 dark:text-neutral-100">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 font-light leading-relaxed pl-8">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Design Principles / Approach */}
            <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#12100e] border border-neutral-200/90 dark:border-neutral-800/90 shadow-[0_2px_16px_rgba(0,0,0,0.02)]">
              <div className="flex items-center gap-2.5 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-[#d6ad60]" />
                <h2 className="font-outfit text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
                  Craft &amp; Execution Standards
                </h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-[#171412] border border-neutral-200/60 dark:border-neutral-800/60">
                  <Compass className="w-4 h-4 text-[#d6ad60] mb-2" />
                  <h4 className="font-outfit font-bold text-xs text-neutral-900 dark:text-white mb-1">Pixel Precision</h4>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-light leading-normal">
                    Strict mathematical alignment and optical spacing across every element.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-[#171412] border border-neutral-200/60 dark:border-neutral-800/60">
                  <ShieldCheck className="w-4 h-4 text-[#d6ad60] mb-2" />
                  <h4 className="font-outfit font-bold text-xs text-neutral-900 dark:text-white mb-1">Quality Tested</h4>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-light leading-normal">
                    Exhaustively reviewed across retina displays and mobile viewpoints.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-[#171412] border border-neutral-200/60 dark:border-neutral-800/60">
                  <Sparkles className="w-4 h-4 text-[#d6ad60] mb-2" />
                  <h4 className="font-outfit font-bold text-xs text-neutral-900 dark:text-white mb-1">Brand Impact</h4>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-light leading-normal">
                    Designed to inspire confidence and convert visitors into long-term clients.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (4 cols): Tech Stack, Creator info & Inquire */}
          <div className="lg:col-span-4 flex flex-col space-y-6">
            
            {/* Tech Stack Box */}
            <div className="p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#12100e] border border-neutral-200/90 dark:border-neutral-800/90 shadow-[0_2px_16px_rgba(0,0,0,0.02)]">
              <div className="flex items-center gap-2 mb-4">
                <Code2 className="w-4 h-4 text-[#d6ad60]" />
                <h3 className="font-outfit text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                  {isGraphic ? 'Design Tools & Software' : 'Technologies & Libraries'}
                </h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {(isGraphic && project.designTools && project.designTools.length > 0
                  ? project.designTools
                  : project.techStack
                ).map((tech) => (
                  <span
                    key={tech}
                    className="font-outfit font-medium text-xs px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-[#181512] border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 hover:border-[#d6ad60]/50 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Creator / Contact Card */}
            <div className="p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#12100e] border border-neutral-200/90 dark:border-neutral-800/90 shadow-[0_2px_16px_rgba(0,0,0,0.02)] flex flex-col space-y-4">
              <div className="flex items-center gap-3.5">
                <img
                  src="/profile.png"
                  alt={personalInfo.name}
                  className="w-12 h-12 rounded-2xl object-cover border border-amber-500/40 shadow-xs"
                />
                <div>
                  <h4 className="font-outfit font-bold text-sm text-neutral-900 dark:text-white">
                    {personalInfo.name}
                  </h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 font-outfit">
                    {personalInfo.title || 'Graphic Designer & Web Builder'}
                  </p>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 py-1 px-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-outfit font-semibold text-emerald-600 dark:text-emerald-400 w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Available for New Projects</span>
              </div>

              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-light">
                Looking for a similar custom design or high-performance website? Let's bring your vision to life.
              </p>

              {onNavigateContact && (
                <button
                  onClick={onNavigateContact}
                  className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-[#d6ad60] dark:bg-white dark:hover:bg-[#d6ad60] text-white dark:text-black text-xs font-outfit font-bold transition-all text-center shadow-xs cursor-pointer flex items-center justify-center gap-2"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Start a Conversation</span>
                </button>
              )}
            </div>

          </div>

        </div>

        {/* Next & Previous Project Navigation Footer */}
        <div className="w-full pt-10 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Previous Project Card */}
          <button
            onClick={() => onSelectProject(prevProject.id)}
            className="w-full sm:w-[46%] flex items-center gap-3.5 p-3 sm:p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12100e] hover:border-[#d6ad60] hover:shadow-xs transition-all group cursor-pointer text-left"
          >
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 flex-shrink-0 border border-neutral-200/60 dark:border-neutral-800">
              <img
                src={getAssetUrl(prevProject.image)}
                alt={prevProject.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[10px] uppercase font-outfit font-semibold tracking-wider text-neutral-400 flex items-center gap-1">
                <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform text-[#d6ad60]" />
                <span>Previous Project</span>
              </span>
              <span className="text-xs sm:text-sm font-outfit font-bold text-neutral-900 dark:text-white truncate">
                {prevProject.title}
              </span>
            </div>
          </button>

          {/* Centered Return to All Projects */}
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141210] text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white hover:border-[#d6ad60] text-xs font-outfit font-semibold transition-all cursor-pointer shadow-2xs"
          >
            <Layers className="w-3.5 h-3.5 text-[#d6ad60]" />
            <span>All Projects</span>
          </button>

          {/* Next Project Card */}
          <button
            onClick={() => onSelectProject(nextProject.id)}
            className="w-full sm:w-[46%] flex items-center justify-between gap-3.5 p-3 sm:p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12100e] hover:border-[#d6ad60] hover:shadow-xs transition-all group cursor-pointer text-right"
          >
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[10px] uppercase font-outfit font-semibold tracking-wider text-neutral-400 flex items-center justify-end gap-1">
                <span>Next Project</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform text-[#d6ad60]" />
              </span>
              <span className="text-xs sm:text-sm font-outfit font-bold text-neutral-900 dark:text-white truncate">
                {nextProject.title}
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 flex-shrink-0 border border-neutral-200/60 dark:border-neutral-800">
              <img
                src={getAssetUrl(nextProject.image)}
                alt={nextProject.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </button>

        </div>

      </main>
    </div>
  );
};
