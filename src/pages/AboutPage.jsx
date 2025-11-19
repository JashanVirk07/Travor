// src/pages/AboutPage.jsx
import React, { useState } from 'react';
import { COLORS } from '../utils/colors';
import { Icon } from '../components/Icons';

const AboutPage = () => {
  const [activeTab, setActiveTab] = useState('mission');

  const values = [
    {
      icon: <Icon.Globe />,
      title: 'Local Experiences',
      desc: 'Connect with authentic guides who share their passion and deep knowledge of their homeland.',
    },
    {
      icon: <Icon.Shield />,
      title: 'Safe & Secure',
      desc: 'All bookings protected with secure payments and comprehensive insurance coverage.',
    },
    {
      icon: <Icon.Award />,
      title: 'Quality Assured',
      desc: 'Every guide is carefully vetted and trained to ensure highest quality experiences.',
    },
  ];

  const team = [
    { name: 'Pia Saisaengchan', role: 'Co-Founder & CEO', initial: 'PS' },
    { name: 'Jashanpreet Singh', role: 'Co-Founder & CTO', initial: 'JS' },
    { name: 'Sin-Yi Huang', role: 'Head of Operations', initial: 'SH' },
    { name: 'Stanley Cochrane', role: 'Lead Developer', initial: 'SC' },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <h1 style={styles.pageTitle}>Connecting Travelers with Local Guides</h1>
        <p style={styles.pageSubtitle}>
          Experience the world through the eyes of those who know it best
        </p>
      </div>

      <div style={styles.container}>
        <div style={styles.statsGrid}>
          {[
            { number: '5,000+', label: 'Local Guides' },
            { number: '150+', label: 'Countries' },
            { number: '100K+', label: 'Happy Travelers' },
            { number: '4.9★', label: 'Average Rating' },
          ].map((stat, i) => (
            <div key={i} style={styles.statCard}>
              <div style={styles.statNumber}>{stat.number}</div>
              <div style={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div style={styles.tabsContainer}>
          {['mission', 'vision', 'how'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                ...styles.tabButton,
                ...(activeTab === tab ? styles.tabButtonActive : {}),
              }}
            >
              {tab === 'mission'
                ? 'Our Mission'
                : tab === 'vision'
                ? 'Our Vision'
                : 'How It Works'}
            </button>
          ))}
        </div>

        <div style={styles.tabContent}>
          {activeTab === 'mission' && (
            <div>
              <h3 style={styles.tabContentTitle}>Empowering Communities Through Travel</h3>
              <p style={styles.tabContentText}>
                Our mission is to revolutionize travel by connecting curious travelers with
                passionate local guides who bring destinations to life. We believe that the
                best travel experiences come from authentic connections with people who truly
                understand the heart and soul of their homeland.
              </p>
              <p style={styles.tabContentText}>
                By creating a platform that empowers local guides, we're not just facilitating
                tours – we're building bridges between cultures, supporting local economies,
                and making travel more meaningful for everyone involved.
              </p>
            </div>
          )}
          {activeTab === 'vision' && (
            <div>
              <h3 style={styles.tabContentTitle}>A World Connected Through Stories</h3>
              <p style={styles.tabContentText}>
                We envision a world where every traveler has access to authentic, personalized
                experiences that go beyond typical tourist attractions. A world where local
                guides are recognized as the cultural ambassadors they truly are.
              </p>
              <p style={styles.tabContentText}>
                Our vision is to become the world's most trusted platform for connecting
                travelers with local experts, fostering sustainable tourism that benefits both
                visitors and host communities alike.
              </p>
            </div>
          )}
          {activeTab === 'how' && (
            <div>
              <h3 style={styles.tabContentTitle}>Simple, Safe, and Seamless</h3>
              <ul style={styles.featuresList}>
                <li style={styles.featureItem}>
                  <strong>Browse & Discover:</strong> Explore unique tours curated by local
                  guides
                </li>
                <li style={styles.featureItem}>
                  <strong>Connect Directly:</strong> Chat with guides to customize your
                  experience
                </li>
                <li style={styles.featureItem}>
                  <strong>Book Securely:</strong> Make safe payments with our protected system
                </li>
                <li style={styles.featureItem}>
                  <strong>Experience & Share:</strong> Enjoy your adventure and share your
                  story
                </li>
              </ul>
            </div>
          )}
        </div>

        <h2 style={styles.sectionTitle}>What We Stand For</h2>
        <div style={styles.valuesGrid}>
          {values.map((value, i) => (
            <div key={i} style={styles.valueCard}>
              <div style={styles.valueIcon}>{value.icon}</div>
              <h3 style={styles.valueTitle}>{value.title}</h3>
              <p style={styles.valueDesc}>{value.desc}</p>
            </div>
          ))}
        </div>

        <h2 style={styles.sectionTitle}>Meet Our Team</h2>
        <div style={styles.teamGrid}>
          {team.map((member, i) => (
            <div key={i} style={styles.teamCard}>
              <div style={styles.teamAvatar}>{member.initial}</div>
              <h3 style={styles.teamName}>{member.name}</h3>
              <div style={styles.teamRole}>{member.role}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    flex: 1,
    minHeight: 'calc(100vh - 140px)',
  },
  hero: {
    background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
    color: 'white',
    padding: '80px 24px',
    textAlign: 'center',
  },
  pageTitle: {
    fontSize: '48px',
    fontWeight: 'bold',
    marginBottom: '16px',
  },
  pageSubtitle: {
    fontSize: '20px',
    opacity: 0.95,
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '60px 24px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '32px',
    marginBottom: '80px',
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
  },
  statLabel: {
    color: '#666',
    fontSize: '18px',
  },
  tabsContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    marginBottom: '48px',
    flexWrap: 'wrap',
  },
  tabButton: {
    padding: '12px 32px',
    border: `2px solid ${COLORS.border}`,
    borderRadius: '50px',
    background: 'white',
    color: '#666',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  tabButtonActive: {
    background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
    color: 'white',
    borderColor: 'transparent',
  },
  tabContent: {
    background: 'white',
    padding: '48px',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    marginBottom: '80px',
  },
  tabContentTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '24px',
    color: '#333',
  },
  tabContentText: {
    color: '#666',
    lineHeight: '1.8',
    marginBottom: '20px',
    fontSize: '16px',
  },
  featuresList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  featureItem: {
    color: '#666',
    lineHeight: '1.8',
    marginBottom: '16px',
    fontSize: '16px',
  },
  sectionTitle: {
    fontSize: '36px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '48px',
    color: '#333',
  },
  valuesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '32px',
    marginBottom: '80px',
  },
  valueCard: {
    background: 'white',
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    textAlign: 'center',
    transition: 'transform 0.3s',
  },
  valueIcon: {
    color: COLORS.primary,
    marginBottom: '20px',
  },
  valueTitle: {
    fontSize: '22px',
    fontWeight: '600',
    marginBottom: '12px',
    color: '#333',
  },
  valueDesc: {
    color: '#666',
    lineHeight: '1.6',
  },
  teamGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '32px',
  },
  teamCard: {
    textAlign: 'center',
    padding: '32px',
  },
  teamAvatar: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '32px',
    fontWeight: 'bold',
    margin: '0 auto 16px',
  },
  teamName: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#333',
  },
  teamRole: {
    color: COLORS.primary,
    fontWeight: '600',
  },
};

export default AboutPage;