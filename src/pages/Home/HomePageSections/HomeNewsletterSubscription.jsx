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
      setMessage('Successfully subscribed! Welcome aboard.');
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
    <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-white-50 py-12 px-4">
      <div className="max-w-6xl mx-auto relative">
        {/* Decorative elements */}
        <div className="absolute -top-8 -left-8 w-24 h-24 bg-purple-100 rounded-full opacity-50 blur-lg" />
        <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-pink-100 rounded-full opacity-50 blur-lg" />

        <div className="relative backdrop-blur-sm bg-white/80 rounded-3xl p-8 shadow-xl border border-white/20">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Left content */}
            <div className="lg:w-2/5 text-center lg:text-left">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-br from-blue-500 to-purple-500 inline-block text-transparent bg-clip-text">
                Join Our Community
              </h2>
              <p className="text-gray-600">
                Subscribe to our newsletter and get exclusive updates, tips, and special offers delivered right to your inbox.
              </p>
            </div>


            {/* Right form */}
            <div className="w-full lg:w-3/5">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white/50 border border-purple-100 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all duration-300"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="email"
                      placeholder="Your Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white/50 border border-purple-100 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all duration-300"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto px-8 py-3 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    </div>
                  ) : (
                    'Subscribe Now'
                  )}
                </button>

                {message && (
                  <div
                    className={`mt-4 text-sm ${isSuccess ? 'text-green-600' : 'text-red-600'
                      } bg-white/80 p-3 rounded-lg text-center`}
                  >
                    {message}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterSubscription;