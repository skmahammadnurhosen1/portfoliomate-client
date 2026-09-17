import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  AlertCircle, 
  Shield 
} from 'lucide-react';
import { AdminDashboard } from './admin/AdminDashboard';
import { authApi, AdminUser } from '../api/client';
import { usePortfolio } from '../context/PortfolioContext';

interface AdminLoginPageProps {
  onBack: () => void;
  onNavigateHome: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onBack, onNavigateHome }) => {
  const { loadAdminProjects, fetchMessages } = usePortfolio();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check server-side session cookie on mount
  useEffect(() => {
    let mounted = true;
    authApi.getMe()
      .then((res) => {
        if (mounted && res.success && res.admin) {
          setIsAuthenticated(true);
          setAdminUser(res.admin);
          loadAdminProjects();
          fetchMessages();
        }
      })
      .catch(() => {
        if (mounted) setIsAuthenticated(false);
      })
      .finally(() => {
        if (mounted) setIsCheckingAuth(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // Secure Server-side authentication handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please provide both email and password.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await authApi.login({
        email: email.trim(),
        password,
      });

      if (res.success && res.admin) {
        setIsAuthenticated(true);
        setAdminUser(res.admin);
        setError(null);
        await Promise.allSettled([loadAdminProjects(), fetchMessages()]);
      } else {
        setError('Authentication failed. Please verify your credentials.');
      }
    } catch (err: any) {
      console.error('[Admin Login] Authentication error:', err);
      setError(err.message || 'Invalid credentials or connection error.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      console.error('[Admin Login] Logout error:', e);
    } finally {
      setIsAuthenticated(false);
      setAdminUser(null);
      setEmail('');
      setPassword('');
      setError(null);
    }
  };

  // While validating session with backend
  if (isCheckingAuth) {
    return (
      <div className="w-full min-h-[90vh] flex flex-col items-center justify-center bg-[#faf8f5] dark:bg-[#090807] transition-colors duration-300">
        <div className="w-8 h-8 border-2 border-[#d6ad60] border-t-transparent rounded-full animate-spin mb-3" />
        <span className="font-outfit text-xs text-neutral-500 dark:text-neutral-400">
          Verifying security session...
        </span>
      </div>
    );
  }

  // If authenticated, render Admin Dashboard
  if (isAuthenticated) {
    return (
      <div className="w-full min-h-[90vh] bg-[#faf8f5] dark:bg-[#090807] transition-colors duration-300">
        <AdminDashboard 
          onBackToPortfolio={onBack} 
          onSignOut={handleLogout} 
          adminUser={adminUser}
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-[90vh] w-full flex flex-col items-center justify-center px-4 sm:px-6 py-12 bg-[#faf8f5] dark:bg-[#090807] text-neutral-900 dark:text-[#f4ece1] transition-colors duration-300">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 sm:w-[480px] h-96 bg-amber-500/5 dark:bg-[#d6ad60]/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Top Floating Back Bar */}
      <div className="w-full max-w-md mb-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-outfit font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer py-1.5 px-3 rounded-lg hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Portfolio</span>
        </button>

        <span className="text-[11px] font-outfit font-medium text-neutral-400 dark:text-neutral-500 flex items-center gap-1.5">
          <Shield className="w-3 h-3 text-[#d6ad60]" />
          <span>Protected Area</span>
        </span>
      </div>

      {/* Admin Login Form */}
      <div className="w-full max-w-md p-7 sm:p-9 rounded-3xl bg-white dark:bg-[#12100e] border border-neutral-200/90 dark:border-neutral-800/90 shadow-[0_16px_50px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.5)] flex flex-col">
          
          {/* Header & Lock Icon */}
          <div className="flex flex-col items-center text-center mb-7">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/25 text-[#d6ad60] flex items-center justify-center mb-3.5 shadow-xs">
              <Lock className="w-5 h-5" />
            </div>

            <h1 className="font-outfit font-extrabold text-2xl sm:text-3xl text-neutral-900 dark:text-white tracking-tight">
              Admin Portal
            </h1>
            <p className="font-sans text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1.5 font-light max-w-xs">
              Authenticate with your authorized credentials to access content management.
            </p>
          </div>

          {/* Error Message Box */}
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 flex items-center gap-2.5 text-xs font-outfit">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label 
                htmlFor="admin-email" 
                className="block font-outfit text-xs font-bold text-neutral-700 dark:text-neutral-300"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400 dark:text-neutral-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@noor.dev"
                  autoComplete="email"
                  className="w-full pl-10 pr-3.5 py-2.5 sm:py-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white text-xs sm:text-sm font-sans placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-[#d6ad60] focus:ring-1 focus:ring-[#d6ad60] transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label 
                htmlFor="admin-password" 
                className="block font-outfit text-xs font-bold text-neutral-700 dark:text-neutral-300"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400 dark:text-neutral-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-10 py-2.5 sm:py-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white text-xs sm:text-sm font-sans placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-[#d6ad60] focus:ring-1 focus:ring-[#d6ad60] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="admin-login-submit"
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-neutral-900 hover:bg-[#c5a059] dark:bg-[#f4ece1] dark:hover:bg-[#d6ad60] text-white dark:text-[#090807] dark:hover:text-black font-outfit font-bold text-xs sm:text-sm tracking-wide transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Sign In</span>
                </>
              )}
            </button>

          </form>

        </div>

      {/* Subtle Security Badge below */}
      <div className="mt-8 text-center">
        <p className="text-[11px] font-outfit text-neutral-400 dark:text-neutral-600">
          Protected Administrative Session &bull; Server Authorization Required
        </p>
      </div>

    </div>
  );
};
