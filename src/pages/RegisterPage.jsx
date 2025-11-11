// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { COLORS } from '../utils/colors';
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle,
  Globe
} from 'lucide-react';

const RegisterPage = () => {
  const { register, authError, clearError, setCurrentPage } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    location: '',
    role: 'traveler',
    languages: [],
    bio: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState(1); // Multi-step form

  const languageOptions = [
    'English', 'Spanish', 'French', 'German', 'Italian', 
    'Portuguese', 'Chinese', 'Japanese', 'Korean', 'Arabic'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
    setSuccess('');
    clearError();
  };

  const handleLanguageToggle = (language) => {
    const languages = formData.languages.includes(language)
      ? formData.languages.filter(lang => lang !== language)
      : [...formData.languages, language];
    
    setFormData({ ...formData, languages });
  };

  const validateStep1 = () => {
    if (!formData.name.trim()) {
      setError('Please enter your full name');
      return false;
    }

    if (formData.name.trim().length < 3) {
      setError('Name must be at least 3 characters long');
      return false;
    }

    if (!formData.email) {
      setError('Please enter your email address');
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (!formData.password) {
      setError('Please enter a password');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(formData.password)) {
      setError('Password must contain at least one uppercase letter, one lowercase letter, and one number');
      return false;
    }

    return true;
  };

  const validateStep2 = () => {
    if (formData.role === 'guide') {
      if (formData.languages.length === 0) {
        setError('Please select at least one language');
        return false;
      }

      if (!formData.location.trim()) {
        setError('Please enter your location');
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    setError('');
    
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setError('');
    setStep(1);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateStep1() || !validateStep2()) {
      return;
    }

    setLoading(true);

    try {
      const result = await register(formData.email, formData.password, {
        name: formData.name,
        role: formData.role,
        phone: formData.phone,
        location: formData.location,
        languages: formData.languages,
        bio: formData.bio,
      });

      if (result.success) {
        setSuccess(result.message);
        setTimeout(() => {
          setCurrentPage('login');
        }, 3000);
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Join Travor</h1>
          <p style={styles.subtitle}>
            Create your account and start exploring with local guides
          </p>
        </div>

        {/* Progress Indicator */}
        <div style={styles.progressContainer}>
          <div style={styles.progressBar}>
            <div 
              style={{
                ...styles.progressFill,
                width: step === 1 ? '50%' : '100%',
              }}
            />
          </div>
          <div style={styles.stepLabels}>
            <span style={{...styles.stepLabel, ...(step === 1 ? styles.stepLabelActive : {})}}>
              Account Info
            </span>
            <span style={{...styles.stepLabel, ...(step === 2 ? styles.stepLabelActive : {})}}>
              Profile Details
            </span>
          </div>
        </div>

        <form onSubmit={handleRegister} style={styles.form}>
          {step === 1 ? (
            // Step 1: Basic Information
            <>
              {/* Role Selection */}
              <div style={styles.roleSelector}>
                <label style={styles.roleSelectorLabel}>I want to:</label>
                <div style={styles.roleButtons}>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'traveler' })}
                    style={{
                      ...styles.roleButton,
                      ...(formData.role === 'traveler' ? styles.roleButtonActive : {}),
                    }}
                    disabled={loading}
                  >
                    <User size={20} style={{ marginRight: '8px' }} />
                    Find Guides
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'guide' })}
                    style={{
                      ...styles.roleButton,
                      ...(formData.role === 'guide' ? styles.roleButtonActive : {}),
                    }}
                    disabled={loading}
                  >
                    <MapPin size={20} style={{ marginRight: '8px' }} />
                    Become a Guide
                  </button>
                </div>
              </div>

              {/* Name */}
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <User size={16} style={styles.labelIcon} />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  style={styles.input}
                  disabled={loading}
                  required
                />
              </div>

              {/* Email */}
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

              {/* Password */}
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
                    placeholder="Create a strong password"
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
                <span style={styles.hint}>
                  At least 6 characters with uppercase, lowercase, and numbers
                </span>
              </div>

              {/* Confirm Password */}
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <Lock size={16} style={styles.labelIcon} />
                  Confirm Password
                </label>
                <div style={styles.passwordContainer}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter your password"
                    style={styles.passwordInput}
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeButton}
                    disabled={loading}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleNext}
                style={styles.nextButton}
                disabled={loading}
              >
                Continue
              </button>
            </>
          ) : (
            // Step 2: Additional Details
            <>
              {/* Phone (Optional) */}
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <Phone size={16} style={styles.labelIcon} />
                  Phone Number <span style={styles.optional}>(Optional)</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 234 567 8900"
                  style={styles.input}
                  disabled={loading}
                />
              </div>

              {/* Location (Required for Guides) */}
              {formData.role === 'guide' && (
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <MapPin size={16} style={styles.labelIcon} />
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City, Country"
                    style={styles.input}
                    disabled={loading}
                    required
                  />
                </div>
              )}

              {/* Languages (Required for Guides) */}
              {formData.role === 'guide' && (
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <Globe size={16} style={styles.labelIcon} />
                    Languages You Speak
                  </label>
                  <div style={styles.languageGrid}>
                    {languageOptions.map((language) => (
                      <button
                        key={language}
                        type="button"
                        onClick={() => handleLanguageToggle(language)}
                        style={{
                          ...styles.languageButton,
                          ...(formData.languages.includes(language) ? styles.languageButtonActive : {}),
                        }}
                        disabled={loading}
                      >
                        {language}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Bio (Optional for Guides) */}
              {formData.role === 'guide' && (
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    Bio <span style={styles.optional}>(Optional)</span>
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell travelers about yourself..."
                    style={styles.textarea}
                    rows="4"
                    disabled={loading}
                  />
                </div>
              )}

              {/* Guide Info Box */}
              {formData.role === 'guide' && (
                <div style={styles.infoBox}>
                  <p style={styles.infoText}>
                    🎉 <strong>First Year Free!</strong> New guides get a complimentary 
                    one-year membership (normally $10/year). Verification required after registration.
                  </p>
                </div>
              )}

              <div style={styles.buttonGroup}>
                <button
                  type="button"
                  onClick={handleBack}
                  style={styles.backButton}
                  disabled={loading}
                >
                  Back
                </button>
                <button
                  type="submit"
                  style={{
                    ...styles.submitButton,
                    ...(loading ? styles.submitButtonDisabled : {}),
                  }}
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>
            </>
          )}

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
        </form>

        {/* Login Link */}
        <div style={styles.footer}>
          <p style={styles.footerText}>
            Already have an account?{' '}
            <button
              onClick={() => setCurrentPage('login')}
              style={styles.footerLink}
              disabled={loading}
            >
              Sign in
            </button>
          </p>
        </div>
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
    maxWidth: '600px',
    background: 'white',
    borderRadius: '20px',
    padding: '48px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px',
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
  progressContainer: {
    marginBottom: '32px',
  },
  progressBar: {
    height: '4px',
    background: COLORS.border,
    borderRadius: '2px',
    overflow: 'hidden',
    marginBottom: '12px',
  },
  progressFill: {
    height: '100%',
    background: COLORS.primary,
    transition: 'width 0.3s ease',
  },
  stepLabels: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  stepLabel: {
    fontSize: '13px',
    color: '#999',
    fontWeight: '500',
  },
  stepLabelActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  roleSelector: {
    padding: '20px',
    background: COLORS.light,
    borderRadius: '12px',
    marginBottom: '8px',
  },
  roleSelectorLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '12px',
    display: 'block',
  },
  roleButtons: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  roleButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '14px',
    border: `2px solid ${COLORS.border}`,
    borderRadius: '10px',
    background: 'white',
    color: '#666',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
    fontSize: '15px',
  },
  roleButtonActive: {
    background: COLORS.primary,
    color: 'white',
    borderColor: COLORS.primary,
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
  optional: {
    fontSize: '12px',
    color: '#999',
    fontWeight: '400',
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
  },
  hint: {
    fontSize: '12px',
    color: '#999',
    marginTop: '-4px',
  },
  languageGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    gap: '8px',
  },
  languageButton: {
    padding: '10px 12px',
    border: `2px solid ${COLORS.border}`,
    borderRadius: '8px',
    background: 'white',
    color: '#666',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  languageButtonActive: {
    background: COLORS.primary,
    color: 'white',
    borderColor: COLORS.primary,
  },
  textarea: {
    padding: '14px 16px',
    border: `2px solid ${COLORS.border}`,
    borderRadius: '10px',
    fontSize: '16px',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
    minHeight: '100px',
  },
  infoBox: {
    padding: '16px',
    background: '#e3f2fd',
    border: '2px solid #2196f3',
    borderRadius: '10px',
  },
  infoText: {
    fontSize: '14px',
    color: '#1976d2',
    lineHeight: '1.6',
    margin: 0,
  },
  buttonGroup: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '12px',
    marginTop: '8px',
  },
  nextButton: {
    padding: '16px',
    background: COLORS.primary,
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px',
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
  },
  submitButtonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
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

export default RegisterPage;