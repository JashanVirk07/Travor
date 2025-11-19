// src/pages/MyProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { bookingService } from '../services/firestoreService';
import { COLORS } from '../utils/colors';
import { Icon } from '../components/Icons';
import ReviewModal from '../components/ReviewModal.jsx';

const MyProfilePage = () => {
  const { 
    currentUser, 
    userProfile, 
    updateUserProfile, 
    uploadProfileImage,
    setCurrentPage 
  } = useAuth();

  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [myBookings, setMyBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);

  const [editData, setEditData] = useState({
    name: '',
    phone: '',
    bio: '',
    location: '',
  });

  useEffect(() => {
    if (userProfile) {
      setEditData({
        name: userProfile.name || '',
        phone: userProfile.phone || '',
        bio: userProfile.bio || '',
        location: userProfile.location || '',
      });
    }
  }, [userProfile]);

  useEffect(() => {
    if (currentUser && activeTab === 'bookings') {
      loadBookings();
    }
  }, [currentUser, activeTab]);

  const loadBookings = async () => {
    setLoadingBookings(true);
    try {
      const bookings = await bookingService.getUserBookings(
        currentUser.uid,
        userProfile?.role || 'traveler'
      );
      setMyBookings(bookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
    }
    setLoadingBookings(false);
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    try {
      await updateUserProfile(editData);
      alert('✅ Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      alert('❌ Failed to update profile: ' + error.message);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      await uploadProfileImage(file);
      alert('✅ Profile image updated!');
    } catch (error) {
      alert('❌ Failed to upload image: ' + error.message);
    }
  };

  const getBookingStatusColor = (status) => {
    const colors = {
      pending: '#ffc107',
      confirmed: '#28a745',
      completed: '#17a2b8',
      cancelled: '#dc3545',
    };
    return colors[status] || '#6c757d';
  };

  if (!currentUser || !userProfile) {
    return (
      <div style={styles.loadingContainer}>
        <p>Loading profile...</p>
      </div>
    );
  }

  const renderOverviewTab = () => (
    <div style={styles.tabContent}>
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIconWrapper}>📅</div>
          <div style={styles.statInfo}>
            <div style={styles.statNumber}>
              {userProfile.role === 'guide' 
                ? userProfile.toursCompleted || 0 
                : myBookings.filter(b => b.status === 'completed').length}
            </div>
            <div style={styles.statLabel}>
              {userProfile.role === 'guide' ? 'Tours Completed' : 'Trips Taken'}
            </div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIconWrapper}>⭐</div>
          <div style={styles.statInfo}>
            <div style={styles.statNumber}>
              {userProfile.role === 'guide' 
                ? userProfile.rating?.toFixed(1) || '0.0'
                : myBookings.length}
            </div>
            <div style={styles.statLabel}>
              {userProfile.role === 'guide' ? 'Average Rating' : 'Total Bookings'}
            </div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIconWrapper}>❤️</div>
          <div style={styles.statInfo}>
            <div style={styles.statNumber}>
              {userProfile.role === 'guide' 
                ? userProfile.reviewCount || 0
                : 5}
            </div>
            <div style={styles.statLabel}>
              {userProfile.role === 'guide' ? 'Reviews' : 'Wishlist Items'}
            </div>
          </div>
        </div>
      </div>

      <div style={styles.infoSection}>
        <h3 style={styles.sectionTitle}>Account Information</h3>
        <div style={styles.infoGrid}>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Email</span>
            <span style={styles.infoValue}>{userProfile.email}</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Role</span>
            <span style={styles.infoValue}>
              {userProfile.role === 'guide' ? '🎯 Guide' : '✈️ Traveler'}
            </span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Member Since</span>
            <span style={styles.infoValue}>
              {userProfile.signupDate 
                ? new Date(userProfile.signupDate).toLocaleDateString()
                : 'N/A'}
            </span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Verification Status</span>
            <span style={styles.infoValue}>
              {userProfile.emailVerified ? '✅ Verified' : '⏳ Pending'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBookingsTab = () => (
  <div style={styles.tabContent}>
    <h3 style={styles.sectionTitle}>
      {userProfile.role === 'guide' ? 'Tour Bookings' : 'My Bookings'}
    </h3>
    {loadingBookings ? (
      <p style={styles.loadingText}>Loading bookings...</p>
    ) : myBookings.length === 0 ? (
      <div style={styles.emptyState}>
        <div style={styles.emptyIcon}>📅</div>
        <p style={styles.emptyText}>No bookings yet</p>
        <button 
          onClick={() => setCurrentPage('destinations')} 
          style={styles.primaryButton}
        >
          Browse Tours
        </button>
      </div>
    ) : (
      <div style={styles.bookingsList}>
        {myBookings.map((booking) => (
          <div key={booking.bookingId} style={styles.bookingCard}>
            <div style={styles.bookingHeader}>
              <h4 style={styles.bookingTitle}>{booking.tourTitle || 'Tour'}</h4>
              <span 
                style={{
                  ...styles.statusBadge,
                  background: getBookingStatusColor(booking.status),
                }}
              >
                {booking.status}
              </span>
            </div>
            <div style={styles.bookingDetails}>
              <div style={styles.bookingDetail}>
                <span>📅</span>
                <span>{booking.startDate || 'Date pending'}</span>
              </div>
              <div style={styles.bookingDetail}>
                <span>👤</span>
                <span>{booking.numberOfParticipants || 1} participants</span>
              </div>
              <div style={styles.bookingDetail}>
                <span style={styles.bookingPrice}>${booking.totalPrice || 0}</span>
              </div>
            </div>
            {booking.ticketNumber && (
              <div style={styles.ticketNumber}>
                Ticket: {booking.ticketNumber}
              </div>
            )}
            
            {/* Add Review Button for completed bookings */}
            {booking.status === 'completed' && userProfile?.role === 'traveler' && (
              <button
                onClick={() => {
                  setSelectedBookingForReview(booking);
                  setShowReviewModal(true);
                }}
                style={styles.reviewButton}
              >
                ⭐ Leave a Review
              </button>
            )}
          </div>
        ))}
      </div>
    )}

    {/* Review Modal */}
    {showReviewModal && selectedBookingForReview && (
      <ReviewModal
        booking={selectedBookingForReview}
        onClose={() => {
          setShowReviewModal(false);
          setSelectedBookingForReview(null);
        }}
        onSuccess={() => {
          loadBookings(); // Reload bookings
        }}
      />
    )}
  </div>
);

  const renderPersonalInfoTab = () => (
    <div style={styles.tabContent}>
      <div style={styles.editHeader}>
        <h3 style={styles.sectionTitle}>Personal Information</h3>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} style={styles.editButton}>
            ✏️ Edit Profile
          </button>
        ) : (
          <div style={styles.editActions}>
            <button onClick={handleSaveProfile} style={styles.saveButton}>
              💾 Save Changes
            </button>
            <button 
              onClick={() => {
                setIsEditing(false);
                setEditData({
                  name: userProfile.name || '',
                  phone: userProfile.phone || '',
                  bio: userProfile.bio || '',
                  location: userProfile.location || '',
                });
              }} 
              style={styles.cancelButton}
            >
              ❌ Cancel
            </button>
          </div>
        )}
      </div>

      <div style={styles.formGrid}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Full Name</label>
          <input
            type="text"
            name="name"
            value={isEditing ? editData.name : userProfile.name || 'Not provided'}
            onChange={handleEditChange}
            disabled={!isEditing}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Phone</label>
          <input
            type="text"
            name="phone"
            value={isEditing ? editData.phone : userProfile.phone || 'Not provided'}
            onChange={handleEditChange}
            disabled={!isEditing}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Location</label>
          <input
            type="text"
            name="location"
            value={isEditing ? editData.location : userProfile.location || 'Not provided'}
            onChange={handleEditChange}
            disabled={!isEditing}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            value={userProfile.email}
            disabled
            style={styles.input}
          />
        </div>

        {userProfile.role === 'guide' && (
          <div style={styles.formGroupFull}>
            <label style={styles.label}>Bio</label>
            <textarea
              name="bio"
              value={isEditing ? editData.bio : userProfile.bio || 'Not provided'}
              onChange={handleEditChange}
              disabled={!isEditing}
              rows="4"
              style={styles.textarea}
            />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Profile Header */}
        <div style={styles.profileHeader}>
          <div style={styles.profileImageSection}>
            <div style={styles.avatarContainer}>
              {userProfile.profileImageUrl ? (
                <img 
                  src={userProfile.profileImageUrl} 
                  alt={userProfile.name} 
                  style={styles.avatar}
                />
              ) : (
                <div style={styles.avatarPlaceholder}>
                  {userProfile.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
              <label style={styles.uploadButton}>
                📷
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>
          <div style={styles.profileInfo}>
            <h1 style={styles.profileName}>{userProfile.name || 'User'}</h1>
            <p style={styles.profileEmail}>{userProfile.email}</p>
            {userProfile.location && (
              <p style={styles.profileLocation}>📍 {userProfile.location}</p>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              ...styles.tab,
              ...(activeTab === 'overview' ? styles.activeTab : {}),
            }}
          >
            👤 Overview
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            style={{
              ...styles.tab,
              ...(activeTab === 'bookings' ? styles.activeTab : {}),
            }}
          >
            📅 {userProfile.role === 'guide' ? 'Tour Bookings' : 'My Bookings'}
          </button>
          <button
            onClick={() => setActiveTab('personal')}
            style={{
              ...styles.tab,
              ...(activeTab === 'personal' ? styles.activeTab : {}),
            }}
          >
            ⚙️ Personal Info
          </button>
        </div>

        {/* Tab Content */}
        <div style={styles.contentArea}>
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'bookings' && renderBookingsTab()}
          {activeTab === 'personal' && renderPersonalInfoTab()}
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    background: COLORS.light,
    padding: '40px 0',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px',
  },
  profileHeader: {
    background: 'white',
    borderRadius: '16px',
    padding: '40px',
    marginBottom: '32px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    display: 'flex',
    gap: '32px',
    alignItems: 'center',
  },
  profileImageSection: {
    position: 'relative',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: `4px solid ${COLORS.primary}`,
  },
  avatarPlaceholder: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    background: COLORS.primary,
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '48px',
    fontWeight: 'bold',
  },
  uploadButton: {
    position: 'absolute',
    bottom: '0',
    right: '0',
    background: COLORS.secondary,
    color: 'white',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: '3px solid white',
    transition: 'all 0.3s',
    fontSize: '20px',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '8px',
  },
  profileEmail: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '4px',
  },
  profileLocation: {
    fontSize: '14px',
    color: '#666',
  },
  tabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '32px',
    background: 'white',
    padding: '8px',
    borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  },
  tab: {
    flex: 1,
    padding: '16px 24px',
    background: 'transparent',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
    color: '#666',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.3s',
  },
  activeTab: {
    background: COLORS.primary,
    color: 'white',
  },
  contentArea: {
    background: 'white',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  },
  tabContent: {
    animation: 'fadeIn 0.3s',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '24px',
    marginBottom: '32px',
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '20px',
    background: COLORS.light,
    borderRadius: '12px',
  },
  statIconWrapper: {
    fontSize: '32px',
  },
  statInfo: {
    flex: 1,
  },
  statNumber: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: '4px',
  },
  statLabel: {
    fontSize: '14px',
    color: '#666',
  },
  infoSection: {
    marginTop: '32px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  infoLabel: {
    fontSize: '14px',
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: '16px',
    color: '#333',
    fontWeight: '500',
  },
  bookingsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  bookingCard: {
    padding: '20px',
    background: COLORS.light,
    borderRadius: '12px',
    border: `1px solid ${COLORS.border}`,
  },
  bookingHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  bookingTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    color: 'white',
    textTransform: 'uppercase',
  },
  bookingDetails: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
  },
  bookingDetail: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#666',
  },
  bookingPrice: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  ticketNumber: {
    marginTop: '12px',
    padding: '8px 12px',
    background: 'white',
    borderRadius: '8px',
    fontSize: '12px',
    color: '#666',
    fontFamily: 'monospace',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '16px',
  },
  emptyText: {
    fontSize: '16px',
    color: '#666',
    marginTop: '16px',
    marginBottom: '24px',
  },
  primaryButton: {
    padding: '12px 32px',
    background: COLORS.primary,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  editHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  editButton: {
    padding: '10px 20px',
    background: COLORS.primary,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  editActions: {
    display: 'flex',
    gap: '12px',
  },
  saveButton: {
    padding: '10px 20px',
    background: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  cancelButton: {
    padding: '10px 20px',
    background: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  formGroupFull: {
    gridColumn: '1 / -1',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
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
  textarea: {
    padding: '12px',
    border: `2px solid ${COLORS.border}`,
    borderRadius: '8px',
    fontSize: '16px',
    fontFamily: 'inherit',
    outline: 'none',
    resize: 'vertical',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
  },
  loadingText: {
    textAlign: 'center',
    padding: '40px',
    color: '#666',
  },
  reviewButton: {
  marginTop: '12px',
  padding: '10px 20px',
  background: COLORS.secondary,
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
  width: '100%',
},
};

export default MyProfilePage;