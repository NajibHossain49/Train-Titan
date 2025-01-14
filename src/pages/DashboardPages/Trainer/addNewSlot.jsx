import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAuth from '../../../hooks/useAuth';

const AddNewSlot = () => {
  const [trainerData, setTrainerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTrainerData = async () => {
      try {
        // Updated endpoint to fetch directly by email
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/approvedTrainers/${user.email}`);
        const data = response.data;

        if (data.success) {
          setTrainerData(data.trainer); // Now directly getting the trainer data
        } else {
          setError('No trainer data found for your email.');
        }
      } catch (err) {
        setError('Error connecting to the server. Please try again.');
        console.error('Error fetching trainer data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchTrainerData();
    }
  }, [user]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-[400px]">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  if (!trainerData) {
    return <div className="text-center p-4">No trainer data found</div>;
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="border-b pb-4 mb-6">
        <h1 className="text-2xl font-bold">Trainer Profile</h1>
      </div>

      <div className="space-y-6">
        {/* Basic Info */}
        <div className="flex items-center space-x-4">
          <img 
            src={trainerData.profileImage} 
            alt={trainerData.fullName}
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
          />
          <div>
            <h2 className="text-xl font-semibold">{trainerData.fullName}</h2>
            <p className="text-gray-600">{trainerData.email}</p>
            <p className="text-gray-700">Age: {trainerData.age}</p>
            <p className="text-gray-700">{trainerData.yearsOfExperience} Years of Experience</p>
          </div>
        </div>

        {/* Skills */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(trainerData.skills).map(([skill, hasSkill]) => (
              hasSkill && (
                <span 
                  key={skill}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {skill.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              )
            ))}
          </div>
        </div>

        {/* Availability */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Availability</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="mb-2">Time Slot: <span className="font-medium">{trainerData.timeSlot}</span></p>
            <p className="mb-2">Session Duration: <span className="font-medium">{trainerData.sessionDuration} hours</span></p>
            <div>
              <span className="font-medium">Available Days: </span>
              {trainerData.availableDays.map(day => day.label).join(', ')}
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Additional Information</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="mb-2">Certification Number: <span className="font-medium">{trainerData.certificationNumber}</span></p>
            <p>Status: <span className="font-medium">{trainerData.status}</span></p>
          </div>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Social Links</h3>
          <div className="space-y-2">
            {Object.entries(trainerData.socialLinks).map(([platform, link]) => (
              <a 
                key={platform}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 hover:text-blue-800 hover:underline"
              >
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewSlot;