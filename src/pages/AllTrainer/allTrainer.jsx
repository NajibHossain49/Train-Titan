import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AllTrainer = () => {
  const [trainers, setTrainers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/approvedTrainers`);
        if (response.data.success) {
          setTrainers(response.data.trainers);
        }
      } catch (error) {
        console.error("Error fetching trainers:", error);
      }
    };
    fetchTrainers();
  }, []);

  const handleKnowMore = (id) => {
    navigate(`/trainer/${id}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold text-center mb-8">All Trainers</h1>
      <div className="flex flex-wrap gap-6 justify-center">
        {trainers.map((trainer) => (
          <div
            key={trainer._id}
            className="w-80 bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200"
          >
            <img
              src={trainer.profileImage || "/fallback-image.png"}
              alt={trainer.fullName}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800">{trainer.fullName}</h2>
              <p className="text-gray-600 mt-1">Years of Experience: {trainer.yearsOfExperience}</p>
              <div className="flex gap-4 mt-3">
                {trainer.socialLinks?.facebook && (
                  <a href={trainer.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                    <img src="/icons/facebook.png" alt="Facebook" className="w-6 h-6" />
                  </a>
                )}
                {trainer.socialLinks?.instagram && (
                  <a href={trainer.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                    <img src="/icons/instagram.png" alt="Instagram" className="w-6 h-6" />
                  </a>
                )}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-800">Available Slots</h3>
              <ul className="list-disc pl-5 mt-2 text-gray-600">
                {trainer.availableDays.map((day) => (
                  <li key={day.value} className="mb-1">
                    {day.label} in the {trainer.timeSlot}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-gray-600">Session Duration: {trainer.sessionDuration} hours</p>
              <button
                onClick={() => handleKnowMore(trainer._id)}
                className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
              >
                Know More
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllTrainer;
