// ... existing imports ...
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { tourService, guideService, reviewService } from '../services/firestoreService';
import { COLORS } from '../utils/colors';

const TourDetailsPage = () => {
  const { currentUser, userProfile, setCurrentPage } = useAuth();
  // ... existing state ...
  const [tour, setTour] = useState(null);
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [reviews, setReviews] = useState([]);
  
  const tourId = sessionStorage.getItem('selectedTourId');
  const [bookingData, setBookingData] = useState({
    startDate: '',
    numberOfParticipants: 1,
    specialRequests: '',
  });

  useEffect(() => {
    if (tourId) {
      loadTourDetails();
    }
  }, [tourId]);

  const loadTourDetails = async () => {
    setLoading(true);
    try {
      const tourData = await tourService.getTourById(tourId);
      setTour(tourData);

      if (tourData?.guideId) {
        const guideData = await guideService.getGuideProfile(tourData.guideId);
        setGuide(guideData);
      }

      if (tourData?.tourId) {
        const tourReviews = await reviewService.getTourReviews(tourData.tourId);
        setReviews(tourReviews);
      }
    } catch (error) {
      console.error('Error loading tour details:', error);
    }
    setLoading(false);
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingData({ ...bookingData, [name]: value });
  };

  // === UPDATED: Booking Restriction Logic ===
  const handleBookNow = () => {
    if (!currentUser) {
      alert('Please login to book a tour');
      setCurrentPage('login');
      return;
    }

    // Prevent Guides from booking
    if (userProfile?.role === 'guide') {
      alert('Guides cannot book tours. Please use a traveler account.');
      return;
    }

    // NEW: Prevent Admins from booking
    if (userProfile?.role === 'admin') {
      alert('Admins cannot book tours. Please use a traveler account.');
      return;
    }

    setShowBookingForm(true);
  };

  const handleSubmitBooking = (e) => {
    e.preventDefault();
    
    const bookingInfo = {
      tour,
      guide,
      ...bookingData,
      startTime: tour.startTime || '09:00',
      duration: tour.duration, 
      totalPrice: tour.price * bookingData.numberOfParticipants,
    };

    sessionStorage.setItem('pendingBooking', JSON.stringify(bookingInfo));
    setCurrentPage('booking-confirmation');
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loader}>Loading tour details...</div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div style={styles.errorContainer}>
        <h2>Tour Not Found</h2>
        <p>The tour you're looking for doesn't exist.</p>
        <button onClick={() => setCurrentPage('destinations')} style={styles.button}>
          Browse All Tours
        </button>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Hero Image */}
        <div style={styles.heroSection}>
          <img 
            src={tour.images?.[0] || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200'} 
            alt={tour.title}
            style={styles.heroImage}
          />
          <div style={styles.heroOverlay}>
            <div style={styles.categoryBadge}>{tour.category}</div>
          </div>
        </div>

        <div style={styles.contentGrid}>
          {/* Main Content */}
          <div style={styles.mainContent}>
            {/* Title & Basic Info */}
            <div style={styles.titleSection}>
              <h1 style={styles.title}>{tour.title}</h1>
              <div style={styles.location}>📍 {tour.location}</div>
              <div style={styles.rating}>
                ⭐ {tour.averageRating?.toFixed(1) || 'New'} 
                {tour.totalReviews > 0 && ` (${tour.totalReviews} reviews)`}
              </div>
            </div>

            {/* Quick Info Cards */}
            <div style={styles.quickInfo}>
              <div style={styles.infoCard}>
                <div style={styles.infoIcon}>⏱️</div>
                <div>
                  <div style={styles.infoLabel}>Duration</div>
                  <div style={styles.infoValue}>{tour.duration}</div>
                </div>
              </div>
              <div style={styles.infoCard}>
                <div style={styles.infoIcon}>⏰</div>
                <div>
                  <div style={styles.infoLabel}>Start Time</div>
                  <div style={styles.infoValue}>{tour.startTime || '09:00'}</div>
                </div>
              </div>
              <div style={styles.infoCard}>
                <div style={styles.infoIcon}>👥</div>
                <div>
                  <div style={styles.infoLabel}>Max Group</div>
                  <div style={styles.infoValue}>{tour.maxParticipants} people</div>
                </div>
              </div>
              <div style={styles.infoCard}>
                <div style={styles.infoIcon}>🎯</div>
                <div>
                  <div style={styles.infoLabel}>Difficulty</div>
                  <div style={styles.infoValue}>{tour.difficulty}</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>About This Tour</h2>
              <p style={styles.description}>{tour.description}</p>
            </div>

            {/* Highlights */}
            {tour.highlights && tour.highlights.length > 0 && (
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Tour Highlights</h2>
                <ul style={styles.list}>
                  {tour.highlights.map((highlight, index) => (
                    <li key={index} style={styles.listItem}>
                      ✨ {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* What's Included */}
            {tour.included && tour.included.length > 0 && (
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>What's Included</h2>
                <ul style={styles.list}>
                  {tour.included.map((item, index) => (
                    <li key={index} style={styles.listItem}>
                      ✅ {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Meeting Point */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Meeting Point</h2>
              <div style={styles.meetingPoint}>
                📍 {tour.meetingPoint}
              </div>
            </div>

            {/* Guide Info */}
            {guide && (
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Your Guide</h2>
                <div style={styles.guideCard}>
                  <div style={styles.guideAvatar}>
                    {guide.profileImageUrl ? (
                      <img src={guide.profileImageUrl} alt={guide.fullName} style={styles.guideImage} />
                    ) : (
                      <div style={styles.guidePlaceholder}>
                        {guide.fullName?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div style={styles.guideInfo}>
                    <h3 style={styles.guideName}>{guide.fullName}</h3>
                    <div style={styles.guideRating}>
                      ⭐ {guide.rating?.toFixed(1)} ({guide.reviewCount} reviews)
                    </div>
                    <p style={styles.guideBio}>{guide.bio}</p>
                    <button 
                      onClick={() => {
                        sessionStorage.setItem('selectedGuideId', guide.guideId);
                        setCurrentPage('guide-profile');
                      }} 
                      style={styles.viewProfileButton}
                    >
                      View Full Profile
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews Section */}
            {reviews.length > 0 && (
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Reviews ({reviews.length})</h2>
                <div style={styles.reviewsList}>
                  {reviews.map((review) => (
                    <div key={review.reviewId} style={styles.reviewCard}>
                      <div style={styles.reviewHeader}>
                        <div style={styles.reviewerInfo}>
                          <div style={styles.reviewerAvatar}>
                            {review.travelerName?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <div style={styles.reviewerName}>
                              {review.travelerName || 'Anonymous'}
                            </div>
                            <div style={styles.reviewDate}>
                              {review.createdAt?.toDate?.()?.toLocaleDateString() || 'Recently'}
                            </div>
                          </div>
                        </div>
                        <div style={styles.reviewRating}>
                          {'⭐'.repeat(review.rating || 0)}
                        </div>
                      </div>
                      <p style={styles.reviewComment}>{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking Sidebar */}
          <div style={styles.sidebar}>
            <div style={styles.bookingCard}>
              <div style={styles.priceSection}>
                <div style={styles.priceLabel}>From</div>
                <div style={styles.price}>${tour.price}</div>
                <div style={styles.priceLabel}>per person</div>
              </div>

              {!showBookingForm ? (
                <div style={styles.bookingActions}>
                  <button onClick={handleBookNow} style={styles.bookButton}>
                    Book Now
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitBooking} style={styles.bookingForm}>
                  <h3 style={styles.formTitle}>Book This Tour</h3>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Select Date *</label>
                    <input
                      type="date"
                      name="startDate"
                      value={bookingData.startDate}
                      onChange={handleBookingChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      style={styles.input}
                    />
                  </div>

                  {/* Display the Start Time here as info */}
                  <div style={styles.infoRow}>
                    <span style={styles.label}>Start Time:</span>
                    <span style={{ fontWeight: 'bold' }}>{tour.startTime || '09:00'}</span>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Number of Participants *</label>
                    <input
                      type="number"
                      name="numberOfParticipants"
                      value={bookingData.numberOfParticipants}
                      onChange={handleBookingChange}
                      required
                      min="1"
                      max={tour.maxParticipants}
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Special Requests</label>
                    <textarea
                      name="specialRequests"
                      value={bookingData.specialRequests}
                      onChange={handleBookingChange}
                      rows="3"
                      style={styles.textarea}
                      placeholder="Any special requirements?"
                    />
                  </div>

                  <div style={styles.totalPrice}>
                    <span>Total Price:</span>
                    <span style={styles.totalAmount}>
                      ${tour.price * bookingData.numberOfParticipants}
                    </span>
                  </div>

                  <button type="submit" style={styles.confirmButton}>
                    Continue to Booking
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowBookingForm(false)} 
                    style={styles.cancelButton}
                  >
                    Cancel
                  </button>
                </form>
              )}

              <div style={styles.bookingInfo}>
                <div style={styles.bookingInfoItem}>
                  ✅ Free cancellation up to 24 hours
                </div>
                <div style={styles.bookingInfoItem}>
                  ✅ Instant confirmation
                </div>
                <div style={styles.bookingInfoItem}>
                  ✅ Mobile ticket accepted
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ... existing styles ...
const styles = {
  page: { minHeight: '100vh', background: COLORS.light },
  container: { maxWidth: '1400px', margin: '0 auto' },
  heroSection: { position: 'relative', width: '100%', height: '400px', overflow: 'hidden' },
  heroImage: { width: '100%', height: '100%', objectFit: 'cover' },
  heroOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 100%)', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', padding: '24px' },
  categoryBadge: { background: COLORS.primary, color: 'white', padding: '8px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '600', textTransform: 'capitalize' },
  contentGrid: { display: 'grid', gridTemplateColumns: '1fr 400px', gap: '40px', padding: '40px 24px' },
  mainContent: { display: 'flex', flexDirection: 'column', gap: '32px' },
  titleSection: { background: 'white', padding: '32px', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  title: { fontSize: '32px', fontWeight: 'bold', color: '#333', marginBottom: '12px' },
  location: { fontSize: '18px', color: '#666', marginBottom: '8px' },
  rating: { fontSize: '16px', color: '#666' },
  quickInfo: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' },
  infoCard: { background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: '16px' },
  infoIcon: { fontSize: '32px' },
  infoLabel: { fontSize: '12px', color: '#666', marginBottom: '4px' },
  infoValue: { fontSize: '16px', fontWeight: '600', color: '#333', textTransform: 'capitalize' },
  section: { background: 'white', padding: '32px', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  sectionTitle: { fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '16px' },
  description: { fontSize: '16px', lineHeight: '1.8', color: '#666' },
  list: { listStyle: 'none', padding: 0, margin: 0 },
  listItem: { fontSize: '16px', color: '#666', padding: '8px 0', borderBottom: `1px solid ${COLORS.border}` },
  meetingPoint: { padding: '16px', background: COLORS.light, borderRadius: '8px', fontSize: '16px', color: '#333' },
  guideCard: { display: 'flex', gap: '20px', padding: '20px', background: COLORS.light, borderRadius: '12px' },
  guideAvatar: { flexShrink: 0 },
  guideImage: { width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' },
  guidePlaceholder: { width: '80px', height: '80px', borderRadius: '50%', background: COLORS.primary, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 'bold' },
  guideInfo: { flex: 1 },
  guideName: { fontSize: '20px', fontWeight: 'bold', color: '#333', marginBottom: '4px' },
  guideRating: { fontSize: '14px', color: '#666', marginBottom: '12px' },
  guideBio: { fontSize: '14px', color: '#666', marginBottom: '16px', lineHeight: '1.6' },
  viewProfileButton: { padding: '8px 16px', background: 'transparent', border: `2px solid ${COLORS.primary}`, color: COLORS.primary, borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  sidebar: { position: 'sticky', top: '100px', height: 'fit-content' },
  bookingCard: { background: 'white', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
  priceSection: { textAlign: 'center', paddingBottom: '24px', borderBottom: `2px solid ${COLORS.border}`, marginBottom: '24px' },
  priceLabel: { fontSize: '14px', color: '#666' },
  price: { fontSize: '48px', fontWeight: 'bold', color: COLORS.primary, margin: '8px 0' },
  bookingActions: { display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' },
  bookButton: { padding: '16px', background: COLORS.primary, color: 'white', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s' },
  bookingForm: { display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' },
  formTitle: { fontSize: '18px', fontWeight: 'bold', color: '#333', marginBottom: '8px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '14px', fontWeight: '600', color: '#333' },
  input: { padding: '12px', border: `2px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '16px', outline: 'none' },
  textarea: { padding: '12px', border: `2px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '16px', fontFamily: 'inherit', outline: 'none', resize: 'vertical' },
  infoRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: COLORS.light, borderRadius: '8px', marginBottom: '8px' },
  totalPrice: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: COLORS.light, borderRadius: '8px', fontSize: '16px', fontWeight: '600' },
  totalAmount: { fontSize: '24px', color: COLORS.primary },
  confirmButton: { padding: '16px', background: COLORS.primary, color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' },
  cancelButton: { padding: '12px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  bookingInfo: { display: 'flex', flexDirection: 'column', gap: '12px' },
  bookingInfoItem: { fontSize: '14px', color: '#666' },
  loadingContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' },
  loader: { fontSize: '18px', color: '#666' },
  errorContainer: { textAlign: 'center', padding: '100px 20px' },
  button: { padding: '12px 32px', background: COLORS.primary, color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', marginTop: '20px' },
  reviewsList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  reviewCard: { padding: '20px', background: COLORS.light, borderRadius: '12px' },
  reviewHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  reviewerInfo: { display: 'flex', alignItems: 'center', gap: '12px' },
  reviewerAvatar: { width: '40px', height: '40px', borderRadius: '50%', background: COLORS.primary, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold' },
  reviewerName: { fontSize: '16px', fontWeight: '600', color: '#333' },
  reviewDate: { fontSize: '12px', color: '#666' },
  reviewRating: { fontSize: '16px' },
  reviewComment: { fontSize: '14px', color: '#666', lineHeight: '1.6', margin: 0 },
};

export default TourDetailsPage;