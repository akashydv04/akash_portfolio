import React from 'react';
import { Github, Linkedin } from 'lucide-react';
import { profileData } from '../data/profileData';

const Footer = () => {
    return (
        <footer className="container">
            <div className="footer-content">
                <p>© 2026 Akash Yadav. Crafted for Excellence.</p>
                <div className="footer-socials">
                    <a href={profileData.contact.github}><Github size={20} /></a>
                    <a href={profileData.contact.linkedin}><Linkedin size={20} /></a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
