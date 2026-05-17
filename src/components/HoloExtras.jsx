import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, Star } from 'lucide-react';
import { profileData } from '../data/profileData';
import { profileData as pd } from '../data/profileData';
import { ExternalLink } from 'lucide-react';

const HoloCertifications = () => (
  <section id="certifications" className="holo-section">
    <div className="holo-section-header">
      <span className="holo-label">SECTOR :: CERTIFICATIONS</span>
      <h2 className="holo-section-title">Verified <span>Credentials</span></h2>
    </div>
    <div className="holo-cert-grid">
      {profileData.certifications.map((cert, i) => (
        <motion.a
          key={cert.title}
          href={cert.link}
          target="_blank"
          rel="noopener noreferrer"
          className="holo-cert-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.04, y: -4 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08 }}
        >
          <div className="holo-panel">
            <span className="holo-corner tl" />
            <span className="holo-corner tr" />
            <span className="holo-corner bl" />
            <span className="holo-corner br" />
            <div className="cert-holo-icon"><Award size={20} /></div>
            <div className="cert-holo-info">
              <h4>{cert.title}</h4>
              <span>{cert.issuer}</span>
            </div>
            <ExternalLink size={14} className="cert-holo-arrow" />
          </div>
        </motion.a>
      ))}
    </div>
  </section>
);

const HoloAchievements = () => (
  <section id="achievements" className="holo-section">
    <div className="holo-section-header">
      <span className="holo-label">SECTOR :: ACHIEVEMENTS</span>
      <h2 className="holo-section-title">Key <span>Milestones</span></h2>
    </div>
    <div className="holo-ach-grid">
      {profileData.achievements.map((item, i) => (
        <motion.div
          key={i}
          className="holo-ach-item"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
        >
          <div className="holo-panel">
            <span className="holo-corner tl" />
            <span className="holo-corner tr" />
            <span className="holo-corner bl" />
            <span className="holo-corner br" />
            <Trophy size={20} className="ach-icon" />
            <p>{item}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);

export { HoloCertifications, HoloAchievements };
