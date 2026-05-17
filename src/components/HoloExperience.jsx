import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, ChevronRight } from 'lucide-react';
import { profileData } from '../data/profileData';

const TimelineNode = ({ exp, index, isLeft }) => (
  <motion.div
    className={`timeline-item ${isLeft ? 'left' : 'right'}`}
    initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay: index * 0.15 }}
  >
    <div className="timeline-dot">
      <motion.div
        className="timeline-dot-inner"
        animate={{
          boxShadow: ['0 0 8px #00f5ff', '0 0 24px #00f5ff', '0 0 8px #00f5ff'],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </div>

    <motion.div
      className="timeline-card"
      whileHover={{ scale: 1.02, rotateX: -2 }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="holo-panel">
        <span className="holo-corner tl" />
        <span className="holo-corner tr" />
        <span className="holo-corner bl" />
        <span className="holo-corner br" />

        <div className="timeline-card-header">
          <div>
            <h3 className="timeline-role">{exp.role}</h3>
            <span className="timeline-company">{exp.company}</span>
          </div>
          <div className="timeline-meta">
            <span className="timeline-period">
              <Calendar size={12} /> {exp.period}
            </span>
            <span className="timeline-location">
              <MapPin size={12} /> {exp.location}
            </span>
          </div>
        </div>

        <ul className="timeline-highlights">
          {exp.highlights.slice(0, 4).map((h, i) => (
            <li key={i}>
              <ChevronRight size={11} className="holo-list-icon" /> {h}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  </motion.div>
);

const HoloExperience = () => (
  <section id="experience" className="holo-section">
    <div className="holo-section-header">
      <span className="holo-label">SECTOR :: EXPERIENCE</span>
      <h2 className="holo-section-title">Professional <span>Journey</span></h2>
      <p className="holo-section-sub">Evolution of technical mastery over the years.</p>
    </div>
    <div className="timeline-container">
      <div className="timeline-line" />
      {profileData.experience.map((exp, i) => (
        <TimelineNode key={i} exp={exp} index={i} isLeft={i % 2 === 0} />
      ))}
    </div>
  </section>
);

export default HoloExperience;
