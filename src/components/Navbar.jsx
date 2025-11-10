import React from 'react';
import { useApp } from '../context/AppContext.jsx';
import { COLORS } from '../utils/colors.js';
import { Icon } from './Icons.jsx';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const Navbar = () => {
  const { currentPage, setCurrentPage, user } = useApp();

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
        <div style={styles.navBrand} onClick={() => setCurrentPage('home')}>
          Travor
        </div>

        <ul style={styles.navLinks}>
          {navItems.map(item => (
            <li key={item.page}>
              <a
                onClick={() => setCurrentPage(item.page)}
                style={{
                  ...styles.navLink,
                  ...(currentPage === item.page ? styles.navLinkActive : {})
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
                style={styles.profileButton}
                onClick={() => setCurrentPage('myprofile')}
              >
                <Icon.User />
                <span>My Profile</span>
              </button>
              <button style={styles.logoutButton} onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                style={styles.loginButton}
                onClick={() => setCurrentPage('login')}
              >
                Login
              </button>
              <button
                style={styles.registerButton}
                onClick={() => setCurrentPage('register')}
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
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
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
    transition: 'color 0.3s',
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
  },
  logoutButton: {
    background: '#f5f5f5',
    border: 'none',
    color: '#666',
    padding: '10px 20px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export default Navbar;