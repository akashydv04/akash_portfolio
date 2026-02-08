import React, { useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Certifications from './components/Certifications';
import Skills from './components/Skills';
import Achievements from './components/Achievements';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  const [theme, setTheme] = React.useState('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

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
    </div>
  );
}

export default App;
