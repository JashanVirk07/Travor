import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { tourService, favoritesService } from '../services/firestoreService';
import { COLORS } from '../utils/colors';

const DestinationsPage = () => {
  const { setCurrentPage, currentUser } = useAuth();
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null); // For hover effects
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  const categories = ['all', 'cultural', 'adventure', 'food', 'art', 'beach', 'nightlife'];
  const difficulties = ['all', 'easy', 'moderate', 'hard'];
  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: '0-50', label: 'Under $50' },
    { value: '50-100', label: '$50 - $100' },
    { value: '100-200', label: '$100 - $200' },
    { value: '200+', label: '$200+' },
  ];

  useEffect(() => {
    loadTours();
    const storedQuery = sessionStorage.getItem('searchQuery');
    if (storedQuery) { setSearchQuery(storedQuery); sessionStorage.removeItem('searchQuery'); }
    const storedCategory = sessionStorage.getItem('selectedCategory');
    if (storedCategory) { setSelectedCategory(storedCategory); sessionStorage.removeItem('selectedCategory'); }
  }, []);

  useEffect(() => { if (currentUser) loadFavorites(); }, [currentUser]);
  useEffect(() => { applyFilters(); }, [tours, searchQuery, selectedCategory, selectedDifficulty, priceRange, sortBy]);

  const loadTours = async () => {
    setLoading(true);
    try { const allTours = await tourService.getAllTours(); setTours(allTours); } catch (error) { console.error('Error loading tours:', error); }
    setLoading(false);
  };

  const loadFavorites = async () => {
    try { const ids = await favoritesService.getUserFavoritesIds(currentUser.uid); setFavorites(ids); } catch (error) { console.error('Error loading favorites:', error); }
  };

  const handleToggleFavorite = async (e, tour) => {
    e.stopPropagation();
    if (!currentUser) { alert("Please login to save favorites"); return; }
    const isFav = favorites.includes(tour.tourId);
    if (isFav) {
      setFavorites(prev => prev.filter(id => id !== tour.tourId));
      await favoritesService.removeFromFavorites(currentUser.uid, tour.tourId);
    } else {
      setFavorites(prev => [...prev, tour.tourId]);
      await favoritesService.addToFavorites(currentUser.uid, tour);
    }
  };

  const applyFilters = () => {
    let filtered = [...tours];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(tour => tour.title?.toLowerCase().includes(query) || tour.location?.toLowerCase().includes(query) || tour.description?.toLowerCase().includes(query));
    }
    if (selectedCategory !== 'all') filtered = filtered.filter(tour => tour.category?.toLowerCase() === selectedCategory.toLowerCase());
    if (selectedDifficulty !== 'all') filtered = filtered.filter(tour => tour.difficulty?.toLowerCase() === selectedDifficulty.toLowerCase());
    if (priceRange !== 'all') {
      if (priceRange === '200+') filtered = filtered.filter(tour => tour.price >= 200);
      else { const [min, max] = priceRange.split('-').map(Number); filtered = filtered.filter(tour => tour.price >= min && tour.price <= max); }
    }
    switch (sortBy) {
      case 'price-low': filtered.sort((a, b) => a.price - b.price); break;
      case 'price-high': filtered.sort((a, b) => b.price - a.price); break;
      case 'rating': filtered.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0)); break;
      case 'popular': filtered.sort((a, b) => (b.totalReviews || 0) - (a.totalReviews || 0)); break;
      default: break;
    }
    setFilteredTours(filtered);
  };

  const clearFilters = () => { setSearchQuery(''); setSelectedCategory('all'); setSelectedDifficulty('all'); setPriceRange('all'); setSortBy('featured'); };

  if (loading) return <div style={styles.loadingContainer}><div style={styles.loader}>Loading tours...</div></div>;

  return (
    <div style={styles.page}>
      {/* HERO SECTION */}
      <div style={styles.hero}>
        <div style={styles.heroBackground} />
        <div style={styles.heroOverlay} />
        <div style={styles.heroContent}>
            <span style={styles.badge}>Discover the World</span>
            <h1 style={styles.heroTitle}>Explore <span style={styles.gradientText}>Unique Tours</span></h1>
            <p style={styles.heroSubtitle}>Find and book the best experiences with local experts.</p>
        </div>
      </div>

      <div style={styles.container}>
        {/* SEARCH & FILTERS CONTAINER */}
        <div style={styles.filterContainer}>
            <div style={styles.searchWrapper}>
                <span style={styles.searchIcon}>🔍</span>
                <input
                    type="text"
                    placeholder="Where do you want to go?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={styles.searchInput}
                />
            </div>

            <div style={styles.filtersRow}>
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} style={styles.filterSelect}>
                {categories.map((cat) => <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}</option>)}
                </select>
                <select value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value)} style={styles.filterSelect}>
                {difficulties.map((diff) => <option key={diff} value={diff}>{diff === 'all' ? 'All Levels' : diff.charAt(0).toUpperCase() + diff.slice(1)}</option>)}
                </select>
                <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)} style={styles.filterSelect}>
                {priceRanges.map((range) => <option key={range.value} value={range.value}>{range.label}</option>)}
                </select>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={styles.filterSelect}>
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="popular">Most Popular</option>
                </select>
                <button onClick={clearFilters} style={styles.clearButton}>Clear</button>
            </div>
             
            <div style={styles.resultsCount}>
                {filteredTours.length} {filteredTours.length === 1 ? 'experience' : 'experiences'} found
            </div>
        </div>

        {/* TOURS GRID */}
        {filteredTours.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🔍</div>
            <h3 style={styles.emptyTitle}>No tours found</h3>
            <p style={styles.emptyText}>Try adjusting your filters or search query</p>
            <button onClick={clearFilters} style={styles.emptyButton}>Clear Filters</button>
          </div>
        ) : (
          <div style={styles.toursGrid}>
            {filteredTours.map((tour) => (
              <div 
                key={tour.tourId} 
                style={{
                    ...styles.tourCard,
                    transform: hoveredCard === tour.tourId ? 'translateY(-10px)' : 'none',
                    boxShadow: hoveredCard === tour.tourId ? '0 20px 40px rgba(0,0,0,0.12)' : '0 4px 20px rgba(0,0,0,0.08)'
                }}
                onMouseEnter={() => setHoveredCard(tour.tourId)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div style={styles.imageContainer}>
                  <img
                    src={tour.images?.[0] || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400'}
                    alt={tour.title}
                    style={{
                        ...styles.tourImage,
                        transform: hoveredCard === tour.tourId ? 'scale(1.05)' : 'scale(1)'
                    }}
                  />
                  <button onClick={(e) => handleToggleFavorite(e, tour)} style={styles.favoriteButton}>
                    {favorites.includes(tour.tourId) ? '❤️' : '🤍'}
                  </button>
                  <div style={styles.categoryBadge}>{tour.category}</div>
                  {tour.averageRating && (
                    <div style={styles.ratingBadge}>⭐ {tour.averageRating.toFixed(1)}</div>
                  )}
                </div>

                <div style={styles.tourContent}>
                  <h3 style={styles.tourTitle}>{tour.title}</h3>
                  <div style={styles.tourLocation}>📍 {tour.location}</div>
                  <div style={styles.tourMeta}>
                    <span style={styles.metaItem}>⏱️ {tour.duration}</span>
                    <span style={styles.metaItem}>🎯 {tour.difficulty}</span>
                  </div>
                  <p style={styles.tourDescription}>{tour.description?.substring(0, 100)}...</p>
                  <div style={styles.cardFooter}>
                    <div style={styles.priceSection}>
                      <span style={styles.priceLabel}>From</span>
                      <span style={styles.price}>${tour.price}</span>
                    </div>
                    <button
                      onClick={() => {
                        sessionStorage.setItem('selectedTourId', tour.tourId);
                        setCurrentPage('tour-details');
                      }}
                      style={styles.detailsButton}
                    >
                      View Details
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
  // Hero Section
  hero: {
    minHeight: '60vh', // Slightly shorter than Home
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    padding: '80px 24px',
    marginBottom: '40px'
  },
  heroBackground: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundImage: 'url(https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&q=80)',
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
  
  // Modern Filter Container
  filterContainer: {
    background: 'white', borderRadius: '24px', padding: '32px', marginTop: '-80px', // Float over hero
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

  // Tours Grid
  toursGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' },
  tourCard: {
    background: 'white', borderRadius: '20px', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.4s ease'
  },
  imageContainer: { position: 'relative', height: '240px', overflow: 'hidden' },
  tourImage: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' },
  favoriteButton: {
    position: 'absolute', top: '12px', right: '12px', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
  },
  categoryBadge: {
    position: 'absolute', top: '12px', left: '12px', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', padding: '6px 14px', borderRadius: '50px', fontSize: '12px', fontWeight: '700', color: '#1a1a2e', textTransform: 'uppercase', letterSpacing: '0.5px'
  },
  ratingBadge: {
    position: 'absolute', bottom: '12px', right: '12px', background: 'white', padding: '6px 12px', borderRadius: '12px', fontSize: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
  },
  tourContent: { padding: '24px' },
  tourTitle: { fontSize: '20px', fontWeight: '700', color: '#1a1a2e', marginBottom: '8px', lineHeight: '1.4' },
  tourLocation: { fontSize: '15px', color: '#666', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' },
  tourMeta: { display: 'flex', gap: '16px', marginBottom: '16px' },
  metaItem: { fontSize: '13px', color: '#666', background: '#f5f7fa', padding: '6px 12px', borderRadius: '8px', fontWeight: '500' },
  tourDescription: { fontSize: '15px', color: '#666', lineHeight: '1.6', marginBottom: '24px' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid #f0f0f0' },
  priceSection: { display: 'flex', flexDirection: 'column' },
  priceLabel: { fontSize: '12px', color: '#999', fontWeight: '600', textTransform: 'uppercase' },
  price: { fontSize: '24px', fontWeight: '800', color: COLORS.primary },
  detailsButton: {
    padding: '12px 24px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '50px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)', transition: 'transform 0.2s'
  },
  emptyState: { textAlign: 'center', padding: '80px 20px' },
  emptyIcon: { fontSize: '64px', marginBottom: '24px', opacity: 0.5 },
  emptyTitle: { fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '12px' },
  emptyText: { fontSize: '16px', color: '#666', marginBottom: '32px' },
  emptyButton: { padding: '12px 32px', background: COLORS.primary, color: 'white', border: 'none', borderRadius: '50px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' },
  loadingContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' },
  loader: { fontSize: '18px', color: '#666' },
};

export default DestinationsPage;