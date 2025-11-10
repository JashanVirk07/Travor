import React from 'react';
import { COLORS } from '../utils/colors';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.footerContainer}>
        <div style={styles.footerTop}>
          <div style={styles.footerBrand}>
            <h3 style={styles.footerLogo}>Travor</h3>
            <p>Your travel companion for discovering local experiences</p>
          </div>
          <div style={styles.footerLinks}>
            <div style={styles.footerColumn}>
              <h4>Company</h4>
              <ul style={styles.footerList}>
                <li>About</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div>
            <div style={styles.footerColumn}>
              <h4>Support</h4>
              <ul style={styles.footerList}>
                <li>Help Center</li>
                <li>Safety</li>
                <li>Terms</li>
              </ul>
            </div>
          </div>
        </div>
        <div style={styles.footerBottom}>
          © 2025 Travor. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    background: COLORS.dark,
    color: 'white',
    padding: '48px 24px',
    marginTop: 'auto',
  },
  footerContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  footerTop: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '40px',
    marginBottom: '32px',
    paddingBottom: '32px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  footerBrand: {
    maxWidth: '300px',
  },
  footerLogo: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: '12px',
  },
  footerLinks: {
    display: 'flex',
    gap: '60px',
  },
  footerColumn: {
    minWidth: '150px',
  },
  footerList: {
    listStyle: 'none',
    padding: 0,
    margin: '12px 0 0 0',
  },
  footerBottom: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.7)',
    fontSize: '14px',
  },
};

export default Footer;