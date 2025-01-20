import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const TestimonialsCarousel = () => {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/reviews`);
        const data = await response.json();
        setReviews(data.reviews);
      } catch (err) {
        setError("Failed to fetch reviews. Please try again later.");
      }
    };
    fetchReviews();

    // Add responsive handling
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const cardsToShow = isMobile ? 1 : 3;

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev >= Math.max(0, reviews.length - cardsToShow) ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? Math.max(0, reviews.length - cardsToShow) : prev - 1
    );
  };

  if (error) {
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded-lg shadow-sm">
        <p className="font-medium text-center">{error}</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-10 h-10 border-4 border-blue-500 rounded-full border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        What Our Clients Say About Us
      </h2>

      <div className="relative">
        <div className="overflow-hidden px-4">
          <div
            className="flex transition-transform duration-500 ease-out gap-4 sm:gap-6"
            style={{ transform: `translateX(-${currentSlide * (100 / cardsToShow)}%)` }}
          >
            {reviews.map((review) => (
              <div
                key={review._id}
                className={`${isMobile ? 'w-full' : 'w-1/3'} flex-shrink-0`}
              >
                <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 h-full border border-gray-100">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-lg font-bold transform hover:scale-105 transition-transform duration-200">
                      {review.userName.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-200">
                        {review.userName}
                      </h3>
                      <div className="flex items-center mt-1 space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={`${
                              i < review.rating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-200'
                            } transition-colors duration-200`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600">
                      Trained by{' '}
                      <span className="font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200">
                        {review.trainerName}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-4 bg-white p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          disabled={currentSlide === 0}
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-4 bg-white p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          disabled={currentSlide >= reviews.length - cardsToShow}
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>

        <div className="flex justify-center mt-8 gap-2">
          {Array.from({ length: Math.ceil(reviews.length / cardsToShow) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index * cardsToShow)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                Math.floor(currentSlide / cardsToShow) === index
                  ? 'bg-blue-600 w-6'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsCarousel;