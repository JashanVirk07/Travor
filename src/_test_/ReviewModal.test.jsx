// src/_test_/ReviewModal.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ReviewModal from '../components/ReviewModal';

// Mock reviewService
jest.mock('../services/firestoreService', () => ({
  reviewService: {
    createReview: jest.fn(),
  },
}));

// Mock alert
global.alert = jest.fn();

describe('ReviewModal Component', () => {
  const { reviewService } = require('../services/firestoreService');

  const mockBooking = {
    bookingId: 'booking123',
    tourId: 'tour001',
    guideId: 'guide002',
    travelerId: 'userABC',
    travelerName: 'John Doe',
    tourTitle: 'Amazing Tour',
    startDate: '2024-01-15',
  };

  const mockOnClose = jest.fn();
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders modal content', () => {
    render(
      <ReviewModal
        booking={mockBooking}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    expect(screen.getByText('Leave a Review')).toBeInTheDocument();
    expect(screen.getByText('Amazing Tour')).toBeInTheDocument();
  });

  test('allows rating selection', () => {
    render(
      <ReviewModal
        booking={mockBooking}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    const stars = screen.getAllByText('★');
    fireEvent.click(stars[2]); // select rating 3

    // No direct rating text, but we can infer by style changes
    expect(stars[2].style.color).toBe('rgb(255, 193, 7)'); // active yellow star
  });

  test('allows writing a comment', () => {
    render(
      <ReviewModal
        booking={mockBooking}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    const textarea = screen.getByPlaceholderText(
      'Share your experience with this tour...'
    );

    fireEvent.change(textarea, { target: { value: 'Great tour!' } });
    expect(textarea.value).toBe('Great tour!');
  });

  test('submits review successfully', async () => {
    reviewService.createReview.mockResolvedValueOnce({ ok: true });

    render(
      <ReviewModal
        booking={mockBooking}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    // Set rating
    fireEvent.click(screen.getAllByText('★')[4]); // 5 stars

    // Set comment
    fireEvent.change(
      screen.getByPlaceholderText('Share your experience with this tour...'),
      { target: { value: 'Excellent experience!' } }
    );

    // Submit
    fireEvent.click(screen.getByText('Submit Review'));

    await waitFor(() => {
      expect(reviewService.createReview).toHaveBeenCalledWith('booking123', {
        tourId: 'tour001',
        guideId: 'guide002',
        travelerId: 'userABC',
        travelerName: 'John Doe',
        rating: 5,
        comment: 'Excellent experience!',
      });
    });

    expect(global.alert).toHaveBeenCalledWith(
      '✅ Review submitted successfully!'
    );
    expect(mockOnSuccess).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('shows error alert when API fails', async () => {
    reviewService.createReview.mockRejectedValueOnce(
      new Error('Network error')
    );

    render(
      <ReviewModal
        booking={mockBooking}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    fireEvent.change(
      screen.getByPlaceholderText('Share your experience with this tour...'),
      { target: { value: 'Not good' } }
    );

    fireEvent.click(screen.getByText('Submit Review'));

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith(
        '❌ Failed to submit review: Network error'
      );
    });

    expect(mockOnSuccess).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });
});
