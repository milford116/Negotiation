// InstructionsModal.jsx

import React from "react";

export function InstructionsModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Modal Content Container */}
      <div className="border-red-500 bg-white w-full max-w-4xl mx-auto rounded shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-4 anton-regular">Game Instructions</h2>

        <div className="h-96 overflow-y-auto space-y-4 text-gray-700">
          {/* Place your Day-1 instructions, disclaimers, or any textual details here */}
          <p>
          <strong className="anton-regular mb-6">Meet Your Opponent & Start Chatting:</strong>  
            Pick an HR Manager or an Employee role. Use the chat to discuss Salary, Bonuses, Stock Options, and Vacation Days...
          </p>
          <p>
          <strong className="anton-regular mb-6">How Each Round Works:</strong>  
            The game consists of 10 rounds. Each round you can revise your offers and see if you can come to an agreement...
            Your goal is to maximize your personal gain while maintaining a realistic and fair deal to avoid negotiation breakdowns.
          </p>
          <p>
          <strong className="anton-regular mb-6">New Offer Section:</strong>  
            Make new offers each round by adjusting the terms to reach an agreement.In each round you can make intermediate offers  and 
            check your potential score for that round. But till you reach any agreement, you won't get that score, it will just give you idea for your potential score
          </p>
          <p>
          <strong className="anton-regular mb-6">Chat Section:</strong>  
            Communicate with your opponent to discuss each part and justify your offers to them.
          </p>
          <p>
          <strong className="anton-regular mb-6">Previoud Round History:</strong>  
            You can view your offers from previous rounds shown in the sidebar to help you in negotiating.
          </p>
          <p>
          <strong className="anton-regular mb-6">Review Your Score & Make a Decision:</strong>  
            At any point, you can decide to accept, counter, or walk away from the negotiation. If you choose to walk away, you will receive your Backup score as your final score — this represents your backup plan (BATNA) for the negotiation. However, your Backup points are not guaranteed to stay the same throughout the game, so choose wisely!
          </p>
          <p>
          <strong className="anton-regular mb-6">Submit Your Final Offer:</strong>  
            Once both sides finalize the deal, your score will be calculated based on:
The negotiated terms (better deals earn higher points).
Effective trade-offs (balancing different areas wisely).
Negotiation score vs Fallback score (your agreed deal vs. your backup plan).
The goal is to achieve a higher score than your opponent and “win” the negotiation!
          </p>
          <p>
          <strong className="anton-regular mb-6">Important Disclaimers or Additional Consent Info:</strong>  
            If you prefer, you can re-iterate disclaimers, confidentiality statements, or data usage statements here...
          </p>
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-black text-white rounded hover:bg-cyan-200 hover:text-black anton-regular"

          >
            Got It!
          </button>
        </div>
      </div>
    </div>
  );
}
