import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { tourService, bookingService } from '../services/firestoreService'; // Added bookingService
import { COLORS } from '../utils/colors';

const GuideDashboardPage = () => {
  const { currentUser, userProfile, setCurrentPage } = useAuth();
  const [myTours, setMyTours] = useState([]);
  const [myBookings, setMyBookings] = useState([]); // NEW: Track bookings
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    price: '',
    duration: '',
    category: 'city',
    maxParticipants: '',
    meetingPoint: '',
    difficulty: 'easy',
  });

  useEffect(() => {
    if (currentUser && userProfile?.role === 'guide') {
      loadGuideData();
    }
  }, [currentUser, userProfile]);

  const loadGuideData = async () => {
    setLoading(true);
    try {
      // Load Tours
      const tours = await tourService.getGuideTours(currentUser.uid);
      setMyTours(tours);

      // Load Bookings (NEW)
      const bookings = await bookingService.getGuideBookings(currentUser.uid);
      setMyBookings(bookings);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // NEW: Function to initiate chat with traveler
  const handleMessageTraveler = (booking) => {
      sessionStorage.setItem('chatWithGuide', JSON.stringify({
          // When guide starts chat, 'guideId' logic in MessagesPage will be flipped 
          // because the MessagesPage logic handles "Other User".
          // So we pass the traveler's ID as the target.
          guideId: booking.travelerId || booking.userId, 
          guideName: booking.travelerName || 'Traveler'
      }));
      setCurrentPage('messages');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tourData = {
        ...formData,
        price: parseFloat(formData.price),
        maxParticipants: parseInt(formData.maxParticipants),
        images: ['https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'],
        highlights: ['Professional guide', 'Local experience', 'Memorable moments'],
        included: ['Guide services', 'Itinerary planning'],
        languages: userProfile?.languages || ['English'],
      };

      await tourService.createTour(currentUser.uid, tourData);
      alert('✅ Tour created successfully!');
      setShowCreateForm(false);
      setFormData({
        title: '',
        description: '',
        location: '',
        price: '',
        duration: '',
        category: 'city',
        maxParticipants: '',
        meetingPoint: '',
        difficulty: 'easy',
      });
      loadGuideData(); // Refresh both
    } catch (error) {
      console.error('Error creating tour:', error);
      alert('❌ Failed to create tour: ' + error.message);
    }
  };

  if (!currentUser || userProfile?.role !== 'guide') {
    return (
      <div style={styles.errorContainer}>
        <h2>Access Denied</h2>
        <p>This page is only accessible to registered guides.</p>
        <button onClick={() => setCurrentPage('register')} style={styles.button}>
          Become a Guide
        </button>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>My Guide Dashboard</h1>
            <p style={styles.subtitle}>Welcome back, {userProfile?.name}! 👋</p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            style={styles.createButton}
          >
            {showCreateForm ? '✖ Cancel' : '+ Create New Tour'}
          </button>
        </div>

        {/* Stats Cards */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>🎯</div>
            <div>
              <div style={styles.statNumber}>{myTours.length}</div>
              <div style={styles.statLabel}>Total Tours</div>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>⭐</div>
            <div>
              <div style={styles.statNumber}>{userProfile?.rating?.toFixed(1) || '0.0'}</div>
              <div style={styles.statLabel}>Average Rating</div>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>📅</div>
            <div>
              <div style={styles.statNumber}>{myBookings.length}</div>
              <div style={styles.statLabel}>Total Bookings</div>
            </div>
          </div>
        </div>

        {/* Create Tour Form */}
        {showCreateForm && (
          <div style={styles.formContainer}>
            <h2 style={styles.formTitle}>Create New Tour</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Tour Title *</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required style={styles.input} placeholder="e.g., Hidden Gems of Barcelona" />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Description *</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required rows="4" style={styles.textarea} placeholder="Describe your tour experience..." />
              </div>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Location *</label>
                  <input type="text" name="location" value={formData.location} onChange={handleChange} required style={styles.input} placeholder="City, Country" />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Price (USD) *</label>
                  <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" style={styles.input} placeholder="50" />
                </div>
              </div>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Duration *</label>
                  <input type="text" name="duration" value={formData.duration} onChange={handleChange} required style={styles.input} placeholder="e.g., 3 hours" />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Max Participants *</label>
                  <input type="number" name="maxParticipants" value={formData.maxParticipants} onChange={handleChange} required min="1" style={styles.input} placeholder="10" />
                </div>
              </div>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Category *</label>
                  <select name="category" value={formData.category} onChange={handleChange} style={styles.input}>
                    <option value="city">City Breaks</option>
                    <option value="beach">Beach & Island</option>
                    <option value="mountain">Mountain Treks</option>
                    <option value="cultural">Cultural Heritage</option>
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Difficulty *</label>
                  <select name="difficulty" value={formData.difficulty} onChange={handleChange} style={styles.input}>
                    <option value="easy">Easy</option>
                    <option value="moderate">Moderate</option>
                    <option value="challenging">Challenging</option>
                  </select>
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Meeting Point *</label>
                <input type="text" name="meetingPoint" value={formData.meetingPoint} onChange={handleChange} required style={styles.input} placeholder="e.g., Main Square, City Center" />
              </div>
              <button type="submit" style={styles.submitButton}>Create Tour</button>
            </form>
          </div>
        )}

        {/* NEW: Recent Bookings Section */}
        <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Recent Bookings</h2>
            {myBookings.length === 0 ? (
                <div style={styles.emptyState}>
                    <p style={styles.emptyText}>No bookings yet.</p>
                </div>
            ) : (
                <div style={styles.bookingsGrid}>
                    {myBookings.map(booking => (
                        <div key={booking.bookingId} style={styles.bookingCard}>
                            <div style={styles.bookingHeader}>
                                <h3 style={styles.bookingTitle}>{booking.tourTitle}</h3>
                                <span style={{
                                    ...styles.statusBadge, 
                                    background: booking.status === 'confirmed' ? '#d1fae5' : '#fff3cd',
                                    color: booking.status === 'confirmed' ? '#065f46' : '#856404'
                                }}>
                                    {booking.status}
                                </span>
                            </div>
                            <div style={styles.bookingDetails}>
                                <p><strong>Traveler:</strong> {booking.travelerName || 'User'}</p>
                                <p><strong>Date:</strong> {booking.startDate?.toDate ? booking.startDate.toDate().toLocaleDateString() : booking.startDate}</p>
                                <p><strong>Guests:</strong> {booking.numberOfParticipants}</p>
                            </div>
                            {/* NEW BUTTON: Message Traveler */}
                            <button 
                                onClick={() => handleMessageTraveler(booking)} 
                                style={styles.messageButton}
                            >
                                💬 Message Traveler
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* Existing Tours Section */}
        <div style={styles.toursSection}>
          <h2 style={styles.sectionTitle}>My Tours ({myTours.length})</h2>
          {loading ? (
            <p style={styles.loadingText}>Loading your tours...</p>
          ) : myTours.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>📋</div>
              <p style={styles.emptyText}>You haven't created any tours yet.</p>
              <p style={styles.emptySubtext}>Click "Create New Tour" to get started!</p>
            </div>
          ) : (
            <div style={styles.toursGrid}>
              {myTours.map((tour) => (
                <div key={tour.tourId} style={styles.tourCard}>
                  <div style={styles.tourHeader}>
                    <h3 style={styles.tourTitle}>{tour.title}</h3>
                    <span style={tour.isActive ? styles.statusActive : styles.statusInactive}>
                      {tour.isActive ? '✅ Active' : '❌ Inactive'}
                    </span>
                  </div>
                  <p style={styles.tourLocation}>📍 {tour.location}</p>
                  <div style={styles.tourDetails}>
                    <span><strong>${tour.price}</strong></span>
                    <span>•</span>
                    <span>{tour.duration}</span>
                    <span>•</span>
                    <span>{tour.category}</span>
                  </div>
                  <div style={styles.tourStats}>
                    <span>⭐ {tour.averageRating?.toFixed(1) || 'New'}</span>
                    <span>👥 {tour.bookings || 0} bookings</span>
                  </div>
                </div>
              ))}
            </div>
          )}
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '40px',
    flexWrap: 'wrap',
    gap: '20px',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
  },
  createButton: {
    padding: '12px 24px',
    background: COLORS.primary,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'all 0.3s',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '24px',
    marginBottom: '40px',
  },
  statCard: {
    background: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  statIcon: {
    fontSize: '40px',
  },
  statNumber: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: '14px',
    color: '#666',
  },
  formContainer: {
    background: 'white',
    padding: '32px',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    marginBottom: '40px',
  },
  formTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '24px',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  formGroup: {
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
    transition: 'border 0.3s',
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
  submitButton: {
    padding: '16px',
    background: COLORS.primary,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '20px',
    transition: 'all 0.3s',
  },
  // Bookings Section Styles
  bookingsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '20px',
      marginTop: '20px'
  },
  bookingCard: {
      background: 'white',
      padding: '20px',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      border: `1px solid ${COLORS.border}`
  },
  bookingHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '12px'
  },
  bookingTitle: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#333'
  },
  statusBadge: {
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: '600'
  },
  bookingDetails: {
      fontSize: '14px',
      color: '#666',
      lineHeight: '1.6',
      marginBottom: '16px'
  },
  messageButton: {
      width: '100%',
      padding: '10px',
      background: 'white',
      border: `1px solid ${COLORS.primary}`,
      color: COLORS.primary,
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
      transition: '0.2s'
  },
  // Existing styles
  toursSection: {
    marginTop: '40px',
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '24px',
    color: '#333',
  },
  loadingText: {
    textAlign: 'center',
    padding: '40px',
    color: '#666',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    background: 'white',
    borderRadius: '12px',
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '16px',
  },
  emptyText: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '8px',
  },
  emptySubtext: {
    color: '#666',
  },
  toursGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '24px',
  },
  tourCard: {
    background: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  },
  tourHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginBottom: '12px',
    gap: '12px',
  },
  tourTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  statusActive: {
    fontSize: '12px',
    padding: '4px 8px',
    background: '#d4edda',
    color: '#155724',
    borderRadius: '4px',
    whiteSpace: 'nowrap',
  },
  statusInactive: {
    fontSize: '12px',
    padding: '4px 8px',
    background: '#f8d7da',
    color: '#721c24',
    borderRadius: '4px',
    whiteSpace: 'nowrap',
  },
  tourLocation: {
    color: '#666',
    marginBottom: '12px',
  },
  tourDetails: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    color: '#666',
    fontSize: '14px',
    marginBottom: '12px',
  },
  tourStats: {
    display: 'flex',
    gap: '16px',
    fontSize: '14px',
    color: '#666',
    paddingTop: '12px',
    borderTop: `1px solid ${COLORS.border}`,
  },
  errorContainer: {
    textAlign: 'center',
    padding: '100px 20px',
    minHeight: '100vh',
  },
  button: {
    padding: '12px 24px',
    background: COLORS.primary,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '20px',
    fontSize: '16px',
    fontWeight: '600',
  },
};

export default GuideDashboardPage;