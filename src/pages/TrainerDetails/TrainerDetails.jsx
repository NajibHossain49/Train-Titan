import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const TrainerDetails = () => {
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrainerDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/approvedTrainers/${id}`
        );
        if (response.data.success) {
          setTrainer(response.data.trainer);
        }
      } catch (error) {
        setError("Failed to fetch trainer details");
        console.error("Error fetching trainer details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainerDetails();
  }, [id]);

  const getActiveSkills = (skills) => {
    return Object.entries(skills || {})
      .filter(([_, value]) => value === true)
      .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Trainer Information Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Trainer Information
          </h2>
          <div className="space-y-6">
            <div className="aspect-square relative overflow-hidden rounded-lg">
              <img
                src={trainer?.profileImage}
                alt={trainer?.fullName}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-800">{trainer?.fullName}</h3>

              <div>
                <p className="font-semibold text-gray-700">Age:</p>
                <p className="text-gray-600 mt-1">{trainer?.age} years</p>
              </div>

              <div>
                <p className="font-semibold text-gray-700">Experience:</p>
                <p className="text-gray-600 mt-1">{trainer?.yearsOfExperience} years</p>
              </div>

              <div className="space-y-2">
                <p className="font-semibold text-gray-700">Skills:</p>
                <div className="flex flex-wrap gap-2">
                  {getActiveSkills(trainer?.skills).map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-semibold text-gray-700">Available Days:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {trainer?.availableDays?.map((day, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                    >
                      {day.label}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-semibold text-gray-700">Available Time:</p>
                <p className="text-gray-600 mt-1">
                  Available in the {trainer?.timeSlot} for {trainer?.sessionDuration} hours
                </p>
              </div>

              <div className="space-y-2">
                <p className="font-semibold text-gray-700">Social Links:</p>
                <div className="flex gap-4">
                  {trainer?.socialLinks?.facebook && (
                    <a
                      href={trainer.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Facebook
                    </a>
                  )}
                  {trainer?.socialLinks?.instagram && (
                    <a
                      href={trainer.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-600 hover:text-pink-800"
                    >
                      Instagram
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Available Time Slots Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Available Time Slots
          </h2>
          <div className="space-y-4">
            {trainer?.availableDays?.map((day, index) => (
              <button
                key={index}
                className="w-full p-4 rounded-lg text-left bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                onClick={() => navigate(`/TrainerBooked/${trainer._id}/${day.value}`)}
              >
                <div className="space-y-1">
                  <p className="font-semibold">{day.label}</p>
                  <p className="text-sm">
                    Available in the {trainer.timeSlot} for {trainer.sessionDuration} hours
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Be A Trainer Section */}
      <div className="mt-8 bg-gray-100 p-6 rounded-lg text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Be A Trainer</h2>
        <p className="text-gray-600 mb-6">
          Want to share your skills and help others reach their goals? Join our
          platform as a trainer today!
        </p>
        <button
          className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors"
          onClick={() => navigate("/becomeTrainer")}
        >
          Become a Trainer
        </button>
      </div>
    </div>
  );
};

export default TrainerDetails;