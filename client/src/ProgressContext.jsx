// ProgressContext.jsx
import React, { createContext, useContext, useState } from "react";

const ProgressContext = createContext();

export function ProgressProvider({ children }) {
  const steps = [
    "Consent",
    "Demographic",
    "Onboarding",
    "Round 1",
    "Round 2",
    "Round 3",
    "Round 4",
    "Round 5",
    "Round 6",
    "Exit Survey",
  ];
  const total = steps.length;
  const [current, setCurrent] = useState(0);

  return (
    <ProgressContext.Provider value={{ steps, total, current, setCurrent }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  return useContext(ProgressContext);
}
