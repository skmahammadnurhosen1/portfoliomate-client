import React, { useState, useRef } from 'react';
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

  // Project Form State - ALL EMPTY BY DEFAULT
  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formCategory, setFormCategory] = useState<'web-building' | 'graphic-design'>('web-building');
  const [formYear, setFormYear] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formStatus, setFormStatus] = useState('');
  const [formRating, setFormRating] = useState('');
  const [formDuration, setFormDuration] = useState('');
  const [formRate, setFormRate] = useState('');
  const [formTechTags, setFormTechTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [formDemoUrl, setFormDemoUrl] = useState('');
  const [formGithubUrl, setFormGithubUrl] = useState('');
  // Graphic Design specific form state
  const [formClientName, setFormClientName] = useState('');
  const [formDeliverables, setFormDeliverables] = useState('');
  const [formDesignTools, setFormDesignTools] = useState<string[]>([]);
  const [designToolInput, setDesignToolInput] = useState('');
  const [formBehanceUrl, setFormBehanceUrl] = useState('');
  const [formDimensions, setFormDimensions] = useState('');
  const [formFeatured, setFormFeatured] = useState(false);

  // File Upload Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Security & Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      showToast('Please fill in all password fields.');
      return;
    }
    if (newPassword.length < 8) {
      showToast('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match.');
      return;
    }
    setIsChangingPassword(true);
    try {
      await authApi.changePassword({ currentPassword, newPassword });
      showToast('Password updated successfully in database!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      showToast(err.message || 'Failed to update password.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Open Project Modal for Add (Completely empty by default)
  const handleOpenAddProject = () => {
    setEditingProject(null);
    setFormTitle('');
    setFormSubtitle('');
    setFormCategory('web-building');
    setFormYear('');
    setFormDescription('');
    setFormImage('');
    setFormRole('');
    setFormStatus('');
    setFormRating('');
    setFormDuration('');
    setFormRate('');
    setFormTechTags([]);
    setTagInput('');
    setFormDemoUrl('');
    setFormGithubUrl('');
    setFormClientName('');
    setFormDeliverables('');
    setFormDesignTools([]);
    setDesignToolInput('');
    setFormBehanceUrl('');
    setFormDimensions('');
    setFormFeatured(false);
    setIsProjectModalOpen(true);
  };

  // Open Project Modal for Edit
  const handleOpenEditProject = (proj: Project) => {
    setEditingProject(proj);
    setFormTitle(proj.title || '');
    setFormSubtitle(proj.subtitle || '');
    setFormCategory(proj.category || 'web-building');
    setFormYear(proj.year || '');
    setFormDescription(proj.description || '');
    setFormImage(proj.image || '');
    setFormRole(proj.role || '');
    setFormStatus(proj.status || '');
    setFormRating(proj.rating || '');
    setFormDuration(proj.duration || '');
    setFormRate(proj.rate || '');
    setFormTechTags(proj.techStack || []);
    setTagInput('');
    setFormDemoUrl(proj.demoUrl || '');
    setFormGithubUrl(proj.githubUrl || '');
    setFormClientName(proj.clientName || '');
    setFormDeliverables(proj.deliverables || '');
    setFormDesignTools(proj.designTools || (proj.category === 'graphic-design' ? proj.techStack : []));
    setDesignToolInput('');
    setFormBehanceUrl(proj.behanceUrl || '');
    setFormDimensions(proj.dimensions || '');
    setFormFeatured(proj.featured || false);
    setIsProjectModalOpen(true);
  };

  // Handle Image File Upload from device / gallery
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate type
      if (!file.type.startsWith('image/')) {
        showToast('Please select a valid image file (JPG, PNG, WebP, SVG).');
        return;
      }
      uploadApi.uploadImage(file)
        .then((res) => {
          if (res.url) {
            setFormImage(res.url);
            showToast('Image uploaded and saved to server successfully!');
          }
        })
        .catch((err) => {
          console.warn('[AdminDashboard] Server image upload failed, fallback to data url:', err);
          const reader = new FileReader();
          reader.onload = (uploadEvent) => {
            const result = uploadEvent.target?.result as string;
            if (result) {
              setFormImage(result);
              showToast('Image loaded successfully.');
            }
          };
          reader.readAsDataURL(file);
        });
    }
  };

  // Add Tech Tag
  const handleAddTag = () => {
    if (tagInput.trim() && !formTechTags.includes(tagInput.trim())) {
      setFormTechTags([...formTechTags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormTechTags(formTechTags.filter(t => t !== tagToRemove));
  };

  // Add Design Tool Tag
  const handleAddDesignTool = () => {
    if (designToolInput.trim() && !formDesignTools.includes(designToolInput.trim())) {
      setFormDesignTools([...formDesignTools, designToolInput.trim()]);
      setDesignToolInput('');
    }
  };

  const handleRemoveDesignTool = (toolToRemove: string) => {
    setFormDesignTools(formDesignTools.filter(t => t !== toolToRemove));
  };

  // Save Project
  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      showToast('Project title is required.');
      return;
    }
    if (!formImage.trim()) {
      showToast('Please upload or provide a project cover image.');
      return;
    }

    const projectPayload: any = {
      title: formTitle.trim(),
      subtitle: formSubtitle.trim(),
      category: formCategory,
      year: formYear.trim() || new Date().getFullYear().toString(),
      description: formDescription.trim(),
      image: formImage.trim(),
      role: formRole.trim(),
      status: formStatus.trim(),
      rating: formRating.trim(),
      duration: formDuration.trim(),
      rate: formRate.trim(),
      featured: formFeatured,
      hidden: editingProject ? editingProject.hidden : false,
    };

    if (formCategory === 'graphic-design') {
      projectPayload.clientName = formClientName.trim();
      projectPayload.deliverables = formDeliverables.trim();
      projectPayload.designTools = formDesignTools;
      projectPayload.behanceUrl = formBehanceUrl.trim() || undefined;
      projectPayload.dimensions = formDimensions.trim();
      projectPayload.techStack = formDesignTools.length > 0 ? formDesignTools : ['Photoshop', 'Illustrator'];
      projectPayload.demoUrl = formDemoUrl.trim() || undefined;
      projectPayload.githubUrl = undefined;
    } else {
      projectPayload.techStack = formTechTags.length > 0 ? formTechTags : ['React', 'CSS'];
      projectPayload.demoUrl = formDemoUrl.trim() || undefined;
      projectPayload.githubUrl = formGithubUrl.trim() || undefined;
    }

    if (editingProject) {
      updateProject(editingProject.id, projectPayload);
      showToast(`Updated "${formTitle}" successfully!`);
    } else {
      addProject(projectPayload);
      showToast(`Added new project "${formTitle}"! Public cards updated.`);
    }

    setIsProjectModalOpen(false);
    setEditingProject(null);
  };

  // Save Profile Form
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updatePersonalInfo({
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

  const handleSaveSocial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!socialUrl.trim()) {
      showToast('Please enter a valid URL.');
      return;
    }
    const label = socialLabel.trim() || PLATFORM_CONFIG[socialPlatform]?.label || socialPlatform;

    if (editingSocialId) {
      updateSocialLink(editingSocialId, socialUrl.trim(), label);
      showToast('Social link updated!');
    } else {
      addSocialLink({
        platform: socialPlatform,
        url: socialUrl.trim(),
        label,
      });
      showToast('New social channel added! Public links updated.');
    }
    setIsSocialModalOpen(false);
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

      {/* ========================================================================= */}
      {/* TAB 7: SECURITY & PASSWORD SETTINGS */}
      {/* ========================================================================= */}
      {activeTab === 'security' && (
        <div className="space-y-8 animate-fade-in max-w-2xl">
          
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#12100e] border border-neutral-200/90 dark:border-neutral-800/90 shadow-xs">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-neutral-100 dark:border-neutral-800">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[#d6ad60] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-outfit font-bold text-base sm:text-lg text-neutral-900 dark:text-white">
                  Admin Credentials &amp; Access Control
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Update your administrative password and view active security enforcement.
                </p>
              </div>
            </div>

            {/* Current Active Account Info */}
            <div className="mb-6 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 text-xs font-outfit space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-neutral-500 dark:text-neutral-400">Admin Email:</span>
                <span className="font-mono font-semibold text-neutral-800 dark:text-neutral-200">
                  {adminUser?.email || 'admin@noor.dev'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500 dark:text-neutral-400">Role Authorization:</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold uppercase text-[10px]">
                  {adminUser?.role || 'Admin'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500 dark:text-neutral-400">Session Status:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  Active (Encrypted HTTP-Only Token)
                </span>
              </div>
            </div>

            {/* Change Password Form */}
            <form onSubmit={handleChangePassword} className="space-y-4">
              <h4 className="font-outfit font-bold text-sm text-neutral-900 dark:text-white">
                Change Admin Password
              </h4>

              <div className="space-y-1.5">
                <label className="block text-xs font-outfit font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs sm:text-sm focus:outline-none focus:border-[#d6ad60]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-outfit font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                  New Password (min 8 characters)
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={8}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs sm:text-sm focus:outline-none focus:border-[#d6ad60]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-outfit font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs sm:text-sm focus:outline-none focus:border-[#d6ad60]"
                />
              </div>

              <button
                type="submit"
                disabled={isChangingPassword}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-[#c5a059] dark:bg-[#f4ece1] dark:hover:bg-[#d6ad60] text-white dark:text-[#090807] font-outfit font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer disabled:opacity-50"
              >
                {isChangingPassword ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Update Password</span>
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT PROJECT (With 16:9 Gallery Upload) */}
      {/* ========================================================================= */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl my-8 rounded-2xl bg-white dark:bg-[#141210] border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-neutral-100 dark:border-neutral-800">
              <div>
                <h3 className="text-lg sm:text-xl font-outfit font-bold text-neutral-900 dark:text-white">
                  {editingProject ? 'Edit Project Details' : 'Add New Portfolio Project'}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Fill in all fields shown on the minimalist public cards and detailed case study page.
                </p>
              </div>

              <button
                onClick={() => setIsProjectModalOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-5">
              
              {/* 1. Title & Subtitle */}
              <div>
                <label className="block text-xs font-outfit font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5">
                  Project Title *
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Aura Luxury Timepieces"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700/80 text-sm focus:outline-none focus:border-[#d6ad60]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-outfit font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5">
                  Subtitle / Brief Tagline
                </label>
                <input
                  type="text"
                  value={formSubtitle}
                  onChange={(e) => setFormSubtitle(e.target.value)}
                  placeholder="e.g. High-End E-Commerce & Interactive 3D Showcase"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700/80 text-sm focus:outline-none focus:border-[#d6ad60]"
                />
              </div>

              {/* 2. Category & Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-outfit font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5">
                    Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700/80 text-sm focus:outline-none focus:border-[#d6ad60]"
                  >
                    <option value="web-building">Website Building</option>
                    <option value="graphic-design">Graphic Design</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-outfit font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5">
                    Year of Delivery
                  </label>
                  <input
                    type="text"
                    value={formYear}
                    onChange={(e) => setFormYear(e.target.value)}
                    placeholder="2025"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700/80 text-sm focus:outline-none focus:border-[#d6ad60]"
                  />
                </div>
              </div>

              {/* 3. IMAGE UPLOAD FROM DEVICE GALLERY (16:9 Ratio Requirement) */}
              <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-outfit font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#d6ad60]" />
                    <span>Project Cover Image (Upload from Gallery)</span>
                  </label>
                  <span className="text-[11px] font-mono text-[#c5a059] dark:text-[#d6ad60] font-semibold">
                    Best: 16:9 (1200 &times; 675px)
                  </span>
                </div>

                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mb-3">
                  Upload a clean horizontal photo directly from your device gallery or storage. No raw URL required.
                </p>

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />

                {/* Upload / Preview Area */}
                {formImage ? (
                  <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700 group">
                    <img 
                      src={getAssetUrl(formImage)} 
                      alt="Project Preview" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3.5 py-1.5 rounded-lg bg-white text-black text-xs font-outfit font-bold hover:bg-neutral-200 transition-colors flex items-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Change Photo</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl p-6 text-center cursor-pointer hover:border-[#d6ad60] transition-colors"
                  >
                    <Upload className="w-8 h-8 mx-auto text-neutral-400 mb-2" />
                    <p className="text-xs font-outfit font-bold text-neutral-800 dark:text-neutral-200">
                      Click to choose image from Gallery
                    </p>
                    <p className="text-[10px] text-neutral-400 mt-1">
                      PNG, JPG, WebP up to 10MB (16:9 recommended)
                    </p>
                  </div>
                )}
              </div>

              {/* 4. Role, Status, Rating, Duration, Rate */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-outfit font-medium text-neutral-500 mb-1">
                    {formCategory === 'graphic-design' ? 'Design Role' : 'Dev Role'}
                  </label>
                  <input
                    type="text"
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    placeholder={formCategory === 'graphic-design' ? 'e.g. Lead Brand Designer' : 'e.g. Frontend Engineer'}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none focus:border-[#d6ad60]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-outfit font-medium text-neutral-500 mb-1">
                    Project Status
                  </label>
                  <input
                    type="text"
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    placeholder="e.g. Completed / Delivered"
                    className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none focus:border-[#d6ad60]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-outfit font-medium text-neutral-500 mb-1">
                    Client Rating
                  </label>
                  <input
                    type="text"
                    value={formRating}
                    onChange={(e) => setFormRating(e.target.value)}
                    placeholder="e.g. 5.0"
                    className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none focus:border-[#d6ad60]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-outfit font-medium text-neutral-500 mb-1">
                    Duration / Timeline
                  </label>
                  <input
                    type="text"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    placeholder="e.g. 5 Days"
                    className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none focus:border-[#d6ad60]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-outfit font-medium text-neutral-500 mb-1">
                    Rate / Budget
                  </label>
                  <input
                    type="text"
                    value={formRate}
                    onChange={(e) => setFormRate(e.target.value)}
                    placeholder="e.g. Fixed Price / Hourly"
                    className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none focus:border-[#d6ad60]"
                  />
                </div>
              </div>

              {/* 5. DYNAMIC CATEGORY-SPECIFIC FORM FIELDS */}
              {formCategory === 'graphic-design' ? (
                /* ================= GRAPHIC DESIGN FIELDS ================= */
                <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/[0.03] space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-amber-500/10 text-[#d6ad60]">
                    <Palette className="w-4 h-4" />
                    <span className="text-xs font-outfit font-bold uppercase tracking-wider">
                      Graphic Design Specific Details
                    </span>
                  </div>

                  {/* Client Name & Dimensions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-outfit font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                        Client / Brand Name
                      </label>
                      <input
                        type="text"
                        value={formClientName}
                        onChange={(e) => setFormClientName(e.target.value)}
                        placeholder="e.g. Apex Luxury Co. or Personal Commission"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700/80 text-sm focus:outline-none focus:border-[#d6ad60]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-outfit font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                        Dimensions & Print Specs
                      </label>
                      <input
                        type="text"
                        value={formDimensions}
                        onChange={(e) => setFormDimensions(e.target.value)}
                        placeholder="e.g. 300 DPI CMYK, A4 Vector, 4K UHD"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700/80 text-sm focus:outline-none focus:border-[#d6ad60]"
                      />
                    </div>
                  </div>

                  {/* Deliverables / Scope */}
                  <div>
                    <label className="block text-xs font-outfit font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                      Deliverables & Scope
                    </label>
                    <input
                      type="text"
                      value={formDeliverables}
                      onChange={(e) => setFormDeliverables(e.target.value)}
                      placeholder="e.g. Logo Identity, Typography, Packaging, Social Media Kit"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700/80 text-sm focus:outline-none focus:border-[#d6ad60]"
                    />
                  </div>

                  {/* Design Software & Tools */}
                  <div>
                    <label className="block text-xs font-outfit font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                      Design Software & Tools
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={designToolInput}
                        onChange={(e) => setDesignToolInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddDesignTool();
                          }
                        }}
                        placeholder="e.g. Adobe Illustrator, Photoshop, Figma, InDesign..."
                        className="flex-1 px-3 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none focus:border-[#d6ad60]"
                      />
                      <button
                        type="button"
                        onClick={handleAddDesignTool}
                        className="px-3.5 py-2 rounded-lg bg-[#d6ad60] text-black text-xs font-outfit font-bold hover:bg-[#c5a059]"
                      >
                        Add Tool
                      </button>
                    </div>

                    {/* Display Current Design Tools */}
                    <div className="flex flex-wrap gap-1.5">
                      {formDesignTools.map((tool) => (
                        <span
                          key={tool}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-800 dark:text-[#d6ad60] border border-amber-500/20 text-xs font-outfit"
                        >
                          <span>{tool}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveDesignTool(tool)}
                            className="hover:text-red-500 ml-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Behance URL & Optional Interactive Showcase URL */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div>
                      <label className="block text-xs font-outfit font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                        Behance Showcase URL (Optional)
                      </label>
                      <input
                        type="url"
                        value={formBehanceUrl}
                        onChange={(e) => setFormBehanceUrl(e.target.value)}
                        placeholder="https://behance.net/gallery/..."
                        className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none focus:border-[#d6ad60]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-outfit font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                        Live Preview / Interactive Link (Optional)
                      </label>
                      <input
                        type="url"
                        value={formDemoUrl}
                        onChange={(e) => setFormDemoUrl(e.target.value)}
                        placeholder="https://example.com"
                        className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none focus:border-[#d6ad60]"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* ================= WEBSITE BUILDING FIELDS ================= */
                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100">
                    <Globe className="w-4 h-4 text-[#d6ad60]" />
                    <span className="text-xs font-outfit font-bold uppercase tracking-wider">
                      Website Development Details
                    </span>
                  </div>

                  {/* Tech Stack Tags */}
                  <div>
                    <label className="block text-xs font-outfit font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5">
                      Tech Stack & Libraries
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                        placeholder="e.g. Next.js, React, Tailwind CSS, TypeScript..."
                        className="flex-1 px-3 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none focus:border-[#d6ad60]"
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="px-3.5 py-2 rounded-lg bg-neutral-200 dark:bg-neutral-800 text-xs font-outfit font-bold hover:bg-neutral-300 dark:hover:bg-neutral-700"
                      >
                        Add
                      </button>
                    </div>

                    {/* Display Current Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {formTechTags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-xs font-outfit text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700"
                        >
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="hover:text-red-500 ml-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Web URLs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-outfit font-medium text-neutral-500 mb-1">
                        Live Demo URL (Optional)
                      </label>
                      <input
                        type="url"
                        value={formDemoUrl}
                        onChange={(e) => setFormDemoUrl(e.target.value)}
                        placeholder="https://example.com"
                        className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none focus:border-[#d6ad60]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-outfit font-medium text-neutral-500 mb-1">
                        GitHub / Source Code URL (Optional)
                      </label>
                      <input
                        type="url"
                        value={formGithubUrl}
                        onChange={(e) => setFormGithubUrl(e.target.value)}
                        placeholder="https://github.com/..."
                        className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none focus:border-[#d6ad60]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 6. Detailed Description (Shown on public details page) */}
              <div>
                <label className="block text-xs font-outfit font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5">
                  Case Study & Full Description (For Details Page)
                </label>
                <textarea
                  rows={4}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Describe the client's problem, your creative solution, architecture, and results..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700/80 text-sm focus:outline-none focus:border-[#d6ad60] resize-none"
                />
              </div>

              {/* 7. Featured Toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="form-featured"
                  checked={formFeatured}
                  onChange={(e) => setFormFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-[#d6ad60] focus:ring-[#d6ad60]"
                />
                <label htmlFor="form-featured" className="text-xs font-outfit text-neutral-700 dark:text-neutral-300 cursor-pointer">
                  Feature this project prominently on portfolio
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-neutral-500 hover:text-neutral-900 dark:hover:text-white text-xs font-outfit"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#d6ad60] hover:bg-[#c5a059] text-black font-outfit font-bold text-xs sm:text-sm transition-all shadow-sm cursor-pointer"
                >
                  {editingProject ? 'Save Project Changes' : 'Create & Publish Project'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT SOCIAL LINK */}
      {/* ========================================================================= */}
      {isSocialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-[#141210] border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6">
            
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-base font-outfit font-bold text-neutral-900 dark:text-white">
                {editingSocialId ? 'Edit Social Channel' : 'Add Social Channel'}
              </h3>
              <button
                onClick={() => setIsSocialModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSocial} className="space-y-4">
              <div>
                <label className="block text-xs font-outfit font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5">
                  Choose Platform
                </label>
                <select
                  value={socialPlatform}
                  onChange={(e) => setSocialPlatform(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700/80 text-sm focus:outline-none focus:border-[#d6ad60]"
                >
                  {Object.entries(PLATFORM_CONFIG).map(([key, val]) => (
                    <option key={key} value={key}>
                      {val.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-outfit font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5">
                  Display Label (Optional)
                </label>
                <input
                  type="text"
                  value={socialLabel}
                  onChange={(e) => setSocialLabel(e.target.value)}
                  placeholder={PLATFORM_CONFIG[socialPlatform]?.label || 'Profile'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700/80 text-sm focus:outline-none focus:border-[#d6ad60]"
                />
              </div>

              <div>
                <label className="block text-xs font-outfit font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5">
                  Full Profile URL *
                </label>
                <input
                  type="url"
                  value={socialUrl}
                  onChange={(e) => setSocialUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700/80 text-sm focus:outline-none focus:border-[#d6ad60]"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSocialModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-neutral-500 hover:text-neutral-900 dark:hover:text-white text-xs font-outfit"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#d6ad60] hover:bg-[#c5a059] text-black font-outfit font-bold text-xs transition-all shadow-sm cursor-pointer"
                >
                  Save Channel
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

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
                onClick={() => {
                  deleteProject(deleteConfirmId);
                  setDeleteConfirmId(null);
                  showToast('Project deleted successfully.');
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
