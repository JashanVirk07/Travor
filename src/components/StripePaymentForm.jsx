// src/components/StripePaymentForm.jsx
import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { COLORS } from '../utils/colors';

const StripePaymentForm = ({ amount, bookingId, onSuccess, onError, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
        padding: '12px',
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const cardElement = elements.getElement(CardElement);

      // Create payment method
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      // In a real app, you'd send paymentMethod.id to your server
      // For demo purposes, we'll simulate a successful payment
      console.log('Payment Method Created:', paymentMethod.id);

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Call success callback
      onSuccess({
        paymentMethodId: paymentMethod.id,
        transactionId: `txn_${Date.now()}`,
        amount: amount,
        status: 'succeeded',
      });

    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message);
      onError(err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.cardSection}>
        <label style={styles.label}>
          Card Details
        </label>
        <div style={styles.cardElementWrapper}>
          <CardElement options={cardElementOptions} />
        </div>
      </div>

      {error && (
        <div style={styles.errorBox}>
          <span>⚠️ {error}</span>
        </div>
      )}

      <div style={styles.amountDisplay}>
        <span style={styles.amountLabel}>Total Amount:</span>
        <span style={styles.amountValue}>${amount.toFixed(2)}</span>
      </div>

      <div style={styles.buttonGroup}>
        <button
          type="button"
          onClick={onCancel}
          disabled={processing}
          style={styles.cancelButton}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || processing}
          style={{
            ...styles.payButton,
            ...(processing ? styles.payButtonDisabled : {}),
          }}
        >
          {processing ? '⏳ Processing...' : `💳 Pay $${amount.toFixed(2)}`}
        </button>
      </div>

      <div style={styles.secureNotice}>
        🔒 Your payment information is secure and encrypted
      </div>

      <div style={styles.testCardInfo}>
        <strong>Test Card Numbers:</strong>
        <div>✅ Success: 4242 4242 4242 4242</div>
        <div>❌ Declined: 4000 0000 0000 0002</div>
        <div>Use any future expiry date and any 3-digit CVC</div>
      </div>
    </form>
  );
};

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  cardSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
  },
  cardElementWrapper: {
    padding: '16px',
    border: `2px solid ${COLORS.border}`,
    borderRadius: '8px',
    background: 'white',
  },
  errorBox: {
    padding: '12px',
    background: '#fee',
    border: `1px solid ${COLORS.danger}`,
    borderRadius: '8px',
    color: COLORS.danger,
    fontSize: '14px',
  },
  amountDisplay: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    background: COLORS.light,
    borderRadius: '8px',
    fontSize: '18px',
    fontWeight: '600',
  },
  amountLabel: {
    color: '#666',
  },
  amountValue: {
    fontSize: '24px',
    color: COLORS.primary,
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
  },
  cancelButton: {
    flex: 1,
    padding: '14px',
    background: 'white',
    border: `2px solid ${COLORS.border}`,
    color: '#666',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  payButton: {
    flex: 2,
    padding: '14px',
    background: COLORS.primary,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  payButtonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  secureNotice: {
    textAlign: 'center',
    fontSize: '12px',
    color: '#666',
    marginTop: '8px',
  },
  testCardInfo: {
    padding: '12px',
    background: '#f0f9ff',
    border: '1px solid #0ea5e9',
    borderRadius: '8px',
    fontSize: '12px',
    color: '#0369a1',
    lineHeight: '1.6',
  },
};

export default StripePaymentForm;