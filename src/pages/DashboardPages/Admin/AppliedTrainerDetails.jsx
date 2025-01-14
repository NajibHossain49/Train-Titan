import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (!trainer) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-gray-800">Trainer not found</h2>
        <button
          onClick={() => navigate('/allTrainer')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Trainers
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header with Image and Basic Info */}
        <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
          <img 
            src={trainer.profileImage} 
            alt={trainer.fullName}
            className="w-32 h-32 rounded-lg object-cover"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{trainer.fullName}</h1>
            <p className="text-gray-600 mb-2">{trainer.email}</p>
            <p className="text-gray-600">Age: {trainer.age} years</p>
            <p className="text-gray-600">Experience: {trainer.yearsOfExperience} years</p>
          </div>
        </div>

        {/* Skills Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(trainer.skills || {}).map(([skill, hasSkill]) => 
              hasSkill && (
                <span 
                  key={skill} 
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  {skill.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              )
            )}
          </div>
        </div>

        {/* Availability Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Availability</h2>
          <p className="text-gray-600">Days: {trainer.availableDays?.map(day => day.label).join(', ')}</p>
          <p className="text-gray-600">Time Slot: {trainer.timeSlot}</p>
          <p className="text-gray-600">Session Duration: {trainer.sessionDuration} hours</p>
        </div>

        {/* Certification */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Certification</h2>
          <p className="text-gray-600">Number: {trainer.certificationNumber}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className={`px-6 py-2 bg-green-600 text-white rounded-lg transition-colors ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
            }`}
          >
            {isSubmitting ? 'Processing...' : 'Confirm Application'}
          </button>
          <button
            onClick={() => setShowRejectModal(true)}
            disabled={isSubmitting}
            className={`px-6 py-2 bg-red-600 text-white rounded-lg transition-colors ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'
            }`}
          >
            Reject Application
          </button>
        </div>
      </div>

      {/* Reject Modal */}
      {/* Reject Modal */}
{showRejectModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg p-6 max-w-lg w-full">
      <h3 className="text-xl font-bold mb-4">Reject Application</h3>

      {/* Trainer Information Section */}
      <div className="mb-6 border-b pb-4">
        <div className="flex items-center gap-4">
          <img
            src={trainer.profileImage}
            alt={trainer.fullName}
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div>
            <h4 className="text-lg font-semibold text-gray-800">{trainer.fullName}</h4>
            <p className="text-gray-600">{trainer.email}</p>
            <p className="text-gray-600 text-sm">Age: {trainer.age} years</p>
            <p className="text-gray-600 text-sm">
              Experience: {trainer.yearsOfExperience} years
            </p>
          </div>
        </div>
        {/* Skills */}
        <div className="mt-4">
          <h5 className="font-semibold text-gray-800">Skills:</h5>
          <div className="flex flex-wrap gap-2 mt-2">
            {Object.entries(trainer.skills || {}).map(
              ([skill, hasSkill]) =>
                hasSkill && (
                  <span
                    key={skill}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {skill.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                )
            )}
          </div>
        </div>
      </div>

      {/* Rejection Feedback Section */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">
          Rejection Feedback <span className="text-red-500">*</span>
        </label>
        <textarea
          value={rejectionFeedback}
          onChange={(e) => setRejectionFeedback(e.target.value)}
          className="w-full p-3 border rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Please provide feedback for rejection..."
          disabled={isSubmitting}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <button
          onClick={() => setShowRejectModal(false)}
          disabled={isSubmitting}
          className="px-4 py-2 border rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleReject}
          disabled={isSubmitting}
          className={`px-4 py-2 bg-red-600 text-white rounded-lg transition-colors ${
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