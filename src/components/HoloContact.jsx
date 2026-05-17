import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, ChevronRight } from 'lucide-react';
import { profileData } from '../data/profileData';
import config from '../config';

const ContactForm = () => {
  const [status, setStatus] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [inquiryValue, setInquiryValue] = React.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target;
    const formData = new FormData(form);
    const payload = {};
    for (const [k, v] of formData.entries()) payload[k] = v;

    try {
      setErrorMessage('');
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({ error: 'Invalid server response' }));
      if (!response.ok) {
        const msg = result?.error || `Server responded ${response.status}`;
        setErrorMessage(msg);
        setStatus('error');
        return;
      }
      if (!result.success) {
        const msg = result?.error || 'Submission failed';
        setErrorMessage(msg);
        setStatus('error');
        return;
      }
      setStatus('success');
      setInquiryValue('');
      form.reset();
    } catch (error) {
      setErrorMessage(error?.message || 'Submission error');
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'success') {
    return (
      <motion.div
        className="holo-success"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="holo-success-icon">✓</div>
        <h3>Transmission Received</h3>
        <p>Signal confirmed. I will respond within 24–48 standard hours.</p>
        <button
          className="holo-submit-btn"
          onClick={() => { setStatus(''); setInquiryValue(''); }}
        >
          Send Another Transmission <ChevronRight size={16} />
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="holo-contact-form">
      <div className="holo-form-grid">
        {/* Name */}
        <div className="holo-field">
          <label htmlFor="holo-name">IDENTIFIER // FULL NAME</label>
          <div className="holo-input-wrap">
            <input
              type="text"
              id="holo-name"
              name={config.formEntries.name}
              placeholder="Enter full name..."
              autoComplete="name"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="holo-field">
          <label htmlFor="holo-email">COMM CHANNEL // EMAIL</label>
          <div className="holo-input-wrap">
            <input
              type="email"
              id="holo-email"
              name={config.formEntries.email}
              placeholder="your@email.com"
              autoComplete="email"
              required
            />
          </div>
        </div>

        {/* Company */}
        <div className="holo-field">
          <label htmlFor="holo-company">ORIGIN // ORGANIZATION</label>
          <div className="holo-input-wrap">
            <input
              type="text"
              id="holo-company"
              name={config.formEntries.company}
              placeholder="Company / Organization"
              autoComplete="organization"
            />
          </div>
        </div>

        {/* Inquiry */}
        <div className="holo-field">
          <label htmlFor="holo-inquiry">MISSION TYPE</label>
          <div className="holo-input-wrap">
            <select
              id="holo-inquiry"
              name={config.formEntries.inquiry}
              required
              value={inquiryValue}
              onChange={e => setInquiryValue(e.target.value)}
            >
              <option value="" disabled>Select mission type...</option>
              <option value="Full-Time Employment (On-Site)">Full-Time Employment (On-Site)</option>
              <option value="Full-Time Employment (Remote)">Full-Time Employment (Remote)</option>
              <option value="Freelance / Contract Project">Freelance / Contract Project</option>
              <option value="Android App Consultation">Android App Consultation</option>
              <option value="Partnership / Collaboration">Partnership / Collaboration</option>
            </select>
          </div>
        </div>

        {/* Message */}
        <div className="holo-field holo-field-full">
          <label htmlFor="holo-message">DATA PAYLOAD // MESSAGE</label>
          <div className="holo-input-wrap">
            <textarea
              id="holo-message"
              name={config.formEntries.message}
              placeholder="Describe your project scope or role requirements..."
              rows="5"
              required
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="holo-submit-btn"
        disabled={loading}
      >
        {loading ? 'TRANSMITTING...' : 'TRANSMIT MESSAGE'} <ChevronRight size={16} />
      </button>

      {status === 'error' && (
        <p className="holo-error">
          ⚠ {errorMessage || 'Transmission failed. Retry.'}
        </p>
      )}
    </form>
  );
};

const HoloContact = () => (
  <section id="contact" className="holo-section holo-contact-section">
    <div className="holo-section-header">
      <span className="holo-label">SECTOR :: CONTACT</span>
      <h2 className="holo-section-title">Let's build something <span>extraordinary</span>.</h2>
      <p className="holo-section-sub">
        Available for consulting, full-time roles, or technical collaborations on groundbreaking mobile projects.
      </p>
    </div>

    <div className="holo-contact-deck">
      <div className="holo-panel holo-contact-panel">
        <span className="holo-corner tl" />
        <span className="holo-corner tr" />
        <span className="holo-corner bl" />
        <span className="holo-corner br" />

        <div className="holo-contact-top-bar">
          <span className="terminal-blink">●</span>
          <span>COMMUNICATION CONSOLE // ACTIVE</span>
          <span className="terminal-blink">●</span>
        </div>

        <ContactForm />

        <div className="holo-contact-links">
          <a href={`mailto:${profileData.contact.email}`} className="holo-quick-link">
            <Mail size={16} /> {profileData.contact.email}
          </a>
          <a href={`tel:${profileData.contact.phone}`} className="holo-quick-link">
            <Phone size={16} /> {profileData.contact.phone}
          </a>
        </div>
      </div>
    </div>
  </section>
);

export default HoloContact;
