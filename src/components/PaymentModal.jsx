// src/components/PaymentModal.jsx
import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '../config/stripe';
import StripePaymentForm from './StripePaymentForm';
import { COLORS } from '../utils/colors';

const PaymentModal = ({ isOpen, onClose, bookingData, onPaymentSuccess }) => {
  if (!isOpen) return null;

  const handleSuccess = (paymentResult) => {
    onPaymentSuccess(paymentResult);
  };

  const handleError = (error) => {
    console.error('Payment failed:', error);
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>Complete Your Payment</h2>
          <button onClick={onClose} style={styles.closeButton}>✕</button>
        </div>

        <div style={styles.bookingInfo}>
          <h3 style={styles.tourTitle}>{bookingData.tour?.title}</h3>
          <div style={styles.bookingDetails}>
            <div style={styles.detailRow}>
              <span>📅 Date:</span>
              <span>{new Date(bookingData.startDate).toLocaleDateString()}</span>
            </div>
            <div style={styles.detailRow}>
              <span>👥 Participants:</span>
              <span>{bookingData.numberOfParticipants}</span>
            </div>
            <div style={styles.detailRow}>
              <span>📍 Location:</span>
              <span>{bookingData.tour?.location}</span>
            </div>
          </div>
        </div>

        <div style={styles.content}>
          <Elements stripe={stripePromise}>
            <StripePaymentForm
              amount={bookingData.totalPrice}
              bookingId={bookingData.bookingId}
              onSuccess={handleSuccess}
              onError={handleError}
              onCancel={onClose}
            />
          </Elements>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    padding: '20px',
  },
  modal: {
    background: 'white',
    borderRadius: '16px',
    maxWidth: '600px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px',
    borderBottom: `1px solid ${COLORS.border}`,
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    margin: 0,
  },
  closeButton: {
    background: 'transparent',
    border: 'none',
    fontSize: '24px',
    color: '#666',
    cursor: 'pointer',
    padding: '0',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookingInfo: {
    padding: '24px',
    background: COLORS.light,
    borderBottom: `1px solid ${COLORS.border}`,
  },
  tourTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '16px',
  },
  bookingDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    color: '#666',
  },
  content: {
    padding: '24px',
  },
};

export default PaymentModal;