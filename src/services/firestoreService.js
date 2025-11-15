import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    signInAnonymously, 
    signInWithCustomToken, 
    setPersistence,
    browserSessionPersistence
} from 'firebase/auth';
import { 
    getFirestore, 
    collection, 
    doc, 
    getDoc, 
    getDocs, 
    setDoc, 
    updateDoc, 
    query, 
    where, 
    orderBy, 
    serverTimestamp, 
    runTransaction, 
    addDoc, 
} from 'firebase/firestore';
import { setLogLevel } from 'firebase/firestore';

// --- FIREBASE INITIALIZATION & AUTHENTICATION ---

// Global variables provided by the Canvas environment
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
// Check for undefined and parse config JSON
let firebaseConfig = {};
if (typeof __firebase_config !== 'undefined' && __firebase_config) {
    try {
        firebaseConfig = JSON.parse(__firebase_config);
    } catch (e) {
        console.error("Error parsing __firebase_config:", e);
    }
}
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Initialize Firebase App and Services
let app;
let db;
let auth;

try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    setLogLevel('error'); // Use 'debug' to see detailed logs in the console

    // Set persistence to session storage
    setPersistence(auth, browserSessionPersistence);

    // Initial sign-in logic
    const signIn = async () => {
        if (initialAuthToken) {
            await signInWithCustomToken(auth, initialAuthToken);
        } else {
            await signInAnonymously(auth);
        }
        console.log("Firebase Auth Initialized. User:", auth.currentUser?.uid || 'Anonymous');
    };
    
    // Ensure sign-in runs only once upon service loading
    signIn();

} catch (e) {
    console.error("Failed to initialize Firebase:", e);
}

/**
 * Helper function to get the correct public collection reference, 
 * respecting multi-tenant security rules.
 * Path: /artifacts/{appId}/public/data/{collectionName}
 * @param {string} collectionName The name of the collection (e.g., 'tours', 'guides').
 * @returns {import('firebase/firestore').CollectionReference}
 */
const getPublicCollectionRef = (collectionName) => {
    if (!db) throw new Error("Firestore not initialized.");
    return collection(db, 'artifacts', appId, 'public', 'data', collectionName);
};


// ============================================
// TOURS SERVICE
// ============================================

export const tourService = {
    // Create a new tour (Guide only)
    createTour: async (guideId, tourData) => {
        try {
            const toursRef = getPublicCollectionRef('tours');
            const docRef = await addDoc(toursRef, {
                ...tourData,
                guideId,
                isActive: true,
                averageRating: 0,
                totalReviews: 0,
                bookings: 0,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
            return { success: true, tourId: docRef.id };
        } catch (error) {
            console.error('Error creating tour:', error);
            throw error;
        }
    },

    // Get all tours for a specific guide
    getGuideTours: async (guideId) => {
        try {
            const q = query(
                getPublicCollectionRef('tours'),
                where('guideId', '==', guideId),
                where('isActive', '==', true),
                // NOTE: Using orderBy here might require Firestore index creation
                orderBy('createdAt', 'desc') 
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(d => ({ tourId: d.id, ...d.data() }));
        } catch (error) {
            console.error('Error fetching guide tours:', error);
            return [];
        }
    },

    // Get single tour by ID
    getTourById: async (tourId) => {
        try {
            const tourRef = doc(getPublicCollectionRef('tours'), tourId);
            const docSnap = await getDoc(tourRef);
            if (docSnap.exists()) {
                return { tourId: docSnap.id, ...docSnap.data() };
            }
            return null;
        } catch (error) {
            console.error('Error fetching tour:', error);
            return null;
        }
    },

    // Get all tours (for travelers browsing) with optional filters
    getAllTours: async (filters = {}) => {
        try {
            // Start with base constraints
            const constraints = [where('isActive', '==', true)];

            if (filters.category) {
                constraints.push(where('category', '==', filters.category));
            }

            if (filters.maxPrice !== undefined) {
                constraints.push(where('price', '<=', filters.maxPrice));
            }

            // Build query. NOTE: orderBy must be used carefully with filters to avoid index issues.
            let q;
            if (constraints.length > 0) {
                // Removed orderBy('createdAt', 'desc') to avoid complex composite index requirement.
                q = query(getPublicCollectionRef('tours'), ...constraints);
            } else {
                q = query(getPublicCollectionRef('tours'));
            }

            const querySnapshot = await getDocs(q);
            let tours = querySnapshot.docs.map(d => ({ tourId: d.id, ...d.data() }));
            
            // Client-side sorting by creation time (desc) since we removed the Firestore orderBy
            tours.sort((a, b) => {
                const aTime = a.createdAt?.seconds || 0;
                const bTime = b.createdAt?.seconds || 0;
                return bTime - aTime;
            });


            // Client-side filter for location (MVP)
            if (filters.location) {
                const locationTerm = filters.location.toLowerCase();
                tours = tours.filter(t => (t.location || '').toLowerCase().includes(locationTerm));
            }

            return tours;
        } catch (error) {
            console.error('Error fetching all tours:', error);
            return [];
        }
    },

    // Search tours by location/title/description (client-side)
    searchTours: async (searchTerm) => {
        try {
            // Re-use getAllTours without filters
            const tours = await tourService.getAllTours({});
            if (!searchTerm) return tours;
            const term = searchTerm.toLowerCase();
            return tours.filter(
                tour =>
                    (tour.title || '').toLowerCase().includes(term) ||
                    (tour.location || '').toLowerCase().includes(term) ||
                    (tour.description || '').toLowerCase().includes(term)
            );
        } catch (error) {
            console.error('Error searching tours:', error);
            return [];
        }
    },

    // Update tour
    updateTour: async (tourId, updateData) => {
        try {
            const tourRef = doc(getPublicCollectionRef('tours'), tourId);
            await updateDoc(tourRef, {
                ...updateData,
                updatedAt: serverTimestamp(),
            });
            return { success: true };
        } catch (error) {
            console.error('Error updating tour:', error);
            throw error;
        }
    },

    // Delete tour (soft delete)
    deleteTour: async (tourId) => {
        try {
            const tourRef = doc(getPublicCollectionRef('tours'), tourId);
            await updateDoc(tourRef, {
                isActive: false,
                updatedAt: serverTimestamp(),
            });
            return { success: true };
        } catch (error) {
            console.error('Error deleting tour:', error);
            throw error;
        }
    },
};

// ============================================
// BOOKINGS SERVICE
// ============================================

export const bookingService = {
    // Create a new booking (transactional to prevent overbooking)
    createBooking: async (bookingData) => {
        try {
            return await runTransaction(db, async (transaction) => {
                const tourRef = doc(getPublicCollectionRef('tours'), bookingData.tourId);
                const tourSnap = await transaction.get(tourRef);

                if (!tourSnap.exists()) {
                    throw new Error('Tour not found');
                }

                const tourData = tourSnap.data();

                // Check if tour is still available
                if (!tourData.isActive) {
                    throw new Error('Tour is no longer available');
                }

                // Prepare bookings query for the same startDate
                const bookingsRef = getPublicCollectionRef('bookings');
                const bookingsQuery = query(
                    bookingsRef,
                    where('tourId', '==', bookingData.tourId),
                    where('startDate', '==', bookingData.startDate),
                    where('status', 'in', ['confirmed', 'pending'])
                );

                // Use getDocs outside the transaction if the query path is not secured by transaction
                const existingBookingsSnap = await getDocs(bookingsQuery);
                const totalParticipants = existingBookingsSnap.docs.reduce(
                    (sum, d) => sum + (d.data().numberOfParticipants || 0),
                    0
                );

                const requested = bookingData.numberOfParticipants || 1;
                const maxParticipants = tourData.maxParticipants || Infinity;

                if (totalParticipants + requested > maxParticipants) {
                    throw new Error('Not enough spots available for this date');
                }

                // Create booking document
                const bookingsCollection = getPublicCollectionRef('bookings');
                const newBooking = {
                    ...bookingData,
                    ticketNumber: `TKT-${Date.now()}`,
                    status: 'pending',
                    paymentStatus: 'pending',
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                };

                // NOTE: addDoc cannot be part of a transaction. We rely on the tour update for atomic checks.
                const bookingDocRef = await addDoc(bookingsCollection, newBooking);

                // Update tour booking count inside transaction
                transaction.update(tourRef, {
                    bookings: (tourData.bookings || 0) + requested,
                    updatedAt: serverTimestamp(),
                });

                return {
                    success: true,
                    bookingId: bookingDocRef.id,
                    ticketNumber: newBooking.ticketNumber,
                };
            });
        } catch (error) {
            console.error('Error creating booking:', error);
            throw error;
        }
    },

    // Get user's bookings
    getUserBookings: async (userId, role = 'traveler') => {
        try {
            const bookingsRef = getPublicCollectionRef('bookings');
            // Assuming guideId and travelerId are stored in bookings
            const field = role === 'guide' ? 'guideId' : 'travelerId';

            const q = query(
                bookingsRef,
                where(field, '==', userId),
                // NOTE: Using orderBy here might require Firestore index creation
                orderBy('startDate', 'desc') 
            );

            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(d => ({ bookingId: d.id, ...d.data() }));
        } catch (error) {
            console.error('Error fetching bookings:', error);
            return [];
        }
    },

    // Get single booking
    getBookingById: async (bookingId) => {
        try {
            const bookingRef = doc(getPublicCollectionRef('bookings'), bookingId);
            const docSnap = await getDoc(bookingRef);
            if (docSnap.exists()) {
                return { bookingId: docSnap.id, ...docSnap.data() };
            }
            return null;
        } catch (error) {
            console.error('Error fetching booking:', error);
            return null;
        }
    },

    // Update booking status
    updateBookingStatus: async (bookingId, status) => {
        try {
            const bookingRef = doc(getPublicCollectionRef('bookings'), bookingId);
            await updateDoc(bookingRef, {
                status,
                updatedAt: serverTimestamp(),
                ...(status === 'completed' && { completedAt: serverTimestamp() }),
            });
            return { success: true };
        } catch (error) {
            console.error('Error updating booking status:', error);
            throw error;
        }
    },

    // Cancel booking
    cancelBooking: async (bookingId) => {
        try {
            const bookingRef = doc(getPublicCollectionRef('bookings'), bookingId);
            await updateDoc(bookingRef, {
                status: 'cancelled',
                updatedAt: serverTimestamp(),
            });
            return { success: true };
        } catch (error) {
            console.error('Error cancelling booking:', error);
            throw error;
        }
    },
};

// ============================================
// GUIDES SERVICE
// ============================================

export const guideService = {
    // Create/Update guide profile
    createGuideProfile: async (userId, profileData) => {
        try {
            const guideRef = doc(getPublicCollectionRef('guides'), userId);
            await setDoc(guideRef, {
                ...profileData,
                userId,
                rating: 0,
                reviewCount: 0,
                toursCompleted: 0,
                isVerified: false,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
            return { success: true };
        } catch (error) {
            console.error('Error creating guide profile:', error);
            throw error;
        }
    },

    // Get guide profile
    getGuideProfile: async (guideId) => {
        try {
            const guideRef = doc(getPublicCollectionRef('guides'), guideId);
            const docSnap = await getDoc(guideRef);
            if (docSnap.exists()) {
                return { guideId: docSnap.id, ...docSnap.data() };
            }
            return null;
        } catch (error) {
            console.error('Error fetching guide profile:', error);
            return null;
        }
    },

    // Get all guides (with optional filtering)
    getAllGuides: async (filters = {}) => {
        try {
            let q = query(
                getPublicCollectionRef('guides'),
                where('isVerified', '==', true),
                // NOTE: Using orderBy here might require Firestore index creation
                orderBy('rating', 'desc') 
            );

            const querySnapshot = await getDocs(q);
            let guides = querySnapshot.docs.map(d => ({ guideId: d.id, ...d.data() }));

            // Client-side filtering for location/language
            if (filters.location) {
                const loc = filters.location.toLowerCase();
                guides = guides.filter(g => (g.location || '').toLowerCase().includes(loc));
            }

            if (filters.language) {
                const lang = filters.language.toLowerCase();
                guides = guides.filter(g =>
                    (g.languages || []).some(l => l.toLowerCase().includes(lang))
                );
            }

            return guides;
        } catch (error) {
            console.error('Error fetching guides:', error);
            return [];
        }
    },

    // Update guide profile
    updateGuideProfile: async (guideId, updateData) => {
        try {
            const guideRef = doc(getPublicCollectionRef('guides'), guideId);
            await updateDoc(guideRef, {
                ...updateData,
                updatedAt: serverTimestamp(),
            });
            return { success: true };
        } catch (error) {
            console.error('Error updating guide profile:', error);
            throw error;
        }
    },

    // Search guides (client-side)
    searchGuides: async (searchTerm) => {
        try {
            const guides = await guideService.getAllGuides();
            if (!searchTerm) return guides;
            const term = searchTerm.toLowerCase();
            return guides.filter(
                guide =>
                    (guide.location || '').toLowerCase().includes(term) ||
                    (guide.bio || '').toLowerCase().includes(term)
            );
        } catch (error) {
            console.error('Error searching guides:', error);
            return [];
        }
    },
};

// ============================================
// REVIEWS SERVICE
// ============================================

export const reviewService = {
    // Create review
    createReview: async (bookingId, reviewData) => {
        try {
            const reviewsRef = getPublicCollectionRef('reviews');
            const docRef = await addDoc(reviewsRef, {
                ...reviewData,
                bookingId,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            // Update guide rating (recalculate)
            const booking = await bookingService.getBookingById(bookingId);
            if (booking && booking.guideId) {
                await reviewService.updateGuideRating(booking.guideId);
            }

            return { success: true, reviewId: docRef.id };
        } catch (error) {
            console.error('Error creating review:', error);
            throw error;
        }
    },

    // Get tour reviews
    getTourReviews: async (tourId) => {
        try {
            const q = query(
                getPublicCollectionRef('reviews'),
                where('tourId', '==', tourId),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(d => ({ reviewId: d.id, ...d.data() }));
        } catch (error) {
            console.error('Error fetching tour reviews:', error);
            return [];
        }
    },

    // Get guide reviews
    getGuideReviews: async (guideId) => {
        try {
            const q = query(
                getPublicCollectionRef('reviews'),
                where('guideId', '==', guideId),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(d => ({ reviewId: d.id, ...d.data() }));
        } catch (error) {
            console.error('Error fetching guide reviews:', error);
            return [];
        }
    },

    // Update guide rating
    updateGuideRating: async (guideId) => {
        try {
            const reviews = await reviewService.getGuideReviews(guideId);
            if (!reviews || reviews.length === 0) {
                // Reset rating if no reviews
                const guideRef = doc(getPublicCollectionRef('guides'), guideId);
                await updateDoc(guideRef, { rating: 0, reviewCount: 0 });
                return;
            }

            const averageRating =
                reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length;

            const guideRef = doc(getPublicCollectionRef('guides'), guideId);
            await updateDoc(guideRef, {
                rating: Math.round(averageRating * 10) / 10,
                reviewCount: reviews.length,
            });
        } catch (error) {
            console.error('Error updating guide rating:', error);
        }
    },
};

// ============================================
// MESSAGES SERVICE
// ============================================

export const messageService = {
    // Get or create conversation
    getOrCreateConversation: async (userId1, userId2) => {
        try {
            // Query conversations where userId1 is a participant
            const q = query(
                getPublicCollectionRef('conversations'),
                where('participants', 'array-contains', userId1)
            );
            const querySnapshot = await getDocs(q);

            let conversationId = null;
            for (const docSnap of querySnapshot.docs) {
                const data = docSnap.data();
                if (Array.isArray(data.participants) && data.participants.includes(userId2)) {
                    conversationId = docSnap.id;
                    break;
                }
            }

            if (conversationId) return conversationId;

            // Create new conversation
            const conversationsRef = getPublicCollectionRef('conversations');
            const docRef = await addDoc(conversationsRef, {
                participants: [userId1, userId2].sort(), // Sort to ensure consistent lookup
                lastMessage: null,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            return docRef.id;
        } catch (error) {
            console.error('Error managing conversation:', error);
            throw error;
        }
    },

    // Send message
    sendMessage: async (conversationId, senderId, receiverId, content) => {
        try {
            const messagesRef = collection(getPublicCollectionRef('conversations'), conversationId, 'messages');
            const docRef = await addDoc(messagesRef, {
                senderId,
                receiverId,
                content,
                timestamp: serverTimestamp(),
                isRead: false,
            });

            // Update conversation last message
            const conversationRef = doc(getPublicCollectionRef('conversations'), conversationId);
            await updateDoc(conversationRef, {
                lastMessage: content,
                lastMessageTime: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            return { success: true, messageId: docRef.id };
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    },

    // Get messages for conversation
    getMessages: async (conversationId) => {
        try {
            const q = query(
                collection(getPublicCollectionRef('conversations'), conversationId, 'messages'),
                orderBy('timestamp', 'asc')
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(d => ({ messageId: d.id, ...d.data() }));
        } catch (error) {
            console.error('Error fetching messages:', error);
            return [];
        }
    },

    // Get user conversations
    getUserConversations: async (userId) => {
        try {
            const q = query(
                getPublicCollectionRef('conversations'),
                where('participants', 'array-contains', userId),
                orderBy('updatedAt', 'desc')
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(d => ({ conversationId: d.id, ...d.data() }));
        } catch (error) {
            console.error('Error fetching conversations:', error);
            return [];
        }
    },
};

// ============================================
// PAYMENTS SERVICE
// ============================================

export const paymentService = {
    // Create payment record
    createPayment: async (bookingId, paymentData) => {
        try {
            const paymentsRef = getPublicCollectionRef('payments');
            const docRef = await addDoc(paymentsRef, {
                ...paymentData,
                bookingId,
                status: 'pending',
                createdAt: serverTimestamp(),
            });

            return { success: true, paymentId: docRef.id };
        } catch (error) {
            console.error('Error creating payment:', error);
            throw error;
        }
    },

    // Update payment status
    updatePaymentStatus: async (paymentId, status) => {
        try {
            const paymentRef = doc(getPublicCollectionRef('payments'), paymentId);
            await updateDoc(paymentRef, {
                status,
                processedAt: serverTimestamp(),
            });

            return { success: true };
        } catch (error) {
            console.error('Error updating payment:', error);
            throw error;
        }
    },

    // Get payment by booking
    getPaymentByBooking: async (bookingId) => {
        try {
            const q = query(getPublicCollectionRef('payments'), where('bookingId', '==', bookingId));
            const querySnapshot = await getDocs(q);
            if (querySnapshot.docs.length > 0) {
                return { paymentId: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
            }
            return null;
        } catch (error) {
            console.error('Error fetching payment:', error);
            return null;
        }
    },
};

// Also export auth instance for use in components if needed (e.g., getting current user ID)
export { auth };