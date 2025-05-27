import React from "react";

export function GameInstructions({ next }) {
  return (
    <div className="p-8 max-w-3xl mx-auto bg-white rounded shadow-lg">
      <h2 className="text-3xl font-bold mb-4">How to Play</h2>

      <div className="space-y-4 text-gray-800 mb-6">
        <p><strong>Meet Your Opponent & Chat:</strong> You’ll negotiate Salary, Bonus, Stock Options, and Vacation Days via the chat box.</p>
        <p><strong>Each Round:</strong> Use the sliders to build offers and see your potential score vs. your “Backup Offer” line.</p>
        <p><strong>Submitting Offers:</strong> Once you both submit matching offers you lock in that deal. Otherwise you can “walk away” and get your backup score.</p>
        <p><strong>Goal:</strong> Beat your backup score and out-score your partner to “win” the round!</p>
      </div>

      <div className="text-right">
        <button
          onClick={next}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Next: Important Info
        </button>
      </div>
    </div>
  );
}
