import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, ChevronDown } from 'lucide-react';
import { profileData } from '../data/profileData';

const WORDS = ['Senior Software Engineer', 'Android Developer', 'Fintech Engineer', 'Kotlin Expert', 'Compose Architect'];

const HoloHero = ({ onNavClick }) => {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [phase, setPhase] = useState('typing');

  useEffect(() => {
    const word = WORDS[wordIndex];
    let i = 0;
    let timeout;

    if (phase === 'typing') {
      const type = () => {
        setDisplayed(word.slice(0, i + 1));
        i++;
        if (i <= word.length) timeout = setTimeout(type, 60);
        else timeout = setTimeout(() => setPhase('erasing'), 2000);
      };
      timeout = setTimeout(type, 60);
    } else {
      let j = word.length;
      const erase = () => {
        setDisplayed(word.slice(0, j));
        j--;
        if (j >= 0) timeout = setTimeout(erase, 35);
        else {
          setWordIndex(prev => (prev + 1) % WORDS.length);
          timeout = setTimeout(() => setPhase('typing'), 400);
        }
      };
      timeout = setTimeout(erase, 35);
    }
    return () => clearTimeout(timeout);
  }, [wordIndex, phase]);

  return (
    <section className="holo-hero">
      {/* HUD corners */}
      <div className="hud-corner hud-tl" />
      <div className="hud-corner hud-tr" />
      <div className="hud-corner hud-bl" />
      <div className="hud-corner hud-br" />

      <div className="holo-hero-content">
        <motion.div
          className="holo-badge"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <span className="badge-dot" />
          SYSTEM ONLINE // AVAILABLE FOR OPPORTUNITIES
        </motion.div>

        <motion.h1
          className="holo-hero-name"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {profileData.name}
        </motion.h1>

        <motion.div
          className="holo-hero-role"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <span className="role-prefix">&gt;&gt; </span>
          <span className="role-text">{displayed}</span>
          <span className="role-cursor" />
        </motion.div>

        <motion.p
          className="holo-hero-bio"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          Specializing in <span className="bio-highlight">Kotlin</span> and <span className="bio-highlight">Jetpack Compose</span> to create fluid, native Android applications that push the boundaries of performance and design.
        </motion.p>

        <motion.div
          className="holo-hero-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <button
            className="holo-primary-btn"
            onClick={() => onNavClick('contact')}
          >
            <span className="btn-scan" />
            INITIATE CONTACT
          </button>
          <button
            className="holo-secondary-btn"
            onClick={() => onNavClick('projects')}
          >
            VIEW WORK
          </button>
        </motion.div>

        <motion.div
          className="holo-hero-socials"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          <a href={profileData.contact.github} aria-label="GitHub" className="social-holo-btn" target="_blank" rel="noopener noreferrer">
            <Github size={18} />
          </a>
          <a href={profileData.contact.linkedin} aria-label="LinkedIn" className="social-holo-btn" target="_blank" rel="noopener noreferrer">
            <Linkedin size={18} />
          </a>
          <a href={`mailto:${profileData.contact.email}`} aria-label="Email" className="social-holo-btn">
            <Mail size={18} />
          </a>
        </motion.div>
      </div>

      {/* Stats HUD */}
      <motion.div
        className="holo-stats-bar"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6 }}
      >
        {[
          { n: '5+', l: 'YEARS EXP' },
          { n: '10+', l: 'PROD APPS' },
          { n: '500K+', l: 'DOWNLOADS' },
        ].map(s => (
          <div key={s.l} className="holo-stat">
            <span className="holo-stat-n">{s.n}</span>
            <span className="holo-stat-l">{s.l}</span>
          </div>
        ))}
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="holo-scroll-hint"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        onClick={() => onNavClick('projects')}
      >
        <ChevronDown size={20} />
        <span>NAVIGATE</span>
      </motion.div>
    </section>
  );
};

export default HoloHero;
