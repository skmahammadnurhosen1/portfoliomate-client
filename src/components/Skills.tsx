import React from 'react';
import { TechTicker } from './TechTicker';

export const Skills: React.FC = () => {
  return (
    <section
      id="skills"
      className="relative w-full py-20 md:py-28 bg-[#faf8f5] dark:bg-[#090807] text-neutral-900 dark:text-[#f4ece1] border-t border-neutral-200/80 dark:border-neutral-900/60 overflow-hidden flex flex-col items-center transition-colors duration-300"
    >
      <div className="w-full max-w-7xl px-6 md:px-12 lg:px-16">
        {/* Section Header */}
        <div className="flex flex-col mb-12">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-6 h-[2px] bg-[#d6ad60]" />
            <span className="text-[12px] font-semibold tracking-[0.25em] text-[#d6ad60] uppercase">
              03 / MY SKILLS & TOOLS
            </span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl text-neutral-900 dark:text-[#f4ece1] font-normal leading-tight">
            Technologies I Work With
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm md:text-base font-light mt-3 max-w-2xl leading-relaxed">
            Comprehensive suite spanning professional graphic design, modern AI assistants, cutting-edge code editors, and full-stack web engineering.
          </p>
        </div>
      </div>

      {/* Infinite Continuous Sliding Tech Bar (Marquee Signboard with authentic logos) */}
      <div className="w-full">
        <TechTicker />
      </div>
    </section>
  );
};


