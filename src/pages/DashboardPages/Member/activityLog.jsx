import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, X } from "lucide-react";
import useAuth from "../../../hooks/useAuth";
import axios from "axios";
import { TbFidgetSpinner } from 'react-icons/tb';
const AppliedTrainer = () => {
    const [trainerData, setTrainerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        const fetchTrainerData = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/trainersByEmail/${user.email}`
                );
                
                if (response.data.success) {
                    setTrainerData(response.data.trainer);
                } else {
                    setError(response.data.message || "Failed to fetch trainer data");
                }
            } catch (error) {
                setError(error.response?.data?.message || "Error fetching trainer data");
            } finally {
                setLoading(false);
            }
        };

        if (user?.email) {
            fetchTrainerData();
        }
    }, [user]);

    const handleDetails = (id) => {
        navigate(`/dashboard/applied-trainer/${id}`);
    };

    // Close modal when clicking outside
    const handleOverlayClick = (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            setShowModal(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                    <TbFidgetSpinner className="w-16 h-16 animate-spin text-indigo-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <p className="text-lg text-red-600">{error}</p>
            </div>
        );
    }

    if (!trainerData) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <p className="text-lg text-gray-600">You do not have pending status</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">My Application Status</h1>
            <div className="overflow-x-auto shadow-lg rounded-lg">
                <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                    <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
                        <tr>
                            <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Profile</th>
                            <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Name</th>
                            <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Email</th>
                            <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Status</th>
                            <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="hover:bg-gray-50 transition-colors duration-200">
                            <td className="py-4 px-6">
                                <img
                                    src={trainerData.profileImage}
                                    alt={trainerData.fullName}
                                    className="w-14 h-14 rounded-full object-cover border-2 border-gray-200 shadow-sm"
                                />
                            </td>
                            <td className="py-4 px-6 text-gray-800 font-medium">{trainerData.fullName}</td>
                            <td className="py-4 px-6 text-gray-600">{trainerData.email}</td>
                            <td className="py-4 px-6">
                                <span
                                    className={`py-1.5 px-4 rounded-full text-sm font-medium ${
                                        trainerData.status === "Pending"
                                            ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                            : "bg-red-100 text-red-800 border border-red-200"
                                    }`}
                                >
                                    {trainerData.status}
                                </span>
                            </td>
                            <td className="py-4 px-6">
                                {trainerData.status.toLowerCase() === "rejected" && (
                                    <button
                                        onClick={() => setShowModal(true)}
                                        className="p-2 text-gray-700 hover:text-red-600 transition-colors duration-200 rounded-full hover:bg-red-50"
                                        title="View Rejection Feedback"
                                    >
                                        <Eye className="w-5 h-5" />
                                    </button>
                                )}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Custom Modal */}
            {showModal && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center modal-overlay"
                    onClick={handleOverlayClick}
                >
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 scale-100">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-800">Application Feedback</h3>
                            <button 
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        {/* Modal Content */}
                        <div className="px-6 py-4">
                            <div className="mb-4">
                                <h4 className="text-sm font-medium text-gray-500 mb-2">Rejection Feedback:</h4>
                                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100">
                                    {trainerData.rejectionFeedback || "No feedback provided"}
                                </p>
                            </div>
                            
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <p className="text-sm text-gray-500">
                                    Rejected on: {' '}
                                    <span className="font-medium">
                                        {new Date(trainerData.rejectedAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </p>
                            </div>
                        </div>
                        
                        {/* Modal Footer */}
                        <div className="px-6 py-4 bg-gray-50 rounded-b-lg">
                            <button
                                onClick={() => setShowModal(false)}
                                className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AppliedTrainer;