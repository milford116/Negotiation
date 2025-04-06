// BatnaNotification.jsx
import React from "react";

export function BatnaNotification({ message,currentRound, totalRounds,onResume }) {
    const progressPercentage = totalRounds ? (currentRound / totalRounds) * 100 : 0;
 
  return (
    <div className="p-6 bg-gray-100 rounded shadow-md text-center">
      <h2 className="text-2xl font-bold mb-4">BATNA Change Notification</h2>
      <p className="mb-4">{message}</p>
      <div className="mb-4">
        <p>Round {currentRound} of {totalRounds} completed</p>
        <div style={{ background: "#ddd", height: "10px", width: "100%", borderRadius: "5px" }}>
          <div style={{ background: "#4caf50", height: "10px", width: `${progressPercentage}%`, borderRadius: "5px" }} />
        </div>
      </div>
      <button
        onClick={onResume}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Return to Game
      </button>
    </div>
  );
}
