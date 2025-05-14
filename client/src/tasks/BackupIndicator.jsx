// BackupIndicator.jsx
import React from "react";

export function BackupIndicator({
  roundScore,    // e.g. 18
  fallback,      // e.g. 25
  minScore,      // overall lowest possible (e.g. 0)
  maxScore       // overall highest possible (e.g. 56)
}) {
  // Normalize positions 0…1
  const normRound = (roundScore - minScore) / (maxScore - minScore);
  const normFallback = (fallback - minScore) / (maxScore - minScore);

  return (
    <div className="mb-6">
      <div className="mb-1 text-center font-medium">
        Your Backup Offer&nbsp;
        <span className="text-blue-600">{fallback} pts</span>
      </div>
      <div className="relative h-2 bg-gray-200 rounded">
        {/* red zone */}
        <div
          className="absolute h-full bg-red-300 rounded-l"
          style={{ width: `${normFallback * 100}%` }}
        />
        {/* green zone */}
        <div
          className="absolute right-0 h-full bg-green-300 rounded-r"
          style={{ width: `${(1 - normFallback) * 100}%` }}
        />
        {/* fallback tick */}
        <div
          className="absolute top-0 h-full border-l-2 border-gray-600"
          style={{ left: `${normFallback * 100}%` }}
        />
        {/* round score marker */}
        <div
          className="absolute top-[-6px] w-3 h-3 rounded-full"
          style={{
            left: `calc(${normRound * 100}% - 6px)`,
            backgroundColor: roundScore >= fallback ? "#16a34a" : "#dc2626"
          }}
        />
      </div>
      <div className="mt-1 text-xs text-gray-500 flex justify-between">
        <span>Worse than backup</span>
        <span>Better than backup</span>
      </div>
      <div className="mt-2 text-sm text-gray-600 text-center">
        Try to push your score into the green zone to beat your backup score!
      </div>
    </div>
  );
}
