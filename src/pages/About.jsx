import { useState } from 'react';

// Icon components
const Globe = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
);

const Users = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const Award = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="8" r="7"></circle>
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
  </svg>
);

const Shield = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

const Heart = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const Target = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"></circle>
    <circle cx="12" cy="12" r="6"></circle>
    <circle cx="12" cy="12" r="2"></circle>
  </svg>
);

const Check = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const Quote = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"></path>
  </svg>
);

export default function About() {
  const [activeTab, setActiveTab] = useState('mission');

  const styles = {
    container: {
      minHeight: '100vh',
      background: '#ffffff',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    hero: {
      position: 'relative',
      height: '500px',
      background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #9333ea 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    },
    heroOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.3)',
      zIndex: 1
    },
    heroContent: {
      position: 'relative',
      zIndex: 2,
      textAlign: 'center',
      color: 'white',
      padding: '0 20px',
      maxWidth: '900px'
    },
    heroTitle: {
      fontSize: '3.5rem',
      fontWeight: 'bold',
      marginBottom: '20px',
      lineHeight: '1.2'
    },
    heroSubtitle: {
      fontSize: '1.5rem',
      opacity: 0.95,
      lineHeight: '1.6'
    },
    section: {
      padding: '80px 20px',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    sectionDark: {
      background: '#f8f9fa',
      padding: '80px 20px'
    },
    sectionTitle: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: '16px',
      color: '#1a1a1a'
    },
    sectionSubtitle: {
      fontSize: '1.125rem',
      textAlign: 'center',
      color: '#666',
      marginBottom: '60px',
      maxWidth: '700px',
      marginLeft: 'auto',
      marginRight: 'auto'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '40px',
      marginBottom: '80px'
    },
    statCard: {
      textAlign: 'center',
      padding: '30px'
    },
    statNumber: {
      fontSize: '3.5rem',
      fontWeight: 'bold',
      background: 'linear-gradient(135deg, #2563eb, #9333ea)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      marginBottom: '12px'
    },
    statLabel: {
      fontSize: '1.125rem',
      color: '#666',
      fontWeight: '500'
    },
    tabContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '20px',
      marginBottom: '60px',
      flexWrap: 'wrap'
    },
    tab: {
      padding: '12px 32px',
      border: 'none',
      background: 'white',
      borderRadius: '50px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
    },
    tabActive: {
      background: 'linear-gradient(135deg, #2563eb, #9333ea)',
      color: 'white',
      boxShadow: '0 4px 16px rgba(37, 99, 235, 0.4)'
    },
    contentBox: {
      background: 'white',
      padding: '60px',
      borderRadius: '16px',
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.08)',
      maxWidth: '900px',
      margin: '0 auto'
    },
    contentTitle: {
      fontSize: '2rem',
      fontWeight: 'bold',
      marginBottom: '24px',
      color: '#1a1a1a'
    },
    contentText: {
      fontSize: '1.125rem',
      lineHeight: '1.8',
      color: '#444',
      marginBottom: '24px'
    },
    featuresList: {
      listStyle: 'none',
      padding: 0,
      margin: '30px 0'
    },
    featureItem: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '16px',
      marginBottom: '20px',
      fontSize: '1.125rem',
      color: '#444'
    },
    checkIcon: {
      color: '#4CAF50',
      flexShrink: 0,
      marginTop: '2px'
    },
    valuesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '40px'
    },
    valueCard: {
      background: 'white',
      padding: '40px',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      transition: 'all 0.3s'
    },
    valueIcon: {
      color: '#2563eb',
      marginBottom: '20px'
    },
    valueTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginBottom: '16px',
      color: '#1a1a1a'
    },
    valueDescription: {
      color: '#666',
      lineHeight: '1.7',
      fontSize: '1rem'
    },
    teamGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '40px'
    },
    teamCard: {
      textAlign: 'center',
      transition: 'transform 0.3s'
    },
    teamImage: {
      width: '180px',
      height: '180px',
      borderRadius: '50%',
      margin: '0 auto 20px',
      background: 'linear-gradient(135deg, #2563eb, #9333ea)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '3rem',
      fontWeight: 'bold',
      boxShadow: '0 8px 24px rgba(37, 99, 235, 0.3)'
    },
    teamName: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginBottom: '8px',
      color: '#1a1a1a'
    },
    teamRole: {
      fontSize: '1rem',
      color: '#2563eb',
      fontWeight: '600',
      marginBottom: '12px'
    },
    teamBio: {
      fontSize: '0.95rem',
      color: '#666',
      lineHeight: '1.6'
    },
    testimonialsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
      gap: '30px'
    },
    testimonialCard: {
      background: 'white',
      padding: '40px',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      position: 'relative'
    },
    quoteIcon: {
      color: '#e0e7ff',
      marginBottom: '20px'
    },
    testimonialText: {
      fontSize: '1.1rem',
      lineHeight: '1.7',
      color: '#444',
      marginBottom: '24px',
      fontStyle: 'italic'
    },
    testimonialAuthor: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },
    authorImage: {
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #2563eb, #9333ea)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '1.5rem',
      fontWeight: 'bold'
    },
    authorName: {
      fontSize: '1.125rem',
      fontWeight: 'bold',
      color: '#1a1a1a'
    },
    authorLocation: {
      fontSize: '0.95rem',
      color: '#666'
    },
    ctaSection: {
      background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #9333ea 100%)',
      padding: '80px 20px',
      textAlign: 'center',
      color: 'white'
    },
    ctaTitle: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      marginBottom: '20px'
    },
    ctaText: {
      fontSize: '1.25rem',
      marginBottom: '40px',
      opacity: 0.95
    },
    ctaButton: {
      background: 'white',
      color: '#2563eb',
      padding: '16px 48px',
      fontSize: '1.125rem',
      fontWeight: 'bold',
      border: 'none',
      borderRadius: '50px',
      cursor: 'pointer',
      transition: 'all 0.3s',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
    }
  };

  const values = [
    {
      icon: <Globe />,
      title: 'Local Experiences',
      description: 'Connect with authentic local guides who share their passion and deep knowledge of their homeland, creating unforgettable memories.'
    },
    {
      icon: <Users />,
      title: 'Community First',
      description: 'We empower local communities by providing guides with opportunities to showcase their culture and earn sustainable income.'
    },
    {
      icon: <Award />,
      title: 'Quality Assured',
      description: 'Every guide is carefully vetted and trained to ensure you receive the highest quality tours and experiences.'
    },
    {
      icon: <Shield />,
      title: 'Safe & Secure',
      description: 'Your safety is our priority. All bookings are protected with secure payments and comprehensive insurance coverage.'
    },
    {
      icon: <Heart />,
      title: 'Personalized Service',
      description: 'Customize your journey with flexible options and personal touches that make every tour unique to your preferences.'
    },
    {
      icon: <Target />,
      title: 'Sustainable Travel',
      description: 'We promote responsible tourism that respects local cultures and minimizes environmental impact.'
    }
  ];

  const team = [
    { name: 'Pia', role: 'Founder & CEO', initial: 'PS', bio: '15 years in travel tech, passionate about connecting cultures' },
    { name: 'Jashan', role: 'Head of Operations', initial: 'JV', bio: 'Former tour operator with global network expertise' },
    { name: 'Cinyi', role: 'Community Manager', initial: 'CH', bio: 'Dedicated to empowering local guide communities' },
    { name: 'Henry', role: 'Lead Developer', initial: 'HS', bio: 'Building seamless experiences through technology' }
  ];

  const testimonials = [
    {
      text: "The local guide made all the difference! We discovered hidden gems and learned so much about the culture. It felt like exploring with a friend rather than just another tourist.",
      author: 'Emma Rodriguez',
      location: 'Spain',
      initial: 'ER'
    },
    {
      text: "Best travel experience I've ever had. The booking process was smooth, and our guide was incredibly knowledgeable and friendly. Highly recommend to anyone looking for authentic adventures!",
      author: 'David Kim',
      location: 'South Korea',
      initial: 'DK'
    },
    {
      text: "I've used many tour platforms, but this one stands out. The local guides truly care about showing you the real destination. It's personal, safe, and absolutely worth every penny.",
      author: 'Sophia Martinez',
      location: 'Mexico',
      initial: 'SM'
    }
  ];

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.hero}>
        <div style={styles.heroOverlay}></div>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Connecting Travelers with Local Guides</h1>
          <p style={styles.heroSubtitle}>
            Experience the world through the eyes of those who know it best. Authentic adventures, meaningful connections.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div style={styles.section}>
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>5,000+</div>
            <div style={styles.statLabel}>Local Guides</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>150+</div>
            <div style={styles.statLabel}>Countries</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>100K+</div>
            <div style={styles.statLabel}>Happy Travelers</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>4.9★</div>
            <div style={styles.statLabel}>Average Rating</div>
          </div>
        </div>
      </div>

      {/* Mission/Vision Section */}
      <div style={styles.sectionDark}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={styles.tabContainer}>
            <button
              style={{...styles.tab, ...(activeTab === 'mission' ? styles.tabActive : {})}}
              onClick={() => setActiveTab('mission')}
              onMouseEnter={(e) => {
                if (activeTab !== 'mission') e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'mission') e.target.style.transform = 'translateY(0)';
              }}
            >
              Our Mission
            </button>
            <button
              style={{...styles.tab, ...(activeTab === 'vision' ? styles.tabActive : {})}}
              onClick={() => setActiveTab('vision')}
              onMouseEnter={(e) => {
                if (activeTab !== 'vision') e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'vision') e.target.style.transform = 'translateY(0)';
              }}
            >
              Our Vision
            </button>
            <button
              style={{...styles.tab, ...(activeTab === 'how' ? styles.tabActive : {})}}
              onClick={() => setActiveTab('how')}
              onMouseEnter={(e) => {
                if (activeTab !== 'how') e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'how') e.target.style.transform = 'translateY(0)';
              }}
            >
              How It Works
            </button>
          </div>

          <div style={styles.contentBox}>
            {activeTab === 'mission' && (
              <>
                <h3 style={styles.contentTitle}>Empowering Communities Through Travel</h3>
                <p style={styles.contentText}>
                  Our mission is to revolutionize travel by connecting curious travelers with passionate local guides who bring destinations to life. We believe that the best travel experiences come from authentic connections with people who truly understand the heart and soul of their homeland.
                </p>
                <p style={styles.contentText}>
                  By creating a platform that empowers local guides, we're not just facilitating tours – we're building bridges between cultures, supporting local economies, and making travel more meaningful for everyone involved.
                </p>
              </>
            )}

            {activeTab === 'vision' && (
              <>
                <h3 style={styles.contentTitle}>A World Connected Through Stories</h3>
                <p style={styles.contentText}>
                  We envision a world where every traveler has access to authentic, personalized experiences that go beyond typical tourist attractions. A world where local guides are recognized as the cultural ambassadors they truly are.
                </p>
                <p style={styles.contentText}>
                  Our vision is to become the world's most trusted platform for connecting travelers with local experts, fostering sustainable tourism that benefits both visitors and host communities alike.
                </p>
              </>
            )}

            {activeTab === 'how' && (
              <>
                <h3 style={styles.contentTitle}>Simple, Safe, and Seamless</h3>
                <ul style={styles.featuresList}>
                  <li style={styles.featureItem}>
                    <span style={styles.checkIcon}><Check /></span>
                    <span><strong>Browse & Discover:</strong> Explore thousands of unique tours and experiences curated by local guides</span>
                  </li>
                  <li style={styles.featureItem}>
                    <span style={styles.checkIcon}><Check /></span>
                    <span><strong>Connect Directly:</strong> Chat with guides to customize your perfect experience</span>
                  </li>
                  <li style={styles.featureItem}>
                    <span style={styles.checkIcon}><Check /></span>
                    <span><strong>Book Securely:</strong> Make safe payments with our protected booking system</span>
                  </li>
                  <li style={styles.featureItem}>
                    <span style={styles.checkIcon}><Check /></span>
                    <span><strong>Experience & Share:</strong> Enjoy your adventure and share your story with others</span>
                  </li>
                </ul>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>What We Stand For</h2>
        <p style={styles.sectionSubtitle}>
          Our core values guide everything we do, from supporting local communities to ensuring unforgettable travel experiences.
        </p>
        <div style={styles.valuesGrid}>
          {values.map((value, index) => (
            <div
              key={index}
              style={styles.valueCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
              }}
            >
              <div style={styles.valueIcon}>{value.icon}</div>
              <h3 style={styles.valueTitle}>{value.title}</h3>
              <p style={styles.valueDescription}>{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div style={styles.sectionDark}>
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Meet Our Team</h2>
          <p style={styles.sectionSubtitle}>
            Passionate individuals dedicated to making your travel dreams come true.
          </p>
          <div style={styles.teamGrid}>
            {team.map((member, index) => (
              <div
                key={index}
                style={styles.teamCard}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div style={styles.teamImage}>{member.initial}</div>
                <h3 style={styles.teamName}>{member.name}</h3>
                <div style={styles.teamRole}>{member.role}</div>
                <p style={styles.teamBio}>{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>What Travelers Say</h2>
        <p style={styles.sectionSubtitle}>
          Don't just take our word for it – hear from travelers who've experienced the difference.
        </p>
        <div style={styles.testimonialsGrid}>
          {testimonials.map((testimonial, index) => (
            <div key={index} style={styles.testimonialCard}>
              <div style={styles.quoteIcon}><Quote /></div>
              <p style={styles.testimonialText}>"{testimonial.text}"</p>
              <div style={styles.testimonialAuthor}>
                <div style={styles.authorImage}>{testimonial.initial}</div>
                <div>
                  <div style={styles.authorName}>{testimonial.author}</div>
                  <div style={styles.authorLocation}>{testimonial.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div style={styles.ctaSection}>
        <h2 style={styles.ctaTitle}>Ready to Start Your Adventure?</h2>
        <p style={styles.ctaText}>
          Join thousands of travelers discovering the world through local eyes.
        </p>
        <button
          style={styles.ctaButton}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 6px 30px rgba(0, 0, 0, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
          }}
        >
          Explore Destinations
        </button>
      </div>
    </div>
  );
}