import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, Github, Linkedin, Mail } from 'lucide-react';
import { profileData } from '../data/profileData';

const Navbar = ({ theme, toggleTheme }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="navbar glass-card">
            <div className="nav-content">
                <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="nav-logo"
                >
                    AY<span>.</span>
                </motion.span>

                {/* Desktop Nav */}
                <div className="nav-links desktop-nav">
                    {['Experience', 'Projects', 'Certifications', 'Skills'].map((item, i) => (
                        <motion.a
                            key={item}
                            href={`#${item.toLowerCase()}`}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            {item}
                        </motion.a>
                    ))}
                    <motion.button
                        onClick={toggleTheme}
                        className="theme-toggle"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </motion.button>
                    <motion.a
                        href="#contact"
                        className="nav-cta"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        Connect
                    </motion.a>
                </div>

                {/* Mobile Toggle */}
                <div className="mobile-toggle">
                    <button onClick={toggleTheme} className="theme-toggle mobile-theme-btn">
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <button onClick={() => setIsOpen(!isOpen)} className="menu-btn">
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="mobile-menu glass-card"
                        initial={{ opacity: 0, y: -20, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -20, height: 0 }}
                    >
                        {['Experience', 'Projects', 'Certifications', 'Skills'].map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase()}`}
                                onClick={() => setIsOpen(false)}
                                className="mobile-link"
                            >
                                {item}
                            </a>
                        ))}
                        <a href="#contact" onClick={() => setIsOpen(false)} className="mobile-cta">
                            Connect
                        </a>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
