import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, MapPin } from 'lucide-react';
import { profileData } from '../data/profileData';

const ExperienceCard = ({ exp, index }) => {
    return (
        <motion.div
            className="experience-card glass-card"
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
        >
            <div className="exp-header">
                <div className="exp-info">
                    <h3>{exp.role}</h3>
                    <p className="company">{exp.company}</p>
                </div>
                <div className="exp-meta">
                    <span className="period">{exp.period}</span>
                    <span className="location"><MapPin size={14} /> {exp.location}</span>
                </div>
            </div>
            <ul className="exp-highlights">
                {exp.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                ))}
            </ul>
        </motion.div>
    );
};

const Experience = () => {
    return (
        <section id="experience" className="container section">
            <h2 className="section-title">Professional <span>Journey</span></h2>
            <div className="experience-list">
                {profileData.experience.map((exp, i) => (
                    <ExperienceCard key={i} exp={exp} index={i} />
                ))}
            </div>
        </section>
    );
};

export default Experience;
