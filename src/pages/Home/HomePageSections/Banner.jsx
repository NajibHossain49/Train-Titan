import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BannerSlider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const images = [
        "/images/banner1.jpg",
        "/images/banner2.jpg",
        "/images/banner3.jpg",
    ];

    const texts = [
        {
            title: "Transform Your Life",
            subtitle: "Start your fitness journey with expert guidance",
        },
        {
            title: "Achieve Your Goals",
            subtitle: "Expert trainers to guide your fitness journey",
        },
        {
            title: "Join Our Community",
            subtitle: "Connect with like-minded fitness enthusiasts",
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            handleNext();
        }, 5000);
        return () => clearInterval(timer);
    }, [currentSlide]);

    const handleNext = () => {
        if (!isAnimating) {
            setIsAnimating(true);
            setCurrentSlide((prev) => (prev + 1) % images.length);
            setTimeout(() => setIsAnimating(false), 1000);
        }
    };

    const handlePrev = () => {
        if (!isAnimating) {
            setIsAnimating(true);
            setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
            setTimeout(() => setIsAnimating(false), 1000);
        }
    };

    const handleDotClick = (index) => {
        if (!isAnimating && index !== currentSlide) {
            setIsAnimating(true);
            setCurrentSlide(index);
            setTimeout(() => setIsAnimating(false), 1000);
        }
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden">
            {/* Slides */}
            {images.map((img, index) => (
                <div
                    key={index}
                    className={`absolute w-full h-full transition-all duration-1000 ease-in-out transform
            ${currentSlide === index
                            ? "opacity-100 translate-x-0"
                            : currentSlide < index
                                ? "opacity-0 translate-x-full"
                                : "opacity-0 -translate-x-full"
                        }`}
                >
                    <img
                        src={img}
                        alt={`Slide ${index + 1}`}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    </div>

                    <div className="absolute inset-0 flex items-center justify-start px-8 md:px-16">
                        <div className="max-w-xl space-y-6">
                            <h1
                                className={`text-4xl md:text-6xl font-bold text-white transform transition-all duration-1000 delay-300
                  ${currentSlide === index ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                            >
                                {texts[index].title}
                            </h1>

                            <p
                                className={`text-lg md:text-xl text-gray-200 transform transition-all duration-1000 delay-500
                  ${currentSlide === index ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                            >
                                {texts[index].subtitle}
                            </p>

                            <Link to="/allClasses">
                                <button
                                    className={`px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 
                    hover:to-purple-700 rounded-lg text-white font-semibold transform transition-all duration-300 
                    hover:scale-105 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-opacity-50
                    ${currentSlide === index ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                                >
                                    Get Started
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation Arrows */}
            <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white
          hover:bg-black/50 transition-all duration-300 backdrop-blur-sm"
            >
                <ChevronLeft size={24} />
            </button>

            <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white
          hover:bg-black/50 transition-all duration-300 backdrop-blur-sm"
            >
                <ChevronRight size={24} />
            </button>

            {/* Dots Navigation */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => handleDotClick(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 transform
              ${currentSlide === index
                                ? "bg-white scale-125 shadow-lg"
                                : "bg-white/50 hover:bg-white/75 hover:scale-110"}`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default BannerSlider;