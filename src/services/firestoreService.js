import { 
    collection, 
    doc, 
    getDoc, 
    getDocs, 
    setDoc, 
    updateDoc, 
    deleteDoc, 
    query, 
    where, 
    orderBy, 
    serverTimestamp, 
    addDoc,
    limit,
    getCountFromServer 
} from 'firebase/firestore';
import { db } from '../firebase.js';

// ============================================
// NOTIFICATION SERVICE
// ============================================
export const notificationService = {
    sendNotification: async (userId, title, message, type = 'info') => {
        try {
            if (!userId) return;
            const notifRef = collection(db, 'notifications');
            await addDoc(notifRef, {
                userId,
                title,
                message,
                type, 
                isRead: false,
                createdAt: serverTimestamp()
            });
        } catch (error) {
            console.error("Error sending notification:", error);
        }
    },
    markAsRead: async (notificationId) => {
        try {
            const ref = doc(db, 'notifications', notificationId);
            await updateDoc(ref, { isRead: true });
        } catch (error) {
            console.error("Error marking notification read:", error);
        }
    },
    markAllAsRead: async (userId) => {
        try {
            const q = query(collection(db, 'notifications'), where('userId', '==', userId), where('isRead', '==', false));
            const snapshot = await getDocs(q);
            const updates = snapshot.docs.map(d => updateDoc(doc(db, 'notifications', d.id), { isRead: true }));
            await Promise.all(updates);
        } catch (error) {
            console.error("Error clearing notifications:", error);
        }
    }
};

// ============================================
// TOURS SERVICE
// ============================================
export const tourService = {
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
                updatedAt: serverTimestamp() 
            });
            return { success: true, tourId: docRef.id };
        } catch (error) { console.error('Error creating tour:', error); throw error; }
    },
    getGuideTours: async (guideId) => {
        try { 
            const q = query(
                collection(db, 'tours'), 
                where('guideId', '==', guideId), 
                where('isActive', '==', true),
                orderBy('createdAt', 'desc')
            ); 
            const snapshot = await getDocs(q); 
            return snapshot.docs.map(d => ({ tourId: d.id, ...d.data() })); 
        } catch (error) { return []; }
    },
    getTourById: async (tourId) => {
        try { 
            const ref = doc(db, 'tours', tourId); 
            const snap = await getDoc(ref); 
            return snap.exists() ? { tourId: snap.id, ...snap.data() } : null; 
        } catch (error) { return null; }
    },
    getAllTours: async (filters = {}) => {
        try {
            let constraints = [where('isActive', '==', true)];
            if (filters.category) constraints.push(where('category', '==', filters.category));
            if (filters.maxPrice !== undefined) constraints.push(where('price', '<=', filters.maxPrice));
            const q = query(collection(db, 'tours'), ...constraints);
            const querySnapshot = await getDocs(q);
            let tours = querySnapshot.docs.map(d => ({ tourId: d.id, ...d.data() }));
            
            tours.sort((a, b) => {
                const aTime = a.createdAt?.seconds || 0;
                const bTime = b.createdAt?.seconds || 0;
                return bTime - aTime;
            });

            if (filters.location) {
                const term = filters.location.toLowerCase();
                tours = tours.filter(t => t.location.toLowerCase().includes(term));
            }
            return tours;
        } catch (error) { return []; }
    },
    searchTours: async (term) => { return []; }, 
    updateTour: async (id, data) => { await updateDoc(doc(db, 'tours', id), { ...data, updatedAt: serverTimestamp() }); return { success: true }; },
    deleteTour: async (id) => { await updateDoc(doc(db, 'tours', id), { isActive: false, updatedAt: serverTimestamp() }); return { success: true }; }
};

// ============================================
// BOOKINGS SERVICE
// ============================================
export const bookingService = {
    // 1. INSTANT BOOKING (Status = Confirmed)
    createBooking: async (bookingData) => {
        try {
            const bookingsRef = collection(db, 'bookings');
            const tourRef = doc(db, 'tours', bookingData.tourId);
            
            const tourSnap = await getDoc(tourRef);
            if (!tourSnap.exists()) throw new Error('Tour not found');
            const tourData = tourSnap.data();

            if (!tourData.isActive) throw new Error('Tour is no longer available');

            const newBooking = {
                ...bookingData,
                guideId: tourData.guideId, // EXPLICITLY SAVE GUIDE ID
                ticketNumber: `TKT-${Date.now()}`,
                status: 'confirmed', // INSTANT CONFIRMATION
                paymentStatus: 'completed',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };

            const bookingDocRef = await addDoc(bookingsRef, newBooking);

            // Update tour count
            await updateDoc(tourRef, {
                bookings: (tourData.bookings || 0) + (bookingData.numberOfParticipants || 1),
                updatedAt: serverTimestamp(),
            });

            // Notify Guide
            await notificationService.sendNotification(
                tourData.guideId,
                "New Booking! 🎉",
                `You have a new confirmed booking for "${tourData.title}".`,
                "success"
            );
            
            // Notify User
            await notificationService.sendNotification(
                bookingData.userId,
                "Booking Confirmed ✅",
                `Your booking for "${tourData.title}" is confirmed!`,
                "success"
            );

            return bookingDocRef.id;
        } catch (error) {
            console.error('Error creating booking:', error);
            throw error;
        }
    },

    // 2. GET GUIDE BOOKINGS (FIXED: Simplified query)
    getGuideBookings: async (guideId) => {
        try {
            // Simple query first to avoid index errors
            const q = query(
                collection(db, 'bookings'),
                where('guideId', '==', guideId)
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(d => ({ bookingId: d.id, ...d.data() }));
        } catch (error) {
            console.error('Error fetching guide bookings:', error);
            return [];
        }
    },

    getTravelerBookings: async (travelerId) => {
        try { 
            const q = query(collection(db, 'bookings'), where('travelerId', '==', travelerId), orderBy('createdAt', 'desc')); 
            const s = await getDocs(q); 
            return s.docs.map(d => ({ bookingId: d.id, ...d.data() })); 
        } catch (e) { return []; }
    },
    
    getBookingById: async (id) => { const s = await getDoc(doc(db,'bookings',id)); return s.exists() ? {bookingId:s.id, ...s.data()} : null; },
    
    updateBookingStatus: async (id, status) => {
        await updateDoc(doc(db,'bookings',id), { status, updatedAt: serverTimestamp() });
        return { success: true };
    },

    // 3. GUIDE CANCEL FUNCTION
    // 3. GUIDE CANCEL FUNCTION
    cancelBooking: async (bookingId) => {
        try {
            const bookingRef = doc(db, 'bookings', bookingId);
            const snap = await getDoc(bookingRef);
            if(!snap.exists()) return;
            const data = snap.data();

            // UPDATE: Set status to 'refund_pending' so it goes to Admin
            await updateDoc(bookingRef, { 
                status: 'refund_pending', 
                refundReason: 'Guide cancelled the booking (Automatic Request)',
                updatedAt: serverTimestamp() 
            });
            
            // Notify User
            await notificationService.sendNotification(
                data.userId, 
                "Booking Cancelled ⚠️",
                `Your guide cancelled the tour "${data.tourTitle}". A refund request has been sent to Admin.`,
                "warning"
            );
            return { success: true };
        } catch (error) { console.error(error); throw error; }
    },

    requestRefund: async (id, reason) => { await updateDoc(doc(db,'bookings',id), { status: 'refund_pending', refundReason: reason, updatedAt: serverTimestamp() }); return { success: true }; },
    processAdminRefund: async (id) => { 
        const ref = doc(db,'bookings',id); const snap = await getDoc(ref); const data = snap.data();
        await updateDoc(ref, { status: 'refunded', refundStatus: 'completed', refundedAt: serverTimestamp() });
        await notificationService.sendNotification(data.userId, "Refund Approved 💰", `Refund for "${data.tourTitle}" approved.`, "success");
        return { success: true };
    }
};

// ============================================
// GUIDES SERVICE
// ============================================
export const guideService = {
    createGuideProfile: async (uid, data) => { await setDoc(doc(db, 'guides', uid), data); return {success:true}; },
    getGuideProfile: async (uid) => { const s = await getDoc(doc(db, 'guides', uid)); return s.exists() ? { guideId: s.id, ...s.data() } : null; },
    getAllGuides: async () => { const s = await getDocs(query(collection(db, 'guides'))); return s.docs.map(d => ({ guideId: d.id, ...d.data() })); },
    updateGuideProfile: async (uid, data) => { await updateDoc(doc(db, 'guides', uid), data); return {success:true}; }
};

// ============================================
// REVIEWS SERVICE
// ============================================
export const reviewService = {
    createReview: async (bid, data) => { await addDoc(collection(db, 'reviews'), data); return {success:true}; },
    getTourReviews: async (tid) => { const s = await getDocs(query(collection(db, 'reviews'), where('tourId','==',tid))); return s.docs.map(d => d.data()); },
    getGuideReviews: async (gid) => { const s = await getDocs(query(collection(db, 'reviews'), where('guideId','==',gid))); return s.docs.map(d => d.data()); },
    updateGuideRating: async (gid) => {/* logic */},
    updateTourRating: async (tid) => {/* logic */}
};

// ============================================
// FAVORITES SERVICE
// ============================================
export const favoritesService = {
    addToFavorites: async (uid, tour) => { await setDoc(doc(db,'favorites', `${uid}_${tour.tourId}`), tour); },
    getUserFavoritesIds: async (uid) => { const s = await getDocs(query(collection(db,'favorites'), where('userId','==',uid))); return s.docs.map(d => d.data().tourId); },
    removeFromFavorites: async (uid, tid) => { await deleteDoc(doc(db,'favorites',`${uid}_${tid}`)); }
};

// ============================================
// MESSAGES SERVICE
// ============================================
export const messageService = {
    getUserConversations: async (uid) => { const s = await getDocs(query(collection(db,'conversations'), where('participants','array-contains',uid))); return s.docs.map(d => ({conversationId: d.id, ...d.data()})); },
    getOrCreateConversation: async (u1, u2) => { const q = query(collection(db,'conversations'), where('participants','array-contains',u1)); const s = await getDocs(q); let cid = null; s.forEach(d => { if(d.data().participants.includes(u2)) cid = d.id; }); if(cid) return cid; const r = await addDoc(collection(db,'conversations'), { participants: [u1,u2], createdAt: serverTimestamp() }); return r.id; },
    sendMessage: async (cid, sid, rid, txt) => { await addDoc(collection(db,'conversations',cid,'messages'), { senderId: sid, content: txt, timestamp: serverTimestamp() }); return {success:true}; }
};

// ============================================
// PAYMENTS SERVICE
// ============================================
export const paymentService = {
    createPayment: async (bid, data) => { await addDoc(collection(db,'payments'), {bookingId: bid, ...data}); return {success:true}; }
};

// ============================================
// CONTACT SERVICE
// ============================================
export const contactService = {
    submitInquiry: async (data) => {
        try {
            const inquiriesRef = collection(db, 'inquiries');
            await addDoc(inquiriesRef, {
                ...data,
                status: 'open',
                createdAt: serverTimestamp(),
            });
            return { success: true };
        } catch (error) {
            console.error("Error submitting inquiry:", error);
            throw error;
        }
    }
};