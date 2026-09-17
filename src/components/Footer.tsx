import React from 'react';
import { 
  ArrowUp, 
  Mail, 
  Phone, 
  MapPin, 
  Sparkles,
  Layers,
  Lock
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { SocialIcon } from './SocialIconRenderer';
import { SectionId } from '../types';

interface FooterProps {
  onNavigate: (section: SectionId) => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAdmin }) => {
  const { personalInfo } = usePortfolio();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      id="site-footer"
      className="w-full bg-neutral-100 dark:bg-[#040406] text-neutral-600 dark:text-neutral-400 border-t border-neutral-200 dark:border-neutral-900/90 pt-16 pb-12 flex flex-col items-center relative z-20 transition-colors duration-300"
    >
      <div className="w-full max-w-7xl px-6 md:px-12 lg:px-16">
        
        {/* 4-Column Layout as shown in uploaded reference image */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-14 border-b border-neutral-200 dark:border-neutral-900/80">
          
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#d6ad60] to-[#997328] flex items-center justify-center text-black font-bold text-sm shadow-xs">
                N
              </div>
              <span className="font-serif-luxury text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                {personalInfo.name}
              </span>
            </div>
            
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-light max-w-xs">
              {personalInfo.bio || 'Professional graphic design and modern website building. Delivering purposeful brand identity, fluid user interfaces, and scalable web solutions.'}
            </p>

            <div className="pt-1">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                <span>Available for new projects</span>
              </span>
            </div>
          </div>

          {/* Col 2: Services */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-900 dark:text-neutral-200 font-semibold mb-4">
              Services
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-600 dark:text-neutral-400 font-light">
              <li className="hover:text-[#c5a059] dark:hover:text-[#d6ad60] transition-colors cursor-pointer" onClick={() => onNavigate('projects')}>
                Graphic Design & Print
              </li>
              <li className="hover:text-[#c5a059] dark:hover:text-[#d6ad60] transition-colors cursor-pointer" onClick={() => onNavigate('projects')}>
                Website Building & Frontend
              </li>
              <li className="hover:text-[#c5a059] dark:hover:text-[#d6ad60] transition-colors cursor-pointer" onClick={() => onNavigate('skills')}>
                Brand Identity & Systems
              </li>
              <li className="hover:text-[#c5a059] dark:hover:text-[#d6ad60] transition-colors cursor-pointer" onClick={() => onNavigate('skills')}>
                UI / UX Interactive Wireframes
              </li>
              <li className="hover:text-[#c5a059] dark:hover:text-[#d6ad60] transition-colors cursor-pointer" onClick={() => onNavigate('projects')}>
                E-Commerce Storefronts
              </li>
            </ul>
          </div>

          {/* Col 3: Navigation / Company */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-900 dark:text-neutral-200 font-semibold mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-600 dark:text-neutral-400 font-light">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#c5a059] dark:hover:text-[#d6ad60] transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-[#c5a059] dark:hover:text-[#d6ad60] transition-colors cursor-pointer"
                >
                  About Me
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-[#c5a059] dark:hover:text-[#d6ad60] transition-colors cursor-pointer"
                >
                  Services Provided
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('projects')}
                  className="hover:text-[#c5a059] dark:hover:text-[#d6ad60] transition-colors cursor-pointer"
                >
                  Selected Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('skills')}
                  className="hover:text-[#c5a059] dark:hover:text-[#d6ad60] transition-colors cursor-pointer"
                >
                  Capabilities & Numbers
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-[#c5a059] dark:hover:text-[#d6ad60] transition-colors cursor-pointer"
                >
                  Contact & Quote
                </button>
              </li>
              {onOpenAdmin && (
                <li>
                  <button
                    id="footer-admin-link"
                    onClick={onOpenAdmin}
                    className="hover:text-[#c5a059] dark:hover:text-[#d6ad60] transition-colors cursor-pointer flex items-center gap-1.5 pt-1 text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                  >
                    <Lock className="w-3 h-3 text-[#d6ad60]" />
                    <span>Admin Login</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Col 4: Contact Us & Socials */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-900 dark:text-neutral-200 font-semibold mb-4">
              Contact Us
            </h4>
            
            <div className="space-y-2.5 text-xs text-neutral-600 dark:text-neutral-400 font-light">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#c5a059] dark:text-[#d6ad60] flex-shrink-0 mt-0.5" />
                <span>{personalInfo.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#c5a059] dark:text-[#d6ad60] flex-shrink-0" />
                <a href={`tel:${personalInfo.phone || '+919876543210'}`} className="text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors">
                  {personalInfo.phone || '+91 98765 43210'}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#c5a059] dark:text-[#d6ad60] flex-shrink-0" />
                <a href={`mailto:${personalInfo.email}`} className="text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors truncate">
                  {personalInfo.email}
                </a>
              </div>
            </div>

            {/* Social Icons row matching admin configuration */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              {(personalInfo.socialLinks || []).map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  title={item.label}
                  className="w-8 h-8 rounded-full bg-white dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10 border border-neutral-200 dark:border-white/10 hover:border-[#d6ad60] flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white shadow-xs transition-colors"
                >
                  <SocialIcon platform={item.platform} className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Bar: Centered Copyright and Scroll To Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 font-light">
          <div className="flex-1 sm:text-left text-center flex items-center justify-center sm:justify-start gap-3">
            <p>© 2026 {personalInfo.name}. All Rights Reserved.</p>
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="hover:text-[#d6ad60] transition-colors cursor-pointer text-[11px] font-outfit text-neutral-400 dark:text-neutral-600 hover:underline"
                title="Admin Portal"
              >
                &bull; Admin
              </button>
            )}
          </div>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-white/5 text-neutral-700 dark:text-neutral-400 hover:bg-[#c5a059] hover:text-black dark:hover:bg-[#d6ad60] dark:hover:text-black border border-neutral-200 dark:border-white/10 hover:border-[#d6ad60] shadow-xs transition-all duration-200 cursor-pointer text-xs"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
