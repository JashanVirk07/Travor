import React, { useState } from 'react';
import { COLORS } from '../utils/colors';
import { Icon } from '../components/Icons';

const DestinationsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'beach', name: 'Beach' },
    { id: 'mountain', name: 'Mountain' },
    { id: 'city', name: 'City' },
    { id: 'cultural', name: 'Cultural' },
  ];

  const destinations = [
    {
      id: 1,
      name: 'Santorini, Greece',
      category: 'beach',
      img: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400',
      rating: 4.9,
      reviews: 2847,
      price: 1299,
      duration: '5-7 days',
    },
    {
      id: 2,
      name: 'Kyoto, Japan',
      category: 'cultural',
      img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400',
      rating: 4.8,
      reviews: 3241,
      price: 1599,
      duration: '4-6 days',
    },
    {
      id: 3,
      name: 'Swiss Alps',
      category: 'mountain',
      img: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400',
      rating: 4.9,
      reviews: 1923,
      price: 2199,
      duration: '6-8 days',
    },
    {
      id: 4,
      name: 'New York City',
      category: 'city',
      img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400',
      rating: 4.7,
      reviews: 5673,
      price: 899,
      duration: '4-5 days',
    },
    {
      id: 5,
      name: 'Bali, Indonesia',
      category: 'beach',
      img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400',
      rating: 4.8,
      reviews: 4156,
      price: 1099,
      duration: '7-10 days',
    },
    {
      id: 6,
      name: 'Paris, France',
      category: 'city',
      img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400',
      rating: 4.8,
      reviews: 6234,
      price: 1399,
      duration: '4-6 days',
    },
  ];

  const filtered = destinations.filter(
    (d) =>
      (selectedCategory === 'all' || d.category === selectedCategory) &&
      d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <h1 style={styles.pageTitle}>Discover Your Next Adventure</h1>
        <p style={styles.pageSubtitle}>Explore breathtaking destinations around the world</p>
        <div style={styles.searchBar}>
          <Icon.Search />
          <input
            type="text"
            placeholder="Search destinations..."
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

        <div style={styles.destinationsGrid}>
          {filtered.map((dest) => (
            <div key={dest.id} style={styles.destinationCard}>
              <div style={styles.destinationImageContainer}>
                <img src={dest.img} alt={dest.name} style={styles.destinationImage} />
                <button
                  style={styles.favoriteButton}
                  onClick={() => toggleFavorite(dest.id)}
                >
                  <Icon.Heart filled={favorites.includes(dest.id)} />
                </button>
                <div style={styles.categoryBadge}>{dest.category}</div>
              </div>
              <div style={styles.destinationContent}>
                <h3 style={styles.destinationName}>{dest.name}</h3>
                <div style={styles.destinationMeta}>
                  <div style={styles.rating}>
                    <Icon.Star filled />
                    <span>{dest.rating}</span>
                    <span style={styles.reviews}>({dest.reviews})</span>
                  </div>
                </div>
                <div style={styles.destinationFooter}>
                  <div style={styles.durationInfo}>
                    <Icon.Clock />
                    <span>{dest.duration}</span>
                  </div>
                  <div style={styles.destinationPrice}>${dest.price}</div>
                </div>
                <button style={styles.viewButton}>View Details</button>
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