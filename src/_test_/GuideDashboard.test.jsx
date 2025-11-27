// src/_test_/GuideDashboard.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import GuideDashboard from '../components/GuideDashboard.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { tourService } from '../services/firestoreService';

// --- Mock Firebase AuthContext and Firestore service ---
// Replace the real useAuth hook with a mock to control currentUser
jest.mock('../context/AuthContext.jsx', () => ({
  useAuth: jest.fn(),
}));

// Mock tourService.getGuideTours to control the returned tours
jest.mock('../services/firestoreService', () => ({
  tourService: {
    getGuideTours: jest.fn(),
  },
}));

describe('GuideDashboard Component', () => {
  beforeEach(() => {
    // Clear all previous mock calls before each test
    jest.clearAllMocks();
  });

  // Test 1: Verify that loading state is displayed initially
  it('renders loading state initially', () => {
    // Mock a logged-in guide user
    useAuth.mockReturnValue({ currentUser: { uid: '123', role: 'guide' } });
    // Mock getGuideTours to return an empty array
    tourService.getGuideTours.mockResolvedValueOnce([]);
    
    render(<GuideDashboard />);
    
    // Check that the loading message appears
    expect(screen.getByText(/Loading guide dashboard/i)).toBeInTheDocument();
  });

  // Test 2: Verify that tours are rendered after fetching
  it('renders tours after fetch', async () => {
    const mockTours = [
      { tourId: '1', title: 'Tour A', description: 'Desc A', location: 'City A', price: 100, averageRating: 4.5, totalReviews: 10 },
      { tourId: '2', title: 'Tour B', description: 'Desc B', location: 'City B', price: 200, averageRating: 4.0, totalReviews: 5 },
    ];

    // Mock a logged-in guide user
    useAuth.mockReturnValue({ currentUser: { uid: '123', role: 'guide' } });
    // Mock getGuideTours to return the mock tours
    tourService.getGuideTours.mockResolvedValueOnce(mockTours);

    render(<GuideDashboard />);

    // Wait for each tour title to appear in the DOM
    for (const tour of mockTours) {
      expect(await screen.findByText(tour.title)).toBeInTheDocument();
    }
  });

  // Test 3: Verify "no tours" message is shown if the guide has no tours
  it('renders "no tours" message when none exist', async () => {
    // Mock a logged-in guide user
    useAuth.mockReturnValue({ currentUser: { uid: '123', role: 'guide' } });
    // Mock getGuideTours to return an empty array
    tourService.getGuideTours.mockResolvedValueOnce([]);

    render(<GuideDashboard />);

    // Check that the "no tours" message appears
    expect(await screen.findByText(/You haven't listed any tours yet/i)).toBeInTheDocument();
  });
});
