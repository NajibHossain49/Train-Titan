import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import toast from 'react-hot-toast';

// Initialize Stripe (replace with your publishable key)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_SECRET_KEY);

const PaymentForm = ({ paymentDetails }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    // Previous fields
    trainerName,
    slotName,
    packageName,
    price,
    userName,
    userEmail,
    classId,
    className,
    classImage,
    trainerId,
    // New fields
    trainerEmail,
    trainerProfile,
    classDetails,
    classAdditionalInfo,
    date,
    startTime,
    maxParticipants,
    membershipType,
    specialInstructions,
    membershipFeatures,
    slotStatus
  } = paymentDetails;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    try {
      // Validate the price
      if (!price || isNaN(price) || price <= 0) {
        throw new Error('Invalid price amount');
      }

      // Step 1: Create Payment Intent
      const { data: { clientSecret } } = await axios.post(`${import.meta.env.VITE_API_URL}/api/create-payment-intent`, { price });

      if (!clientSecret) {
        throw new Error('No client secret received from the server');
      }

      // Step 2: Confirm Card Payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { name: userName, email: userEmail },
        },
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      // Step 3: Save Payment to Database
      await axios.post(`${import.meta.env.VITE_API_URL}/api/save-payment`, {
        paymentId: result.paymentIntent.id,
        // Basic payment info
        trainerName,
        slotName,
        packageName,
        price,
        userName,
        userEmail,
        status: 'completed',
        createdAt: new Date().toISOString(),

        // Additional trainer and class info
        trainerId,
        trainerEmail,
        trainerProfile,
        classId,
        className,
        classImage,
        classDetails,
        classAdditionalInfo,
        date,
        startTime,
        maxParticipants,
        membershipType,
        specialInstructions,
        membershipFeatures,
        slotStatus
      });

      // Step 4: Update Slot with Customer Information
      await axios.patch(`${import.meta.env.VITE_API_URL}/api/slots/${trainerId}`, {
        customerInfo: {
          name: userName,
          email: userEmail,
          paymentId: result.paymentIntent.id,
          packageName,
          paymentDate: new Date().toISOString()
        }
      });

      // Step 5: Increment Booking Count
      await axios.patch(`${import.meta.env.VITE_API_URL}/incrementClasses/${classId}`, {
        bookingCount: 1,
      });

      // Success
      toast.success('Payment successful and booking updated!');
      navigate('/', {
        state: { classId, className, trainerName, slotName },
      });
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      toast.error(errorMessage);
      console.error('Payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 border rounded-lg">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className={`w-full bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
      >
        {loading ? 'Processing...' : `Pay $${price.toFixed(2)}`}
      </button>
    </form>
  );
};

const PaymentPage = () => {
  const location = useLocation();
  const paymentDetails = location.state || {};

  // Ensure price is a number
  paymentDetails.price = paymentDetails.price ? parseFloat(paymentDetails.price) : null;

  // In PaymentPage component, update the validation check:
  if (
    !paymentDetails.trainerName ||
    !paymentDetails.slotName ||
    !paymentDetails.packageName ||
    !paymentDetails.price ||
    !paymentDetails.userName ||
    !paymentDetails.userEmail ||
    !paymentDetails.trainerId ||
    !paymentDetails.trainerEmail ||
    !paymentDetails.classId ||
    !paymentDetails.className
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <p className="text-lg text-red-500 mb-4">Required payment information is missing.</p>
          <button
            onClick={() => window.history.back()}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Payment Details</h2>

        {/* Payment Summary */}
        <div className="mb-8 bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Order Summary</h3>
          <ul className="space-y-2">
            <li className="flex justify-between">
              <span className="text-gray-600">Trainer:</span>
              <span className="font-medium">{paymentDetails.trainerName}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600">Slot:</span>
              <span className="font-medium">{paymentDetails.slotName}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600">Package:</span>
              <span className="font-medium">{paymentDetails.packageName}</span>
            </li>
            <li className="flex justify-between border-t pt-2 mt-2">
              <span className="text-gray-600">Total Amount:</span>
              <span className="font-bold text-lg">${paymentDetails.price}/Month</span>
            </li>
          </ul>
        </div>

        {/* Customer Information */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600">Name</label>
              <p className="font-medium">{paymentDetails.userName}</p>
            </div>
            <div>
              <label className="block text-gray-600">Email</label>
              <p className="font-medium">{paymentDetails.userEmail}</p>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Payment Method</h3>
          <Elements stripe={stripePromise}>
            <PaymentForm paymentDetails={paymentDetails} />
          </Elements>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>🔒 Your payment information is secured with SSL encryption</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;