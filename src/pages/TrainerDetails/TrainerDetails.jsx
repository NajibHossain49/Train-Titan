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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-red-100 text-red-700 px-6 py-4 rounded-lg shadow-sm">
          <span className="font-semibold">Error:</span> {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Trainer Information Section */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-[1.02] transition-transform duration-300">
            <div className="p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Trainer Profile
              </h2>

              <div className="space-y-8">
                <div className="aspect-square relative rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src={trainer?.profileImage}
                    alt={trainer?.fullName}
                    className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="space-y-6">
                  <h3 className="text-3xl font-bold text-gray-800 border-b pb-2">{trainer?.fullName}</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-sm text-gray-500">Age</p>
                      <p className="text-lg font-semibold text-gray-800">{trainer?.age} years</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-sm text-gray-500">Experience</p>
                      <p className="text-lg font-semibold text-gray-800">{trainer?.yearsOfExperience} years</p>
                    </div>
                  </div>

                  {/* Certification Number */}
                  <div className="bg-blue-50 p-4 rounded-xl border-l-4 border-blue-500">
                    <p className="text-sm text-gray-500">Certification Number</p>
                    <p className="text-lg font-semibold text-blue-800">{trainer?.certificationNumber}</p>
                  </div>

                  <div>
                    <p className="text-gray-500 mb-3">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {getActiveSkills(trainer?.skills).map((skill, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-gray-500">Social Links</p>
                    <div className="flex gap-4">
                      {trainer?.socialLinks?.facebook && (
                        <a
                          href={trainer.socialLinks.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                          </svg>
                          Facebook
                        </a>
                      )}
                      {trainer?.socialLinks?.instagram && (
                        <a
                          href={trainer.socialLinks.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                          </svg>
                          Instagram
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Time Slots Section */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Available Time Slots
              </h2>

              <div className="grid gap-4">
                {trainer?.availableDays?.map((day, index) => (
                  <button
                    key={index}
                    className="w-full p-6 rounded-xl text-left bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
                    onClick={() => navigate(`/TrainerBooked/${trainer._id}/${day.value}`)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xl font-bold mb-2">{day.label}</p>
                        <p className="text-blue-100 text-lg font-bold">
                          Session: {trainer.timeSlot} • {trainer.sessionDuration} hours duration
                        </p>

                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Be A Trainer Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-xl p-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Want to be a Trainer?</h2>
              <p className="text-blue-100 mb-8">
                Share your expertise and help others achieve their fitness goals. Join our growing community of professional trainers!
              </p>
              <button
                className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors duration-300 transform hover:scale-105"
                onClick={() => navigate("/becomeTrainer")}
              >
                Become a Trainer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerDetails;