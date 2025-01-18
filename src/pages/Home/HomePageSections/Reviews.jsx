import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const TestimonialsCarousel = () => {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);

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
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev >= Math.max(0, reviews.length - 3) ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? Math.max(0, reviews.length - 3) : prev - 1
    );
  };

  const getVisibleCards = () => {
    const visibleReviews = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentSlide + i) % reviews.length;
      visibleReviews.push(reviews[index]);
    }
    return visibleReviews;
  };

  if (error) {
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded-lg">
        {error}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-blue-500 rounded-full border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        What Our Clients Say
      </h2>

      <div className="relative">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out gap-6"
            style={{ transform: `translateX(-${currentSlide * (100 / 3)}%)` }}
          >
            {reviews.map((review) => (
              <div
                key={review._id}
                className="w-1/3 flex-shrink-0"
              >
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-lg font-bold">
                      {review.userName.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {review.userName}
                      </h3>
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={`${i < review.rating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                              }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* <blockquote className="text-gray-600 italic text-sm mb-4 line-clamp-3">
                    "{review.review}"
                  </blockquote> */}

                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-500">
                      Trained by <span className="font-medium text-blue-600">{review.trainerName}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={currentSlide === 0}
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={currentSlide >= reviews.length - 3}
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>

        <div className="flex justify-center mt-8 gap-2">
          {Array.from({ length: Math.ceil(reviews.length / 3) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index * 3)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${Math.floor(currentSlide / 3) === index
                ? 'bg-blue-600 w-4'
                : 'bg-gray-300 hover:bg-gray-400'
                }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsCarousel;