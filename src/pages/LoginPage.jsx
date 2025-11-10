import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { COLORS } from '../utils/colors';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const LoginPage = () => {
  const { setCurrentPage } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setCurrentPage('myprofile');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.formContainer}>
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>Sign in to your Travor account</p>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" style={styles.submitButton} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={styles.switchText}>
          Don't have an account?{' '}
          <span
            style={styles.link}
            onClick={() => setCurrentPage('register')}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: 'calc(100vh - 140px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 24px',
    background: `linear-gradient(135deg, ${COLORS.light} 0%, ${COLORS.primaryLight}20 100%)`,
  },
  formContainer: {
    background: 'white',
    padding: '48px',
    borderRadius: '16px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '450px',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '8px',
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    color: '#666',
    marginBottom: '32px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '8px',
    fontWeight: '600',
    color: '#333',
  },
  input: {
    padding: '12px',
    border: `2px solid ${COLORS.border}`,
    borderRadius: '8px',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.3s',
  },
  submitButton: {
    background: COLORS.primary,
    color: 'white',
    border: 'none',
    padding: '14px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px',
  },
  error: {
    background: '#fee',
    color: COLORS.danger,
    padding: '12px',
    borderRadius: '8px',
    fontSize: '14px',
  },
  switchText: {
    textAlign: 'center',
    marginTop: '24px',
    color: '#666',
  },
  link: {
    color: COLORS.primary,
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export default LoginPage;