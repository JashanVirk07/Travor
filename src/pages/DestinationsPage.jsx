import React, { useState, useEffect } from 'react';
import { tourService } from '../services/firestoreService';
import { COLORS } from '../utils/colors';
import { Icon } from '../components/Icons'; // Assuming Icons component exists

const DestinationsPage = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);

  // Mock categories (should match 'category' field in Tour interface)
  const categories = [
    { id: 'all', name: 'All' },
    { id: 'beach', name: 'Beach & Island' },
    { id: 'mountain', name: 'Mountain Treks' },
    { id: 'city', name: 'City Breaks' },
    { id: 'cultural', name: 'Cultural Heritage' },
  ];

  const fetchTours = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch tours based on category filter
      const categoryFilter = selectedCategory !== 'all' ? selectedCategory : undefined;
      let fetchedTours = await tourService.getAllTours({ category: categoryFilter });

      // 2. Client-side search filtering (Location, Title, Description)
      if (searchQuery) {
        const term = searchQuery.toLowerCase();
        fetchedTours = fetchedTours.filter(tour => 
          (tour.title || '').toLowerCase().includes(term) ||
          (tour.location || '').toLowerCase().includes(term) ||
          (tour.description || '').toLowerCase().includes(term)
        );
      }
      
      setTours(fetchedTours);
    } catch (err) {
      console.error('Error fetching tours:', err);
      setError('Failed to load tours. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce or immediate fetch on filter change
    const delayDebounceFn = setTimeout(() => {
      fetchTours();
    }, 500); // Debounce search for 500ms

    return () => clearTimeout(delayDebounceFn);
  }, [selectedCategory, searchQuery]);


  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <h1 style={styles.pageTitle}>Discover Your Next Adventure</h1>
        <p style={styles.pageSubtitle}>Explore unique tours crafted by local guides</p>
        <div style={styles.searchBar}>
          <Icon.Search />
          <input
            type="text"
            placeholder="Search by tour title, location, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      </div>

      <div style={styles.container}>
        <div style={styles.categoryFilter}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                ...styles.categoryButton,
                ...(selectedCategory === cat.id ? styles.categoryButtonActive : {}),
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {loading && <div className="text-center py-10 text-xl font-medium">Loading amazing tours...</div>}
        {error && <div className="text-center py-10 text-red-500">{error}</div>}

        {!loading && tours.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No tours found matching your criteria. Try adjusting your search or filter.
          </div>
        )}

        <div style={styles.destinationsGrid}>
          {tours.map((tour) => {
            const displayImage = tour.images && tour.images.length > 0
              ? tour.images[0]
              : `https://placehold.co/400x250/333333/FFFFFF?text=${encodeURIComponent(tour.title)}`;

            // Use tour.tourId for unique key and favorite tracking
            return (
              <div key={tour.tourId} style={styles.destinationCard}>
                <div style={styles.destinationImageContainer}>
                  <img src={displayImage} alt={tour.title} style={styles.destinationImage} 
                       onError={(e) => {
                            e.target.onerror = null; 
                            e.target.src = `https://placehold.co/400x250/333333/FFFFFF?text=Image+Error`;
                        }}/>
                  <button
                    style={styles.favoriteButton}
                    onClick={() => toggleFavorite(tour.tourId)}
                  >
                    <Icon.Heart filled={favorites.includes(tour.tourId)} />
                  </button>
                  <div style={styles.categoryBadge}>{tour.category || 'General'}</div>
                </div>
                <div style={styles.destinationContent}>
                  <h3 style={styles.destinationName}>{tour.title}</h3>
                  <p className="text-sm text-gray-500 mb-3">{tour.location}</p>
                  <div style={styles.destinationMeta}>
                    <div style={styles.rating}>
                      <Icon.Star filled />
                      <span>{tour.averageRating ? tour.averageRating.toFixed(1) : 'New'}</span>
                      <span style={styles.reviews}>({tour.totalReviews || 0})</span>
                    </div>
                  </div>
                  <div style={styles.destinationFooter}>
                    <div style={styles.durationInfo}>
                      <Icon.Clock />
                      <span>{tour.duration || 'N/A'}</span>
                    </div>
                    <div style={styles.destinationPrice}>${tour.price}</div>
                  </div>
                  <button style={styles.viewButton}>View Details</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ... (Styles object remains the same)
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
    categoryFilter: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        justifyContent: 'center',
        marginBottom: '48px',
    },
    categoryButton: {
        padding: '12px 24px',
        borderRadius: '50px',
        border: `2px solid ${COLORS.border}`,
        background: 'white',
        color: '#666',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s',
    },
    categoryButtonActive: {
        background: COLORS.primary,
        color: 'white',
        borderColor: COLORS.primary,
    },
    destinationsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '32px',
    },
    destinationCard: {
        background: 'white',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        transition: 'transform 0.3s',
        cursor: 'pointer',
    },
    destinationImageContainer: {
        position: 'relative',
        height: '250px',
    },
    destinationImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    favoriteButton: {
        position: 'absolute',
        top: '16px',
        right: '16px',
        background: 'white',
        border: 'none',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: COLORS.danger,
    },
    categoryBadge: {
        position: 'absolute',
        bottom: '16px',
        left: '16px',
        background: 'white',
        padding: '6px 16px',
        borderRadius: '50px',
        fontSize: '14px',
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    destinationContent: {
        padding: '20px',
    },
    destinationName: {
        fontSize: '22px',
        fontWeight: '600',
        marginBottom: '12px',
        color: '#333',
    },
    destinationMeta: {
        marginBottom: '16px',
    },
    rating: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: '#FFB800',
    },
    reviews: {
        color: '#999',
        fontSize: '14px',
    },
    destinationFooter: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
    },
    durationInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: '#666',
        fontSize: '14px',
    },
    destinationPrice: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    viewButton: {
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

export default DestinationsPage;