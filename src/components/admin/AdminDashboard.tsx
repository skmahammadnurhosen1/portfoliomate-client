import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  EyeOff, 
  Upload, 
  Image as ImageIcon, 
  Check, 
  X, 
  ArrowLeft, 
  LayoutDashboard, 
  FolderKanban, 
  User, 
  Share2, 
  ExternalLink, 
  LogOut, 
  Sparkles, 
  AlertTriangle,
  Github,
  Linkedin,
  Facebook,
  Instagram,
  Twitter,
  Send,
  Palette,
  Dribbble,
  Youtube,
  Globe,
  RotateCcw,
  Star,
  Clock,
  Briefcase,
  FileText,
  MessageSquare,
  KeyRound,
  ShieldCheck
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Project, SocialLinkItem } from '../../types';
import { CVManager } from './CVManager';
import { MessagesManager } from './MessagesManager';
import { SecurityTab } from './SecurityTab';
import { SocialModal } from './SocialModal';
import { ProjectModal } from './ProjectModal';
import { DownloadCVModal } from '../DownloadCVModal';
import { AdminUser, authApi, uploadApi, getAssetUrl } from '../../api/client';

interface AdminDashboardProps {
  onBackToPortfolio: () => void;
  onSignOut: () => void;
  adminUser?: AdminUser | null;
}

type TabType = 'overview' | 'projects' | 'profile' | 'social' | 'cv' | 'messages' | 'security';

// Supported social platforms configuration with icons
const PLATFORM_CONFIG: Record<string, { label: string; icon: React.FC<{ className?: string }> }> = {
  github: { label: 'GitHub', icon: Github },
  linkedin: { label: 'LinkedIn', icon: Linkedin },
  facebook: { label: 'Facebook', icon: Facebook },
  instagram: { label: 'Instagram', icon: Instagram },
  twitter: { label: 'Twitter / X', icon: Twitter },
  telegram: { label: 'Telegram', icon: Send },
  behance: { label: 'Behance', icon: Palette },
  dribbble: { label: 'Dribbble', icon: Dribbble },
  youtube: { label: 'YouTube', icon: Youtube },
  website: { label: 'Website / Portfolio', icon: Globe },
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToPortfolio, onSignOut, adminUser }) => {
  const {
    projects,
    personalInfo,
    cvData,
    unreadCount,
    isLoading,
    loadAdminProjects,
    addProject,
    updateProject,
    deleteProject,
    toggleHideProject,
    updatePersonalInfo,
    addSocialLink,
    updateSocialLink,
    deleteSocialLink,
    resetToDefaults,
  } = usePortfolio();

  useEffect(() => {
    loadAdminProjects();
  }, []);

  const [activeTab, setActiveTab] = useState<TabType>('projects');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isPreviewCVModalOpen, setIsPreviewCVModalOpen] = useState(false);

  // Project Modal State
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'web-building' | 'graphic-design'>('all');
  const [filterVisibility, setFilterVisibility] = useState<'all' | 'live' | 'hidden'>('all');

  // Profile Form State
  const [profName, setProfName] = useState(personalInfo.name || '');
  const [profFirstName, setProfFirstName] = useState(personalInfo.firstName || '');
  const [profLastName, setProfLastName] = useState(personalInfo.lastName || '');
  const [profTitle, setProfTitle] = useState(personalInfo.title || '');
  const [profTagline, setProfTagline] = useState(personalInfo.tagline || '');
  const [profEmail, setProfEmail] = useState(personalInfo.email || '');
  const [profPhone, setProfPhone] = useState(personalInfo.phone || '');
  const [profLocation, setProfLocation] = useState(personalInfo.location || '');
  const [profBio, setProfBio] = useState(personalInfo.bio || '');
  const [profLongBio, setProfLongBio] = useState(personalInfo.longBio || '');

  // Social Modal State
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [editingSocialId, setEditingSocialId] = useState<string | null>(null);
  const [socialPlatform, setSocialPlatform] = useState<SocialLinkItem['platform']>('github');
  const [socialUrl, setSocialUrl] = useState('');
  const [socialLabel, setSocialLabel] = useState('');

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Open Project Modal for Add
  const handleOpenAddProject = () => {
    setEditingProject(null);
    setIsProjectModalOpen(true);
  };

  // Open Project Modal for Edit
  const handleOpenEditProject = (proj: Project) => {
    setEditingProject(proj);
    setIsProjectModalOpen(true);
  };

  // Save Project Handler
  const handleSaveProject = async (projectPayload: any) => {
    if (editingProject) {
      await updateProject(editingProject.id, projectPayload);
      showToast(`Updated "${projectPayload.title}" successfully!`);
    } else {
      await addProject(projectPayload);
      showToast(`Added new project "${projectPayload.title}"! Public cards updated.`);
    }
  };

  // Save Profile Form
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updatePersonalInfo({
        name: profName.trim() || profFirstName.trim(),
        firstName: profFirstName.trim(),
        lastName: profLastName.trim(),
        title: profTitle.trim(),
        tagline: profTagline.trim(),
        email: profEmail.trim(),
        phone: profPhone.trim(),
        location: profLocation.trim(),
        bio: profBio.trim(),
        longBio: profLongBio.trim(),
      });
      showToast('Personal information updated! Live website synchronized.');
    } catch (err: any) {
      showToast(err?.message || 'Failed to update personal information.');
    }
  };

  // Social Links Handlers
  const handleOpenAddSocial = () => {
    setEditingSocialId(null);
    setSocialPlatform('github');
    setSocialUrl('');
    setSocialLabel('');
    setIsSocialModalOpen(true);
  };

  const handleOpenEditSocial = (item: SocialLinkItem) => {
    setEditingSocialId(item.id);
    setSocialPlatform(item.platform);
    setSocialUrl(item.url);
    setSocialLabel(item.label);
    setIsSocialModalOpen(true);
  };

  const handleSaveSocial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!socialUrl.trim()) {
      showToast('Please enter a valid URL.');
      return;
    }
    const label = socialLabel.trim() || PLATFORM_CONFIG[socialPlatform]?.label || socialPlatform;

    try {
      if (editingSocialId) {
        await updateSocialLink(editingSocialId, socialUrl.trim(), label);
        showToast('Social link updated!');
      } else {
        await addSocialLink({
          platform: socialPlatform,
          url: socialUrl.trim(),
          label,
        });
        showToast('New social channel added! Public links updated.');
      }
      setIsSocialModalOpen(false);
    } catch (err: any) {
      showToast(err?.message || 'Failed to save social link.');
    }
  };

  // Filtered Projects List
  const filteredProjects = projects.filter((p) => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.techStack.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = 
      filterCategory === 'all' || p.category === filterCategory;

    const matchesVisibility = 
      filterVisibility === 'all' ||
      (filterVisibility === 'live' && !p.hidden) ||
      (filterVisibility === 'hidden' && p.hidden);

    return matchesSearch && matchesCategory && matchesVisibility;
  });

  const totalCount = projects.length;
  const liveCount = projects.filter(p => !p.hidden).length;
  const hiddenCount = projects.filter(p => p.hidden).length;
  const currentSocialLinks = personalInfo.socialLinks || [];

  return (
    <div className="relative min-h-[90vh] w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans text-neutral-900 dark:text-[#f4ece1]">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-neutral-900 dark:bg-[#1a1714] text-white border border-[#d6ad60]/50 shadow-2xl animate-fade-in text-xs sm:text-sm font-outfit">
          <Check className="w-4 h-4 text-[#d6ad60] flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-neutral-200 dark:border-neutral-800/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-outfit font-semibold uppercase tracking-[0.2em] text-[#c5a059] dark:text-[#d6ad60] mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Admin Console &bull; Live Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif-luxury font-normal text-neutral-900 dark:text-[#f4ece1]">
            Portfolio <span className="text-[#d6ad60] italic">Dashboard</span>
          </h1>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            id="admin-view-live-site-btn"
            onClick={onBackToPortfolio}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141210] hover:border-[#d6ad60] text-xs font-outfit font-medium text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer shadow-xs"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#d6ad60]" />
            <span>View Public Site</span>
          </button>

          <button
            id="admin-sign-out-btn"
            onClick={onSignOut}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-red-500/10 hover:text-red-500 text-xs font-outfit font-medium text-neutral-600 dark:text-neutral-400 transition-colors cursor-pointer"
            title="Sign Out from Admin"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs (Minimalist horizontal pill bar) */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none border-b border-neutral-200/60 dark:border-neutral-800/60">
        
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-outfit font-medium transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-neutral-900 text-white dark:bg-[#f4ece1] dark:text-[#090807] shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('projects')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-outfit font-medium transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'projects'
              ? 'bg-neutral-900 text-white dark:bg-[#f4ece1] dark:text-[#090807] shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
          }`}
        >
          <FolderKanban className="w-4 h-4" />
          <span>Manage Projects</span>
          <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-[#d6ad60]/20 text-[#c5a059] dark:text-[#d6ad60] font-mono">
            {totalCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-outfit font-medium transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-neutral-900 text-white dark:bg-[#f4ece1] dark:text-[#090807] shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Personal Info</span>
        </button>

        <button
          onClick={() => setActiveTab('social')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-outfit font-medium transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'social'
              ? 'bg-neutral-900 text-white dark:bg-[#f4ece1] dark:text-[#090807] shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>Social Media Links</span>
          <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-mono">
            {currentSocialLinks.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('cv')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-outfit font-medium transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'cv'
              ? 'bg-neutral-900 text-white dark:bg-[#f4ece1] dark:text-[#090807] shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>CV & Resume</span>
          {cvData.customPdfUrl && (
            <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono font-medium">
              PDF
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('messages')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-outfit font-medium transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'messages'
              ? 'bg-neutral-900 text-white dark:bg-[#f4ece1] dark:text-[#090807] shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Inquiries</span>
          {unreadCount > 0 && (
            <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/25 text-amber-700 dark:text-[#d6ad60] font-mono font-bold">
              {unreadCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-outfit font-medium transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'security'
              ? 'bg-neutral-900 text-white dark:bg-[#f4ece1] dark:text-[#090807] shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Security</span>
        </button>

      </div>

      {/* ========================================================================= */}
      {/* TAB 1: OVERVIEW */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-fade-in">
          {/* Metrics Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-white dark:bg-[#12100e] border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
              <span className="text-xs font-outfit text-neutral-500 uppercase tracking-wider">Total Projects</span>
              <p className="text-3xl font-bold font-outfit mt-2 text-neutral-900 dark:text-white">{totalCount}</p>
              <span className="text-[11px] text-neutral-400 font-light mt-1 block">In database</span>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-[#12100e] border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
              <span className="text-xs font-outfit text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Live & Visible</span>
              <p className="text-3xl font-bold font-outfit mt-2 text-emerald-600 dark:text-emerald-400">{liveCount}</p>
              <span className="text-[11px] text-neutral-400 font-light mt-1 block">Shown on public page</span>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-[#12100e] border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
              <span className="text-xs font-outfit text-amber-600 dark:text-amber-400 uppercase tracking-wider">Hidden Projects</span>
              <p className="text-3xl font-bold font-outfit mt-2 text-amber-600 dark:text-amber-400">{hiddenCount}</p>
              <span className="text-[11px] text-neutral-400 font-light mt-1 block">Draft or archived</span>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-[#12100e] border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
              <span className="text-xs font-outfit text-[#c5a059] dark:text-[#d6ad60] uppercase tracking-wider">Social Channels</span>
              <p className="text-3xl font-bold font-outfit mt-2 text-[#c5a059] dark:text-[#d6ad60]">{currentSocialLinks.length}</p>
              <span className="text-[11px] text-neutral-400 font-light mt-1 block">Connected handles</span>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#12100e] border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
            <h3 className="text-base font-outfit font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#d6ad60]" />
              <span>Quick Management Shortcuts</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <button
                onClick={() => {
                  setActiveTab('projects');
                  handleOpenAddProject();
                }}
                className="flex items-center gap-3 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-[#d6ad60] bg-neutral-50/50 dark:bg-neutral-900/40 text-left transition-all cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-lg bg-[#d6ad60]/10 flex items-center justify-center text-[#d6ad60] group-hover:scale-110 transition-transform">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold font-outfit block">Add New Project</span>
                  <span className="text-[11px] text-neutral-400 font-light">With 16:9 gallery photo</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className="flex items-center gap-3 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-[#d6ad60] bg-neutral-50/50 dark:bg-neutral-900/40 text-left transition-all cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-lg bg-[#d6ad60]/10 flex items-center justify-center text-[#d6ad60] group-hover:scale-110 transition-transform">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold font-outfit block">Edit Personal Info</span>
                  <span className="text-[11px] text-neutral-400 font-light">Name, bio, contact details</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('social')}
                className="flex items-center gap-3 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-[#d6ad60] bg-neutral-50/50 dark:bg-neutral-900/40 text-left transition-all cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-lg bg-[#d6ad60]/10 flex items-center justify-center text-[#d6ad60] group-hover:scale-110 transition-transform">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold font-outfit block">Social Handles</span>
                  <span className="text-[11px] text-neutral-400 font-light">Add or edit profile links</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('cv')}
                className="flex items-center gap-3 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-[#d6ad60] bg-neutral-50/50 dark:bg-neutral-900/40 text-left transition-all cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-lg bg-[#d6ad60]/10 flex items-center justify-center text-[#d6ad60] group-hover:scale-110 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold font-outfit block">CV & Resume</span>
                  <span className="text-[11px] text-neutral-400 font-light">
                    {cvData.customPdfUrl ? 'PDF Uploaded' : 'Edit & Upload PDF'}
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Clean Recent Projects Overview */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#12100e] border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-outfit font-bold">Latest Projects in Catalog</h3>
              <button
                onClick={() => setActiveTab('projects')}
                className="text-xs font-outfit font-medium text-[#c5a059] dark:text-[#d6ad60] hover:underline"
              >
                View all projects &rarr;
              </button>
            </div>

            <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
              {projects.slice(0, 4).map((proj) => (
                <div key={proj.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <img 
                      src={proj.image} 
                      alt={proj.title}
                      className="w-12 h-9 rounded-md object-cover flex-shrink-0 bg-neutral-100 dark:bg-neutral-800"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-outfit font-bold text-neutral-900 dark:text-white truncate">
                        {proj.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-0.5">
                        <span className="capitalize">{proj.category === 'web-building' ? 'Web Build' : 'Graphic'}</span>
                        <span>&bull;</span>
                        <span>{proj.year}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-outfit font-semibold px-2 py-0.5 rounded-full ${
                      proj.hidden 
                        ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500' 
                        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {proj.hidden ? 'Hidden' : 'Live'}
                    </span>
                    <button
                      onClick={() => handleOpenEditProject(proj)}
                      className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      title="Edit"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PROJECTS MANAGER (প্রজেক্ট পেজ) */}
      {/* ========================================================================= */}
      {activeTab === 'projects' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Controls Bar: Search, Category, Visibility, +Add Project Button */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#12100e] border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
            
            {/* Search Input */}
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects by title or tech stack..."
                className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700/80 text-xs sm:text-sm focus:outline-none focus:border-[#d6ad60]"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value as any)}
                className="px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700/80 text-xs font-outfit focus:outline-none focus:border-[#d6ad60]"
              >
                <option value="all">All Categories</option>
                <option value="web-building">Website Building</option>
                <option value="graphic-design">Graphic Design</option>
              </select>

              <select
                value={filterVisibility}
                onChange={(e) => setFilterVisibility(e.target.value as any)}
                className="px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700/80 text-xs font-outfit focus:outline-none focus:border-[#d6ad60]"
              >
                <option value="all">All Statuses</option>
                <option value="live">Live Only</option>
                <option value="hidden">Hidden Only</option>
              </select>

              {/* Primary Add Project Button */}
              <button
                id="admin-add-project-btn"
                onClick={handleOpenAddProject}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#d6ad60] hover:bg-[#c5a059] text-black font-outfit font-bold text-xs sm:text-sm transition-all shadow-sm cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Add Project</span>
              </button>
            </div>
          </div>

          {/* Projects List Grid */}
          {filteredProjects.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#12100e] border border-neutral-200 dark:border-neutral-800">
              <FolderKanban className="w-10 h-10 mx-auto text-neutral-400 mb-3 opacity-60" />
              <p className="text-sm font-outfit font-medium text-neutral-600 dark:text-neutral-400">No projects found matching the filter.</p>
              <button
                onClick={handleOpenAddProject}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-outfit font-bold text-[#d6ad60] hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create your first project</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProjects.map((project) => {
                const isHidden = !!project.hidden;
                return (
                  <div
                    key={project.id}
                    className={`group relative rounded-2xl bg-white dark:bg-[#12100e] border transition-all duration-200 overflow-hidden flex flex-col justify-between shadow-xs ${
                      isHidden 
                        ? 'border-dashed border-neutral-300 dark:border-neutral-700 opacity-75' 
                        : 'border-neutral-200/80 dark:border-neutral-800/80 hover:border-[#d6ad60]/60'
                    }`}
                  >
                    {/* Card Top: Image + Quick Status */}
                    <div>
                      <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                        <img 
                          src={getAssetUrl(project.image)} 
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        
                        {/* Status Badge */}
                        <div className="absolute top-3 left-3">
                          <span className={`text-[10px] font-outfit font-bold px-2 py-0.5 rounded-full backdrop-blur-md shadow-xs ${
                            isHidden
                              ? 'bg-neutral-900/80 text-neutral-300 border border-neutral-700'
                              : 'bg-emerald-600/90 text-white'
                          }`}>
                            {isHidden ? 'Hidden (Draft)' : 'Live on Site'}
                          </span>
                        </div>

                        {/* Category Pill */}
                        <div className="absolute top-3 right-3">
                          <span className="text-[10px] font-outfit font-medium px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-neutral-200">
                            {project.category === 'web-building' ? 'Web Build' : 'Graphic'}
                          </span>
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="p-4 sm:p-5">
                        <div className="flex items-center justify-between text-[11px] text-neutral-400 font-outfit mb-1.5">
                          <span>{project.role || 'Creator'}</span>
                          <span>{project.year}</span>
                        </div>

                        <h3 className="font-outfit text-base font-bold text-neutral-900 dark:text-[#f4ece1] leading-snug line-clamp-1">
                          {project.title}
                        </h3>

                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2 leading-relaxed font-light">
                          {project.subtitle}
                        </p>

                        {/* Tags preview */}
                        <div className="flex flex-wrap gap-1 mt-3">
                          {(project.category === 'graphic-design' && project.designTools && project.designTools.length > 0
                            ? project.designTools
                            : project.techStack || []
                          ).slice(0, 3).map((t, idx) => (
                            <span
                              key={idx}
                              className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                                project.category === 'graphic-design'
                                  ? 'bg-amber-500/10 text-amber-700 dark:text-[#d6ad60]'
                                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                              }`}
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Toolbar */}
                    <div className="px-4 py-3 border-t border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/30 flex items-center justify-between gap-2">
                      
                      {/* Hide / Unhide Toggle */}
                      <button
                        onClick={() => {
                          toggleHideProject(project.id);
                          showToast(isHidden ? `"${project.title}" is now LIVE on the public site.` : `"${project.title}" is now HIDDEN.`);
                        }}
                        className={`inline-flex items-center gap-1 text-xs font-outfit font-medium px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                          isHidden
                            ? 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10'
                            : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/50 dark:hover:bg-neutral-800'
                        }`}
                        title={isHidden ? 'Unhide project (show on site)' : 'Hide project from site'}
                      >
                        {isHidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        <span>{isHidden ? 'Unhide' : 'Hide'}</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        {/* Edit Button */}
                        <button
                          onClick={() => handleOpenEditProject(project)}
                          className="inline-flex items-center gap-1 text-xs font-outfit font-medium text-neutral-700 dark:text-neutral-300 hover:text-[#d6ad60] px-2.5 py-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[#d6ad60]" />
                          <span>Edit</span>
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => setDeleteConfirmId(project.id)}
                          className="p-1 text-neutral-400 hover:text-red-500 rounded hover:bg-red-500/10 transition-colors cursor-pointer"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: PERSONAL INFO (নিজের তথ্য) */}
      {/* ========================================================================= */}
      {activeTab === 'profile' && (
        <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
          
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#12100e] border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
            
            <div className="mb-6 pb-4 border-b border-neutral-100 dark:border-neutral-800/80">
              <h2 className="text-lg sm:text-xl font-outfit font-bold text-neutral-900 dark:text-white">
                Personal & Public Contact Information
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Any changes made here will immediately update your Hero, About Me, Contact, Footer, and Navbar.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-5">
              
              {/* Name Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-outfit font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={profFirstName}
                    onChange={(e) => setProfFirstName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700/80 text-sm focus:outline-none focus:border-[#d6ad60]"
                    placeholder="NOOR"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-outfit font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5">
                    Last Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={profLastName}
                    onChange={(e) => setProfLastName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700/80 text-sm focus:outline-none focus:border-[#d6ad60]"
                    placeholder="HOSEN"
                  />
                </div>
              </div>

              {/* Title & Tagline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-outfit font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5">
                    Professional Title
                  </label>
                  <input
                    type="text"
                    value={profTitle}
                    onChange={(e) => setProfTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700/80 text-sm focus:outline-none focus:border-[#d6ad60]"
                    placeholder="Graphic Designer & Website Builder"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-outfit font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5">
                    Hero Tagline
                  </label>
                  <input
                    type="text"
                    value={profTagline}
                    onChange={(e) => setProfTagline(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700/80 text-sm focus:outline-none focus:border-[#d6ad60]"
                    placeholder="GRAPHIC DESIGNER  /  WEBSITE BUILDER"
                    required
                  />
                </div>
              </div>

              {/* Email, Phone, Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-outfit font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5">
                    Gmail / Email Address
                  </label>
                  <input
                    type="email"
                    value={profEmail}
                    onChange={(e) => setProfEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700/80 text-sm focus:outline-none focus:border-[#d6ad60]"
                    placeholder="skmahammadnurhosen1@gmail.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-outfit font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profPhone}
                    onChange={(e) => setProfPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700/80 text-sm focus:outline-none focus:border-[#d6ad60]"
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>
              </div>

              {/* Location Address */}
              <div>
                <label className="block text-xs font-outfit font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5">
                  Location / Address
                </label>
                <input
                  type="text"
                  value={profLocation}
                  onChange={(e) => setProfLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700/80 text-sm focus:outline-none focus:border-[#d6ad60]"
                  placeholder="Kolkata, India (Remote Available)"
                  required
                />
              </div>

              {/* Short Bio */}
              <div>
                <label className="block text-xs font-outfit font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5">
                  Short Bio (Hero & Quick Intros)
                </label>
                <textarea
                  rows={2}
                  value={profBio}
                  onChange={(e) => setProfBio(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700/80 text-sm focus:outline-none focus:border-[#d6ad60] resize-none"
                  placeholder="I craft modern and responsive web experiences with clean code and creative design."
                />
              </div>

              {/* Long Bio */}
              <div>
                <label className="block text-xs font-outfit font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5">
                  Extended Bio (About Me & CV Modal)
                </label>
                <textarea
                  rows={4}
                  value={profLongBio}
                  onChange={(e) => setProfLongBio(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700/80 text-sm focus:outline-none focus:border-[#d6ad60] resize-none"
                  placeholder="With 4+ years of focused experience..."
                />
              </div>

              {/* Submit Button */}
              <div className="pt-3 flex items-center justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#d6ad60] hover:bg-[#c5a059] text-black font-outfit font-bold text-xs sm:text-sm transition-all shadow-sm cursor-pointer"
                >
                  Save Changes & Synchronize
                </button>
              </div>

            </form>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: SOCIAL MEDIA LINKS (সোশ্যাল মিডিয়া ইউআরএল) */}
      {/* ========================================================================= */}
      {activeTab === 'social' && (
        <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
          
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#12100e] border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-neutral-100 dark:border-neutral-800/80">
              <div>
                <h2 className="text-lg sm:text-xl font-outfit font-bold text-neutral-900 dark:text-white">
                  Social Media Channels & Logos
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Add, edit, or delete social handles. Icons appear automatically in Hero, Contact capsules, and Footer.
                </p>
              </div>

              <button
                onClick={handleOpenAddSocial}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#d6ad60] hover:bg-[#c5a059] text-black font-outfit font-bold text-xs sm:text-sm transition-colors cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add Social Account</span>
              </button>
            </div>

            {/* List of Connected Handles */}
            <div className="space-y-3">
              {currentSocialLinks.map((item) => {
                const conf = PLATFORM_CONFIG[item.platform] || { label: item.platform, icon: Globe };
                const IconComponent = conf.icon;

                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl border border-neutral-200/70 dark:border-neutral-800/70 bg-neutral-50/40 dark:bg-neutral-900/30 flex items-center justify-between gap-4 hover:border-[#d6ad60]/50 transition-colors"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/80 flex items-center justify-center text-[#d6ad60] flex-shrink-0 shadow-xs">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-outfit font-bold text-neutral-900 dark:text-white">
                          {item.label || conf.label}
                        </h4>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-neutral-400 hover:text-[#d6ad60] truncate block max-w-xs sm:max-w-md"
                        >
                          {item.url}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleOpenEditSocial(item)}
                        className="p-2 text-neutral-500 hover:text-[#d6ad60] rounded-lg hover:bg-neutral-200/50 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                        title="Edit URL"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          deleteSocialLink(item.id);
                          showToast(`Removed ${item.label} handle.`);
                        }}
                        className="p-2 text-neutral-400 hover:text-red-500 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer"
                        title="Delete Channel"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: CV & RESUME MANAGEMENT */}
      {/* ========================================================================= */}
      {activeTab === 'cv' && (
        <CVManager
          onShowToast={showToast}
          onPreviewCV={() => setIsPreviewCVModalOpen(true)}
        />
      )}

      {/* ========================================================================= */}
      {/* TAB 6: INQUIRIES & MESSAGES MANAGEMENT */}
      {/* ========================================================================= */}
      {activeTab === 'messages' && (
        <MessagesManager onShowToast={showToast} />
      )}

      {activeTab === 'security' && (
        <SecurityTab adminUser={adminUser} onShowToast={showToast} />
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT PROJECT */}
      {/* ========================================================================= */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => {
          setIsProjectModalOpen(false);
          setEditingProject(null);
        }}
        editingProject={editingProject}
        onSave={handleSaveProject}
        onShowToast={showToast}
      />

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT SOCIAL LINK */}
      {/* ========================================================================= */}
      <SocialModal
        isOpen={isSocialModalOpen}
        onClose={() => setIsSocialModalOpen(false)}
        editingSocialId={editingSocialId}
        socialPlatform={socialPlatform}
        setSocialPlatform={setSocialPlatform}
        socialUrl={socialUrl}
        setSocialUrl={setSocialUrl}
        socialLabel={socialLabel}
        setSocialLabel={setSocialLabel}
        onSave={handleSaveSocial}
        platformConfig={PLATFORM_CONFIG}
      />

      {/* ========================================================================= */}
      {/* CONFIRMATION MODAL: DELETE PROJECT */}
      {/* ========================================================================= */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-[#141210] border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            
            <h3 className="text-base font-outfit font-bold text-neutral-900 dark:text-white">
              Confirm Project Deletion
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 mb-5">
              Are you sure you want to permanently delete this project? This will remove it from the database and public site.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-outfit font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    await deleteProject(deleteConfirmId);
                    showToast('Project deleted successfully.');
                  } catch (err: any) {
                    showToast(err?.message || 'Failed to delete project.');
                  } finally {
                    setDeleteConfirmId(null);
                  }
                }}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-outfit font-bold shadow-sm cursor-pointer"
              >
                Delete Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CV Preview Modal */}
      <DownloadCVModal
        isOpen={isPreviewCVModalOpen}
        onClose={() => setIsPreviewCVModalOpen(false)}
      />

    </div>
  );
};
