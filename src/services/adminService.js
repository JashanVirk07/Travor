import { 
    collection, 
    getDocs, 
    doc, 
    updateDoc, 
    deleteDoc, 
    query, 
    orderBy, 
    where,
    getCountFromServer
} from 'firebase/firestore';
import { db } from '../firebase.js';

export const adminService = {
    // 1. GET DASHBOARD STATS
    getStats: async () => {
        try {
            // Get counts (this is efficient in Firestore)
            const usersSnap = await getCountFromServer(collection(db, 'users'));
            const toursSnap = await getCountFromServer(collection(db, 'tours'));
            const bookingsSnap = await getCountFromServer(collection(db, 'bookings'));
            
            // Calculate Revenue (Fetch confirmed bookings)
            const q = query(collection(db, 'bookings'), where('paymentStatus', '==', 'completed'));
            const revenueSnap = await getDocs(q);
            const totalRevenue = revenueSnap.docs.reduce((sum, doc) => sum + (doc.data().totalPrice || 0), 0);

            return {
                totalUsers: usersSnap.data().count,
                totalTours: toursSnap.data().count,
                totalBookings: bookingsSnap.data().count,
                totalRevenue: totalRevenue
            };
        } catch (error) {
            console.error("Error fetching admin stats:", error);
            return { totalUsers: 0, totalTours: 0, totalBookings: 0, totalRevenue: 0 };
        }
    },

    // 2. MANAGE USERS
    getAllUsers: async () => {
        try {
            const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error fetching users:", error);
            return [];
        }
    },

    verifyGuide: async (userId) => {
        try {
            const userRef = doc(db, 'guides', userId); // Update guide profile
            const userDocRef = doc(db, 'users', userId); // Update main user doc
            
            await updateDoc(userRef, { isVerified: true });
            // Sometimes isVerified is stored in users collection too for easy access
            await updateDoc(userDocRef, { isVerified: true }); 
            return { success: true };
        } catch (error) {
            console.error("Error verifying guide:", error);
            throw error;
        }
    },

    // 3. MANAGE BOOKINGS
    getAllBookings: async () => {
        try {
            const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error fetching all bookings:", error);
            return [];
        }
    },

    // 4. MANAGE TOURS
    getAllTours: async () => {
        try {
            const q = query(collection(db, 'tours'), orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error fetching all tours:", error);
            return [];
        }
    },

    deleteTour: async (tourId) => {
        try {
            await deleteDoc(doc(db, 'tours', tourId));
            return { success: true };
        } catch (error) {
            console.error("Error deleting tour:", error);
            throw error;
        }
    }
};