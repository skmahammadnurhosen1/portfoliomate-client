import React from 'react';
import { 
  MapPin, 
  Mail, 
  Calendar, 
  Paintbrush, 
  Code, 
  Sparkles 
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { SectionId } from '../types';

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

const SERVICES: ServiceItem[] = [
  {
    id: 'graphic-design',
    title: 'Graphic Design',
    description: 'Logos, social media posts, branding, print & digital design.',
    icon: Paintbrush,
  },
  {
    id: 'web-development',
    title: 'Web Development',
    description: 'Modern, responsive and fast websites using modern technologies.',
    icon: Code,
  },
  {
    id: 'creative-solutions',
    title: 'Creative Solutions',
    description: 'Clean design, smooth user experience and results that matter.',
    icon: Sparkles,
  },
];

interface ServicesProvidedProps {
  onNavigate?: (section: SectionId) => void;
}

export const ServicesProvided: React.FC<ServicesProvidedProps> = () => {
  const { personalInfo } = usePortfolio();

  return (
    <section
      id="services"
      className="relative w-full py-20 sm:py-24 md:py-32 bg-[#faf8f5] dark:bg-[#090807] text-neutral-900 dark:text-[#f4ece1] border-t border-neutral-200/80 dark:border-neutral-900/70 overflow-hidden flex justify-center transition-colors duration-300"
    >
      {/* Ambient background glow matching luxury theme */}
      <div className="absolute top-1/3 -left-20 w-80 h-80 rounded-full bg-[#f59e0b]/5 dark:bg-[#f59e0b]/4 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-[#c5a059]/5 dark:bg-[#c5a059]/4 blur-3xl pointer-events-none" />

      <div className="w-full max-w-7xl px-6 md:px-12 lg:px-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 xl:gap-20 items-center">
          
          {/* LEFT COLUMN: Narrative, Headline, and Info Strip */}
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-center">
            
            {/* 1. Pill Eyebrow */}
            <div className="flex items-center gap-3 mb-5 sm:mb-6">
              <span className="w-8 h-[3px] bg-[#f59e0b] rounded-full" />
              <span className="text-xs sm:text-sm font-bold tracking-[0.24em] text-neutral-800 dark:text-neutral-300 uppercase">
                SERVICES PROVIDED BY ME
              </span>
            </div>

            {/* 2. Primary Headline with Highlight */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-neutral-900 dark:text-white leading-[1.18] tracking-tight mb-6">
              I'm a{' '}
              <span className="text-[#f59e0b] dark:text-[#fbbf24] font-bold inline-block">
                Creative Graphic
              </span>{' '}
              Designer &amp; Website Builder.
            </h2>

            {/* 3. Bio Paragraph */}
            <p className="text-neutral-600 dark:text-neutral-300 text-base sm:text-lg leading-relaxed font-normal mb-10 sm:mb-12 max-w-xl">
              {personalInfo.bio || "I'm Noor, a passionate creative designer and website builder. I love turning ideas into beautiful designs and functional websites that solve real problems and create value."}
            </p>

            {/* 4. Bottom Info Strip: Location | Email | Availability */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 pt-6 border-t border-neutral-200/90 dark:border-neutral-800/90">
              
              {/* Item 1: Location */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#fff8e7] dark:bg-[#201a11] border border-[#fde8b3]/80 dark:border-[#42331c]/80 flex items-center justify-center flex-shrink-0 text-[#f59e0b] dark:text-[#fbbf24] shadow-xs mt-0.5">
                  <MapPin className="w-4 h-4 fill-[#f59e0b]/20" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs sm:text-[13px] font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">
                    {personalInfo.location || 'Kolkata, India'}
                  </span>
                  <span className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400 font-normal">
                    (Remote Available)
                  </span>
                </div>
              </div>

              {/* Item 2: Email */}
              <div className="flex items-start gap-3 sm:border-l sm:border-neutral-200 dark:sm:border-neutral-800/80 sm:pl-4">
                <div className="w-9 h-9 rounded-xl bg-[#fff8e7] dark:bg-[#201a11] border border-[#fde8b3]/80 dark:border-[#42331c]/80 flex items-center justify-center flex-shrink-0 text-[#f59e0b] dark:text-[#fbbf24] shadow-xs mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="flex flex-col min-w-0">
                  <a
                    href={`mailto:${personalInfo.email}`}
                    className="text-xs sm:text-[13px] font-semibold text-neutral-900 dark:text-neutral-100 hover:text-[#f59e0b] dark:hover:text-[#fbbf24] transition-colors truncate"
                    title={personalInfo.email}
                  >
                    {personalInfo.email}
                  </a>
                  <a
                    href={`mailto:${personalInfo.email}`}
                    className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400 hover:underline font-normal"
                  >
                    Email Me
                  </a>
                </div>
              </div>

              {/* Item 3: Available for work */}
              <div className="flex items-start gap-3 sm:border-l sm:border-neutral-200 dark:sm:border-neutral-800/80 sm:pl-4">
                <div className="w-9 h-9 rounded-xl bg-[#fff8e7] dark:bg-[#201a11] border border-[#fde8b3]/80 dark:border-[#42331c]/80 flex items-center justify-center flex-shrink-0 text-[#f59e0b] dark:text-[#fbbf24] shadow-xs mt-0.5">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs sm:text-[13px] font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">
                    Available
                  </span>
                  <span className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400 font-normal">
                    for work
                  </span>
                </div>
              </div>

            </div>

          </div>

          {/* RIGHT COLUMN: Elevated Feature Box Card */}
          <div className="lg:col-span-6 xl:col-span-5">
            <div className="rounded-[28px] sm:rounded-[34px] bg-white dark:bg-[#12100e] border border-neutral-200/90 dark:border-neutral-800/80 shadow-[0_8px_32px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_36px_rgba(0,0,0,0.45)] p-6 sm:p-8 md:p-10 transition-all duration-300 hover:border-[#f59e0b]/40 dark:hover:border-[#f59e0b]/30">
              <div className="flex flex-col space-y-7 sm:space-y-8">
                {SERVICES.map((service, index) => {
                  const Icon = service.icon;
                  return (
                    <React.Fragment key={service.id}>
                      <div className="flex items-start gap-4 sm:gap-5 group cursor-default">
                        
                        {/* Rounded Squircle Icon Box */}
                        <div className="w-[52px] h-[52px] sm:w-[60px] sm:h-[60px] rounded-2xl bg-[#fff8e7] dark:bg-[#201a11] border border-[#fde8b3]/80 dark:border-[#42331c]/80 flex items-center justify-center flex-shrink-0 text-[#f59e0b] dark:text-[#fbbf24] shadow-xs transition-transform duration-300 group-hover:scale-105">
                          <Icon className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2]" />
                        </div>

                        {/* Title and Description */}
                        <div className="flex flex-col pt-0.5">
                          <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white tracking-tight group-hover:text-[#f59e0b] dark:group-hover:text-[#fbbf24] transition-colors">
                            {service.title}
                          </h3>
                          <p className="text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm mt-1 leading-relaxed font-normal">
                            {service.description}
                          </p>
                        </div>

                      </div>

                      {/* Divider between items (except last) */}
                      {index < SERVICES.length - 1 && (
                        <div className="h-[1px] w-full bg-neutral-100 dark:bg-neutral-800/80" />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
