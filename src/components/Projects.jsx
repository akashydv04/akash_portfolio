import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { profileData } from '../data/profileData';

const ProjectCard = ({ project, index }) => {
    return (
        <motion.div
            className="project-card glass-card"
            whileHover={{ y: -10 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
        >
            {project.image && (
                <div className="project-image-container">
                    <img src={project.image} alt={project.title} className="project-image" />
                    <div className="project-image-overlay"></div>
                </div>
            )}
            <div className="project-content">
                <div className="project-tags">
                    {project.tech.map(t => <span key={t} className="tag">{t}</span>)}
                </div>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <ul className="project-highlights">
                    {project.highlights.map((h, i) => <li key={i}>{h}</li>)}
                </ul>
                <div className="project-links">
                    <a href={project.link || "#"} target="_blank" rel="noopener noreferrer" className="btn-icon">
                        Play Store <ExternalLink size={16} />
                    </a>
                </div>
            </div>
        </motion.div>
    );
};

const Projects = () => {
    return (
        <section id="projects" className="container section">
            <h2 className="section-title">Featured <span>Work</span></h2>
            <div className="projects-grid">
                {profileData.projects.map((project, i) => (
                    <ProjectCard key={i} project={project} index={i} />
                ))}
            </div>
        </section>
    );
};

export default Projects;
