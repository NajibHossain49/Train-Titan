import React, { useEffect, useState } from "react";
import axios from "axios";
import { Clock, Users, ChevronRight, Dumbbell, Loader2 } from "lucide-react";

const FeaturedClasses = () => {
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeaturedClasses = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/featured-classes`);
        if (response.data.success) {
          setClasses(response.data.featuredClasses);
        } else {
          setError("Failed to retrieve featured classes. Please try again later.");
        }
      } catch (err) {
        setError("An error occurred while fetching featured classes.");
      }
    };
    fetchFeaturedClasses();
  }, []);

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md max-w-md">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="ml-3 text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (classes.length === 0) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-lg text-gray-600 animate-pulse">Loading featured classes...</p>
      </div>
    );
  }

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Featured Classes
          </h2>
          <p className="text-lg text-gray-600">
            Discover our most popular fitness classes designed to help you achieve your goals
          </p>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {classes.map((classItem) => (
            <div
              key={classItem._id}
              className="group bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-[500px]"
            >
              {/* Image Container - Fixed Height */}
              <div className="relative h-56 flex-shrink-0">
                <img
                  src={classItem.image}
                  alt={classItem.className}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Overlay Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <div className="flex items-center space-x-4 text-white">
                    {/* <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span className="text-sm">60 min</span>
                    </div> */}
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      <span className="text-sm">{classItem.bookingCount} joined</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Section - Flexible Height */}
              <div className="flex flex-col flex-grow p-6">
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    {classItem.className}
                  </h3>
                  <p className="text-gray-600 line-clamp-3">
                    {classItem.details}
                  </p>
                </div>

                {/* Footer Section - Fixed at Bottom */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Dumbbell className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">
                        {classItem.bookingCount} Bookings
                      </span>
                    </div>
                    <button className="flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors duration-300">
                      Learn More
                      <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedClasses;