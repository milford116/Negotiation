import React from "react";

export function ImportantInfo({ next }) {
  return (
    <div className="p-8 max-w-3xl mx-auto bg-white rounded shadow-lg">
      <h2 className="text-3xl font-bold mb-4">Important Information</h2>

      <div className="space-y-4 text-gray-800 mb-6">
        <p><strong>Maintain Respectful Tone:</strong> All chat is monitored. Offensive or harassing language may disqualify you from payment.</p>
        <p><strong>Data Use:</strong> Your responses and chat logs will be used for research on negotiation strategies.</p>
        <p><strong>Timing:</strong> You’ll have 2 minutes per round to chat and make offers.</p>
      </div>

      <div className="text-right">
        <button
          onClick={next}
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Start Game
        </button>
      </div>
    </div>
  );
}
