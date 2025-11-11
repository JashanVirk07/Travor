import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireGuide = false, requireVerified = false }) => {
  const { currentUser, userProfile, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (requireGuide && userProfile?.role !== 'guide') {
    return <Navigate to="/" />;
  }

  if (requireVerified && userProfile?.verificationStatus !== 'verified') {
    return <Navigate to="/verify" />;
  }

  return children;
};

export default ProtectedRoute;