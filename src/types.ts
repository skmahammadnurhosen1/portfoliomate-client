export type SectionId = 'home' | 'about' | 'services' | 'skills' | 'projects' | 'contact';

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: 'graphic-design' | 'web-building';
  description: string;
  image: string;
  techStack: string[];
  demoUrl?: string;
  githubUrl?: string;
  featured: boolean;
  year: string;
  role?: string;
  status?: string;
  rating?: string;
  duration?: string;
  rate?: string;
  avatar?: string;
  hidden?: boolean;
}

export interface SocialLinkItem {
  id: string;
  platform: 'github' | 'linkedin' | 'facebook' | 'instagram' | 'twitter' | 'telegram' | 'behance' | 'dribbble' | 'youtube' | 'website';
  label: string;
  url: string;
}

export interface PersonalInfoType {
  name: string;
  firstName: string;
  lastName: string;
  initials: string;
  title: string;
  roles: string[];
  tagline: string;
  bio: string;
  longBio: string;
  email: string;
  phone: string;
  location: string;
  availability: string;
  social: Record<string, string>;
  socialLinks?: SocialLinkItem[];
  stats: { label: string; value: string }[];
}

export interface SkillItem {
  name: string;
  level: number; // 0 to 100
  category: 'frontend' | 'design' | 'tools';
  iconName: string;
  description: string;
}

export interface TimelineItem {
  year: string;
  role: string;
  company: string;
  description: string;
  badge?: string;
}

export interface CVHighlightItem {
  id: string;
  text: string;
}

export interface CVExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface CVEducationItem {
  id: string;
  degree: string;
  institution: string;
  year: string;
}

export interface CVData {
  fullName: string;
  title: string;
  summary: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  statusBadge: string;
  skills: string[];
  highlights: CVHighlightItem[];
  experiences: CVExperienceItem[];
  education: CVEducationItem[];

  // Visibility toggles for the public popup
  showSummary: boolean;
  showSkills: boolean;
  showHighlights: boolean;
  showExperience: boolean;
  showEducation: boolean;
  showContact: boolean;

  // Custom uploaded PDF
  customPdfUrl?: string; // base64 data URL
  customPdfFileName?: string;
  customPdfFileSize?: string;
  customPdfUploadDate?: string;
}
