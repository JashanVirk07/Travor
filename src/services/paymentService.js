// src/services/paymentService.js
import { 
    collection, 
    doc, 
    addDoc, 
    updateDoc, 
    query, 
    where, 
    getDocs,
    serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase.js';
import { bookingService } from './firestoreService.js';

export const enhancedPaymentService = {
    // Process a payment
    processPayment: async (bookingId, paymentDetails) => {
        try {
            console.log('Processing payment for booking:', bookingId);
            
            // Create payment record
            const paymentData = {
                bookingId,
                amount: paymentDetails.amount,
                currency: paymentDetails.currency || 'usd',
                paymentMethodId: paymentDetails.paymentMethodId,
                transactionId: paymentDetails.transactionId,
                status: 'completed',
                paymentGateway: 'stripe',
                refundStatus: 'none',
                refundAmount: 0,
                processedAt: serverTimestamp(),
                createdAt: serverTimestamp(),
            };

            const paymentsRef = collection(db, 'payments');
            const docRef = await addDoc(paymentsRef, paymentData);

            // Update booking status to confirmed
            await bookingService.updateBookingStatus(bookingId, 'confirmed');

            // Update booking payment status
            const bookingRef = doc(db, 'bookings', bookingId);
            await updateDoc(bookingRef, {
                paymentStatus: 'completed',
                paymentId: docRef.id,
                updatedAt: serverTimestamp(),
            });

            console.log('Payment processed successfully:', docRef.id);
            return { 
                success: true, 
                paymentId: docRef.id,
                message: 'Payment processed successfully'
            };
        } catch (error) {
            console.error('Error processing payment:', error);
            throw error;
        }
    },

    // Get payment by booking ID
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

    // Process a refund
    processRefund: async (bookingId, refundReason = '') => {
        try {
            console.log('Processing refund for booking:', bookingId);

            // Get the payment record
            const payment = await enhancedPaymentService.getPaymentByBooking(bookingId);
            
            if (!payment) {
                throw new Error('No payment found for this booking');
            }

            if (payment.status !== 'completed') {
                throw new Error('Can only refund completed payments');
            }

            if (payment.refundStatus === 'completed') {
                throw new Error('Payment has already been refunded');
            }

            // Get booking details
            const booking = await bookingService.getBookingById(bookingId);
            if (!booking) {
                throw new Error('Booking not found');
            }

            // Calculate refund amount based on cancellation policy
            const refundAmount = payment.amount;
            const bookingDate = new Date(booking.startDate);
            const now = new Date();
            const hoursUntilBooking = (bookingDate - now) / (1000 * 60 * 60);

            // Refund policy: Full refund if cancelled 24+ hours before
            let refundPercentage = 100;
            if (hoursUntilBooking < 24 && hoursUntilBooking > 0) {
                refundPercentage = 50; // 50% refund if less than 24 hours
            } else if (hoursUntilBooking <= 0) {
                refundPercentage = 0; // No refund after tour starts
            }

            const actualRefundAmount = (refundAmount * refundPercentage) / 100;

            if (actualRefundAmount === 0) {
                throw new Error('No refund available - tour has already started or passed');
            }

            // In a real app, you'd call Stripe API here:
            // const refund = await stripe.refunds.create({
            //   payment_intent: payment.transactionId,
            //   amount: Math.round(actualRefundAmount * 100), // Stripe uses cents
            // });
            
            // Update payment record
            const paymentRef = doc(db, 'payments', payment.paymentId);
            await updateDoc(paymentRef, {
                refundStatus: 'completed',
                refundAmount: actualRefundAmount,
                refundPercentage,
                refundReason,
                refundedAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            // Update booking
            await bookingService.updateBookingStatus(bookingId, 'cancelled');
            const bookingRef = doc(db, 'bookings', bookingId);
            await updateDoc(bookingRef, {
                cancellationReason: refundReason,
                cancelledAt: serverTimestamp(),
                refundAmount: actualRefundAmount,
                refundStatus: 'completed',
            });

            console.log('Refund processed successfully');
            return {
                success: true,
                refundAmount: actualRefundAmount,
                refundPercentage,
                message: `Refund of $${actualRefundAmount.toFixed(2)} (${refundPercentage}%) processed successfully`
            };
        } catch (error) {
            console.error('Error processing refund:', error);
            throw error;
        }
    },

    // Check refund eligibility
    checkRefundEligibility: async (bookingId) => {
        try {
            const booking = await bookingService.getBookingById(bookingId);
            if (!booking) {
                return { eligible: false, reason: 'Booking not found' };
            }

            if (booking.status === 'cancelled') {
                return { eligible: false, reason: 'Booking already cancelled' };
            }

            if (booking.refundStatus === 'completed') {
                return { eligible: false, reason: 'Refund already processed' };
            }

            const payment = await enhancedPaymentService.getPaymentByBooking(bookingId);
            if (!payment || payment.status !== 'completed') {
                return { eligible: false, reason: 'No completed payment found' };
            }

            const bookingDate = new Date(booking.startDate);
            const now = new Date();
            const hoursUntilBooking = (bookingDate - now) / (1000 * 60 * 60);

            let refundPercentage = 100;
            if (hoursUntilBooking < 24 && hoursUntilBooking > 0) {
                refundPercentage = 50;
            } else if (hoursUntilBooking <= 0) {
                refundPercentage = 0;
            }

            if (refundPercentage === 0) {
                return { 
                    eligible: false, 
                    reason: 'Tour has already started - no refund available',
                    refundPercentage: 0
                };
            }

            const refundAmount = (payment.amount * refundPercentage) / 100;

            return {
                eligible: true,
                refundAmount,
                refundPercentage,
                originalAmount: payment.amount,
                hoursUntilBooking: Math.max(0, hoursUntilBooking),
                message: hoursUntilBooking >= 24 
                    ? 'Full refund available'
                    : '50% refund available (less than 24 hours notice)'
            };
        } catch (error) {
            console.error('Error checking refund eligibility:', error);
            return { eligible: false, reason: error.message };
        }
    },
};