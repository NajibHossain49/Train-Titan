import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";

const fetchSlots = async (email) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/slots/byEmail/${email}`);
    if (!response.ok) {
        throw new Error("Failed to fetch slots");
    }
    const data = await response.json();
    return data.slots;
};

const ManageSlots = () => {
    const { user } = useAuth(); // Get the logged-in user's details

    const { data: slots = [], isLoading, isError } = useQuery({
        queryKey: ["slots", user?.email], // Query key as an array
        queryFn: () => fetchSlots(user.email), // Function to fetch data
        enabled: !!user?.email, // Only fetch when email is available
    });

    if (isLoading) {
        return <p>Loading slots...</p>;
    }

    if (isError) {
        return <p>No slots found for this email</p>;
    }

    return (
        <div>
            <h2>Manage Slots</h2>
            {slots.length > 0 ? (
                <table border="1" cellPadding="8" style={{ width: "100%", textAlign: "left" }}>
                    <thead>
                        <tr>
                            <th>Trainer Name</th>
                            <th>Class Name</th>
                            <th>Date</th>
                            <th>Start Time</th>
                            <th>Max Participants</th>
                            <th>Status</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {slots.map((slot) => (
                            <tr key={slot._id}>
                                <td>{slot.trainerName}</td>
                                <td>{slot.className}</td>
                                <td>{new Date(slot.date).toLocaleDateString()}</td>
                                <td>{slot.startTime}</td>
                                <td>{slot.maxParticipants}</td>
                                <td>{slot.status}</td>
                                <td>${slot.price}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No slots available.</p>
            )}
        </div>
    );
};

export default ManageSlots;
