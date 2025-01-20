import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAuth from '../../../hooks/useAuth';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AddNewSlot = () => {
  const [trainerData, setTrainerData] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const { user } = useAuth();

  // Form state
  const [slotForm, setSlotForm] = useState({
    date: '',
    startTime: '',
    maxParticipants: 10,
    membershipType: '',
    specialInstructions: ''
  });

  // Membership options configuration
  const membershipOptions = [
    {
      type: "Basic Membership",
      price: 10,
      features: [
        "Access to gym facilities during regular operating hours",
        "Use of cardio and strength training equipment",
        "Access to locker rooms and showers"
      ]
    },
    {
      type: "Standard Membership",
      price: 50,
      features: [
        "All benefits of the basic membership",
        "Access to group fitness classes such as yoga, spinning, and Zumba",
        "Use of additional amenities like a sauna or steam room"
      ]
    },
    {
      type: "Premium Membership",
      price: 100,
      features: [
        "All benefits of the standard membership",
        "Access to personal training sessions with certified trainers",
        "Discounts on additional services such as massage therapy or nutrition counseling"
      ]
    }
  ];

  // Initial data fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trainerResponse, classesResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/approvedTrainer/${user.email}`),
          axios.get(`${import.meta.env.VITE_API_URL}/allClasses`)
        ]);

        if (trainerResponse.data.success) {
          setTrainerData(trainerResponse.data.trainer);
        } else {
          throw new Error('No trainer data found for your email.');
        }

        if (classesResponse.data.success) {
          setClasses(classesResponse.data.classes || []);
        } else {
          throw new Error('Failed to load classes.');
        }
      } catch (err) {
        setError(err.message || 'Error connecting to the server. Please try again.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchData();
    }
  }, [user]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSlotForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Reset form function
  const resetForm = () => {
    setSelectedClass(null);
    setSlotForm({
      date: '',
      startTime: '',
      maxParticipants: 10,
      membershipType: '',
      specialInstructions: ''
    });
  };

  // Update class with trainer data
  const updateClassWithTrainer = async (classId) => {
    try {
      const updatedClassData = {
        className: selectedClass.className,
        details: selectedClass.details,
        additionalInfo: selectedClass.additionalInfo,
        image: selectedClass.image,
        createdAt: selectedClass.createdAt,
        trainer: {
          id: trainerData._id,
          name: trainerData.fullName,
          email: trainerData.email,
          profile: {
            image: trainerData.profileImage,
            age: trainerData.age,
            yearsOfExperience: trainerData.yearsOfExperience,
            sessionDuration: trainerData.sessionDuration,
            timeSlot: trainerData.timeSlot,
            certificationNumber: trainerData.certificationNumber,
            availableDays: trainerData.availableDays,
            skills: trainerData.skills,
            socialLinks: trainerData.socialLinks || {},
            status: trainerData.status
          }
        },
        trainerAssignedAt: new Date()
      };

      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/classes/${classId}`,
        updatedClassData
      );

      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to update class data');
      }

      // Update local state
      setClasses(prevClasses =>
        prevClasses.map(c =>
          c._id === classId ? { ...c, ...updatedClassData } : c
        )
      );

      return response.data;
    } catch (error) {
      console.error('Error updating class with trainer:', error);
      throw error;
    }
  };

  // Create new slot with updated class data
  const createSlot = async (selectedMembership) => {
    const slotData = {
      // Trainer Information
      trainerId: trainerData._id,
      trainerName: trainerData.fullName,
      trainerEmail: trainerData.email,
      trainerProfile: {
        profileImage: trainerData.profileImage,
        age: trainerData.age,
        yearsOfExperience: trainerData.yearsOfExperience,
        sessionDuration: trainerData.sessionDuration,
        timeSlot: trainerData.timeSlot,
        certificationNumber: trainerData.certificationNumber,
        availableDays: trainerData.availableDays,
        skills: trainerData.skills,
        socialLinks: trainerData.socialLinks || {},
        status: trainerData.status
      },
      // Class Information
      classId: selectedClass._id,
      className: selectedClass.className,
      classImage: selectedClass.image,
      classDetails: selectedClass.details,
      classAdditionalInfo: selectedClass.additionalInfo,
      // Slot Information
      ...slotForm,
      price: selectedMembership.price,
      membershipFeatures: selectedMembership.features,
      status: 'available',
      createdAt: new Date()
    };

    const response = await axios.post(`${import.meta.env.VITE_API_URL}/slots`, slotData);
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to create slot');
    }

    return response.data;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedClass) {
      toast.error('Please select a class first');
      return;
    }

    if (!slotForm.membershipType) {
      toast.error('Please select a membership type');
      return;
    }

    try {
      // First update the class with trainer data
      await updateClassWithTrainer(selectedClass._id);

      // Then create the slot
      const selectedMembership = membershipOptions.find(m => m.type === slotForm.membershipType);
      await createSlot(selectedMembership);

      toast.success('Slot created successfully!');
      resetForm();
    } catch (err) {
      console.error('Error:', err);
      toast.error(err.message || 'Error creating slot');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  if (!trainerData) {
    return <div className="text-center p-4">No trainer data found</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      {/* Trainer Profile Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="border-b pb-4 mb-6">
          <h1 className="text-2xl font-bold">Trainer Profile</h1>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <img
              src={trainerData.profileImage}
              alt={trainerData.fullName}
              className="w-full h-64 object-cover rounded-lg shadow"
            />
            <div className="mt-4 space-y-2">
              <h3 className="font-semibold text-gray-700">Social Links</h3>
              <div className="flex space-x-4">
                {trainerData.socialLinks?.facebook && (
                  <a
                    href={trainerData.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Facebook
                  </a>
                )}
                {trainerData.socialLinks?.instagram && (
                  <a
                    href={trainerData.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-600 hover:text-pink-800"
                  >
                    Instagram
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="md:w-2/3 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-gray-700">Full Name</label>
                <input
                  type="text"
                  value={trainerData.fullName}
                  readOnly
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700">Email</label>
                <input
                  type="email"
                  value={trainerData.email}
                  readOnly
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700">Age</label>
                <input
                  type="text"
                  value={trainerData.age}
                  readOnly
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700">Experience</label>
                <input
                  type="text"
                  value={`${trainerData.yearsOfExperience} Years`}
                  readOnly
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700">Session Duration</label>
                <input
                  type="text"
                  value={`${trainerData.sessionDuration} Hours`}
                  readOnly
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700">Preferred Time Slot</label>
                <input
                  type="text"
                  value={trainerData.timeSlot?.charAt(0).toUpperCase() + trainerData.timeSlot?.slice(1)}
                  readOnly
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700">Status</label>
                <input
                  type="text"
                  value={trainerData.status}
                  readOnly
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700">Certification Number</label>
                <input
                  type="text"
                  value={trainerData.certificationNumber}
                  readOnly
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-2">Available Days</label>
              <div className="flex flex-wrap gap-2">
                {trainerData.availableDays?.map((day) => (
                  <span
                    key={day.value}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  >
                    {day.label}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-2">Skills</label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(trainerData.skills).map(
                  ([skill, hasSkill]) =>
                    hasSkill && (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {skill.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Available Classes Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="border-b pb-4 mb-6">
          <h2 className="text-2xl font-bold">Available Classes</h2>
          <p className="text-gray-600 mt-2">Select a class to create a new slot</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classItem) => (
            <div
              key={classItem._id}
              className={`border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${
                selectedClass?._id === classItem._id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedClass(classItem)}
            >
              <div className="relative">
                <img
                  src={classItem.image}
                  alt={classItem.className}
                  className="w-full h-48 object-cover"
                />
               {selectedClass?._id === classItem._id && (
                  <div className="absolute top-2 right-2 bg-blue-500 text-white p-1 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{classItem.className}</h3>
                <p className="text-gray-600 mb-4">{classItem.details}</p>
                <div className="space-y-2 text-sm text-gray-500">
                  {classItem.additionalInfo.split('\n').map((info, index) => (
                    <p key={index}>{info}</p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Slot Form */}
      {selectedClass && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="border-b pb-4 mb-6">
            <h2 className="text-2xl font-bold">Create New Slot</h2>
            <p className="text-gray-600 mt-2">
              Set up the details for your {selectedClass.className} class
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-semibold text-gray-700 mb-2">Date</label>
                <div className="relative">
                  <input
                    type="date"
                    name="date"
                    value={slotForm.date}
                    onChange={handleInputChange}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    required
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10"
                  />
                  <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-2">Start Time</label>
                <input
                  type="time"
                  name="startTime"
                  value={slotForm.startTime}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-2">
                  Maximum Participants
                </label>
                <input
                  type="number"
                  name="maxParticipants"
                  value={slotForm.maxParticipants}
                  onChange={handleInputChange}
                  min="1"
                  required
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-2">Membership Type</label>
                <select
                  name="membershipType"
                  value={slotForm.membershipType}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2"
                >
                  <option value="">Select a membership type</option>
                  {membershipOptions.map((membership) => (
                    <option key={membership.type} value={membership.type}>
                      {membership.type} - ${membership.price}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Membership Details Preview */}
            {slotForm.membershipType && (
              <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <h3 className="font-semibold text-lg mb-2">Membership Features:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {membershipOptions
                    .find(m => m.type === slotForm.membershipType)
                    ?.features.map((feature, index) => (
                      <li key={index} className="text-gray-700">{feature}</li>
                    ))}
                </ul>
              </div>
            )}

            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Special Instructions (Optional)
              </label>
              <textarea
                name="specialInstructions"
                value={slotForm.specialInstructions}
                onChange={handleInputChange}
                rows="4"
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 resize-none"
                placeholder="Add any special instructions or notes for participants..."
              ></textarea>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Slot
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddNewSlot;