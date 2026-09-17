import React from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  Paintbrush, 
  Calendar,
  Mail,
  Download
} from 'lucide-react';
import { SectionId } from '../types';
import { usePortfolio } from '../context/PortfolioContext';

interface AboutMeProps {
  onNavigate?: (section: SectionId) => void;
  onOpenCVModal?: () => void;
}

export const AboutMe: React.FC<AboutMeProps> = ({ onNavigate, onOpenCVModal }) => {
  const { personalInfo, cvData } = usePortfolio();
  const displayName = personalInfo.firstName || personalInfo.name || 'Noor';
  const bioIntro = personalInfo.longBio || personalInfo.bio || 'Specializing in distinctive graphic design, brand identity systems, and modern, responsive website building.';
  const primaryEdu = cvData.education?.[0]?.institution 
    ? `${cvData.education[0].institution} (${cvData.education[0].degree})`
    : 'Bengal Institute of Technology (ETCE, 1st Year)';

  return (
    <section
      id="about"
      className="relative w-full py-16 sm:py-20 md:py-28 bg-[#faf8f5] dark:bg-[#090807] text-neutral-900 dark:text-[#f4ece1] border-t border-neutral-200/80 dark:border-neutral-900/70 overflow-hidden flex justify-center transition-colors duration-300"
    >
      <div className="w-full max-w-6xl px-6 md:px-12 lg:px-16 relative z-10">
        
        {/* Centered Heading with clean Outfit typography */}
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="font-outfit text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-[-0.03em] text-neutral-900 dark:text-white">
            About Me
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-amber-500 to-[#d6ad60] rounded-full mx-auto mt-3" />
        </div>

        {/* Minimalist 2-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Clean, Larger Uncluttered Rounded Photo Frame */}
          <div className="md:col-span-5 lg:col-span-5 flex justify-center items-center w-full">
            <div className="w-full max-w-[400px] sm:max-w-[440px] md:max-w-[460px] lg:max-w-[480px] aspect-[4/5] sm:aspect-[4/5.1] md:aspect-[4/5.2] rounded-[28px] sm:rounded-[36px] overflow-hidden bg-neutral-200 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-800 shadow-[0_16px_44px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] transition-all duration-300 hover:scale-[1.015]">
              <img
                src="/profile.png"
                alt="Profile"
                className="w-full h-full object-cover object-top sm:object-center"
                loading="eager"
              />
            </div>
          </div>

          {/* Right Column: Clean Bio & 4 Modern Bento Highlight Cards */}
          <div className="md:col-span-7 lg:col-span-7 flex flex-col justify-center space-y-6">
            
            {/* Short Bio with clean typography */}
            <div className="space-y-3">
              <p className="font-sans text-neutral-700 dark:text-neutral-300 text-base sm:text-lg leading-relaxed font-normal">
                Hello! I'm <strong className="font-outfit text-neutral-950 dark:text-white font-bold tracking-tight">{displayName}</strong>, a passionate graphic designer and website builder dedicated to crafting distinctive brand visuals and clean, high-performance web experiences.
              </p>
              <p className="font-sans text-neutral-600 dark:text-neutral-400 text-sm sm:text-base leading-relaxed font-light">
                {bioIntro}
              </p>
            </div>

            {/* 4 Minimalist Modern Highlight Cards (2x2 Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              
              {/* Card 1: Education */}
              <div className="group p-4 rounded-2xl bg-white dark:bg-[#12100e] border border-neutral-200/90 dark:border-neutral-800/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:border-[#d6ad60]/60 dark:hover:border-[#d6ad60]/50 transition-all duration-200 flex flex-col justify-start">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[#d6ad60] flex items-center justify-center flex-shrink-0 mb-2.5 group-hover:scale-105 transition-transform">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div className="font-outfit text-sm font-bold text-neutral-900 dark:text-white tracking-tight">
                  Education &amp; Degree
                </div>
                <div className="font-sans text-xs text-neutral-600 dark:text-neutral-400 font-normal leading-relaxed mt-1">
                  {primaryEdu}
                </div>
              </div>

              {/* Card 2: Core Skills */}
              <div className="group p-4 rounded-2xl bg-white dark:bg-[#12100e] border border-neutral-200/90 dark:border-neutral-800/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:border-[#d6ad60]/60 dark:hover:border-[#d6ad60]/50 transition-all duration-200 flex flex-col justify-start">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[#d6ad60] flex items-center justify-center flex-shrink-0 mb-2.5 group-hover:scale-105 transition-transform">
                  <Paintbrush className="w-4 h-4" />
                </div>
                <div className="font-outfit text-sm font-bold text-neutral-900 dark:text-white tracking-tight">
                  Core Capabilities
                </div>
                <div className="font-sans text-xs text-neutral-600 dark:text-neutral-400 font-normal leading-relaxed mt-1">
                  Graphic Design, Brand Identity &amp; Modern Websites
                </div>
              </div>

              {/* Card 3: Experience */}
              <div className="group p-4 rounded-2xl bg-white dark:bg-[#12100e] border border-neutral-200/90 dark:border-neutral-800/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:border-[#d6ad60]/60 dark:hover:border-[#d6ad60]/50 transition-all duration-200 flex flex-col justify-start">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[#d6ad60] flex items-center justify-center flex-shrink-0 mb-2.5 group-hover:scale-105 transition-transform">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="font-outfit text-sm font-bold text-neutral-900 dark:text-white tracking-tight">
                  Active Timeline
                </div>
                <div className="font-sans text-xs text-neutral-600 dark:text-neutral-400 font-normal leading-relaxed mt-1">
                  Creating visual designs &amp; web projects since 2021
                </div>
              </div>

              {/* Card 4: Philosophy */}
              <div className="group p-4 rounded-2xl bg-white dark:bg-[#12100e] border border-neutral-200/90 dark:border-neutral-800/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:border-[#d6ad60]/60 dark:hover:border-[#d6ad60]/50 transition-all duration-200 flex flex-col justify-start">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[#d6ad60] flex items-center justify-center flex-shrink-0 mb-2.5 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="font-outfit text-sm font-bold text-neutral-900 dark:text-white tracking-tight">
                  Creative Philosophy
                </div>
                <div className="font-sans text-xs text-neutral-600 dark:text-neutral-400 font-normal leading-relaxed mt-1">
                  Clean problem-solving, crisp aesthetics &amp; reliability
                </div>
              </div>

            </div>

            {/* Action Buttons with matching Outfit typography */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              {onOpenCVModal && (
                <button
                  id="about-download-cv-btn"
                  onClick={onOpenCVModal}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-outfit font-bold text-xs sm:text-sm hover:bg-[#d6ad60] dark:hover:bg-[#d6ad60] dark:hover:text-black transition-all shadow-xs cursor-pointer"
                >
                  <Download className="w-4 h-4 text-[#d6ad60] dark:text-neutral-950" />
                  <span>Download CV</span>
                </button>
              )}

              {onNavigate && (
                <button
                  id="about-contact-btn"
                  onClick={() => onNavigate('contact')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-[#12100e] border border-neutral-300 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 font-outfit font-semibold text-xs sm:text-sm hover:border-[#d6ad60] hover:text-[#d6ad60] dark:hover:text-[#d6ad60] transition-all shadow-xs cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-[#d6ad60]" />
                  <span>Contact Me</span>
                </button>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
