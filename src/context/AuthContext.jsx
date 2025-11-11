// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  db, 
  storage 
} from '../firebase';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL,
  deleteObject 
} from 'firebase/storage';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // NEW: page state
  const [currentPage, setCurrentPage] = useState('home');

  // Helper: clear error
  const clearError = () => setAuthError(null);
  

  // Enhanced error messages
  const getErrorMessage = (error) => {
    const errorMessages = {
      'auth/email-already-in-use': 'This email is already registered. Please sign in instead.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/operation-not-allowed': 'Email/password accounts are not enabled. Please contact support.',
      'auth/weak-password': 'Password should be at least 6 characters long.',
      'auth/user-disabled': 'This account has been disabled. Please contact support.',
      'auth/user-not-found': 'No account found with this email address.',
      'auth/wrong-password': 'Incorrect password. Please try again.',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
      'auth/network-request-failed': 'Network error. Please check your connection.',
      'auth/requires-recent-login': 'Please log in again to perform this action.',
    };
    
    return errorMessages[error.code] || error.message || 'An error occurred. Please try again.';
  };

  // Register new user
  const register = async (email, password, userData) => {
    try {
      setAuthError(null);
      
      // Create auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Send email verification
      await sendEmailVerification(user);

      // Determine membership dates
      const now = new Date();
      const isGuide = userData.role === 'guide';
      const membershipStartDate = now.toISOString();
      const membershipEndDate = new Date(now.setFullYear(now.getFullYear() + 1)).toISOString();

      // Create user profile in Firestore
      const userDocData = {
        uid: user.uid,
        email: user.email,
        name: userData.name || '',
        role: userData.role || 'traveler',
        
        // Profile fields
        phone: userData.phone || '',
        bio: userData.bio || '',
        languages: userData.languages || [],
        location: userData.location || '',
        
        // Verification status
        emailVerified: false,
        verificationStatus: 'pending',
        verificationDocuments: [],
        
        // Membership fields (for guides)
        ...(isGuide && {
          membershipStatus: 'trial', // trial, active, expired
          membershipType: 'basic', // basic, premium
          membershipStartDate,
          membershipEndDate,
          isFirstYearFree: true,
          registrationFeePaid: false,
          featuredListing: false,
          
          // Guide-specific fields
          certifications: [],
          rating: 0,
          reviewCount: 0,
          toursCompleted: 0,
          profileImages: [],
          videoIntroUrl: '',
        }),
        
        // Timestamps
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        signupDate: membershipStartDate,
      };

      await setDoc(doc(db, 'users', user.uid), userDocData);

      // If guide, create membership record
      if (isGuide) {
        await setDoc(doc(db, 'memberships', user.uid), {
          userId: user.uid,
          type: 'basic',
          status: 'trial',
          startDate: membershipStartDate,
          endDate: membershipEndDate,
          isFirstYearFree: true,
          privileges: {
            featuredListing: false,
            prioritySupport: false,
            advancedAnalytics: false,
          },
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      return { 
        success: true, 
        user: userCredential.user,
        message: 'Registration successful! Please check your email to verify your account.' 
      };

    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setAuthError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setAuthError(null);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Update last login time
      await updateDoc(doc(db, 'users', userCredential.user.uid), {
        lastLoginAt: serverTimestamp()
      });

      return { 
        success: true, 
        user: userCredential.user 
      };

    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setAuthError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      setAuthError(null);
      await signOut(auth);
      setCurrentUser(null);
      setUserProfile(null);
      return { success: true };
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setAuthError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      setAuthError(null);
      await sendPasswordResetEmail(auth, email);
      return { 
        success: true, 
        message: 'Password reset email sent. Please check your inbox.' 
      };
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setAuthError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Update user profile
  const updateUserProfile = async (updates) => {
    try {
      setAuthError(null);
      if (!currentUser) throw new Error('No user logged in');

      const userRef = doc(db, 'users', currentUser.uid);
      
      // Update Firestore
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });

      // Update auth profile if name changed
      if (updates.name && updates.name !== currentUser.displayName) {
        await updateProfile(currentUser, {
          displayName: updates.name
        });
      }

      // Refresh user profile
      await fetchUserProfile(currentUser.uid);

      return { success: true, message: 'Profile updated successfully' };

    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setAuthError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Upload profile image
  const uploadProfileImage = async (file) => {
    try {
      setAuthError(null);
      if (!currentUser) throw new Error('No user logged in');

      const fileExtension = file.name.split('.').pop();
      const fileName = `profile_${currentUser.uid}_${Date.now()}.${fileExtension}`;
      const storageRef = ref(storage, `users/${currentUser.uid}/profile/${fileName}`);

      // Upload file
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      // Update user profile with image URL
      await updateDoc(doc(db, 'users', currentUser.uid), {
        profileImageUrl: downloadURL,
        updatedAt: serverTimestamp()
      });

      // Refresh profile
      await fetchUserProfile(currentUser.uid);

      return { success: true, imageUrl: downloadURL };

    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setAuthError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Upload verification documents
  const uploadVerificationDocuments = async (idFile, selfieFile, certificateFile = null) => {
    try {
      setAuthError(null);
      if (!currentUser) throw new Error('No user logged in');

      const uploadedDocs = [];

      // Upload ID document
      if (idFile) {
        const idRef = ref(storage, `users/${currentUser.uid}/verification/id_${Date.now()}`);
        await uploadBytes(idRef, idFile);
        const idUrl = await getDownloadURL(idRef);
        uploadedDocs.push({ type: 'id', url: idUrl, uploadedAt: new Date().toISOString() });
      }

      // Upload selfie
      if (selfieFile) {
        const selfieRef = ref(storage, `users/${currentUser.uid}/verification/selfie_${Date.now()}`);
        await uploadBytes(selfieRef, selfieFile);
        const selfieUrl = await getDownloadURL(selfieRef);
        uploadedDocs.push({ type: 'selfie', url: selfieUrl, uploadedAt: new Date().toISOString() });
      }

      // Upload police certificate (for guides)
      if (certificateFile && userProfile?.role === 'guide') {
        const certRef = ref(storage, `users/${currentUser.uid}/verification/police_cert_${Date.now()}`);
        await uploadBytes(certRef, certificateFile);
        const certUrl = await getDownloadURL(certRef);
        uploadedDocs.push({ type: 'police_certificate', url: certUrl, uploadedAt: new Date().toISOString() });
      }

      // Update user profile
      await updateDoc(doc(db, 'users', currentUser.uid), {
        verificationDocuments: uploadedDocs,
        verificationStatus: 'pending',
        verificationSubmittedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      await fetchUserProfile(currentUser.uid);

      return { 
        success: true, 
        message: 'Verification documents uploaded successfully. Admin will review them shortly.' 
      };

    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setAuthError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Fetch user profile from Firestore
  const fetchUserProfile = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const profile = { uid, ...userDoc.data() };
        setUserProfile(profile);
        return profile;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Check if user is guide
  const isGuide = () => {
    return userProfile?.role === 'guide';
  };

  // Check if user is traveler
  const isTraveler = () => {
    return userProfile?.role === 'traveler';
  };

  // Check if user is admin
  const isAdmin = () => {
    return userProfile?.role === 'admin';
  };

  // Check membership status
  const checkMembershipStatus = () => {
    if (!isGuide()) return null;

    const now = new Date();
    const endDate = userProfile?.membershipEndDate ? new Date(userProfile.membershipEndDate) : null;

    if (!endDate) return 'expired';

    if (now > endDate) {
      return 'expired';
    }

    if (userProfile?.membershipStatus === 'trial' && userProfile?.isFirstYearFree) {
      return 'trial';
    }

    return 'active';
  };

  // Monitor auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        await fetchUserProfile(user.uid);
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    // State
    currentUser,
    userProfile,
    loading,
    authError,
    currentPage,
    setCurrentPage,
    
    // Auth methods
    register,
    login,
    logout,
    resetPassword,
    
    // Profile methods
    updateUserProfile,
    uploadProfileImage,
    uploadVerificationDocuments,
    fetchUserProfile,
    
    // Helper methods
    isGuide,
    isTraveler,
    isAdmin,
    checkMembershipStatus,
    
    // Clear error
    clearError: () => setAuthError(null),
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;