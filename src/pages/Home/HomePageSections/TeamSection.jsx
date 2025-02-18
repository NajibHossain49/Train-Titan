import React, { useEffect, useState } from "react";
import axios from "axios";
import { Camera, Facebook, Instagram } from "lucide-react";

const TeamSection = () => {
  const [trainers, setTrainers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/approvedTrainers`);
        setTrainers(response.data.trainers);
      } catch (err) {
        setError("Failed to fetch trainers. Please try again later.");
      }
    };
    fetchTrainers();
  }, []);

  if (error) {
    return <p className="text-center text-red-500 p-4">{error}</p>;
  }

  if (trainers.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-pulse text-lg text-gray-600">
          Loading trainer profiles...
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
          Meet Our Expert Trainers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trainers.slice(0, 3).map((trainer) => (
            <div
              key={trainer._id}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full"
            >
              <div className="relative h-64 flex-shrink-0">
                {trainer.profileImage ? (
                  <img
                    src={trainer.profileImage}
                    alt={trainer.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <Camera className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {trainer.fullName}
                </h3>
                
                <div className="space-y-4 flex-grow">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                      Specializations
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(trainer.skills)
                        .filter(([_, value]) => value)
                        .map(([skill]) => (
                          <span
                            key={skill}
                            className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors duration-200"
                          >
                            {skill}
                          </span>
                        ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                      Experience
                    </h4>
                    <p className="text-gray-600">
                      {trainer.yearsOfExperience} years in fitness training
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-center gap-4">
                  <a
                    href={trainer.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-gray-100 hover:bg-blue-100 transition-colors duration-300"
                  >
                    <Facebook className="w-5 h-5 text-blue-600" />
                  </a>
                  <a
                    href={trainer.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-gray-100 hover:bg-pink-100 transition-colors duration-300"
                  >
                    <Instagram className="w-5 h-5 text-pink-600" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;