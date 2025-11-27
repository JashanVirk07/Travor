import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { COLORS } from '../utils/colors';
import '../index.css';

const HomePage = () => {
  const { setCurrentPage } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      sessionStorage.setItem('searchQuery', searchQuery.trim());
      setCurrentPage('destinations');
    }
  };

  const featuredDestinations = [
    {
      id: 1,
      name: 'Tokyo, Japan',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
      tours: 156,
    },
    {
      id: 2,
      name: 'Paris, France',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
      tours: 243,
    },
    {
      id: 3,
      name: 'New York, USA',
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800',
      tours: 198,
    },
    {
      id: 4,
      name: 'Barcelona, Spain',
      image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800',
      tours: 167,
    },
    {
      id: 5,
      name: 'Rome, Italy',
      image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800',
      tours: 182,
    },
    {
      id: 6,
      name: 'Bali, Indonesia',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
      tours: 145,
    },
  ];

  const popularCategories = [
    { icon: '🏛️', name: 'Cultural', description: 'Museums, history & heritage', color: '#ff6b6b' },
    { icon: '🏔️', name: 'Adventure', description: 'Hiking, climbing & outdoor', color: '#4ecdc4' },
    { icon: '🍜', name: 'Food', description: 'Culinary tours & tastings', color: '#ffe66d' },
    { icon: '🎨', name: 'Art', description: 'Galleries, studios & workshops', color: '#a8dadc' },
    { icon: '🏖️', name: 'Beach', description: 'Coastal tours & water sports', color: '#457b9d' },
    { icon: '🌃', name: 'Nightlife', description: 'Bars, clubs & entertainment', color: '#e63946' },
    // --- ADDED NEW CATEGORIES ---
    { icon: '🌿', name: 'Nature', description: 'Eco-tours, wildlife & parks', color: '#95d5b2' },
    { icon: '📸', name: 'Photography', description: 'Scenic spots & photo walks', color: '#bde0fe' },
  ];

  return (
    <div style={styles.page}>
      {/* Hero Section with Background Image */}
      <div style={styles.hero}>
        {/* Background Image Layer */}
        <div style={styles.heroBackground}></div>
        
        {/* Gradient Overlay */}
        <div style={styles.heroOverlay}></div>
        
        {/* Animated Shapes */}
        <div style={styles.shape1}></div>
        <div style={styles.shape2}></div>
        <div style={styles.shape3}></div>
        
        <div style={styles.heroContent}>
          <div className="fade-in" style={styles.badge}>✨ Your Adventure Starts Here</div>
          
          <h1 className="fade-in" style={styles.heroTitle}>
            Discover Your Next
            <span style={styles.gradientText}> Adventure</span>
          </h1>
          
          <p className="fade-in" style={styles.heroSubtitle}>
            Connect with expert local guides and explore the world like never before.
            <br />Create unforgettable memories on authentic, personalized tours.
          </p>
          
          {/* Modern Search Bar */}
          <form onSubmit={handleSearch} style={styles.searchContainer} className="fade-in">
            <div style={styles.searchWrapper}>
              <span style={styles.searchIconLeft}>📍</span>
              <input
                type="text"
                placeholder="Where do you want to go?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.searchInput}
              />
              <button type="submit" className="search-button" style={styles.searchButton}>
                <span style={styles.searchButtonIcon}>🔍</span>
                <span style={styles.searchButtonText}>Search</span>
              </button>
            </div>
          </form>

          {/* Stats Section */}
          <div style={styles.heroStats} className="fade-in">
            <div style={styles.statCard} className="glass">
              <div style={styles.statNumber}>10,000+</div>
              <div style={styles.statLabel}>Tours Available</div>
            </div>
            <div style={styles.statCard} className="glass">
              <div style={styles.statNumber}>5,000+</div>
              <div style={styles.statLabel}>Expert Guides</div>
            </div>
            <div style={styles.statCard} className="glass">
              <div style={styles.statNumber}>150+</div>
              <div style={styles.statLabel}>Countries</div>
            </div>
          </div>
        </div>

        {/* Floating Image Cards */}
        <div className="floating-images" style={styles.floatingImages}>
          <div className="float-animation" style={{ ...styles.floatingCard, ...styles.float1 }}>
            <img 
              src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400" 
              alt="Travel"
              style={styles.floatingImage}
            />
          </div>
          <div className="float-animation" style={{ ...styles.floatingCard, ...styles.float2 }}>
            <img 
              src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400" 
              alt="Adventure"
              style={styles.floatingImage}
            />
          </div>
          <div className="float-animation" style={{ ...styles.floatingCard, ...styles.float3 }}>
            <img 
              src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400" 
              alt="Explore"
              style={styles.floatingImage}
            />
          </div>
        </div>
      </div>

      {/* Featured Destinations */}
      <div style={styles.section}>
        <div style={styles.container}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Featured Destinations</h2>
            <p style={styles.sectionSubtitle}>Explore the world's most amazing places</p>
          </div>
          
          <div style={styles.destinationsGrid}>
            {featuredDestinations.map((dest) => (
              <div
                key={dest.id}
                className="destination-card"
                style={styles.destinationCard}
                onClick={() => {
                  sessionStorage.setItem('searchQuery', dest.name);
                  setCurrentPage('destinations');
                }}
              >
                <div style={styles.destinationImageWrapper}>
                  <img src={dest.image} alt={dest.name} style={styles.destinationImage} />
                  <div style={styles.destinationOverlay}></div>
                </div>
                <div style={styles.destinationContent}>
                  <h3 style={styles.destinationName}>{dest.name}</h3>
                  <p style={styles.destinationTours}>{dest.tours} tours available</p>
                  <div style={styles.exploreButton}>
                    Explore →
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Categories */}
      <div style={{ ...styles.section, background: COLORS.light }}>
        <div style={styles.container}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Browse by Category</h2>
            <p style={styles.sectionSubtitle}>Find tours that match your interests</p>
          </div>
          
          <div style={styles.categoriesGrid}>
            {popularCategories.map((category, index) => (
              <div
                key={index}
                className="category-card"
                style={styles.categoryCard}
                onClick={() => {
                  sessionStorage.setItem('selectedCategory', category.name.toLowerCase());
                  setCurrentPage('destinations');
                }}
              >
                <div className="category-icon-wrapper" style={styles.categoryIconWrapper}>
                  <span style={styles.categoryIcon}>{category.icon}</span>
                </div>
                <h3 style={styles.categoryName}>{category.name}</h3>
                <p style={styles.categoryDescription}>{category.description}</p>
                <div className="category-arrow" style={styles.categoryArrow}>→</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div style={styles.section}>
        <div style={styles.container}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>How It Works</h2>
            <p style={styles.sectionSubtitle}>Start your journey in three simple steps</p>
          </div>
          
          <div style={styles.stepsGrid}>
            <div style={styles.stepCard}>
              <div style={styles.stepIconWrapper}>
                <div style={styles.stepIcon}>🔍</div>
                <div style={styles.stepNumber}>01</div>
              </div>
              <h3 style={styles.stepTitle}>Find Your Tour</h3>
              <p style={styles.stepDescription}>
                Browse through thousands of curated tours or search for your dream destination with our smart filters
              </p>
            </div>
            
            <div className="step-connector" style={styles.stepConnector}></div>
            
            <div style={styles.stepCard}>
              <div style={styles.stepIconWrapper}>
                <div style={styles.stepIcon}>✅</div>
                <div style={styles.stepNumber}>02</div>
              </div>
              <h3 style={styles.stepTitle}>Book with Confidence</h3>
              <p style={styles.stepDescription}>
                Read authentic reviews, chat directly with guides, and book your perfect experience with secure payment
              </p>
            </div>
            
            <div className="step-connector" style={styles.stepConnector}></div>
            
            <div style={styles.stepCard}>
              <div style={styles.stepIconWrapper}>
                <div style={styles.stepIcon}>🎉</div>
                <div style={styles.stepNumber}>03</div>
              </div>
              <h3 style={styles.stepTitle}>Explore & Enjoy</h3>
              <p style={styles.stepDescription}>
                Meet your expert guide and embark on an unforgettable adventure tailored just for you
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div style={styles.ctaSection}>
        <div style={styles.ctaContent}>
          <h2 style={styles.ctaTitle}>Ready to Start Your Journey?</h2>
          <p style={styles.ctaSubtitle}>
            Join thousands of travelers discovering the world with local experts
          </p>
          <div style={styles.ctaButtons}>
            <button
              onClick={() => setCurrentPage('destinations')}
              className="cta-primary"
              style={styles.ctaPrimary}
            >
              Browse All Tours
            </button>
            <button
              onClick={() => setCurrentPage('guides')}
              className="cta-secondary"
              style={styles.ctaSecondary}
            >
              Find Expert Guides
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    background: '#ffffff',
  },
  
  // Hero Section with Background Image
  hero: {
    minHeight: '90vh',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    padding: '120px 24px 80px',
  },
  
  // Background Image
  heroBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: 'url(https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&q=80)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    zIndex: 0,
  },
  
  // Gradient Overlay on Image
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.85) 0%, rgba(118, 75, 162, 0.85) 100%)',
    zIndex: 1,
  },
  
  // Animated Background Shapes
  shape1: {
    position: 'absolute',
    width: '600px',
    height: '600px',
    background: 'rgba(255, 255, 255, 0.08)',
    borderRadius: '50%',
    top: '-200px',
    right: '-100px',
    zIndex: 1,
  },
  shape2: {
    position: 'absolute',
    width: '400px',
    height: '400px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '50%',
    bottom: '-100px',
    left: '-50px',
    zIndex: 1,
  },
  shape3: {
    position: 'absolute',
    width: '300px',
    height: '300px',
    background: 'rgba(255, 255, 255, 0.06)',
    borderRadius: '50%',
    top: '50%',
    left: '10%',
    zIndex: 1,
  },
  
  heroContent: {
    maxWidth: '700px',
    textAlign: 'center',
    color: 'white',
    position: 'relative',
    zIndex: 2,
  },
  
  badge: {
    display: 'inline-block',
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    padding: '10px 24px',
    borderRadius: '50px',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '32px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
  },
  
  heroTitle: {
    fontSize: '64px',
    fontWeight: '800',
    marginBottom: '24px',
    lineHeight: '1.2',
    letterSpacing: '-1px',
  },
  
  gradientText: {
    background: 'linear-gradient(to right, #ffd89b, #19547b)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    display: 'block',
  },
  
  heroSubtitle: {
    fontSize: '18px',
    marginBottom: '48px',
    opacity: 0.95,
    lineHeight: '1.6',
  },
  
  // Modern Search Bar
  searchContainer: {
    marginBottom: '64px',
  },
  
  searchWrapper: {
    display: 'flex',
    alignItems: 'center',
    background: 'white',
    borderRadius: '60px',
    padding: '8px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    maxWidth: '600px',
    margin: '0 auto',
  },
  
  searchIconLeft: {
    fontSize: '24px',
    marginLeft: '20px',
    marginRight: '12px',
  },
  
  searchInput: {
    flex: 1,
    padding: '16px 8px',
    fontSize: '16px',
    border: 'none',
    outline: 'none',
    background: 'transparent',
    color: '#333',
  },
  
  searchButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '14px 32px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '50px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.3s',
  },
  
  searchButtonIcon: {
    fontSize: '18px',
  },
  
  searchButtonText: {
    display: 'inline',
  },
  
  // Stats Cards
  heroStats: {
    display: 'flex',
    gap: '32px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  
  statCard: {
    padding: '24px 32px',
    borderRadius: '20px',
    textAlign: 'center',
    minWidth: '150px',
  },
  
  statNumber: {
    fontSize: '36px',
    fontWeight: 'bold',
    marginBottom: '8px',
  },
  
  statLabel: {
    fontSize: '14px',
    opacity: 0.9,
  },
  
  // Floating Image Cards
  floatingImages: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    display: 'none',
    zIndex: 2,
  },
  
  floatingCard: {
    position: 'absolute',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    transform: 'rotate(-10deg)',
  },
  
  float1: {
    width: '200px',
    height: '250px',
    top: '15%',
    right: '8%',
  },
  
  float2: {
    width: '180px',
    height: '220px',
    bottom: '20%',
    right: '5%',
  },
  
  float3: {
    width: '160px',
    height: '200px',
    top: '40%',
    left: '5%',
  },
  
  floatingImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  
  // Sections
  section: {
    padding: '100px 0',
  },
  
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px',
  },
  
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '64px',
  },
  
  sectionTitle: {
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: '16px',
  },
  
  sectionSubtitle: {
    fontSize: '18px',
    color: '#666',
  },
  
  // Destinations Grid
  destinationsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '32px',
  },
  
  destinationCard: {
    borderRadius: '24px',
    overflow: 'hidden',
    cursor: 'pointer',
    background: 'white',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  
  destinationImageWrapper: {
    height: '280px',
    position: 'relative',
    overflow: 'hidden',
  },
  
  destinationImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.4s',
  },
  
  destinationOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.6) 100%)',
  },
  
  destinationContent: {
    padding: '24px',
  },
  
  destinationName: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: '8px',
  },
  
  destinationTours: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '16px',
  },
  
  exploreButton: {
    display: 'inline-block',
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: '14px',
  },
  
  // Categories Grid
  categoriesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '24px',
  },
  
  categoryCard: {
    background: 'white',
    padding: '40px 32px',
    borderRadius: '24px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.4s',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    position: 'relative',
    overflow: 'hidden',
  },
  
  categoryIconWrapper: {
    width: '80px',
    height: '80px',
    background: COLORS.light,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
    transition: 'transform 0.4s',
  },
  
  categoryIcon: {
    fontSize: '40px',
  },
  
  categoryName: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: '12px',
  },
  
  categoryDescription: {
    fontSize: '14px',
    color: '#666',
    lineHeight: '1.6',
  },
  
  categoryArrow: {
    fontSize: '24px',
    color: COLORS.primary,
    marginTop: '16px',
    opacity: 0,
    transition: 'opacity 0.4s',
  },
  
  // Steps Grid
  stepsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '40px',
    alignItems: 'center',
  },
  
  stepCard: {
    textAlign: 'center',
    padding: '32px',
  },
  
  stepIconWrapper: {
    position: 'relative',
    marginBottom: '32px',
  },
  
  stepIcon: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '40px',
    margin: '0 auto',
    boxShadow: '0 10px 40px rgba(102, 126, 234, 0.3)',
  },
  
  stepNumber: {
    position: 'absolute',
    top: '-10px',
    right: 'calc(50% - 60px)',
    background: 'white',
    color: COLORS.primary,
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  
  stepConnector: {
    height: '2px',
    background: 'linear-gradient(to right, #667eea, #764ba2)',
    width: '100%',
    display: 'none',
  },
  
  stepTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: '16px',
  },
  
  stepDescription: {
    fontSize: '16px',
    color: '#666',
    lineHeight: '1.8',
  },
  
  // CTA Section
  ctaSection: {
    padding: '100px 24px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    textAlign: 'center',
    color: 'white',
    position: 'relative',
    overflow: 'hidden',
  },
  
  ctaContent: {
    maxWidth: '800px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 2,
  },
  
  ctaTitle: {
    fontSize: '48px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  
  ctaSubtitle: {
    fontSize: '20px',
    marginBottom: '48px',
    opacity: 0.95,
  },
  
  ctaButtons: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  
  ctaPrimary: {
    padding: '18px 48px',
    background: 'white',
    color: COLORS.primary,
    border: 'none',
    borderRadius: '50px',
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
  },
  
  ctaSecondary: {
    padding: '18px 48px',
    background: 'transparent',
    color: 'white',
    border: '2px solid white',
    borderRadius: '50px',
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
};

// Media Queries for Responsive Design
if (typeof window !== 'undefined') {
  const mediaQuery = window.matchMedia('(max-width: 768px)');
  if (mediaQuery.matches) {
    styles.heroTitle.fontSize = '40px';
    styles.sectionTitle.fontSize = '32px';
    styles.ctaTitle.fontSize = '32px';
    styles.searchButtonText = { display: 'none' };
  }
}

export default HomePage;