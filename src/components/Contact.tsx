import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  Check, 
  Copy, 
  ArrowRight,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { SocialIcon } from './SocialIconRenderer';
import { contactApi } from '../api/client';

export const Contact: React.FC = () => {
  const { personalInfo } = usePortfolio();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personalInfo.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.email.trim() || !formData.message.trim()) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await contactApi.submit(formData);
      setIsSubmitted(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: '',
      });
      setTimeout(() => setIsSubmitted(false), 7000);
    } catch (err: any) {
      console.error('[Contact] Error submitting form:', err);
      setErrorMessage(err.message || 'Failed to submit your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative w-full py-24 sm:py-28 md:py-36 bg-[#faf8f5] dark:bg-[#07070a] text-neutral-900 dark:text-white border-t border-neutral-200/80 dark:border-neutral-900/60 overflow-hidden flex justify-center transition-colors duration-300"
    >
      {/* Deep atmospheric ambient glow matching uploaded reference image */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 dark:opacity-100 transition-opacity">
        {/* Left deep indigo/blue ambient glow */}
        <div className="absolute top-1/2 -left-48 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-blue-600/15 blur-[140px]" />
        {/* Right deep sapphire/gold ambient glow */}
        <div className="absolute top-1/3 -right-48 w-[600px] h-[600px] rounded-full bg-indigo-500/15 blur-[150px]" />
        {/* Soft bottom misty sweep */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white/[0.07] via-white/[0.02] to-transparent pointer-events-none" />
      </div>

      <div className="w-full max-w-7xl px-6 md:px-12 lg:px-16 relative z-10">
        
        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Headline, Subtitle & Capsule Contact Pills */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#fff8e7] dark:bg-white/5 border border-[#fde8b3] dark:border-white/10 text-xs font-mono text-[#c5a059] dark:text-[#d6ad60] mb-4 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#c5a059] dark:text-[#d6ad60]" />
                <span>LET'S COLLABORATE</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem] font-bold tracking-tight text-neutral-900 dark:text-white leading-[1.15]">
                Ready to capture your vision and build your story? <br className="hidden sm:inline" />
                <span className="text-[#c5a059] dark:text-[#d6ad60]">Contact me!</span>
              </h2>

              <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base leading-relaxed mt-4 max-w-lg font-light">
                Let's discuss your project and find the perfect creative solution in graphic design and high-conversion web development.
              </p>
            </div>

            {/* Contact Pills Row 1: Email & Phone */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {/* Email Pill */}
              <a
                href={`mailto:${personalInfo.email}`}
                className="group inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white dark:bg-white/5 hover:bg-neutral-50 dark:hover:bg-white/10 border border-neutral-200 dark:border-white/15 hover:border-[#d6ad60]/70 text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 hover:text-black dark:hover:text-white shadow-xs transition-all duration-200 backdrop-blur-md cursor-pointer"
              >
                <Mail className="w-4 h-4 text-[#c5a059] dark:text-[#d6ad60]" />
                <span className="font-mono text-xs sm:text-sm">{personalInfo.email}</span>
              </a>

              {/* Phone Pill */}
              <a
                href={`tel:${personalInfo.phone || '+919876543210'}`}
                className="group inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white dark:bg-white/5 hover:bg-neutral-50 dark:hover:bg-white/10 border border-neutral-200 dark:border-white/15 hover:border-[#d6ad60]/70 text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 hover:text-black dark:hover:text-white shadow-xs transition-all duration-200 backdrop-blur-md cursor-pointer"
              >
                <Phone className="w-4 h-4 text-[#c5a059] dark:text-[#d6ad60]" />
                <span className="font-mono text-xs sm:text-sm">{personalInfo.phone || '+91 98765 43210'}</span>
              </a>
            </div>

            {/* Contact Pills Row 2: Dynamic Social Media Capsules */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {(personalInfo.socialLinks || []).map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  title={item.label}
                  className="w-11 h-10 rounded-full bg-white dark:bg-white/5 hover:bg-neutral-50 dark:hover:bg-white/10 border border-neutral-200 dark:border-white/15 hover:border-[#d6ad60]/70 flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white shadow-xs transition-all duration-200 backdrop-blur-md"
                >
                  <SocialIcon platform={item.platform} className="w-4 h-4" />
                </a>
              ))}
            </div>

            {/* Quick copy email indicator */}
            <div className="pt-2">
              <button
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 hover:text-[#c5a059] dark:hover:text-[#d6ad60] transition-colors cursor-pointer"
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">Email address copied to clipboard</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Click here to copy email address</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Frosted Glass Form Card */}
          <div className="lg:col-span-6">
            <div className="relative rounded-[28px] sm:rounded-[36px] bg-white dark:bg-white/[0.04] backdrop-blur-2xl border border-neutral-200 dark:border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)] p-6 sm:p-10">
              
              {isSubmitted ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#d6ad60]/10 border border-[#d6ad60]/40 flex items-center justify-center text-[#c5a059] dark:text-[#d6ad60] mb-2">
                    <Check className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
                    Quote Request Received!
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-300 text-sm max-w-sm font-light">
                    Thank you for reaching out. I have received your message and will reply within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 text-xs flex items-center gap-2 font-outfit">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Row 1: First Name & Last Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                        First Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        placeholder="John"
                        className="w-full px-4 py-3 rounded-xl sm:rounded-2xl bg-neutral-50 dark:bg-white/[0.06] border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 text-sm focus:outline-none focus:border-[#c5a059] dark:focus:border-[#d6ad60] focus:ring-1 focus:ring-[#c5a059] dark:focus:ring-[#d6ad60] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        placeholder="Doe"
                        className="w-full px-4 py-3 rounded-xl sm:rounded-2xl bg-neutral-50 dark:bg-white/[0.06] border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 text-sm focus:outline-none focus:border-[#c5a059] dark:focus:border-[#d6ad60] focus:ring-1 focus:ring-[#c5a059] dark:focus:ring-[#d6ad60] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Row 2: E-mail */}
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                      E-mail
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 rounded-xl sm:rounded-2xl bg-neutral-50 dark:bg-white/[0.06] border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 text-sm focus:outline-none focus:border-[#c5a059] dark:focus:border-[#d6ad60] focus:ring-1 focus:ring-[#c5a059] dark:focus:ring-[#d6ad60] transition-colors"
                    />
                  </div>

                  {/* Row 3: Phone */}
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 rounded-xl sm:rounded-2xl bg-neutral-50 dark:bg-white/[0.06] border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 text-sm focus:outline-none focus:border-[#c5a059] dark:focus:border-[#d6ad60] focus:ring-1 focus:ring-[#c5a059] dark:focus:ring-[#d6ad60] transition-colors"
                    />
                  </div>

                  {/* Row 4: Message */}
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Message
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell me about your project, timeline, and goals..."
                      className="w-full px-4 py-3 rounded-xl sm:rounded-2xl bg-neutral-50 dark:bg-white/[0.06] border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 text-sm focus:outline-none focus:border-[#c5a059] dark:focus:border-[#d6ad60] focus:ring-1 focus:ring-[#c5a059] dark:focus:ring-[#d6ad60] transition-colors resize-none"
                    />
                  </div>

                  {/* Row 5: Full-Width Solid Pill Button (Get a Quote) */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 rounded-full bg-neutral-900 text-white hover:bg-[#c5a059] hover:text-black dark:bg-white dark:text-neutral-900 dark:hover:bg-[#d6ad60] dark:hover:text-black font-bold text-sm sm:text-base transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <span>Submitting Request...</span>
                      ) : (
                        <>
                          <span>Get a Quote</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>

                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
