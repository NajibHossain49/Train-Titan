import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import useAuth from '../../hooks/useAuth';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const BecomeTrainer = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        age: '',
        yearsOfExperience: '',
        profileImage: null,
        socialLinks: {
            facebook: '',
            instagram: ''
        },
        skills: {
            weightTraining: false,
            cardio: false,
            yoga: false,
            pilates: false,
            nutrition: false,
            crossFit: false,
            martialArts: false,
        },
        availableDays: [],
        availableTime: '',
        status: 'pending',
    });

    useEffect(() => {
        if (user) {
            setFormData((prev) => ({
                ...prev,
                fullName: user.displayName || '',
                email: user.email || '',
            }));
        }
    }, [user]);

    const daysOptions = [
        { value: 'sunday', label: 'Sunday' },
        { value: 'monday', label: 'Monday' },
        { value: 'tuesday', label: 'Tuesday' },
        { value: 'wednesday', label: 'Wednesday' },
        { value: 'thursday', label: 'Thursday' },
        { value: 'friday', label: 'Friday' },
        { value: 'saturday', label: 'Saturday' },
    ];

    const skillsList = [
        { id: 'weightTraining', label: 'Weight Training' },
        { id: 'cardio', label: 'Cardio' },
        { id: 'yoga', label: 'Yoga' },
        { id: 'pilates', label: 'Pilates' },
        { id: 'nutrition', label: 'Nutrition' },
        { id: 'crossFit', label: 'CrossFit' },
        { id: 'martialArts', label: 'Martial Arts' },
    ];

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);

            const imageData = new FormData();
            imageData.append('image', file);

            try {
                setLoading(true);
                const response = await axios.post(
                    `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
                    imageData
                );
                setFormData((prev) => ({
                    ...prev,
                    profileImage: response.data.data.url,
                }));
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Error uploading image. Please try again.',
                });
                console.error('Error uploading image:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSkillChange = (skillId) => {
        setFormData((prev) => ({
            ...prev,
            skills: {
                ...prev.skills,
                [skillId]: !prev.skills[skillId],
            },
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation checks
        if (!formData.profileImage) {
            Swal.fire({
                icon: 'error',
                title: 'Profile Image Required',
                text: 'Please upload your profile image.',
            });
            return;
        }

        if (!Object.values(formData.skills).some((skill) => skill)) {
            Swal.fire({
                icon: 'error',
                title: 'Skills Required',
                text: 'Please select at least one skill.',
            });
            return;
        }

        if (formData.availableDays.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Available Days Required',
                text: 'Please select your available days.',
            });
            return;
        }

        if (!formData.yearsOfExperience) {
            Swal.fire({
                icon: 'error',
                title: 'Years of Experience Required',
                text: 'Please enter your years of experience.',
            });
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/trainers`, formData);
            if (response.data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Application Submitted!',
                    text: 'Your trainer application has been submitted successfully.',
                }).then(() => {
                    navigate('/');
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Submission Failed',
                text: error.response?.data?.message || 'Error submitting application.',
            });
            console.error('Error submitting application:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 my-10">
            <h2 className="text-3xl font-bold text-center mb-8">Become a Trainer</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                    </label>
                    <input
                        id="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={formData.email}
                        readOnly
                        className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
                    />
                </div>

                {/* Age */}
                <div>
                    <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                        Age
                    </label>
                    <input
                        id="age"
                        type="number"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Years of Experience */}
                <div>
                    <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700 mb-2">
                        Years of Experience
                    </label>
                    <input
                        id="yearsOfExperience"
                        type="number"
                        value={formData.yearsOfExperience}
                        onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                        required
                        min="0"
                        step="1"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Profile Image */}
                <div>
                    <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700 mb-2">
                        Profile Image
                    </label>
                    <input
                        id="profileImage"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {imagePreview && <img src={imagePreview} alt="Preview" className="mt-4 w-32 h-32 rounded-full" />}
                </div>

                {/* Social Links */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Social Links</label>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="facebook" className="block text-sm text-gray-600 mb-1">
                                Facebook Profile URL
                            </label>
                            <input
                                id="facebook"
                                type="url"
                                value={formData.socialLinks.facebook}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    socialLinks: {
                                        ...formData.socialLinks,
                                        facebook: e.target.value
                                    }
                                })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="https://facebook.com/your.profile"
                            />
                        </div>
                        <div>
                            <label htmlFor="instagram" className="block text-sm text-gray-600 mb-1">
                                Instagram Profile URL
                            </label>
                            <input
                                id="instagram"
                                type="url"
                                value={formData.socialLinks.instagram}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    socialLinks: {
                                        ...formData.socialLinks,
                                        instagram: e.target.value
                                    }
                                })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="https://instagram.com/your.profile"
                            />
                        </div>
                    </div>
                </div>

                {/* Skills */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                    <div className="grid grid-cols-2 gap-4">
                        {skillsList.map((skill) => (
                            <div key={skill.id}>
                                <label className="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.skills[skill.id]}
                                        onChange={() => handleSkillChange(skill.id)}
                                        className="form-checkbox text-blue-600"
                                    />
                                    <span className="ml-2">{skill.label}</span>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Available Days */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Available Days</label>
                    <Select
                        options={daysOptions}
                        isMulti
                        value={formData.availableDays}
                        onChange={(selected) => setFormData({ ...formData, availableDays: selected })}
                        className="w-full"
                    />
                </div>

                {/* Available Time */}
                <div>
                    <label htmlFor="availableTime" className="block text-sm font-medium text-gray-700 mb-2">
                        Available Time (in hours)
                    </label>
                    <input
                        id="availableTime"
                        type="number"
                        value={formData.availableTime}
                        onChange={(e) => setFormData({ ...formData, availableTime: e.target.value })}
                        required
                        min="1"
                        step="1"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter hours only"
                    />
                </div>

                {/* Submit Button */}
                <div>
                    <button
                        type="submit"
                        className={`w-full px-4 py-2 text-white font-medium rounded-md ${
                            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                        disabled={loading}
                    >
                        {loading ? 'Submitting...' : 'Submit Application'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BecomeTrainer;