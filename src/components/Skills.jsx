import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Database, Layout, Smartphone, Terminal, Wrench, Braces, Layers, Award } from 'lucide-react';
import { profileData } from '../data/profileData';

const Skills = () => {
    const icons = {
        "Languages": <Braces />,
        "Mobile Development": <Smartphone />,
        "Backend & Tools": <Layers />,
        "Specializations": <Award />
    };

    return (
        <section id="skills" className="skills-section container">
            <h2 className="section-title">Technical <span>Stack</span></h2>
            <div className="skills-grid">
                {profileData.skills.map((skill, i) => (
                    <motion.div
                        key={skill.category}
                        className="skill-category glass-card"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        viewport={{ once: true }}
                    >
                        <div className="skill-icon">{icons[skill.category] || <Code2 />}</div>
                        <h3>{skill.category}</h3>
                        <div className="skill-items">
                            {skill.items.map(item => (
                                <span key={item} className="skill-item">{item}</span>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default Skills;
