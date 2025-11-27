// src/components/Footer.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { COLORS } from '../utils/colors';

const Footer = () => {
  const { setCurrentPage } = useAuth();

  const footerLinks = {
    company: [
      { label: 'About Us', page: 'about' },
      { label: 'How It Works', page: 'about' },
      { label: 'Careers', page: 'about' },
      { label: 'Press', page: 'about' },
    ],
    discover: [
      { label: 'All Tours', page: 'destinations' },
      { label: 'Find Guides', page: 'guides' },
      { label: 'Popular Destinations', page: 'destinations' },
      { label: 'Tour Categories', page: 'destinations' },
    ],
    support: [
      { label: 'Help Center', page: 'about' },
      { label: 'Safety', page: 'about' },
      // UPDATED: Points to the new contact page
      { label: 'Contact Us', page: 'contact' }, 
      { label: 'Terms of Service', page: 'about' },
      { label: 'Privacy Policy', page: 'about' },
    ],
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* Top Section */}
        <div style={styles.topSection}>
          <div style={styles.brandSection}>
            <h2 style={styles.brandName}>Travor</h2>
            <p style={styles.brandTagline}>
              Discover the world with expert local guides. Create unforgettable memories on authentic, personalized tours.
            </p>
            <div style={styles.socialLinks}>
              <a href="#" style={styles.socialIcon}>📘</a>
              <a href="#" style={styles.socialIcon}>📷</a>
              <a href="#" style={styles.socialIcon}>🐦</a>
              <a href="#" style={styles.socialIcon}>💼</a>
            </div>
          </div>

          <div style={styles.linksSection}>
            <div style={styles.linkColumn}>
              <h3 style={styles.linkTitle}>Company</h3>
              <ul style={styles.linkList}>
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <a
                      onClick={() => setCurrentPage(link.page)}
                      style={styles.link}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div style={styles.linkColumn}>
              <h3 style={styles.linkTitle}>Discover</h3>
              <ul style={styles.linkList}>
                {footerLinks.discover.map((link, index) => (
                  <li key={index}>
                    <a
                      onClick={() => setCurrentPage(link.page)}
                      style={styles.link}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div style={styles.linkColumn}>
              <h3 style={styles.linkTitle}>Support</h3>
              <ul style={styles.linkList}>
                {footerLinks.support.map((link, index) => (
                  <li key={index}>
                    <a
                      onClick={() => setCurrentPage(link.page)}
                      style={styles.link}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={styles.divider}></div>

        {/* Bottom Section */}
        <div style={styles.bottomSection}>
          <p style={styles.copyright}>
            © 2024 Travor. All rights reserved.
          </p>
          <div style={styles.bottomLinks}>
            <a onClick={() => setCurrentPage('about')} style={styles.bottomLink}>
              Terms
            </a>
            <span style={styles.separator}>•</span>
            <a onClick={() => setCurrentPage('about')} style={styles.bottomLink}>
              Privacy
            </a>
            <span style={styles.separator}>•</span>
            <a onClick={() => setCurrentPage('about')} style={styles.bottomLink}>
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    background: '#1a1a2e',
    color: 'white',
    marginTop: 'auto',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '60px 24px 24px',
  },
  topSection: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '60px',
    marginBottom: '40px',
  },
  brandSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  brandName: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: COLORS.primary,
    margin: 0,
  },
  brandTagline: {
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#a0a0a0',
    margin: 0,
  },
  socialLinks: {
    display: 'flex',
    gap: '16px',
  },
  socialIcon: {
    fontSize: '24px',
    cursor: 'pointer',
    transition: 'transform 0.3s',
    textDecoration: 'none',
  },
  linksSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '40px',
  },
  linkColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  linkTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: 'white',
    marginBottom: '8px',
  },
  linkList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  link: {
    fontSize: '14px',
    color: '#a0a0a0',
    cursor: 'pointer',
    transition: 'color 0.3s',
    textDecoration: 'none',
  },
  divider: {
    height: '1px',
    background: 'rgba(255, 255, 255, 0.1)',
    marginBottom: '24px',
  },
  bottomSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
  },
  copyright: {
    fontSize: '14px',
    color: '#a0a0a0',
    margin: 0,
  },
  bottomLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  bottomLink: {
    fontSize: '14px',
    color: '#a0a0a0',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'color 0.3s',
  },
  separator: {
    color: '#a0a0a0',
  },
};

export default Footer;