import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../utils/colors';
import EditProfileModal from '../components/EditProfileModal';
import RefundModal from '../components/RefundModal';
import ReviewModal from '../components/ReviewModal';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { bookingService, favoritesService } from '../services/firestoreService';

const MyProfilePage = () => {
  const { currentUser, userProfile, logout, setCurrentPage } = useAuth();
  
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Helper to check if admin
  const isAdmin = userProfile?.role === 'admin';

  useEffect(() => {
    if (currentUser && !isAdmin) {
      // Only fetch data if NOT admin
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [currentUser, isAdmin]);

  const fetchUserData = () => {
    setLoading(true);

    try {
      // 1. Fetch Bookings
      const bookingsQuery = query(
        collection(db, 'bookings'),
        where('userId', '==', currentUser.uid)
      );

      const unsubscribeBookings = onSnapshot(bookingsQuery, (snapshot) => {
        const bookingsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        checkBookingCompletion(bookingsData);

        bookingsData.sort((a, b) => {
            const dateA = a.startDate?.seconds || 0;
            const dateB = b.startDate?.seconds || 0;
            return dateB - dateA;
        });

        setBookings(bookingsData);
        setLoading(false);
      });

      // 2. Fetch Favorites
      favoritesService.getUserFavoritesIds(currentUser.uid).then(ids => {
          const favQuery = query(collection(db, 'favorites'), where('userId', '==', currentUser.uid));
          onSnapshot(favQuery, (snap) => {
             const favs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
             setFavorites(favs);
          });
      });

      // 3. Fetch Reviews
      const reviewsQuery = query(
        collection(db, 'reviews'),
        where('userId', '==', currentUser.uid)
      );

      const unsubscribeReviews = onSnapshot(reviewsQuery, (snapshot) => {
        const reviewsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setReviews(reviewsData);
      });

      return () => {
        unsubscribeBookings();
        unsubscribeReviews();
      };
    } catch (error) {
      console.error('Error setting up data listeners:', error);
      setLoading(false);
    }
  };

  // Auto-complete logic
  const checkBookingCompletion = async (bookingsList) => {
    const now = new Date();
    bookingsList.forEach(async (booking) => {
      if (booking.status === 'confirmed' && booking.startDate) {
        const tourDate = booking.startDate.toDate ? booking.startDate.toDate() : new Date(booking.startDate);
        const timeString = booking.startTime || '09:00';
        const [hours, minutes] = timeString.split(':').map(Number);
        tourDate.setHours(hours || 9, minutes || 0, 0, 0);

        const durationString = booking.duration || '2 hours';
        const durationMatch = durationString.match(/(\d+(\.\d+)?)/); 
        const durationHours = durationMatch ? parseFloat(durationMatch[0]) : 2;
        const tourEndTime = new Date(tourDate.getTime() + durationHours * 60 * 60 * 1000);

        if (now > tourEndTime) {
          await bookingService.updateBookingStatus(booking.id, 'completed');
        }
      }
    });
  };

  const hasReview = (bookingId) => {
    return reviews.some(review => review.bookingId === bookingId);
  };

  const handleRequestRefund = (booking) => {
    setSelectedBooking({ ...booking, bookingId: booking.id });
    setShowRefundModal(true);
  };

  const handleLeaveReview = (booking) => {
    setSelectedBooking({ ...booking, bookingId: booking.id });
    setShowReviewModal(true);
  };

  const handleChatWithGuide = (booking) => {
    sessionStorage.setItem('chatWithGuide', JSON.stringify({
      guideId: booking.guideId,
      guideName: booking.guideName,
      tourId: booking.tourId,
      tourTitle: booking.tourTitle || booking.tour?.title,
    }));
    setCurrentPage('messages');
  };

  const handleLogout = async () => {
    try {
      await logout();
      setCurrentPage('login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#10b981';
      case 'completed': return '#3b82f6';
      case 'pending': return '#f59e0b';
      case 'cancelled': return '#ef4444';
      default: return '#666';
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getBookingImage = (booking) => {
    if (booking.tourImage) return booking.tourImage;
    if (booking.tour?.images?.[0]) return booking.tour.images[0];
    if (booking.tourDetails?.images?.[0]) return booking.tourDetails.images[0];
    return 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400';
  };

  const displayName = userProfile?.name || userProfile?.fullName || 'User';
  const profileImageUrl = userProfile?.profileImageUrl;
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <div style={styles.container}>
      <div style={styles.profileCard}>
        <div style={styles.profileHeader}>
          <div style={styles.profileInfo}>
            {profileImageUrl ? (
              <img src={profileImageUrl} alt={displayName} style={styles.avatar} />
            ) : (
              <div style={styles.avatarPlaceholder}>{avatarLetter}</div>
            )}
            
            <div style={styles.userInfo}>
              <h1 style={styles.userName}>{displayName}</h1>
              <p style={styles.userEmail}>{currentUser?.email}</p>
              <div style={styles.roleTag}>
                {userProfile?.role === 'guide' ? '🗺️ Guide' : 
                 userProfile?.role === 'admin' ? '🛡️ Admin' : '✈️ Traveler'}
              </div>
            </div>
          </div>

          {/* Header Actions */}
          <div style={styles.headerActions}>
            
            {/* Admin Dashboard Button */}
            {isAdmin && (
                <button 
                    onClick={() => setCurrentPage('admin-dashboard')}
                    style={styles.adminButton}
                >
                    🛡️ Admin Panel
                </button>
            )}

            <button 
                onClick={() => setShowEditModal(true)}
                style={styles.editButton}
            >
                ✏️ Edit Profile
            </button>
          </div>
        </div>

        {userProfile?.role === 'guide' && (
          <div style={styles.guideInfo}>
            {userProfile?.location && (
              <div style={styles.infoItem}>
                <span style={styles.infoIcon}>📍</span>
                <span>{userProfile.location}</span>
              </div>
            )}
            {userProfile?.languages && userProfile.languages.length > 0 && (
              <div style={styles.infoItem}>
                <span style={styles.infoIcon}>🗣️</span>
                <span>{userProfile.languages.join(', ')}</span>
              </div>
            )}
            {userProfile?.phone && (
              <div style={styles.infoItem}>
                <span style={styles.infoIcon}>📞</span>
                <span>{userProfile.phone}</span>
              </div>
            )}
          </div>
        )}

        {userProfile?.bio && (
          <div style={styles.bioSection}>
            <p style={styles.bioText}>{userProfile.bio}</p>
          </div>
        )}
      </div>

      {/* HIDE TABS IF ADMIN */}
      {!isAdmin && (
        <>
          <div style={styles.tabs}>
            <button
              onClick={() => setActiveTab('bookings')}
              style={{ ...styles.tab, ...(activeTab === 'bookings' ? styles.activeTab : {}) }}
            >
              📅 My Bookings
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              style={{ ...styles.tab, ...(activeTab === 'favorites' ? styles.activeTab : {}) }}
            >
              ❤️ Favorites
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              style={{ ...styles.tab, ...(activeTab === 'reviews' ? styles.activeTab : {}) }}
            >
              ⭐ My Reviews
            </button>
          </div>

          <div style={styles.content}>
            {loading ? (
              <div style={styles.loadingContainer}>
                <div style={styles.spinner}></div>
                <p>Loading...</p>
              </div>
            ) : (
              <>
                {activeTab === 'bookings' && (
                  <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>My Bookings</h2>
                    {bookings.length === 0 ? (
                      <div style={styles.emptyState}>
                        <p style={styles.emptyIcon}>📅</p>
                        <p style={styles.emptyText}>No bookings yet</p>
                        <button
                          onClick={() => setCurrentPage('destinations')}
                          style={styles.browseButton}
                        >
                          Browse Tours
                        </button>
                      </div>
                    ) : (
                      <div style={styles.bookingsList}>
                        {bookings.map((booking) => (
                          <div key={booking.id} style={styles.bookingCard}>
                            <div style={styles.bookingImageContainer}>
                              <img
                                src={getBookingImage(booking)}
                                alt={booking.tourTitle || 'Tour'}
                                style={styles.bookingImage}
                                onError={(e) => {
                                    e.target.onerror = null; 
                                    e.target.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400';
                                }}
                              />
                              <div
                                style={{
                                  ...styles.statusBadge,
                                  background: getStatusColor(booking.status),
                                }}
                              >
                                {booking.status ? (booking.status.charAt(0).toUpperCase() + booking.status.slice(1)) : 'Unknown'}
                              </div>
                            </div>

                            <div style={styles.bookingDetails}>
                              <h3 style={styles.bookingTitle}>{booking.tourTitle || booking.tour?.title || 'Tour Booking'}</h3>

                              <div style={styles.bookingInfo}>
                                <div style={styles.bookingInfoItem}>
                                  <span style={styles.bookingIcon}>📍</span>
                                  <span>{booking.location || booking.tour?.location || 'Location N/A'}</span>
                                </div>
                                <div style={styles.bookingInfoItem}>
                                  <span style={styles.bookingIcon}>📅</span>
                                  <span>{formatDate(booking.date || booking.startDate)}</span>
                                </div>
                                <div style={styles.bookingInfoItem}>
                                  <span style={styles.bookingIcon}>⏰</span>
                                  <span>{booking.startTime || '09:00'}</span>
                                </div>
                                <div style={styles.bookingInfoItem}>
                                  <span style={styles.bookingIcon}>💰</span>
                                  <span style={styles.price}>${booking.totalPrice}</span>
                                </div>
                              </div>

                              {booking.refundStatus === 'completed' && (
                                <div style={styles.refundBadge}>
                                  ✅ Refunded: ${booking.refundAmount?.toFixed(2)}
                                </div>
                              )}

                              <div style={styles.bookingActions}>
                                <button
                                  onClick={() => {
                                      sessionStorage.setItem('selectedTourId', booking.tourId || booking.tour?.tourId);
                                      setCurrentPage('tour-details');
                                  }}
                                  style={styles.viewButton}
                                >
                                  View Tour
                                </button>
                                
                                <button
                                  onClick={() => handleChatWithGuide(booking)}
                                  style={styles.chatButton}
                                >
                                  💬 Chat Guide
                                </button>
                                
                                {booking.status === 'confirmed' && booking.paymentStatus === 'completed' && (
                                  <button
                                    onClick={() => handleRequestRefund(booking)}
                                    style={styles.refundButton}
                                  >
                                    Request Refund
                                  </button>
                                )}

                                {booking.status === 'completed' && !hasReview(booking.id) && (
                                    <button
                                        onClick={() => handleLeaveReview(booking)}
                                        style={styles.reviewButton}
                                    >
                                        ⭐ Leave Review
                                    </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'favorites' && (
                  <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Favorite Tours</h2>
                    {favorites.length === 0 ? (
                      <div style={styles.emptyState}>
                        <p style={styles.emptyIcon}>❤️</p>
                        <p style={styles.emptyText}>No favorites yet</p>
                        <button onClick={() => setCurrentPage('destinations')} style={styles.browseButton}>
                          Explore Tours
                        </button>
                      </div>
                    ) : (
                      <div style={styles.favoritesGrid}>
                        {favorites.map((favorite) => (
                          <div key={favorite.id} style={styles.favoriteCard}>
                            <img
                              src={favorite.tourImage || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400'}
                              alt={favorite.tourTitle}
                              style={styles.favoriteImage}
                            />
                            <div style={styles.favoriteContent}>
                              <h3 style={styles.favoriteTitle}>{favorite.tourTitle}</h3>
                              <p style={styles.favoriteLocation}>📍 {favorite.location}</p>
                              <p style={styles.favoritePrice}>💰 ${favorite.price}</p>
                              <button
                                onClick={() => {
                                    sessionStorage.setItem('selectedTourId', favorite.tourId);
                                    setCurrentPage('tour-details');
                                }}
                                style={styles.viewTourButton}
                              >
                                View Tour
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>My Reviews</h2>
                    {reviews.length === 0 ? (
                      <div style={styles.emptyState}>
                        <p style={styles.emptyIcon}>⭐</p>
                        <p style={styles.emptyText}>No reviews yet</p>
                        <p style={styles.emptySubtext}>Complete a booking to leave a review</p>
                      </div>
                    ) : (
                      <div style={styles.reviewsList}>
                        {reviews.map((review) => (
                          <div key={review.id} style={styles.reviewCard}>
                            <div style={styles.reviewHeader}>
                              <h3 style={styles.reviewTourTitle}>{review.tourTitle}</h3>
                              <div style={styles.reviewRating}>
                                {'⭐'.repeat(review.rating)}
                              </div>
                            </div>
                            <p style={styles.reviewText}>{review.comment}</p>
                            <p style={styles.reviewDate}>
                              {formatDate(review.createdAt)}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}

      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={() => console.log('Profile updated successfully')}
      />

      {showRefundModal && selectedBooking && (
        <RefundModal
          isOpen={showRefundModal}
          onClose={() => {
            setShowRefundModal(false);
            setSelectedBooking(null);
          }}
          booking={selectedBooking}
          onRefundSuccess={() => {}}
        />
      )}

      {showReviewModal && selectedBooking && (
        <ReviewModal
            booking={selectedBooking}
            onClose={() => {
                setShowReviewModal(false);
                setSelectedBooking(null);
            }}
            onSuccess={() => {}}
        />
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  profileCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '32px',
    marginBottom: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  profileHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
  },
  profileInfo: {
    display: 'flex',
    gap: '24px',
    alignItems: 'center',
  },
  avatar: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: `4px solid ${COLORS.primary}`,
  },
  avatarPlaceholder: {
    width: '100px',
    height: '100px',
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
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  userName: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
    margin: 0,
  },
  userEmail: {
    fontSize: '16px',
    color: '#666',
    margin: 0,
  },
  roleTag: {
    display: 'inline-block',
    padding: '6px 16px',
    background: COLORS.light,
    color: COLORS.primary,
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600',
    width: 'fit-content',
  },
  // Header Buttons Container
  headerActions: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  // Admin Button Style
  adminButton: {
    padding: '12px 24px',
    background: '#1f2937', // Dark grey for admin
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'background 0.3s',
  },
  editButton: {
    padding: '12px 24px',
    background: COLORS.primary,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'background 0.3s',
  },
  guideInfo: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    marginTop: '20px',
    padding: '20px',
    background: COLORS.light,
    borderRadius: '12px',
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#666',
  },
  infoIcon: {
    fontSize: '18px',
  },
  bioSection: {
    marginTop: '20px',
    padding: '20px',
    background: '#f9fafb',
    borderRadius: '12px',
  },
  bioText: {
    fontSize: '15px',
    lineHeight: '1.6',
    color: '#555',
    margin: 0,
  },
  tabs: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
    borderBottom: `2px solid ${COLORS.border}`,
  },
  tab: {
    padding: '16px 24px',
    background: 'transparent',
    border: 'none',
    borderBottom: '3px solid transparent',
    fontSize: '16px',
    fontWeight: '600',
    color: '#666',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  activeTab: {
    color: COLORS.primary,
    borderBottomColor: COLORS.primary,
  },
  content: {
    background: 'white',
    borderRadius: '16px',
    padding: '32px',
    minHeight: '400px',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: `4px solid ${COLORS.border}`,
    borderTop: `4px solid ${COLORS.primary}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  section: {
    width: '100%',
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '24px',
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
    fontSize: '18px',
    color: '#666',
    marginBottom: '8px',
  },
  emptySubtext: {
    fontSize: '14px',
    color: '#999',
    marginBottom: '24px',
  },
  browseButton: {
    padding: '12px 32px',
    background: COLORS.primary,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  bookingsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  bookingCard: {
    display: 'flex',
    gap: '20px',
    border: `2px solid ${COLORS.border}`,
    borderRadius: '12px',
    overflow: 'hidden',
    transition: 'box-shadow 0.3s',
  },
  bookingImageContainer: {
    position: 'relative',
    width: '200px',
    flexShrink: 0,
  },
  bookingImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  statusBadge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    padding: '6px 12px',
    color: 'white',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  bookingDetails: {
    flex: 1,
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
  },
  bookingTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '12px',
  },
  bookingInfo: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
    marginBottom: '12px',
  },
  bookingInfoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#666',
  },
  bookingIcon: {
    fontSize: '16px',
  },
  price: {
    fontWeight: 'bold',
    color: COLORS.primary,
    fontSize: '18px',
  },
  specialRequests: {
    padding: '12px',
    background: COLORS.light,
    borderRadius: '8px',
    fontSize: '14px',
    color: '#666',
    marginBottom: '12px',
  },
  refundBadge: {
    display: 'inline-block',
    padding: '8px 16px',
    background: '#d1fae5',
    color: '#065f46',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '12px',
  },
  bookingActions: {
    display: 'flex',
    gap: '12px',
    marginTop: 'auto',
  },
  viewButton: {
    padding: '10px 20px',
    background: 'white',
    border: `2px solid ${COLORS.primary}`,
    color: COLORS.primary,
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  chatButton: {
    padding: '10px 20px',
    background: 'white',
    border: `2px solid ${COLORS.secondary}`,
    color: COLORS.secondary,
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  refundButton: {
    padding: '10px 20px',
    background: COLORS.danger,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  reviewButton: {
    padding: '10px 20px',
    background: '#f59e0b',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  favoritesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px',
  },
  favoriteCard: {
    border: `2px solid ${COLORS.border}`,
    borderRadius: '12px',
    overflow: 'hidden',
    transition: 'transform 0.3s, box-shadow 0.3s',
  },
  favoriteImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  },
  favoriteContent: {
    padding: '16px',
  },
  favoriteTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '8px',
  },
  favoriteLocation: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '4px',
  },
  favoritePrice: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: '12px',
  },
  viewTourButton: {
    width: '100%',
    padding: '10px',
    background: COLORS.primary,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  reviewsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  reviewCard: {
    padding: '20px',
    border: `2px solid ${COLORS.border}`,
    borderRadius: '12px',
  },
  reviewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  reviewTourTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
    margin: 0,
  },
  reviewRating: {
    fontSize: '20px',
  },
  reviewText: {
    fontSize: '15px',
    lineHeight: '1.6',
    color: '#666',
    marginBottom: '12px',
  },
  reviewDate: {
    fontSize: '12px',
    color: '#999',
  },
};

export default MyProfilePage;