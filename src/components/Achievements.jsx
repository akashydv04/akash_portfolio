import React from 'react';
import { Trophy } from 'lucide-react';
import { profileData } from '../data/profileData';

const Achievements = () => {
    return (
        <section id="achievements" className="container section">
            <div className="achievements-container glass-card">
                <h2 className="section-title">Key <span>Achievements</span></h2>
                <ul className="achievements-list">
                    {profileData.achievements.map((item, i) => (
                        <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <Award className="achievement-icon" />
                            <p>{item}</p>
                        </motion.li>
                    ))}
                </ul>
            </div>
        </section>
    );
};

export default Achievements;
