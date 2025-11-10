import React, { useState } from 'react';
import { COLORS } from '../utils/colors';
import { Icon } from '../components/Icons';

const GuidesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const guides = [
    {
      id: 1,
      name: 'Maria Santos',
      location: 'Barcelona, Spain',
      rating: 4.9,
      reviews: 156,
      img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
      languages: ['Spanish', 'English'],
      tours: 12,
      bio: 'Passionate about sharing Barcelona culture and history',
    },
    {
      id: 2,
      name: 'Kenji Tanaka',
      location: 'Tokyo, Japan',
      rating: 4.8,
      reviews: 203,
      img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      languages: ['Japanese', 'English'],
      tours: 8,
      bio: 'Expert in traditional and modern Tokyo experiences',
    },
    {
      id: 3,
      name: 'Sophie Laurent',
      location: 'Paris, France',
      rating: 4.9,
      reviews: 178,
      img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
      languages: ['French', 'English'],
      tours: 15,
      bio: 'Art history enthusiast and Parisian native',
    },
    {
      id: 4,
      name: 'Marco Rossi',
      location: 'Rome, Italy',
      rating: 4.7,
      reviews: 142,
      img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
      languages: ['Italian', 'English', 'Spanish'],
      tours: 10,
      bio: 'Ancient Rome specialist with 10 years experience',
    },
    {
      id: 5,
      name: 'Emma Johnson',
      location: 'London, UK',
      rating: 4.8,
      reviews: 189,
      img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
      languages: ['English', 'French'],
      tours: 14,
      bio: 'Royal history and hidden gems of London',
    },
    {
      id: 6,
      name: 'Carlos Rivera',
      location: 'Barcelona, Spain',
      rating: 4.9,
      reviews: 221,
      img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200',
      languages: ['Spanish', 'English', 'Catalan'],
      tours: 18,
      bio: 'Food and wine expert, Gaudi architecture specialist',
    },
  ];

  const filteredGuides = guides.filter((guide) =>
    guide.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guide.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <h1 style={styles.pageTitle}>Find Your Perfect Guide</h1>
        <p style={styles.pageSubtitle}>Connect with verified local experts</p>
        <div style={styles.searchBar}>
          <Icon.Search />
          <input
            type="text"
            placeholder="Search by location or language..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      </div>

      <div style={styles.container}>
        <div style={styles.guidesGrid}>
          {filteredGuides.map((guide) => (
            <div key={guide.id} style={styles.guideCard}>
              <img src={guide.img} alt={guide.name} style={styles.guideImage} />
              <div style={styles.guideContent}>
                <h3 style={styles.guideName}>{guide.name}</h3>
                <div style={styles.guideLocation}>
                  <Icon.MapPin />
                  <span>{guide.location}</span>
                </div>
                <div style={styles.guideRating}>
                  <Icon.Star filled />
                  <span>{guide.rating}</span>
                  <span style={styles.guideReviews}>({guide.reviews} reviews)</span>
                </div>
                <p style={styles.guideBio}>{guide.bio}</p>
                <div style={styles.guideLanguages}>
                  {guide.languages.map((lang) => (
                    <span key={lang} style={styles.languageBadge}>
                      {lang}
                    </span>
                  ))}
                </div>
                <div style={styles.guideTours}>{guide.tours} tours available</div>
                <button style={styles.viewGuideButton}>View Profile</button>
              </div>
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
    marginBottom: '32px',
    opacity: 0.95,
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
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '60px 24px',
  },
  guidesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '32px',
  },
  guideCard: {
    background: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    textAlign: 'center',
    transition: 'transform 0.3s',
  },
  guideImage: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    objectFit: 'cover',
    margin: '32px auto 16px',
    border: '4px solid #fff',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  guideContent: {
    padding: '0 24px 24px',
  },
  guideName: {
    fontSize: '22px',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#333',
  },
  guideLocation: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    color: '#666',
    marginBottom: '12px',
    fontSize: '14px',
  },
  guideRating: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    color: '#FFB800',
    marginBottom: '16px',
  },
  guideReviews: {
    color: '#999',
    fontSize: '14px',
  },
  guideBio: {
    color: '#666',
    fontSize: '14px',
    lineHeight: '1.5',
    marginBottom: '16px',
    minHeight: '40px',
  },
  guideLanguages: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    justifyContent: 'center',
    marginBottom: '16px',
  },
  languageBadge: {
    background: COLORS.light,
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#666',
  },
  guideTours: {
    color: '#666',
    fontSize: '14px',
    marginBottom: '16px',
  },
  viewGuideButton: {
    width: '100%',
    background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
    color: 'white',
    border: 'none',
    padding: '12px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export default GuidesPage;