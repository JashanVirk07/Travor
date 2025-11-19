// src/pages/BookingConfirmationPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { bookingService } from '../services/firestoreService';
import { COLORS } from '../utils/colors';

const BookingConfirmationPage = () => {
  const { currentUser, userProfile, setCurrentPage } = useAuth();
  const [bookingInfo, setBookingInfo] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');

  useEffect(() => {
    // Get booking info from sessionStorage
    const pendingBooking = sessionStorage.getItem('pendingBooking');
    if (pendingBooking) {
      setBookingInfo(JSON.parse(pendingBooking));
    } else {
      // No booking info, redirect to destinations
      setCurrentPage('destinations');
    }
  }, []);

  const handleConfirmBooking = async () => {
    if (!currentUser || !bookingInfo) return;

    setProcessing(true);

    try {
      const booking = {
        tourId: bookingInfo.tour.tourId,
        tourTitle: bookingInfo.tour.title,
        guideId: bookingInfo.tour.guideId,
        travelerId: currentUser.uid,
        travelerName: userProfile?.name || currentUser.email,
        travelerEmail: currentUser.email,
        
        startDate: bookingInfo.startDate,
        numberOfParticipants: bookingInfo.numberOfParticipants,
        totalPrice: bookingInfo.totalPrice,
        
        specialRequests: bookingInfo.specialRequests || '',
        paymentMethod: paymentMethod,
        
        status: 'pending',
        paymentStatus: 'pending',
      };

      const result = await bookingService.createBooking(booking);

      if (result.success) {
        // Clear pending booking
        sessionStorage.removeItem('pendingBooking');
        
        alert(`✅ Booking confirmed!\n\nYour ticket number: ${result.ticketNumber}\n\nYou will receive a confirmation email shortly.`);
        
        // Redirect to my profile
        setCurrentPage('myprofile');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('❌ Failed to create booking: ' + error.message);
    }

    setProcessing(false);
  };

  if (!bookingInfo) {
    return (
      <div style={styles.loadingContainer}>
        <p>Loading booking details...</p>
      </div>
    );
  }

  const { tour, guide, startDate, numberOfParticipants, totalPrice, specialRequests } = bookingInfo;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Confirm Your Booking</h1>
          <p style={styles.subtitle}>Review your booking details before confirming</p>
        </div>

        <div style={styles.contentGrid}>
          {/* Booking Summary */}
          <div style={styles.mainContent}>
            {/* Tour Details */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Tour Details</h2>
              <div style={styles.tourSummary}>
                <img 
                  src={tour.images?.[0] || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400'} 
                  alt={tour.title}
                  style={styles.tourImage}
                />
                <div style={styles.tourInfo}>
                  <h3 style={styles.tourTitle}>{tour.title}</h3>
                  <div style={styles.tourDetail}>📍 {tour.location}</div>
                  <div style={styles.tourDetail}>⏱️ {tour.duration}</div>
                  <div style={styles.tourDetail}>🎯 {tour.difficulty} difficulty</div>
                </div>
              </div>
            </div>

            {/* Guide Info */}
            {guide && (
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Your Guide</h2>
                <div style={styles.guideInfo}>
                  <div style={styles.guideAvatar}>
                    {guide.profileImageUrl ? (
                      <img src={guide.profileImageUrl} alt={guide.fullName} style={styles.guideImage} />
                    ) : (
                      <div style={styles.guidePlaceholder}>
                        {guide.fullName?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <div style={styles.guideName}>{guide.fullName}</div>
                    <div style={styles.guideRating}>
                      ⭐ {guide.rating?.toFixed(1)} ({guide.reviewCount} reviews)
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Booking Details */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Booking Information</h2>
              <div style={styles.bookingDetails}>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Date:</span>
                  <span style={styles.detailValue}>
                    {new Date(startDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Participants:</span>
                  <span style={styles.detailValue}>{numberOfParticipants} person(s)</span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Meeting Point:</span>
                  <span style={styles.detailValue}>{tour.meetingPoint}</span>
                </div>
                {specialRequests && (
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Special Requests:</span>
                    <span style={styles.detailValue}>{specialRequests}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Method */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Payment Method</h2>
              <div style={styles.paymentMethods}>
                <label style={styles.paymentOption}>
                  <input
                    type="radio"
                    name="payment"
                    value="credit_card"
                    checked={paymentMethod === 'credit_card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    style={styles.radio}
                  />
                  <span style={styles.paymentLabel}>💳 Credit Card</span>
                </label>
                <label style={styles.paymentOption}>
                  <input
                    type="radio"
                    name="payment"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    style={styles.radio}
                  />
                  <span style={styles.paymentLabel}>💰 PayPal</span>
                </label>
                <label style={styles.paymentOption}>
                  <input
                    type="radio"
                    name="payment"
                    value="pay_at_venue"
                    checked={paymentMethod === 'pay_at_venue'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    style={styles.radio}
                  />
                  <span style={styles.paymentLabel}>🏪 Pay at Venue</span>
                </label>
              </div>
            </div>
          </div>

          {/* Price Summary Sidebar */}
          <div style={styles.sidebar}>
            <div style={styles.priceCard}>
              <h3 style={styles.priceTitle}>Price Summary</h3>
              
              <div style={styles.priceBreakdown}>
                <div style={styles.priceRow}>
                  <span>Tour Price (x{numberOfParticipants})</span>
                  <span>${tour.price} x {numberOfParticipants}</span>
                </div>
                <div style={styles.priceRow}>
                  <span>Subtotal</span>
                  <span>${totalPrice}</span>
                </div>
                <div style={styles.priceRow}>
                  <span>Service Fee</span>
                  <span>$0</span>
                </div>
              </div>

              <div style={styles.totalRow}>
                <span style={styles.totalLabel}>Total</span>
                <span style={styles.totalAmount}>${totalPrice}</span>
              </div>

              <button 
                onClick={handleConfirmBooking}
                disabled={processing}
                style={{
                  ...styles.confirmButton,
                  ...(processing ? styles.confirmButtonDisabled : {})
                }}
              >
                {processing ? 'Processing...' : 'Confirm Booking'}
              </button>

              <button 
                onClick={() => setCurrentPage('tour-details')}
                style={styles.cancelButton}
              >
                Cancel
              </button>

              <div style={styles.policies}>
                <div style={styles.policyItem}>✅ Free cancellation up to 24h</div>
                <div style={styles.policyItem}>✅ Instant confirmation</div>
                <div style={styles.policyItem}>✅ Reserve now, pay later</div>
              </div>
            </div>
          </div>
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
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 24px',
  },
  header: {
    marginBottom: '40px',
  },
  title: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 400px',
    gap: '40px',
  },
  mainContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  section: {
    background: 'white',
    padding: '32px',
    borderRadius: '16px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '20px',
  },
  tourSummary: {
    display: 'flex',
    gap: '20px',
  },
  tourImage: {
    width: '150px',
    height: '150px',
    borderRadius: '12px',
    objectFit: 'cover',
  },
  tourInfo: {
    flex: 1,
  },
  tourTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '12px',
  },
  tourDetail: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '8px',
  },
  guideInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  guideAvatar: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    overflow: 'hidden',
  },
  guideImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  guidePlaceholder: {
    width: '100%',
    height: '100%',
    background: COLORS.primary,
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  guideName: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '4px',
  },
  guideRating: {
    fontSize: '14px',
    color: '#666',
  },
  bookingDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: '16px',
    borderBottom: `1px solid ${COLORS.border}`,
  },
  detailLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#666',
  },
  detailValue: {
    fontSize: '14px',
    color: '#333',
    textAlign: 'right',
    maxWidth: '60%',
  },
  paymentMethods: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  paymentOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    border: `2px solid ${COLORS.border}`,
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  radio: {
    width: '20px',
    height: '20px',
    cursor: 'pointer',
  },
  paymentLabel: {
    fontSize: '16px',
    color: '#333',
    fontWeight: '500',
  },
  sidebar: {
    position: 'sticky',
    top: '100px',
    height: 'fit-content',
  },
  priceCard: {
    background: 'white',
    padding: '32px',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  },
  priceTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '20px',
  },
  priceBreakdown: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '20px',
    paddingBottom: '20px',
    borderBottom: `2px solid ${COLORS.border}`,
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    color: '#666',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 0',
    borderBottom: `2px solid ${COLORS.border}`,
    marginBottom: '24px',
  },
  totalLabel: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333',
  },
  totalAmount: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  confirmButton: {
    width: '100%',
    padding: '16px',
    background: COLORS.primary,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '12px',
    transition: 'all 0.3s',
  },
  confirmButtonDisabled: {
    background: '#ccc',
    cursor: 'not-allowed',
  },
  cancelButton: {
    width: '100%',
    padding: '12px',
    background: 'transparent',
    border: `2px solid ${COLORS.border}`,
    color: '#666',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '24px',
  },
  policies: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  policyItem: {
    fontSize: '14px',
    color: '#666',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
  },
};

export default BookingConfirmationPage;