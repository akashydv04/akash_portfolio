import React, { useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import {
  Github,
  Linkedin,
  Mail,
  Phone,
  Download,
  ExternalLink,
  MapPin,
  Code2,
  Smartphone,
  Layers,
  Award,
  ChevronRight,
  Braces,
  Sun,
  Moon
} from 'lucide-react';
import { profileData } from './data/profileData';

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

const ContactForm = () => {
  const [status, setStatus] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target;
    const data = new FormData(form);

    try {
      // Google Forms submission requires 'no-cors' mode when called from client-side JS
      // This returns an opaque response (status 0), so we can't read the actual result text.
      // However, if the network request succeeds, the data is recorded.
      await fetch(import.meta.env.VITE_FORM_URL, {
        method: 'POST',
        body: data,
        mode: 'no-cors'
      });

      // Since we can't verify status code in no-cors, we assume success if no network error occurred.
      setStatus('success');
      setLoading(false);
      const contactElement = document.getElementById('contact');
      if (contactElement) contactElement.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.error('Submission error:', error);
      setStatus('error');
      setLoading(false);
    }
  };

  if (status === 'success') {
    return (
      <motion.div
        className="form-message success glass-card"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="message-icon">✓</div>
        <h3>Message Sent!</h3>
        <p>Thank you for reaching out. I'll get back to you within 24–48 hours.</p>
        <button onClick={() => setStatus('')} className="btn btn-primary">Send Another Message</button>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="custom-contact-form"
    >
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name={import.meta.env.VITE_NAME_ENTRY}
            placeholder="John Doe"
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="email">Work Email</label>
          <input
            type="email"
            id="email"
            name={import.meta.env.VITE_EMAIL_ENTRY}
            placeholder="john@company.com"
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="company">Company / Organization</label>
          <input
            type="text"
            id="company"
            name={import.meta.env.VITE_COMPANY_ENTRY}
            placeholder="Company Name"
          />
        </div>
        <div className="form-field">
          <label htmlFor="inquiry">Inquiry Type</label>
          <select
            id="inquiry"
            name={import.meta.env.VITE_INQUIRY_ENTRY}
            required
            defaultValue=""
          >
            <option value="" disabled>Select option</option>
            <option value="Full-Time Employment (On-Site)">Full-Time Employment (On-Site)</option>
            <option value="Full-Time Employment (Remote)">Full-Time Employment (Remote)</option>
            <option value="Freelance / Contract Project">Freelance / Contract Project</option>
            <option value="Android App Consultation">Android App Consultation</option>
            <option value="Partnership / Collaboration">Partnership / Collaboration</option>
          </select>
        </div>
        <div className="form-field full-width">
          <label htmlFor="message">Project Scope / Job Role</label>
          <textarea
            id="message"
            name={import.meta.env.VITE_MESSAGE_ENTRY}
            placeholder="Describe your requirements or the role you are hiring for..."
            rows="5"
            required
          ></textarea>
        </div>
      </div>
      <button type="submit" className="btn btn-primary submit-btn" disabled={loading}>
        {loading ? 'Sending...' : 'Send Message'} <ChevronRight size={18} />
      </button>
      {status === 'error' && <p className="error-text">Oops! Something went wrong. Please try again.</p>}
    </form>
  );
};

const SkillsSection = () => {
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

function App() {
  const [theme, setTheme] = React.useState('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="app">
      <motion.div className="progress-bar" style={{ scaleX }} />
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <main>
        <Hero />

        <section className="stats-strip">
          <div className="container stats-container">
            <div className="stat-item">
              <span className="stat-number">5+</span>
              <span className="stat-label">Years Exp</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">10+</span>
              <span className="stat-label">Prod Apps</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">500K+</span>
              <span className="stat-label">Downloads</span>
            </div>
          </div>
        </section>

        <section id="experience" className="container section">
          <h2 className="section-title">Professional <span>Journey</span></h2>
          <div className="experience-list">
            {profileData.experience.map((exp, i) => (
              <ExperienceCard key={i} exp={exp} index={i} />
            ))}
          </div>
        </section>

        <section id="projects" className="container section">
          <h2 className="section-title">Featured <span>Work</span></h2>
          <div className="projects-grid">
            {profileData.projects.map((project, i) => (
              <ProjectCard key={i} project={project} index={i} />
            ))}
          </div>
        </section>

        <section id="certifications" className="container section">
          <h2 className="section-title">Verified <span>Certifications</span></h2>
          <div className="certifications-grid">
            {profileData.certifications.map((cert, i) => (
              <CertificationCard key={i} cert={cert} index={i} />
            ))}
          </div>
        </section>

        <SkillsSection />

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

        <section id="contact" className="container section contact-section">
          <div className="contact-wrapper">
            <div className="contact-text">
              <h2 className="section-title">Get In <span>Touch</span></h2>
              <p className="contact-subtitle">I'm always open to discussing new projects, creative ideas or opportunities.</p>
            </div>

            <div className="form-container">
              <ContactForm />
            </div>

            <div className="contact-info-footer">
              <p className="response-tag">I usually respond within 24–48 hours.</p>
              <div className="contact-quick-links">
                <a href={`mailto:${profileData.contact.email}`} className="quick-link">
                  <Mail size={18} /> {profileData.contact.email}
                </a>
                <a href={`tel:${profileData.contact.phone}`} className="quick-link">
                  <Phone size={18} /> {profileData.contact.phone}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="container">
        <div className="footer-content">
          <p>© 2026 Akash Yadav. Crafted for Excellence.</p>
          <div className="footer-socials">
            <a href={profileData.contact.github}><Github size={20} /></a>
            <a href={profileData.contact.linkedin}><Linkedin size={20} /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
