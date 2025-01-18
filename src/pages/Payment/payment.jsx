import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_SECRET_KEY);

const PaymentForm = ({ paymentDetails }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    trainerName, slotName, packageName, price, userName, userEmail,
    classId, className, classImage, trainerId, trainerEmail,
    trainerProfile, classDetails, classAdditionalInfo, date,
    startTime, maxParticipants, membershipType, specialInstructions,
    membershipFeatures, slotStatus
  } = paymentDetails;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    // Show confirmation dialog
    const result = await Swal.fire({
      title: 'Confirm Payment',
      html: `
        <div class="text-left">
          <p class="mb-2"><strong>Amount:</strong> $${price.toFixed(2)}</p>
          <p class="mb-2"><strong>Package:</strong> ${packageName}</p>
          <p class="mb-2"><strong>Trainer:</strong> ${trainerName}</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Confirm Payment',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#16a34a',
      cancelButtonColor: '#dc2626',
      reverseButtons: true
    });

    if (!result.isConfirmed) return;

    setLoading(true);

    try {
      if (!price || isNaN(price) || price <= 0) {
        throw new Error('Invalid price amount');
      }

      // Show processing state
      Swal.fire({
        title: 'Processing Payment',
        html: 'Please wait...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const { data: { clientSecret } } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/create-payment-intent`,
        { price }
      );

      if (!clientSecret) {
        throw new Error('No client secret received from the server');
      }

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { name: userName, email: userEmail },
        },
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      await axios.post(`${import.meta.env.VITE_API_URL}/api/save-payment`, {
        paymentId: result.paymentIntent.id,
        trainerName, slotName, packageName, price, userName, userEmail,
        status: 'completed',
        createdAt: new Date().toISOString(),
        trainerId, trainerEmail, trainerProfile, classId,
        className, classImage, classDetails, classAdditionalInfo,
        date, startTime, maxParticipants, membershipType,
        specialInstructions, membershipFeatures, slotStatus
      });

      await axios.patch(`${import.meta.env.VITE_API_URL}/api/slots/${trainerId}`, {
        customerInfo: {
          name: userName,
          email: userEmail,
          paymentId: result.paymentIntent.id,
          packageName,
          paymentDate: new Date().toISOString()
        }
      });

      await axios.patch(`${import.meta.env.VITE_API_URL}/incrementClasses/${classId}`, {
        bookingCount: 1,
      });

      // Show success message
      await Swal.fire({
        title: 'Payment Successful!',
        text: 'Your booking has been confirmed.',
        icon: 'success',
        confirmButtonColor: '#16a34a'
      });

      navigate('/', { state: { classId, className, trainerName, slotName } });
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      
      // Show error message
      await Swal.fire({
        title: 'Payment Failed',
        text: errorMessage,
        icon: 'error',
        confirmButtonColor: '#dc2626'
      });
      
      console.error('Payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 border rounded-lg shadow-sm bg-white">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': { color: '#aab7c4' },
              },
              invalid: { color: '#9e2146' },
            },
          }}
        />
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className={`w-full bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
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
  paymentDetails.price = paymentDetails.price ? parseFloat(paymentDetails.price) : null;

  if (!paymentDetails.trainerName || !paymentDetails.slotName || !paymentDetails.packageName ||
      !paymentDetails.price || !paymentDetails.userName || !paymentDetails.userEmail ||
      !paymentDetails.trainerId || !paymentDetails.trainerEmail || !paymentDetails.classId ||
      !paymentDetails.className) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center p-6 bg-white rounded-lg shadow-lg max-w-md w-full">
          <p className="text-lg text-red-500 mb-4">Required payment information is missing.</p>
          <button
            onClick={() => window.history.back()}
            className="text-blue-600 hover:text-blue-800 underline transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-4 sm:p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Payment Details</h2>

        {/* Order Summary */}
        <div className="mb-8 bg-gray-50 p-4 sm:p-6 rounded-xl border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Order Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Trainer</span>
              <span className="font-medium text-gray-800">{paymentDetails.trainerName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Slot</span>
              <span className="font-medium text-gray-800">{paymentDetails.slotName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Package</span>
              <span className="font-medium text-gray-800">{paymentDetails.packageName}</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t">
              <span className="text-gray-800 font-semibold">Total Amount</span>
              <span className="font-bold text-xl text-green-600">${paymentDetails.price}/Month</span>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Customer Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="block text-gray-600 text-sm">Name</label>
              <p className="font-medium text-gray-800">{paymentDetails.userName}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="block text-gray-600 text-sm">Email</label>
              <p className="font-medium text-gray-800">{paymentDetails.userEmail}</p>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Payment Method</h3>
          <Elements stripe={stripePromise}>
            <PaymentForm paymentDetails={paymentDetails} />
          </Elements>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
            <span>🔒</span>
            Your payment information is secured with SSL encryption
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;