import React from 'react';
import { ArrowRight } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { SocialIcon } from './SocialIconRenderer';
import { SectionId } from '../types';

interface HeroProps {
  onNavigate: (section: SectionId) => void;
  activeSection: SectionId;
  onOpenCVModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate, activeSection, onOpenCVModal }) => {
  const { personalInfo } = usePortfolio();
  const socialLinks = personalInfo.socialLinks || [];
  return (
    <section
      id="home"
      className="relative min-h-[100svh] min-h-[100dvh] w-full flex items-end md:items-center justify-center overflow-hidden bg-[#090807] pt-20 pb-8 md:pb-16 lg:py-0 select-none"
    >
      {/* Dynamic Background Atmosphere */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Amber/red glow centered on upper-right shoulder and hair */}
        <div
          className="absolute top-1/4 right-[10%] w-[35rem] h-[35rem] rounded-full blur-[110px] opacity-45 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(175, 45, 15, 0.7) 0%, rgba(197, 120, 20, 0.4) 40%, rgba(15, 10, 8, 0) 75%)',
          }}
        />
        {/* Subtle secondary fill glow */}
        <div
          className="absolute bottom-1/3 right-[30%] w-[25rem] h-[25rem] rounded-full blur-[100px] opacity-25 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(185, 90, 20, 0.5) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Hero Section Background Image (User's uploaded cinematic portrait) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          src="/hero-bg.png"
          alt="NOOR - Portrait"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-[62%_15%] md:object-[58%_30%] lg:object-center brightness-[0.98] contrast-[1.02]"
        />

        {/* Subtle left-side shadow gradient ensuring text is effortlessly readable on all screen sizes */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#090807]/90 via-[#090807]/55 to-transparent w-full md:w-3/5" />

        {/* Top and bottom subtle blending gradients */}
        <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-[#090807]/80 to-transparent" />
        {/* Mobile bottom dark gradient for smooth contrast behind lower-aligned text */}
        <div className="absolute bottom-0 inset-x-0 h-80 md:h-44 bg-gradient-to-t from-[#090807] via-[#090807]/90 md:via-[#090807]/70 to-transparent pointer-events-none" />
      </div>

      {/* Main Content Grid */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-12 lg:px-16 flex flex-col justify-end md:justify-center min-h-[calc(100svh-5rem)] md:min-h-[calc(100vh-5rem)] pb-8 md:pb-12 md:pt-24 lg:pt-32">
        <div className="max-w-2xl pt-24 pb-2 md:pt-28 md:pb-12">
          {/* Eyebrow: Gold horizontal line + "HEY, I'M" */}
          <div className="flex items-center gap-3 mb-3 md:mb-6">
            <span className="w-8 h-[1.5px] bg-[#d6ad60] rounded-full inline-block" />
            <span className="text-[11px] md:text-xs font-semibold tracking-[0.28em] text-[#d6ad60] uppercase">
              HEY, I&apos;M
            </span>
          </div>

          {/* Main Name Heading: "NOOR" */}
          <h1 className="font-serif-luxury font-normal tracking-tight text-white leading-[1.05] mb-4 md:mb-3.5 text-5xl sm:text-6xl md:text-7xl lg:text-[78px]">
            <span className="block text-[#fcfbfa] drop-shadow-sm">
              {personalInfo.firstName || personalInfo.name}
            </span>
            {personalInfo.lastName && (
              <span className="block text-[#d6ad60] font-normal mt-0.5">
                {personalInfo.lastName}
              </span>
            )}
          </h1>

          {/* Subtitle / Role: Tracked uppercase (hidden on mobile, visible on desktop) */}
          <p className="hidden md:block text-xs sm:text-sm font-medium tracking-[0.24em] text-neutral-400 uppercase mt-4 mb-5">
            {personalInfo.tagline}
          </p>

          {/* Description text (hidden on mobile, visible on desktop) */}
          <p className="hidden md:block text-sm md:text-base text-neutral-400 leading-relaxed font-normal max-w-lg mb-8 md:mb-10">
            {personalInfo.bio}
          </p>

          {/* Action CTAs (positioned right below the name on mobile) */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-6 md:mb-16">
            {/* Primary CTA: "View Projects ->" */}
            <button
              id="hero-view-projects-btn"
              onClick={() => onNavigate('projects')}
              className="group flex items-center gap-2.5 px-6 py-3 rounded-full text-xs sm:text-sm font-medium tracking-wide text-neutral-100 border border-[#c5a059] bg-neutral-900/40 hover:bg-[#c5a059] hover:text-black transition-all duration-300 shadow-[0_0_18px_rgba(197,160,89,0.2)] hover:shadow-[0_0_26px_rgba(197,160,89,0.4)] focus:outline-none cursor-pointer"
            >
              <span>View Projects</span>
              <ArrowRight className="w-4 h-4 text-[#d6ad60] group-hover:text-black group-hover:translate-x-1 transition-all" />
            </button>

            {/* Secondary CTA: "About Me" */}
            <button
              id="hero-about-me-btn"
              onClick={() => onNavigate('about')}
              className="group text-xs sm:text-sm font-medium tracking-wide text-neutral-300 hover:text-[#d6ad60] px-3 py-2 transition-colors relative focus:outline-none cursor-pointer"
            >
              <span>About Me</span>
              <span className="absolute bottom-1 left-3 right-3 h-[1px] bg-transparent group-hover:bg-[#d6ad60]/70 transition-all" />
            </button>
          </div>

          {/* Social Links (Bottom Left of Hero - Dynamically synced with Admin) */}
          <div className="flex items-center gap-3 text-neutral-400">
            {socialLinks.map((item, idx) => (
              <React.Fragment key={item.id || idx}>
                {idx > 0 && <span className="h-3 w-[1px] bg-neutral-700/70" />}
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${item.label} Profile`}
                  className="hover:text-[#d6ad60] transition-colors p-1 flex items-center justify-center"
                  title={item.label}
                >
                  <SocialIcon platform={item.platform} className="w-4 h-4" />
                </a>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Right: "SCROLL DOWN" + downward line/arrow */}
      <div className="absolute bottom-8 right-6 md:right-8 lg:right-12 2xl:right-16 hidden sm:flex items-center gap-3 pointer-events-auto">
        <button
          onClick={() => onNavigate('about')}
          className="group flex items-center gap-2.5 text-neutral-400 hover:text-[#d6ad60] transition-colors focus:outline-none cursor-pointer"
        >
          <span className="text-[10px] tracking-[0.25em] font-medium uppercase text-neutral-400 group-hover:text-[#d6ad60] transition-colors">
            SCROLL DOWN
          </span>
          <span className="w-[1px] h-6 bg-neutral-600 group-hover:bg-[#d6ad60] relative overflow-hidden transition-colors">
            <span className="absolute top-0 left-0 w-full h-full bg-[#d6ad60] animate-bounce" />
          </span>
        </button>
      </div>
    </section>
  );
};
