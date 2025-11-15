import React, { useState, useEffect } from 'react';
import { guideService } from '../services/firestoreService';
import { COLORS } from '../utils/colors';
import { Icon } from '../components/Icons';

const GuidesPage = () => {
  // State for fetching and filtering
  const [allGuides, setAllGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // --- Data Fetching Effect ---
  useEffect(() => {
    // This simple check prevents running if the service object is not yet fully available
    if (!guideService || !guideService.getAllGuides) {
        // Log a warning, but don't set loading to false as Firebase might still be initializing
        console.warn("Guide service not ready. Waiting for Firestore initialization...");
        return; 
    }

    const fetchGuides = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch all verified guides from Firestore
        const data = await guideService.getAllGuides();
        setAllGuides(data);
      } catch (err) {
        console.error('Error fetching guides:', err);
        setError('Failed to load guides. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchGuides();
    
    // The dependency array is empty, running only on mount.
  }, []);

  // Client-side filtering logic
  const filteredGuides = allGuides.filter((guide) => {
    const query = searchQuery.toLowerCase();
    
    // Search by full name, location, or languages (case-insensitive)
    const matchesName = (guide.fullName || '').toLowerCase().includes(query);
    const matchesLocation = (guide.location || '').toLowerCase().includes(query);
    const matchesLanguage = (guide.languages || []).some(lang => 
      lang.toLowerCase().includes(query)
    );
    
    return matchesName || matchesLocation || matchesLanguage;
  });

  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <h1 style={styles.pageTitle}>Find Your Perfect Guide</h1>
        <p style={styles.pageSubtitle}>Connect with verified local experts</p>
        <div style={styles.searchBar}>
          {/* Using Icon component for Search */}
          <Icon.Search style={{fontSize: '20px'}} />
          <input
            type="text"
            placeholder="Search by name, location, or language..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      </div>

      <div style={styles.container}>
        {/* Loading and Error Indicators */}
        {loading && (
          <div style={styles.messageBox}>
            Loading verified guides...
          </div>
        )}
        {error && (
          <div style={{...styles.messageBox, color: COLORS.error}}>
            Error: {error}
          </div>
        )}
        
        {!loading && filteredGuides.length === 0 && !error && (
            <div style={{...styles.messageBox, color: COLORS.gray}}>
                {searchQuery 
                    ? `No guides match your search query: "${searchQuery}"`
                    : "No guides found. Add some guides to the database!"
                }
            </div>
        )}

        {/* Guides Grid */}
        <div style={styles.guidesGrid}>
          {filteredGuides.map((guide) => (
            <div key={guide.guideId} style={styles.guideCard}>
              {/* Using a stable placeholder image with guideId as seed */}
              <img 
                src={`https://i.pravatar.cc/150?u=${guide.guideId}`} 
                alt={guide.fullName} 
                style={styles.guideImage}
                // Fallback for image loading
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/120x120/a8a8a8/ffffff?text=Guide";
                }}
              />
              <div style={styles.guideContent}>
                <h3 style={styles.guideName}>{guide.fullName || 'Unknown Guide'}</h3>
                <div style={styles.guideLocation}>
                  <Icon.MapPin style={{color: COLORS.primary, width: '16px', height: '16px'}} />
                  <span>{guide.location || 'Global'}</span>
                </div>
                <div style={styles.guideRating}>
                  {/* Using Icon component for Star */}
                  <Icon.Star filled style={{fontSize: '18px'}} />
                  {/* Displaying rating and review count from Firebase data structure */}
                  <span>{guide.rating ? guide.rating.toFixed(1) : 'New'}</span>
                  <span style={styles.guideReviews}>({guide.reviewCount || 0} reviews)</span>
                </div>
                <p style={styles.guideBio}>{guide.bio || 'A dedicated and knowledgeable local expert.'}</p>
                <div style={styles.guideLanguages}>
                  {(guide.languages || []).map((lang) => (
                    <span key={lang} style={styles.languageBadge}>
                      {lang}
                    </span>
                  ))}
                </div>
                <div style={styles.guideTours}>{guide.tourCount || 0} tours available</div>
                <button style={styles.viewGuideButton}>View Profile</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// NOTE: Styles remain consistent with your original definitions
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
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
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
  messageBox: {
    textAlign: 'center', 
    padding: '40px', 
    fontSize: '20px', 
    fontWeight: '500', 
    color: COLORS.text
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
    border: `4px solid ${COLORS.primary}`,
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
    boxShadow: '0 4px 10px rgba(0, 150, 255, 0.4)',
    transition: 'opacity 0.3s',
  },
};

export default GuidesPage;