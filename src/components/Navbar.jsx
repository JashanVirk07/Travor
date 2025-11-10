import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { COLORS } from '../utils/colors.js';
import { Icon } from './Icons.jsx';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const Navbar = () => {
  const { currentPage, setCurrentPage, user } = useApp();

  const [hoveredLink, setHoveredLink] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [hoveredBrand, setHoveredBrand] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentPage('home');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    { label: 'Home', page: 'home' },
    { label: 'Destinations', page: 'destinations' },
    { label: 'Find Guides', page: 'guides' },
    { label: 'About', page: 'about' },
  ];

  return (
    <nav style={styles.navbar}>
      <div style={styles.navContainer}>
        <div
          style={{
            ...styles.navBrand,
            ...(hoveredBrand ? { transform: 'scale(1.05)', color: COLORS.secondary } : {}),
          }}
          onClick={() => setCurrentPage('home')}
          onMouseEnter={() => setHoveredBrand(true)}
          onMouseLeave={() => setHoveredBrand(false)}
        >
          Travor
        </div>

        <ul style={styles.navLinks}>
          {navItems.map(item => (
            <li key={item.page}>
              <a
                onClick={() => setCurrentPage(item.page)}
                onMouseEnter={() => setHoveredLink(item.page)}
                onMouseLeave={() => setHoveredLink(null)}
                style={{
                  ...styles.navLink,
                  ...(currentPage === item.page ? styles.navLinkActive : {}),
                  ...(hoveredLink === item.page ? { color: COLORS.primary, transform: 'scale(1.05)' } : {}),
                }}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div style={styles.navButtons}>
          {user ? (
            <>
              <button
                style={{
                  ...styles.profileButton,
                  ...(hoveredButton === 'profile' ? { background: COLORS.primary, color: 'white', transform: 'scale(1.05)' } : {}),
                }}
                onClick={() => setCurrentPage('myprofile')}
                onMouseEnter={() => setHoveredButton('profile')}
                onMouseLeave={() => setHoveredButton(null)}
              >
                <Icon.User />
                <span>My Profile</span>
              </button>
              <button
                style={{
                  ...styles.logoutButton,
                  ...(hoveredButton === 'logout' ? { background: '#ff4d4d', color: 'white', transform: 'scale(1.05)' } : {}),
                }}
                onClick={handleLogout}
                onMouseEnter={() => setHoveredButton('logout')}
                onMouseLeave={() => setHoveredButton(null)}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                style={{
                  ...styles.loginButton,
                  ...(hoveredButton === 'login' ? { background: COLORS.primary, color: 'white', transform: 'scale(1.05)' } : {}),
                }}
                onClick={() => setCurrentPage('login')}
                onMouseEnter={() => setHoveredButton('login')}
                onMouseLeave={() => setHoveredButton(null)}
              >
                Login
              </button>
              <button
                style={{
                  ...styles.registerButton,
                  ...(hoveredButton === 'register' ? { background: COLORS.secondary, transform: 'scale(1.05)' } : {}),
                }}
                onClick={() => setCurrentPage('register')}
                onMouseEnter={() => setHoveredButton('register')}
                onMouseLeave={() => setHoveredButton(null)}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    background: '#ffffff',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    transition: 'background 0.3s, box-shadow 0.3s',
  },
  navContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '16px 24px',
  },
  navBrand: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: COLORS.primary,
    cursor: 'pointer',
    transition: 'transform 0.3s, color 0.3s',
  },
  navLinks: {
    display: 'flex',
    gap: '32px',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  navLink: {
    color: '#333',
    fontWeight: '500',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'color 0.3s, transform 0.3s',
  },
  navLinkActive: {
    color: COLORS.primary,
    borderBottom: `2px solid ${COLORS.primary}`,
    paddingBottom: '4px',
  },
  navButtons: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  loginButton: {
    background: 'transparent',
    border: `2px solid ${COLORS.primary}`,
    color: COLORS.primary,
    padding: '8px 20px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  registerButton: {
    background: COLORS.primary,
    border: 'none',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  profileButton: {
    background: 'transparent',
    border: `2px solid ${COLORS.primary}`,
    color: COLORS.primary,
    padding: '8px 16px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s',
  },
  logoutButton: {
    background: '#f5f5f5',
    border: 'none',
    color: '#666',
    padding: '10px 20px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
};

export default Navbar;
