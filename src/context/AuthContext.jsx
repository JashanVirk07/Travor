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
  
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setAuthError(null);

      if (user) {
        await fetchUserProfile(user.uid);
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const clearError = () => {
    setAuthError(null);
  };

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

  // === HELPER: Internal Upload Function ===
  const uploadFile = async (file, path) => {
    if (!file) return null;
    try {
        const storageRef = ref(storage, path);
        const snapshot = await uploadBytes(storageRef, file);
        return await getDownloadURL(snapshot.ref);
    } catch (error) {
        console.error("File upload error:", error);
        throw error;
    }
  };

  // === UPDATED: SIGNUP WITH FILE SUPPORT ===
  const signup = async (email, password, userData, files = {}) => {
    try {
      setAuthError(null);

      // 1. Create Auth User
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Upload Files (Profile, GovID, License)
      let profileImageUrl = '';
      let govIdUrl = '';
      let licenseUrl = '';

      if (files.profileImage) {
        profileImageUrl = await uploadFile(files.profileImage, `profile-images/${user.uid}_profile`);
      }
      
      // Only upload verification docs if provided (Guide flow)
      if (files.govId) {
        govIdUrl = await uploadFile(files.govId, `verification/${user.uid}_govId`);
      }
      if (files.license) {
        licenseUrl = await uploadFile(files.license, `verification/${user.uid}_license`);
      }

      // 3. Create Firestore Document
      const userProfileData = {
        email: user.email,
        name: userData.name || userData.fullName || '',
        fullName: userData.name || userData.fullName || '',
        role: userData.role || 'traveler',
        phone: userData.phone || '',
        location: userData.location || '',
        bio: userData.bio || '',
        languages: userData.languages || [],
        
        // Images & Verification
        profileImageUrl: profileImageUrl || '',
        verificationDocuments: {
            govIdUrl: govIdUrl || '',
            licenseUrl: licenseUrl || '',
            submittedAt: new Date()
        },
        certifications: [], // Initialize array for optional certs
        
        isEmailVerified: false,
        isVerified: false, // Guides start unverified
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: new Date(),
      };

      // Save to 'users'
      await setDoc(doc(db, 'users', user.uid), userProfileData);
      
      // If Guide, sync to 'guides' collection
      if (userData.role === 'guide') {
          await setDoc(doc(db, 'guides', user.uid), {
              ...userProfileData,
              userId: user.uid,
              rating: 0,
              reviewCount: 0
          });
      }

      setUserProfile({ id: user.uid, ...userProfileData });

      return { success: true, user, profile: userProfileData };
    } catch (error) {
      console.error('Error signing up:', error);
      setAuthError(error.message);
      return { success: false, error: error.message, code: error.code };
    }
  };

  const login = async (email, password) => {
    try {
      setAuthError(null);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateDoc(doc(db, 'users', user.uid), { lastLoginAt: new Date() });
      await fetchUserProfile(user.uid);

      return { success: true, user };
    } catch (error) {
      console.error('Error logging in:', error);
      setAuthError(error.message);
      let errorMessage = error.message;
      if (error.code === 'auth/user-not-found') errorMessage = 'No account found with this email';
      else if (error.code === 'auth/wrong-password') errorMessage = 'Incorrect password';
      else if (error.code === 'auth/invalid-credential') errorMessage = 'Invalid email or password';
      return { success: false, error: errorMessage, code: error.code };
    }
  };

  const signInWithGoogle = async () => {
    try {
      setAuthError(null);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userDoc = await getDoc(doc(db, 'users', user.uid));

      if (!userDoc.exists()) {
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
        await updateDoc(doc(db, 'users', user.uid), { lastLoginAt: new Date() });
        await fetchUserProfile(user.uid);
      }
      return { success: true, user };
    } catch (error) {
      console.error('Error signing in with Google:', error);
      setAuthError(error.message);
      return { success: false, error: error.message, code: error.code };
    }
  };

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

  const resetPassword = async (email) => {
    try {
      setAuthError(null);
      await sendPasswordResetEmail(auth, email);
      return { success: true, message: 'Password reset email sent' };
    } catch (error) {
      console.error('Error sending password reset email:', error);
      setAuthError(error.message);
      let errorMessage = error.message;
      if (error.code === 'auth/user-not-found') errorMessage = 'No account found with this email';
      return { success: false, error: errorMessage, code: error.code };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      setAuthError(null);
      if (!currentUser) throw new Error('No user logged in');
      const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, newPassword);
      return { success: true, message: 'Password updated successfully' };
    } catch (error) {
      console.error('Error changing password:', error);
      setAuthError(error.message);
      let errorMessage = error.message;
      if (error.code === 'auth/wrong-password') errorMessage = 'Current password is incorrect';
      else if (error.code === 'auth/requires-recent-login') errorMessage = 'Please log out and log in again';
      return { success: false, error: errorMessage, code: error.code };
    }
  };

  const changeEmail = async (newEmail, password) => {
    try {
      setAuthError(null);
      if (!currentUser) throw new Error('No user logged in');
      const credential = EmailAuthProvider.credential(currentUser.email, password);
      await reauthenticateWithCredential(currentUser, credential);
      await updateEmail(currentUser, newEmail);
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
      if (error.code === 'auth/wrong-password') errorMessage = 'Password is incorrect';
      else if (error.code === 'auth/requires-recent-login') errorMessage = 'Please log out and log in again';
      return { success: false, error: errorMessage, code: error.code };
    }
  };

  const uploadProfileImage = async (imageFile) => {
    console.log('=== Starting Image Upload ===');
    try {
      if (!currentUser) throw new Error('No user logged in');
      if (!imageFile.type.startsWith('image/')) throw new Error('File must be an image');
      if (imageFile.size > 5 * 1024 * 1024) throw new Error('Image size must be less than 5MB');
      if (!storage) throw new Error('Firebase Storage is not initialized.');

      if (userProfile?.profileImageUrl) {
        try {
          const oldImageRef = ref(storage, userProfile.profileImageUrl);
          await deleteObject(oldImageRef);
        } catch (error) { console.log('Old image delete skipped'); }
      }

      const timestamp = Date.now();
      const fileExtension = imageFile.name.split('.').pop();
      const filename = `profile_${currentUser.uid}_${timestamp}.${fileExtension}`;
      const storagePath = `profile-images/${filename}`;
      const storageRef = ref(storage, storagePath);
      const snapshot = await uploadBytes(storageRef, imageFile);
      const downloadURL = await getDownloadURL(snapshot.ref);

      return { success: true, imageUrl: downloadURL, message: 'Image uploaded successfully' };
    } catch (error) {
      console.error('=== Upload Failed ===', error);
      return { success: false, error: error.message };
    }
  };

  const updateUserProfile = async (updates) => {
    try {
      if (!currentUser) throw new Error('No user logged in');
      if (updates.email) throw new Error('Email cannot be updated through profile update.');

      const updateData = { ...updates, updatedAt: new Date() };
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, updateData);

      // If guide, sync guides collection
      if (userProfile?.role === 'guide') {
          const guideRef = doc(db, 'guides', currentUser.uid);
          // We try to update, but use set with merge if it doesn't exist just in case
          try {
            await updateDoc(guideRef, updateData);
          } catch(e) {
             // If guide doc missing, we might handle differently, but usually it exists
             console.log("Guide doc update sync warning:", e);
          }
      }

      setUserProfile((prev) => ({ ...prev, ...updateData }));
      return { success: true, message: 'Profile updated successfully' };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, error: error.message };
    }
  };

  const refreshUserProfile = async () => {
    if (currentUser) return await fetchUserProfile(currentUser.uid);
    return { success: false, error: 'No user logged in' };
  };

  const deleteAccount = async (password) => {
    try {
      setAuthError(null);
      if (!currentUser) throw new Error('No user logged in');
      const credential = EmailAuthProvider.credential(currentUser.email, password);
      await reauthenticateWithCredential(currentUser, credential);
      const userId = currentUser.uid;

      if (userProfile?.profileImageUrl) {
        try {
          const imageRef = ref(storage, userProfile.profileImageUrl);
          await deleteObject(imageRef);
        } catch (error) {}
      }

      await deleteDoc(doc(db, 'users', userId));
      await deleteUser(currentUser);
      setUserProfile(null);
      return { success: true, message: 'Account deleted successfully' };
    } catch (error) {
      console.error('Error deleting account:', error);
      setAuthError(error.message);
      let errorMessage = error.message;
      if (error.code === 'auth/wrong-password') errorMessage = 'Password is incorrect';
      else if (error.code === 'auth/requires-recent-login') errorMessage = 'Please log out and log in again';
      return { success: false, error: errorMessage, code: error.code };
    }
  };

  const isAuthenticated = () => !!currentUser;
  const isGuide = () => userProfile?.role === 'guide';
  const isTraveler = () => userProfile?.role === 'traveler';

  // Data Fetching Helpers
  const getUserBookings = async () => {
    try {
      if (!currentUser) throw new Error('No user logged in');
      const bookingsQuery = query(collection(db, 'bookings'), where('userId', '==', currentUser.uid));
      const snapshot = await getDocs(bookingsQuery);
      const bookings = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return { success: true, bookings };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const getUserFavorites = async () => {
    try {
      if (!currentUser) throw new Error('No user logged in');
      const favoritesQuery = query(collection(db, 'favorites'), where('userId', '==', currentUser.uid));
      const snapshot = await getDocs(favoritesQuery);
      const favorites = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return { success: true, favorites };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const getUserReviews = async () => {
    try {
      if (!currentUser) throw new Error('No user logged in');
      const reviewsQuery = query(collection(db, 'reviews'), where('userId', '==', currentUser.uid));
      const snapshot = await getDocs(reviewsQuery);
      const reviews = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return { success: true, reviews };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    authError,
    currentPage,
    setCurrentPage,
    signup, // Updated to accept files
    login,
    signInWithGoogle,
    logout,
    resetPassword,
    changePassword,
    changeEmail,
    clearError,
    updateUserProfile,
    uploadProfileImage,
    refreshUserProfile,
    fetchUserProfile,
    deleteAccount,
    isAuthenticated,
    isGuide,
    isTraveler,
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