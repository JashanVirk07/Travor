import React, { useState } from 'react';
import { sendEmailVerification } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../utils/colors';

const EmailVerification = () => {
  const { currentUser } = useAuth();
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');

  const handleResend = async () => {
    setSending(true);
    setMessage('');

    try {
      await sendEmailVerification(currentUser);
      setMessage('Verification email sent! Please check your inbox.');
    } catch (error) {
      setMessage('Failed to send email. Please try again later.');
    } finally {
      setSending(false);
    }
  };

  if (currentUser?.emailVerified) {
    return null;
  }

  return (
    <div style={styles.banner}>
      <p style={styles.text}>
        📧 Please verify your email address to access all features.
      </p>
      <button style={styles.button} onClick={handleResend} disabled={sending}>
        {sending ? 'Sending...' : 'Resend Email'}
      </button>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};

const styles = {
  banner: {
    background: '#fff3cd',
    border: '1px solid #ffc107',
    padding: '16px',
    borderRadius: '8px',
    margin: '16px',
    textAlign: 'center',
  },
  text: {
    margin: '0 0 12px 0',
    color: '#856404',
  },
  button: {
    padding: '8px 16px',
    background: COLORS.primary,
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  message: {
    marginTop: '12px',
    fontSize: '14px',
    color: '#856404',
  },
};

export default EmailVerification;