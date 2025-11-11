import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { COLORS } from '../utils/colors';
import { Icon } from '../components/Icons';

const MyProfilePage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    name: user?.name || 'John Doe',
    email: user?.email || 'john@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, New York, NY 10001',
    dateOfBirth: '1990-01-15',
  });

  // Mock data
  const bookings = [
    {
      id: 1,
      tour: 'Tokyo City Tour',
      guide: 'Kenji Tanaka',
      date: '2026-01-15',
      time: '10:00 AM',
      status: 'Confirmed',
      price: 95,
      image: 'https://images.unsplash.com/photo-1493558103817-58b2924bce98?w=300',
    },
    {
      id: 2,
      tour: 'Paris Walking Tour',
      guide: 'Sophie Laurent',
      date: '2026-02-20',
      time: '2:00 PM',
      status: 'Confirmed',
      price: 120,
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=300',
    },
  ];

  const bookingHistory = [
    {
      id: 3,
      tour: 'Barcelona Food Tour',
      guide: 'Maria Santos',
      date: '2025-11-05',
      status: 'Completed',
      price: 85,
      rating: 5,
    },
    {
      id: 4,
      tour: 'Rome Ancient Tour',
      guide: 'Marco Rossi',
      date: '2025-10-12',
      status: 'Completed',
      price: 110,
      rating: 4,
    },
  ];

  const paymentMethods = [
    { id: 1, type: 'Visa', last4: '4242', expiry: '12/26', isDefault: true },
    { id: 2, type: 'Mastercard', last4: '8888', expiry: '09/25', isDefault: false },
  ];

  const menuItems = [
    { key: 'overview', label: 'Overview', icon: <Icon.User /> },
    { key: 'bookings', label: 'My Bookings', icon: <Icon.Book /> },
    { key: 'history', label: 'Booking History', icon: <Icon.History /> },
    { key: 'payments', label: 'Payment Methods', icon: <Icon.CreditCard /> },
    { key: 'personal', label: 'Personal Information', icon: <Icon.Settings /> },
    { key: 'wishlist', label: 'Wishlist', icon: <Icon.Heart filled={false} /> },
  ];

  const renderOverview = () => (
    <div>
      <h2 style={styles.contentTitle}>Welcome back, {personalInfo.name}!</h2>
      <div style={styles.overviewGrid}>
        {[
          { icon: <Icon.Book />, label: 'Upcoming Bookings', value: bookings.length },
          { icon: <Icon.CheckCircle />, label: 'Completed Tours', value: bookingHistory.length },
          { icon: <Icon.Heart filled />, label: 'Wishlist Items', value: 5 },
        ].map((item, i) => (
          <div key={i} style={styles.overviewCard}>
            <div style={styles.overviewIcon}>{item.icon}</div>
            <div style={styles.overviewInfo}>
              <h3>{item.label}</h3>
              <p style={styles.overviewNumber}>{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.quickActions}>
        <h3 style={styles.subsectionTitle}>Quick Actions</h3>
        <div style={styles.quickActionsGrid}>
          <button style={styles.quickActionButton} onClick={() => setActiveTab('bookings')}>
            <Icon.Book />
            <span>View Bookings</span>
          </button>
          <button style={styles.quickActionButton} onClick={() => setActiveTab('payments')}>
            <Icon.CreditCard />
            <span>Manage Payments</span>
          </button>
          <button style={styles.quickActionButton} onClick={() => setActiveTab('personal')}>
            <Icon.Settings />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {bookings.length > 0 && (
        <div style={styles.upcomingSection}>
          <h3 style={styles.subsectionTitle}>Next Upcoming Tour</h3>
          <div style={styles.nextTourCard}>
            <img src={bookings[0].image} alt={bookings[0].tour} style={styles.nextTourImage} />
            <div style={styles.nextTourInfo}>
              <h4>{bookings[0].tour}</h4>
              <p style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#666' }}>
                <Icon.Calendar /> {bookings[0].date} at {bookings[0].time}
              </p>
              <p style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: '#666' }}>
                <Icon.User /> Guide: {bookings[0].guide}
              </p>
              <button style={styles.viewDetailsButton}>View Details</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderBookings = () => (
    <div>
      <h2 style={styles.contentTitle}>My Bookings</h2>
      <div style={styles.bookingsGrid}>
        {bookings.map((booking) => (
          <div key={booking.id} style={styles.bookingCard}>
            <img src={booking.image} alt={booking.tour} style={styles.bookingImage} />
            <div style={styles.bookingCardContent}>
              <h3 style={styles.bookingTitle}>{booking.tour}</h3>
              <div style={styles.bookingDetails}>
                <div style={styles.bookingDetail}>
                  <Icon.Calendar />
                  <span>{booking.date}</span>
                </div>
                <div style={styles.bookingDetail}>
                  <Icon.Clock />
                  <span>{booking.time}</span>
                </div>
                <div style={styles.bookingDetail}>
                  <Icon.User />
                  <span>{booking.guide}</span>
                </div>
              </div>
              <div style={styles.bookingFooter}>
                <span style={styles.bookingStatus}>{booking.status}</span>
                <span style={styles.bookingPrice}>${booking.price}</span>
              </div>
              <div style={styles.bookingActions}>
                <button style={styles.bookingActionButton}>View Details</button>
                <button style={{ ...styles.bookingActionButton, ...styles.bookingCancelButton }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderHistory = () => (
    <div>
      <h2 style={styles.contentTitle}>Booking History</h2>
      <div style={styles.historyTable}>
        <div style={styles.historyHeader}>
          <div style={styles.historyHeaderCell}>Tour</div>
          <div style={styles.historyHeaderCell}>Guide</div>
          <div style={styles.historyHeaderCell}>Date</div>
          <div style={styles.historyHeaderCell}>Amount</div>
          <div style={styles.historyHeaderCell}>Rating</div>
          <div style={styles.historyHeaderCell}>Actions</div>
        </div>
        {bookingHistory.map((item) => (
          <div key={item.id} style={styles.historyRow}>
            <div style={styles.historyCell}>{item.tour}</div>
            <div style={styles.historyCell}>{item.guide}</div>
            <div style={styles.historyCell}>{item.date}</div>
            <div style={styles.historyCell}>${item.price}</div>
            <div style={styles.historyCell}>
              <div style={styles.historyRating}>
                {[...Array(5)].map((_, i) => (
                  <Icon.Star key={i} filled={i < item.rating} />
                ))}
              </div>
            </div>
            <div style={styles.historyCell}>
              <button style={styles.downloadButton}>
                <Icon.Download />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPayments = () => (
    <div>
      <h2 style={styles.contentTitle}>Payment Methods</h2>
      <div style={styles.paymentsGrid}>
        {paymentMethods.map((method) => (
          <div key={method.id} style={styles.paymentMethodCard}>
            <div style={styles.paymentMethodHeader}>
              <Icon.CreditCard />
              <div style={styles.paymentMethodInfo}>
                <h4>
                  {method.type} •••• {method.last4}
                </h4>
                <p>Expires {method.expiry}</p>
              </div>
              {method.isDefault && <span style={styles.defaultBadge}>Default</span>}
            </div>
            <div style={styles.paymentMethodActions}>
              <button style={styles.paymentEditButton}>
                <Icon.Edit />
                Edit
              </button>
              <button style={styles.paymentDeleteButton}>
                <Icon.Trash />
                Remove
              </button>
            </div>
          </div>
        ))}
        <button style={styles.addPaymentMethodButton}>+ Add New Payment Method</button>
      </div>
    </div>
  );

  const renderPersonalInfo = () => (
    <div>
      <div style={styles.personalInfoHeader}>
        <h2 style={styles.contentTitle}>Personal Information</h2>
        <button style={styles.editButton} onClick={() => setEditingPersonal(!editingPersonal)}>
          {editingPersonal ? 'Cancel' : 'Edit'}
        </button>
      </div>
      <div style={styles.personalInfoForm}>
        <div style={styles.formGroup}>
          <label style={styles.formLabel}>Full Name</label>
          <input
            type="text"
            value={personalInfo.name}
            onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
            disabled={!editingPersonal}
            style={styles.formInput}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.formLabel}>Email Address</label>
          <input
            type="email"
            value={personalInfo.email}
            onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
            disabled={!editingPersonal}
            style={styles.formInput}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.formLabel}>Phone Number</label>
          <input
            type="tel"
            value={personalInfo.phone}
            onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
            disabled={!editingPersonal}
            style={styles.formInput}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.formLabel}>Address</label>
          <input
            type="text"
            value={personalInfo.address}
            onChange={(e) => setPersonalInfo({ ...personalInfo, address: e.target.value })}
            disabled={!editingPersonal}
            style={styles.formInput}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.formLabel}>Date of Birth</label>
          <input
            type="date"
            value={personalInfo.dateOfBirth}
            onChange={(e) => setPersonalInfo({ ...personalInfo, dateOfBirth: e.target.value })}
            disabled={!editingPersonal}
            style={styles.formInput}
          />
        </div>
        {editingPersonal && <button style={styles.saveButton}>Save Changes</button>}
      </div>
    </div>
  );

  const renderWishlist = () => (
    <div style={styles.emptyWishlist}>
      <div style={{ fontSize: '64px', marginBottom: '20px' }}>
        <Icon.Heart filled={false} />
      </div>
      <h3>Your wishlist is empty</h3>
      <p>Start adding experiences you love to plan your perfect trip</p>
      <button style={styles.exploreButton}>Explore Destinations</button>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'bookings':
        return renderBookings();
      case 'history':
        return renderHistory();
      case 'payments':
        return renderPayments();
      case 'personal':
        return renderPersonalInfo();
      case 'wishlist':
        return renderWishlist();
      default:
        return renderOverview();
    }
  };

  return (
    <div style={styles.profilePage}>
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <div style={styles.avatar}>{personalInfo.name.charAt(0)}</div>
          <h3 style={styles.userName}>{personalInfo.name}</h3>
          <p style={styles.userEmail}>{personalInfo.email}</p>
        </div>

        <ul style={styles.sidebarMenu}>
          {menuItems.map((item) => (
            <li
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              style={{
                ...styles.sidebarMenuItem,
                ...(activeTab === item.key ? styles.sidebarMenuItemActive : {}),
              }}
            >
              <span style={styles.menuIcon}>{item.icon}</span>
              {item.label}
            </li>
          ))}
        </ul>
      </div>

      <div style={styles.profileContent}>{renderContent()}</div>
    </div>
  );
};

const styles = {
  profilePage: {
    display: 'flex',
    minHeight: 'calc(100vh - 140px)',
    background: COLORS.light,
  },
  sidebar: {
    width: '280px',
    background: 'white',
    borderRight: `1px solid ${COLORS.border}`,
    padding: '32px 20px',
  },
  sidebarHeader: {
    textAlign: 'center',
    marginBottom: '32px',
    paddingBottom: '24px',
    borderBottom: `1px solid ${COLORS.border}`,
  },
  avatar: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '36px',
    fontWeight: 'bold',
    margin: '0 auto 16px',
  },
  userName: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '4px',
    color: '#333',
  },
  userEmail: {
    color: '#666',
    fontSize: '14px',
  },
  sidebarMenu: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  sidebarMenuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    marginBottom: '8px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    color: '#666',
    fontWeight: '500',
  },
  sidebarMenuItemActive: {
    background: `${COLORS.primary}15`,
    color: COLORS.primary,
    fontWeight: '600',
  },
  menuIcon: {
    display: 'flex',
    alignItems: 'center',
  },
  profileContent: {
    flex: 1,
    padding: '40px',
    overflowY: 'auto',
  },
  contentTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '32px',
    color: '#333',
  },
  overviewGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '24px',
    marginBottom: '40px',
  },
  overviewCard: {
    background: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  overviewIcon: {
    width: '60px',
    height: '60px',
    borderRadius: '12px',
    background: `${COLORS.primary}15`,
    color: COLORS.primary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overviewInfo: {
    flex: 1,
  },
  overviewNumber: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: COLORS.primary,
    margin: 0,
  },
  quickActions: {
    marginBottom: '40px',
  },
  subsectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '20px',
    color: '#333',
  },
  quickActionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
  },
  quickActionButton: {
    background: 'white',
    border: `2px solid ${COLORS.border}`,
    padding: '20px',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    color: COLORS.gray,
    fontWeight: '600',
  },
  upcomingSection: {
    marginTop: '40px',
  },
  nextTourCard: {
    background: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    display: 'flex',
    gap: '24px',
  },
  nextTourImage: {
    width: '200px',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  nextTourInfo: {
    flex: 1,
  },
  viewDetailsButton: {
    background: COLORS.primary,
    color: 'white',
    border: 'none',
    padding: '10px 24px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  bookingsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '24px',
  },
  bookingCard: {
    background: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  },
  bookingImage: {
    width: '100%',
    height: '180px',
    objectFit: 'cover',
  },
  bookingCardContent: {
    padding: '20px',
  },
  bookingTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '16px',
    color: '#333',
  },
  bookingDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '16px',
  },
  bookingDetail: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#666',
    fontSize: '14px',
  },
  bookingFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    paddingTop: '16px',
    borderTop: `1px solid ${COLORS.border}`,
  },
  bookingStatus: {
    background: `${COLORS.success}15`,
    color: COLORS.success,
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
  },
  bookingPrice: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  bookingActions: {
    display: 'flex',
    gap: '8px',
  },
  bookingActionButton: {
    flex: 1,
    background: COLORS.primary,
    color: 'white',
    border: 'none',
    padding: '10px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  bookingCancelButton: {
    background: 'transparent',
    border: `2px solid ${COLORS.danger}`,
    color: COLORS.danger,
  },
  historyTable: {
    background: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  },
  historyHeader: {
    display: 'grid',
    gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 0.5fr',
    gap: '16px',
    padding: '16px 24px',
    background: COLORS.light,
    fontWeight: '600',
    color: '#333',
    fontSize: '14px',
  },
  historyHeaderCell: {
    fontSize: '14px',
  },
  historyRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 0.5fr',
    gap: '16px',
    padding: '16px 24px',
    borderBottom: `1px solid ${COLORS.border}`,
    alignItems: 'center',
  },
  historyCell: {
    fontSize: '14px',
    color: '#666',
  },
  historyRating: {
    display: 'flex',
    gap: '4px',
    color: '#FFB800',
  },
  downloadButton: {
    background: 'transparent',
    border: 'none',
    color: COLORS.primary,
    cursor: 'pointer',
    padding: '8px',
  },
  paymentsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  paymentMethodCard: {
    background: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  },
  paymentMethodHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '16px',
  },
  paymentMethodInfo: {
    flex: 1,
  },
  defaultBadge: {
    background: `${COLORS.success}15`,
    color: COLORS.success,
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
  },
  paymentMethodActions: {
    display: 'flex',
    gap: '12px',
  },
  paymentEditButton: {
    background: 'transparent',
    border: `2px solid ${COLORS.primary}`,
    color: COLORS.primary,
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  paymentDeleteButton: {
    background: 'transparent',
    border: `2px solid ${COLORS.danger}`,
    color: COLORS.danger,
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  addPaymentMethodButton: {
    background: 'white',
    border: `2px dashed ${COLORS.border}`,
    color: COLORS.gray,
    padding: '20px',
    borderRadius: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '16px',
  },
  personalInfoHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
  },
  editButton: {
    background: COLORS.primary,
    color: 'white',
    border: 'none',
    padding: '10px 24px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  personalInfoForm: {
    background: 'white',
    padding: '32px',
    borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    maxWidth: '600px',
  },
  formGroup: {
    marginBottom: '24px',
  },
  formLabel: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#333',
  },
  formInput: {
    width: '100%',
    padding: '12px',
    border: `2px solid ${COLORS.border}`,
    borderRadius: '8px',
    fontSize: '16px',
    outline: 'none',
  },
  saveButton: {
    background: COLORS.primary,
    color: 'white',
    border: 'none',
    padding: '12px 32px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  emptyWishlist: {
    textAlign: 'center',
    padding: '80px 20px',
    color: '#999',
  },
  exploreButton: {
    background: COLORS.primary,
    color: 'white',
    border: 'none',
    padding: '12px 32px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '24px',
  },
};

export default MyProfilePage;