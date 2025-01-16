import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AllClasses = () => {
  const [classes, setClasses] = useState([]);
  const API_URL = `${import.meta.env.VITE_API_URL}/classes`;

  useEffect(() => {
    // Fetch data from the API
    axios
      .get(API_URL)
      .then((response) => {
        if (response.data.success) {
          setClasses(response.data.slots);
        }
      })
      .catch((error) => console.error('Error fetching classes:', error));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-8">All Classes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((classItem) => (
          <div
            key={classItem._id}
            className="border border-gray-300 rounded-lg shadow-lg p-4 bg-white"
          >
            <img
              src={classItem.classImage}
              alt={classItem.className}
              className="w-full h-40 object-cover rounded-lg"
            />
            <h2 className="text-xl font-semibold mt-4">
              {classItem.className}
            </h2>
            <p className="text-gray-600 text-sm mt-2">
              {classItem.classDetails}
            </p>
            <div className="relative mt-6 text-center">
              <img
                src={classItem.trainerProfile.profileImage}
                alt={classItem.trainerName}
                className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-gray-200"
              />
              <div className="absolute top-0 left-0 w-20 h-20 rounded-full bg-black bg-opacity-70 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity duration-300">
                <span className="text-sm font-medium">
                  {classItem.trainerName}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllClasses;
