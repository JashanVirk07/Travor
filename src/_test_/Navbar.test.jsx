// src/_test_/Navbar.test.jsx

// Import testing utilities and component
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Navbar from '../components/Navbar.jsx';
import { useAuth } from '../context/AuthContext.jsx';
// Mock Node APIs for testing environment
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock Firebase modules to prevent actual Firebase calls
jest.mock('../firebase', () => ({
  auth: {}, // Mock auth object
}));

jest.mock('firebase/auth', () => ({
  signOut: jest.fn(), // Mock signOut function
}));

// Mock the AuthContext hook
jest.mock('../context/AuthContext.jsx', () => ({
  useAuth: jest.fn(),
}));

describe('Navbar Component', () => {
  const mockSetCurrentPage = jest.fn(); // Mock function for page navigation

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  // Helper function to render Navbar with mocked AuthContext
  const renderNavbar = (currentUser = null, role = null, currentPage = 'home') => {
    useAuth.mockReturnValue({
      currentPage,               // Current active page
      setCurrentPage: mockSetCurrentPage, // Function to update current page
      currentUser,               // Current logged-in user (if any)
      userProfile: role ? { role } : null, // User role (guide/traveler)
    });
    render(<Navbar />);
  };

  it('renders brand and navigation links', () => {
    renderNavbar();
    // Check brand name is rendered
    expect(screen.getByText('Travor')).toBeInTheDocument();
    // Check main navigation links
    ['Home', 'Destinations', 'Find Guides', 'About'].forEach(link => {
      expect(screen.getByText(link)).toBeInTheDocument();
    });
  });

  it('clicking navigation links calls setCurrentPage', async () => {
    renderNavbar();
    const destinationsLink = screen.getByText('Destinations');
    await userEvent.click(destinationsLink); // Simulate user click
    expect(mockSetCurrentPage).toHaveBeenCalledWith('destinations'); // Verify correct page update
  });

  it('renders login and sign-up buttons when no user is logged in', () => {
    renderNavbar();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  it('renders messages, profile, dashboard, and logout links for logged-in guide', () => {
    renderNavbar({ email: 'test@example.com' }, 'guide');
    // Verify guide-specific links are rendered
    expect(screen.getByText(/Messages/i)).toBeInTheDocument();
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/My Profile/i)).toBeInTheDocument();
    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
  });
});
