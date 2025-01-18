import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import useAuth from "../../../hooks/useAuth";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";
import toast from "react-hot-toast";

const BookedTrainer = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthChecked, setIsAuthChecked] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedTrainer, setSelectedTrainer] = useState(null);
    const [review, setReview] = useState("");
    const [rating, setRating] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    const { user, loading: authLoading } = useAuth();

    useEffect(() => {
        if (authLoading) return;
        setIsAuthChecked(true);

        const fetchData = async () => {
            if (!user?.email) {
                setError("Please log in to view your booking history.");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/payment-history/${user.email}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    }
                );

                const responseData = Array.isArray(response.data) ? response.data : [];
                setData(responseData);
                setError(null);
            } catch (err) {
                console.error("Error fetching data:", err);
                if (err.response?.status === 404) {
                    setData([]);
                } else {
                    setError(err.response?.data?.error || "Failed to fetch booking data.");
                }
            } finally {
                setLoading(false);
            }
        };

        if (isAuthChecked && user?.email) {
            fetchData();
        }
    }, [user, authLoading, isAuthChecked]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/reviews`, {
                trainerId: selectedTrainer.trainerId,
                userEmail: user.email,
                userName: user.displayName,
                rating,
                review,
                trainerName: selectedTrainer.trainerName,
            });

            setShowReviewModal(false);
            setReview("");
            setRating(0);
            // Show success message
            toast.success("Review submitted successfully!");
        } catch (error) {
            console.error("Error submitting review:", error);
            toast.error("You have already submitted a review for this trainer.");
        } finally {
            setSubmitting(false);
        }
    };

    const ReviewModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96 max-w-[90%]">
                <h3 className="text-xl font-semibold mb-4">Review {selectedTrainer?.trainerName}</h3>
                <form onSubmit={handleReviewSubmit}>
                    <div className="mb-4">
                        <div className="flex gap-2 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'
                                        }`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                    </div>
                    <textarea
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        className="w-full p-2 border rounded-md mb-4 h-32"
                        placeholder="Write your review here..."
                        required
                    />
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setShowReviewModal(false)}
                            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                        >
                            {submitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    if (authLoading || !isAuthChecked) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <LoadingSpinner />
            </div>
        );
    }

    if (!user?.email) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-lg text-amber-600">Please log in to view your booking history.</div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <LoadingSpinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-lg text-red-500">Error: {error}</div>
            </div>
        );
    }

    if (!data.length) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-lg">No booking history found.</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {data.map((item, index) => (
                <div key={item._id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="mb-4 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-800">Booking #{index + 1}</h2>
                        <button
                            onClick={() => {
                                setSelectedTrainer(item);
                                setShowReviewModal(true);
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Write Review
                        </button>
                    </div>

                    {/* Trainer Info */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Trainer Info</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <p><span className="font-medium">Name:</span> {item.trainerName}</p>
                                <p><span className="font-medium">Experience:</span> {item.trainerProfile?.yearsOfExperience} years</p>
                                <p><span className="font-medium">Age:</span> {item.trainerProfile?.age}</p>
                            </div>
                            <div>
                                <p><span className="font-medium">Email:</span> {item.trainerEmail}</p>
                                <p><span className="font-medium">Certification:</span> #{item.trainerProfile?.certificationNumber}</p>
                            </div>
                        </div>
                    </div>

                    {/* Class Info */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Class Info</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <p><span className="font-medium">Class Name:</span> {item.className}</p>
                                <p><span className="font-medium">Duration:</span> {item.trainerProfile?.sessionDuration} hour</p>
                                <p><span className="font-medium">Package:</span> {item.packageName}</p>
                            </div>
                            <div>
                                <p><span className="font-medium">Max Participants:</span> {item.maxParticipants}</p>
                                <p><span className="font-medium">Status:</span> {item.status}</p>
                                <p><span className="font-medium">Price:</span> ${item.price}</p>
                            </div>
                        </div>
                    </div>

                    {/* Slot Info */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Slot Info</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <p><span className="font-medium">Date:</span> {format(new Date(item.date), "MMM dd, yyyy")}</p>
                                <p><span className="font-medium">Time Slot:</span> {item.timeSlot || item.slotName}</p>
                            </div>
                            <div>
                                <p><span className="font-medium">Start Time:</span> {item.startTime}</p>
                                <p><span className="font-medium">Slot Status:</span> {item.slotStatus}</p>
                            </div>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Additional Info</h3>
                        <p><span className="font-medium">Transaction ID:</span> {item.transactionId}</p>
                        <p className="whitespace-pre-line"><span className="font-medium">Special Instructions:</span> {item.specialInstructions}</p>
                    </div>
                </div>
            ))}

            {showReviewModal && <ReviewModal />}
        </div>
    );
};

export default BookedTrainer;