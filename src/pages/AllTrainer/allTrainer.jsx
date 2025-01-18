import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Loader2, Facebook, Instagram } from "lucide-react";

const AllTrainer = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
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
      } finally {
        setLoading(false);
      }
    };
    fetchTrainers();
  }, []);

  const handleKnowMore = (id) => {
    navigate(`/trainer/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">
          Our Professional Trainers
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trainers.map((trainer) => (
            <div
              key={trainer._id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
            >
              <div className="relative h-56">
                <img
                  src={trainer.profileImage || "/fallback-image.png"}
                  alt={trainer.fullName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h2 className="text-2xl font-bold text-white">{trainer.fullName}</h2>
                  <p className="text-gray-200">
                    {trainer.yearsOfExperience} Years Experience
                  </p>
                </div>
              </div>

              <div className="p-6 flex-grow flex flex-col">
                <div className="flex-grow">
                  <div className="flex gap-3 mb-4">
                    {trainer.socialLinks?.facebook && (
                      <a
                        href={trainer.socialLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
                      >
                        <Facebook className="w-5 h-5 text-blue-600" />
                      </a>
                    )}
                    {trainer.socialLinks?.instagram && (
                      <a
                        href={trainer.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-pink-100 rounded-full hover:bg-pink-200 transition-colors"
                      >
                        <Instagram className="w-5 h-5 text-pink-600" />
                      </a>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Available Sessions
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <ul className="space-y-1 text-gray-600">
                          {trainer.availableDays.map((day) => (
                            <li key={day.value} className="flex items-center">
                              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                              {day.label} • {trainer.timeSlot}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-blue-800">
                        Session Duration: {trainer.sessionDuration} hours
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleKnowMore(trainer._id)}
                  className="w-full mt-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Know More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllTrainer;