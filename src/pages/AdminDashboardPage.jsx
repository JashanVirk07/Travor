import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminService } from '../services/adminService';
import { COLORS } from '../utils/colors';

const AdminDashboardPage = () => {
  const { userProfile, setCurrentPage } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  // Security Check: If not admin, redirect
  useEffect(() => {
    if (userProfile && userProfile.role !== 'admin') {
      alert("Access Denied. Admins only.");
      setCurrentPage('home');
    }
  }, [userProfile]);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    if (activeTab === 'dashboard') {
      const data = await adminService.getStats();
      setStats(data);
    } else if (activeTab === 'users') {
      const data = await adminService.getAllUsers();
      setUsers(data);
    } else if (activeTab === 'bookings') {
      const data = await adminService.getAllBookings();
      setBookings(data);
    } else if (activeTab === 'tours') {
      const data = await adminService.getAllTours();
      setTours(data);
    }
    setLoading(false);
  };

  const handleVerifyGuide = async (userId) => {
    if (window.confirm("Verify this guide?")) {
      await adminService.verifyGuide(userId);
      loadData(); // Refresh list
    }
  };

  const handleDeleteTour = async (tourId) => {
    if (window.confirm("Are you sure you want to delete this tour?")) {
      await adminService.deleteTour(tourId);
      loadData();
    }
  };

  // --- SUB-COMPONENTS FOR TABS ---

  const DashboardTab = () => (
    <div style={styles.statsGrid}>
      <div style={styles.statCard}>
        <div style={styles.statLabel}>Total Revenue</div>
        <div style={{...styles.statValue, color: COLORS.primary}}>${stats?.totalRevenue?.toLocaleString()}</div>
      </div>
      <div style={styles.statCard}>
        <div style={styles.statLabel}>Total Bookings</div>
        <div style={styles.statValue}>{stats?.totalBookings}</div>
      </div>
      <div style={styles.statCard}>
        <div style={styles.statLabel}>Total Users</div>
        <div style={styles.statValue}>{stats?.totalUsers}</div>
      </div>
      <div style={styles.statCard}>
        <div style={styles.statLabel}>Active Tours</div>
        <div style={styles.statValue}>{stats?.totalTours}</div>
      </div>
    </div>
  );

  const UsersTab = () => (
    <div style={styles.tableContainer}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Role</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} style={styles.tr}>
              <td style={styles.td}>{user.fullName || user.name}</td>
              <td style={styles.td}>{user.email}</td>
              <td style={styles.td}>
                <span style={user.role === 'guide' ? styles.roleGuide : styles.roleUser}>
                  {user.role?.toUpperCase()}
                </span>
              </td>
              <td style={styles.td}>
                {user.isVerified ? <span style={styles.verified}>Verified</span> : 'Unverified'}
              </td>
              <td style={styles.td}>
                {user.role === 'guide' && !user.isVerified && (
                  <button onClick={() => handleVerifyGuide(user.id)} style={styles.actionBtn}>
                    ✅ Verify
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const BookingsTab = () => (
    <div style={styles.tableContainer}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Tour</th>
            <th style={styles.th}>Traveler</th>
            <th style={styles.th}>Date</th>
            <th style={styles.th}>Price</th>
            <th style={styles.th}>Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(booking => (
            <tr key={booking.id} style={styles.tr}>
              <td style={styles.td}>{booking.tourTitle}</td>
              <td style={styles.td}>{booking.travelerName || 'User'}</td>
              <td style={styles.td}>{booking.startDate?.toDate ? booking.startDate.toDate().toLocaleDateString() : booking.startDate}</td>
              <td style={styles.td}>${booking.totalPrice}</td>
              <td style={styles.td}>
                <span style={{...styles.status, 
                  background: booking.status === 'confirmed' ? '#d1fae5' : 
                              booking.status === 'completed' ? '#dbeafe' : '#fef3c7',
                  color: booking.status === 'confirmed' ? '#065f46' : 
                         booking.status === 'completed' ? '#1e40af' : '#92400e'
                }}>
                  {booking.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const ToursTab = () => (
    <div style={styles.tableContainer}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Title</th>
            <th style={styles.th}>Location</th>
            <th style={styles.th}>Price</th>
            <th style={styles.th}>Bookings</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tours.map(tour => (
            <tr key={tour.id} style={styles.tr}>
              <td style={styles.td}>{tour.title}</td>
              <td style={styles.td}>{tour.location}</td>
              <td style={styles.td}>${tour.price}</td>
              <td style={styles.td}>{tour.bookings || 0}</td>
              <td style={styles.td}>
                <button onClick={() => handleDeleteTour(tour.id)} style={styles.deleteBtn}>
                  🗑️ Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <h2>🛡️ Admin</h2>
        </div>
        <nav style={styles.nav}>
          <button 
            style={activeTab === 'dashboard' ? styles.navItemActive : styles.navItem}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
          </button>
          <button 
            style={activeTab === 'users' ? styles.navItemActive : styles.navItem}
            onClick={() => setActiveTab('users')}
          >
            👥 Users & Guides
          </button>
          <button 
            style={activeTab === 'bookings' ? styles.navItemActive : styles.navItem}
            onClick={() => setActiveTab('bookings')}
          >
            📅 Bookings
          </button>
          <button 
            style={activeTab === 'tours' ? styles.navItemActive : styles.navItem}
            onClick={() => setActiveTab('tours')}
          >
            🗺️ Tours
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div style={styles.content}>
        <div style={styles.header}>
          <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
          <div style={styles.adminInfo}>Logged in as {userProfile?.email}</div>
        </div>

        {loading ? (
          <div style={styles.loading}>Loading data...</div>
        ) : (
          <>
            {activeTab === 'dashboard' && <DashboardTab />}
            {activeTab === 'users' && <UsersTab />}
            {activeTab === 'bookings' && <BookingsTab />}
            {activeTab === 'tours' && <ToursTab />}
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    background: '#f3f4f6',
  },
  sidebar: {
    width: '250px',
    background: '#1f2937',
    color: 'white',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
  },
  sidebarHeader: {
    marginBottom: '40px',
    paddingBottom: '20px',
    borderBottom: '1px solid #374151',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  navItem: {
    padding: '12px',
    background: 'transparent',
    border: 'none',
    color: '#9ca3af',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: '16px',
    borderRadius: '8px',
    transition: '0.2s',
  },
  navItemActive: {
    padding: '12px',
    background: COLORS.primary,
    border: 'none',
    color: 'white',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: '16px',
    borderRadius: '8px',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: '40px',
    overflowY: 'auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
  },
  adminInfo: {
    color: '#666',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '24px',
  },
  statCard: {
    background: 'white',
    padding: '24px',
    borderRadius: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  statLabel: {
    color: '#666',
    fontSize: '14px',
    marginBottom: '8px',
  },
  statValue: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#111',
  },
  tableContainer: {
    background: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '16px',
    background: '#f9fafb',
    borderBottom: '1px solid #e5e7eb',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
  },
  tr: {
    borderBottom: '1px solid #e5e7eb',
  },
  td: {
    padding: '16px',
    fontSize: '14px',
    color: '#4b5563',
  },
  roleGuide: {
    background: '#e0e7ff',
    color: '#4338ca',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
  },
  roleUser: {
    background: '#f3f4f6',
    color: '#374151',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
  },
  verified: {
    color: '#059669',
    fontWeight: '600',
  },
  actionBtn: {
    padding: '6px 12px',
    background: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  deleteBtn: {
    padding: '6px 12px',
    background: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  status: {
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: '#666',
  }
};

export default AdminDashboardPage;