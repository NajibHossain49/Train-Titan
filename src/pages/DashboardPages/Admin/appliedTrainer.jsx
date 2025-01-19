import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";

const AppliedTrainer = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/trainers`);
                if (response.data.success) {
                    setApplications(response.data.trainers);
                } else {
                    console.error("Failed to fetch trainers:", response.data.error);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching trainers:", error);
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

    const handleDetails = (id) => {
        navigate(`/dashboard/applied-trainer/${id}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
                <div className="w-full max-w-7xl bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <div className="flex justify-center">
                        <LoadingSpinner />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 space-y-4">
                    <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                        Applied Trainers
                    </h1>
                    <p className="text-gray-600">
                        Manage and review trainer applications
                    </p>
                </div>

                {applications.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-medium text-gray-900 mb-2">No Trainer Applications</h3>
                            <p className="text-gray-500 mb-6">There are currently no trainer applications to review. New applications will appear here when trainers apply.</p>
                            <div className="inline-flex items-center text-sm text-gray-500">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Check back later for new applications
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Profile</th>
                                        <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Name</th>
                                        <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900 hidden md:table-cell">Email</th>
                                        <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Status</th>
                                        <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {applications.map((app) => (
                                        <tr key={app._id} className="hover:bg-gray-50 transition-colors duration-200">
                                            <td className="py-4 px-6 whitespace-nowrap">
                                                <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-gray-200">
                                                    <img
                                                        src={app.profileImage}
                                                        alt={app.fullName}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{app.fullName}</div>
                                            </td>
                                            <td className="py-4 px-6 whitespace-nowrap hidden md:table-cell">
                                                <div className="text-sm text-gray-600">{app.email}</div>
                                            </td>
                                            <td className="py-4 px-6 whitespace-nowrap">
                                                <span
                                                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                                        app.status === "Approved"
                                                            ? "bg-green-100 text-green-800"
                                                            : app.status === "Pending"
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : "bg-red-100 text-red-800"
                                                    }`}
                                                >
                                                    <span className={`w-2 h-2 mr-2 rounded-full ${
                                                        app.status === "Approved"
                                                            ? "bg-green-400"
                                                            : app.status === "Pending"
                                                            ? "bg-yellow-400"
                                                            : "bg-red-400"
                                                    }`}></span>
                                                    {app.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 whitespace-nowrap">
                                                <button
                                                    onClick={() => handleDetails(app._id)}
                                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppliedTrainer;