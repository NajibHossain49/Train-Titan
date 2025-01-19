import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';

const AppliedTrainerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionFeedback, setRejectionFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAppliedTrainerDetails();
  }, [id]);

  const fetchAppliedTrainerDetails = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/trainers/${id}`);
      if (response.data.success) {
        setTrainer(response.data.trainer);
      } else {
        toast.error('Failed to fetch trainer details');
      }
    } catch (error) {
      console.error('Error fetching trainer details:', error);
      toast.error('Error loading trainer details');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmation = async () => {
    const result = await Swal.fire({
      title: 'Confirm Application',
      text: "Are you sure you want to approve this trainer's application?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#059669',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, approve it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      handleConfirm();
    }
  };

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);
      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/trainers/${id}/confirm`, {
        status: 'Approved'
      });
      
      if (response.data.success) {
        toast.success('Trainer application approved successfully');
        navigate('/allTrainer');
      } else {
        toast.error('Failed to approve trainer application');
      }
    } catch (error) {
      console.error('Error confirming trainer:', error);
      toast.error('Error approving trainer application');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionFeedback.trim()) {
      toast.error('Please provide rejection feedback');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/trainers/${id}/reject`, {
        feedback: rejectionFeedback
      });
      
      if (response.data.success) {
        toast.success('Trainer application rejected');
        setShowRejectModal(false);
        navigate('/allTrainer');
      } else {
        toast.error('Failed to reject trainer application');
      }
    } catch (error) {
      console.error('Error rejecting trainer:', error);
      toast.error('Error rejecting trainer application');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-600"></div>
      </div>
    );
  }

  if (!trainer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md w-full">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Trainer not found</h2>
          <button
            onClick={() => navigate('/allTrainer')}
            className="w-full px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 font-semibold"
          >
            Back to Trainers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <img 
                src={trainer.profileImage} 
                alt={trainer.fullName}
                className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-white mb-2">{trainer.fullName}</h1>
                <p className="text-emerald-100 text-lg mb-4">{trainer.email}</p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <span className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-full">
                    Age: {trainer.age} years
                  </span>
                  <span className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-full">
                    Experience: {trainer.yearsOfExperience} years
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Skills Section */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Skills & Expertise</h2>
              <div className="flex flex-wrap gap-3">
                {Object.entries(trainer.skills || {}).map(([skill, hasSkill]) => 
                  hasSkill && (
                    <span 
                      key={skill} 
                      className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      {skill.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Availability Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Schedule</h2>
                <div className="space-y-3">
                  <div>
                    <span className="font-semibold text-gray-700">Available Days:</span>
                    <p className="text-gray-600 mt-1">{trainer.availableDays?.map(day => day.label).join(', ')}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Time Slot:</span>
                    <p className="text-gray-600 mt-1">{trainer.timeSlot}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Session Duration:</span>
                    <p className="text-gray-600 mt-1">{trainer.sessionDuration} hours</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Certification</h2>
                <div className="space-y-3">
                  <div>
                    <span className="font-semibold text-gray-700">Certificate Number:</span>
                    <p className="text-gray-600 mt-1">{trainer.certificationNumber}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                onClick={handleConfirmation}
                disabled={isSubmitting}
                className={`flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg transition-all duration-200 transform hover:scale-105 font-semibold ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-emerald-700'
                }`}
              >
                {isSubmitting ? 'Processing...' : 'Confirm Application'}
              </button>
              <button
                onClick={() => setShowRejectModal(true)}
                disabled={isSubmitting}
                className={`flex-1 px-6 py-3 bg-red-600 text-white rounded-lg transition-all duration-200 transform hover:scale-105 font-semibold ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'
                }`}
              >
                Reject Application
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full m-4">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Reject Application</h3>

            {/* Trainer Information Section */}
            <div className="mb-6 border-b border-gray-200 pb-6">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <img
                  src={trainer.profileImage}
                  alt={trainer.fullName}
                  className="w-24 h-24 rounded-full object-cover shadow-md"
                />
                <div className="text-center sm:text-left">
                  <h4 className="text-xl font-semibold text-gray-800">{trainer.fullName}</h4>
                  <p className="text-gray-600 mb-2">{trainer.email}</p>
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                      Age: {trainer.age} years
                    </span>
                    <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                      Experience: {trainer.yearsOfExperience} years
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Rejection Feedback Section */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Rejection Feedback <span className="text-red-500">*</span>
              </label>
              <textarea
                value={rejectionFeedback}
                onChange={(e) => setRejectionFeedback(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 h-32 resize-none"
                placeholder="Please provide detailed feedback for rejection..."
                disabled={isSubmitting}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-4">
              <button
                onClick={() => setShowRejectModal(false)}
                disabled={isSubmitting}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={isSubmitting}
                className={`px-6 py-3 bg-red-600 text-white rounded-lg transition-all duration-200 transform hover:scale-105 font-semibold ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'
                }`}
              >
                {isSubmitting ? 'Processing...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppliedTrainerDetails;