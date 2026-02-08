import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Github, Linkedin, Mail } from 'lucide-react';
import { profileData } from '../data/profileData';

const Hero = () => {
    return (
        <section className="hero-section container">
            <div className="hero-content">
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="badge"
                >
                    Available for Opportunities
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    Building <span className="gradient-text">Scalable</span> <br />
                    Mobile Experiences
                </motion.h1>

                <motion.p
                    className="hero-summary"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    {profileData.summary}
                </motion.p>

                <motion.div
                    className="hero-actions"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <a href="#contact" className="btn btn-primary">
                        Hire Me <ChevronRight size={18} />
                    </a>
                    <div className="social-links">
                        <a href={profileData.contact.github}><Github /></a>
                        <a href={profileData.contact.linkedin}><Linkedin /></a>
                        <a href={`mailto:${profileData.contact.email}`}><Mail /></a>
                    </div>
                </motion.div>
            </div>

            <div className="hero-visual">
                <div className="blob-container">
                    <div className="blob"></div>
                    <motion.div
                        className="profile-container"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <img src={profileData.avatar} alt={profileData.name} className="profile-image" />
                        <div className="code-card glass-card">
                            <div className="code-header">
                                <span className="dot red"></span>
                                <span className="dot yellow"></span>
                                <span className="dot green"></span>
                            </div>
                            <pre>
                                <code>{`class AndroidDev {
  constructor() {
    this.name = "${profileData.name.split(' ')[0]}";
    this.status = "Active";
  }
}`}</code>
                            </pre>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
