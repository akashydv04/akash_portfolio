import React from 'react';
import { motion } from 'framer-motion';
import { Award, Calendar, ExternalLink } from 'lucide-react';
import { profileData } from '../data/profileData';

const CertificationCard = ({ cert, index }) => {
    return (
        <motion.div
            className="certification-card glass-card"
            whileHover={{ y: -5, borderColor: 'var(--primary)' }}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            viewport={{ once: true }}
        >
            <div className="cert-content">
                <Award className="cert-icon" />
                <div className="cert-info">
                    <h4>{cert.title}</h4>
                    <p className="issuer">{cert.issuer}</p>
                </div>
            </div>
            <a href={cert.link} target="_blank" rel="noopener noreferrer" className="cert-link">
                View <ExternalLink size={14} />
            </a>
        </motion.div>
    );
};

const Certifications = () => {
    return (
        <section id="certifications" className="container section">
            <h2 className="section-title">Verified <span>Certifications</span></h2>
            <div className="certifications-grid">
                {profileData.certifications.map((cert, i) => (
                    <CertificationCard key={i} cert={cert} index={i} />
                ))}
            </div>
        </section>
    );
};

export default Certifications;
