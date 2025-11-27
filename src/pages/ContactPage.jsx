import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { contactService } from '../services/firestoreService';
import { COLORS } from '../utils/colors';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactPage = () => {
  const { currentUser, userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
    role: 'traveler'
  });

  // Pre-fill if user is logged in
  useEffect(() => {
    if (userProfile) {
      setFormData(prev => ({
        ...prev,
        name: userProfile.name || userProfile.fullName || '',
        email: currentUser.email || '',
        role: userProfile.role || 'traveler'
      }));
    }
  }, [userProfile, currentUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await contactService.submitInquiry({
        ...formData,
        userId: currentUser ? currentUser.uid : 'anonymous'
      });
      setSuccess(true);
      setFormData({ ...formData, message: '', subject: 'General Inquiry' }); // Reset message
    } catch (error) {
      alert("Failed to send message. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Contact Us</h1>
          <p style={styles.subtitle}>We are here to help travelers and guides alike.</p>
        </div>

        <div style={styles.grid}>
          {/* Contact Info Side */}
          <div style={styles.infoCard}>
            <h3 style={styles.cardTitle}>Get in Touch</h3>
            <p style={styles.cardText}>Have questions about booking, payments, or becoming a guide? Reach out to us.</p>
            
            <div style={styles.infoItem}>
              <Mail style={styles.icon} />
              <span>support@travor.com</span>
            </div>
            <div style={styles.infoItem}>
              <Phone style={styles.icon} />
              <span>+1 (800) 123-4567</span>
            </div>
            <div style={styles.infoItem}>
              <MapPin style={styles.icon} />
              <span>Vancouver, BC, Canada</span>
            </div>
          </div>

          {/* Form Side */}
          <div style={styles.formCard}>
            {success ? (
              <div style={styles.successState}>
                <div style={{fontSize: '48px', marginBottom: '16px'}}>✅</div>
                <h3>Message Sent!</h3>
                <p>We have received your message and will get back to you within 24 hours.</p>
                <button onClick={() => setSuccess(false)} style={styles.buttonOutline}>Send Another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Name</label>
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
                  <label style={styles.label}>Subject</label>
                  <select 
                    name="subject" 
                    value={formData.subject} 
                    onChange={handleChange} 
                    style={styles.input}
                  >
                    <option>General Inquiry</option>
                    <option>Booking Issue</option>
                    <option>Payment Problem</option>
                    <option>Guide Verification</option>
                    <option>Report a User</option>
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Message</label>
                  <textarea 
                    name="message" 
                    value={formData.message} 
                    onChange={handleChange} 
                    rows="5" 
                    style={styles.textarea} 
                    required 
                    placeholder="How can we help you?"
                  />
                </div>

                <button type="submit" disabled={loading} style={styles.submitButton}>
                  {loading ? 'Sending...' : <><Send size={18} style={{marginRight:8}} /> Send Message</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '80vh', background: '#f3f4f6', padding: '40px 20px' },
  container: { maxWidth: '1000px', margin: '0 auto' },
  header: { textAlign: 'center', marginBottom: '40px' },
  title: { fontSize: '36px', fontWeight: 'bold', color: '#111', marginBottom: '10px' },
  subtitle: { fontSize: '18px', color: '#666' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '30px', '@media (max-width: 768px)': { gridTemplateColumns: '1fr' } },
  infoCard: { background: COLORS.primary, color: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
  cardTitle: { fontSize: '24px', marginBottom: '16px', fontWeight: 'bold' },
  cardText: { marginBottom: '30px', lineHeight: '1.6', opacity: 0.9 },
  infoItem: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', fontSize: '16px' },
  icon: { opacity: 0.8 },
  formCard: { background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontWeight: '600', fontSize: '14px', color: '#333' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px', outline: 'none' },
  textarea: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px', outline: 'none', resize: 'vertical', fontFamily: 'inherit' },
  submitButton: { padding: '14px', background: COLORS.primary, color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' },
  successState: { textAlign: 'center', padding: '40px 0' },
  buttonOutline: { marginTop: '20px', padding: '10px 20px', background: 'transparent', border: `2px solid ${COLORS.primary}`, color: COLORS.primary, borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }
};

export default ContactPage;