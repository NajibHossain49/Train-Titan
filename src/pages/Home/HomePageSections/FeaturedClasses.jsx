import React, { useEffect, useState } from "react";
import axios from "axios";

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
    return <p className="text-center text-red-500 p-4">{error}</p>;
  }

  if (classes.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-pulse text-lg text-gray-600">
          Loading featured classes...
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
          Featured Classes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {classes.map((classItem) => (
            <div
              key={classItem._id}
              className="relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              {/* Image Section */}
              <div className="relative h-48">
                <img
                  src={classItem.image}
                  alt={classItem.className}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Content Section */}
              <div className="p-6 flex flex-col justify-between h-52">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {classItem.className}
                  </h3>
                  <p className="text-gray-600 line-clamp-3">{classItem.details}</p>
                </div>
                <p className="text-blue-600 font-semibold mt-4">
                  Total Bookings: {classItem.bookingCount}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedClasses;
