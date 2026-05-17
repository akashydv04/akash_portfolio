import React from 'react';
import { motion } from 'framer-motion';
import { Braces, Smartphone, Layers, Award } from 'lucide-react';
import { profileData } from '../data/profileData';

const icons = {
  Languages: Braces,
  'Mobile Development': Smartphone,
  'Backend & Tools': Layers,
  Specializations: Award,
};

const colors = ['#00f5ff', '#a855f7', '#22d3ee', '#f43f5e'];

const SkillNode = ({ item, delay }) => (
  <motion.span
    className="holo-skill-chip"
    initial={{ opacity: 0, scale: 0.6 }}
    whileInView={{ opacity: 1, scale: 1 }}
    whileHover={{ scale: 1.12, y: -4 }}
    viewport={{ once: true }}
    transition={{ delay, type: 'spring', stiffness: 300 }}
  >
    {item}
  </motion.span>
);

const HoloSkills = () => (
  <section id="skills" className="holo-section">
    <div className="holo-section-header">
      <span className="holo-label">SECTOR :: SKILLS</span>
      <h2 className="holo-section-title">Technical <span>Expertise</span></h2>
      <p className="holo-section-sub">Categorized stack for modern mobile engineering.</p>
    </div>

    <div className="holo-skills-grid">
      {profileData.skills.map((cat, ci) => {
        const Icon = icons[cat.category] || Braces;
        const color = colors[ci % colors.length];
        return (
          <motion.div
            key={cat.category}
            className="holo-skill-card"
            style={{ '--card-color': color }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: ci * 0.1 }}
            animate={{ y: [0, -5 - ci * 2, 0] }}
          >
            <div className="holo-panel">
              <span className="holo-corner tl" />
              <span className="holo-corner tr" />
              <span className="holo-corner bl" />
              <span className="holo-corner br" />

              <div className="holo-skill-icon" style={{ background: `${color}22`, border: `1px solid ${color}55` }}>
                <Icon size={24} style={{ color }} />
              </div>
              <h3 className="holo-skill-cat" style={{ color }}>{cat.category}</h3>
              <div className="holo-skill-chips">
                {cat.items.map((item, ii) => (
                  <SkillNode key={item} item={item} delay={ci * 0.05 + ii * 0.04} />
                ))}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  </section>
);

export default HoloSkills;
