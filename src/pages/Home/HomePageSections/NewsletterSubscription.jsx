import React, { useState } from 'react';
import axios from 'axios';

const NewsletterSubscription = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/subscribe`, {
        name,
        email,
      });
      setIsSuccess(true);
      setMessage('Subscription successful!');
      setName('');
      setEmail('');
      setTimeout(() => {
        setIsSuccess(false);
        setMessage('');
      }, 3000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'An error occurred. Please try again.';
      setMessage(errorMessage);
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-gradient-to-r from-gray-50 to-white py-8 px-4 border-t border-gray-100">
      <div className="max-w-6xl mx-auto relative">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-20 h-20 bg-blue-50 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-50 rounded-full translate-x-1/2 translate-y-1/2" />
        
        <div className="relative bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Left side content */}
            <div className="md:w-2/5">
              <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 inline-block text-transparent bg-clip-text">
                Stay in the Loop
              </h2>
              <p className="text-gray-600 text-sm">
                Join our newsletter and get the latest updates delivered straight to your inbox.
              </p>
            </div>

            {/* Right side form */}
            <div className="w-full md:w-3/5">
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-300"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-300"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                  ) : (
                    'Subscribe'
                  )}
                </button>
              </form>

              {message && (
                <div 
                  className={`mt-3 text-sm ${
                    isSuccess ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterSubscription;