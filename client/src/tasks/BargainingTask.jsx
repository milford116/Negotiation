import React, { useState, useEffect } from "react";
import { usePlayer, useGame, useStage,
  Chat } from "@empirica/core/player/classic/react";
import { InstructionsModal } from "../InstructionsModal.jsx";
import { BackupIndicator } from "./BackupIndicator.jsx";

// Include the helper functions
function interpolateColor(color1, color2, factor) {
  let c1 = color1.replace('#','');
  let c2 = color2.replace('#','');
  const r1 = parseInt(c1.substring(0,2), 16);
  const g1 = parseInt(c1.substring(2,4), 16);
  const b1 = parseInt(c1.substring(4,6), 16);
  
  const r2 = parseInt(c2.substring(0,2), 16);
  const g2 = parseInt(c2.substring(2,4), 16);
  const b2 = parseInt(c2.substring(4,6), 16);
  
  const r = Math.round(r1 + factor * (r2 - r1));
  const g = Math.round(g1 + factor * (g2 - g1));
  const b = Math.round(b1 + factor * (b2 - b1));
  
  const hr = ("0" + r.toString(16)).slice(-2);
  const hg = ("0" + g.toString(16)).slice(-2);
  const hb = ("0" + b.toString(16)).slice(-2);
  
  return "#" + hr + hg + hb;
}

const computeDynamicColor = (issueName, currentValue) => {
  if (issueName === "salary") {
    const salaryAnchors = [70000, 80000, 90000, 100000, 110000, 120000];
    const salaryColorMap = {
      70000: "#f87171",
      80000: "#fb923c",
      90000: "#fbbf24",
      100000: "#34d399",
      110000: "#60a5fa",
      120000: "#a78bfa",
    };
    const minVal = salaryAnchors[0];
    const maxVal = salaryAnchors[salaryAnchors.length - 1];
    const discreteStep = 10000;
    let lower = Math.floor((currentValue - minVal) / discreteStep) * discreteStep + minVal;
    let upper = lower + discreteStep;
    if (upper > maxVal) {
      upper = maxVal;
    }
    let factor = 0;
    if (upper !== lower) {
      factor = (currentValue - lower) / (upper - lower);
    }
    const colorLower = salaryColorMap[lower];
    const colorUpper = salaryColorMap[upper] || colorLower;
    return interpolateColor(colorLower, colorUpper, factor);
  }
  
  else if (issueName === "bonuses") {
    const anchors = [0, 5000, 10000, 15000, 20000, 25000];
    const colorMap = {
      0: "#f87171",
      5000: "#fb923c",
      10000: "#fbbf24",
      15000: "#34d399",
      20000: "#60a5fa",
      25000: "#a78bfa",
    };
    const discreteStep = 5000;
    let lower = Math.floor((currentValue - anchors[0]) / discreteStep) * discreteStep + anchors[0];
    let upper = lower + discreteStep;
    if (upper > anchors[anchors.length - 1]) {
      upper = anchors[anchors.length - 1];
    }
    let factor = upper !== lower ? (currentValue - lower) / (upper - lower) : 0;
    const colorLower = colorMap[lower];
    const colorUpper = colorMap[upper] || colorLower;
    return interpolateColor(colorLower, colorUpper, factor);

  } else if (issueName === "stockOptions") {
    const anchors = [50000, 60000, 70000, 80000, 90000, 100000];
    const colorMap = {
      50000: "#f87171",
      60000: "#fb923c",
      70000: "#fbbf24",
      80000: "#34d399",
      90000: "#60a5fa",
      100000: "#a78bfa",
    };
    const discreteStep = 10000;
    let lower = Math.floor((currentValue - anchors[0]) / discreteStep) * discreteStep + anchors[0];
    let upper = lower + discreteStep;
    if (upper > anchors[anchors.length - 1]) {
      upper = anchors[anchors.length - 1];
    }
    let factor = upper !== lower ? (currentValue - lower) / (upper - lower) : 0;
    const colorLower = colorMap[lower];
    const colorUpper = colorMap[upper] || colorLower;
    return interpolateColor(colorLower, colorUpper, factor);

  } else if (issueName === "vacationDays") {
    // For vacationDays, we might choose 6 anchors even though the slider runs from 10 to 19.
    const anchors = [10, 12, 14, 16, 18, 19];
    const colorMap = {
      10: "#f87171",
      12: "#fb923c",
      14: "#fbbf24",
      16: "#34d399",
      18: "#60a5fa",
      19: "#a78bfa",
    };
    // Loop through to find which two anchors the currentValue is between.
    let lower = anchors[0];
    let upper = anchors[anchors.length - 1];
    for (let i = 0; i < anchors.length - 1; i++) {
      if (currentValue >= anchors[i] && currentValue <= anchors[i+1]) {
        lower = anchors[i];
        upper = anchors[i+1];
        break;
      }
    }
    let factor = (upper !== lower) ? (currentValue - lower) / (upper - lower) : 0;
    const colorLower = colorMap[lower];
    const colorUpper = colorMap[upper] || colorLower;
    return interpolateColor(colorLower, colorUpper, factor);
  }

  return "#d1d5db";

};

export function BargainingTask({ chatStarted }) {
  const player = usePlayer();
  const game = useGame();
  const stage = useStage();
  const role = player.get("role");
  const duration  = stage.get("duration");     // total seconds for this stage
  const initialTime = 100;                       // seconds before “Make Offer” unlocks
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  // 1) local countdown state
  const [ timeLeft, setTimeLeft ] = useState(duration);

  const issues = game.get("issues") || [];
  const [showInstructions, setShowInstructions] = useState(false);
// 2) start interval at mount / on new stage
  const [submitDisabled, setSubmitDisabled] = useState(true);
  useEffect(() => {
    const interval = setInterval(() => {
     setTimeRemaining((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval);
         setSubmitDisabled(false);
          return 0;
       }
       return prevTime - 1;
      });
   }, 1000);
   return () => clearInterval(interval);
 }, []);    

  // Toggle instructions modal
  const handleToggleInstructions = () => {
    setShowInstructions((prev) => !prev);
  };

  // Slider settings – using your settings here
  const sliderSettings = {
    salary: { min: 70000, max: 120000, step: 1000 },
    bonuses: { min: 0, max: 25000, step: 5000 },
    stockOptions: { min: 50000, max: 100000, step: 10000 },
    vacationDays: { min: 10, max: 19, step: 1 },
  };

  
  const initialOffer = {};
  issues.forEach((issue) => {
    initialOffer[issue.name] = null;
  });
  const [offer, setOffer] = useState(initialOffer);

  // Track which sliders have been touched.
  const [touched, setTouched] = useState({});
//   const initialTime = 100; 
//   const [timeRemaining, setTimeRemaining] = useState(initialTime);
  
// const LOCAL_DELAY = 100; // seconds before offers unlock

// const lockedByGlobalTimer = timeLeft > (duration - LOCAL_DELAY);


// // 2) Combined submit gate
// const canSubmit = chatStarted && !lockedByGlobalTimer;

  // Helper: Determine payoff for an issue (using the discrete options)
  const getPayoff = (issue, value) => {
    const option = issue.options.find(
      (opt) => value >= opt.range[0] && value <= opt.range[1]
    );
    if (option) {
      return role === "Hr" ? option.valueA : option.valueB;
    }
    return 0;
  };

  const totalScore = issues.reduce((acc, issue) => {
    // Only add the utility if the slider for this issue has been touched.
    if (touched[issue.name] && offer[issue.name] !== null) {
      return acc + getPayoff(issue, offer[issue.name]);
    }
    return acc;
  }, 0);

  const minScore = 0;
  const maxScore = 56;               // sum of all max issue payoffs
  const fallback = player.get("batna"); // or call it fallback
  const roundScore = totalScore;     // computed as you already do


  // Update offer state and mark issue as touched when slider changes.
  const handleSliderChange = (issueName, newValue) => {
    setOffer((prev) => ({
      ...prev,
      [issueName]: newValue,
    }));
    setTouched((prev) => ({ ...prev, [issueName]: true }));
  };


  // Submit offer: update stage offers and mark stage as submitted.
  const submitOffer = () => {
    const currentOffers = stage.get("offers") || {};
    stage.set("offers", {
      ...currentOffers,
      [role]: offer,
    });
    console.log("Offer submitted:", offer);
    // Optionally reset or keep offers:
   // player.stage.set("submit", true);
  };

  return (
    <div className="relative p-6 bg-black text-white min-h-screen">
      {!chatStarted && (
        <div className="mb-6 text-center text-white">
          Please wait for HR’s first message before adjusting your offer.
        </div>
      )}

      
      <BackupIndicator
        roundScore={roundScore}
        fallback={fallback}
        minScore={minScore}
        maxScore={maxScore}
      />
    
      <h3 className="text-2xl font-bold mb-4 text-center text-cyan-200">
    Adjust Your Offer
  </h3>
  <p className="text-sm text-white mb-6 text-center">
    Move the sliders below to see your potential score in real time. Keep in mind that your opponent cannot see your potential offers therefore make sure to communicate well with them!
  </p>
      <p className="mb-4 text-lg text-center">
        You are: <strong>{role}</strong>
      </p>
      {!chatStarted ? (
        <div className="flex-1 flex items-center justify-center text-gray-400 italic bg-gray-900 p-6 rounded">
          Chat must start first.
        </div>
      ) : (
      <div className="bg-black text-white p-8 w-full max-w-3xl mx-auto shadow rounded border border-gray-700">
        <div className="mx-auto">
          <h2 className="text-lg font-semibold mb-6">Make Your Offer</h2>
          <div className="space-y-8">
            {issues.map((issue) => {
              const settings = sliderSettings[issue.name] || {
                min: issue.options[0].range[0],
                max: issue.options[issue.options.length - 1].range[1],
                step: 1,
              };
              // For rendering, if the slider hasn't been touched, show default min value.
              const currentValue = offer[issue.name] !== null ? offer[issue.name] : settings.min;
              const payoff = (offer[issue.name] !== null) ? getPayoff(issue, offer[issue.name]) : 0;
              
              // If slider has been touched, compute dynamic color; otherwise use a default light color.
              const dynamicColor = touched[issue.name] && offer[issue.name] !== null
                ? computeDynamicColor(issue.name, offer[issue.name], settings)
                : "#347280";
              return (
                <div key={issue.name} className="border border-gray-700 bg-gray-800 p-4 rounded shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{issue.name}</span>
                    <span className="text-sm text-bold text-cyan-100">
                      ({issue.name}: {currentValue} | Score: {payoff})
                    </span>
                  </div>
                  <input
                    type="range"
                    min={settings.min}
                    max={settings.max}
                    step={settings.step}
                    value={currentValue}
                    onChange={(e) =>
                      handleSliderChange(issue.name, Number(e.target.value))
                    }
                    className="w-full h-2 rounded-lg cursor-pointer"
                    style={{
                      appearance: "none",
                      WebkitAppearance: "none",
                      background: dynamicColor,
                    }}
                  />
                  <div className="flex justify-between text-xs mt-1">
                    <span>{settings.min}</span>
                    <span>{settings.max}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 border-t pt-4">
            <p className="text-lg font-semibold">Potential Score for this Round: {totalScore}</p>
          </div>
          
          <div className="mt-6">
          <button
        onClick={submitOffer}
        disabled={submitDisabled}
        className={`bg-black text-cyan-200 px-6 py-2 rounded transition-colors ${
          submitDisabled
           ? "opacity-50 cursor-not-allowed"
            : "hover:bg-blue-600"
        }`}
      >
       Make Intermediate Offer
        {submitDisabled
          ? ` (Available in ${timeRemaining}s)`
          : ""}
      </button>
          </div>
        </div>
      </div>
      )}
      {showInstructions && <InstructionsModal onClose={handleToggleInstructions} />}
    </div>
  );
}
