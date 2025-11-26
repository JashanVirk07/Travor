// src/pages/BookingConfirmationPage.jsx (UPDATED)
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { bookingService } from '../services/firestoreService';
import { enhancedPaymentService } from '../services/paymentService';
import PaymentModal from '../components/PaymentModal';
import { COLORS } from '../utils/colors';

const BookingConfirmationPage = () => {
  const { currentUser, userProfile, setCurrentPage } = useAuth();
  const [bookingInfo, setBookingInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [bookingId, setBookingId] = useState(null);

  useEffect(() => {
    const storedBooking = sessionStorage.getItem('pendingBooking');
    if (storedBooking) {
      setBookingInfo(JSON.parse(storedBooking));
    } else {
      setCurrentPage('destinations');
    }
  }, []);

  const handleConfirmBooking = async () => {
    if (!currentUser || !bookingInfo) {
      alert('Missing booking information');
      return;
    }

    setLoading(true);
    try {
      const bookingData = {
        userId: currentUser.uid,  
        tourId: bookingInfo.tour.tourId,
        travelerId: currentUser.uid,
        guideId: bookingInfo.guide.guideId,
        startDate: bookingInfo.startDate,
        numberOfParticipants: bookingInfo.numberOfParticipants,
        totalPrice: bookingInfo.totalPrice,
        specialRequests: bookingInfo.specialRequests || '',
        status: 'pending', // Will be updated to 'confirmed' after payment
        paymentStatus: 'pending',
        tourTitle: bookingInfo.tour.title,
        travelerName: userProfile?.name || currentUser.email,
      };

      console.log('Creating booking with data:', bookingData);
      
      const createdBookingId = await bookingService.createBooking(bookingData);
      
      console.log('Booking created successfully with ID:', createdBookingId);
      setBookingId(createdBookingId);

      // Show payment modal
      setShowPaymentModal(true);
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking: ' + error.message);
    }
    setLoading(false);
  };

  const handlePaymentSuccess = async (paymentResult) => {
    try {
      console.log('Payment successful:', paymentResult);

      // Process the payment
      await enhancedPaymentService.processPayment(bookingId, {
        amount: bookingInfo.totalPrice,
        currency: 'usd',
        paymentMethodId: paymentResult.paymentMethodId,
        transactionId: paymentResult.transactionId,
      });

      // Clear pending booking
      sessionStorage.removeItem('pendingBooking');

      // Close payment modal
      setShowPaymentModal(false);

      // Show success message
      alert('✅ Booking confirmed! Payment successful. Check your email for confirmation.');
      
      // Navigate to profile to see bookings
      setTimeout(() => {
        setCurrentPage('myprofile');
      }, 1000);
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('❌ Payment processing failed: ' + error.message);
    }
  };

  if (!bookingInfo) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loader}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Review Your Booking</h1>
          <p style={styles.subtitle}>Please review the details before proceeding to payment</p>
        </div>

        <div style={styles.content}>
          {/* Tour Details */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Tour Details</h2>
            <div style={styles.tourCard}>
              <img
                src={bookingInfo.tour.images?.[0] || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400'}
                alt={bookingInfo.tour.title}
                style={styles.tourImage}
              />
              <div style={styles.tourInfo}>
                <h3 style={styles.tourTitle}>{bookingInfo.tour.title}</h3>
                <div style={styles.tourDetail}>
                  <span style={styles.detailIcon}>📍</span>
                  <span>{bookingInfo.tour.location}</span>
                </div>
                <div style={styles.tourDetail}>
                  <span style={styles.detailIcon}>⏱️</span>
                  <span>{bookingInfo.tour.duration}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Booking Information</h2>
            <div style={styles.detailsCard}>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Date:</span>
                <span style={styles.detailValue}>
                  {new Date(bookingInfo.startDate).toLocaleDateString()}
                </span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Participants:</span>
                <span style={styles.detailValue}>{bookingInfo.numberOfParticipants}</span>
              </div>
              {bookingInfo.specialRequests && (
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Special Requests:</span>
                  <span style={styles.detailValue}>{bookingInfo.specialRequests}</span>
                </div>
              )}
            </div>
          </div>

          {/* Guide Details */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Your Guide</h2>
            <div style={styles.guideCard}>
              <div style={styles.guideAvatar}>
                {bookingInfo.guide.profileImageUrl ? (
                  <img
                    src={bookingInfo.guide.profileImageUrl}
                    alt={bookingInfo.guide.fullName}
                    style={styles.guideImage}
                  />
                ) : (
                  <div style={styles.guidePlaceholder}>
                    {bookingInfo.guide.fullName?.charAt(0)}
                  </div>
                )}
              </div>
              <div style={styles.guideInfo}>
                <h3 style={styles.guideName}>{bookingInfo.guide.fullName}</h3>
                <div style={styles.guideRating}>
                  ⭐ {bookingInfo.guide.rating?.toFixed(1)} ({bookingInfo.guide.reviewCount} reviews)
                </div>
              </div>
            </div>
          </div>

          {/* Price Summary */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Price Summary</h2>
            <div style={styles.priceCard}>
              <div style={styles.priceRow}>
                <span>Price per person:</span>
                <span>${bookingInfo.tour.price}</span>
              </div>
              <div style={styles.priceRow}>
                <span>Number of participants:</span>
                <span>× {bookingInfo.numberOfParticipants}</span>
              </div>
              <div style={styles.priceDivider}></div>
              <div style={styles.priceTotal}>
                <span>Total:</span>
                <span style={styles.totalAmount}>${bookingInfo.totalPrice}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={styles.actions}>
            <button
              onClick={() => setCurrentPage('tour-details')}
              style={styles.backButton}
              disabled={loading}
            >
              Go Back
            </button>
            <button
              onClick={handleConfirmBooking}
              style={styles.confirmButton}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Proceed to Payment'}
            </button>
          </div>

          {/* Info Notice */}
          <div style={styles.notice}>
            <h3 style={styles.noticeTitle}>📋 Cancellation Policy</h3>
            <p>✅ Full refund: Cancel 24+ hours before the tour</p>
            <p>✅ 50% refund: Cancel less than 24 hours before</p>
            <p>❌ No refund: After tour starts</p>
            <p style={styles.secureNotice}>🔒 Secure payment powered by Stripe</p>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && bookingId && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            // Optionally cancel the booking if payment is not completed
            alert('Payment cancelled. Your booking has not been confirmed.');
            setCurrentPage('tour-details');
          }}
          bookingData={{ ...bookingInfo, bookingId }}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    background: COLORS.light,
    paddingTop: '80px',
    paddingBottom: '60px',
  },
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '0 24px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '48px',
  },
  title: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: '12px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
  },
  content: {
    background: 'white',
    borderRadius: '24px',
    padding: '40px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  section: {
    marginBottom: '32px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: '16px',
  },
  tourCard: {
    display: 'flex',
    gap: '20px',
    padding: '20px',
    background: COLORS.light,
    borderRadius: '16px',
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
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: '12px',
  },
  tourDetail: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#666',
    marginBottom: '8px',
  },
  detailIcon: {
    fontSize: '16px',
  },
  detailsCard: {
    padding: '20px',
    background: COLORS.light,
    borderRadius: '16px',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: `1px solid ${COLORS.border}`,
  },
  detailLabel: {
    fontSize: '14px',
    color: '#666',
    fontWeight: '600',
  },
  detailValue: {
    fontSize: '14px',
    color: '#1a1a2e',
    fontWeight: '600',
  },
  guideCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '20px',
    background: COLORS.light,
    borderRadius: '16px',
  },
  guideAvatar: {
    flexShrink: 0,
  },
  guideImage: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  guidePlaceholder: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: COLORS.primary,
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  guideInfo: {
    flex: 1,
  },
  guideName: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: '4px',
  },
  guideRating: {
    fontSize: '14px',
    color: '#666',
  },
  priceCard: {
    padding: '20px',
    background: COLORS.light,
    borderRadius: '16px',
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    fontSize: '14px',
    color: '#666',
  },
  priceDivider: {
    height: '1px',
    background: COLORS.border,
    margin: '16px 0',
  },
  priceTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  totalAmount: {
    color: COLORS.primary,
    fontSize: '28px',
  },
  actions: {
    display: 'flex',
    gap: '16px',
    marginTop: '32px',
  },
  backButton: {
    flex: 1,
    padding: '16px',
    background: 'white',
    color: COLORS.primary,
    border: `2px solid ${COLORS.primary}`,
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  confirmButton: {
    flex: 2,
    padding: '16px',
    background: COLORS.primary,
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  notice: {
    marginTop: '32px',
    padding: '24px',
    background: '#f0fdf4',
    borderRadius: '12px',
    fontSize: '14px',
    color: '#166534',
    lineHeight: '1.8',
  },
  noticeTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '12px',
  },
  secureNotice: {
    marginTop: '12px',
    fontWeight: '600',
    color: COLORS.primary,
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
  },
  loader: {
    fontSize: '18px',
    color: '#666',
  },
};

export default BookingConfirmationPage;