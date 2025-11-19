import React, { useState, useEffect } from 'react';
import { tourService } from '../services/firestoreService';
import { useAuth } from '../context/AuthContext'; // Assuming you have an AuthContext
import CreateTourModal from './CreateTourModal'; // We'll create this next

function GuideDashboard() {
  const { currentUser } = useAuth(); // Get the current user/guide
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to fetch the guide's tours
  const fetchGuideTours = async (guideId) => {
    setLoading(true);
    try {
      const guideTours = await tourService.getGuideTours(guideId);
      setTours(guideTours);
    } catch (error) {
      console.error('Failed to fetch guide tours:', error);
      // Implement robust error handling (e.g., show a toast/notification)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Ensure we have a logged-in guide before fetching data
    if (currentUser && currentUser.role === 'guide') {
      fetchGuideTours(currentUser.uid);
    }
  }, [currentUser]);

  // Handler to refresh the list after a new tour is created
  const handleTourCreated = () => {
    setIsModalOpen(false);
    if (currentUser) {
      fetchGuideTours(currentUser.uid); // Refresh the list
    }
  };

  if (loading) {
    return <div>Loading guide dashboard and tours...</div>;
  }

  return (
    <div className="guide-dashboard p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Tours ({tours.length})</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          ➕ Create New Tour
        </button>
      </header>

      {/* Tour List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tours.map((tour) => (
          <div key={tour.tourId} className="bg-white p-4 shadow-lg rounded-lg border">
            <h3 className="text-xl font-semibold mb-2">{tour.title}</h3>
            <p className="text-gray-600 mb-3 line-clamp-2">{tour.description}</p>
            <div className="text-sm">
              <p>📍 **Location:** {tour.location}</p>
              <p>💲 **Price:** ${tour.price}</p>
              <p>⭐ **Rating:** {tour.averageRating.toFixed(1)} ({tour.totalReviews} reviews)</p>
            </div>
            {/* Add buttons for Edit/Delete (Update/Soft Delete using tourService) */}
            <button className="text-sm text-indigo-600 mt-3">Edit Details</button>
          </div>
        ))}

        {tours.length === 0 && (
          <p className="text-gray-500 col-span-full text-center py-10">
            You haven't listed any tours yet. Click 'Create New Tour' to get started!
          </p>
        )}
      </div>

      {/* Modal for Tour Creation */}
      <CreateTourModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTourCreated={handleTourCreated}
      />
    </div>
  );
}

export default GuideDashboard;