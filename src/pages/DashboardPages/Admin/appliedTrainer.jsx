import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AppliedTrainer = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/trainers`);
                
                // Check if response has success and trainers data
                if (response.data.success) {
                    setApplications(response.data.trainers);  // Correctly access the trainers array
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
    

    if (loading) return <p className="text-center text-gray-500 text-lg">Loading...</p>;

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">Applied Trainers</h1>
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
                        {applications.map((app) => (
                            <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                                <td className="py-3 px-6">
                                    <img
                                        src={app.profileImage}
                                        alt={app.fullName}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                </td>
                                <td className="py-3 px-6 text-gray-800">{app.fullName}</td>
                                <td className="py-3 px-6 text-gray-600">{app.email}</td>
                                <td className="py-3 px-6">
                                    <span
                                        className={`py-1 px-3 rounded-full text-sm ${
                                            app.status === "Approved"
                                                ? "bg-green-200 text-green-800"
                                                : app.status === "Pending"
                                                ? "bg-yellow-200 text-yellow-800"
                                                : "bg-red-200 text-red-800"
                                        }`}
                                    >
                                        {app.status}
                                    </span>
                                </td>
                                <td className="py-3 px-6">
                                    <button
                                        onClick={() => handleDetails(app._id)}
                                        className="py-2 px-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                    >
                                        Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AppliedTrainer;
