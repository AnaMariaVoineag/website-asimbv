import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logoText from './assets/logo_asimbv.png';
import './Footer.css';

const Footer = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success'|'error'|'duplicate', text: '' }

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setStatus(null);

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), name: name.trim() })
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ type: 'success', text: data.message });
        setEmail('');
        setName('');
      } else if (res.status === 409) {
        setStatus({ type: 'duplicate', text: data.message });
      } else {
        setStatus({ type: 'error', text: data.message || 'Eroare la abonare. Încearcă din nou.' });
      }
    } catch {
      setStatus({ type: 'error', text: 'Nu s-a putut conecta la server. Încearcă mai târziu.' });
    } finally {
      setIsLoading(false);
      if (status?.type === 'success') {
        setTimeout(() => setStatus(null), 6000);
      }
    }
  };


  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-columns">
          {/* Column 1: Logo + Short Description */}
          <div className="footer-col footer-col-brand">
            <Link to="/" className="footer-logo-link">
              <img src={logoText} alt="ASIMBV Logo" className="footer-logo" />
            </Link>
            <p className="footer-description">
              Asociația Studenților la Informatică și Matematică Brașov — susținem dezvoltarea personală, profesională și academică a studenților prin proiecte inovatoare și evenimente memorabile.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-col">
            <h4 className="footer-col-title">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Acasă</Link></li>
              <li><Link to="/events">Evenimente</Link></li>
              <li><Link to="/formular-230">Redirecționează 3.5%</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/get-involved">Parteneriat</Link></li>
            </ul>
          </div>

          {/* Column 3: Social Media (White Outline Logos) */}
          <div className="footer-col">
            <h4 className="footer-col-title">Follow Us</h4>
            <p className="footer-social-desc">Fii la curent cu ultimele noutăți pe rețelele noastre sociale:</p>
            <div className="footer-social-icons">
              {/* Instagram */}
              <a 
                href="https://www.instagram.com/asim.brasov/" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Instagram"
                className="social-icon-btn"
              >
                <svg className="social-svg-outline" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>

              {/* Facebook */}
              <a 
                href="https://www.facebook.com/people/Asocia%C8%9Bia-Studen%C8%9Bilor-la-Informatic%C4%83-%C5%9Fi-Matematic%C4%83-din-Bra%C5%9Fov/61569630311635/#" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Facebook"
                className="social-icon-btn"
              >
                <svg className="social-svg-outline" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>

              {/* LinkedIn */}
              <a 
                href="https://www.linkedin.com/company/asimbv-asociatia-studentilor-la-informatica-si-matematica-din-brasov/posts/?feedView=all" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="LinkedIn"
                className="social-icon-btn"
              >
                <svg className="social-svg-outline" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 4: Newsletter Subscription */}
          <div className="footer-col">
            <h4 className="footer-col-title">Newsletter</h4>
            <p className="footer-newsletter-text">
              Abonează-te pentru a primi vești despre workshop-uri, oportunități de voluntariat și evenimente viitoare.
            </p>

            {status?.type === 'success' ? (
              <div className="newsletter-success">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="success-icon">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span>{status.text}</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="newsletter-form">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Numele tău (opțional)"
                  className="newsletter-input newsletter-name-input"
                  disabled={isLoading}
                />
                <div className="newsletter-input-group">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Adresa ta de email"
                    required
                    className="newsletter-input"
                    disabled={isLoading}
                  />
                  <button type="submit" className="newsletter-submit-btn" aria-label="Subscribe" disabled={isLoading}>
                    {isLoading ? (
                      <span className="newsletter-spinner"></span>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="newsletter-send-icon">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                      </svg>
                    )}
                  </button>
                </div>
                {status && status.type !== 'success' && (
                  <p className={`newsletter-status-msg newsletter-status-${status.type}`}>
                    {status.type === 'duplicate' ? '📬 ' : '⚠️ '}
                    {status.text}
                  </p>
                )}
              </form>
            )}
          </div>

        </div>

        {/* Bottom Bar: Copyright & Privacy Policy */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {new Date().getFullYear()} ASIM Brașov. Toate drepturile rezervate.
          </p>
          <div className="footer-legal">
            <Link to="/privacy-policy" className="footer-legal-link">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
