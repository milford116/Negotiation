// OnboardingSurvey.jsx
import React, { useState } from "react";
import { usePlayer } from "@empirica/core/player/classic/react";

export default function OnboardingSurvey({ next }) {
  const player = usePlayer();
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    comments: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Survey submitted:", formData);
    // (Optional) Process or store formData as needed.
    // Mark the survey as complete by updating the player's property.
    player.set("introComplete", true);
    next();
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>Onboarding Survey</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="age">Age:</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="gender">Gender:</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="">Select an option</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="nonbinary">Nonbinary</option>
          </select>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="comments">Comments:</label>
          <textarea
            id="comments"
            name="comments"
            value={formData.comments}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <button type="submit" style={{ padding: "10px 20px", fontSize: "16px" }}>
          Submit Survey
        </button>
      </form>
    </div>
  );
}
