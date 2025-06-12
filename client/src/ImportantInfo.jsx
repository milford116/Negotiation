import React from "react";

export function ImportantInfo({ next }) {
  return (
    <div className="w-full min-h-screen bg-[#fdf2e9] text-black font-epilogue flex items-center justify-center px-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-10">
        <h2 className="text-4xl anton-regular mb-6">Important Information</h2>

        <div className="space-y-6 text-lg">
          <p>
            <strong className="anton-regular mb-6">Maintain Respectful Tone:</strong> All chat is monitored. Offensive or harassing language may disqualify you from payment.
          </p>
          <p>
            <strong className="anton-regular mb-6">Data Use:</strong> Your responses and chat logs will be used for research on negotiation strategies.
          </p>
          <p>
            <strong className="anton-regular mb-6">Timing:</strong> You’ll have 2 minutes per round to chat and make offers.
          </p>
        </div>

        <div className="mt-10 flex justify-center">

          <button
            onClick={next}
            className="px-8 py-4 border-4 border-black text-black font-bold tracking-wide text-sm uppercase rounded-lg shadow-md hover:bg-black hover:text-white transition text-center"
          >
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
}
