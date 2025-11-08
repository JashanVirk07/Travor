import { useState } from 'react';
import Navbar from "../components/Navbar";

// Simple icon components
const MapPin = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const Star = ({ filled }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

const Clock = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const DollarSign = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

const Heart = ({ filled }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const Search = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
);

export default function Destinations() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);

  const categories = [
    { id: 'all', name: 'All Destinations' },
    { id: 'beach', name: 'Beach' },
    { id: 'mountain', name: 'Mountain' },
    { id: 'city', name: 'City' },
    { id: 'cultural', name: 'Cultural' },
    { id: 'adventure', name: 'Adventure' }
  ];

  const destinations = [
    {
      id: 1,
      name: 'Santorini, Greece',
      category: 'beach',
      image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800',
      rating: 4.9,
      reviews: 2847,
      duration: '5-7 days',
      price: 1299,
      description: 'Experience the stunning sunsets, white-washed buildings, and crystal-clear waters of this iconic Greek island.',
      highlights: ['Sunset in Oia', 'Blue Domed Churches', 'Wine Tasting', 'Beach Clubs'],
      bestTime: 'April to November'
    },
    {
      id: 2,
      name: 'Kyoto, Japan',
      category: 'cultural',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800',
      rating: 4.8,
      reviews: 3241,
      duration: '4-6 days',
      price: 1599,
      description: 'Immerse yourself in ancient temples, traditional tea ceremonies, and stunning cherry blossoms in Japan\'s cultural heart.',
      highlights: ['Fushimi Inari Shrine', 'Bamboo Forest', 'Geisha District', 'Tea Ceremonies'],
      bestTime: 'March to May, October to November'
    },
    {
      id: 3,
      name: 'Swiss Alps, Switzerland',
      category: 'mountain',
      image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800',
      rating: 4.9,
      reviews: 1923,
      duration: '6-8 days',
      price: 2199,
      description: 'Explore breathtaking mountain peaks, pristine lakes, and charming Alpine villages in the heart of Europe.',
      highlights: ['Matterhorn', 'Scenic Train Rides', 'Skiing', 'Mountain Hiking'],
      bestTime: 'June to September, December to March'
    },
    {
      id: 4,
      name: 'New York City, USA',
      category: 'city',
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800',
      rating: 4.7,
      reviews: 5673,
      duration: '4-5 days',
      price: 899,
      description: 'Discover the city that never sleeps with its iconic landmarks, world-class museums, and diverse neighborhoods.',
      highlights: ['Statue of Liberty', 'Central Park', 'Broadway Shows', 'Times Square'],
      bestTime: 'April to June, September to November'
    },
    {
      id: 5,
      name: 'Bali, Indonesia',
      category: 'beach',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
      rating: 4.8,
      reviews: 4156,
      duration: '7-10 days',
      price: 1099,
      description: 'Find your paradise with stunning beaches, lush rice terraces, ancient temples, and vibrant culture.',
      highlights: ['Ubud Rice Terraces', 'Beach Clubs', 'Temple Tours', 'Surfing'],
      bestTime: 'April to October'
    },
    {
      id: 6,
      name: 'Patagonia, Argentina',
      category: 'adventure',
      image: 'https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?w=800',
      rating: 4.9,
      reviews: 1567,
      duration: '8-12 days',
      price: 2599,
      description: 'Embark on an epic adventure through dramatic glaciers, towering peaks, and pristine wilderness.',
      highlights: ['Perito Moreno Glacier', 'Trekking', 'Wildlife Watching', 'Mount Fitz Roy'],
      bestTime: 'November to March'
    },
    {
      id: 7,
      name: 'Paris, France',
      category: 'city',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
      rating: 4.8,
      reviews: 6234,
      duration: '4-6 days',
      price: 1399,
      description: 'Fall in love with the City of Light, from the Eiffel Tower to charming cafés and world-renowned art.',
      highlights: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame', 'Seine River Cruise'],
      bestTime: 'April to June, September to October'
    },
    {
      id: 8,
      name: 'Machu Picchu, Peru',
      category: 'cultural',
      image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800',
      rating: 4.9,
      reviews: 2891,
      duration: '5-7 days',
      price: 1799,
      description: 'Uncover the mysteries of this ancient Incan citadel nestled high in the Andes Mountains.',
      highlights: ['Inca Trail', 'Sacred Valley', 'Cusco', 'Rainbow Mountain'],
      bestTime: 'May to September'
    },
    {
      id: 9,
      name: 'Iceland Ring Road',
      category: 'adventure',
      image: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800',
      rating: 4.8,
      reviews: 2134,
      duration: '7-10 days',
      price: 2299,
      description: 'Journey through otherworldly landscapes of waterfalls, glaciers, geysers, and the Northern Lights.',
      highlights: ['Northern Lights', 'Blue Lagoon', 'Waterfalls', 'Glacier Hiking'],
      bestTime: 'June to August, September to March'
    },
    {
      id: 10,
      name: 'Amalfi Coast, Italy',
      category: 'beach',
      image: 'https://images.unsplash.com/photo-1534445538923-ab38438550ed?w=800',
      rating: 4.9,
      reviews: 3456,
      duration: '5-7 days',
      price: 1699,
      description: 'Cruise along dramatic cliffs, visit colorful villages, and indulge in authentic Italian cuisine.',
      highlights: ['Positano', 'Capri Island', 'Lemon Groves', 'Coastal Drives'],
      bestTime: 'April to June, September to October'
    },
    {
      id: 11,
      name: 'Dubai, UAE',
      category: 'city',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
      rating: 4.7,
      reviews: 4567,
      duration: '4-5 days',
      price: 1499,
      description: 'Experience luxury and innovation in this futuristic desert metropolis with record-breaking architecture.',
      highlights: ['Burj Khalifa', 'Desert Safari', 'Gold Souk', 'Palm Jumeirah'],
      bestTime: 'November to March'
    },
    {
      id: 12,
      name: 'Banff, Canada',
      category: 'mountain',
      image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800',
      rating: 4.8,
      reviews: 2678,
      duration: '5-7 days',
      price: 1399,
      description: 'Explore turquoise lakes, majestic mountains, and abundant wildlife in the Canadian Rockies.',
      highlights: ['Lake Louise', 'Moraine Lake', 'Hiking Trails', 'Wildlife Viewing'],
      bestTime: 'June to September, December to March'
    }
  ];

  const toggleFavorite = (id) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const filteredDestinations = destinations.filter(dest => {
    const matchesCategory = selectedCategory === 'all' || dest.category === selectedCategory;
    const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dest.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #eff6ff, #ffffff, #faf5ff)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    hero: {
      background: 'linear-gradient(to right, #2563eb, #9333ea)',
      color: 'white',
      padding: '80px 20px',
      textAlign: 'center'
    },
    title: {
      fontSize: '3rem',
      fontWeight: 'bold',
      marginBottom: '16px'
    },
    subtitle: {
      fontSize: '1.25rem',
      color: '#bfdbfe',
      marginBottom: '32px'
    },
    searchContainer: {
      maxWidth: '672px',
      margin: '0 auto',
      position: 'relative'
    },
    searchIcon: {
      position: 'absolute',
      left: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#9ca3af'
    },
    searchInput: {
      width: '100%',
      paddingLeft: '48px',
      paddingRight: '16px',
      paddingTop: '16px',
      paddingBottom: '16px',
      borderRadius: '9999px',
      border: 'none',
      fontSize: '1.125rem',
      outline: 'none',
      color: '#1f2937'
    },
    content: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '48px 16px'
    },
    categoryContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '12px',
      marginBottom: '48px',
      justifyContent: 'center'
    },
    categoryButton: {
      padding: '12px 24px',
      borderRadius: '9999px',
      fontWeight: '500',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s',
      fontSize: '1rem'
    },
    categoryButtonActive: {
      background: '#2563eb',
      color: 'white',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      transform: 'scale(1.05)'
    },
    categoryButtonInactive: {
      background: 'white',
      color: '#374151',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    },
    resultsText: {
      textAlign: 'center',
      color: '#4b5563',
      marginBottom: '32px',
      fontSize: '1.125rem'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '32px'
    },
    card: {
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      transition: 'all 0.3s',
      cursor: 'pointer'
    },
    imageContainer: {
      position: 'relative',
      height: '256px',
      overflow: 'hidden'
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.5s'
    },
    favoriteButton: {
      position: 'absolute',
      top: '16px',
      right: '16px',
      background: 'white',
      border: 'none',
      borderRadius: '9999px',
      padding: '8px',
      cursor: 'pointer',
      transition: 'transform 0.2s'
    },
    categoryBadge: {
      position: 'absolute',
      bottom: '16px',
      left: '16px',
      background: 'white',
      padding: '4px 12px',
      borderRadius: '9999px',
      fontSize: '0.875rem',
      fontWeight: '600',
      textTransform: 'capitalize'
    },
    cardContent: {
      padding: '24px'
    },
    destinationName: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '12px'
    },
    ratingContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '16px'
    },
    rating: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    ratingText: {
      fontWeight: '600',
      color: '#1f2937'
    },
    reviews: {
      color: '#6b7280'
    },
    description: {
      color: '#4b5563',
      marginBottom: '16px',
      lineHeight: '1.5',
      display: '-webkit-box',
      WebkitLineClamp: 3,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden'
    },
    highlightsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      marginBottom: '16px'
    },
    highlight: {
      background: '#eff6ff',
      color: '#1d4ed8',
      padding: '4px 12px',
      borderRadius: '9999px',
      fontSize: '0.875rem',
      fontWeight: '500'
    },
    infoGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px',
      marginBottom: '16px',
      paddingTop: '16px',
      borderTop: '1px solid #e5e7eb'
    },
    infoItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: '#4b5563',
      fontSize: '0.875rem'
    },
    bestTimeContainer: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '8px',
      color: '#4b5563',
      marginBottom: '16px'
    },
    bestTimeLabel: {
      fontSize: '0.75rem',
      fontWeight: '600',
      color: '#6b7280',
      textTransform: 'uppercase',
      marginBottom: '4px'
    },
    bestTime: {
      fontSize: '0.875rem'
    },
    ctaButton: {
      width: '100%',
      background: 'linear-gradient(to right, #2563eb, #9333ea)',
      color: 'white',
      padding: '12px',
      borderRadius: '12px',
      fontWeight: '600',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s',
      fontSize: '1rem'
    },
    stats: {
      background: 'linear-gradient(to right, #2563eb, #9333ea)',
      color: 'white',
      padding: '64px 16px',
      marginTop: '48px'
    },
    statsGrid: {
      maxWidth: '1280px',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '32px',
      textAlign: 'center'
    },
    statNumber: {
      fontSize: '2.25rem',
      fontWeight: 'bold',
      marginBottom: '8px'
    },
    statLabel: {
      color: '#bfdbfe'
    }
  };

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.hero}>
        <div>
          <h1 style={styles.title}>Discover Your Next Adventure</h1>
          <p style={styles.subtitle}>
            Explore breathtaking destinations from around the world
          </p>
          
          {/* Search Bar */}
          <div style={styles.searchContainer}>
            <div style={styles.searchIcon}>
              <Search />
            </div>
            <input
              type="text"
              placeholder="Search destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
          </div>
        </div>
      </div>

      <div style={styles.content}>
        {/* Category Filter */}
        <div style={styles.categoryContainer}>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                ...styles.categoryButton,
                ...(selectedCategory === cat.id ? styles.categoryButtonActive : styles.categoryButtonInactive)
              }}
              onMouseEnter={(e) => {
                if (selectedCategory !== cat.id) {
                  e.target.style.background = '#f3f4f6';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedCategory !== cat.id) {
                  e.target.style.background = 'white';
                }
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <p style={styles.resultsText}>
          Showing {filteredDestinations.length} amazing {selectedCategory === 'all' ? '' : selectedCategory} destinations
        </p>

        {/* Destinations Grid */}
        <div style={styles.grid}>
          {filteredDestinations.map(dest => (
            <div
              key={dest.id}
              style={styles.card}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
                const img = e.currentTarget.querySelector('img');
                if (img) img.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                const img = e.currentTarget.querySelector('img');
                if (img) img.style.transform = 'scale(1)';
              }}
            >
              {/* Image */}
              <div style={styles.imageContainer}>
                <img
                  src={dest.image}
                  alt={dest.name}
                  style={styles.image}
                />
                <button
                  onClick={() => toggleFavorite(dest.id)}
                  style={styles.favoriteButton}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <div style={{ color: favorites.includes(dest.id) ? '#ef4444' : '#4b5563' }}>
                    <Heart filled={favorites.includes(dest.id)} />
                  </div>
                </button>
                <div style={styles.categoryBadge}>
                  {dest.category}
                </div>
              </div>

              {/* Content */}
              <div style={styles.cardContent}>
                <h3 style={styles.destinationName}>{dest.name}</h3>

                {/* Rating */}
                <div style={styles.ratingContainer}>
                  <div style={styles.rating}>
                    <div style={{ color: '#fbbf24' }}>
                      <Star filled={true} />
                    </div>
                    <span style={styles.ratingText}>{dest.rating}</span>
                  </div>
                  <span style={styles.reviews}>({dest.reviews.toLocaleString()} reviews)</span>
                </div>

                <p style={styles.description}>{dest.description}</p>

                {/* Highlights */}
                <div style={styles.highlightsContainer}>
                  {dest.highlights.slice(0, 3).map((highlight, idx) => (
                    <span key={idx} style={styles.highlight}>
                      {highlight}
                    </span>
                  ))}
                </div>

                {/* Info Row */}
                <div style={styles.infoGrid}>
                  <div style={styles.infoItem}>
                    <div style={{ color: '#2563eb' }}>
                      <Clock />
                    </div>
                    <span>{dest.duration}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <div style={{ color: '#059669' }}>
                      <DollarSign />
                    </div>
                    <span style={{ fontWeight: '600' }}>${dest.price}</span>
                  </div>
                </div>

                {/* Best Time */}
                <div style={styles.bestTimeContainer}>
                  <div style={{ color: '#9333ea', marginTop: '2px', flexShrink: 0 }}>
                    <MapPin />
                  </div>
                  <div>
                    <p style={styles.bestTimeLabel}>Best Time</p>
                    <p style={styles.bestTime}>{dest.bestTime}</p>
                  </div>
                </div>

                {/* CTA Button */}
                <button 
                  style={styles.ctaButton}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'linear-gradient(to right, #1d4ed8, #7e22ce)';
                    e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'linear-gradient(to right, #2563eb, #9333ea)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div style={styles.stats}>
        <div style={styles.statsGrid}>
          <div>
            <div style={styles.statNumber}>200+</div>
            <div style={styles.statLabel}>Destinations</div>
          </div>
          <div>
            <div style={styles.statNumber}>50K+</div>
            <div style={styles.statLabel}>Happy Travelers</div>
          </div>
          <div>
            <div style={styles.statNumber}>4.8★</div>
            <div style={styles.statLabel}>Average Rating</div>
          </div>
          <div>
            <div style={styles.statNumber}>24/7</div>
            <div style={styles.statLabel}>Support</div>
          </div>
        </div>
      </div>
    </div>
  );
}