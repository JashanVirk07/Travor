// src/pages/HomePage.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../utils/colors';
import { Icon } from '../components/Icons';

const HomePage = () => {
  const { setCurrentPage } = useAuth();

  // Hover and focus states
  const [searchFocused, setSearchFocused] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [hoveredExp, setHoveredExp] = useState(null);
  const [hoveredCTA, setHoveredCTA] = useState(false);
  const [hoveredLogin, setHoveredLogin] = useState(false);
  const [hoveredSignup, setHoveredSignup] = useState(false);
  const [hoveredStat, setHoveredStat] = useState(null);

  return (
    <div style={{ flex: 1 }}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>Connect with Verified Local Guides</h1>
        <p style={styles.heroSubtitle}>
          Book authentic experiences led by the people who know it best
        </p>
        <div style={styles.searchBar}>
          <Icon.Search />
          <input
            type="text"
            placeholder="Search destination or guide..."
            style={{
              ...styles.searchInput,
              ...(searchFocused ? styles.searchInputFocus : {}),
            }}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          <button
            style={{
              ...styles.searchButton,
              ...(hoveredCTA ? styles.searchButtonHover : {}),
            }}
            onMouseEnter={() => setHoveredCTA(true)}
            onMouseLeave={() => setHoveredCTA(false)}
          >
            Search
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.featuresSection}>
        <div style={styles.container}>
          <div style={styles.featuresGrid}>
            {[
              {
                icon: <Icon.Globe />,
                title: 'Authentic Journeys',
                desc: 'Go beyond tourist traps. Find unique, hand-crafted itineraries from local experts.',
              },
              {
                icon: <Icon.Award />,
                title: 'Monetize Local Knowledge',
                desc: 'Set your own rates and schedule. Connect directly with global travelers.',
              },
              {
                icon: <Icon.Shield />,
                title: 'Trust & Safety',
                desc: 'Secure payments and verified profiles ensure a reliable experience for everyone.',
              },
            ].map((feature, i) => (
              <div
                key={i}
                style={{
                  ...styles.featureCard,
                  ...(hoveredFeature === i ? styles.featureCardHover : {}),
                }}
                onMouseEnter={() => setHoveredFeature(i)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div style={styles.featureIcon}>{feature.icon}</div>
                <h3 style={styles.featureTitle}>{feature.title}</h3>
                <p style={styles.featureDesc}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experiences Section */}
      <section style={styles.experiencesSection}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>Popular Experiences</h2>
          <div style={styles.experiencesGrid}>
            {[
              {
                img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400',
                title: 'Bali Adventure',
                price: 120,
                rating: 4.9,
              },
              {
                img: 'https://images.unsplash.com/photo-1493558103817-58b2924bce98?w=400',
                title: 'Tokyo City Tour',
                price: 95,
                rating: 4.8,
              },
              {
                img: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400',
                title: 'Paris Getaway',
                price: 180,
                rating: 4.9,
              },
            ].map((exp, i) => (
              <div
                key={i}
                style={{
                  ...styles.experienceCard,
                  ...(hoveredExp === i ? styles.experienceCardHover : {}),
                }}
                onMouseEnter={() => setHoveredExp(i)}
                onMouseLeave={() => setHoveredExp(null)}
              >
                <img
                  src={exp.img}
                  alt={exp.title}
                  style={{
                    ...styles.experienceImage,
                    ...(hoveredExp === i ? styles.experienceImageHover : {}),
                  }}
                />
                <div style={styles.experienceContent}>
                  <h3 style={styles.experienceTitle}>{exp.title}</h3>
                  <div style={styles.experienceRating}>
                    <Icon.Star filled />
                    <span>{exp.rating}</span>
                  </div>
                  <div style={styles.experiencePrice}>${exp.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaContent}>
          <h2 style={styles.ctaTitle}>
            Become a Guide and Get Your First Booking Free!
          </h2>
          <button
            style={{
              ...styles.ctaButton,
              ...(hoveredCTA ? styles.ctaButtonHover : {}),
            }}
            onClick={() => setCurrentPage('register')}
            onMouseEnter={() => setHoveredCTA(true)}
            onMouseLeave={() => setHoveredCTA(false)}
          >
            Sign Up Now
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section style={styles.statsSection}>
        <div style={styles.container}>
          <div style={styles.statsGrid}>
            {[
              { number: '5,000+', label: 'Local Guides' },
              { number: '150+', label: 'Countries' },
              { number: '100K+', label: 'Happy Travelers' },
              { number: '4.9★', label: 'Average Rating' },
            ].map((stat, i) => (
              <div
                key={i}
                style={styles.statCard}
                onMouseEnter={() => setHoveredStat(i)}
                onMouseLeave={() => setHoveredStat(null)}
              >
                <div
                  style={{
                    ...styles.statNumber,
                    ...(hoveredStat === i ? styles.statNumberHover : {}),
                  }}
                >
                  {stat.number}
                </div>
                <div style={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const styles = {
  hero: {
    background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1470&q=80') center/cover no-repeat`,
    padding: '150px 24px 200px 24px', // taller hero
    textAlign: 'center',
    color: 'white',
  },
  heroTitle: {
    fontSize: '48px',
    fontWeight: 'bold',
    marginBottom: '16px',
    lineHeight: '1.2',
    transition: 'transform 0.5s, opacity 0.5s',
  },
  heroSubtitle: {
    fontSize: '20px',
    marginBottom: '32px',
    opacity: 0.95,
    transition: 'opacity 0.5s',
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    background: 'white',
    borderRadius: '50px',
    padding: '8px 8px 8px 20px',
    gap: '12px',
    maxWidth: '600px',
    margin: '0 auto',
    color: COLORS.gray,
  },
  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '16px',
    padding: '8px',
    transition: 'all 0.3s',
  },
  searchInputFocus: {
    boxShadow: '0 0 10px rgba(0, 123, 255, 0.5)',
    transform: 'scale(1.02)',
  },
  searchButton: {
    background: COLORS.primary,
    color: 'white',
    border: 'none',
    padding: '12px 32px',
    borderRadius: '50px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  searchButtonHover: {
    transform: 'scale(1.05)',
    background: COLORS.secondary,
  },
  featuresSection: {
    padding: '80px 24px',
    background: COLORS.light,
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '32px',
  },
  featureCard: {
    background: 'white',
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    textAlign: 'center',
    transition: 'transform 0.3s, box-shadow 0.3s',
  },
  featureCardHover: {
    transform: 'translateY(-10px)',
    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
  },
  featureIcon: {
    color: COLORS.primary,
    marginBottom: '20px',
  },
  featureTitle: {
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '12px',
    color: '#333',
  },
  featureDesc: {
    color: '#666',
    lineHeight: '1.6',
  },
  experiencesSection: {
    padding: '80px 24px',
  },
  sectionTitle: {
    fontSize: '36px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '48px',
    color: '#333',
  },
  experiencesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '32px',
  },
  experienceCard: {
    background: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    cursor: 'pointer',
    transition: 'transform 0.3s, box-shadow 0.3s',
  },
  experienceCardHover: {
    transform: 'translateY(-8px)',
    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
  },
  experienceImage: {
    width: '100%',
    height: '250px',
    objectFit: 'cover',
    transition: 'transform 0.5s',
  },
  experienceImageHover: {
    transform: 'scale(1.05)',
  },
  experienceContent: {
    padding: '20px',
  },
  experienceTitle: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '12px',
    color: '#333',
  },
  experienceRating: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#FFB800',
    marginBottom: '12px',
  },
  experiencePrice: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  ctaSection: {
    background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
    padding: '80px 24px',
    textAlign: 'center',
  },
  ctaContent: {
    maxWidth: '800px',
    margin: '0 auto',
    color: 'white',
  },
  ctaTitle: {
    fontSize: '36px',
    fontWeight: 'bold',
    marginBottom: '24px',
  },
  ctaButton: {
    background: 'white',
    color: COLORS.primary,
    border: 'none',
    padding: '16px 48px',
    borderRadius: '50px',
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  ctaButtonHover: {
    background: COLORS.primary,
    color: 'white',
    transform: 'scale(1.05)',
  },
  statsSection: {
    padding: '80px 24px',
    background: COLORS.light,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '32px',
    textAlign: 'center',
  },
  statCard: {
    padding: '32px',
  },
  statNumber: {
    fontSize: '48px',
    fontWeight: 'bold',
    background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '12px',
    transition: 'transform 0.3s',
  },
  statNumberHover: {
    transform: 'scale(1.1)',
  },
  statLabel: {
    fontSize: '18px',
    color: '#666',
  },
};

export default HomePage;
