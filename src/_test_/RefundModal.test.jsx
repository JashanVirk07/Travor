// src/_test_/RefundModal.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RefundModal from '../components/RefundModal';
import { enhancedPaymentService } from '../services/paymentService';
import { bookingService } from '../services/firestoreService';

// Mock external services
jest.mock('../services/paymentService', () => ({
  enhancedPaymentService: {
    checkRefundEligibility: jest.fn(),
  },
}));

jest.mock('../services/firestoreService', () => ({
  bookingService: {
    requestRefund: jest.fn(),
  },
}));

describe('RefundModal', () => {
  const mockBooking = {
    id: 'booking-123',
    tourDetails: { title: 'Amazing Tour' },
    startDate: new Date(),
    totalPrice: 200,
  };

  const onClose = jest.fn();
  const onRefundSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('does not render when isOpen is false', () => {
    const { container } = render(
      <RefundModal
        isOpen={false}
        onClose={onClose}
        booking={mockBooking}
        onRefundSuccess={onRefundSuccess}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  test('renders modal and calls eligibility check when open', async () => {
    enhancedPaymentService.checkRefundEligibility.mockResolvedValue({
      eligible: true,
      refundAmount: 100,
      refundPercentage: 50,
      hoursUntilBooking: 48,
      message: 'You are eligible for a 50% refund',
    });

    render(
      <RefundModal
        isOpen={true}
        onClose={onClose}
        booking={mockBooking}
        onRefundSuccess={onRefundSuccess}
      />
    );

    expect(screen.getByText(/Request Refund/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(enhancedPaymentService.checkRefundEligibility).toHaveBeenCalledWith('booking-123');
      expect(screen.getByText(/Refund Available/i)).toBeInTheDocument();
      expect(screen.getByText(/\$100\.00/)).toBeInTheDocument();
    });
  });

  test('shows error if refund reason is empty', async () => {
    enhancedPaymentService.checkRefundEligibility.mockResolvedValue({ eligible: true });

    render(
      <RefundModal
        isOpen={true}
        onClose={onClose}
        booking={mockBooking}
        onRefundSuccess={onRefundSuccess}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/Submit Request/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Submit Request/i));

    expect(await screen.findByText(/Please provide a reason for cancellation/i)).toBeInTheDocument();
  });

  test('submits refund request successfully', async () => {
    enhancedPaymentService.checkRefundEligibility.mockResolvedValue({ eligible: true });
    bookingService.requestRefund.mockResolvedValue({});

    render(
      <RefundModal
        isOpen={true}
        onClose={onClose}
        booking={mockBooking}
        onRefundSuccess={onRefundSuccess}
      />
    );

    const textarea = await screen.findByPlaceholderText(/Please tell us why you're cancelling/i);
    fireEvent.change(textarea, { target: { value: 'Change of plans' } });

    fireEvent.click(screen.getByText(/Submit Request/i));

    await waitFor(() => {
      expect(bookingService.requestRefund).toHaveBeenCalledWith('booking-123', 'Change of plans');
      expect(onRefundSuccess).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });

  test('shows error when requestRefund fails', async () => {
    enhancedPaymentService.checkRefundEligibility.mockResolvedValue({ eligible: true });
    bookingService.requestRefund.mockRejectedValue(new Error('Network error'));

    render(
      <RefundModal
        isOpen={true}
        onClose={onClose}
        booking={mockBooking}
        onRefundSuccess={onRefundSuccess}
      />
    );

    const textarea = await screen.findByPlaceholderText(/Please tell us why you're cancelling/i);
    fireEvent.change(textarea, { target: { value: 'Change of plans' } });

    fireEvent.click(screen.getByText(/Submit Request/i));

    expect(await screen.findByText(/Network error/i)).toBeInTheDocument();
  });
});
