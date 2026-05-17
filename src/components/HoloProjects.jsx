import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ExternalLink, Layers } from 'lucide-react';
import { profileData } from '../data/profileData';

const HoloPanelWrapper = ({ children, className = '' }) => (
  <div className={`holo-panel ${className}`}>
    <span className="holo-corner tl" />
    <span className="holo-corner tr" />
    <span className="holo-corner bl" />
    <span className="holo-corner br" />
    {children}
  </div>
);

const ProjectCard3D = ({ project, index }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      className="project-3d-wrapper"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12 }}
      animate={{
        y: [0, -6, 0],
      }}
      // override whileInView animation with floating once visible
    >
      <motion.div
        className="project-3d-card"
        whileHover={{ rotateY: 5, rotateX: -3, scale: 1.02 }}
        style={{ transformStyle: 'preserve-3d' }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <HoloPanelWrapper>
          {project.image && (
            <div className="project-holo-img">
              <img src={project.image} alt={project.title} />
              <div className="scanline-overlay" />
              <div className="img-gradient-overlay" />
            </div>
          )}
          <div className="project-holo-content">
            <div className="project-holo-tags">
              {project.tech.map(t => (
                <span key={t} className="holo-tag">{t}</span>
              ))}
            </div>
            <h3 className="project-holo-title">{project.title}</h3>
            <p className="project-holo-desc">{project.description}</p>
            <ul className="project-holo-list">
              {project.highlights.map((h, i) => (
                <li key={i}>
                  <ChevronRight size={12} className="holo-list-icon" /> {h}
                </li>
              ))}
            </ul>
            <a
              href={project.link || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="holo-cta-btn"
            >
              <ExternalLink size={14} /> View on Play Store
            </a>
          </div>
        </HoloPanelWrapper>
      </motion.div>
    </motion.div>
  );
};

const HoloProjects = () => (
  <section id="projects" className="holo-section">
    <div className="holo-section-header">
      <span className="holo-label">SECTOR :: WORK</span>
      <h2 className="holo-section-title">Featured <span>Projects</span></h2>
      <p className="holo-section-sub">High-performance applications built for global users.</p>
    </div>
    <div className="holo-projects-grid">
      {profileData.projects.map((p, i) => (
        <ProjectCard3D key={p.title} project={p} index={i} />
      ))}
    </div>
  </section>
);

export default HoloProjects;
export { HoloPanelWrapper };
