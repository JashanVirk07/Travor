import React, { useState } from 'react';
import { tourService } from '../services/firestoreService';
import { useAuth } from '../context/AuthContext';

function CreateTourModal({ isOpen, onClose, onTourCreated }) {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    duration: '',
    images: [], // Simplified for now
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser || currentUser.role !== 'guide') {
      setError('You must be a guide to create a tour.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const newTourData = {
        ...formData,
        // Convert price to number
        price: parseFloat(formData.price),
        // Add guideId from the current user
        guideId: currentUser.uid, 
        // Placeholder images (actual implementation requires Firebase Storage)
        images: ['https://via.placeholder.com/600x400.png?text=Tour+Image'],
    };

    try {
      const result = await tourService.createTour(currentUser.uid, newTourData);
      
      if (result.success) {
        // Success notification/alert here
        alert(`Tour created successfully with ID: ${result.tourId}`);
        // Clear form and close modal
        setFormData({ title: '', description: '', price: '', location: '', duration: '', images: [] });
        onTourCreated(); // Signal dashboard to refresh list
      } else {
         throw new Error("Creation failed without a specific error message.");
      }

    } catch (err) {
      console.error('Tour creation error:', err);
      setError(err.message || 'Failed to create tour. Please check your inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Create New Tour</h2>
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full border p-2 rounded" />
          </div>
          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required rows="3" className="w-full border p-2 rounded"></textarea>
          </div>
          {/* Price & Duration (Inline) */}
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Price ($)</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} required min="1" className="w-full border p-2 rounded" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Duration (e.g., 3 days)</label>
              <input type="text" name="duration" value={formData.duration} onChange={handleChange} required className="w-full border p-2 rounded" />
            </div>
          </div>
          {/* Location */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Location</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} required className="w-full border p-2 rounded" />
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <footer className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 rounded text-white ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isSubmitting ? 'Creating...' : 'Publish Tour'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}

export default CreateTourModal;