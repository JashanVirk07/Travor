// src/pages/DestinationsPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { tourService } from '../services/firestoreService';
import { COLORS } from '../utils/colors';

const DestinationsPage = () => {
  const { setCurrentPage } = useAuth();
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [loading, setLoading] = useState(true);
  
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
    
    // Check for search query from home page
    const storedQuery = sessionStorage.getItem('searchQuery');
    if (storedQuery) {
      setSearchQuery(storedQuery);
      sessionStorage.removeItem('searchQuery');
    }

    // Check for category from home page
    const storedCategory = sessionStorage.getItem('selectedCategory');
    if (storedCategory) {
      setSelectedCategory(storedCategory);
      sessionStorage.removeItem('selectedCategory');
    }
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tours, searchQuery, selectedCategory, selectedDifficulty, priceRange, sortBy]);

  const loadTours = async () => {
    setLoading(true);
    try {
      const allTours = await tourService.getAllTours();
      setTours(allTours);
    } catch (error) {
      console.error('Error loading tours:', error);
    }
    setLoading(false);
  };

  const applyFilters = () => {
    let filtered = [...tours];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (tour) =>
          tour.title?.toLowerCase().includes(query) ||
          tour.location?.toLowerCase().includes(query) ||
          tour.description?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        (tour) => tour.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Difficulty filter
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(
        (tour) => tour.difficulty?.toLowerCase() === selectedDifficulty.toLowerCase()
      );
    }

    // Price filter
    if (priceRange !== 'all') {
      if (priceRange === '200+') {
        filtered = filtered.filter((tour) => tour.price >= 200);
      } else {
        const [min, max] = priceRange.split('-').map(Number);
        filtered = filtered.filter((tour) => tour.price >= min && tour.price <= max);
      }
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        break;
      case 'popular':
        filtered.sort((a, b) => (b.totalReviews || 0) - (a.totalReviews || 0));
        break;
      default:
        // Featured - keep original order
        break;
    }

    setFilteredTours(filtered);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedDifficulty('all');
    setPriceRange('all');
    setSortBy('featured');
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loader}>Loading tours...</div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Explore Tours</h1>
          <p style={styles.subtitle}>
            Discover amazing experiences with local guides around the world
          </p>
        </div>

        {/* Search and Filters */}
        <div style={styles.filtersSection}>
          {/* Search Bar */}
          <div style={styles.searchBar}>
            <input
              type="text"
              placeholder="Search tours, locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
            <span style={styles.searchIcon}>🔍</span>
          </div>

          {/* Filter Buttons */}
          <div style={styles.filtersRow}>
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={styles.filterSelect}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>

            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              style={styles.filterSelect}
            >
              {difficulties.map((diff) => (
                <option key={diff} value={diff}>
                  {diff === 'all' ? 'All Levels' : diff.charAt(0).toUpperCase() + diff.slice(1)}
                </option>
              ))}
            </select>

            {/* Price Filter */}
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              style={styles.filterSelect}
            >
              {priceRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={styles.filterSelect}
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="popular">Most Popular</option>
            </select>

            {/* Clear Filters Button */}
            <button onClick={clearFilters} style={styles.clearButton}>
              Clear All
            </button>
          </div>

          {/* Results Count */}
          <div style={styles.resultsCount}>
            {filteredTours.length} {filteredTours.length === 1 ? 'tour' : 'tours'} found
          </div>
        </div>

        {/* Tours Grid */}
        {filteredTours.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🔍</div>
            <h3 style={styles.emptyTitle}>No tours found</h3>
            <p style={styles.emptyText}>
              Try adjusting your filters or search query
            </p>
            <button onClick={clearFilters} style={styles.emptyButton}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div style={styles.toursGrid}>
            {filteredTours.map((tour) => (
              <div key={tour.tourId} style={styles.tourCard}>
                <div style={styles.imageContainer}>
                  <img
                    src={tour.images?.[0] || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400'}
                    alt={tour.title}
                    style={styles.tourImage}
                  />
                  <div style={styles.categoryBadge}>{tour.category}</div>
                  {tour.averageRating && (
                    <div style={styles.ratingBadge}>
                      ⭐ {tour.averageRating.toFixed(1)}
                    </div>
                  )}
                </div>

                <div style={styles.tourContent}>
                  <h3 style={styles.tourTitle}>{tour.title}</h3>
                  <div style={styles.tourLocation}>📍 {tour.location}</div>

                  <div style={styles.tourMeta}>
                    <span style={styles.metaItem}>⏱️ {tour.duration}</span>
                    <span style={styles.metaItem}>🎯 {tour.difficulty}</span>
                  </div>

                  <p style={styles.tourDescription}>
                    {tour.description?.substring(0, 100)}...
                  </p>

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
  page: {
    minHeight: '100vh',
    background: COLORS.light,
    padding: '40px 0',
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 24px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  title: {
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '12px',
  },
  subtitle: {
    fontSize: '18px',
    color: '#666',
  },
  filtersSection: {
    background: 'white',
    padding: '32px',
    borderRadius: '16px',
    marginBottom: '40px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  },
  searchBar: {
    position: 'relative',
    marginBottom: '24px',
  },
  searchInput: {
    width: '100%',
    padding: '16px 50px 16px 20px',
    border: `2px solid ${COLORS.border}`,
    borderRadius: '12px',
    fontSize: '16px',
    outline: 'none',
  },
  searchIcon: {
    position: 'absolute',
    right: '20px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '20px',
  },
  filtersRow: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    marginBottom: '16px',
  },
  filterSelect: {
    padding: '12px 16px',
    border: `2px solid ${COLORS.border}`,
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    outline: 'none',
    background: 'white',
  },
  clearButton: {
    padding: '12px 24px',
    background: 'transparent',
    border: `2px solid ${COLORS.primary}`,
    color: COLORS.primary,
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  resultsCount: {
    fontSize: '14px',
    color: '#666',
    fontWeight: '500',
  },
  toursGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '32px',
  },
  tourCard: {
    background: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    transition: 'transform 0.3s, box-shadow 0.3s',
    cursor: 'pointer',
  },
  imageContainer: {
    position: 'relative',
    height: '240px',
    overflow: 'hidden',
  },
  tourImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  categoryBadge: {
    position: 'absolute',
    top: '16px',
    left: '16px',
    background: COLORS.primary,
    color: 'white',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  ratingBadge: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'white',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
  },
  tourContent: {
    padding: '20px',
  },
  tourTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
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
    gap: '16px',
    marginBottom: '12px',
  },
  metaItem: {
    fontSize: '13px',
    color: '#666',
  },
  tourDescription: {
    fontSize: '14px',
    color: '#666',
    lineHeight: '1.6',
    marginBottom: '16px',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '16px',
    borderTop: `1px solid ${COLORS.border}`,
  },
  priceSection: {
    display: 'flex',
    flexDirection: 'column',
  },
  priceLabel: {
    fontSize: '12px',
    color: '#666',
  },
  price: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  detailsButton: {
    padding: '12px 24px',
    background: COLORS.primary,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  emptyState: {
    textAlign: 'center',
    padding: '80px 20px',
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '24px',
  },
  emptyTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '12px',
  },
  emptyText: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '32px',
  },
  emptyButton: {
    padding: '12px 32px',
    background: COLORS.primary,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
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
};

export default DestinationsPage;