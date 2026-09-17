import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Upload, 
  Trash2, 
  Download, 
  Plus, 
  Check, 
  X, 
  Eye, 
  RotateCcw, 
  Sparkles, 
  Briefcase, 
  GraduationCap, 
  CheckCircle2, 
  AlertCircle,
  Edit3
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { CVHighlightItem, CVExperienceItem, CVEducationItem } from '../../types';

interface CVManagerProps {
  onShowToast: (msg: string) => void;
  onPreviewCV: () => void;
}

export const CVManager: React.FC<CVManagerProps> = ({ onShowToast, onPreviewCV }) => {
  const { 
    cvData, 
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
    resetCVToDefaults
  } = usePortfolio();

  // Basic Header Form State
  const [fullName, setFullName] = useState(cvData.fullName || '');
  const [title, setTitle] = useState(cvData.title || '');
  const [summary, setSummary] = useState(cvData.summary || '');
  const [email, setEmail] = useState(cvData.email || '');
  const [phone, setPhone] = useState(cvData.phone || '');
  const [location, setLocation] = useState(cvData.location || '');
  const [statusBadge, setStatusBadge] = useState(cvData.statusBadge || '');

  // Skills input state
  const [newSkillInput, setNewSkillInput] = useState('');

  // Highlight input/editing state
  const [newHighlightInput, setNewHighlightInput] = useState('');
  const [editingHighlightId, setEditingHighlightId] = useState<string | null>(null);
  const [editingHighlightText, setEditingHighlightText] = useState('');

  // Experience state
  const [isAddingExp, setIsAddingExp] = useState(false);
  const [expRole, setExpRole] = useState('');
  const [expCompany, setExpCompany] = useState('');
  const [expPeriod, setExpPeriod] = useState('');
  const [expDesc, setExpDesc] = useState('');
  const [editingExpId, setEditingExpId] = useState<string | null>(null);

  // Education state
  const [isAddingEdu, setIsAddingEdu] = useState(false);
  const [eduDegree, setEduDegree] = useState('');
  const [eduInstitution, setEduInstitution] = useState('');
  const [eduYear, setEduYear] = useState('');
  const [editingEduId, setEditingEduId] = useState<string | null>(null);

  // File Upload Ref
  const pdfInputRef = useRef<HTMLInputElement>(null);

  // Handle PDF Upload
  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      onShowToast('Please select a valid PDF file (.pdf)');
      return;
    }

    // Check size (e.g. 15MB max for base64 storage)
    if (file.size > 15 * 1024 * 1024) {
      onShowToast('PDF file size is too large (max 15MB).');
      return;
    }

    const formattedSize = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
      : `${Math.round(file.size / 1024)} KB`;

    uploadCVPdfFile(file)
      .then(() => {
        onShowToast(`PDF uploaded successfully to server: "${file.name}"!`);
      })
      .catch((err) => {
        console.warn('[CVManager] Server upload failed, using local reader fallback:', err);
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target?.result as string;
          if (dataUrl) {
            uploadCVPdf(dataUrl, file.name, formattedSize);
            onShowToast(`PDF saved: "${file.name}"!`);
          }
        };
        reader.onerror = () => {
          onShowToast('Failed to read the PDF file. Please try again.');
        };
        reader.readAsDataURL(file);
      });

    // Reset input
    if (pdfInputRef.current) pdfInputRef.current.value = '';
  };

  // Test Download uploaded PDF
  const handleTestDownload = () => {
    if (!cvData.customPdfUrl) {
      onShowToast('No PDF uploaded yet.');
      return;
    }
    const link = document.createElement('a');
    link.href = cvData.customPdfUrl;
    link.download = cvData.customPdfFileName || 'Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast(`Downloading "${cvData.customPdfFileName || 'Resume.pdf'}"...`);
  };

  // Save General CV Details
  const handleSaveGeneralDetails = (e: React.FormEvent) => {
    e.preventDefault();
    updateCVData({
      fullName: fullName.trim(),
      title: title.trim(),
      summary: summary.trim(),
      email: email.trim(),
      phone: phone.trim(),
      location: location.trim(),
      statusBadge: statusBadge.trim(),
    });
    onShowToast('CV profile details saved successfully!');
  };

  // Add Skill
  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillInput.trim()) return;
    addCVSkill(newSkillInput.trim());
    setNewSkillInput('');
    onShowToast(`Added skill: "${newSkillInput.trim()}"`);
  };

  // Add Highlight
  const handleAddHighlight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHighlightInput.trim()) return;
    addCVHighlight(newHighlightInput.trim());
    setNewHighlightInput('');
    onShowToast('Highlight added!');
  };

  // Save Highlight Edit
  const handleSaveHighlightEdit = (id: string) => {
    if (!editingHighlightText.trim()) return;
    updateCVHighlight(id, editingHighlightText.trim());
    setEditingHighlightId(null);
    setEditingHighlightText('');
    onShowToast('Highlight updated!');
  };

  // Experience handlers
  const handleSaveExp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expRole.trim() || !expCompany.trim()) {
      onShowToast('Role and Company are required.');
      return;
    }
    if (editingExpId) {
      updateCVExperience(editingExpId, {
        role: expRole.trim(),
        company: expCompany.trim(),
        period: expPeriod.trim(),
        description: expDesc.trim(),
      });
      onShowToast('Experience updated!');
      setEditingExpId(null);
    } else {
      addCVExperience({
        role: expRole.trim(),
        company: expCompany.trim(),
        period: expPeriod.trim() || 'Present',
        description: expDesc.trim(),
      });
      onShowToast('New experience added!');
    }
    setIsAddingExp(false);
    setExpRole('');
    setExpCompany('');
    setExpPeriod('');
    setExpDesc('');
  };

  const handleEditExp = (exp: CVExperienceItem) => {
    setEditingExpId(exp.id);
    setExpRole(exp.role);
    setExpCompany(exp.company);
    setExpPeriod(exp.period);
    setExpDesc(exp.description);
    setIsAddingExp(true);
  };

  // Education handlers
  const handleSaveEdu = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eduDegree.trim() || !eduInstitution.trim()) {
      onShowToast('Degree and Institution are required.');
      return;
    }
    if (editingEduId) {
      updateCVEducation(editingEduId, {
        degree: eduDegree.trim(),
        institution: eduInstitution.trim(),
        year: eduYear.trim(),
      });
      onShowToast('Education updated!');
      setEditingEduId(null);
    } else {
      addCVEducation({
        degree: eduDegree.trim(),
        institution: eduInstitution.trim(),
        year: eduYear.trim() || '2024',
      });
      onShowToast('Education added!');
    }
    setIsAddingEdu(false);
    setEduDegree('');
    setEduInstitution('');
    setEduYear('');
  };

  const handleEditEdu = (edu: CVEducationItem) => {
    setEditingEduId(edu.id);
    setEduDegree(edu.degree);
    setEduInstitution(edu.institution);
    setEduYear(edu.year);
    setIsAddingEdu(true);
  };

  return (
    <div className="space-y-8 animate-fade-in font-outfit">
      {/* Top Banner & Quick Controls */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#12100e] border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-5 h-5 text-[#d6ad60]" />
            <h2 className="text-xl font-bold font-serif-luxury text-neutral-900 dark:text-white">
              Curriculum Vitae (CV) & Resume Manager
            </h2>
          </div>
          <p className="text-xs text-neutral-500 font-light max-w-2xl">
            Manage the information displayed on the public &apos;Download CV&apos; popup. You can also upload your custom official PDF resume for visitors to download directly.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={onPreviewCV}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800/80 hover:border-[#d6ad60] hover:text-[#d6ad60] transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>Preview Public CV</span>
          </button>
          
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Are you sure you want to reset CV details to default?')) {
                resetCVToDefaults();
                setFullName('NOOR HOSEN');
                setTitle('Graphic Designer & Website Builder');
                onShowToast('CV reset to defaults.');
              }
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-neutral-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
            title="Reset CV"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. PDF UPLOAD & DOWNLOAD MANAGEMENT (MAIN FEATURE) */}
      {/* ========================================================================= */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#12100e] border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-[#d6ad60]" />
              <span>Official CV PDF File Upload</span>
            </h3>
            <p className="text-xs text-neutral-500 font-light mt-0.5">
              Upload your official prepared PDF resume here. When visitors click &apos;Download CV&apos;, this exact file will be downloaded directly.
            </p>
          </div>
          {cvData.customPdfUrl ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
              <Check className="w-3.5 h-3.5" />
              <span>Active PDF Ready</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>No Custom PDF Uploaded</span>
            </span>
          )}
        </div>

        {/* Hidden File Input */}
        <input 
          type="file" 
          ref={pdfInputRef}
          accept="application/pdf,.pdf"
          onChange={handlePdfUpload}
          className="hidden"
        />

        {cvData.customPdfUrl ? (
          /* Uploaded File Active Card */
          <div className="p-4 sm:p-5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-900 dark:text-white break-all">
                  {cvData.customPdfFileName || 'Curriculum_Vitae.pdf'}
                </p>
                <div className="flex items-center gap-3 text-xs text-neutral-500 mt-1 font-light">
                  <span>Size: {cvData.customPdfFileSize || 'PDF Document'}</span>
                  <span>•</span>
                  <span>Uploaded: {cvData.customPdfUploadDate || 'Recently'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={handleTestDownload}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium bg-neutral-900 text-white dark:bg-[#d6ad60] dark:text-neutral-950 hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Test Download</span>
              </button>

              <button
                type="button"
                onClick={() => pdfInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium border border-neutral-300 dark:border-neutral-700 hover:border-[#d6ad60] hover:text-[#d6ad60] transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Replace</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Are you sure you want to remove the uploaded PDF?')) {
                    removeCVPdf();
                    onShowToast('Uploaded PDF removed.');
                  }
                }}
                className="p-2 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
                title="Remove uploaded PDF"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Dropzone / Upload Trigger */
          <div 
            onClick={() => pdfInputRef.current?.click()}
            className="border-2 border-dashed border-neutral-300 dark:border-neutral-700/80 hover:border-[#d6ad60] dark:hover:border-[#d6ad60] rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors group bg-neutral-50/50 dark:bg-neutral-900/40"
          >
            <div className="w-12 h-12 rounded-full bg-[#d6ad60]/10 flex items-center justify-center text-[#d6ad60] mb-3 group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              Click to select and upload your CV / Resume PDF
            </p>
            <p className="text-xs text-neutral-400 font-light mt-1 max-w-sm">
              Supports .pdf documents (recommended under 10MB). Once uploaded, visitors clicking &apos;Download CV&apos; will instantly receive this exact file.
            </p>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. MINIMALIST MODAL TOGGLES (KEEP CLEAN & NOT OVERCROWDED) */}
      {/* ========================================================================= */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#12100e] border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#d6ad60]" />
            <span>Minimalist Display Controls (Section Toggles)</span>
          </h3>
          <p className="text-xs text-neutral-500 font-light mt-0.5">
            Keep the CV popup clean and decluttered by enabling only the sections you want to present:
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { key: 'showContact', label: 'Contact Pills' },
            { key: 'showSummary', label: 'Summary / Bio' },
            { key: 'showSkills', label: 'Skills Chips' },
            { key: 'showHighlights', label: 'Key Highlights' },
            { key: 'showExperience', label: 'Experience' },
            { key: 'showEducation', label: 'Education' },
          ].map((toggle) => {
            const isChecked = cvData[toggle.key as keyof typeof cvData] as boolean;
            return (
              <label 
                key={toggle.key}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-medium cursor-pointer transition-colors ${
                  isChecked 
                    ? 'border-[#d6ad60] bg-[#d6ad60]/10 text-neutral-900 dark:text-white' 
                    : 'border-neutral-200 dark:border-neutral-800 text-neutral-400 bg-neutral-50/50 dark:bg-neutral-900/30'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => {
                    updateCVData({ [toggle.key]: e.target.checked });
                    onShowToast(`${toggle.label} visibility updated.`);
                  }}
                  className="rounded border-neutral-300 text-[#d6ad60] focus:ring-[#d6ad60]"
                />
                <span>{toggle.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. BASIC HEADER DETAILS */}
      {/* ========================================================================= */}
      <form onSubmit={handleSaveGeneralDetails} className="p-6 rounded-2xl bg-white dark:bg-[#12100e] border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              CV Header & Contact Information
            </h3>
            <p className="text-xs text-neutral-500 font-light mt-0.5">
              Personal branding, professional title, bio summary, and direct reachout details.
            </p>
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#d6ad60] text-neutral-950 hover:bg-[#c5a059] transition-colors cursor-pointer shadow-xs"
          >
            Save Header Details
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700/80 text-sm focus:outline-none focus:border-[#d6ad60]"
              placeholder="NOOR HOSEN"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Professional Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700/80 text-sm focus:outline-none focus:border-[#d6ad60]"
              placeholder="Graphic Designer & Website Builder"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Status Pill / Badge
            </label>
            <input
              type="text"
              value={statusBadge}
              onChange={(e) => setStatusBadge(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700/80 text-sm focus:outline-none focus:border-[#d6ad60]"
              placeholder="Available for Freelance & Full-time"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700/80 text-sm focus:outline-none focus:border-[#d6ad60]"
              placeholder="skmahammadnurhosen1@gmail.com"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Phone Number
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700/80 text-sm focus:outline-none focus:border-[#d6ad60]"
              placeholder="+91 98765 43210"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Location / Availability
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700/80 text-sm focus:outline-none focus:border-[#d6ad60]"
              placeholder="Kolkata, India (Remote Available)"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
            CV Professional Summary / Bio
          </label>
          <textarea
            rows={3}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700/80 text-sm focus:outline-none focus:border-[#d6ad60]"
            placeholder="Brief, elegant summary of your capabilities and background..."
          />
        </div>
      </form>

      {/* ========================================================================= */}
      {/* 4. CORE SKILLS / COMPETENCIES CHIPS */}
      {/* ========================================================================= */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#12100e] border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-neutral-900 dark:text-white">
            Core Competencies & Skills
          </h3>
          <p className="text-xs text-neutral-500 font-light mt-0.5">
            Add or manage skills badges displayed inside the public CV view:
          </p>
        </div>

        {/* Add Skill Form */}
        <form onSubmit={handleAddSkill} className="flex gap-2 max-w-md">
          <input
            type="text"
            value={newSkillInput}
            onChange={(e) => setNewSkillInput(e.target.value)}
            placeholder="e.g. Brand Identity, Web Design, Figma..."
            className="flex-1 px-3.5 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700/80 text-xs focus:outline-none focus:border-[#d6ad60]"
          />
          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90 transition-opacity cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </form>

        {/* Skill Chips List */}
        <div className="flex flex-wrap gap-2 pt-1">
          {cvData.skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800/80 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 group hover:border-[#d6ad60] transition-colors"
            >
              <span>{skill}</span>
              <button
                type="button"
                onClick={() => {
                  removeCVSkill(skill);
                  onShowToast(`Removed skill "${skill}"`);
                }}
                className="text-neutral-400 hover:text-red-500 transition-colors cursor-pointer"
                title={`Delete ${skill}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
          {cvData.skills.length === 0 && (
            <p className="text-xs text-neutral-400 italic">No skills added yet.</p>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. KEY HIGHLIGHTS / BULLET POINTS */}
      {/* ========================================================================= */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#12100e] border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-neutral-900 dark:text-white">
            Key Highlights & Achievements
          </h3>
          <p className="text-xs text-neutral-500 font-light mt-0.5">
            Display your major milestones and focal specialties in crisp bullet points:
          </p>
        </div>

        {/* Add Highlight Form */}
        <form onSubmit={handleAddHighlight} className="flex gap-2">
          <input
            type="text"
            value={newHighlightInput}
            onChange={(e) => setNewHighlightInput(e.target.value)}
            placeholder="Add an achievement (e.g. 4+ years crafting visual identities and modern websites)..."
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700/80 text-xs focus:outline-none focus:border-[#d6ad60]"
          />
          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#d6ad60] text-neutral-950 hover:bg-[#c5a059] transition-colors cursor-pointer shadow-xs whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Highlight</span>
          </button>
        </form>

        {/* Highlight List */}
        <div className="space-y-2 pt-1">
          {cvData.highlights.map((hl) => (
            <div 
              key={hl.id} 
              className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-3 text-xs"
            >
              {editingHighlightId === hl.id ? (
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="text"
                    value={editingHighlightText}
                    onChange={(e) => setEditingHighlightText(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-xs focus:outline-none focus:border-[#d6ad60]"
                  />
                  <button
                    type="button"
                    onClick={() => handleSaveHighlightEdit(hl.id)}
                    className="p-1.5 rounded-lg bg-[#d6ad60] text-neutral-950 hover:bg-[#c5a059] transition-colors cursor-pointer"
                    title="Save"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingHighlightId(null)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-white transition-colors cursor-pointer"
                    title="Cancel"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2.5 text-neutral-700 dark:text-neutral-300">
                    <CheckCircle2 className="w-4 h-4 text-[#d6ad60] flex-shrink-0" />
                    <span>{hl.text}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingHighlightId(hl.id);
                        setEditingHighlightText(hl.text);
                      }}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-[#d6ad60] transition-colors cursor-pointer"
                      title="Edit highlight"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        deleteCVHighlight(hl.id);
                        onShowToast('Highlight deleted.');
                      }}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 transition-colors cursor-pointer"
                      title="Delete highlight"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
          {cvData.highlights.length === 0 && (
            <p className="text-xs text-neutral-400 italic">No highlights added.</p>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 6. WORK EXPERIENCE HISTORY */}
      {/* ========================================================================= */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#12100e] border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#d6ad60]" />
              <span>Experience & Roles</span>
            </h3>
            <p className="text-xs text-neutral-500 font-light mt-0.5">
              Curate your career timeline and past positions for the public popup:
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setEditingExpId(null);
              setExpRole('');
              setExpCompany('');
              setExpPeriod('');
              setExpDesc('');
              setIsAddingExp(!isAddingExp);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90 transition-opacity cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAddingExp ? 'Cancel' : 'Add Role'}</span>
          </button>
        </div>

        {/* Add/Edit Experience Form */}
        {isAddingExp && (
          <form onSubmit={handleSaveExp} className="p-4 rounded-xl border border-[#d6ad60]/50 bg-[#d6ad60]/5 space-y-3">
            <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
              {editingExpId ? 'Edit Experience' : 'New Experience Position'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                  Job Role / Title *
                </label>
                <input
                  type="text"
                  value={expRole}
                  onChange={(e) => setExpRole(e.target.value)}
                  placeholder="Lead Graphic Designer & Web Builder"
                  className="w-full px-3 py-2 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs focus:outline-none focus:border-[#d6ad60]"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                  Company / Organization *
                </label>
                <input
                  type="text"
                  value={expCompany}
                  onChange={(e) => setExpCompany(e.target.value)}
                  placeholder="Creative Studio / Freelance"
                  className="w-full px-3 py-2 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs focus:outline-none focus:border-[#d6ad60]"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                  Timeline / Period
                </label>
                <input
                  type="text"
                  value={expPeriod}
                  onChange={(e) => setExpPeriod(e.target.value)}
                  placeholder="2023 — Present"
                  className="w-full px-3 py-2 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs focus:outline-none focus:border-[#d6ad60]"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                Role Description / Core Responsibilities
              </label>
              <textarea
                rows={2}
                value={expDesc}
                onChange={(e) => setExpDesc(e.target.value)}
                placeholder="Brief summary of duties and deliverables..."
                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs focus:outline-none focus:border-[#d6ad60]"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddingExp(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-500 hover:text-neutral-800 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-[#d6ad60] text-neutral-950 hover:bg-[#c5a059] transition-colors cursor-pointer"
              >
                {editingExpId ? 'Update Role' : 'Save Role'}
              </button>
            </div>
          </form>
        )}

        {/* Experience List */}
        <div className="space-y-3">
          {cvData.experiences.map((exp) => (
            <div 
              key={exp.id} 
              className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 flex items-start justify-between gap-4"
            >
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-neutral-900 dark:text-white">{exp.role}</span>
                  <span className="text-neutral-400">•</span>
                  <span className="text-[#d6ad60] font-medium">{exp.company}</span>
                  <span className="text-neutral-400">•</span>
                  <span className="text-neutral-500 font-mono text-[11px]">{exp.period}</span>
                </div>
                {exp.description && (
                  <p className="text-neutral-600 dark:text-neutral-400 font-light text-xs leading-relaxed">
                    {exp.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => handleEditExp(exp)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-[#d6ad60] transition-colors cursor-pointer"
                  title="Edit"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    deleteCVExperience(exp.id);
                    onShowToast('Experience removed.');
                  }}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 transition-colors cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
          {cvData.experiences.length === 0 && (
            <p className="text-xs text-neutral-400 italic">No experience entries listed.</p>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 7. EDUCATION HISTORY */}
      {/* ========================================================================= */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#12100e] border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#d6ad60]" />
              <span>Education & Qualifications</span>
            </h3>
            <p className="text-xs text-neutral-500 font-light mt-0.5">
              Optional: Highlight academic degrees, credentials, or specialized certifications:
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setEditingEduId(null);
              setEduDegree('');
              setEduInstitution('');
              setEduYear('');
              setIsAddingEdu(!isAddingEdu);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-neutral-300 dark:border-neutral-700 hover:border-[#d6ad60] transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAddingEdu ? 'Cancel' : 'Add Education'}</span>
          </button>
        </div>

        {isAddingEdu && (
          <form onSubmit={handleSaveEdu} className="p-4 rounded-xl border border-[#d6ad60]/50 bg-[#d6ad60]/5 space-y-3">
            <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
              {editingEduId ? 'Edit Education' : 'New Education Entry'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                  Degree / Certificate *
                </label>
                <input
                  type="text"
                  value={eduDegree}
                  onChange={(e) => setEduDegree(e.target.value)}
                  placeholder="B.Sc. in Computer Applications"
                  className="w-full px-3 py-2 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs focus:outline-none focus:border-[#d6ad60]"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                  Institution / Board *
                </label>
                <input
                  type="text"
                  value={eduInstitution}
                  onChange={(e) => setEduInstitution(e.target.value)}
                  placeholder="University / Academy"
                  className="w-full px-3 py-2 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs focus:outline-none focus:border-[#d6ad60]"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                  Graduation Year
                </label>
                <input
                  type="text"
                  value={eduYear}
                  onChange={(e) => setEduYear(e.target.value)}
                  placeholder="2021"
                  className="w-full px-3 py-2 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs focus:outline-none focus:border-[#d6ad60]"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddingEdu(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-500 hover:text-neutral-800 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-[#d6ad60] text-neutral-950 hover:bg-[#c5a059] transition-colors cursor-pointer"
              >
                {editingEduId ? 'Update Education' : 'Save Education'}
              </button>
            </div>
          </form>
        )}

        <div className="space-y-2">
          {cvData.education.map((edu) => (
            <div 
              key={edu.id} 
              className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold text-neutral-900 dark:text-white">{edu.degree}</span>
                <span className="text-neutral-400">•</span>
                <span className="text-neutral-600 dark:text-neutral-400">{edu.institution}</span>
                <span className="text-neutral-400">•</span>
                <span className="text-neutral-400 font-mono text-[11px]">{edu.year}</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleEditEdu(edu)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-[#d6ad60] transition-colors cursor-pointer"
                  title="Edit"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    deleteCVEducation(edu.id);
                    onShowToast('Education removed.');
                  }}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 transition-colors cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
          {cvData.education.length === 0 && (
            <p className="text-xs text-neutral-400 italic">No education entries listed.</p>
          )}
        </div>
      </div>
    </div>
  );
};
