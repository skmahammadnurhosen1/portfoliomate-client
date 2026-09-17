import React, { useState, useEffect } from 'react';
import { Download, Sun, Moon, Menu, X } from 'lucide-react';
import { SectionId } from '../types';
import { usePortfolio } from '../context/PortfolioContext';

interface NavbarProps {
  activeSection: SectionId;
  onNavigate: (section: SectionId) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenCVModal: () => void;
  isSubpage?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
  isDark,
  onToggleTheme,
  onOpenCVModal,
  isSubpage = false,
}) => {
  const { personalInfo } = usePortfolio();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const effectivelyScrolled = isScrolled || isSubpage;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Prevent background scrolling when mobile side drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navItems: { id: SectionId; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Me' },
    { id: 'services', label: 'Services' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' },
  ];

  // Close mobile drawer and navigate smoothly
  const handleItemClick = (id: SectionId) => {
    document.body.style.overflow = '';
    setMobileMenuOpen(false);
    onNavigate(id);
  };

  const handleCVClick = () => {
    document.body.style.overflow = '';
    setMobileMenuOpen(false);
    onOpenCVModal();
  };

  return (
    <>
      {/* Top Navbar Header */}
      <header
        id="main-navigation"
        className={`fixed top-0 inset-x-0 z-40 flex items-center justify-center transition-all duration-300 ${
          effectivelyScrolled
            ? 'bg-white/90 dark:bg-[#090807]/90 backdrop-blur-xl border-b border-neutral-200/80 dark:border-[#c5a059]/20 shadow-md dark:shadow-xl dark:shadow-black/60 py-3.5 md:py-5'
            : 'bg-transparent py-4 md:py-6'
        }`}
      >
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Left: Brand Name "NOOR" */}
          <button
            id="brand-logo-button"
            onClick={() => handleItemClick('home')}
            className="group flex items-center gap-2 text-left focus:outline-none cursor-pointer touch-manipulation"
            aria-label="Back to home"
          >
            <span
              className={`font-serif-luxury text-2xl md:text-3xl font-semibold tracking-wider transition-colors duration-200 ${
                effectivelyScrolled
                  ? isDark
                    ? 'text-[#d6ad60] group-hover:text-[#f4ece1]'
                    : 'text-[#d6ad60] group-hover:text-neutral-900'
                  : 'text-[#d6ad60] group-hover:text-white drop-shadow-sm'
              }`}
            >
              {personalInfo.name}
            </span>
          </button>

          {/* Center: Desktop Navigation Links */}
          <nav
            id="desktop-nav-menu"
            className="hidden md:flex items-center gap-8 lg:gap-10"
            aria-label="Main menu"
          >
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              
              // Color calculation: over dark hero (not scrolled), keep white/light.
              // When scrolled, adapt to light mode (dark text) or dark mode (light text).
              let textColorClass = '';
              if (!effectivelyScrolled) {
                textColorClass = isActive
                  ? 'text-white font-semibold drop-shadow-sm'
                  : 'text-neutral-300 hover:text-white';
              } else {
                if (isDark) {
                  textColorClass = isActive
                    ? 'text-[#f4ece1] font-semibold'
                    : 'text-neutral-400 hover:text-neutral-200';
                } else {
                  textColorClass = isActive
                    ? 'text-neutral-950 font-bold'
                    : 'text-neutral-700 hover:text-black';
                }
              }

              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => onNavigate(item.id)}
                  className={`relative text-sm tracking-wide transition-all duration-200 py-1.5 focus:outline-none cursor-pointer ${textColorClass}`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#d6ad60] rounded-full transition-all" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right: Theme Toggle + Download CV */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle Icon */}
            <button
              id="theme-toggle-button"
              onClick={onToggleTheme}
              className={`p-2 rounded-full transition-colors focus:outline-none cursor-pointer ${
                !effectivelyScrolled
                  ? 'text-neutral-200 hover:text-[#d6ad60] hover:bg-white/10'
                  : isDark
                    ? 'text-neutral-400 hover:text-[#d6ad60] hover:bg-neutral-800/50'
                    : 'text-neutral-700 hover:text-[#d6ad60] hover:bg-neutral-100'
              }`}
              aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
              title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              {isDark ? (
                <Sun className="w-4 h-4 transition-transform hover:rotate-45 text-[#d6ad60]" />
              ) : (
                <Moon className={`w-4 h-4 transition-transform hover:-rotate-12 ${!effectivelyScrolled ? 'text-neutral-200' : 'text-neutral-700'}`} />
              )}
            </button>

            {/* Download CV Button */}
            <button
              id="download-cv-header-btn"
              onClick={onOpenCVModal}
              className={`relative group flex items-center gap-2 px-5 py-2 rounded-full text-xs md:text-sm font-medium tracking-wide border transition-all duration-300 shadow-sm focus:outline-none cursor-pointer ${
                !effectivelyScrolled
                  ? 'text-white border-[#c5a059]/80 bg-black/40 backdrop-blur-xs hover:bg-[#c5a059]/20 hover:border-[#d6ad60]'
                  : isDark
                    ? 'text-neutral-200 border-[#c5a059]/60 bg-neutral-900/30 hover:bg-[#c5a059]/20 hover:border-[#d6ad60] hover:text-[#f4ece1]'
                    : 'text-neutral-800 border-[#c5a059]/60 bg-[#c5a059]/10 hover:bg-[#c5a059]/20 hover:border-[#d6ad60] hover:text-black'
              }`}
            >
              <span>Download CV</span>
              <Download className="w-3.5 h-3.5 text-[#d6ad60] group-hover:translate-y-0.5 transition-transform" />
            </button>
          </div>

          {/* Mobile Actions: Theme Toggle + Mobile Menu Trigger Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              id="mobile-theme-toggle"
              onClick={onToggleTheme}
              className={`p-2.5 rounded-lg focus:outline-none cursor-pointer transition-colors touch-manipulation ${
                !effectivelyScrolled
                  ? 'text-neutral-200 hover:text-[#d6ad60]'
                  : isDark
                    ? 'text-neutral-300 hover:text-[#d6ad60]'
                    : 'text-neutral-700 hover:text-[#d6ad60]'
              }`}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-[#d6ad60]" />
              ) : (
                <Moon className={`w-5 h-5 ${!effectivelyScrolled ? 'text-neutral-200' : 'text-neutral-700'}`} />
              )}
            </button>
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(true)}
              className={`p-2.5 rounded-lg focus:outline-none cursor-pointer transition-colors touch-manipulation active:scale-95 ${
                !effectivelyScrolled
                  ? 'text-white hover:text-[#d6ad60] hover:bg-white/10'
                  : isDark
                    ? 'text-neutral-200 hover:text-[#d6ad60] hover:bg-neutral-900/60'
                    : 'text-neutral-800 hover:text-[#d6ad60] hover:bg-neutral-100'
              }`}
              aria-label="Open mobile menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Backdrop Overlay (z-50) */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu-backdrop"
          onClick={() => {
            document.body.style.overflow = '';
            setMobileMenuOpen(false);
          }}
          className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 md:hidden transition-opacity duration-300 cursor-pointer touch-manipulation"
          aria-hidden="true"
        />
      )}

      {/* Mobile Side Drawer Panel (Higher z-index z-[60] so touches never get blocked) */}
      <aside
        id="mobile-side-drawer-panel"
        className={`fixed top-0 right-0 bottom-0 w-[290px] sm:w-[320px] max-w-[85vw] h-full bg-[#faf8f5] dark:bg-[#0c0a09] border-l border-neutral-200 dark:border-[#c5a059]/25 shadow-2xl flex flex-col justify-between p-6 transition-transform duration-300 ease-out z-[60] md:hidden ${
          mobileMenuOpen ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none'
        }`}
        aria-label="Mobile Navigation"
      >
        {/* Drawer Top: Monogram / Name and Close Button */}
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-neutral-200 dark:border-neutral-900">
            <span className="font-serif-luxury text-2xl font-semibold tracking-wider text-[#d6ad60]">
              {personalInfo.name}
            </span>
            <button
              onClick={() => {
                document.body.style.overflow = '';
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-[#d6ad60] hover:bg-neutral-200/60 dark:hover:bg-neutral-900 transition-colors focus:outline-none cursor-pointer touch-manipulation"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Menu Items List */}
          <nav className="flex flex-col space-y-2 pt-6" aria-label="Mobile Links">
            {navItems.map((item, index) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full text-left py-3.5 px-4 rounded-xl transition-all duration-150 flex items-center justify-between cursor-pointer touch-manipulation select-none active:scale-[0.98] ${
                    isActive
                      ? 'text-[#d6ad60] bg-[#c5a059]/15 font-semibold border-l-2 border-[#d6ad60]'
                      : 'text-neutral-700 dark:text-neutral-200 hover:text-black dark:hover:text-white hover:bg-neutral-200/50 dark:hover:bg-neutral-900/70 active:bg-neutral-200 dark:active:bg-neutral-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono text-[#d6ad60]/80">
                      0{index + 1}
                    </span>
                    <span className="text-base font-medium">{item.label}</span>
                  </div>
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-[#d6ad60] shadow-[0_0_8px_rgba(214,173,96,0.9)]" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Drawer Bottom: Download CV & Status */}
        <div className="pt-6 border-t border-neutral-200 dark:border-neutral-900 space-y-4">
          <button
            onClick={handleCVClick}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-full text-sm font-semibold tracking-wide text-neutral-900 dark:text-neutral-100 border border-[#c5a059] bg-[#c5a059]/15 hover:bg-[#c5a059]/25 active:bg-[#c5a059]/35 shadow-sm transition-all cursor-pointer touch-manipulation select-none active:scale-[0.98]"
          >
            <span>Download CV</span>
            <Download className="w-4 h-4 text-[#d6ad60]" />
          </button>

          <div className="text-center">
            <span className="text-[11px] text-neutral-500 font-mono tracking-wider select-none">
              AVAILABLE FOR NEW PROJECTS
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
