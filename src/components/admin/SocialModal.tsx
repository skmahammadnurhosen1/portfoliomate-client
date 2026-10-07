import React from 'react';
import { X } from 'lucide-react';
import { SocialLinkItem } from '../../types';

interface SocialModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingSocialId: string | null;
  socialPlatform: SocialLinkItem['platform'];
  setSocialPlatform: (platform: SocialLinkItem['platform']) => void;
  socialUrl: string;
  setSocialUrl: (url: string) => void;
  socialLabel: string;
  setSocialLabel: (label: string) => void;
  onSave: (e: React.FormEvent) => void;
  platformConfig: Record<string, { label: string; icon: React.FC<{ className?: string }> }>;
}

export const SocialModal: React.FC<SocialModalProps> = ({
  isOpen,
  onClose,
  editingSocialId,
  socialPlatform,
  setSocialPlatform,
  socialUrl,
  setSocialUrl,
  socialLabel,
  setSocialLabel,
  onSave,
  platformConfig,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-[#141210] border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-100 dark:border-neutral-800">
          <h3 className="text-base font-outfit font-bold text-neutral-900 dark:text-white">
            {editingSocialId ? 'Edit Social Channel' : 'Add Social Channel'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={onSave} className="space-y-4">
          <div>
            <label className="block text-xs font-outfit font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5">
              Choose Platform
            </label>
            <select
              value={socialPlatform}
              onChange={(e) => setSocialPlatform(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700/80 text-sm focus:outline-none focus:border-[#d6ad60]"
            >
              {(Object.entries(platformConfig) as [string, { label: string }][]).map(([key, val]) => (
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
              placeholder={platformConfig[socialPlatform]?.label || 'Profile'}
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
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-neutral-500 hover:text-neutral-900 dark:hover:text-white text-xs font-outfit cursor-pointer"
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
  );
};
