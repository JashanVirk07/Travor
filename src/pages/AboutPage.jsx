// src/pages/AboutPage.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { COLORS } from '../utils/colors';

const AboutPage = () => {
  const { setCurrentPage } = useAuth();

  const features = [
    {
      icon: '🌍',
      title: 'Global Network',
      description: 'Connect with expert local guides in over 150 countries worldwide'
    },
    {
      icon: '⭐',
      title: 'Verified Guides',
      description: 'All guides are verified and reviewed by our community'
    },
    {
      icon: '💬',
      title: 'Direct Communication',
      description: 'Chat directly with guides to customize your perfect experience'
    },
    {
      icon: '🔒',
      title: 'Secure Booking',
      description: 'Safe and secure payment processing with instant confirmation'
    },
    {
      icon: '📱',
      title: 'Mobile Ready',
      description: 'Access your bookings and tours anytime, anywhere'
    },
    {
      icon: '🎯',
      title: 'Personalized',
      description: 'Tailored experiences designed just for you'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Tours Available' },
    { number: '5,000+', label: 'Expert Guides' },
    { number: '150+', label: 'Countries' },
    { number: '50,000+', label: 'Happy Travelers' }
  ];

  const team = [
    {
      name: 'Pia',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      bio: 'Visionary leader passionate about connecting travelers with authentic local experiences'
    },
    {
      name: 'Jashan',
      role: 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      bio: 'Expert in logistics and ensuring seamless travel experiences for our community'
    },
    {
      name: 'Cinyi',
      role: 'Community Manager',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      bio: 'Building and nurturing our global community of travelers and guides'
    }
  ];

  return (
    <div style={styles.page}>
      {/* Hero Section */}
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle} className="fade-in">About Travor</h1>
          <p style={styles.heroSubtitle} className="fade-in">
            Connecting travelers with authentic local experiences worldwide
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div style={styles.section}>
        <div style={styles.container}>
          <div style={styles.missionGrid}>
            <div style={styles.missionText}>
              <h2 style={styles.sectionTitle}>Our Mission</h2>
              <p style={styles.paragraph}>
                At Travor, we believe that the best way to experience a destination is through the eyes of a local. 
                Our mission is to connect curious travelers with passionate local guides who can provide authentic, 
                personalized experiences that go beyond the typical tourist attractions.
              </p>
              <p style={styles.paragraph}>
                We're building a global community where cultural exchange, authentic connections, and unforgettable 
                memories are created every day. Whether you're seeking adventure, cultural immersion, culinary 
                delights, or hidden gems, our network of expert guides is ready to make your journey extraordinary.
              </p>
              <button 
                onClick={() => setCurrentPage('destinations')} 
                style={styles.ctaButton}
                className="cta-primary"
              >
                Start Your Journey
              </button>
            </div>
            <div style={styles.missionImage}>
              <img 
                src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600" 
                alt="Travel" 
                style={styles.image}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div style={{ ...styles.section, background: COLORS.light }}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitleCenter}>Our Impact</h2>
          <div style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <div key={index} style={styles.statCard} className="stat-card">
                <div style={styles.statNumber}>{stat.number}</div>
                <div style={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div style={styles.section}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitleCenter}>Why Choose Travor?</h2>
          <div style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <div key={index} style={styles.featureCard} className="feature-card">
                <div style={styles.featureIcon}>{feature.icon}</div>
                <h3 style={styles.featureTitle}>{feature.title}</h3>
                <p style={styles.featureDescription}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div style={{ ...styles.section, background: COLORS.light }}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitleCenter}>Meet Our Team</h2>
          <p style={styles.teamIntro}>
            Passionate travelers and industry experts dedicated to transforming how you explore the world
          </p>
          <div style={styles.teamGrid}>
            {team.map((member, index) => (
              <div key={index} style={styles.teamCard} className="team-card">
                <div style={styles.teamImageWrapper} className="team-image-wrapper">
                  <img src={member.image} alt={member.name} style={styles.teamImage} />
                </div>
                <h3 style={styles.teamName}>{member.name}</h3>
                <div style={styles.teamRole}>{member.role}</div>
                <p style={styles.teamBio}>{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div style={styles.section}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitleCenter}>Our Values</h2>
          <div style={styles.valuesGrid}>
            <div style={styles.valueCard} className="value-card">
              <div style={styles.valueIcon}>🤝</div>
              <h3 style={styles.valueTitle}>Authenticity</h3>
              <p style={styles.valueText}>
                We prioritize genuine connections and authentic local experiences over tourist traps
              </p>
            </div>
            <div style={styles.valueCard} className="value-card">
              <div style={styles.valueIcon}>🌱</div>
              <h3 style={styles.valueTitle}>Sustainability</h3>
              <p style={styles.valueText}>
                We promote responsible tourism that benefits local communities and preserves culture
              </p>
            </div>
            <div style={styles.valueCard} className="value-card">
              <div style={styles.valueIcon}>💡</div>
              <h3 style={styles.valueTitle}>Innovation</h3>
              <p style={styles.valueText}>
                We continuously improve our platform to enhance your travel planning experience
              </p>
            </div>
            <div style={styles.valueCard} className="value-card">
              <div style={styles.valueIcon}>❤️</div>
              <h3 style={styles.valueTitle}>Community</h3>
              <p style={styles.valueText}>
                We build a supportive network of travelers and guides who share our passion
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div style={styles.ctaSection}>
        <div style={styles.container}>
          <h2 style={styles.ctaSectionTitle}>Ready to Explore?</h2>
          <p style={styles.ctaSectionSubtitle}>
            Join thousands of travelers discovering the world with local experts
          </p>
          <div style={styles.ctaButtons}>
            <button 
              onClick={() => setCurrentPage('destinations')} 
              style={styles.ctaPrimaryButton}
              className="cta-primary"
            >
              Browse Tours
            </button>
            <button 
              onClick={() => setCurrentPage('guides')} 
              style={styles.ctaSecondaryButton}
              className="cta-secondary"
            >
              Become a Guide
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
  hero: {
    height: '400px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  heroContent: {
    position: 'relative',
    zIndex: 2,
    maxWidth: '800px',
    padding: '0 24px',
  },
  heroTitle: {
    fontSize: '56px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  heroSubtitle: {
    fontSize: '22px',
    opacity: 0.95,
  },
  section: {
    padding: '100px 0',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px',
  },
  sectionTitle: {
    fontSize: '42px',
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: '24px',
  },
  sectionTitleCenter: {
    fontSize: '42px',
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: '48px',
    textAlign: 'center',
  },
  paragraph: {
    fontSize: '18px',
    lineHeight: '1.8',
    color: '#666',
    marginBottom: '20px',
  },
  missionGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '60px',
    alignItems: 'center',
  },
  missionText: {
    display: 'flex',
    flexDirection: 'column',
  },
  missionImage: {
    borderRadius: '24px',
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
    transition: 'transform 0.3s',
  },
  image: {
    width: '100%',
    height: 'auto',
    display: 'block',
    transition: 'transform 0.3s',
  },
  ctaButton: {
    padding: '16px 40px',
    background: COLORS.primary,
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '20px',
    alignSelf: 'flex-start',
    transition: 'all 0.3s',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '40px',
  },
  statCard: {
    textAlign: 'center',
    padding: '40px 20px',
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    transition: 'all 0.3s',
  },
  statNumber: {
    fontSize: '48px',
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: '12px',
    transition: 'transform 0.3s',
  },
  statLabel: {
    fontSize: '16px',
    color: '#666',
    fontWeight: '500',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '32px',
  },
  featureCard: {
    padding: '40px 32px',
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    textAlign: 'center',
    transition: 'all 0.3s',
    cursor: 'pointer',
  },
  featureIcon: {
    fontSize: '56px',
    marginBottom: '20px',
    transition: 'transform 0.3s',
  },
  featureTitle: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: '12px',
  },
  featureDescription: {
    fontSize: '16px',
    color: '#666',
    lineHeight: '1.6',
  },
  teamIntro: {
    fontSize: '18px',
    color: '#666',
    textAlign: 'center',
    maxWidth: '700px',
    margin: '0 auto 60px',
  },
  teamGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '40px',
  },
  teamCard: {
    background: 'white',
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    textAlign: 'center',
    transition: 'all 0.3s',
  },
  teamImageWrapper: {
    width: '150px',
    height: '150px',
    margin: '0 auto 24px',
    borderRadius: '50%',
    overflow: 'hidden',
    border: `4px solid ${COLORS.primary}`,
    transition: 'all 0.3s',
  },
  teamImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s',
  },
  teamName: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: '8px',
  },
  teamRole: {
    fontSize: '16px',
    color: COLORS.primary,
    fontWeight: '600',
    marginBottom: '16px',
  },
  teamBio: {
    fontSize: '14px',
    color: '#666',
    lineHeight: '1.6',
  },
  valuesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '32px',
  },
  valueCard: {
    padding: '40px 32px',
    background: COLORS.light,
    borderRadius: '16px',
    textAlign: 'center',
    transition: 'all 0.3s',
    cursor: 'pointer',
  },
  valueIcon: {
    fontSize: '56px',
    marginBottom: '20px',
    transition: 'transform 0.3s',
  },
  valueTitle: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: '12px',
  },
  valueText: {
    fontSize: '16px',
    color: '#666',
    lineHeight: '1.6',
  },
  ctaSection: {
    padding: '100px 24px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    textAlign: 'center',
  },
  ctaSectionTitle: {
    fontSize: '48px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  ctaSectionSubtitle: {
    fontSize: '20px',
    marginBottom: '48px',
    opacity: '0.95'
  },
  ctaButtons: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  ctaPrimaryButton: {
    padding: '18px 48px',
    background: 'white',
    color: COLORS.primary,
    border: 'none',
    borderRadius: '50px',
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    transition: 'all 0.3s',
  },
  ctaSecondaryButton: {
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

export default AboutPage;