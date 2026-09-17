import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutMe } from './components/AboutMe';
import { ServicesProvided } from './components/ServicesProvided';
import { Projects } from './components/Projects';
import { Skills } from './components/Skills';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { DownloadCVModal } from './components/DownloadCVModal';
import { ProjectDetailsPage } from './components/ProjectDetailsPage';
import { AdminLoginPage } from './components/AdminLoginPage';
import { usePortfolio } from './context/PortfolioContext';
import { SectionId } from './types';

export default function App() {
  const [activeSection, setActiveSection] = useState<SectionId>('home');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#project-')) {
      return hash.replace('#project-', '');
    }
    return null;
  });
  const [isAdminPage, setIsAdminPage] = useState<boolean>(() => {
    const hash = window.location.hash;
    return hash === '#admin' || hash === '#admin-login';
  });
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme_preference');
    return saved ? saved === 'dark' : false;
  });
  const [isCVModalOpen, setIsCVModalOpen] = useState(false);

  // Sync hash with selected project or admin page for browser history support
  useEffect(() => {
    if (isAdminPage) {
      window.location.hash = 'admin';
    } else if (selectedProjectId) {
      window.location.hash = `project-${selectedProjectId}`;
    } else if (
      window.location.hash.startsWith('#project-') || 
      window.location.hash === '#admin' || 
      window.location.hash === '#admin-login'
    ) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, [isAdminPage, selectedProjectId]);

  // Listen to browser back/forward buttons
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#admin' || hash === '#admin-login') {
        setIsAdminPage(true);
        setSelectedProjectId(null);
      } else if (hash.startsWith('#project-')) {
        setIsAdminPage(false);
        setSelectedProjectId(hash.replace('#project-', ''));
      } else {
        setIsAdminPage(false);
        setSelectedProjectId(null);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
      document.body.style.backgroundColor = '#090807';
      document.body.style.color = '#f4ece1';
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      document.body.style.backgroundColor = '#faf8f5';
      document.body.style.color = '#191614';
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem('theme_preference', next ? 'dark' : 'light');
      return next;
    });
  };

  const handleNavigate = (section: SectionId) => {
    setSelectedProjectId(null);
    setIsAdminPage(false);
    setActiveSection(section);
    // Ensure overflow is not locked by any modal or mobile drawer
    document.body.style.overflow = '';
    
    requestAnimationFrame(() => {
      setTimeout(() => {
        const element = document.getElementById(section);
        if (element) {
          const navHeight = 75;
          const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - navHeight;
          window.scrollTo({
            top: targetPosition > 0 ? targetPosition : 0,
            behavior: 'smooth',
          });
        }
      }, 50);
    });
  };

  const handleBackToProjects = () => {
    setSelectedProjectId(null);
    setIsAdminPage(false);
    requestAnimationFrame(() => {
      setTimeout(() => {
        const element = document.getElementById('projects');
        if (element) {
          const navHeight = 75;
          const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - navHeight;
          window.scrollTo({
            top: targetPosition > 0 ? targetPosition : 0,
            behavior: 'smooth',
          });
        }
      }, 60);
    });
  };

  const { projects } = usePortfolio();

  const activeProject = selectedProjectId
    ? projects.find((p) => p.id === selectedProjectId) || null
    : null;

  // Observe section scroll positions to dynamically update active navigation indicator
  useEffect(() => {
    if (selectedProjectId) return; // don't track scroll when on details page

    const sections: SectionId[] = ['home', 'about', 'services', 'skills', 'projects', 'contact'];

    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const secId = sections[i];
        const el = document.getElementById(secId);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(secId);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [selectedProjectId]);

  return (
    <div
      id="app-root-container"
      className={`w-full min-h-screen flex flex-col items-center transition-colors duration-300 ${
        isDark
          ? 'dark bg-[#090807] text-[#f4ece1]'
          : 'bg-[#faf8f5] text-[#191614]'
      }`}
    >
      {/* Top Fixed Header */}
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onOpenCVModal={() => setIsCVModalOpen(true)}
        isSubpage={!!activeProject || isAdminPage}
      />

      {/* Main Content: Admin Login Page OR Dedicated Project Details Page OR Full Portfolio */}
      {isAdminPage ? (
        <div className="w-full pt-16 sm:pt-20">
          <AdminLoginPage
            onBack={() => {
              setIsAdminPage(false);
              window.history.replaceState(null, '', window.location.pathname + window.location.search);
            }}
            onNavigateHome={() => handleNavigate('home')}
          />
        </div>
      ) : activeProject ? (
        <div className="w-full pt-16 sm:pt-20">
          <ProjectDetailsPage
            project={activeProject}
            onBack={handleBackToProjects}
            onSelectProject={(id) => setSelectedProjectId(id)}
            onNavigateContact={() => handleNavigate('contact')}
            onOpenCVModal={() => setIsCVModalOpen(true)}
          />
        </div>
      ) : (
        <main id="main-content" className="w-full flex flex-col items-center">
          {/* Hero Section */}
          <Hero
            onNavigate={handleNavigate}
            activeSection={activeSection}
            onOpenCVModal={() => setIsCVModalOpen(true)}
          />

          {/* 02 / About Me Section */}
          <AboutMe
            onNavigate={handleNavigate}
            onOpenCVModal={() => setIsCVModalOpen(true)}
          />

          {/* 03 / Services Provided By Me */}
          <ServicesProvided onNavigate={handleNavigate} />

          {/* 04 / Technical Capabilities & Skills */}
          <Skills />

          {/* 05 / Selected Works & Projects */}
          <Projects onSelectProject={(projectId) => setSelectedProjectId(projectId)} />

          {/* 06 / Contact & Collaboration */}
          <Contact />
        </main>
      )}

      {/* Footer */}
      <Footer 
        onNavigate={handleNavigate} 
        onOpenAdmin={() => {
          setIsAdminPage(true);
          setSelectedProjectId(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Download CV Modal */}
      <DownloadCVModal
        isOpen={isCVModalOpen}
        onClose={() => setIsCVModalOpen(false)}
      />
    </div>
  );
}
