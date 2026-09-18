import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  Mail, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  FileText,
  Sparkles,
  Check,
  Copy,
  Briefcase,
  GraduationCap,
  ExternalLink
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { cvApi, getAssetUrl } from '../api/client';

interface DownloadCVModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadCVModal: React.FC<DownloadCVModalProps> = ({ isOpen, onClose }) => {
  const { cvData, personalInfo } = usePortfolio();
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const displayName = cvData.fullName || personalInfo.name || 'NOOR HOSEN';
  const displayTitle = cvData.title || personalInfo.title || 'Graphic Designer & Website Builder';
  const displayEmail = cvData.email || personalInfo.email || 'skmahammadnurhosen1@gmail.com';
  const displayPhone = cvData.phone || personalInfo.phone || '+91 98765 43210';
  const displayLocation = cvData.location || personalInfo.location || 'Kolkata, India';

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (displayEmail) {
      navigator.clipboard.writeText(displayEmail);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadCV = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    // If the admin has uploaded a custom PDF, download it reliably via blob fetch
    if (cvData.customPdfUrl) {
      setIsDownloading(true);
      try {
        await cvApi.downloadPdf(cvData.customPdfFileName || `${displayName.replace(/\s+/g, '_')}_CV.pdf`);
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 3000);
      } catch (err) {
        console.warn('[CV Modal] Direct blob download failed, opening direct URL in new tab:', err);
        const safeUrl = getAssetUrl(cvData.customPdfUrl);
        window.open(safeUrl, '_blank', 'noopener,noreferrer');
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 3000);
      } finally {
        setIsDownloading(false);
      }
      return;
    }

    // Fallback: Generate a clean formatted text document of all current CV details
    const textContent = `
================================================================================
${displayName.toUpperCase()}
${displayTitle}
================================================================================
Email:    ${displayEmail}
Phone:    ${displayPhone}
Location: ${displayLocation}
Status:   ${cvData.statusBadge || 'Available for Projects & Full-time'}

--------------------------------------------------------------------------------
PROFESSIONAL SUMMARY
--------------------------------------------------------------------------------
${cvData.summary || personalInfo.bio || ''}

--------------------------------------------------------------------------------
CORE COMPETENCIES & SKILLS
--------------------------------------------------------------------------------
${cvData.skills.map(s => `• ${s}`).join('\n')}

--------------------------------------------------------------------------------
KEY HIGHLIGHTS & ACHIEVEMENTS
--------------------------------------------------------------------------------
${cvData.highlights.map(h => `• ${h.text}`).join('\n')}

${cvData.experiences.length > 0 ? `
--------------------------------------------------------------------------------
WORK EXPERIENCE
--------------------------------------------------------------------------------
${cvData.experiences.map(e => `[${e.period}] ${e.role} — ${e.company}\n${e.description ? `  ${e.description}\n` : ''}`).join('\n')}
` : ''}

${cvData.education.length > 0 ? `
--------------------------------------------------------------------------------
EDUCATION & QUALIFICATIONS
--------------------------------------------------------------------------------
${cvData.education.map(ed => `• ${ed.degree} — ${ed.institution} (${ed.year})`).join('\n')}
` : ''}
================================================================================
`.trim();

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.download = `${displayName.replace(/\s+/g, '_')}_Resume.txt`;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      if (document.body.contains(link)) {
        document.body.removeChild(link);
      }
      URL.revokeObjectURL(url);
    }, 2000);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  // Extract initials for the luxury monogram
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'NH';

  return (
    <div
      id="cv-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        id="cv-modal-container"
        className="bg-[#fcfbf9] dark:bg-[#110f0d] border border-neutral-200/90 dark:border-[#d6ad60]/30 rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-hidden shadow-2xl relative flex flex-col text-neutral-800 dark:text-neutral-200 transition-colors"
      >
        {/* Top Minimal Action Bar */}
        <div className="bg-white/90 dark:bg-[#161412]/90 backdrop-blur-md border-b border-neutral-200/80 dark:border-neutral-800/80 px-6 py-3.5 flex items-center justify-between z-10 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#d6ad60]" />
            <span className="font-outfit text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
              Curriculum Vitae • Profile Overview
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/80 transition-colors cursor-pointer"
              title="Print CV or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5 text-[#d6ad60]" />
              <span className="hidden sm:inline">Print / Save PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/80 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Minimalist Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-7 text-neutral-800 dark:text-neutral-200">
          
          {/* Header Card with Monogram & Personal Branding */}
          <div className="border-b border-neutral-200/80 dark:border-neutral-800/80 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
              <div className="flex items-start gap-4">
                {/* Minimal Luxury Monogram Badge */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#d6ad60]/20 to-[#c5a059]/5 border border-[#d6ad60]/30 flex items-center justify-center flex-shrink-0 text-[#d6ad60] font-serif-luxury font-bold text-lg tracking-wider shadow-inner">
                  {initials}
                </div>

                <div>
                  <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-[#f4ece1]">
                    {displayName}
                  </h1>
                  <p className="text-xs sm:text-sm font-outfit font-medium text-[#c5a059] dark:text-[#d6ad60] uppercase tracking-wider mt-0.5">
                    {displayTitle}
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              {cvData.statusBadge && (
                <div className="self-start sm:self-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#d6ad60]/10 border border-[#d6ad60]/30 text-[#b58b3c] dark:text-[#d6ad60]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d6ad60] animate-pulse" />
                    <span>{cvData.statusBadge}</span>
                  </span>
                </div>
              )}
            </div>

            {/* Contact Pills */}
            {cvData.showContact && (
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 mt-5 pt-4 border-t border-neutral-200/60 dark:border-neutral-800/60 text-xs text-neutral-600 dark:text-neutral-400 font-light">
                {displayEmail && (
                  <div className="flex items-center gap-1.5 group">
                    <a 
                      href={`mailto:${displayEmail}`}
                      className="flex items-center gap-1.5 hover:text-[#d6ad60] transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5 text-[#d6ad60]" />
                      <span>{displayEmail}</span>
                    </a>
                    <button
                      onClick={handleCopyEmail}
                      className="p-1 rounded text-neutral-400 hover:text-neutral-700 dark:hover:text-white transition-colors cursor-pointer"
                      title="Copy Email"
                    >
                      {copiedEmail ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                )}

                {displayPhone && (
                  <a 
                    href={`tel:${displayPhone}`}
                    className="flex items-center gap-1.5 hover:text-[#d6ad60] transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#d6ad60]" />
                    <span>{displayPhone}</span>
                  </a>
                )}

                {displayLocation && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#d6ad60]" />
                    <span>{displayLocation}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Two-Column Minimalist Grid Layout on Medium/Large Screens */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
            
            {/* Left Column (Bio, Skills, Education) - 5 Cols */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Professional Summary */}
              {cvData.showSummary && cvData.summary && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d6ad60]" />
                    <h2 className="text-[11px] font-bold tracking-widest text-[#c5a059] dark:text-[#d6ad60] uppercase font-outfit">
                      About & Philosophy
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed font-light pl-3 border-l-2 border-[#d6ad60]/30">
                    {cvData.summary}
                  </p>
                </div>
              )}

              {/* Core Competencies & Skills */}
              {cvData.showSkills && cvData.skills.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#d6ad60]" />
                    <h2 className="text-[11px] font-bold tracking-widest text-[#c5a059] dark:text-[#d6ad60] uppercase font-outfit">
                      Core Competencies
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {cvData.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-white dark:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 shadow-2xs hover:border-[#d6ad60] transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Education & Qualifications */}
              {cvData.showEducation && cvData.education.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-[#d6ad60]" />
                    <h2 className="text-[11px] font-bold tracking-widest text-[#c5a059] dark:text-[#d6ad60] uppercase font-outfit">
                      Education & Degrees
                    </h2>
                  </div>
                  <div className="space-y-2 text-xs">
                    {cvData.education.map((edu) => (
                      <div 
                        key={edu.id} 
                        className="p-3 rounded-xl bg-white dark:bg-neutral-900/40 border border-neutral-200/70 dark:border-neutral-800/70 space-y-0.5"
                      >
                        <div className="font-semibold text-neutral-900 dark:text-white">
                          {edu.degree}
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
                          <span>{edu.institution}</span>
                          <span className="font-mono text-[#d6ad60]">{edu.year}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Right Column (Highlights & Work Experience Timeline) - 7 Cols */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Key Highlights & Achievements */}
              {cvData.showHighlights && cvData.highlights.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#d6ad60]" />
                    <h2 className="text-[11px] font-bold tracking-widest text-[#c5a059] dark:text-[#d6ad60] uppercase font-outfit">
                      Key Highlights & Impact
                    </h2>
                  </div>
                  <div className="space-y-2 text-xs">
                    {cvData.highlights.map((hl) => (
                      <div 
                        key={hl.id} 
                        className="flex items-start gap-2.5 p-3 rounded-xl bg-white dark:bg-neutral-900/40 border border-neutral-200/70 dark:border-neutral-800/70 text-neutral-700 dark:text-neutral-300"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#d6ad60] flex-shrink-0 mt-1.5" />
                        <span className="font-light leading-relaxed">{hl.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Work Experience Timeline */}
              {cvData.showExperience && cvData.experiences.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-[#d6ad60]" />
                    <h2 className="text-[11px] font-bold tracking-widest text-[#c5a059] dark:text-[#d6ad60] uppercase font-outfit">
                      Experience & Career History
                    </h2>
                  </div>

                  <div className="space-y-3.5 relative before:absolute before:top-2 before:bottom-2 before:left-[7px] before:w-[1.5px] before:bg-neutral-200 dark:before:bg-neutral-800">
                    {cvData.experiences.map((exp) => (
                      <div 
                        key={exp.id} 
                        className="relative pl-6 space-y-1 text-xs"
                      >
                        {/* Timeline dot marker */}
                        <div className="absolute left-0 top-1 w-3.5 h-3.5 rounded-full border-2 border-[#d6ad60] bg-white dark:bg-[#110f0d]" />

                        <div className="flex items-center justify-between flex-wrap gap-1">
                          <span className="font-semibold text-neutral-900 dark:text-white text-sm">
                            {exp.role}
                          </span>
                          <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-[#d6ad60]/10 text-[#b58b3c] dark:text-[#d6ad60]">
                            {exp.period}
                          </span>
                        </div>

                        <div className="text-xs text-[#c5a059] dark:text-[#d6ad60] font-medium">
                          {exp.company}
                        </div>

                        {exp.description && (
                          <p className="text-xs text-neutral-600 dark:text-neutral-400 font-light leading-relaxed pt-1">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

        {/* Modal Bottom Action Bar */}
        <div className="bg-white dark:bg-[#161412] border-t border-neutral-200/80 dark:border-neutral-800/80 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 z-10 flex-shrink-0">
          <div className="text-xs text-neutral-500 font-light flex items-center gap-2">
            {cvData.customPdfUrl ? (
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                <FileText className="w-4 h-4" />
                <span>Original PDF Available ({cvData.customPdfFileSize || 'Document'})</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400">
                <Sparkles className="w-3.5 h-3.5 text-[#d6ad60]" />
                <span>Verified Clean Curriculum Vitae</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Close
            </button>

            {cvData.customPdfUrl && (
              <a
                href={getAssetUrl(cvData.customPdfUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2.5 rounded-xl text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Open PDF directly in a new tab"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#d6ad60]" />
                <span>Open in Tab</span>
              </a>
            )}

            <button
              type="button"
              onClick={(e) => handleDownloadCV(e)}
              disabled={isDownloading}
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold bg-[#d6ad60] text-neutral-950 hover:bg-[#c5a059] transition-all cursor-pointer shadow-md hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isDownloading ? (
                <>
                  <Download className="w-4 h-4 animate-bounce" />
                  <span>Preparing Download...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-950" />
                  <span>Downloaded Successfully!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>{cvData.customPdfUrl ? 'Download Official PDF' : 'Download CV'}</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
