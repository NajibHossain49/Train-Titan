import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import axios from 'axios';
import LoadingSpinner from '../../../components/Shared/LoadingSpinner';

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
        setTrainers(trainers.filter(t => t._id !== selectedTrainer._id));
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
        return skill.replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase());
      })
      .join(', ');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-7xl bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-center"><LoadingSpinner /></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-7xl bg-white rounded-xl shadow-lg p-8">
          <div className="text-red-500 text-center font-medium">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 sm:p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Approved Trainers</h2>

          <div className="grid grid-cols-1 gap-6 md:hidden">
            {trainers.map((trainer) => (
              <div key={trainer._id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <img
                      src={trainer.profileImage}
                      alt={trainer.fullName}
                      className="h-16 w-16 rounded-full object-cover border-2 border-gray-200"
                    />
                    <div className="ml-4">
                      <div className="font-semibold text-lg text-gray-900">{trainer.fullName}</div>
                      <div className="text-gray-600">Age: {trainer.age}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteClick(trainer)}
                    className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900">Contact Info</h4>
                    <div className="text-gray-600">{trainer.email}</div>
                    {trainer.socialLinks && (
                      <div className="flex space-x-3 mt-1">
                        {trainer.socialLinks.facebook && (
                          <a href={trainer.socialLinks.facebook} target="_blank" rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
                            Facebook
                          </a>
                        )}
                        {trainer.socialLinks.instagram && (
                          <a href={trainer.socialLinks.instagram} target="_blank" rel="noopener noreferrer"
                            className="text-sm text-pink-600 hover:text-pink-800 transition-colors">
                            Instagram
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900">Expertise</h4>
                    <div className="text-gray-600">Experience: {trainer.yearsOfExperience} years</div>
                    <div className="text-gray-600">Skills: {formatSkills(trainer.skills)}</div>
                    <div className="text-gray-600">Certification: #{trainer.certificationNumber}</div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900">Availability</h4>
                    <div className="text-gray-600">Days: {trainer.availableDays.map(day => day.label).join(', ')}</div>
                    <div className="text-gray-600">Time: {trainer.timeSlot}</div>
                    <div className="text-gray-600">Duration: {trainer.sessionDuration} hours</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                    Trainer
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                    Expertise
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                    Availability
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {trainers.map((trainer) => (
                  <tr key={trainer._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={trainer.profileImage}
                          alt={trainer.fullName}
                          className="h-12 w-12 rounded-full object-cover border-2 border-gray-200"
                        />
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">{trainer.fullName}</div>
                          <div className="text-sm text-gray-500">Age: {trainer.age}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{trainer.email}</div>
                      {trainer.socialLinks && (
                        <div className="flex space-x-3 mt-1">
                          {trainer.socialLinks.facebook && (
                            <a href={trainer.socialLinks.facebook} target="_blank" rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
                              Facebook
                            </a>
                          )}
                          {trainer.socialLinks.instagram && (
                            <a href={trainer.socialLinks.instagram} target="_blank" rel="noopener noreferrer"
                              className="text-sm text-pink-600 hover:text-pink-800 transition-colors">
                              Instagram
                            </a>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-900">
                          Experience: {trainer.yearsOfExperience} years
                        </div>
                        <div className="text-sm text-gray-600">
                          Skills: {formatSkills(trainer.skills)}
                        </div>
                        <div className="text-sm text-gray-600">
                          Certification: #{trainer.certificationNumber}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-900">
                          Days: {trainer.availableDays.map(day => day.label).join(', ')}
                        </div>
                        <div className="text-sm text-gray-600">
                          Time: {trainer.timeSlot}
                        </div>
                        <div className="text-sm text-gray-600">
                          Duration: {trainer.sessionDuration} hours
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
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
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">Remove Trainer Role</h3>
            <p className="text-gray-600">
              This will remove the trainer role from {selectedTrainer?.fullName} and change their status back to Member.
              Are you sure you want to continue?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllApprovedTrainers;