// BatnaNotification.jsx
import React from "react";

export function BatnaNotification({ message, currentRound, totalRounds, onResume }) {
  const progressPercentage = totalRounds ? (currentRound / totalRounds) * 100 : 0;

  return (
    <div className="p-6 bg-gray-900 rounded shadow-md text-center">
      <h2 className="text-2xl font-bold mb-4 anton-regular text-cyan-400">New Backup Offer!!!</h2>
      <div className="relative inline-block group">
        <span className="font-semibold text-red-200">
          {message} <br/>
        </span>
        <div className="absolute bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-gray-800 text-white text-sm rounded shadow-lg">
          Your backup option is the number of points you'll be guaranteed if you decide to exit the negotiation at this moment.
        </div>
      </div> 
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
