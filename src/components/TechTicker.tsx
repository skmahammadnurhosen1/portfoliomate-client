import React from 'react';

interface TechItem {
  id: string;
  name: string;
  category: string;
  logoUrl: string;
  logoDarkUrl?: string;
  bgTint?: string;
}

export const TechTicker: React.FC = () => {
  // Row 1: AI, Graphic Design, and UI/UX Tools (Exact match to reference image top row)
  const row1Items: TechItem[] = [
    {
      id: 'antigravity',
      name: 'Antigravity',
      category: 'AI Intelligence',
      logoUrl: '/logos/antigravity-icon.svg',
    },
    {
      id: 'chatgpt',
      name: 'ChatGPT',
      category: 'AI Architecture',
      logoUrl: '/logos/chatgpt.svg',
    },
    {
      id: 'gemini',
      name: 'Gemini',
      category: 'Multimodal AI',
      logoUrl: '/logos/gemini.svg',
    },
    {
      id: 'claude',
      name: 'Claude',
      category: 'Reasoning AI',
      logoUrl: '/logos/claude.svg',
    },
    {
      id: 'midjourney',
      name: 'Midjourney',
      category: 'Generative Art',
      logoUrl: '/logos/midjourney.svg',
      logoDarkUrl: '/logos/midjourney-white.svg',
    },
    {
      id: 'coreldraw',
      name: 'CorelDRAW',
      category: 'Graphic Design',
      logoUrl: '/logos/coreldraw.svg',
    },
    {
      id: 'illustrator',
      name: 'Illustrator',
      category: 'Graphic Design',
      logoUrl: '/logos/illustrator.svg',
    },
    {
      id: 'photoshop',
      name: 'Photoshop',
      category: 'Graphic Design',
      logoUrl: '/logos/photoshop.svg',
    },
    {
      id: 'figma',
      name: 'Figma',
      category: 'UI/UX Design',
      logoUrl: '/logos/figma-original.svg',
    },
  ];

  // Row 2: Code, Web Engineering, and Development Environment (Exact match to reference image bottom row)
  const row2Items: TechItem[] = [
    {
      id: 'tailwind',
      name: 'Tailwind CSS',
      category: 'Styling',
      logoUrl: '/logos/tailwindcss-original.svg',
    },
    {
      id: 'html5',
      name: 'HTML5',
      category: 'Frontend',
      logoUrl: '/logos/html5-original.svg',
    },
    {
      id: 'css3',
      name: 'CSS3',
      category: 'Styling',
      logoUrl: '/logos/css3-original.svg',
    },
    {
      id: 'git',
      name: 'Git',
      category: 'Version Control',
      logoUrl: '/logos/git-original.svg',
    },
    {
      id: 'github',
      name: 'GitHub',
      category: 'Platform',
      logoUrl: '/logos/github-original.svg',
      logoDarkUrl: '/logos/github-white.svg',
    },
    {
      id: 'cursor',
      name: 'Cursor',
      category: 'AI Code Editor',
      logoUrl: '/logos/cursor.svg',
      logoDarkUrl: '/logos/cursor-white.svg',
    },
    {
      id: 'codex',
      name: 'Codex',
      category: 'Code Engine',
      logoUrl: '/logos/codex.svg',
    },
    {
      id: 'vscode',
      name: 'Visual Studio',
      category: 'Development IDE',
      logoUrl: '/logos/vscode-original.svg',
    },
    {
      id: 'react',
      name: 'React',
      category: 'Framework',
      logoUrl: '/logos/react-original.svg',
    },
    {
      id: 'javascript',
      name: 'JavaScript',
      category: 'Language',
      logoUrl: '/logos/javascript-original.svg',
    },
  ];

  const renderCard = (tech: TechItem, keyPrefix: string) => (
    <div
      key={`${keyPrefix}-${tech.id}`}
      id={`tech-card-${tech.id}-${keyPrefix}`}
      className="flex-shrink-0 w-40 sm:w-44 md:w-48 h-38 sm:h-40 md:h-42 rounded-2xl bg-white dark:bg-[#141210] border border-neutral-200/90 dark:border-neutral-800 shadow-[0_4px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.35)] hover:shadow-xl hover:border-[#c5a059] dark:hover:border-[#c5a059] hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center p-4 sm:p-5 text-center select-none group cursor-pointer"
    >
      <div className="w-12 h-12 flex items-center justify-center mb-2.5 transition-transform duration-300 group-hover:scale-110">
        {tech.logoDarkUrl ? (
          <>
            {/* Light Mode Official Logo */}
            <img
              src={tech.logoUrl}
              alt={`${tech.name} official logo`}
              className="w-10 h-10 md:w-11 md:h-11 object-contain pointer-events-none drop-shadow-sm block dark:hidden"
              loading="eager"
              decoding="async"
            />
            {/* Dark Mode Crisp White/High-Contrast Official Logo */}
            <img
              src={tech.logoDarkUrl}
              alt={`${tech.name} official logo`}
              className="w-10 h-10 md:w-11 md:h-11 object-contain pointer-events-none drop-shadow-sm hidden dark:block"
              loading="eager"
              decoding="async"
            />
          </>
        ) : (
          <img
            src={tech.logoUrl}
            alt={`${tech.name} official logo`}
            className="w-10 h-10 md:w-11 md:h-11 object-contain pointer-events-none drop-shadow-sm filter dark:brightness-105"
            loading="eager"
            decoding="async"
          />
        )}
      </div>
      <h3 className="text-neutral-900 dark:text-neutral-100 font-semibold text-sm sm:text-[15px] tracking-tight group-hover:text-[#c5a059] transition-colors">
        {tech.name}
      </h3>
      <p className="text-neutral-500 dark:text-neutral-400 text-[11px] sm:text-xs mt-0.5 tracking-normal">
        {tech.category}
      </p>
    </div>
  );

  return (
    <div className="w-full relative overflow-hidden py-4 marquee-container">
      {/* Edge Gradient Overlays for smooth entry/exit fading */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-24 md:w-36 bg-gradient-to-r from-[#faf8f5] dark:from-[#090807] to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-24 md:w-36 bg-gradient-to-l from-[#faf8f5] dark:from-[#090807] to-transparent z-10" />

      {/* Row 1: Sliding continuously to the left */}
      <div className="flex overflow-hidden mb-5 md:mb-6">
        <div className="animate-marquee-left flex gap-4 md:gap-5 py-2">
          {row1Items.map((tech) => renderCard(tech, 'r1-a'))}
          {row1Items.map((tech) => renderCard(tech, 'r1-b'))}
          {row1Items.map((tech) => renderCard(tech, 'r1-c'))}
        </div>
      </div>

      {/* Row 2: Sliding continuously to the right (alternating signboard flow) */}
      <div className="flex overflow-hidden">
        <div className="animate-marquee-right flex gap-4 md:gap-5 py-2">
          {row2Items.map((tech) => renderCard(tech, 'r2-a'))}
          {row2Items.map((tech) => renderCard(tech, 'r2-b'))}
          {row2Items.map((tech) => renderCard(tech, 'r2-c'))}
        </div>
      </div>
    </div>
  );
};
