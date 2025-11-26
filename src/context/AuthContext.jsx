import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updatePassword,
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  deleteUser,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { auth, db, storage } from '../firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  
  // Navigation state (for page routing)
  const [currentPage, setCurrentPage] = useState('home');

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setAuthError(null);

      if (user) {
        // Fetch user profile from Firestore
        await fetchUserProfile(user.uid);
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // --- NEW FUNCTION: Clear Errors ---
  const clearError = () => {
    setAuthError(null);
  };

  // Fetch user profile from Firestore
  const fetchUserProfile = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const profileData = { id: userDoc.id, ...userDoc.data() };
        setUserProfile(profileData);
        return { success: true, profile: profileData };
      } else {
        console.warn('User profile not found in Firestore');
        return { success: false, error: 'Profile not found' };
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setAuthError(error.message);
      return { success: false, error: error.message };
    }
  };

  // Sign up new user with email and password
  const signup = async (email, password, userData) => {
    try {
      setAuthError(null);

      // Create authentication user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user profile in Firestore
      const userProfileData = {
        email: user.email,
        name: userData.name || userData.fullName || '',
        fullName: userData.name || userData.fullName || '',
        role: userData.role || 'traveler',
        phone: userData.phone || '',
        location: userData.location || '',
        bio: userData.bio || '',
        languages: userData.languages || [],
        profileImageUrl: userData.profileImageUrl || '',
        isEmailVerified: false,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: new Date(),
      };

      await setDoc(doc(db, 'users', user.uid), userProfileData);
      setUserProfile({ id: user.uid, ...userProfileData });

      return { success: true, user, profile: userProfileData };
    } catch (error) {
      console.error('Error signing up:', error);
      setAuthError(error.message);
      return { success: false, error: error.message, code: error.code };
    }
  };

  // Sign in with email and password
  const login = async (email, password) => {
    try {
      setAuthError(null);

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update last login time
      await updateDoc(doc(db, 'users', user.uid), {
        lastLoginAt: new Date(),
      });

      await fetchUserProfile(user.uid);

      return { success: true, user };
    } catch (error) {
      console.error('Error logging in:', error);
      setAuthError(error.message);

      // Provide user-friendly error messages
      let errorMessage = error.message;
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later';
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid email or password';
      }

      return { success: false, error: errorMessage, code: error.code };
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setAuthError(null);

      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user profile exists
      const userDoc = await getDoc(doc(db, 'users', user.uid));

      if (!userDoc.exists()) {
        // Create new profile for Google user
        const userProfileData = {
          email: user.email,
          name: user.displayName || '',
          fullName: user.displayName || '',
          role: 'traveler',
          phone: user.phoneNumber || '',
          location: '',
          bio: '',
          languages: [],
          profileImageUrl: user.photoURL || '',
          isEmailVerified: user.emailVerified,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          lastLoginAt: new Date(),
        };

        await setDoc(doc(db, 'users', user.uid), userProfileData);
        setUserProfile({ id: user.uid, ...userProfileData });
      } else {
        // Update last login for existing user
        await updateDoc(doc(db, 'users', user.uid), {
          lastLoginAt: new Date(),
        });
        await fetchUserProfile(user.uid);
      }

      return { success: true, user };
    } catch (error) {
      console.error('Error signing in with Google:', error);
      setAuthError(error.message);
      return { success: false, error: error.message, code: error.code };
    }
  };

  // Sign out user
  const logout = async () => {
    try {
      setAuthError(null);

      await signOut(auth);
      setUserProfile(null);

      return { success: true };
    } catch (error) {
      console.error('Error logging out:', error);
      setAuthError(error.message);
      return { success: false, error: error.message };
    }
  };

  // Send password reset email
  const resetPassword = async (email) => {
    try {
      setAuthError(null);

      await sendPasswordResetEmail(auth, email);

      return { success: true, message: 'Password reset email sent' };
    } catch (error) {
      console.error('Error sending password reset email:', error);
      setAuthError(error.message);

      let errorMessage = error.message;
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      }

      return { success: false, error: errorMessage, code: error.code };
    }
  };

  // Update user password (requires recent login)
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setAuthError(null);

      if (!currentUser) {
        throw new Error('No user logged in');
      }

      // Reauthenticate user
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword
      );
      await reauthenticateWithCredential(currentUser, credential);

      // Update password
      await updatePassword(currentUser, newPassword);

      return { success: true, message: 'Password updated successfully' };
    } catch (error) {
      console.error('Error changing password:', error);
      setAuthError(error.message);

      let errorMessage = error.message;
      if (error.code === 'auth/wrong-password') {
        errorMessage = 'Current password is incorrect';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'New password is too weak';
      } else if (error.code === 'auth/requires-recent-login') {
        errorMessage = 'Please log out and log in again before changing password';
      }

      return { success: false, error: errorMessage, code: error.code };
    }
  };

  // Update user email (requires recent login)
  const changeEmail = async (newEmail, password) => {
    try {
      setAuthError(null);

      if (!currentUser) {
        throw new Error('No user logged in');
      }

      // Reauthenticate user
      const credential = EmailAuthProvider.credential(currentUser.email, password);
      await reauthenticateWithCredential(currentUser, credential);

      // Update email in Firebase Auth
      await updateEmail(currentUser, newEmail);

      // Update email in Firestore
      await updateDoc(doc(db, 'users', currentUser.uid), {
        email: newEmail,
        updatedAt: new Date(),
      });

      await fetchUserProfile(currentUser.uid);

      return { success: true, message: 'Email updated successfully' };
    } catch (error) {
      console.error('Error changing email:', error);
      setAuthError(error.message);

      let errorMessage = error.message;
      if (error.code === 'auth/wrong-password') {
        errorMessage = 'Password is incorrect';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email is already in use';
      } else if (error.code === 'auth/requires-recent-login') {
        errorMessage = 'Please log out and log in again before changing email';
      }

      return { success: false, error: errorMessage, code: error.code };
    }
  };

  // Upload profile image to Firebase Storage
  const uploadProfileImage = async (imageFile) => {
    console.log('=== Starting Image Upload ===');
    
    try {
      if (!currentUser) {
        throw new Error('No user logged in');
      }

      // Validate file
      if (!imageFile.type.startsWith('image/')) {
        throw new Error('File must be an image');
      }

      if (imageFile.size > 5 * 1024 * 1024) {
        throw new Error('Image size must be less than 5MB');
      }

      // Check if storage is available
      if (!storage) {
        console.error('❌ Storage is not defined!');
        throw new Error('Firebase Storage is not initialized.');
      }

      // Delete old profile image if exists
      if (userProfile?.profileImageUrl) {
        try {
          const oldImageRef = ref(storage, userProfile.profileImageUrl);
          await deleteObject(oldImageRef);
        } catch (error) {
          console.log('⚠ Could not delete old image:', error.message);
        }
      }

      // Create a unique filename
      const timestamp = Date.now();
      const fileExtension = imageFile.name.split('.').pop();
      const filename = `profile_${currentUser.uid}_${timestamp}.${fileExtension}`;
      const storagePath = `profile-images/${filename}`;
      
      const storageRef = ref(storage, storagePath);

      // Upload file
      const snapshot = await uploadBytes(storageRef, imageFile);

      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);

      return {
        success: true,
        imageUrl: downloadURL,
        message: 'Image uploaded successfully',
      };
    } catch (error) {
      console.error('=== Upload Failed ===');
      return {
        success: false,
        error: error.message,
      };
    }
  };

  // Update user profile in Firestore
  const updateUserProfile = async (updates) => {
    try {
      if (!currentUser) {
        throw new Error('No user logged in');
      }

      // Prevent email updates through this function
      if (updates.email) {
        throw new Error('Email cannot be updated through profile update. Use changeEmail instead.');
      }

      // Add updatedAt timestamp
      const updateData = {
        ...updates,
        updatedAt: new Date(),
      };

      // Update in Firestore
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, updateData);

      // Update local state
      setUserProfile((prev) => ({
        ...prev,
        ...updateData,
      }));

      return { success: true, message: 'Profile updated successfully' };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, error: error.message };
    }
  };

  // Refresh user profile from Firestore
  const refreshUserProfile = async () => {
    if (currentUser) {
      return await fetchUserProfile(currentUser.uid);
    }
    return { success: false, error: 'No user logged in' };
  };

  // Delete user account
  const deleteAccount = async (password) => {
    try {
      setAuthError(null);

      if (!currentUser) {
        throw new Error('No user logged in');
      }

      // Reauthenticate user
      const credential = EmailAuthProvider.credential(currentUser.email, password);
      await reauthenticateWithCredential(currentUser, credential);

      const userId = currentUser.uid;

      // Delete profile image from storage if exists
      if (userProfile?.profileImageUrl) {
        try {
          const imageRef = ref(storage, userProfile.profileImageUrl);
          await deleteObject(imageRef);
        } catch (error) {
          console.log('Error deleting profile image:', error);
        }
      }

      // Delete user document from Firestore
      await deleteDoc(doc(db, 'users', userId));

      // Delete authentication user
      await deleteUser(currentUser);

      setUserProfile(null);

      return { success: true, message: 'Account deleted successfully' };
    } catch (error) {
      console.error('Error deleting account:', error);
      setAuthError(error.message);

      let errorMessage = error.message;
      if (error.code === 'auth/wrong-password') {
        errorMessage = 'Password is incorrect';
      } else if (error.code === 'auth/requires-recent-login') {
        errorMessage = 'Please log out and log in again before deleting account';
      }

      return { success: false, error: errorMessage, code: error.code };
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!currentUser;
  };

  // Check if user is a guide
  const isGuide = () => {
    return userProfile?.role === 'guide';
  };

  // Check if user is a traveler
  const isTraveler = () => {
    return userProfile?.role === 'traveler';
  };

  // Get user's bookings
  const getUserBookings = async () => {
    try {
      if (!currentUser) {
        throw new Error('No user logged in');
      }

      const bookingsQuery = query(
        collection(db, 'bookings'),
        where('userId', '==', currentUser.uid)
      );

      const snapshot = await getDocs(bookingsQuery);
      const bookings = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return { success: true, bookings };
    } catch (error) {
      console.error('Error fetching bookings:', error);
      return { success: false, error: error.message };
    }
  };

  // Get user's favorites
  const getUserFavorites = async () => {
    try {
      if (!currentUser) {
        throw new Error('No user logged in');
      }

      const favoritesQuery = query(
        collection(db, 'favorites'),
        where('userId', '==', currentUser.uid)
      );

      const snapshot = await getDocs(favoritesQuery);
      const favorites = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return { success: true, favorites };
    } catch (error) {
      console.error('Error fetching favorites:', error);
      return { success: false, error: error.message };
    }
  };

  // Get user's reviews
  const getUserReviews = async () => {
    try {
      if (!currentUser) {
        throw new Error('No user logged in');
      }

      const reviewsQuery = query(
        collection(db, 'reviews'),
        where('userId', '==', currentUser.uid)
      );

      const snapshot = await getDocs(reviewsQuery);
      const reviews = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return { success: true, reviews };
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    // State
    currentUser,
    userProfile,
    loading,
    authError,
    
    // Navigation state
    currentPage,
    setCurrentPage,

    // Authentication methods
    signup,
    login,
    signInWithGoogle,
    logout,
    resetPassword,
    changePassword,
    changeEmail,
    clearError, // Added this here!

    // Profile management
    updateUserProfile,
    uploadProfileImage,
    refreshUserProfile,
    fetchUserProfile,

    // Account management
    deleteAccount,

    // Utility methods
    isAuthenticated,
    isGuide,
    isTraveler,

    // Data fetching
    getUserBookings,
    getUserFavorites,
    getUserReviews,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;