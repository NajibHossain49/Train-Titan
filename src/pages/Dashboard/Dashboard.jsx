import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import BalanceDashboard from '../DashboardPages/Admin/Balance';
import ManageSlots from '../DashboardPages/Trainer/ManageSlots';

const Dashboard = () => {
    const { user, updateUserProfile } = useAuth();
    const [name, setName] = useState(user?.displayName || '');
    const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
    const [isEditing, setIsEditing] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [nameError, setNameError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate initial loading
        setTimeout(() => setLoading(false), 1000);
    }, []);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            setUploading(true);
            const response = await fetch(
                `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
                {
                    method: 'POST',
                    body: formData,
                }
            );
            const data = await response.json();
            if (data.success) {
                setPhotoURL(data.data.url);
                toast.success('Image uploaded successfully!');
            } else {
                toast.error('Image upload failed!');
            }
        } catch (error) {
            toast.error('An error occurred while uploading the image.');
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        if (!name) {
            setNameError('Name is required');
            return;
        }

        const result = await Swal.fire({
            title: 'Save Changes?',
            text: 'Are you sure you want to update your profile?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#4F46E5',
            cancelButtonColor: '#EF4444',
            confirmButtonText: 'Yes, save changes',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            try {
                setNameError('');
                await updateUserProfile(name, photoURL);
                toast.success('Profile updated successfully!');
                setIsEditing(false);
            } catch (error) {
                toast.error('Failed to update profile.');
            }
        }
    };

    const formatLastLoginTime = (timestamp) => {
        if (!timestamp) return 'N/A';
        const date = new Date(timestamp);
        return new Intl.DateTimeFormat('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
        }).format(date);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    // Function to determine which component to render based on email
    const renderDashboardComponent = () => {
        const email = user?.email;

        if (email === 'admin@traintitangym.com') {
            return <BalanceDashboard />;
        } else if (email === 'trainer@traintitangym.com') {
            return <ManageSlots />;
        }
        return null; // Return null if email doesn't match either condition
    };

    return (
        <>
            <div className="bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 px-6 py-4">
                            <h1 className="text-2xl font-bold text-white">My Profile</h1>
                        </div>

                        <div className="p-6">
                            {/* Profile Content */}
                            <div className="md:flex md:space-x-8">
                                {/* Profile Picture Section */}
                                <div className="flex flex-col items-center space-y-4 mb-6 md:mb-0">
                                    <div className="relative group">
                                        <img
                                            src={photoURL || '/default-avatar.png'}
                                            alt="Profile"
                                            className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100 shadow-md transition-transform group-hover:scale-105"
                                        />
                                        {isEditing && (
                                            <div className="mt-4 w-full">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Change Photo
                                                </label>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 transition-colors"
                                                />
                                                {uploading && (
                                                    <div className="mt-2 flex items-center justify-center">
                                                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-indigo-600"></div>
                                                        <span className="ml-2 text-sm text-indigo-600">Uploading...</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Profile Info Section */}
                                <div className="flex-1 space-y-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                            {isEditing ? (
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-colors ${nameError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                                                            }`}
                                                        placeholder="Enter your name"
                                                    />
                                                    {nameError && (
                                                        <p className="mt-1 text-sm text-red-500">{nameError}</p>
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-gray-800 font-medium px-4 py-2 bg-gray-50 rounded-lg">
                                                    {user?.displayName || 'N/A'}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                            <p className="text-gray-800 font-medium px-4 py-2 bg-gray-50 rounded-lg">
                                                {user?.email || 'N/A'}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Login</label>
                                            <p className="text-gray-800 font-medium px-4 py-2 bg-gray-50 rounded-lg">
                                                {formatLastLoginTime(user?.metadata?.lastSignInTime)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-8 flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                                {isEditing ? (
                                    <>
                                        <button
                                            onClick={handleSave}
                                            disabled={uploading}
                                            className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg shadow-sm hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Save Changes
                                        </button>
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="w-full sm:w-auto px-6 py-2.5 bg-gray-200 text-gray-800 font-medium rounded-lg shadow-sm hover:bg-gray-300 focus:ring-4 focus:ring-gray-100 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg shadow-sm hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 transition-colors"
                                    >
                                        Edit Profile
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Conditional rendering of dashboard components */}
            {renderDashboardComponent()}
        </>
    );
};

export default Dashboard;