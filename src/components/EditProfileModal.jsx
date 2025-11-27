import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../utils/colors';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore'; // Import arrayUnion
import { db } from '../firebase'; // Import db

const EditProfileModal = ({ isOpen, onClose, onSuccess }) => {
  const { currentUser, userProfile, updateUserProfile, uploadProfileImage } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // --- NEW: Certifications State ---
  const [newCert, setNewCert] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    bio: '',
    location: '',
    languages: [],
  });

  const languageOptions = [
    'English', 'Spanish', 'French', 'German', 'Italian',
    'Portuguese', 'Chinese', 'Japanese', 'Korean', 'Arabic',
    'Hindi', 'Russian', 'Dutch', 'Swedish', 'Norwegian'
  ];

  useEffect(() => {
    if (isOpen && userProfile) {
      setFormData({
        name: userProfile.name || userProfile.fullName || '',
        phone: userProfile.phone || '',
        bio: userProfile.bio || '',
        location: userProfile.location || '',
        languages: userProfile.languages || [],
      });
      setImagePreview(userProfile.profileImageUrl || null);
      setImageFile(null);
      setError('');
      setNewCert(''); // Reset cert input
    }
  }, [isOpen, userProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleLanguageToggle = (language) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(lang => lang !== language)
        : [...prev.languages, language]
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      setError('');
    }
  };

  // --- NEW: Handle Add Certification ---
  const handleAddCert = async () => {
      if(!newCert.trim()) return;
      try {
          // We update Firestore directly to avoid overriding other fields or dealing with complex state sync
          // This is a "quick add" action
          const userRef = doc(db, 'users', userProfile.id);
          await updateDoc(userRef, {
              certifications: arrayUnion(newCert.trim())
          });
          
          // If guide, sync
          if(userProfile.role === 'guide') {
              await updateDoc(doc(db, 'guides', userProfile.id), {
                  certifications: arrayUnion(newCert.trim())
              });
          }
          
          alert("Certification added!");
          setNewCert('');
      } catch(err) {
          console.error("Error adding cert:", err);
          setError("Failed to add certification");
      }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.name.trim()) throw new Error('Name is required');

      if (userProfile?.role === 'guide') {
        if (!formData.location.trim()) throw new Error('Location is required for guides');
        if (formData.languages.length === 0) throw new Error('Please select at least one language');
      }

      let imageUrl = userProfile?.profileImageUrl;

      if (imageFile) {
        const uploadResult = await Promise.race([
          uploadProfileImage(imageFile),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Upload timeout')), 60000))
        ]);
        
        if (uploadResult.success) {
          imageUrl = uploadResult.imageUrl;
        } else {
          throw new Error(uploadResult.error || 'Failed to upload image');
        }
      }

      const updateData = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        bio: formData.bio.trim(),
        location: formData.location.trim(),
        languages: formData.languages,
      };

      if (imageUrl && imageUrl !== userProfile?.profileImageUrl) {
        updateData.profileImageUrl = imageUrl;
      }

      const result = await updateUserProfile(updateData);

      if (result.success) {
        setImageFile(null);
        onSuccess();
        onClose();
        alert('✅ Profile updated successfully!');
      } else {
        throw new Error(result.error || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setImageFile(null);
    setImagePreview(userProfile?.profileImageUrl || null);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={handleClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>Edit Profile</h2>
          <button onClick={handleClose} style={styles.closeButton} disabled={loading}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.imageSection}>
            <div style={styles.imagePreviewContainer}>
              {imagePreview ? (
                <img src={imagePreview} alt="Profile" style={styles.imagePreview} />
              ) : (
                <div style={styles.imagePlaceholder}>{formData.name?.charAt(0)?.toUpperCase() || 'U'}</div>
              )}
            </div>
            <div style={styles.imageUploadSection}>
              <label htmlFor="profileImage" style={styles.uploadButton}>📷 Change Photo</label>
              <input type="file" id="profileImage" accept="image/*" onChange={handleImageChange} style={styles.fileInput} disabled={loading} />
              <span style={styles.imageHint}>JPG, PNG or GIF (Max 5MB)</span>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Full Name *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your full name" style={styles.input} disabled={loading} required />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input type="email" value={currentUser?.email} style={{ ...styles.input, ...styles.readOnlyInput }} disabled />
            <span style={styles.hint}>Email cannot be changed</span>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Phone Number</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 234 567 8900" style={styles.input} disabled={loading} />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Location {userProfile?.role === 'guide' && '*'}</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="City, Country" style={styles.input} disabled={loading} required={userProfile?.role === 'guide'} />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Bio</label>
            <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Tell us about yourself..." rows="4" style={styles.textarea} disabled={loading} />
          </div>

          {userProfile?.role === 'guide' && (
            <>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Languages You Speak *</label>
                    <div style={styles.languageGrid}>
                    {languageOptions.map((language) => (
                        <button key={language} type="button" onClick={() => handleLanguageToggle(language)}
                        style={{ ...styles.languageButton, ...(formData.languages.includes(language) ? styles.languageButtonActive : {}) }}
                        disabled={loading}>
                        {language}
                        </button>
                    ))}
                    </div>
                </div>

                {/* --- NEW: Certifications Input --- */}
                <div style={styles.formGroup}>
                    <label style={styles.label}>Add Certification (Optional)</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input 
                            value={newCert} 
                            onChange={(e) => setNewCert(e.target.value)} 
                            placeholder="e.g. First Aid Certified"
                            style={styles.input} 
                        />
                        <button type="button" onClick={handleAddCert} style={styles.smallBtn}>Add</button>
                    </div>
                    <span style={styles.hint}>Click 'Add' to save certification instantly</span>
                </div>
            </>
          )}

          {error && <div style={styles.errorBox}>⚠️ {error}</div>}

          <div style={styles.actions}>
            <button type="button" onClick={handleClose} style={styles.cancelButton} disabled={loading}>Cancel</button>
            <button type="submit" style={{ ...styles.saveButton, ...(loading ? styles.saveButtonDisabled : {}) }} disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0, 0, 0, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '20px',
  },
  modal: {
    background: 'white', borderRadius: '16px', maxWidth: '700px', width: '100%', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', borderBottom: `1px solid ${COLORS.border}`, position: 'sticky', top: 0, background: 'white', zIndex: 10,
  },
  title: { fontSize: '24px', fontWeight: 'bold', color: '#333', margin: 0 },
  closeButton: { background: 'transparent', border: 'none', fontSize: '24px', color: '#666', cursor: 'pointer', padding: '0', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  form: { padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' },
  imageSection: { display: 'flex', alignItems: 'center', gap: '24px', padding: '20px', background: COLORS.light, borderRadius: '12px' },
  imagePreviewContainer: { flexShrink: 0 },
  imagePreview: { width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: `4px solid ${COLORS.primary}` },
  imagePlaceholder: { width: '100px', height: '100px', borderRadius: '50%', background: COLORS.primary, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', fontWeight: 'bold', border: `4px solid ${COLORS.primary}` },
  imageUploadSection: { display: 'flex', flexDirection: 'column', gap: '8px' },
  uploadButton: { display: 'inline-block', padding: '10px 20px', background: COLORS.primary, color: 'white', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', textAlign: 'center' },
  fileInput: { display: 'none' },
  imageHint: { fontSize: '12px', color: '#666' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '14px', fontWeight: '600', color: '#333' },
  input: { padding: '12px', border: `2px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '16px', outline: 'none', transition: 'border 0.3s' },
  readOnlyInput: { background: '#f5f5f5', cursor: 'not-allowed' },
  textarea: { padding: '12px', border: `2px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '16px', fontFamily: 'inherit', outline: 'none', resize: 'vertical', minHeight: '100px' },
  hint: { fontSize: '12px', color: '#999' },
  languageGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '8px' },
  languageButton: { padding: '10px 12px', border: `2px solid ${COLORS.border}`, borderRadius: '8px', background: 'white', color: '#666', fontSize: '14px', fontWeight: '500', cursor: 'pointer', transition: 'all 0.3s' },
  languageButtonActive: { background: COLORS.primary, color: 'white', borderColor: COLORS.primary },
  errorBox: { padding: '12px', background: '#fee', border: `1px solid ${COLORS.danger}`, borderRadius: '8px', color: COLORS.danger, fontSize: '14px' },
  actions: { display: 'flex', gap: '12px', paddingTop: '16px', borderTop: `1px solid ${COLORS.border}` },
  cancelButton: { flex: 1, padding: '14px', background: 'white', border: `2px solid ${COLORS.border}`, color: '#666', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' },
  saveButton: { flex: 2, padding: '14px', background: COLORS.primary, color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' },
  saveButtonDisabled: { opacity: 0.6, cursor: 'not-allowed' },
  // Small Button for Certs
  smallBtn: { padding: '0 20px', background: '#e0e0e0', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }
};

export default EditProfileModal;