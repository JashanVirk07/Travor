import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { guideService } from '../services/firestoreService';
import { COLORS } from '../utils/colors';

const GuidesPage = () => {
  const { setCurrentPage } = useAuth();
  const [guides, setGuides] = useState([]);
  const [filteredGuides, setFilteredGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  useEffect(() => {
    loadGuides();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [guides, searchQuery, selectedLanguage, selectedLocation]);

  const loadGuides = async () => {
    setLoading(true);
    try {
      const allGuides = await guideService.getAllGuides();
      setGuides(allGuides);
    } catch (error) {
      console.error('Error loading guides:', error);
    }
    setLoading(false);
  };

  const applyFilters = () => {
    let filtered = [...guides];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(guide => 
        (guide.name || guide.fullName || '').toLowerCase().includes(query) ||
        (guide.location || '').toLowerCase().includes(query) ||
        (guide.bio || '').toLowerCase().includes(query)
      );
    }

    if (selectedLanguage !== 'all') {
      filtered = filtered.filter(guide => 
        (guide.languages || []).some(lang => lang.toLowerCase() === selectedLanguage.toLowerCase())
      );
    }

    setFilteredGuides(filtered);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedLanguage('all');
    setSelectedLocation('all');
  };

  if (loading) return <div style={styles.loadingContainer}><div style={styles.loader}>Loading guides...</div></div>;

  // Extract unique languages for filter
  const allLanguages = [...new Set(guides.flatMap(g => g.languages || []))];

  return (
    <div style={styles.page}>
      {/* HERO SECTION */}
      <div style={styles.hero}>
        <div style={styles.heroBackground} />
        <div style={styles.heroOverlay} />
        <div style={styles.heroContent}>
            <span style={styles.badge}>Meet the Locals</span>
            <h1 style={styles.heroTitle}>Find Your <span style={styles.gradientText}>Perfect Guide</span></h1>
            <p style={styles.heroSubtitle}>Connect with verified local experts who know the city best.</p>
        </div>
      </div>

      <div style={styles.container}>
        {/* SEARCH CONTAINER */}
        <div style={styles.filterContainer}>
            <div style={styles.searchWrapper}>
                <span style={styles.searchIcon}>🔍</span>
                <input
                    type="text"
                    placeholder="Search by name, location or keyword..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={styles.searchInput}
                />
            </div>

            <div style={styles.filtersRow}>
                <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)} style={styles.filterSelect}>
                    <option value="all">All Languages</option>
                    {allLanguages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                </select>
                <button onClick={clearFilters} style={styles.clearButton}>Clear</button>
            </div>

            <div style={styles.resultsCount}>
                {filteredGuides.length} {filteredGuides.length === 1 ? 'guide' : 'guides'} found
            </div>
        </div>

        {/* GUIDES GRID */}
        {filteredGuides.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>👥</div>
            <h3 style={styles.emptyTitle}>No guides found</h3>
            <p style={styles.emptyText}>Try changing your search terms.</p>
            <button onClick={clearFilters} style={styles.emptyButton}>Clear Filters</button>
          </div>
        ) : (
          <div style={styles.guidesGrid}>
            {filteredGuides.map((guide) => (
              <div 
                key={guide.userId} 
                style={{
                    ...styles.guideCard,
                    transform: hoveredCard === guide.userId ? 'translateY(-10px)' : 'none',
                    boxShadow: hoveredCard === guide.userId ? '0 20px 40px rgba(0,0,0,0.12)' : '0 4px 20px rgba(0,0,0,0.08)'
                }}
                onMouseEnter={() => setHoveredCard(guide.userId)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div style={styles.imageContainer}>
                    {guide.profileImageUrl ? (
                        <img 
                            src={guide.profileImageUrl} 
                            alt={guide.fullName} 
                            style={{
                                ...styles.guideImage,
                                transform: hoveredCard === guide.userId ? 'scale(1.05)' : 'scale(1)'
                            }} 
                        />
                    ) : (
                        <div style={styles.guidePlaceholder}>{guide.fullName?.charAt(0)}</div>
                    )}
                    {guide.isVerified && <div style={styles.verifiedBadge}>✓ Verified</div>}
                </div>

                <div style={styles.guideContent}>
                  <div style={styles.guideHeader}>
                      <h3 style={styles.guideName}>{guide.fullName}</h3>
                      <div style={styles.rating}>⭐ {guide.rating?.toFixed(1) || 'New'}</div>
                  </div>
                  
                  <div style={styles.guideLocation}>📍 {guide.location}</div>
                  
                  <div style={styles.languages}>
                    {guide.languages?.slice(0, 3).map(lang => (
                        <span key={lang} style={styles.langTag}>{lang}</span>
                    ))}
                    {guide.languages?.length > 3 && <span style={styles.langTag}>+{guide.languages.length - 3}</span>}
                  </div>

                  <p style={styles.guideBio}>
                    {guide.bio ? guide.bio.substring(0, 80) + '...' : 'No bio available.'}
                  </p>

                  <div style={styles.cardFooter}>
                     <div style={styles.stat}>
                        <span style={styles.statVal}>{guide.toursCompleted || 0}</span>
                        <span style={styles.statLbl}>Tours</span>
                     </div>
                     <button
                        onClick={() => {
                            sessionStorage.setItem('selectedGuideId', guide.userId || guide.guideId);
                            setCurrentPage('guide-profile');
                        }}
                        style={styles.profileButton}
                     >
                        View Profile
                     </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', background: '#ffffff' },
  hero: {
    minHeight: '50vh',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    padding: '60px 24px',
    marginBottom: '40px'
  },
  heroBackground: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundImage: 'url(https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=1600&q=80)',
    backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', zIndex: 0
  },
  heroOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.85) 0%, rgba(118, 75, 162, 0.85) 100%)',
    zIndex: 1
  },
  heroContent: {
    maxWidth: '800px', textAlign: 'center', color: 'white', position: 'relative', zIndex: 2
  },
  badge: {
    display: 'inline-block', background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)',
    padding: '8px 20px', borderRadius: '50px', fontSize: '14px', fontWeight: '600', marginBottom: '24px', border: '1px solid rgba(255, 255, 255, 0.3)'
  },
  heroTitle: { fontSize: '56px', fontWeight: '800', marginBottom: '16px', lineHeight: '1.2' },
  heroSubtitle: { fontSize: '20px', opacity: 0.95, lineHeight: '1.6' },
  gradientText: {
    background: 'linear-gradient(to right, #ffd89b, #19547b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block'
  },
  container: { maxWidth: '1200px', margin: '0 auto', padding: '0 24px 80px' },
  
  filterContainer: {
    background: 'white', borderRadius: '24px', padding: '32px', marginTop: '-80px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.1)', position: 'relative', zIndex: 10, marginBottom: '60px'
  },
  searchWrapper: {
    display: 'flex', alignItems: 'center', background: '#f8f9fa', borderRadius: '16px', padding: '8px 16px', marginBottom: '24px', border: '1px solid #eef0f2'
  },
  searchIcon: { fontSize: '20px', marginRight: '12px', opacity: 0.5 },
  searchInput: { flex: 1, padding: '12px 0', fontSize: '16px', border: 'none', outline: 'none', background: 'transparent' },
  filtersRow: { display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' },
  filterSelect: {
    padding: '12px 20px', border: '1px solid #e0e0e0', borderRadius: '50px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', outline: 'none', background: 'white', transition: '0.3s'
  },
  clearButton: {
    padding: '12px 24px', background: 'transparent', border: `1px solid ${COLORS.primary}`, color: COLORS.primary, borderRadius: '50px', fontSize: '14px', fontWeight: '600', cursor: 'pointer'
  },
  resultsCount: { fontSize: '14px', color: '#666', fontWeight: '600', marginTop: '12px' },
  
  guidesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' },
  guideCard: {
    background: 'white', borderRadius: '20px', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.4s ease'
  },
  imageContainer: { position: 'relative', height: '250px', overflow: 'hidden', background: '#f0f0f0' },
  guideImage: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' },
  guidePlaceholder: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px', color: '#ccc', background: '#eee' },
  verifiedBadge: {
    position: 'absolute', top: '12px', right: '12px', background: '#28a745', color: 'white', padding: '4px 12px', borderRadius: '50px', fontSize: '12px', fontWeight: '700'
  },
  guideContent: { padding: '24px' },
  guideHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  guideName: { fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e' },
  rating: { fontWeight: '700', fontSize: '14px' },
  guideLocation: { fontSize: '14px', color: '#666', marginBottom: '16px' },
  languages: { display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' },
  langTag: { background: '#f5f7fa', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', color: '#666', fontWeight: '600' },
  guideBio: { fontSize: '14px', color: '#666', lineHeight: '1.6', marginBottom: '24px', minHeight: '45px' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid #f0f0f0' },
  stat: { display: 'flex', flexDirection: 'column' },
  statVal: { fontWeight: 'bold', color: '#1a1a2e', fontSize: '16px' },
  statLbl: { fontSize: '11px', color: '#999', textTransform: 'uppercase' },
  profileButton: {
    padding: '10px 24px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '50px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
  },
  emptyState: { textAlign: 'center', padding: '80px 20px' },
  emptyIcon: { fontSize: '64px', marginBottom: '24px', opacity: 0.5 },
  emptyTitle: { fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '12px' },
  emptyText: { fontSize: '16px', color: '#666', marginBottom: '32px' },
  emptyButton: { padding: '12px 32px', background: COLORS.primary, color: 'white', border: 'none', borderRadius: '50px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' },
  loadingContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' },
  loader: { fontSize: '18px', color: '#666' },
};

export default GuidesPage;