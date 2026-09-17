import { Project, SkillItem, TimelineItem, CVData } from '../types';

export const PERSONAL_INFO = {
  name: 'NOOR',
  firstName: 'NOOR',
  lastName: '',
  initials: 'N',
  title: 'Graphic Designer & Website Builder',
  roles: ['Graphic Designer', 'Website Builder', 'Brand Identity Specialist'],
  tagline: 'GRAPHIC DESIGNER  /  WEBSITE BUILDER',
  bio: 'Specializing in distinctive graphic design, brand identity systems, and modern, responsive website building that turns creative ideas into digital reality.',
  longBio: 'With 4+ years of dedicated experience crafting visual brand identities and building responsive, high-performance websites, I bring concepts to life through intentional design, typography, and clean code.',
  email: 'skmahammadnurhosen1@gmail.com',
  phone: '+91 98765 43210',
  location: 'Kolkata, India (Remote Available)',
  availability: 'Available for freelance & full-time roles',
  social: {
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    telegram: 'https://t.me',
    twitter: 'https://twitter.com',
    behance: 'https://behance.net'
  },
  stats: [
    { label: 'Years Experience', value: '4+' },
    { label: 'Completed Projects', value: '32+' },
    { label: 'Client Satisfaction', value: '100%' },
    { label: 'Core Technologies', value: '16+' }
  ]
};

export const PROJECTS: Project[] = [
  // 1. Website Building: Luxury Timepieces Boutique
  {
    id: 'aurora-luxury',
    title: 'Aura Luxury Timepieces',
    subtitle: 'High-End E-Commerce & Interactive 3D Showcase',
    category: 'web-building',
    description: 'An ultra-refined digital boutique for bespoke chronographs featuring fluid animations, custom configuration sliders, and responsive cart checkout.',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80',
    role: 'Website Builder & Frontend Dev',
    status: 'Client Project (Live)',
    rating: '4.9',
    duration: '10 days',
    rate: '$45/hr',
    techStack: ['Next.js', 'React', 'Tailwind CSS', 'Stripe'],
    demoUrl: 'https://example.com/demo/aura',
    githubUrl: 'https://github.com',
    featured: true,
    year: '2025'
  },
  // 2. Graphic Design: Aethel Brand Identity & Packaging
  {
    id: 'aethel-botanicals',
    title: 'Aethel Organic Botanicals',
    subtitle: 'Luxury Visual Brand Identity & Eco Packaging',
    category: 'graphic-design',
    description: 'Comprehensive brand identity system including embossed logomark, bespoke serif typography, recyclable luxury skincare packaging, and stationery kit.',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
    role: 'Brand & Graphic Designer',
    status: 'Brand Launched',
    rating: '5.0',
    duration: '7 days',
    rate: '$40/hr',
    techStack: ['Illustrator', 'Photoshop', 'Figma', 'Print Design'],
    demoUrl: 'https://example.com/demo/aethel',
    githubUrl: 'https://github.com',
    featured: true,
    year: '2024'
  },
  // 3. Website Building: Nexus SaaS Analytics Platform
  {
    id: 'nexus-analytics',
    title: 'Nexus SaaS Intelligence',
    subtitle: 'Enterprise Cloud Metrics & Data Visualization Web App',
    category: 'web-building',
    description: 'Cloud metrics visualization platform offering real-time KPI streaming, customizable charts, dark/light modes, and granular filtering.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    role: 'Full-Stack Web Builder',
    status: 'In Production',
    rating: '4.8',
    duration: '14 days',
    rate: '$50/hr',
    techStack: ['React', 'TypeScript', 'Tailwind', 'Recharts'],
    demoUrl: 'https://example.com/demo/nexus',
    githubUrl: 'https://github.com',
    featured: true,
    year: '2024'
  },
  // 4. Graphic Design: Pulse Beverage Social Media Kit
  {
    id: 'pulse-branding',
    title: 'Pulse Energy Drink Rebrand',
    subtitle: 'High-Impact Social Campaign & Can Packaging',
    category: 'graphic-design',
    description: 'Dynamic visual identity for modern functional energy drinks featuring custom 3D can renders, viral Instagram carousel templates, and billboard mockups.',
    image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=1200&q=80',
    role: 'Creative Graphic Designer',
    status: 'Delivered to Client',
    rating: '4.9',
    duration: '6 days',
    rate: '$42/hr',
    techStack: ['Photoshop', 'Illustrator', '3D Mockups', 'Social Kit'],
    demoUrl: 'https://example.com/demo/pulse',
    githubUrl: 'https://github.com',
    featured: true,
    year: '2024'
  },
  // 5. Website Building: Atelier Architecture Portfolio
  {
    id: 'atelier-design',
    title: 'Atelier Architecture & Interiors',
    subtitle: 'Minimalist Editorial Agency Website',
    category: 'web-building',
    description: 'Editorial-grade visual portfolio for an architectural collective, featuring brutalist typography pairings, asymmetric grid galleries, and smooth page transitions.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    role: 'Website Builder & UI Designer',
    status: 'Live on Web',
    rating: '5.0',
    duration: '8 days',
    rate: '$44/hr',
    techStack: ['React', 'Tailwind CSS', 'Figma', 'Vite'],
    demoUrl: 'https://example.com/demo/atelier',
    githubUrl: 'https://github.com',
    featured: true,
    year: '2024'
  },
  // 6. Graphic Design: Solaris Vector Mascot & Icon System
  {
    id: 'solaris-mascot',
    title: 'Solaris Tech Mascot & Icons',
    subtitle: 'Custom Vector Iconography & Illustrated Mascot',
    category: 'graphic-design',
    description: 'Over 80+ precision-crafted vector icons, custom illustrated brand mascot poses, and responsive design guidelines for a clean-tech startup.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    role: 'Vector & Brand Designer',
    status: 'Shipped to Production',
    rating: '4.9',
    duration: '5 days',
    rate: '$38/hr',
    techStack: ['Illustrator', 'Vector Art', 'Figma', 'SVG Ops'],
    demoUrl: 'https://example.com/demo/solaris-mascot',
    githubUrl: 'https://github.com',
    featured: true,
    year: '2024'
  },
  // 7. Website Building: Lumina Creative Agency
  {
    id: 'lumina-synth',
    title: 'Lumina Creative Studio',
    subtitle: 'Interactive Web Experience with Dynamic Visualizer',
    category: 'web-building',
    description: 'Creative agency web platform featuring dynamic generative canvas patterns, interactive color grading controls, and responsive project galleries.',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    role: 'Interactive Web Builder',
    status: 'Live Showcase',
    rating: '4.8',
    duration: '9 days',
    rate: '$46/hr',
    techStack: ['TypeScript', 'HTML5 Canvas', 'Tailwind CSS', 'Vite'],
    demoUrl: 'https://example.com/demo/lumina',
    githubUrl: 'https://github.com',
    featured: false,
    year: '2024'
  },
  // 8. Graphic Design: Novus Streetwear Lookbook & Posters
  {
    id: 'novus-editorial-design',
    title: 'Novus Streetwear Brand Identity',
    subtitle: 'Custom Typography Logomark & Editorial Print Posters',
    category: 'graphic-design',
    description: 'Brutalist street fashion brand identity with bold geometric logotype, screen-printed garment labels, lookbook editorial design, and retail posters.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
    role: 'Senior Graphic Designer',
    status: 'Client Delivered',
    rating: '4.9',
    duration: '8 days',
    rate: '$45/hr',
    techStack: ['Photoshop', 'Illustrator', 'InDesign', 'Typography'],
    demoUrl: 'https://example.com/demo/novus-design',
    githubUrl: 'https://github.com',
    featured: false,
    year: '2024'
  },
  // 9. Website Building: Apex Horizon Real Estate Web Portal
  {
    id: 'apex-horizon-web',
    title: 'Apex Horizon Real Estate',
    subtitle: 'High-Conversion Property Showcase & Lead Portal',
    category: 'web-building',
    description: 'Luxury architecture property listing platform featuring interactive floorplan viewers, schedule-a-tour booking modal, and instant WhatsApp inquiry.',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    role: 'Lead Web Developer',
    status: 'Active Client Site',
    rating: '5.0',
    duration: '12 days',
    rate: '$48/hr',
    techStack: ['Next.js', 'Tailwind CSS', 'React', 'Mapbox'],
    demoUrl: 'https://example.com/demo/apex-horizon',
    githubUrl: 'https://github.com',
    featured: false,
    year: '2024'
  },
  // 10. Graphic Design: Zenith Dark Luxury 3D Brand Book
  {
    id: 'zenith-brand-book',
    title: 'Zenith Web3 Brand Guidelines',
    subtitle: 'Dark Mode Visual Guidelines & 3D Iconography',
    category: 'graphic-design',
    description: 'Comprehensive 48-page digital brand guidelines covering color theory, micro-typography, custom dark-mode token palette, and custom 3D coin renders.',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80',
    role: 'Visual Brand Designer',
    status: 'Published Guidelines',
    rating: '4.9',
    duration: '11 days',
    rate: '$50/hr',
    techStack: ['Figma', 'Illustrator', 'Photoshop', 'Brand Strategy'],
    demoUrl: 'https://example.com/demo/zenith-brand',
    githubUrl: 'https://github.com',
    featured: false,
    year: '2023'
  },
  // 11. Website Building: Echo Cloud Sound Synthesizer
  {
    id: 'echo-audio-cloud',
    title: 'Echo Spatial Audio Engine',
    subtitle: 'Interactive Web Audio Synthesizer & Soundboard',
    category: 'web-building',
    description: 'Interactive Web Audio API application featuring real-time visualizer canvas nodes, frequency analyzers, and custom sound preset export.',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    role: 'Frontend Web Builder',
    status: 'Production v2',
    rating: '4.7',
    duration: '11 days',
    rate: '$46/hr',
    techStack: ['Web Audio', 'Canvas', 'React', 'Tailwind'],
    demoUrl: 'https://example.com/demo/echo',
    githubUrl: 'https://github.com',
    featured: false,
    year: '2024'
  },
  // 12. Graphic Design: Vanguard Luxury Magazine Editorial
  {
    id: 'vanguard-editorial-print',
    title: 'Vanguard Luxury Journal',
    subtitle: 'Editorial Print Magazine & Typography Layout',
    category: 'graphic-design',
    description: 'Art-directed editorial print publication built with bespoke serif font pairings, foil-stamped mastheads, custom editorial layouts, and advertising grids.',
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
    role: 'Print & Publication Designer',
    status: 'Printed & Circulated',
    rating: '5.0',
    duration: '6 days',
    rate: '$42/hr',
    techStack: ['InDesign', 'Illustrator', 'Photoshop', 'Pre-Press'],
    demoUrl: 'https://example.com/demo/vanguard-print',
    githubUrl: 'https://github.com',
    featured: false,
    year: '2023'
  }
];

export const SKILLS: SkillItem[] = [
  // Frontend
  { name: 'React & React 19', level: 95, category: 'frontend', iconName: 'Code', description: 'Component architecture, custom hooks, performance tuning' },
  { name: 'TypeScript', level: 92, category: 'frontend', iconName: 'FileCode', description: 'Strict typing, generics, robust frontend systems' },
  { name: 'Next.js & Vite', level: 88, category: 'frontend', iconName: 'Globe', description: 'Modern build pipelines, routing, SSR/SSG workflows' },
  { name: 'Tailwind CSS & Modern CSS', level: 96, category: 'frontend', iconName: 'Palette', description: 'Responsive layouts, design tokens, custom utility architectures' },
  { name: 'Motion / Micro-interactions', level: 90, category: 'frontend', iconName: 'Sparkles', description: 'Fluid spring physics, choreographed transitions, gestures' },
  { name: 'State Management (Zustand/Redux)', level: 86, category: 'frontend', iconName: 'Database', description: 'Scalable client-side stores, persistence, reactive flows' },

  // Design
  { name: 'UI / UX Design (Figma)', level: 92, category: 'design', iconName: 'Figma', description: 'Interactive prototyping, design systems, vector crafting' },
  { name: 'Responsive Web Layouts', level: 96, category: 'design', iconName: 'Layout', description: 'Mobile-first fluid viewports, bento grids, flexbox' },
  { name: 'Typography & Editorial Hierarchy', level: 90, category: 'design', iconName: 'Type', description: 'Font pairings, optical kerning, golden ratio scales' },
  { name: 'Design Systems & Tokens', level: 88, category: 'design', iconName: 'Layers', description: 'Atomic component libraries, style guides, theme switches' },

  // Tools
  { name: 'Git & GitHub Collaboration', level: 90, category: 'tools', iconName: 'GitBranch', description: 'Branch management, CI/CD actions, peer review workflows' },
  { name: 'Web Vitals & Performance', level: 88, category: 'tools', iconName: 'Gauge', description: 'Lighthouse 95+, asset minification, lazy loading, SEO' },
  { name: 'REST & GraphQL APIs', level: 85, category: 'tools', iconName: 'Cpu', description: 'Async data fetching, caching, error boundaries' },
  { name: 'Accessibility (WCAG AA)', level: 87, category: 'tools', iconName: 'Eye', description: 'Keyboard navigation, screen readers, semantic HTML5' }
];

export const TIMELINE: TimelineItem[] = [
  {
    year: '2024 — Present',
    role: 'Lead Frontend Developer & UI Designer',
    company: 'Studio Digital Innovations',
    description: 'Leading client web design projects, building high-conversion responsive applications with React and Tailwind, and driving architectural decisions.',
    badge: 'Current'
  },
  {
    year: '2022 — 2024',
    role: 'Frontend Engineer',
    company: 'Apex Tech Solutions',
    description: 'Developed modern web dashboards, interactive landing pages, and responsive UI components with clean, maintainable TypeScript code.',
  },
  {
    year: '2021 — 2022',
    role: 'Web Designer & Junior Developer',
    company: 'Creative Pixel Labs',
    description: 'Designed wireframes and prototypes in Figma and translated creative design briefs into mobile-first web pages.',
  }
];

export const DEFAULT_CV_DATA: CVData = {
  fullName: 'NOOR HOSEN',
  title: 'Graphic Designer & Website Builder',
  summary: 'Creative Graphic Designer and Website Builder specializing in distinctive brand identity, typography, visual systems, and modern responsive web interfaces that turn concepts into engaging digital experiences.',
  email: 'skmahammadnurhosen1@gmail.com',
  phone: '+91 98765 43210',
  location: 'Kolkata, India (Remote Available)',
  website: 'https://noor-portfolio.dev',
  statusBadge: 'Available for Freelance & Full-time Roles',
  skills: [
    'Graphic Design & Branding',
    'Website Building & UI',
    'Typography & Visual Systems',
    'Responsive Web Layouts',
    'Figma & Prototyping',
    'Tailwind CSS & Modern HTML',
    'Brand Guidelines & Logos',
    'Performance & SEO Basics'
  ],
  highlights: [
    { id: 'hl-1', text: '4+ years crafting visual identities, brand assets, and modern websites.' },
    { id: 'hl-2', text: 'Successfully built and delivered 30+ bespoke design & web projects.' },
    { id: 'hl-3', text: 'Specialized in clean aesthetics, optical typography, and mobile-first builds.' },
    { id: 'hl-4', text: '100% client satisfaction track record with on-time delivery guarantees.' }
  ],
  experiences: [
    {
      id: 'exp-1',
      role: 'Lead Graphic Designer & Web Builder',
      company: 'Independent Studio / Freelance',
      period: '2023 — Present',
      description: 'Directing complete brand identity systems, marketing assets, and creating custom responsive websites with high aesthetic standards.'
    },
    {
      id: 'exp-2',
      role: 'Brand & UI Designer',
      company: 'Apex Design & Media Lab',
      period: '2021 — 2023',
      description: 'Created visual guidelines, vector graphics, marketing collaterals, and designed fluid web layouts for diverse client verticals.'
    }
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'Bachelor of Science in Information & Digital Media',
      institution: 'State University',
      year: '2021'
    }
  ],
  showSummary: true,
  showSkills: true,
  showHighlights: true,
  showExperience: true,
  showEducation: false,
  showContact: true,
};
