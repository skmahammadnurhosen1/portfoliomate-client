import React, { useState } from 'react';
import { ShieldCheck, Eye, EyeOff, KeyRound } from 'lucide-react';
import { AdminUser, authApi } from '../../api/client';

interface SecurityTabProps {
  adminUser?: AdminUser | null;
  onShowToast: (msg: string) => void;
}

export const SecurityTab: React.FC<SecurityTabProps> = ({ adminUser, onShowToast }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      onShowToast('Please fill in all password fields.');
      return;
    }
    if (newPassword.length < 8) {
      onShowToast('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      onShowToast('New passwords do not match.');
      return;
    }
    setIsChangingPassword(true);
    try {
      await authApi.changePassword({ currentPassword, newPassword });
      onShowToast('Password updated successfully in database!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      onShowToast(err.message || 'Failed to update password.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
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
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
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
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
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
              minLength={8}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs sm:text-sm focus:outline-none focus:border-[#d6ad60]"
            />
          </div>

          <button
            type="submit"
            disabled={isChangingPassword}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#d6ad60] hover:bg-[#c5a059] text-black font-outfit font-bold text-xs sm:text-sm transition-all shadow-sm cursor-pointer disabled:opacity-50"
          >
            <KeyRound className="w-4 h-4" />
            <span>{isChangingPassword ? 'Updating Password...' : 'Save New Password'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
