//src/_test_/EmailVerification.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EmailVerification from '../components/EmailVerification';
import { useAuth } from '../context/AuthContext';
import { sendEmailVerification } from 'firebase/auth';
import userEvent from '@testing-library/user-event';

// --- Mock Firebase sendEmailVerification ---
// Replace the real Firebase function with a mock to avoid network calls
jest.mock('firebase/auth', () => ({
  sendEmailVerification: jest.fn(),
}));

// --- Mock useAuth Context ---
// Mock the AuthContext to control currentUser in tests
jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('EmailVerification Component', () => {
  const mockCurrentUser = { emailVerified: false }; // Initial mock user

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
    useAuth.mockReturnValue({ currentUser: mockCurrentUser }); // Default return value
  });

  // Test 1: Component renders banner and resend button
  it('renders banner and button', () => {
    render(<EmailVerification />);
    expect(screen.getByText(/please verify your email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /resend email/i })).toBeInTheDocument();
  });

  // Test 2: Component does not render if email is already verified
  it('does not render if email is verified', () => {
    useAuth.mockReturnValue({ currentUser: { emailVerified: true } });
    render(<EmailVerification />);
    expect(screen.queryByText(/please verify your email/i)).toBeNull();
  });

  // Test 3: Shows success message after sending verification email
  it('shows success message after sending verification email', async () => {
    sendEmailVerification.mockResolvedValueOnce(); // Mock successful API call
    render(<EmailVerification />);
    const button = screen.getByRole('button', { name: /resend email/i });
    userEvent.click(button);

    // Wait for async operation and verify success behavior
    await waitFor(() => {
      expect(sendEmailVerification).toHaveBeenCalledWith(mockCurrentUser);
      expect(screen.getByText(/verification email sent/i)).toBeInTheDocument();
    });
  });

  // Test 4: Shows error message if sending verification email fails
  it('shows error message if sending fails', async () => {
    sendEmailVerification.mockRejectedValueOnce(new Error('Failed')); // Mock failure
    render(<EmailVerification />);
    const button = screen.getByRole('button', { name: /resend email/i });
    userEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/failed to send email/i)).toBeInTheDocument();
    });
  });

  // Test 5: Button is disabled while sending email
  it('button is disabled while sending', async () => {
    let resolvePromise;
    const mockPromise = new Promise((resolve) => {
      resolvePromise = resolve; // Capture resolve function
    });

    sendEmailVerification.mockReturnValueOnce(mockPromise); // Mock async call

    render(<EmailVerification />);
    const button = screen.getByRole('button', { name: /resend email/i });

    await userEvent.click(button); // Trigger sending

    // Button should be disabled while sending
    await waitFor(() => {
      expect(button).toBeDisabled();
    });

    // Resolve promise to simulate API completion
    resolvePromise();

    // Button should be enabled after sending completes
    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });
});
