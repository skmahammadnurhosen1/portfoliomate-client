import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Palette, 
  Globe 
} from 'lucide-react';
import { Project } from '../../types';
import { uploadApi, getAssetUrl } from '../../api/client';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingProject: Project | null;
  onSave: (payload: any) => Promise<void>;
  onShowToast: (msg: string) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  editingProject,
  onSave,
  onShowToast,
}) => {
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
  const [formClientName, setFormClientName] = useState('');
  const [formDeliverables, setFormDeliverables] = useState('');
  const [formDesignTools, setFormDesignTools] = useState<string[]>([]);
  const [designToolInput, setDesignToolInput] = useState('');
  const [formBehanceUrl, setFormBehanceUrl] = useState('');
  const [formDimensions, setFormDimensions] = useState('');
  const [formFeatured, setFormFeatured] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    if (editingProject) {
      setFormTitle(editingProject.title || '');
      setFormSubtitle(editingProject.subtitle || '');
      setFormCategory(editingProject.category || 'web-building');
      setFormYear(editingProject.year || '');
      setFormDescription(editingProject.description || '');
      setFormImage(editingProject.image || '');
      setFormRole(editingProject.role || '');
      setFormStatus(editingProject.status || '');
      setFormRating(editingProject.rating || '');
      setFormDuration(editingProject.duration || '');
      setFormRate(editingProject.rate || '');
      setFormTechTags(editingProject.techStack || []);
      setTagInput('');
      setFormDemoUrl(editingProject.demoUrl || '');
      setFormGithubUrl(editingProject.githubUrl || '');
      setFormClientName(editingProject.clientName || '');
      setFormDeliverables(editingProject.deliverables || '');
      setFormDesignTools(editingProject.designTools || (editingProject.category === 'graphic-design' ? editingProject.techStack : []));
      setDesignToolInput('');
      setFormBehanceUrl(editingProject.behanceUrl || '');
      setFormDimensions(editingProject.dimensions || '');
      setFormFeatured(editingProject.featured || false);
    } else {
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
    }
  }, [isOpen, editingProject]);

  if (!isOpen) return null;

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        onShowToast('Please select a valid image file (JPG, PNG, WebP).');
        return;
      }
      uploadApi.uploadImage(file)
        .then((res) => {
          if (res.url) {
            setFormImage(res.url);
            onShowToast('Image uploaded and saved to server successfully!');
          }
        })
        .catch((err) => {
          console.warn('[ProjectModal] Server image upload failed, fallback to data url:', err);
          const reader = new FileReader();
          reader.onload = (uploadEvent) => {
            const result = uploadEvent.target?.result as string;
            if (result) {
              setFormImage(result);
              onShowToast('Image loaded successfully.');
            }
          };
          reader.readAsDataURL(file);
        });
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formTechTags.includes(tagInput.trim())) {
      setFormTechTags([...formTechTags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormTechTags(formTechTags.filter(t => t !== tagToRemove));
  };

  const handleAddDesignTool = () => {
    if (designToolInput.trim() && !formDesignTools.includes(designToolInput.trim())) {
      setFormDesignTools([...formDesignTools, designToolInput.trim()]);
      setDesignToolInput('');
    }
  };

  const handleRemoveDesignTool = (toolToRemove: string) => {
    setFormDesignTools(formDesignTools.filter(t => t !== toolToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      onShowToast('Project title is required.');
      return;
    }
    if (!formImage.trim()) {
      onShowToast('Please upload or provide a project cover image.');
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

    setIsSubmitting(true);
    try {
      await onSave(projectPayload);
      onClose();
    } catch (err: any) {
      onShowToast(err?.message || 'Failed to save project.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8 rounded-2xl bg-white dark:bg-[#141210] border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
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
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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
              Upload a clean horizontal photo directly from your device gallery or storage.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageFileChange}
              className="hidden"
            />

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
                    className="px-3.5 py-1.5 rounded-lg bg-white text-black text-xs font-outfit font-bold hover:bg-neutral-200 transition-colors flex items-center gap-1.5 cursor-pointer"
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

          {formCategory === 'graphic-design' ? (
            <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/[0.03] space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-amber-500/10 text-[#d6ad60]">
                <Palette className="w-4 h-4" />
                <span className="text-xs font-outfit font-bold uppercase tracking-wider">
                  Graphic Design Specific Details
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-outfit font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                    Client / Brand Name
                  </label>
                  <input
                    type="text"
                    value={formClientName}
                    onChange={(e) => setFormClientName(e.target.value)}
                    placeholder="e.g. Apex Luxury Co."
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
                    placeholder="e.g. 300 DPI CMYK, A4 Vector"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700/80 text-sm focus:outline-none focus:border-[#d6ad60]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-outfit font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                  Deliverables & Scope
                </label>
                <input
                  type="text"
                  value={formDeliverables}
                  onChange={(e) => setFormDeliverables(e.target.value)}
                  placeholder="e.g. Logo Identity, Typography, Packaging..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700/80 text-sm focus:outline-none focus:border-[#d6ad60]"
                />
              </div>

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
                    placeholder="e.g. Adobe Illustrator, Photoshop, Figma..."
                    className="flex-1 px-3 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none focus:border-[#d6ad60]"
                  />
                  <button
                    type="button"
                    onClick={handleAddDesignTool}
                    className="px-3.5 py-2 rounded-lg bg-[#d6ad60] text-black text-xs font-outfit font-bold hover:bg-[#c5a059] cursor-pointer"
                  >
                    Add Tool
                  </button>
                </div>

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
                        className="hover:text-red-500 ml-0.5 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

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
            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100">
                <Globe className="w-4 h-4 text-[#d6ad60]" />
                <span className="text-xs font-outfit font-bold uppercase tracking-wider">
                  Website Development Details
                </span>
              </div>

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
                    className="px-3.5 py-2 rounded-lg bg-neutral-200 dark:bg-neutral-800 text-xs font-outfit font-bold hover:bg-neutral-300 dark:hover:bg-neutral-700 cursor-pointer"
                  >
                    Add
                  </button>
                </div>

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
                        className="hover:text-red-500 ml-0.5 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

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

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-neutral-100 dark:border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-neutral-500 hover:text-neutral-900 dark:hover:text-white text-xs font-outfit cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 rounded-xl bg-[#d6ad60] hover:bg-[#c5a059] text-black font-outfit font-bold text-xs sm:text-sm transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : editingProject ? 'Save Project Changes' : 'Create & Publish Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
