import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SetupButton from '../components/SetupButton';
import { setupFirestoreData } from '../utils/setupFirestore.js';

// Mock the setupFirestoreData utility function
jest.mock('../utils/setupFirestore.js', () => ({
  setupFirestoreData: jest.fn(),
}));

describe('SetupButton Component', () => {
  let confirmSpy;
  let alertSpy;

  beforeEach(() => {
    // Mock window.confirm to always return true
    confirmSpy = jest.spyOn(window, 'confirm').mockImplementation(() => true);
    // Mock window.alert to prevent actual alerts
    alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Restore original window.confirm and window.alert
    confirmSpy.mockRestore();
    alertSpy.mockRestore();
  });

  test('renders button correctly', () => {
    // Render the SetupButton component
    render(<SetupButton />);
    // Check that the button is in the document
    expect(screen.getByRole('button', { name: /setup database/i })).toBeInTheDocument();
  });

  test('clicking button calls confirm', async () => {
    // Render the component
    render(<SetupButton />);
    // Simulate a button click
    fireEvent.click(screen.getByRole('button', { name: /setup database/i }));
    // Expect window.confirm to be called with the correct message
    expect(window.confirm).toHaveBeenCalledWith(
      'This will populate your Firestore with sample data. Continue?'
    );
  });

  test('successful setup calls setupFirestoreData and shows success alert', async () => {
    // Mock successful Firestore setup
    setupFirestoreData.mockResolvedValueOnce();
    render(<SetupButton />);

    // Simulate clicking the setup button
    fireEvent.click(screen.getByRole('button', { name: /setup database/i }));

    // Wait for async actions and check results
    await waitFor(() => {
      // setupFirestoreData should be called once
      expect(setupFirestoreData).toHaveBeenCalledTimes(1);
      // Success alert should be shown
      expect(window.alert).toHaveBeenCalledWith('✅ Database setup complete!');
    });
  });

  test('setup error shows error alert', async () => {
    // Mock setupFirestoreData to reject with an error
    const error = new Error('Test failure');
    setupFirestoreData.mockRejectedValueOnce(error);
    render(<SetupButton />);

    // Click the button to trigger setup
    fireEvent.click(screen.getByRole('button', { name: /setup database/i }));

    // Wait for async error handling
    await waitFor(() => {
      expect(setupFirestoreData).toHaveBeenCalledTimes(1);
      // Check that error alert is shown with error message
      expect(window.alert).toHaveBeenCalledWith('❌ Error: ' + error.message);
    });
  });

  test('button is disabled while loading', async () => {
    // Mock a delayed setup function to simulate loading
    setupFirestoreData.mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );
    render(<SetupButton />);

    const button = screen.getByRole('button', { name: /setup database/i });
    fireEvent.click(button);

    // Immediately after click, button should be disabled and show loading text
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent(/setting up/i);

    // After promise resolves, button should be enabled again
    await waitFor(() => expect(button).not.toBeDisabled());
  });
});
