import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { AnimatePresence } from 'framer-motion';
import { profileData } from './data/profileData';

// ── Classic components ──────────────────────────────────────
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Certifications from './components/Certifications';
import Skills from './components/Skills';
import Achievements from './components/Achievements';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';

// ── Holo components ─────────────────────────────────────────
import SpaceCanvas from './components/canvas/SpaceCanvas';
import HoloHero     from './components/HoloHero';
import HoloProjects from './components/HoloProjects';
import HoloExperience from './components/HoloExperience';
import HoloSkills   from './components/HoloSkills';
import HoloContact  from './components/HoloContact';
import { HoloCertifications, HoloAchievements } from './components/HoloExtras';
import VirtualGuide from './components/VirtualGuide';

// ── Shared ──────────────────────────────────────────────────
import VersionSwitcher from './components/VersionSwitcher';

const SECTION_ORDER = ['projects', 'experience', 'skills', 'certifications', 'achievements', 'contact'];
const LS_KEY = 'portfolio_version';

// ══════════════════════════════════════════════════════════════
//  CLASSIC APP
// ══════════════════════════════════════════════════════════════
const ClassicApp = ({ version, onSwitch }) => {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleLocation = () => {
      const path = window.location.pathname.replace('/', '');
      if (path) {
        const el = document.getElementById(path);
        if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    handleLocation();
    window.addEventListener('popstate', handleLocation);
    return () => window.removeEventListener('popstate', handleLocation);
  }, []);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <div className="app">
      <motion.div className="progress-bar" style={{ scaleX }} />
      <Navbar theme={theme} toggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} />
      <VersionSwitcher version={version} onSwitch={onSwitch} />
      <main>
        <Hero />
        <section className="stats-strip">
          <div className="container stats-container">
            {[['5+','Years Exp'],['10+','Prod Apps'],['500K+','Downloads']].map(([n,l]) => (
              <div key={l} className="stat-item">
                <span className="stat-number">{n}</span>
                <span className="stat-label">{l}</span>
              </div>
            ))}
          </div>
        </section>
        <Experience />
        <Projects />
        <Certifications />
        <Skills />
        <Achievements />
        <Contact />
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
//  HOLO APP
// ══════════════════════════════════════════════════════════════
const HoloApp = ({ version, onSwitch }) => {
  const [activeSection, setActiveSection] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Route handling
  useEffect(() => {
    const handleLocation = () => {
      const path = window.location.pathname.replace('/', '').toLowerCase();
      if (path && SECTION_ORDER.includes(path)) {
        setActiveSection(path);
        setTimeout(() => document.getElementById(path)?.scrollIntoView({ behavior: 'smooth' }), 150);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setActiveSection(null);
      }
    };
    handleLocation();
    window.addEventListener('popstate', handleLocation);
    return () => window.removeEventListener('popstate', handleLocation);
  }, []);

  // Section tracker for guide
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            if (['projects','experience','skills','contact'].includes(id)) setActiveSection(id);
          }
        });
      },
      { threshold: 0.35 }
    );
    SECTION_ORDER.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (targetId) => {
    setActiveSection(targetId);
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', `/${targetId}`);
    }
  };

  return (
    <div className="app-root">
      <motion.div className="progress-bar" style={{ scaleX }} />
      <SpaceCanvas onNavClick={handleNavClick} targetSection={activeSection} />
      <VirtualGuide activeSection={activeSection} isMuted={isMuted} onToggleMute={() => setIsMuted(m => !m)} />
      <VersionSwitcher version={version} onSwitch={onSwitch} />
      <main className="holo-main">
        <HoloHero onNavClick={handleNavClick} />
        <HoloProjects />
        <HoloExperience />
        <HoloSkills />
        <HoloCertifications />
        <HoloAchievements />
        <HoloContact />
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
//  ROOT — version gate
// ══════════════════════════════════════════════════════════════
function App() {
  const [version, setVersion] = useState(() => localStorage.getItem(LS_KEY) || 'holo');

  const handleSwitch = (v) => {
    localStorage.setItem(LS_KEY, v);
    setVersion(v);
    // Reset scroll on switch
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.history.pushState(null, '', '/');
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": profileData.name,
    "jobTitle": "Senior Android Developer",
    "url": "https://akashyadav.dev",
    "sameAs": [profileData.contact.linkedin, profileData.contact.github],
    "knowsAbout": ["Kotlin","Jetpack Compose","KMP","Flutter","Fintech"],
  };

  return (
    <>
      <Helmet>
        <title>{profileData.name} | Senior Software Engineer</title>
        <meta name="description" content={`Portfolio of ${profileData.name}, Senior Software Engineer specializing in Kotlin, Jetpack Compose, and Fintech mobile solutions.`} />
        <meta name="keywords" content="Senior Software Engineer, Android Developer, Kotlin, Jetpack Compose, KMP, Flutter, Fintech, Mobile App Development" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <AnimatePresence mode="wait">
        {version === 'holo' ? (
          <motion.div
            key="holo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <HoloApp version={version} onSwitch={handleSwitch} />
          </motion.div>
        ) : (
          <motion.div
            key="classic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ClassicApp version={version} onSwitch={handleSwitch} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
