import React, { useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const [name, setName] = useState(user?.displayName || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [nameError, setNameError] = useState('');

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

    try {
      setNameError('');
      await updateUserProfile(name, photoURL);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile.');
    }
  };

  // Format the last login time
  const formatLastLoginTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Profile</h1>
      <div className="flex items-center space-x-6">
        {/* Profile Picture */}
        <div className="relative">
          <img
            src={photoURL || '/default-avatar.png'}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
          />
          {isEditing && (
            <div className="mt-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
              />
              {uploading && <p className="text-sm text-blue-500 mt-2">Uploading...</p>}
            </div>
          )}
        </div>

        {/* Profile Info */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center">
            <label className="w-24 text-gray-600 font-medium">Name:</label>
            {isEditing ? (
              <div className="relative w-full">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    nameError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
                  }`}
                />
                {nameError && (
                  <p className="text-red-500 text-xs mt-1">{nameError}</p>
                )}
              </div>
            ) : (
              <span className="text-gray-800">{user?.displayName || 'N/A'}</span>
            )}
          </div>

          <div className="flex items-center">
            <label className="w-24 text-gray-600 font-medium">Email:</label>
            <span className="text-gray-800">{user?.email || 'N/A'}</span>
          </div>

          <div className="flex items-center">
            <label className="w-24 text-gray-600 font-medium">Last Login:</label>
            <span className="text-gray-800">
              {formatLastLoginTime(user?.metadata?.lastSignInTime)}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex space-x-4">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              disabled={uploading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 disabled:bg-blue-300"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md shadow-sm hover:bg-gray-400"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
