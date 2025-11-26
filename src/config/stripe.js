// src/config/stripe.js
import { loadStripe } from '@stripe/stripe-js';

// Replace with your Stripe Publishable Key
// Get this from: https://dashboard.stripe.com/test/apikeys
export const stripePromise = loadStripe('pk_test_51SXWYNFtlWq7qtiQv8PjZNacH0yjnM7XCkpzt7ifJ1P3RlgpJ88DIwBXR4gVsSV6V1DqMSmOETEXeSHWLkHqeIZR00rJTesTqS');

export const STRIPE_CONFIG = {
  currency: 'usd',
  paymentMethodTypes: ['card'],
};