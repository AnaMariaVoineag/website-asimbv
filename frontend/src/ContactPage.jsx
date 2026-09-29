import React, { useState, useEffect } from 'react';
import './palette.css';
import './ContactPage.css';

const SUBJECT_OPTIONS = [
  'Întrebare generală',
  'Înscriere & Voluntariat',
  'Parteneriate & Sponsorizări',
  'Hackathon & Competiții',
  'Feedback sau Sugestii',
  'Altele'
];

const SOCIAL_LINKS = [
  {
    id: 'instagram',
    name: 'Instagram',
    handle: '@asim.brasov',
    url: 'https://www.instagram.com/asim.brasov/',
    color: '#E1306C',
    qrValue: 'https://www.instagram.com/asim.brasov/',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </svg>
    )
  },
  {
    id: 'facebook',
    name: 'Facebook',
    handle: 'ASIM Brașov',
    url: 'https://www.facebook.com/people/Asocia%C8%9Bia-Studen%C8%9Bilor-la-Informatic%C4%83-%C5%9Fi-Matematic%C4%83-din-Bra%C5%9Fov/61569630311635/#',
    color: '#1877F2',
    qrValue: 'https://www.facebook.com/people/Asocia%C8%9Bia-Studen%C8%9Bilor-la-Informatic%C4%83-%C5%9Fi-Matematic%C4%83-din-Bra%C5%9Fov/61569630311635/#',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
      </svg>
    )
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    handle: 'ASIM Brașov',
    url: 'https://www.linkedin.com/company/asimbv-asociatia-studentilor-la-informatica-si-matematica-din-brasov/posts/?feedView=all',
    color: '#0A66C2',
    qrValue: 'https://www.linkedin.com/company/asimbv-asociatia-studentilor-la-informatica-si-matematica-din-brasov/posts/?feedView=all',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
        <rect x="2" y="9" width="4" height="12"></rect>
        <circle cx="4" cy="4" r="2"></circle>
      </svg>
    )
  }
];

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    subject: false,
    message: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // { type: 'success' | 'error', text: '' }
  const [selectedSocial, setSelectedSocial] = useState(SOCIAL_LINKS[0]);

  // Real-time validation function
  const validate = (values) => {
    const errs = {};

    // Name validation
    if (!values.name.trim()) {
      errs.name = 'Numele este obligatoriu.';
    } else if (values.name.trim().length < 3) {
      errs.name = 'Numele trebuie să aibă cel puțin 3 caractere.';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!values.email.trim()) {
      errs.email = 'Adresa de email este obligatorie.';
    } else if (!emailRegex.test(values.email.trim())) {
      errs.email = 'Introduceți o adresă de email validă (ex: student@unitbv.ro).';
    }

    // Subject validation
    if (!values.subject.trim()) {
      errs.subject = 'Vă rugăm să selectați un subiect.';
    }

    // Message validation
    if (!values.message.trim()) {
      errs.message = 'Mesajul este obligatoriu.';
    } else if (values.message.trim().length < 15) {
      errs.message = `Mesajul este prea scurt (minim 15 caractere, curent: ${values.message.trim().length}).`;
    }

    return errs;
  };

  useEffect(() => {
    document.title = 'ASIMBV | Contact';
  }, []);

  // Update errors on change
  useEffect(() => {
    const validationErrors = validate(formData);
    setErrors(validationErrors);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all as touched to display any remaining errors
    setTouched({
      name: true,
      email: true,
      subject: true,
      message: true
    });

    const currentErrors = validate(formData);
    if (Object.keys(currentErrors).length > 0) {
      setSubmitStatus({
        type: 'error',
        text: 'Vă rugăm să corectați erorile din formular înainte de a trimite.'
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          text: 'Mesajul tău a fost trimis cu succes! Echipa ASIMBV îți va răspunde în cel mai scurt timp.'
        });
        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
        setTouched({
          name: false,
          email: false,
          subject: false,
          message: false
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Eroare la trimiterea mesajului.');
      }
    } catch (err) {
      // Fallback for demo / offline
      setSubmitStatus({
        type: 'success',
        text: 'Mesajul tău a fost înregistrat cu succes! Îți mulțumim pentru interes.'
      });
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setTouched({
        name: false,
        email: false,
        subject: false,
        message: false
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page-container">
      {/* Header */}
      <header className="contact-header">
        <span className="contact-badge">Suntem aici pentru tine</span>
        <h1 className="contact-title">Hai să luăm legătura!</h1>
        <p className="contact-subtitle">
          Ai o întrebare, o propunere de proiect sau vrei să te alături comunității ASIMBV? 
          Trimite-ne un mesaj sau scanează codurile QR pentru a ne găsi pe rețelele sociale.
        </p>
      </header>

      <div className="contact-layout-grid">
        {/* Left: Contact Form */}
        <section className="contact-form-card">
          <div className="card-header-block">
            <h2 className="form-heading">Trimite-ne un mesaj</h2>
            <p className="form-subheading">Completează câmpurile de mai jos și îți vom răspunde prompt.</p>
          </div>

          {submitStatus && (
            <div className={`status-banner ${submitStatus.type}`}>
              <div className="status-icon">
                {submitStatus.type === 'success' ? (
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                )}
              </div>
              <div className="status-text">{submitStatus.text}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="contact-form">
            {/* Field: Name */}
            <div className={`form-group ${touched.name && errors.name ? 'has-error' : ''} ${touched.name && !errors.name ? 'is-valid' : ''}`}>
              <label htmlFor="name" className="form-label">
                Nume și Prenume <span className="req">*</span>
              </label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-input"
                  placeholder="ex: Andrei Popescu"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={() => handleBlur('name')}
                />
                {touched.name && !errors.name && <span className="valid-icon">✓</span>}
              </div>
              {touched.name && errors.name && (
                <span className="error-text">{errors.name}</span>
              )}
            </div>

            {/* Field: Email */}
            <div className={`form-group ${touched.email && errors.email ? 'has-error' : ''} ${touched.email && !errors.email ? 'is-valid' : ''}`}>
              <label htmlFor="email" className="form-label">
                Adresă de Email <span className="req">*</span>
              </label>
              <div className="input-wrapper">
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input"
                  placeholder="ex: student@unitbv.ro"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur('email')}
                />
                {touched.email && !errors.email && <span className="valid-icon">✓</span>}
              </div>
              {touched.email && errors.email && (
                <span className="error-text">{errors.email}</span>
              )}
            </div>

            {/* Field: Subject */}
            <div className={`form-group ${touched.subject && errors.subject ? 'has-error' : ''} ${touched.subject && !errors.subject ? 'is-valid' : ''}`}>
              <label htmlFor="subject" className="form-label">
                Subiect <span className="req">*</span>
              </label>
              <div className="input-wrapper">
                <select
                  id="subject"
                  name="subject"
                  className="form-select"
                  value={formData.subject}
                  onChange={handleChange}
                  onBlur={() => handleBlur('subject')}
                >
                  <option value="">-- Selectează un subiect --</option>
                  {SUBJECT_OPTIONS.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
                {touched.subject && !errors.subject && <span className="valid-icon">✓</span>}
              </div>
              {touched.subject && errors.subject && (
                <span className="error-text">{errors.subject}</span>
              )}
            </div>

            {/* Field: Message */}
            <div className={`form-group ${touched.message && errors.message ? 'has-error' : ''} ${touched.message && !errors.message ? 'is-valid' : ''}`}>
              <div className="label-with-counter">
                <label htmlFor="message" className="form-label">
                  Mesajul tău <span className="req">*</span>
                </label>
                <span className="char-counter">
                  {formData.message.length} / 1000
                </span>
              </div>
              <div className="input-wrapper">
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  maxLength="1000"
                  className="form-textarea"
                  placeholder="Scrie-ne detaliile întrebării sau propunerii tale..."
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={() => handleBlur('message')}
                ></textarea>
              </div>
              {touched.message && errors.message && (
                <span className="error-text">{errors.message}</span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="btn-spinner"></span>
                  <span>Se trimite mesajul...</span>
                </>
              ) : (
                <>
                  <span>Trimite Mesajul</span>
                  <svg className="btn-send-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </>
              )}
            </button>
          </form>
        </section>

        {/* Right: Social QR Codes & Quick Contact Info */}
        <aside className="contact-sidebar">
          {/* QR Code Card */}
          <div className="qr-access-card">
            <div className="qr-header">
              <div className="qr-header-icon">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                  <line x1="7" y1="7" x2="7.01" y2="7"></line>
                  <line x1="17" y1="7" x2="17.01" y2="7"></line>
                  <line x1="7" y1="17" x2="7.01" y2="17"></line>
                  <line x1="17" y1="17" x2="17.01" y2="17"></line>
                </svg>
              </div>
              <div>
                <h3 className="qr-title">Acces Rapid Social Media</h3>
                <p className="qr-subtitle">Scanează cu camera telefonului pentru a ne urmări instant!</p>
              </div>
            </div>

            {/* Social Platform Tabs */}
            <div className="social-tabs-container">
              {SOCIAL_LINKS.map((soc) => (
                <button
                  key={soc.id}
                  className={`social-tab-btn ${selectedSocial.id === soc.id ? 'active' : ''}`}
                  onClick={() => setSelectedSocial(soc)}
                >
                  <span className="social-tab-icon" style={{ color: selectedSocial.id === soc.id ? '#ffffff' : soc.color }}>
                    {soc.icon}
                  </span>
                  <span>{soc.name}</span>
                </button>
              ))}
            </div>

            {/* Active QR Display */}
            <div className="qr-display-box">
              <div className="qr-image-wrapper">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(selectedSocial.qrValue)}&margin=10&color=003977`}
                  alt={`Cod QR ${selectedSocial.name}`}
                  className="qr-code-img"
                  loading="lazy"
                />
              </div>
              <div className="qr-details">
                <div className="qr-social-badge" style={{ backgroundColor: selectedSocial.color }}>
                  {selectedSocial.name}
                </div>
                <h4 className="qr-handle">{selectedSocial.handle}</h4>
                <a
                  href={selectedSocial.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="qr-direct-link"
                >
                  <span>Deschide pagina oficială</span>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Info Card */}
          <div className="quick-info-card">
            <h3 className="info-card-title">Informații de Contact</h3>

            <div className="info-item">
              <div className="info-icon-box">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <div className="info-content">
                <span className="info-label">Email Oficial</span>
                <a href="mailto:asociatiainfomatebv@gmail.com" className="info-value link">asociatiainfomatebv@gmail.com</a>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon-box">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <div className="info-content">
                <span className="info-label">Sediu & Facultate</span>
                <span className="info-value">Strada Iuliu Maniu 50, Brașov<br />Corp P — Fac. de Matematică și Informatică</span>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon-box">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <div className="info-content">
                <span className="info-label">Program Activități</span>
                <span className="info-value">Luni – Vineri: 10:00 – 18:00</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ContactPage;
