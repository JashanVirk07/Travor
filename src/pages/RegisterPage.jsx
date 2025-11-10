import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { COLORS } from '../utils/colors';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const RegisterPage = () => {
  const { setCurrentPage } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'traveler',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        createdAt: new Date().toISOString(),
      });

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
        <h2 style={styles.title}>Join Travor</h2>
        <p style={styles.subtitle}>Create your account and start exploring</p>

        <div style={styles.roleSelector}>
          <p style={styles.roleSelectorLabel}>Sign up as:</p>
          <div style={styles.roleButtons}>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'traveler' })}
              style={{
                ...styles.roleButton,
                ...(formData.role === 'traveler' ? styles.roleButtonActive : {}),
              }}
            >
              Traveler
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'guide' })}
              style={{
                ...styles.roleButton,
                ...(formData.role === 'guide' ? styles.roleButtonActive : {}),
              }}
            >
              Local Guide
            </button>
          </div>
        </div>

        <form onSubmit={handleRegister} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" style={styles.submitButton} disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p style={styles.switchText}>
          Already have an account?{' '}
          <span style={styles.link} onClick={() => setCurrentPage('login')}>
            Sign in
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
    marginBottom: '24px',
    textAlign: 'center',
  },
  roleSelector: {
    marginBottom: '24px',
    padding: '20px',
    background: COLORS.light,
    borderRadius: '12px',
  },
  roleSelectorLabel: {
    fontWeight: '600',
    marginBottom: '12px',
    color: '#333',
  },
  roleButtons: {
    display: 'flex',
    gap: '12px',
  },
  roleButton: {
    flex: 1,
    padding: '12px',
    border: `2px solid ${COLORS.border}`,
    borderRadius: '8px',
    background: 'white',
    color: '#666',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  roleButtonActive: {
    background: COLORS.primary,
    color: 'white',
    borderColor: COLORS.primary,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
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

export default RegisterPage;