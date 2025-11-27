// src/_test_/TourReviewFlow.emulator.test.jsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// -------------------- Firebase --------------------
// In-memory arrays to simulate Firestore collections
const toursDB = [];
const reviewsDB = [];

// Mock function to add documents to the appropriate collection
const addDoc = async (collectionRef, data) => {
  if (collectionRef === 'tours') {
    const id = `tour-${toursDB.length + 1}`;
    toursDB.push({ id, ...data });
    return { id };
  } else if (collectionRef === 'reviews') {
    const id = `review-${reviewsDB.length + 1}`;
    reviewsDB.push({ id, ...data });
    return { id };
  }
};

// Mock function to get documents from the appropriate collection
const getDocs = async (collectionRef) => {
  if (collectionRef === 'tours') {
    return { docs: toursDB.map(t => ({ id: t.id, data: () => t })) };
  } else if (collectionRef === 'reviews') {
    return { docs: reviewsDB.map(r => ({ id: r.id, data: () => r })) };
  }
};

// -------------------- Components --------------------
// GuideDashboard displays all tours submitted by the guide
const GuideDashboard = () => {
  const [tours, setTours] = React.useState([]);

  React.useEffect(() => {
    const fetchTours = async () => {
      const snapshot = await getDocs('tours');
      setTours(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    fetchTours();
  }, []);

  return (
    <div>
      Guide Dashboard
      {tours.map(t => (
        <div key={t.id}>{t.title}</div>
      ))}
    </div>
  );
};

// CreateTourModal simulates the tour creation modal
const CreateTourModal = ({ onSubmit }) => (
  <div>
    <span>CreateTourModal</span>
    <button data-testid="submit-tour" onClick={() => onSubmit({ title: 'Test Tour' })}>
      Submit Tour
    </button>
  </div>
);

// ReviewModal simulates submitting a review for a specific tour
const ReviewModal = ({ tourId, onSubmit }) => (
  <div>
    <span>ReviewModal</span>
    <button
      data-testid="submit-review"
      onClick={() => onSubmit({ comment: 'Great tour!', tourId })}
    >
      Submit Review
    </button>
  </div>
);

// DestinationsPage displays all reviews for a specific tour
const DestinationsPage = ({ tourId }) => {
  const [reviews, setReviews] = React.useState([]);

  React.useEffect(() => {
    const fetchReviews = async () => {
      const snapshot = await getDocs('reviews');
      setReviews(snapshot.docs.map(d => d.data()).filter(r => r.tourId === tourId));
    };
    fetchReviews();
  }, [tourId]);

  return (
    <div>
      DestinationsPage
      {reviews.map((r, i) => (
        <div key={i}>{r.comment}</div>
      ))}
    </div>
  );
};

// -------------------- Full Flow Test --------------------
describe('Tour & Review Integration Flow', () => {
  test('Guide creates tour -> Dashboard shows it -> user adds review -> DestinationsPage shows review', async () => {
    let tourId;

    // 1️⃣ Submit tour
    render(<CreateTourModal onSubmit={async (tour) => { const doc = await addDoc('tours', tour); tourId = doc.id; }} />);
    fireEvent.click(screen.getByTestId('submit-tour'));

    // 2️⃣ Check if the Dashboard displays the tour
    render(<GuideDashboard />);
    await waitFor(() => expect(screen.getByText('Test Tour')).toBeInTheDocument());

    // 3️⃣ Submit a review for the created tour
    render(<ReviewModal tourId={tourId} onSubmit={async (review) => addDoc('reviews', review)} />);
    fireEvent.click(screen.getByTestId('submit-review'));

    // 4️⃣ Check if the DestinationsPage displays the review
    render(<DestinationsPage tourId={tourId} />);
    await waitFor(() => expect(screen.getByText('Great tour!')).toBeInTheDocument());
  });
});
