import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Clock, Users, CheckCircle } from 'lucide-react';

const TrainerBooked = () => {
    const { trainerId } = useParams();
    const [slotData, setSlotData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSlotData = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/slots/byTrainer/${trainerId}`);
                const data = await response.json();
                if (data.success) {
                    setSlotData(data.slot);
                } else {
                    setError(data.message);
                }
            } catch (err) {
                setError('Failed to fetch trainer data');
            } finally {
                setLoading(false);
            }
        };

        fetchSlotData();
    }, [trainerId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg text-red-500">{error}</p>
            </div>
        );
    }

    const packages = [
        {
            name: 'Basic',
            features: ['Access to gym equipment', 'Locker room access', 'Basic fitness assessment'],
            price: '$30/month'
        },
        {
            name: 'Standard',
            features: ['All Basic features', 'Group fitness classes', 'Sauna access', 'Personal locker'],
            price: '$60/month'
        },
        {
            name: 'Premium',
            features: [
                'All Standard features',
                'Personal training sessions',
                'Nutrition consultation',
                'Priority class booking',
                'Premium amenities access'
            ],
            price: '$100/month'
        }
    ];


    const handleJoinNow = () => {
        console.log('Booking for trainer:', slotData.trainerName);
    };

    return (
        <div className="min-h-screen p-6 bg-gray-50">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Trainer Info */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <img
                            src={slotData.trainerProfile.profileImage}
                            alt={slotData.trainerName}
                            className="w-16 h-16 rounded-full object-cover"
                        />
                        <div>
                            <h2 className="text-xl font-bold">Trainer: {slotData.trainerName}</h2>
                            <p className="text-gray-600">
                                {slotData.trainerProfile.yearsOfExperience} years of experience
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            <span>
                                Available Days: {slotData.trainerProfile.availableDays.map(day => day.label).join(', ')}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            <span>Time Slot: {slotData.trainerProfile.timeSlot}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            <span>Session Duration: {slotData.trainerProfile.sessionDuration} hours</span>
                        </div>
                    </div>
                </div>

                {/* Class Info */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">Class Details</h2>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <img
                                src={slotData.classImage}
                                alt={slotData.className}
                                className="w-24 h-24 rounded-lg object-cover"
                            />
                            <div>
                                <h3 className="text-lg font-semibold">{slotData.className}</h3>
                                <p className="text-sm text-gray-600">{slotData.classDetails}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            <span>Max Participants: {slotData.maxParticipants}</span>
                        </div>
                    </div>
                </div>

                {/* Membership Packages */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">Membership Packages</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {packages.map((pkg) => (
                            <div
                                key={pkg.name}
                                className="p-4 border rounded-lg bg-white shadow-sm"
                            >
                                <h3 className="text-lg font-semibold mb-2">{pkg.name}</h3>

                                {/* Display price here */}
                                <p className="text-xl font-bold text-gray-900 mb-4">{pkg.price}</p>

                                <ul className="space-y-2">
                                    {pkg.features.map((feature, index) => (
                                        <li key={index} className="flex items-start gap-2">
                                            <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                                            <span className="text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>


                {/* Membership Packages  Membership Packages Comes Dynamically from Database */}
                {/* <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Membership Package: {slotData.membershipType}</h2>
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              {slotData.membershipFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div> */}

                {/* Join Now Button */}
                <div className="flex justify-center">
                    <button
                        onClick={handleJoinNow}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors duration-200"
                    >
                        Join Now - ${slotData.price}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TrainerBooked;
