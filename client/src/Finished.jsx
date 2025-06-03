import React from "react";

export function Finished() {
  return (
    <div className="min-h-screen bg-[#faf2cf] flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl px-10 py-8 max-w-xl text-center border border-gray-300">
        <h1 className="text-3xl font-bold text-gray-800 anton-regular mb-4 drop-shadow-md">
          Finished!
        </h1>
        <p className="text-lg text-gray-700 epilogue-body">
          Thanks for participating in the study. Your responses have been recorded.
        </p>
        
      </div>
    </div>
  );
}
