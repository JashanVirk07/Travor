import React, { useState, useEffect } from 'react';
import { enhancedPaymentService } from '../services/paymentService';
import { COLORS } from '../utils/colors';

const RefundModal = ({ isOpen, onClose, booking, onRefundSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [eligibility, setEligibility] = useState(null);
  const [refundReason, setRefundReason] = useState('');
  const [error, setError] = useState(null);

  // FIX: Safely get the ID. The profile page usually sets 'id', but services often look for 'bookingId'
  const validBookingId = booking?.id || booking?.bookingId;

  useEffect(() => {
    if (isOpen && booking && validBookingId) {
      checkEligibility();
    }
  }, [isOpen, booking, validBookingId]);

  const checkEligibility = async () => {
    try {
      if (!validBookingId) {
        setError('Invalid Booking ID');
        return;
      }
      // Use validBookingId instead of booking.bookingId
      const result = await enhancedPaymentService.checkRefundEligibility(validBookingId);
      setEligibility(result);
    } catch (error) {
      console.error('Error checking eligibility:', error);
      setError('Failed to check refund eligibility');
    }
  };

  const handleRefund = async () => {
    if (!refundReason.trim()) {
      setError('Please provide a reason for cancellation');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Use validBookingId instead of booking.bookingId
      const result = await enhancedPaymentService.processRefund(
        validBookingId,
        refundReason
      );

      alert(`✅ ${result.message}`);
      onRefundSuccess();
      onClose();
    } catch (err) {
      console.error('Refund error:', err);
      setError(err.message || 'Failed to process refund');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>Request Refund</h2>
          <button onClick={onClose} style={styles.closeButton}>✕</button>
        </div>

        <div style={styles.content}>
          {/* Booking Info */}
          <div style={styles.bookingInfo}>
            <h3 style={styles.tourTitle}>{booking?.tourDetails?.title || booking?.tourTitle || 'Tour'}</h3>
            <div style={styles.bookingDetails}>
              <div style={styles.detailRow}>
                <span>📅 Date:</span>
                <span>
                    {booking?.startDate ? 
                        (booking.startDate.toDate ? booking.startDate.toDate().toLocaleDateString() : new Date(booking.startDate).toLocaleDateString()) 
                        : 'N/A'}
                </span>
              </div>
              <div style={styles.detailRow}>
                <span>💰 Paid Amount:</span>
                <span>${booking?.totalPrice}</span>
              </div>
            </div>
          </div>

          {/* Eligibility Info */}
          {eligibility && (
            <div style={eligibility.eligible ? styles.eligibleBox : styles.ineligibleBox}>
              {eligibility.eligible ? (
                <>
                  <div style={styles.eligibilityTitle}>
                    ✅ Refund Available
                  </div>
                  <div style={styles.refundDetails}>
                    <div style={styles.refundRow}>
                      <span>Refund Amount:</span>
                      <span style={styles.refundAmount}>
                        ${eligibility.refundAmount?.toFixed(2)}
                      </span>
                    </div>
                    <div style={styles.refundRow}>
                      <span>Refund Percentage:</span>
                      <span>{eligibility.refundPercentage}%</span>
                    </div>
                    <div style={styles.refundRow}>
                      <span>Hours Until Tour:</span>
                      <span>{Math.floor(eligibility.hoursUntilBooking)} hours</span>
                    </div>
                  </div>
                  <p style={styles.policyText}>{eligibility.message}</p>
                </>
              ) : (
                <>
                  <div style={styles.eligibilityTitle}>
                    ❌ Refund Not Available
                  </div>
                  <p style={styles.ineligibleReason}>{eligibility.reason}</p>
                </>
              )}
            </div>
          )}

          {/* Refund Form */}
          {eligibility?.eligible && (
            <>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Reason for Cancellation *
                </label>
                <textarea
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="Please tell us why you're cancelling..."
                  rows="4"
                  style={styles.textarea}
                  disabled={loading}
                />
              </div>

              {error && (
                <div style={styles.errorBox}>
                  ⚠️ {error}
                </div>
              )}

              <div style={styles.warningBox}>
                <strong>⚠️ Important:</strong>
                <p>This action cannot be undone. The refund will be processed to your original payment method within 5-10 business days.</p>
              </div>

              <div style={styles.actions}>
                <button
                  onClick={onClose}
                  disabled={loading}
                  style={styles.cancelButton}
                >
                  Keep Booking
                </button>
                <button
                  onClick={handleRefund}
                  disabled={loading}
                  style={styles.refundButton}
                >
                  {loading ? 'Processing...' : 'Confirm Refund'}
                </button>
              </div>
            </>
          )}

          {/* Close button if not eligible */}
          {eligibility && !eligibility.eligible && (
            <button
              onClick={onClose}
              style={styles.closeOnlyButton}
            >
              Close
            </button>
          )}
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
  content: {
    padding: '24px',
  },
  bookingInfo: {
    padding: '20px',
    background: COLORS.light,
    borderRadius: '12px',
    marginBottom: '24px',
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
  eligibleBox: {
    padding: '20px',
    background: '#f0fdf4',
    border: '2px solid #22c55e',
    borderRadius: '12px',
    marginBottom: '24px',
  },
  ineligibleBox: {
    padding: '20px',
    background: '#fef2f2',
    border: '2px solid #ef4444',
    borderRadius: '12px',
    marginBottom: '24px',
  },
  eligibilityTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '16px',
  },
  refundDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '16px',
  },
  refundRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
  },
  refundAmount: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#22c55e',
  },
  policyText: {
    fontSize: '14px',
    color: '#166534',
    margin: 0,
  },
  ineligibleReason: {
    fontSize: '14px',
    color: '#991b1b',
    margin: 0,
  },
  formGroup: {
    marginBottom: '24px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '8px',
  },
  textarea: {
    width: '100%',
    padding: '12px',
    border: `2px solid ${COLORS.border}`,
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
    resize: 'vertical',
  },
  errorBox: {
    padding: '12px',
    background: '#fee',
    border: `1px solid ${COLORS.danger}`,
    borderRadius: '8px',
    color: COLORS.danger,
    fontSize: '14px',
    marginBottom: '16px',
  },
  warningBox: {
    padding: '16px',
    background: '#fffbeb',
    border: '1px solid #f59e0b',
    borderRadius: '8px',
    marginBottom: '24px',
    fontSize: '14px',
    color: '#92400e',
  },
  actions: {
    display: 'flex',
    gap: '12px',
  },
  cancelButton: {
    flex: 1,
    padding: '14px',
    background: 'white',
    border: `2px solid ${COLORS.border}`,
    color: '#666',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  refundButton: {
    flex: 1,
    padding: '14px',
    background: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  closeOnlyButton: {
    width: '100%',
    padding: '14px',
    background: COLORS.primary,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export default RefundModal;