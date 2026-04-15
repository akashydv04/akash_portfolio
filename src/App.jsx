import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
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
import { profileData } from './data/profileData';

function App() {
  const [theme, setTheme] = useState('dark');

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": profileData.name,
    "jobTitle": "Senior Android Developer",
    "url": "https://akashyadav.dev",
    "sameAs": [
      profileData.contact.linkedin,
      profileData.contact.github
    ],
    "knowsAbout": ["Kotlin", "Jetpack Compose", "KMP", "Flutter", "Fintech"]
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleLocation = () => {
      const path = window.location.pathname.replace('/', '');
      if (path) {
        const element = document.getElementById(path);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    handleLocation();
    window.addEventListener('popstate', handleLocation);
    return () => window.removeEventListener('popstate', handleLocation);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="app">
      <Helmet>
        <title>{profileData.name} | Senior Android Developer</title>
        <meta name="description" content={`Portfolio of ${profileData.name}, a Senior Android Developer specializing in Kotlin, Jetpack Compose, KMP, and Fintech solutions.`} />
        <meta name="keywords" content="Android Developer, Kotlin, Jetpack Compose, KMP, Flutter, Fintech, Mobile App Development" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      <motion.div className="progress-bar" style={{ scaleX }} />
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <main>
        <Hero />

        <section className="stats-strip">
          <div className="container stats-container">
            <div className="stat-item">
              <span className="stat-number">5+</span>
              <span className="stat-label">Years Exp</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">10+</span>
              <span className="stat-label">Prod Apps</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">500K+</span>
              <span className="stat-label">Downloads</span>
            </div>
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
}

export default App;
