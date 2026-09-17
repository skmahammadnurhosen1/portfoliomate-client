import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Project, 
  PersonalInfoType, 
  SocialLinkItem, 
  CVData, 
  CVHighlightItem, 
  CVExperienceItem, 
  CVEducationItem 
} from '../types';
import { 
  PROJECTS as DEFAULT_PROJECTS, 
  PERSONAL_INFO as DEFAULT_PERSONAL_INFO,
  DEFAULT_CV_DATA
} from '../data/portfolioData';
import { 
  projectsApi, 
  profileApi, 
  cvApi, 
  contactApi, 
  ApiMessage 
} from '../api/client';

interface PortfolioContextType {
  projects: Project[];
  personalInfo: PersonalInfoType;
  cvData: CVData;
  isLoading: boolean;
  messages: ApiMessage[];
  unreadCount: number;

  // Projects CRUD
  addProject: (project: Omit<Project, 'id'>) => Promise<void>;
  updateProject: (id: string, updated: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  toggleHideProject: (id: string) => Promise<void>;

  // Personal Info CRUD
  updatePersonalInfo: (info: Partial<PersonalInfoType>) => Promise<void>;
  addSocialLink: (item: Omit<SocialLinkItem, 'id'>) => Promise<void>;
  updateSocialLink: (id: string, url: string, label?: string) => Promise<void>;
  deleteSocialLink: (id: string) => Promise<void>;

  // CV Management Methods
  updateCVData: (data: Partial<CVData>) => Promise<void>;
  uploadCVPdfFile: (file: File) => Promise<void>;
  uploadCVPdf: (fileDataUrl: string, fileName: string, fileSize: string) => void;
  removeCVPdf: () => Promise<void>;
  addCVSkill: (skill: string) => Promise<void>;
  removeCVSkill: (skill: string) => Promise<void>;
  addCVHighlight: (text: string) => Promise<void>;
  updateCVHighlight: (id: string, text: string) => Promise<void>;
  deleteCVHighlight: (id: string) => Promise<void>;
  addCVExperience: (exp: Omit<CVExperienceItem, 'id'>) => Promise<void>;
  updateCVExperience: (id: string, exp: Partial<CVExperienceItem>) => Promise<void>;
  deleteCVExperience: (id: string) => Promise<void>;
  addCVEducation: (edu: Omit<CVEducationItem, 'id'>) => Promise<void>;
  updateCVEducation: (id: string, edu: Partial<CVEducationItem>) => Promise<void>;
  deleteCVEducation: (id: string) => Promise<void>;
  resetCVToDefaults: () => Promise<void>;
  resetToDefaults: () => Promise<void>;

  // Messages Management
  fetchMessages: () => Promise<void>;
  markMessageRead: (id: string, isRead: boolean) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;

  // Reload
  refreshData: () => Promise<void>;
  loadAdminProjects: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | null>(null);

const INITIAL_SOCIAL_LINKS: SocialLinkItem[] = [
  { id: 'sl-github', platform: 'github', label: 'GitHub', url: 'https://github.com' },
  { id: 'sl-linkedin', platform: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com' },
  { id: 'sl-facebook', platform: 'facebook', label: 'Facebook', url: 'https://facebook.com' },
  { id: 'sl-instagram', platform: 'instagram', label: 'Instagram', url: 'https://instagram.com' },
  { id: 'sl-telegram', platform: 'telegram', label: 'Telegram', url: 'https://t.me' },
  { id: 'sl-twitter', platform: 'twitter', label: 'Twitter / X', url: 'https://twitter.com' },
  { id: 'sl-behance', platform: 'behance', label: 'Behance', url: 'https://behance.net' },
];

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoType>({
    ...DEFAULT_PERSONAL_INFO,
    socialLinks: INITIAL_SOCIAL_LINKS,
  });
  const [cvData, setCvData] = useState<CVData>(DEFAULT_CV_DATA);
  const [messages, setMessages] = useState<ApiMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initial fetch from backend API
  const refreshData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [fetchedProjects, fetchedProfile, fetchedCV] = await Promise.allSettled([
        projectsApi.getPublic(),
        profileApi.get(),
        cvApi.get(),
      ]);

      if (fetchedProjects.status === 'fulfilled' && fetchedProjects.value) {
        setProjects(fetchedProjects.value);
      }
      if (fetchedProfile.status === 'fulfilled' && fetchedProfile.value) {
        setPersonalInfo(prev => ({
          ...prev,
          ...fetchedProfile.value,
          socialLinks: fetchedProfile.value.socialLinks || prev.socialLinks || INITIAL_SOCIAL_LINKS,
        }));
      }
      if (fetchedCV.status === 'fulfilled' && fetchedCV.value) {
        setCvData(prev => ({
          ...prev,
          ...fetchedCV.value,
        }));
      }
    } catch (e) {
      console.warn('[PortfolioContext] Failed to load data from API. Using defaults:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Load all projects for admin (including hidden ones)
  const loadAdminProjects = async () => {
    try {
      const allProjects = await projectsApi.getAdminAll();
      if (allProjects) {
        setProjects(allProjects);
      }
    } catch (e) {
      console.error('[PortfolioContext] Error loading admin projects:', e);
    }
  };

  // Messages API handlers
  const fetchMessages = async () => {
    try {
      const res = await contactApi.getAdminAll();
      if (res.success && res.data) {
        setMessages(res.data);
        setUnreadCount(res.unreadCount ?? res.data.filter(m => !m.isRead).length);
      }
    } catch (e) {
      console.error('[PortfolioContext] Error fetching messages:', e);
    }
  };

  const markMessageRead = async (id: string, isRead: boolean) => {
    try {
      await contactApi.markRead(id, isRead);
      setMessages(prev =>
        prev.map(m => (m._id === id ? { ...m, isRead } : m))
      );
      setUnreadCount(prev => (isRead ? Math.max(0, prev - 1) : prev + 1));
    } catch (e) {
      console.error('[PortfolioContext] Error marking message read:', e);
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      await contactApi.delete(id);
      setMessages(prev => prev.filter(m => m._id !== id));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (e) {
      console.error('[PortfolioContext] Error deleting message:', e);
    }
  };

  // Project Actions
  const addProject = async (projectData: Omit<Project, 'id'>) => {
    try {
      const created = await projectsApi.create(projectData);
      setProjects(prev => [created, ...prev]);
    } catch (e) {
      console.error('[PortfolioContext] Error adding project:', e);
      // Optimistic fallback
      const tempProject: Project = {
        ...projectData,
        id: `project-${Date.now()}`,
        featured: projectData.featured ?? false,
        hidden: false,
      };
      setProjects(prev => [tempProject, ...prev]);
    }
  };

  const updateProject = async (id: string, updated: Partial<Project>) => {
    try {
      const saved = await projectsApi.update(id, updated);
      setProjects(prev => prev.map(p => (p.id === id ? saved : p)));
    } catch (e) {
      console.error('[PortfolioContext] Error updating project:', e);
      setProjects(prev => prev.map(p => (p.id === id ? { ...p, ...updated } : p)));
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await projectsApi.delete(id);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (e) {
      console.error('[PortfolioContext] Error deleting project:', e);
      setProjects(prev => prev.filter(p => p.id !== id));
    }
  };

  const toggleHideProject = async (id: string) => {
    try {
      const toggled = await projectsApi.toggleHide(id);
      setProjects(prev => prev.map(p => (p.id === id ? toggled : p)));
    } catch (e) {
      console.error('[PortfolioContext] Error toggling hide project:', e);
      setProjects(prev =>
        prev.map(p => (p.id === id ? { ...p, hidden: !p.hidden } : p))
      );
    }
  };

  // Personal Info Actions
  const updatePersonalInfo = async (info: Partial<PersonalInfoType>) => {
    try {
      const updated = await profileApi.update(info);
      setPersonalInfo(prev => ({ ...prev, ...updated }));
    } catch (e) {
      console.error('[PortfolioContext] Error updating personal info:', e);
      setPersonalInfo(prev => {
        const next = { ...prev, ...info };
        if (info.firstName !== undefined || info.lastName !== undefined) {
          const f = info.firstName !== undefined ? info.firstName : prev.firstName;
          const l = info.lastName !== undefined ? info.lastName : prev.lastName;
          next.name = l ? `${f} ${l}`.trim() : f.trim();
          next.initials = f ? f.charAt(0).toUpperCase() : 'N';
        }
        return next;
      });
    }
  };

  const addSocialLink = async (item: Omit<SocialLinkItem, 'id'>) => {
    const newLink: SocialLinkItem = {
      ...item,
      id: `sl-${Date.now()}`,
    };
    const nextLinks = [...(personalInfo.socialLinks || []), newLink];
    const nextSocial = { ...personalInfo.social, [item.platform]: item.url };
    await updatePersonalInfo({
      socialLinks: nextLinks,
      social: nextSocial,
    });
  };

  const updateSocialLink = async (id: string, url: string, label?: string) => {
    const currentLinks = personalInfo.socialLinks || [];
    const nextLinks = currentLinks.map(l =>
      l.id === id ? { ...l, url, ...(label ? { label } : {}) } : l
    );
    const target = currentLinks.find(l => l.id === id);
    const nextSocial = { ...personalInfo.social };
    if (target) {
      nextSocial[target.platform] = url;
    }
    await updatePersonalInfo({
      socialLinks: nextLinks,
      social: nextSocial,
    });
  };

  const deleteSocialLink = async (id: string) => {
    const currentLinks = personalInfo.socialLinks || [];
    const target = currentLinks.find(l => l.id === id);
    const nextLinks = currentLinks.filter(l => l.id !== id);
    const nextSocial = { ...personalInfo.social };
    if (target && target.platform in nextSocial) {
      delete nextSocial[target.platform];
    }
    await updatePersonalInfo({
      socialLinks: nextLinks,
      social: nextSocial,
    });
  };

  // CV Actions
  const updateCVData = async (data: Partial<CVData>) => {
    try {
      const updated = await cvApi.update(data);
      setCvData(prev => ({ ...prev, ...updated }));
    } catch (e) {
      console.error('[PortfolioContext] Error updating CV data:', e);
      setCvData(prev => ({ ...prev, ...data }));
    }
  };

  const uploadCVPdfFile = async (file: File) => {
    try {
      const updated = await cvApi.uploadPdf(file);
      setCvData(prev => ({ ...prev, ...updated }));
    } catch (e) {
      console.error('[PortfolioContext] Error uploading CV PDF:', e);
      throw e;
    }
  };

  const uploadCVPdf = (fileDataUrl: string, fileName: string, fileSize: string) => {
    // Fallback base64 upload
    const uploadDate = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    updateCVData({
      customPdfUrl: fileDataUrl,
      customPdfFileName: fileName,
      customPdfFileSize: fileSize,
      customPdfUploadDate: uploadDate,
    });
  };

  const removeCVPdf = async () => {
    try {
      const updated = await cvApi.removePdf();
      setCvData(prev => ({ ...prev, ...updated }));
    } catch (e) {
      console.error('[PortfolioContext] Error removing CV PDF:', e);
      setCvData(prev => {
        const next = { ...prev };
        delete next.customPdfUrl;
        delete next.customPdfFileName;
        delete next.customPdfFileSize;
        delete next.customPdfUploadDate;
        return next;
      });
    }
  };

  const addCVSkill = async (skill: string) => {
    const trimmed = skill.trim();
    if (!trimmed || cvData.skills.includes(trimmed)) return;
    const nextSkills = [...cvData.skills, trimmed];
    await updateCVData({ skills: nextSkills });
  };

  const removeCVSkill = async (skill: string) => {
    const nextSkills = cvData.skills.filter(s => s !== skill);
    await updateCVData({ skills: nextSkills });
  };

  const addCVHighlight = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const newItem: CVHighlightItem = { id: `hl-${Date.now()}`, text: trimmed };
    const nextHighlights = [...cvData.highlights, newItem];
    await updateCVData({ highlights: nextHighlights });
  };

  const updateCVHighlight = async (id: string, text: string) => {
    const nextHighlights = cvData.highlights.map(h => (h.id === id ? { ...h, text } : h));
    await updateCVData({ highlights: nextHighlights });
  };

  const deleteCVHighlight = async (id: string) => {
    const nextHighlights = cvData.highlights.filter(h => h.id !== id);
    await updateCVData({ highlights: nextHighlights });
  };

  const addCVExperience = async (exp: Omit<CVExperienceItem, 'id'>) => {
    const newExp: CVExperienceItem = { ...exp, id: `exp-${Date.now()}` };
    const nextExperiences = [newExp, ...cvData.experiences];
    await updateCVData({ experiences: nextExperiences });
  };

  const updateCVExperience = async (id: string, exp: Partial<CVExperienceItem>) => {
    const nextExperiences = cvData.experiences.map(e => (e.id === id ? { ...e, ...exp } : e));
    await updateCVData({ experiences: nextExperiences });
  };

  const deleteCVExperience = async (id: string) => {
    const nextExperiences = cvData.experiences.filter(e => e.id !== id);
    await updateCVData({ experiences: nextExperiences });
  };

  const addCVEducation = async (edu: Omit<CVEducationItem, 'id'>) => {
    const newEdu: CVEducationItem = { ...edu, id: `edu-${Date.now()}` };
    const nextEducation = [...cvData.education, newEdu];
    await updateCVData({ education: nextEducation });
  };

  const updateCVEducation = async (id: string, edu: Partial<CVEducationItem>) => {
    const nextEducation = cvData.education.map(e => (e.id === id ? { ...e, ...edu } : e));
    await updateCVData({ education: nextEducation });
  };

  const deleteCVEducation = async (id: string) => {
    const nextEducation = cvData.education.filter(e => e.id !== id);
    await updateCVData({ education: nextEducation });
  };

  const resetCVToDefaults = async () => {
    await updateCVData(DEFAULT_CV_DATA);
  };

  const resetToDefaults = async () => {
    setProjects(DEFAULT_PROJECTS);
    setPersonalInfo({
      ...DEFAULT_PERSONAL_INFO,
      socialLinks: INITIAL_SOCIAL_LINKS,
    });
    setCvData(DEFAULT_CV_DATA);
  };

  return (
    <PortfolioContext.Provider
      value={{
        projects,
        personalInfo,
        cvData,
        isLoading,
        messages,
        unreadCount,
        addProject,
        updateProject,
        deleteProject,
        toggleHideProject,
        updatePersonalInfo,
        addSocialLink,
        updateSocialLink,
        deleteSocialLink,
        updateCVData,
        uploadCVPdfFile,
        uploadCVPdf,
        removeCVPdf,
        addCVSkill,
        removeCVSkill,
        addCVHighlight,
        updateCVHighlight,
        deleteCVHighlight,
        addCVExperience,
        updateCVExperience,
        deleteCVExperience,
        addCVEducation,
        updateCVEducation,
        deleteCVEducation,
        resetCVToDefaults,
        resetToDefaults,
        fetchMessages,
        markMessageRead,
        deleteMessage,
        refreshData,
        loadAdminProjects,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
