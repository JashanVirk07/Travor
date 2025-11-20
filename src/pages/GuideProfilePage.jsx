// src/pages/GuideProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { guideService, tourService, reviewService } from '../services/firestoreService';
import { COLORS } from '../utils/colors';

const GuideProfilePage = () => {
  const { currentUser, setCurrentPage } = useAuth();
  const [guide, setGuide] = useState(null);
  const [tours, setTours] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tours');

  // Get guideId from sessionStorage
  const guideId = sessionStorage.getItem('selectedGuideId');

  useEffect(() => {
    if (guideId) {
      loadGuideData();
    }
  }, [guideId]);

  // ... rest of the component stays the same

  const loadGuideData = async () => {
    setLoading(true);
    try {
      const guideData = await guideService.getGuideProfile(guideId);
      setGuide(guideData);

      const guideTours = await tourService.getGuideTours(guideId);
      setTours(guideTours);

      const guideReviews = await reviewService.getGuideReviews(guideId);
      setReviews(guideReviews);
    } catch (error) {
      console.error('Error loading guide data:', error);
    }
    setLoading(false);
  };

  const handleContactGuide = () => {
    if (!currentUser) {
      alert('Please login to contact the guide');
      setCurrentPage('login');
      return;
    }

    sessionStorage.setItem('chatWithGuide', JSON.stringify({
      guideId: guide.guideId,
      guideName: guide.fullName,
    }));
    
    setCurrentPage('messages');
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loader}>Loading guide profile...</div>
      </div>
    );
  }

  if (!guide) {
    return (
      <div style={styles.errorContainer}>
        <h2>Guide Not Found</h2>
        <p>The guide you're looking for doesn't exist.</p>
        <button onClick={() => setCurrentPage('guides')} style={styles.button}>
          Browse All Guides
        </button>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Profile Header */}
        <div style={styles.profileHeader}>
          <div style={styles.profileContent}>
            <div style={styles.avatarSection}>
              {guide.profileImageUrl ? (
                <img src={guide.profileImageUrl} alt={guide.fullName} style={styles.avatar} />
              ) : (
                <div style={styles.avatarPlaceholder}>
                  {guide.fullName?.charAt(0)?.toUpperCase()}
                </div>
              )}
              {guide.isVerified && (
                <div style={styles.verifiedBadge}>✓ Verified</div>
              )}
            </div>

            <div style={styles.profileInfo}>
              <h1 style={styles.name}>{guide.fullName}</h1>
              <div style={styles.location}>📍 {guide.location}</div>
              <div style={styles.stats}>
                <div style={styles.stat}>
                  <span style={styles.statValue}>⭐ {guide.rating?.toFixed(1) || '0.0'}</span>
                  <span style={styles.statLabel}>({guide.reviewCount} reviews)</span>
                </div>
                <div style={styles.statDivider}>•</div>
                <div style={styles.stat}>
                  <span style={styles.statValue}>{guide.toursCompleted || 0}</span>
                  <span style={styles.statLabel}>Tours Completed</span>
                </div>
              </div>

              <div style={styles.languages}>
                <strong>Languages: </strong>
                {guide.languages?.join(', ') || 'Not specified'}
              </div>

              <button onClick={handleContactGuide} style={styles.contactButton}>
                💬 Contact Guide
              </button>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        {guide.bio && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>About Me</h2>
            <p style={styles.bio}>{guide.bio}</p>
          </div>
        )}

        {/* Certifications */}
        {guide.certifications && guide.certifications.length > 0 && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Certifications</h2>
            <div style={styles.certifications}>
              {guide.certifications.map((cert, index) => (
                <div key={index} style={styles.certBadge}>
                  🏆 {cert}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={styles.tabs}>
          <button
            onClick={() => setActiveTab('tours')}
            style={{
              ...styles.tab,
              ...(activeTab === 'tours' ? styles.activeTab : {}),
            }}
          >
            Tours ({tours.length})
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            style={{
              ...styles.tab,
              ...(activeTab === 'reviews' ? styles.activeTab : {}),
            }}
          >
            Reviews ({reviews.length})
          </button>
        </div>

        {/* Tab Content */}
        <div style={styles.tabContent}>
          {activeTab === 'tours' && (
            <div style={styles.toursGrid}>
              {tours.length === 0 ? (
                <p style={styles.emptyText}>No tours available</p>
              ) : (
                tours.map((tour) => (
                  <div key={tour.tourId} style={styles.tourCard}>
                    <img 
                      src={tour.images?.[0] || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400'} 
                      alt={tour.title}
                      style={styles.tourImage}
                    />
                    <div style={styles.tourInfo}>
                      <h3 style={styles.tourTitle}>{tour.title}</h3>
                      <div style={styles.tourLocation}>📍 {tour.location}</div>
                      <div style={styles.tourMeta}>
                        <span style={styles.tourPrice}>${tour.price}</span>
                        <span>•</span>
                        <span>{tour.duration}</span>
                      </div>
                      <button
                        onClick={() => {
                            sessionStorage.setItem('selectedTourId', tour.tourId);
                            setCurrentPage('tour-details');
                    }}
                        style={styles.viewTourButton}
                        >
                         View Details
                        </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div style={styles.reviewsList}>
              {reviews.length === 0 ? (
                <p style={styles.emptyText}>No reviews yet</p>
              ) : (
                reviews.map((review) => (
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
                    <p style={styles.reviewText}>{review.comment}</p>
                  </div>
                ))
              )}
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
  profileHeader: {
    background: 'white',
    borderRadius: '16px',
    padding: '40px',
    marginBottom: '32px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  },
  profileContent: {
    display: 'flex',
    gap: '40px',
    alignItems: 'flex-start',
  },
  avatarSection: {
    position: 'relative',
  },
  avatar: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: `4px solid ${COLORS.primary}`,
  },
  avatarPlaceholder: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    background: COLORS.primary,
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '64px',
    fontWeight: 'bold',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: '10px',
    right: '10px',
    background: '#28a745',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '8px',
  },
  location: {
    fontSize: '18px',
    color: '#666',
    marginBottom: '16px',
  },
  stats: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '16px',
  },
  stat: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  statValue: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: '14px',
    color: '#666',
  },
  statDivider: {
    color: '#ccc',
  },
  languages: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '24px',
  },
  contactButton: {
    padding: '12px 32px',
    background: COLORS.secondary,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  section: {
    background: 'white',
    borderRadius: '16px',
    padding: '32px',
    marginBottom: '32px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '16px',
  },
  bio: {
    fontSize: '16px',
    lineHeight: '1.8',
    color: '#666',
  },
  certifications: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
  },
  certBadge: {
    padding: '8px 16px',
    background: COLORS.light,
    borderRadius: '20px',
    fontSize: '14px',
    color: '#333',
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
    padding: '16px',
    background: 'transparent',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
    color: '#666',
    transition: 'all 0.3s',
  },
  activeTab: {
    background: COLORS.primary,
    color: 'white',
  },
  tabContent: {
    background: 'white',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    minHeight: '400px',
  },
  toursGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '24px',
  },
  tourCard: {
    borderRadius: '12px',
    overflow: 'hidden',
    border: `1px solid ${COLORS.border}`,
    transition: 'transform 0.3s',
  },
  tourImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  },
  tourInfo: {
    padding: '20px',
  },
  tourTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '8px',
  },
  tourLocation: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '12px',
  },
  tourMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px',
    fontSize: '14px',
    color: '#666',
  },
  tourPrice: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  viewTourButton: {
    width: '100%',
    padding: '12px',
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
    gap: '20px',
  },
  reviewCard: {
    padding: '20px',
    background: COLORS.light,
    borderRadius: '12px',
  },
  reviewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  reviewerInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  reviewerAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: COLORS.primary,
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  reviewerName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
  },
  reviewDate: {
    fontSize: '12px',
    color: '#666',
  },
  reviewRating: {
    fontSize: '16px',
  },
  reviewText: {
    fontSize: '14px',
    color: '#666',
    lineHeight: '1.6',
  },
  emptyText: {
    textAlign: 'center',
    padding: '40px',
    color: '#666',
    fontSize: '16px',
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
  errorContainer: {
    textAlign: 'center',
    padding: '100px 20px',
  },
  button: {
    padding: '12px 32px',
    background: COLORS.primary,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '20px',
  },
};

export default GuideProfilePage;