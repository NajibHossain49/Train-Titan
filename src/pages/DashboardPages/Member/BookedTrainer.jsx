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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg transform transition-all">
                {/* Modal Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-semibold text-gray-800">
                            Review {selectedTrainer?.trainerName}
                        </h3>
                        <button 
                            onClick={() => setShowReviewModal(false)}
                            className="text-gray-400 hover:text-gray-500 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleReviewSubmit} className="p-6 space-y-6">
                    {/* Rating Section */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Rating
                        </label>
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className={`text-3xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-full p-1
                                        ${star <= rating ? 'text-yellow-400 hover:text-yellow-500' : 'text-gray-300 hover:text-gray-400'}`}
                                >
                                    ★
                                </button>
                            ))}
                            <span className="ml-2 text-sm text-gray-500">
                                {rating === 0 ? 'Select rating' : `${rating} star${rating !== 1 ? 's' : ''}`}
                            </span>
                        </div>
                    </div>

                    {/* Review Text Section */}
                    <div className="space-y-2">
                        <label htmlFor="review" className="block text-sm font-medium text-gray-700">
                            Your Review
                        </label>
                        <div className="relative">
                            <textarea
                                id="review"
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                maxLength={500}
                                minLength={10}
                                className="w-full h-32 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-colors"
                                placeholder="Share your experience with the trainer (minimum 10 characters)..."
                                required
                            />
                            <div className="absolute bottom-3 right-3 text-sm text-gray-500">
                                {review.length}/500
                            </div>
                        </div>
                        {review.length > 0 && review.length < 10 && (
                            <p className="text-sm text-red-500">
                                Review must be at least 10 characters long
                            </p>
                        )}
                    </div>

                    {/* Modal Footer */}
                    <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end pt-4">
                        <button
                            type="button"
                            onClick={() => setShowReviewModal(false)}
                            className="w-full sm:w-auto px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || !rating || !review.trim() || review.length < 10}
                            className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
                        >
                            {submitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                    </svg>
                                    Submitting...
                                </span>
                            ) : (
                                'Submit Review'
                            )}
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