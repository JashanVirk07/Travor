// src/components/ReviewModal.jsx
import React, { useState } from 'react';
import { COLORS } from '../utils/colors';
import { reviewService } from '../services/firestoreService';

const ReviewModal = ({ booking, onClose, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await reviewService.createReview(booking.bookingId, {
        tourId: booking.tourId,
        guideId: booking.guideId,
        travelerId: booking.travelerId,
        travelerName: booking.travelerName,
        rating,
        comment,
      });

      alert('✅ Review submitted successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('❌ Failed to submit review: ' + error.message);
    }

    setSubmitting(false);
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>Leave a Review</h2>
          <button onClick={onClose} style={styles.closeButton}>✕</button>
        </div>

        <div style={styles.tourInfo}>
          <h3 style={styles.tourTitle}>{booking.tourTitle}</h3>
          <p style={styles.tourDate}>
            {booking.startDate ? new Date(booking.startDate).toLocaleDateString() : 'Date N/A'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Rating *</label>
            <div style={styles.starRating}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  style={{
                    ...styles.star,
                    color: star <= rating ? '#ffc107' : '#ddd',
                  }}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Your Review *</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              rows="5"
              style={styles.textarea}
              placeholder="Share your experience with this tour..."
            />
          </div>

          <div style={styles.actions}>
            <button
              type="button"
              onClick={onClose}
              style={styles.cancelButton}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={styles.submitButton}
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
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
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    background: 'white',
    borderRadius: '16px',
    padding: '32px',
    maxWidth: '500px',
    width: '90%',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  modalTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
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
  tourInfo: {
    marginBottom: '24px',
    padding: '16px',
    background: COLORS.light,
    borderRadius: '8px',
  },
  tourTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '4px',
  },
  tourDate: {
    fontSize: '14px',
    color: '#666',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
  },
  starRating: {
    display: 'flex',
    gap: '8px',
  },
  star: {
    background: 'none',
    border: 'none',
    fontSize: '40px',
    cursor: 'pointer',
    padding: '0',
    transition: 'transform 0.2s',
  },
  textarea: {
    padding: '12px',
    border: `2px solid ${COLORS.border}`,
    borderRadius: '8px',
    fontSize: '15px',
    fontFamily: 'inherit',
    outline: 'none',
    resize: 'vertical',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    padding: '12px 24px',
    background: 'transparent',
    border: `2px solid ${COLORS.border}`,
    color: '#666',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  submitButton: {
    padding: '12px 24px',
    background: COLORS.primary,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export default ReviewModal;