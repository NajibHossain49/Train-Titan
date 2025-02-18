import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const ErrorPage = () => {
  const [redirect, setRedirect] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleBack = () => {
    setRedirect(true);
  };

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className={`transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        } bg-white rounded-2xl shadow-2xl p-8 w-full max-w-6xl mx-auto`}>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Image Section */}
          <div className="w-full lg:w-1/2 transform transition-transform duration-500 hover:scale-105">
            <img
              src="https://i.ibb.co/HdHH4Pb/Frame-6.png"
              alt="illustration"
              className="w-full"
            />
          </div>

          {/* Content Section */}
          <div className="w-full lg:w-1/2 text-center lg:text-left space-y-6">
            <h1 className="text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse">
              OOPS!
            </h1>

            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                Page Not Found
              </h2>

              <p className="text-lg text-gray-600">
                Looks like bigfoot has wandered off with this page. Let's get you back on track!
              </p>
            </div>

            <button
              onClick={handleBack}
              className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg 
                       bg-gradient-to-r from-blue-600 to-purple-600 text-white
                       font-semibold py-4 px-8 rounded-full
                       hover:from-blue-700 hover:to-purple-700
                       focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
            >
              Back to Homepage
            </button>

            {/* Additional Helper Text */}
            <p className="text-sm text-gray-500 mt-6">
              Error Code: 404 | Lost in Space
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;