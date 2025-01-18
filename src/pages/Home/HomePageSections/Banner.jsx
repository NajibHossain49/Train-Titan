import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TypingEffect from "react-typing-effect";

const images = [
    "/images/banner1.jpg",
    "/images/banner2.jpg",
    "/images/banner3.jpg",
];

export const BannerSlider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative h-screen w-full overflow-hidden">
            {images.map((img, index) => (
                <div
                    key={index}
                    className={`absolute w-full h-full transition-all duration-1000 ease-in-out ${currentSlide === index ? "opacity-100 scale-100" : "opacity-0 scale-105"
                        }`}
                >
                    <img
                        src={img}
                        alt={`Language Learning Slide ${index + 1}`}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
                        <div className="ml-16 text-white max-w-xl">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold mb-6 text-violet-300">
                                <TypingEffect
                                    text="Transform Your Life"
                                    speed={100}
                                    eraseDelay={2000}
                                    typingDelay={500}
                                    eraseSpeed={50}
                                />
                            </h1>
                            <p className="sm:text-base text-cyan-200 mb-8">
                                <TypingEffect
                                    text="Start your fitness journey with expert guidance"
                                    speed={80}
                                    eraseDelay={2000}
                                    typingDelay={500}
                                    eraseSpeed={50}
                                />
                            </p>
                            <Link to='/allClasses'>
                                <button className="px-6 py-3 bg-violet-600 hover:bg-violet-700 transition-colors rounded-lg text-white font-semibold">
                                    Get Started
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-4 h-4 rounded-full transition-all ${currentSlide === index
                            ? "bg-white scale-125 shadow-lg"
                            : "bg-gray-400 hover:scale-110"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default BannerSlider;