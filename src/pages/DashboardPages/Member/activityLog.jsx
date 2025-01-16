import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import useAuth from "../../../hooks/useAuth";
import axios from "axios";

const AppliedTrainer = () => {
    const [trainerData, setTrainerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <p className="text-lg text-gray-600">Loading...</p>
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
                <p className="text-lg text-gray-600">No trainer application found</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">Trainer Application Status</h1>
            <div className="overflow-x-auto shadow-lg rounded-lg">
                <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Profile</th>
                            <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Name</th>
                            <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Email</th>
                            <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Status</th>
                            <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-6">
                                <img
                                    src={trainerData.profileImage}
                                    alt={trainerData.fullName}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                            </td>
                            <td className="py-3 px-6 text-gray-800">{trainerData.fullName}</td>
                            <td className="py-3 px-6 text-gray-600">{trainerData.email}</td>
                            <td className="py-3 px-6">
                                <span
                                    className={`py-1 px-3 rounded-full text-sm ${
                                        trainerData.status === "Pending"
                                            ? "bg-yellow-200 text-yellow-800"
                                            : "bg-red-200 text-red-800"
                                    }`}
                                >
                                    {trainerData.status}
                                </span>
                            </td>
                            <td className="py-3 px-6">
                                <button
                                    onClick={() => handleDetails(trainerData._id)}
                                    className="p-2 text-gray-700 hover:text-gray-900 transition-colors"
                                    title="View Details"
                                >
                                    <Eye className="w-5 h-5" />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AppliedTrainer;