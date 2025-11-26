// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../utils/colors';
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';

const LoginPage = () => {
  const { login, resetPassword, authError, clearError, setCurrentPage } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
    if (clearError) clearError();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          setCurrentPage('myprofile');
        }, 1000);
      } else {
        // FIX: Handle returned errors properly
        setError(result.error || 'Failed to login');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!resetEmail) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);

    try {
      const result = await resetPassword(resetEmail);
      if (result.success) {
        setSuccess(result.message);
        // Clear form after delay
        setTimeout(() => {
          setShowForgotPassword(false);
          setResetEmail('');
          setSuccess('');
        }, 5000);
      } else {
        // FIX: Handle returned errors (e.g. User not found)
        setError(result.error || 'Failed to send reset email');
      }
    } catch (err) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {!showForgotPassword ? (
          // Login Form
          <>
            <div style={styles.header}>
              <h1 style={styles.title}>Welcome Back</h1>
              <p style={styles.subtitle}>Sign in to your Travor account</p>
            </div>

            <form onSubmit={handleLogin} style={styles.form}>
              {/* Email Field */}
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <Mail size={16} style={styles.labelIcon} />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  style={styles.input}
                  disabled={loading}
                  required
                />
              </div>

              {/* Password Field */}
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <Lock size={16} style={styles.labelIcon} />
                  Password
                </label>
                <div style={styles.passwordContainer}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    style={styles.passwordInput}
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={styles.eyeButton}
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div style={styles.forgotPasswordContainer}>
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setSuccess('');
                    setShowForgotPassword(true);
                  }}
                  style={styles.forgotPasswordButton}
                  disabled={loading}
                >
                  Forgot your password?
                </button>
              </div>

              {/* Error Message */}
              {(error || authError) && (
                <div style={styles.errorBox}>
                  <AlertCircle size={18} style={styles.errorIcon} />
                  <span>{error || authError}</span>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div style={styles.successBox}>
                  <CheckCircle size={18} style={styles.successIcon} />
                  <span>{success}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                style={{
                  ...styles.submitButton,
                  ...(loading ? styles.submitButtonDisabled : {}),
                }}
                disabled={loading}
              >
                {loading ? (
                  <span style={styles.loadingSpinner}>⟳ Signing in...</span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Register Link */}
            <div style={styles.footer}>
              <p style={styles.footerText}>
                Don't have an account?{' '}
                <button
                  onClick={() => setCurrentPage('register')}
                  style={styles.footerLink}
                  disabled={loading}
                >
                  Create one now
                </button>
              </p>
            </div>
          </>
        ) : (
          // Forgot Password Form
          <>
            <div style={styles.header}>
              <h1 style={styles.title}>Reset Password</h1>
              <p style={styles.subtitle}>
                Enter your email address and we'll send you a reset link
              </p>
            </div>

            <form onSubmit={handleForgotPassword} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <Mail size={16} style={styles.labelIcon} />
                  Email Address
                </label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  style={styles.input}
                  disabled={loading}
                  required
                />
              </div>

              {error && (
                <div style={styles.errorBox}>
                  <AlertCircle size={18} style={styles.errorIcon} />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div style={styles.successBox}>
                  <CheckCircle size={18} style={styles.successIcon} />
                  <span>{success}</span>
                </div>
              )}

              <button
                type="submit"
                style={{
                  ...styles.submitButton,
                  ...(loading ? styles.submitButtonDisabled : {}),
                }}
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setResetEmail('');
                  setError('');
                  setSuccess('');
                }}
                style={styles.backButton}
                disabled={loading}
              >
                Back to Sign In
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    background: `linear-gradient(135deg, ${COLORS.light} 0%, ${COLORS.primaryLight}30 100%)`,
  },
  container: {
    width: '100%',
    maxWidth: '480px',
    background: 'white',
    borderRadius: '20px',
    padding: '48px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
    lineHeight: '1.5',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
  },
  labelIcon: {
    color: COLORS.primary,
  },
  input: {
    padding: '14px 16px',
    border: `2px solid ${COLORS.border}`,
    borderRadius: '10px',
    fontSize: '16px',
    outline: 'none',
    transition: 'all 0.3s',
    fontFamily: 'inherit',
  },
  passwordContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    padding: '14px 50px 14px 16px',
    border: `2px solid ${COLORS.border}`,
    borderRadius: '10px',
    fontSize: '16px',
    outline: 'none',
    transition: 'all 0.3s',
    fontFamily: 'inherit',
  },
  eyeButton: {
    position: 'absolute',
    right: '12px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#999',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    transition: 'color 0.3s',
  },
  forgotPasswordContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '-16px',
  },
  forgotPasswordButton: {
    background: 'none',
    border: 'none',
    color: COLORS.primary,
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    padding: '4px 0',
  },
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '14px 16px',
    background: '#fee',
    border: `1px solid ${COLORS.danger}`,
    borderRadius: '10px',
    color: COLORS.danger,
    fontSize: '14px',
  },
  errorIcon: {
    flexShrink: 0,
  },
  successBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '14px 16px',
    background: '#d4edda',
    border: '1px solid #28a745',
    borderRadius: '10px',
    color: '#155724',
    fontSize: '14px',
  },
  successIcon: {
    flexShrink: 0,
  },
  submitButton: {
    padding: '16px',
    background: COLORS.primary,
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
    marginTop: '8px',
  },
  submitButtonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  loadingSpinner: {
    display: 'inline-block',
    animation: 'spin 1s linear infinite',
  },
  backButton: {
    padding: '16px',
    background: 'transparent',
    color: COLORS.primary,
    border: `2px solid ${COLORS.primary}`,
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  footer: {
    textAlign: 'center',
    marginTop: '32px',
  },
  footerText: {
    fontSize: '14px',
    color: '#666',
  },
  footerLink: {
    background: 'none',
    border: 'none',
    color: COLORS.primary,
    fontWeight: '600',
    cursor: 'pointer',
    padding: 0,
    fontSize: '14px',
  },
};

// Add keyframe animation for loading spinner
if (typeof document !== 'undefined' && document.styleSheets.length > 0) {
  const styleSheet = document.styleSheets[0];
  try {
    styleSheet.insertRule(`
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `, styleSheet.cssRules.length);
  } catch (e) {
    // Ignore if rule already exists or cannot be inserted
  }
}

export default LoginPage;