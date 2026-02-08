import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

const Navbar = ({ theme, toggleTheme }) => {
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
                <div className="nav-links">
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
            </div>
        </nav>
    );
};

export default Navbar;
