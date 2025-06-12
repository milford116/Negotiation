import React from "react";

export function GameInstructions({ next }) {
  return (
    <div className="flex w-full min-h-screen bg-[#c0ecef] text-black font-epilogue">
      {/* Main container: holds both left and right sections */}
      <div className="flex w-full max-w-6xl mx-auto px-8 py-16">
        {/* Left side - Instructions */}
        <div className="w-1/2 pr-8">
          <h2 className="text-4xl anton-regular mb-6">How to Play</h2>
          <br />
          <br />

          <div className="space-y-6 text-lg">
            <p>
              <strong className="anton-regular mb-6">Meet Your Opponent & Chat:</strong> You’ll negotiate
              Salary, Bonus, Stock Options, and Vacation Days via the chat box.
            </p>
            <p>
              <strong className="anton-regular mb-6">Each Round:</strong> Use the sliders to build offers and
              see your potential score vs. your “Backup Offer” line.
            </p>
          </div>
        </div>

        {/* Right side - Additional info + Button */}

        <div className="w-1/2 pl-8 flex flex-col justify-between">
          <div className="space-y-6 text-lg">
            <br />
            <br />
            <br />
            <p>
              <strong className="anton-regular mb-6">Submitting Offers:</strong> Once you both submit matching
              offers you lock in that deal. Otherwise you can “walk away” and
              get your backup score.
            </p>
            <p>
              <strong className="anton-regular mb-6">Goal:</strong> Beat your backup score and out-score your
              partner to “win” the round!
            </p>
            <br/>
            <button
              onClick={next}
              className="mt-12 mx-auto px-8 py-4 border-4 border-black text-black font-bold tracking-wide text-sm uppercase rounded-lg shadow-md bg-[#c0ecef] hover:bg-black hover:text-white transition"
            >
              Important Information <br/>Before Starting Game
            </button>
          </div>

          
        </div>
      </div>
    </div>
  );
}
