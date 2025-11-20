import { 
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
    addDoc,
} from 'firebase/firestore';
import { db } from '../firebase.js';

// ============================================
// TOURS SERVICE
// ============================================

export const tourService = {
    // Create a new tour (Guide only)
    createTour: async (guideId, tourData) => {
        try {
            const toursRef = collection(db, 'tours');
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
            console.log('Tour created successfully:', docRef.id);
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
                collection(db, 'tours'),
                where('guideId', '==', guideId),
                where('isActive', '==', true),
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
            const tourRef = doc(db, 'tours', tourId);
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
            let constraints = [where('isActive', '==', true)];

            if (filters.category) {
                constraints.push(where('category', '==', filters.category));
            }

            if (filters.maxPrice !== undefined) {
                constraints.push(where('price', '<=', filters.maxPrice));
            }

            const q = query(collection(db, 'tours'), ...constraints);
            const querySnapshot = await getDocs(q);
            let tours = querySnapshot.docs.map(d => ({ tourId: d.id, ...d.data() }));
            
            // Client-side sorting
            tours.sort((a, b) => {
                const aTime = a.createdAt?.seconds || 0;
                const bTime = b.createdAt?.seconds || 0;
                return bTime - aTime;
            });

            // Client-side filter for location
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

    // Search tours
    searchTours: async (searchTerm) => {
        try {
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
            const tourRef = doc(db, 'tours', tourId);
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
            const tourRef = doc(db, 'tours', tourId);
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
    createBooking: async (bookingData) => {
        try {
            const bookingsRef = collection(db, 'bookings');
            const tourRef = doc(db, 'tours', bookingData.tourId);
            
            const tourSnap = await getDoc(tourRef);
            if (!tourSnap.exists()) {
                throw new Error('Tour not found');
            }

            const tourData = tourSnap.data();
            if (!tourData.isActive) {
                throw new Error('Tour is no longer available');
            }

            const newBooking = {
                ...bookingData,
                ticketNumber: `TKT-${Date.now()}`,
                status: 'pending',
                paymentStatus: 'pending',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };

            const bookingDocRef = await addDoc(bookingsRef, newBooking);

            await updateDoc(tourRef, {
                bookings: (tourData.bookings || 0) + (bookingData.numberOfParticipants || 1),
                updatedAt: serverTimestamp(),
            });

            console.log('Booking created successfully with ID:', bookingDocRef.id);
            return bookingDocRef.id;
        } catch (error) {
            console.error('Error creating booking:', error);
            throw error;
        }
    },

    // Get traveler bookings - NEW FUNCTION
    getTravelerBookings: async (travelerId) => {
        try {
            console.log('Fetching bookings for traveler:', travelerId);
            const q = query(
                collection(db, 'bookings'),
                where('travelerId', '==', travelerId),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);
            const bookings = querySnapshot.docs.map(d => ({ 
                bookingId: d.id, 
                ...d.data() 
            }));
            console.log('Found bookings:', bookings);
            return bookings;
        } catch (error) {
            console.error('Error fetching traveler bookings:', error);
            // If the error is about missing index, return empty array
            if (error.message.includes('index')) {
                console.warn('Firestore index needed. Please create the index in Firebase Console.');
                return [];
            }
            throw error;
        }
    },

    // Get guide bookings
    getGuideBookings: async (guideId) => {
        try {
            const q = query(
                collection(db, 'bookings'),
                where('guideId', '==', guideId),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(d => ({ 
                bookingId: d.id, 
                ...d.data() 
            }));
        } catch (error) {
            console.error('Error fetching guide bookings:', error);
            if (error.message.includes('index')) {
                console.warn('Firestore index needed. Please create the index in Firebase Console.');
                return [];
            }
            throw error;
        }
    },

    // Legacy function - kept for compatibility
    getUserBookings: async (userId, role = 'traveler') => {
        try {
            if (role === 'guide') {
                return await bookingService.getGuideBookings(userId);
            } else {
                return await bookingService.getTravelerBookings(userId);
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
            return [];
        }
    },

    getBookingById: async (bookingId) => {
        try {
            const bookingRef = doc(db, 'bookings', bookingId);
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

    updateBookingStatus: async (bookingId, status) => {
        try {
            const bookingRef = doc(db, 'bookings', bookingId);
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

    cancelBooking: async (bookingId) => {
        try {
            const bookingRef = doc(db, 'bookings', bookingId);
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
    createGuideProfile: async (userId, profileData) => {
        try {
            const guideRef = doc(db, 'guides', userId);
            await setDoc(guideRef, {
                ...profileData,
                userId,
                rating: 0,
                reviewCount: 0,
                tourCount: 0,
                toursCompleted: 0,
                isVerified: false,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
            console.log('Guide profile created successfully for:', userId);
            return { success: true };
        } catch (error) {
            console.error('Error creating guide profile:', error);
            throw error;
        }
    },

    getGuideProfile: async (guideId) => {
        try {
            const guideRef = doc(db, 'guides', guideId);
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

    getAllGuides: async (filters = {}) => {
        try {
            const q = query(
                collection(db, 'guides'),
                where('isVerified', '==', true),
                orderBy('rating', 'desc')
            );

            const querySnapshot = await getDocs(q);
            let guides = querySnapshot.docs.map(d => ({ guideId: d.id, ...d.data() }));

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

    updateGuideProfile: async (guideId, updateData) => {
        try {
            const guideRef = doc(db, 'guides', guideId);
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

    searchGuides: async (searchTerm) => {
        try {
            const guides = await guideService.getAllGuides();
            if (!searchTerm) return guides;
            const term = searchTerm.toLowerCase();
            return guides.filter(
                guide =>
                    (guide.fullName || '').toLowerCase().includes(term) ||
                    (guide.location || '').toLowerCase().includes(term) ||
                    (guide.bio || '').toLowerCase().includes(term) ||
                    (guide.languages || []).some(l => l.toLowerCase().includes(term))
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
    createReview: async (bookingId, reviewData) => {
        try {
            const reviewsRef = collection(db, 'reviews');
            const docRef = await addDoc(reviewsRef, {
                ...reviewData,
                bookingId,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            const booking = await bookingService.getBookingById(bookingId);
            if (booking && booking.guideId) {
                await reviewService.updateGuideRating(booking.guideId);
            }

            if (booking && booking.tourId) {
                await reviewService.updateTourRating(booking.tourId);
            }

            return { success: true, reviewId: docRef.id };
        } catch (error) {
            console.error('Error creating review:', error);
            throw error;
        }
    },

    getTourReviews: async (tourId) => {
        try {
            const q = query(
                collection(db, 'reviews'),
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

    getGuideReviews: async (guideId) => {
        try {
            const q = query(
                collection(db, 'reviews'),
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

    updateGuideRating: async (guideId) => {
        try {
            const reviews = await reviewService.getGuideReviews(guideId);
            if (!reviews || reviews.length === 0) {
                const guideRef = doc(db, 'guides', guideId);
                await updateDoc(guideRef, { 
                    rating: 0, 
                    reviewCount: 0,
                    updatedAt: serverTimestamp()
                });
                return;
            }

            const averageRating =
                reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length;

            const guideRef = doc(db, 'guides', guideId);
            await updateDoc(guideRef, {
                rating: Math.round(averageRating * 10) / 10,
                reviewCount: reviews.length,
                updatedAt: serverTimestamp()
            });
        } catch (error) {
            console.error('Error updating guide rating:', error);
        }
    },

    updateTourRating: async (tourId) => {
        try {
            const reviews = await reviewService.getTourReviews(tourId);
            if (!reviews || reviews.length === 0) {
                const tourRef = doc(db, 'tours', tourId);
                await updateDoc(tourRef, { 
                    averageRating: 0, 
                    totalReviews: 0,
                    updatedAt: serverTimestamp()
                });
                return;
            }

            const averageRating =
                reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length;

            const tourRef = doc(db, 'tours', tourId);
            await updateDoc(tourRef, {
                averageRating: Math.round(averageRating * 10) / 10,
                totalReviews: reviews.length,
                updatedAt: serverTimestamp()
            });
        } catch (error) {
            console.error('Error updating tour rating:', error);
        }
    },
};

// ============================================
// MESSAGES SERVICE
// ============================================

export const messageService = {
    getOrCreateConversation: async (userId1, userId2) => {
        try {
            const q = query(
                collection(db, 'conversations'),
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

            const conversationsRef = collection(db, 'conversations');
            const docRef = await addDoc(conversationsRef, {
                participants: [userId1, userId2].sort(),
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

    sendMessage: async (conversationId, senderId, receiverId, content) => {
        try {
            const messagesRef = collection(db, 'conversations', conversationId, 'messages');
            const docRef = await addDoc(messagesRef, {
                senderId,
                receiverId,
                content,
                timestamp: serverTimestamp(),
                isRead: false,
            });

            const conversationRef = doc(db, 'conversations', conversationId);
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

    getMessages: async (conversationId) => {
        try {
            const q = query(
                collection(db, 'conversations', conversationId, 'messages'),
                orderBy('timestamp', 'asc')
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(d => ({ messageId: d.id, ...d.data() }));
        } catch (error) {
            console.error('Error fetching messages:', error);
            return [];
        }
    },

    getUserConversations: async (userId) => {
        try {
            const q = query(
                collection(db, 'conversations'),
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
    createPayment: async (bookingId, paymentData) => {
        try {
            const paymentsRef = collection(db, 'payments');
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

    updatePaymentStatus: async (paymentId, status) => {
        try {
            const paymentRef = doc(db, 'payments', paymentId);
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

    getPaymentByBooking: async (bookingId) => {
        try {
            const q = query(
                collection(db, 'payments'), 
                where('bookingId', '==', bookingId)
            );
            const querySnapshot = await getDocs(q);
            if (querySnapshot.docs.length > 0) {
                return { 
                    paymentId: querySnapshot.docs[0].id, 
                    ...querySnapshot.docs[0].data() 
                };
            }
            return null;
        } catch (error) {
            console.error('Error fetching payment:', error);
            return null;
        }
    },
};