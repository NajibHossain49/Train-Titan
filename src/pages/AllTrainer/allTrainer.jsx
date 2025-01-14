import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AllTrainer = () => {
  const [trainers, setTrainers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/trainers`);
        if (response.data.success) {
          setTrainers(response.data.trainers);
        }
      } catch (error) {
        console.error("Error fetching trainers:", error);
      }
    };
    fetchTrainers();
  }, []);

  const handleKnowMore = (id) => {
    navigate(`/trainer/${id}`);
  };

  return (
    <div>
      <h1>All Trainers</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {trainers.map((trainer) => (
          <div
            key={trainer._id}
            style={{
              border: "1px solid #ccc",
              padding: "16px",
              borderRadius: "8px",
              width: "300px",
            }}
          >
            {/* Profile Image */}
            <img
              src={trainer.profileImage}
              alt={trainer.fullName}
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
            {/* Trainer Info */}
            <h2>{trainer.fullName}</h2>
            <p>Years of Experience: {trainer.yearsOfExperience}</p>
            {/* Social Links */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              {trainer.socialLinks.facebook && (
                <a href={trainer.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                  <img src="/icons/facebook.png" alt="Facebook" style={{ width: "24px" }} />
                </a>
              )}
              {trainer.socialLinks.instagram && (
                <a href={trainer.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                  <img src="/icons/instagram.png" alt="Instagram" style={{ width: "24px" }} />
                </a>
              )}
            </div>
            {/* Available Slots */}
            <h3>Available Slots</h3>
            <ul style={{ padding: "0", listStyle: "none", marginBottom: "10px" }}>
              {trainer.availableDays.map((day) => (
                <li key={day.value} style={{ marginBottom: "5px" }}>
                  {day.label} at {trainer.availableTime}:00
                </li>
              ))}
            </ul>
            {/* Know More Button */}
            <button
              onClick={() => handleKnowMore(trainer._id)}
              style={{
                padding: "10px",
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Know More
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllTrainer;
