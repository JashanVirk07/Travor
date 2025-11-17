import React, { useState } from 'react';
import { setupFirestoreData } from '../utils/setupFirestore';
import { COLORS } from '../utils/colors';

const SetupButton = () => {
  const [loading, setLoading] = useState(false);

  const handleSetup = async () => {
    if (window.confirm('This will populate your Firestore with sample data. Continue?')) {
      setLoading(true);
      try {
        await setupFirestoreData();
        alert('✅ Database setup complete!');
      } catch (error) {
        alert('❌ Error: ' + error.message);
      }
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSetup}
      disabled={loading}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '16px 24px',
        background: loading ? '#ccc' : COLORS.primary,
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontWeight: '600',
        cursor: loading ? 'not-allowed' : 'pointer',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: 1000,
        fontSize: '16px',
      }}
    >
      {loading ? '⏳ Setting up...' : '🔧 Setup Database'}
    </button>
  );
};

export default SetupButton;