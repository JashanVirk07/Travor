// src/pages/MyProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { bookingService, tourService } from '../services/firestoreService';
import { COLORS } from '../utils/colors';
import ReviewModal from '../components/ReviewModal.jsx';

const MyProfilePage = () => {
  const { currentUser, userProfile, setCurrentPage } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    if (currentUser) {
      loadBookings();
    }
  }, [currentUser]);

  const loadBookings = async () => {
    setLoading(true);
    try {
      console.log('Loading bookings for user:', currentUser.uid);
      const userBookings = await bookingService.getTravelerBookings(currentUser.uid);
      console.log('Fetched bookings:', userBookings);
      
      // Fetch tour details for each booking
      const bookingsWithDetails = await Promise.all(
        userBookings.map(async (booking) => {
          try {
            const tourDetails = await tourService.getTourById(booking.tourId);
            return { ...booking, tourDetails };
          } catch (error) {
            console.error('Error fetching tour details:', error);
            return booking;
          }
        })
      );
      
      console.log('Bookings with details:', bookingsWithDetails);
      setBookings(bookingsWithDetails);
    } catch (error) {
      console.error('Error loading bookings:', error);
    }
    setLoading(false);
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await bookingService.updateBookingStatus(bookingId, 'cancelled');
        alert('Booking cancelled successfully');
        loadBookings();
      } catch (error) {
        console.error('Error cancelling booking:', error);
        alert('Failed to cancel booking');
      }
    }
  };

  const handleLeaveReview = (booking) => {
    setSelectedBooking(booking);
    setShowReviewModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return '#10b981';
      case 'pending':
        return '#f59e0b';
      case 'completed':
        return '#6366f1';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return '✅';
      case 'pending':
        return '⏳';
      case 'completed':
        return '🎉';
      case 'cancelled':
        return '❌';
      default:
        return '📋';
    }
  };

  if (!currentUser) {
    return (
      <div style={styles.container}>
        <div style={styles.errorState}>
          <h2>Please Login</h2>
          <p>You need to be logged in to view your profile</p>
          <button onClick={() => setCurrentPage('login')} style={styles.button}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Profile Header */}
        <div style={styles.profileHeader}>
          <div style={styles.profileAvatar}>
            {userProfile?.profileImageUrl ? (
              <img
                src={userProfile.profileImageUrl}
                alt={userProfile.fullName}
                style={styles.avatarImage}
              />
            ) : (
              <div style={styles.avatarPlaceholder}>
                {userProfile?.fullName?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            )}
          </div>
          <div style={styles.profileInfo}>
            <h1 style={styles.profileName}>{userProfile?.fullName || 'User'}</h1>
            <p style={styles.profileEmail}>{currentUser.email}</p>
            <div style={styles.profileBadge}>
              {userProfile?.role === 'guide' ? '🎯 Guide' : '✈️ Traveler'}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          <button
            onClick={() => setActiveTab('bookings')}
            style={{
              ...styles.tab,
              ...(activeTab === 'bookings' ? styles.activeTab : {}),
            }}
          >
            📅 My Bookings
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            style={{
              ...styles.tab,
              ...(activeTab === 'favorites' ? styles.activeTab : {}),
            }}
          >
            ❤️ Favorites
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            style={{
              ...styles.tab,
              ...(activeTab === 'reviews' ? styles.activeTab : {}),
            }}
          >
            ⭐ My Reviews
          </button>
        </div>

        {/* Content */}
        <div style={styles.content}>
          {activeTab === 'bookings' && (
            <div>
              <h2 style={styles.sectionTitle}>My Bookings</h2>
              {loading ? (
                <div style={styles.loadingState}>
                  <div style={styles.loader}>Loading bookings...</div>
                </div>
              ) : bookings.length === 0 ? (
                <div style={styles.emptyState}>
                  <div style={styles.emptyIcon}>📅</div>
                  <h3 style={styles.emptyTitle}>No Bookings Yet</h3>
                  <p style={styles.emptyText}>
                    Start exploring and book your first adventure!
                  </p>
                  <button
                    onClick={() => setCurrentPage('destinations')}
                    style={styles.button}
                  >
                    Browse Tours
                  </button>
                </div>
              ) : (
                <div style={styles.bookingsList}>
                  {bookings.map((booking) => (
                    <div key={booking.bookingId} style={styles.bookingCard}>
                      <div style={styles.bookingImage}>
                        <img
                          src={
                            booking.tourDetails?.images?.[0] ||
                            'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400'
                          }
                          alt={booking.tourDetails?.title || 'Tour'}
                          style={styles.tourImage}
                        />
                        <div
                          style={{
                            ...styles.statusBadge,
                            background: getStatusColor(booking.status),
                          }}
                        >
                          {getStatusIcon(booking.status)} {booking.status}
                        </div>
                      </div>

                      <div style={styles.bookingContent}>
                        <h3 style={styles.bookingTitle}>
                          {booking.tourDetails?.title || 'Tour'}
                        </h3>
                        <div style={styles.bookingDetails}>
                          <div style={styles.bookingDetail}>
                            <span style={styles.detailIcon}>📍</span>
                            <span>{booking.tourDetails?.location || 'Location'}</span>
                          </div>
                          <div style={styles.bookingDetail}>
                            <span style={styles.detailIcon}>📅</span>
                            <span>
                              {booking.startDate
                                ? new Date(booking.startDate).toLocaleDateString()
                                : 'Date TBD'}
                            </span>
                          </div>
                          <div style={styles.bookingDetail}>
                            <span style={styles.detailIcon}>👥</span>
                            <span>{booking.numberOfParticipants} participants</span>
                          </div>
                          <div style={styles.bookingDetail}>
                            <span style={styles.detailIcon}>💰</span>
                            <span style={styles.price}>${booking.totalPrice}</span>
                          </div>
                        </div>

                        {booking.specialRequests && (
                          <div style={styles.specialRequests}>
                            <strong>Special Requests:</strong> {booking.specialRequests}
                          </div>
                        )}

                        <div style={styles.bookingActions}>
                          {booking.status === 'pending' && (
                            <button
                              onClick={() => handleCancelBooking(booking.bookingId)}
                              style={styles.cancelButton}
                            >
                              Cancel Booking
                            </button>
                          )}
                          {booking.status === 'completed' && !booking.hasReview && (
                            <button
                              onClick={() => handleLeaveReview(booking)}
                              style={styles.reviewButton}
                            >
                              Leave Review
                            </button>
                          )}
                          <button
                            onClick={() => {
                              sessionStorage.setItem('selectedTourId', booking.tourId);
                              setCurrentPage('tour-details');
                            }}
                            style={styles.viewButton}
                          >
                            View Tour
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'favorites' && (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>❤️</div>
              <h3 style={styles.emptyTitle}>No Favorites Yet</h3>
              <p style={styles.emptyText}>
                Save your favorite tours to see them here
              </p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>⭐</div>
              <h3 style={styles.emptyTitle}>No Reviews Yet</h3>
              <p style={styles.emptyText}>
                Complete a tour and leave a review!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedBooking && (
        <ReviewModal
          booking={selectedBooking}
          onClose={() => {
            setShowReviewModal(false);
            setSelectedBooking(null);
          }}
          onReviewSubmitted={() => {
            loadBookings();
            setShowReviewModal(false);
            setSelectedBooking(null);
          }}
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
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px',
  },
  profileHeader: {
    background: 'white',
    borderRadius: '24px',
    padding: '40px',
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
    marginBottom: '32px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  profileAvatar: {
    flexShrink: 0,
  },
  avatarImage: {
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
    border: `4px solid ${COLORS.primary}`,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: '8px',
  },
  profileEmail: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '16px',
  },
  profileBadge: {
    display: 'inline-block',
    padding: '8px 16px',
    background: COLORS.light,
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600',
    color: COLORS.primary,
  },
  tabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '32px',
    background: 'white',
    padding: '8px',
    borderRadius: '16px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  },
  tab: {
    flex: 1,
    padding: '16px 24px',
    background: 'transparent',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#666',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  activeTab: {
    background: COLORS.primary,
    color: 'white',
  },
  content: {
    background: 'white',
    borderRadius: '24px',
    padding: '40px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  sectionTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: '32px',
  },
  bookingsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  bookingCard: {
    display: 'flex',
    gap: '24px',
    padding: '24px',
    background: COLORS.light,
    borderRadius: '16px',
    transition: 'transform 0.3s',
    cursor: 'pointer',
  },
  bookingImage: {
    position: 'relative',
    width: '200px',
    height: '150px',
    flexShrink: 0,
    borderRadius: '12px',
    overflow: 'hidden',
  },
  tourImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  statusBadge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    color: 'white',
    textTransform: 'capitalize',
  },
  bookingContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  bookingTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: '16px',
  },
  bookingDetails: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
    marginBottom: '16px',
  },
  bookingDetail: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#666',
  },
  detailIcon: {
    fontSize: '16px',
  },
  price: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  specialRequests: {
    padding: '12px',
    background: 'white',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#666',
    marginBottom: '16px',
  },
  bookingActions: {
    display: 'flex',
    gap: '12px',
    marginTop: 'auto',
  },
  cancelButton: {
    padding: '10px 20px',
    background: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  reviewButton: {
    padding: '10px 20px',
    background: COLORS.secondary,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  viewButton: {
    padding: '10px 20px',
    background: 'white',
    color: COLORS.primary,
    border: `2px solid ${COLORS.primary}`,
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  emptyState: {
    textAlign: 'center',
    padding: '80px 20px',
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '24px',
  },
  emptyTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: '12px',
  },
  emptyText: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '32px',
  },
  button: {
    padding: '14px 32px',
    background: COLORS.primary,
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  loadingState: {
    textAlign: 'center',
    padding: '60px 20px',
  },
  loader: {
    fontSize: '18px',
    color: '#666',
  },
  errorState: {
    textAlign: 'center',
    padding: '100px 20px',
  },
};

export default MyProfilePage;