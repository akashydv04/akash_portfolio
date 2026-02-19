import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, ChevronRight } from "lucide-react";
import { profileData } from "../data/profileData";
import config from "../config";

const ContactForm = () => {
  const [status, setStatus] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [inquiryValue, setInquiryValue] = React.useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target;
    // Send raw FormData (multipart/form-data) so servers that expect FormData work directly
    const formData = new FormData(form);

    try {
      setErrorMessage("");
      const response = await fetch("/api/submit", {
        method: "POST",
        // Do NOT set Content-Type — let the browser set multipart/form-data with boundary
        body: formData,
      });

      const result = await response
        .json()
        .catch(() => ({ error: "Invalid server response" }));

      if (!response.ok) {
        const msg =
          result && result.error
            ? result.error
            : `Server responded ${response.status}`;
        console.error("Submission failed:", msg);
        setErrorMessage(msg);
        setStatus("error");
        return;
      }

      if (!result.success) {
        const msg = result && result.error ? result.error : "Submission failed";
        console.error("Submission failed:", msg);
        setErrorMessage(msg);
        setStatus("error");
        return;
      }

      setStatus("success");
      setInquiryValue("");
      form.reset();

      const contactElement = document.getElementById("contact");
      if (contactElement) contactElement.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      console.error("Submission error:", error);
      setErrorMessage(
        error && error.message ? error.message : "Submission error",
      );
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  if (status === "success") {
    return (
      <motion.div
        className="form-message success glass-card"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="message-icon">✓</div>
        <h3>Message Sent!</h3>
        <p>
          Thank you for reaching out. I'll get back to you within 24–48 hours.
        </p>
        <button
          onClick={() => {
            setStatus("");
            setInquiryValue("");
          }}
          className="btn btn-primary"
        >
          Send Another Message
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="custom-contact-form">
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name={config.formEntries.name}
            placeholder="John Doe"
            autoComplete="name"
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="email">Work Email</label>
          <input
            type="email"
            id="email"
            name={config.formEntries.email}
            placeholder="john@company.com"
            autoComplete="email"
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="company">Company / Organization</label>
          <input
            type="text"
            id="company"
            name={config.formEntries.company}
            placeholder="Company Name"
            autoComplete="organization"
          />
        </div>
        <div className="form-field">
          <label htmlFor="inquiry">Inquiry Type</label>
          <select
            id="inquiry"
            name={config.formEntries.inquiry}
            required
            value={inquiryValue}
            onChange={(e) => setInquiryValue(e.target.value)}
          >
            <option value="" disabled>
              Select option
            </option>
            <option value="Full-Time Employment (On-Site)">
              Full-Time Employment (On-Site)
            </option>
            <option value="Full-Time Employment (Remote)">
              Full-Time Employment (Remote)
            </option>
            <option value="Freelance / Contract Project">
              Freelance / Contract Project
            </option>
            <option value="Android App Consultation">
              Android App Consultation
            </option>
            <option value="Partnership / Collaboration">
              Partnership / Collaboration
            </option>
          </select>
        </div>
        <div className="form-field full-width">
          <label htmlFor="message">Project Scope / Job Role</label>
          <textarea
            id="message"
            name={config.formEntries.message}
            placeholder="Describe your requirements or the role you are hiring for..."
            rows="5"
            required
          ></textarea>
        </div>
      </div>
      <button
        type="submit"
        className="btn btn-primary submit-btn"
        disabled={loading}
      >
        {loading ? "Sending..." : "Send Message"} <ChevronRight size={18} />
      </button>
      {status === "error" && (
        <p className="error-text">
          {errorMessage || "Oops! Something went wrong. Please try again."}
        </p>
      )}
    </form>
  );
};

const Contact = () => {
  return (
    <section id="contact" className="container section contact-section">
      <div className="contact-wrapper">
        <div className="contact-text">
          <h2 className="section-title">
            Get In <span>Touch</span>
          </h2>
          <p className="contact-subtitle">
            I'm always open to discussing new projects, creative ideas or
            opportunities.
          </p>
        </div>

        <div className="form-container">
          <ContactForm />
        </div>

        <div className="contact-info-footer">
          <p className="response-tag">I usually respond within 24–48 hours.</p>
          <div className="contact-quick-links">
            <a
              href={`mailto:${profileData.contact.email}`}
              className="quick-link"
            >
              <Mail size={18} /> {profileData.contact.email}
            </a>
            <a href={`tel:${profileData.contact.phone}`} className="quick-link">
              <Phone size={18} /> {profileData.contact.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
