// ProgressBar.jsx
import React from "react";
import { useProgress } from "./ProgressContext";

export function ProgressBar() {
  const ctx = useProgress();
  if (!ctx) return null; // no provider

  

  const { steps, total, current } = ctx;
  if (current <= 0 || current > steps.length) {
    return null;
  }
  const segmentPct = 100 / total;

  return (
    <div className="w-full mb-4">
      {/* ── Segmented Bar ── */}
      <div className="flex h-2 rounded overflow-hidden">
        {steps.map((_, idx) => {
          // idx 0...total-1
          let bg;
          if (idx < current - 1) bg = "bg-green-500";
          else if (idx === current - 1) bg = "bg-blue-500";
          else bg = "bg-gray-300";

          return (
            <div
              key={idx}
              className={`${bg}`}
              style={{ width: `${segmentPct}%` }}
            />
          );
        })}
      </div>

      {/* ── Labels Below ── */}
      <div className="flex text-xs mt-1">
        {steps.map((label, idx) => {
          let txt;
          if (idx < current - 1) txt = "text-green-600";
          else if (idx === current - 1) txt = "text-blue-600 font-semibold";
          else txt = "text-gray-400";

          return (
            <div
              key={idx}
              className={`${txt} truncate text-center`}
              style={{ width: `${segmentPct}%` }}
            >
              {label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
