import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AllClassesSection = () => {
  const navigate = useNavigate();
  const [hoveredTrainer, setHoveredTrainer] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/classes`);
        if (response.data.success) {
          setClasses(response.data.classes);
        }
      } catch (err) {
        setError('Failed to fetch classes. Please try again later.');
        console.error('Error fetching classes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const handleTrainerClick = (trainerId) => {
    navigate(`/trainer/${trainerId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-xl text-gray-600">Loading classes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">All Classes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((classItem) => (
          <div
            key={classItem._id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={classItem.image}
                alt={classItem.className}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {classItem.className}
              </h3>
              <p className="text-gray-600 mb-4">{classItem.details}</p>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Additional Information:
                </h4>
                <pre className="text-sm text-gray-600 whitespace-pre-line">
                  {classItem.additionalInfo}
                </pre>
              </div>

              <div>
                <h4 className="text-md font-medium text-gray-700 mb-2">
                  Class Trainers
                </h4>
                <div className="flex flex-wrap gap-3">
                  {classItem.trainer.flat().map((trainer) => (
                    <div
                      key={trainer.id}
                      className="relative"
                      onMouseEnter={() => setHoveredTrainer(trainer.id)}
                      onMouseLeave={() => setHoveredTrainer(null)}
                      onClick={() => handleTrainerClick(trainer.id)}
                    >
                      <img
                        src={trainer.profile.image}
                        alt={trainer.name}
                        className="w-16 h-16 rounded-full cursor-pointer border-2 border-gray-200 hover:border-blue-500 transition-all duration-300 object-cover"
                      />
                      {hoveredTrainer === trainer.id && (
                        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-3 py-1 rounded text-sm whitespace-nowrap z-10">
                          {trainer.name}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllClassesSection;