import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import axios from 'axios';

const AllApprovedTrainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/approvedTrainers`);
      
      if (data.success) {
        setTrainers(data.trainers);
      } else {
        setError('Failed to fetch trainers');
      }
    } catch (err) {
      setError('Failed to fetch trainers');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (trainer) => {
    setSelectedTrainer(trainer);
    setShowConfirmDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTrainer) return;
  
    try {
      const { data } = await axios.patch(
        `${import.meta.env.VITE_API_URL}/trainer/${selectedTrainer._id}`,
        { status: 'Member' },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (data.success) {
        // Remove the trainer from the local state
        setTrainers(trainers.filter(t => t._id !== selectedTrainer._id));
        // Show success message if you have a toast notification system
        console.log("Trainer role removed successfully");
      } else {
        setError('Failed to update trainer status');
      }
    } catch (err) {
      console.error('Error updating trainer status:', err);
      setError(err.response?.data?.error || 'Failed to update trainer status');
    } finally {
      setShowConfirmDialog(false);
      setSelectedTrainer(null);
    }
  };

  const formatSkills = (skills) => {
    return Object.entries(skills)
      .filter(([, value]) => value)
      .map(([skill]) => {
        // Convert camelCase to Title Case
        return skill.replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase());
      })
      .join(', ');
  };

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6 bg-white rounded-lg shadow">
        <div className="text-gray-600">Loading trainers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6 bg-white rounded-lg shadow">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Approved Trainers</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trainer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expertise
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Availability
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {trainers.map((trainer) => (
                <tr key={trainer._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img 
                        src={trainer.profileImage} 
                        alt={trainer.fullName}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">{trainer.fullName}</div>
                        <div className="text-sm text-gray-500">Age: {trainer.age}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{trainer.email}</div>
                    <div className="text-sm text-gray-500">
                      {trainer.socialLinks && (
                        <div className="flex space-x-2 mt-1">
                          {trainer.socialLinks.facebook && (
                            <a href={trainer.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                              Facebook
                            </a>
                          )}
                          {trainer.socialLinks.instagram && (
                            <a href={trainer.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-800">
                              Instagram
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      Experience: {trainer.yearsOfExperience} years
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Skills: {formatSkills(trainer.skills)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Certification: #{trainer.certificationNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      Days: {trainer.availableDays.map(day => day.label).join(', ')}
                    </div>
                    <div className="text-sm text-gray-500">
                      Time: {trainer.timeSlot}
                    </div>
                    <div className="text-sm text-gray-500">
                      Duration: {trainer.sessionDuration} hours
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleDeleteClick(trainer)}
                      className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Confirmation Dialog */}
        {showConfirmDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-medium mb-4">Remove Trainer Role</h3>
              <p className="text-gray-600 mb-6">
                This will remove the trainer role from {selectedTrainer?.fullName} and change their status back to Member. 
                Are you sure you want to continue?
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowConfirmDialog(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllApprovedTrainers;