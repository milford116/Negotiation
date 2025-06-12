const tooltipContent = {
  Hr: {
    salary: "Keep salary low – you lose points for higher amounts!",
    bonuses: "Lower bonuses save company cash. Offer less to gain points.",
    stockOptions: "Giving more stock options helps you! They cost nothing now.",
    vacationDays: "Less vacation means more productivity – keep days low.",
  },
  Employee: {
    salary: "Higher salary boosts your score. Aim for the top!",
    bonuses: "Bonuses are very valuable – try for the highest.",
    stockOptions: "More stock options add to your compensation.",
    vacationDays: "Extra vacation is good for you. Go higher if you can.",
  },
};

import React, { useState, useEffect } from "react";
import {
  usePlayer, useGame, useStage,
  Chat
} from "@empirica/core/player/classic/react";
import { InstructionsModal } from "../InstructionsModal.jsx";
import { BackupIndicator } from "./BackupIndicator.jsx";

// Include the helper functions
// function interpolateColor(color1, color2, factor) {
//   let c1 = color1.replace('#', '');
//   let c2 = color2.replace('#', '');
//   const r1 = parseInt(c1.substring(0, 2), 16);
//   const g1 = parseInt(c1.substring(2, 4), 16);
//   const b1 = parseInt(c1.substring(4, 6), 16);

//   const r2 = parseInt(c2.substring(0, 2), 16);
//   const g2 = parseInt(c2.substring(2, 4), 16);
//   const b2 = parseInt(c2.substring(4, 6), 16);

//   const r = Math.round(r1 + factor * (r2 - r1));
//   const g = Math.round(g1 + factor * (g2 - g1));
//   const b = Math.round(b1 + factor * (b2 - b1));

//   const hr = ("0" + r.toString(16)).slice(-2);
//   const hg = ("0" + g.toString(16)).slice(-2);
//   const hb = ("0" + b.toString(16)).slice(-2);

//   return "#" + hr + hg + hb;
// }

const computeDynamicColor = (issueName, currentValue) => {
  if (issueName === "salary") {
    const colorMap = {
      80000: "#f87171",
      90000: "#fb923c",
      100000: "#fbbf24",
      110000: "#34d399",
      120000: "#60a5fa",
    };
    return colorMap[currentValue] || "#d1d5db";
  } else if (issueName === "bonuses") {
    const colorMap = {
      0: "#f87171",
      5: "#fb923c",
      10: "#fbbf24",
      15: "#34d399",
      20: "#60a5fa",
    };
    return colorMap[currentValue] || "#d1d5db";
  } else if (issueName === "stockOptions") {
    const colorMap = {
      0: "#f87171",
      5000: "#fb923c",
      10000: "#fbbf24",
      15000: "#34d399",
      20000: "#60a5fa",
    };
    return colorMap[currentValue] || "#d1d5db";
  } else if (issueName === "vacationDays") {
    const colorMap = {
      10: "#f87171",
      15: "#fb923c",
      20: "#fbbf24",
      25: "#34d399",
      30: "#60a5fa",
    };
    return colorMap[currentValue] || "#d1d5db";
  }
  return "#d1d5db";
};

function Tooltip({ children, text, forceShow }) {
  const [visible, setVisible] = useState(false);

  // show if hovered or forceShow prop is true
  const actuallyVisible = visible || forceShow;

  return (
    <span
      style={{ position: "relative", cursor: "pointer" }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {actuallyVisible && (
        <span
          style={{
            position: "absolute",
            top: "-36px",
            left: 0,
            background: "#222b",
            color: "#fff",
            padding: "6px 12px",
            borderRadius: 8,
            fontSize: "0.95em",
            zIndex: 1000,
            whiteSpace: "nowrap",
            boxShadow: "0 2px 12px rgba(0,0,0,0.16)",
            pointerEvents: "none",
          }}
        >
          {text}
        </span>
      )}
    </span>
  );
}

export function BargainingTask({ chatStarted }) {

  const player = usePlayer();
  const game = useGame();
  const stage = useStage();
  const role = player.get("role");
  const duration = stage.get("duration");     // total seconds for this stage
  const initialTime = 100;                       // seconds before “Make Offer” unlocks
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  // 1) local countdown state
  const [timeLeft, setTimeLeft] = useState(duration);
  // final offer hndle
  // Add at top of component:
  const totalRounds = 6;  // Use correct logic for your game
  const roundNumber = game.get('roundindex') !== undefined ? game.get('roundindex') : 1;
  const isFinalRound = roundNumber === totalRounds;

  const [showConfirm, setShowConfirm] = useState(false);
  const [finalOfferSubmitted, setFinalOfferSubmitted] = useState(false);

  function handleFinalOffer(e) {
    e.preventDefault();
    setShowConfirm(true);
  }

  function confirmFinalOffer() {
    // Final offer logic (submit and lock UI)
    submitOffer(); // Reuse your existing submit logic
    setFinalOfferSubmitted(true);
    setShowConfirm(false);
    // Optionally: send extra finalization signal here
  }
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
    salary: { min: 80000, max: 120000, step: 10000 },
    bonuses: { min: 0, max: 20, step: 5 },
    stockOptions: { min: 0, max: 20000, step: 5000 },
    vacationDays: { min: 10, max: 30, step: 5 },
  };





  const initialOffer = {};
  issues.forEach((issue) => {
    initialOffer[issue.name] = null;
    initialOffer[issue.name] = null;
  });
  const [offer, setOffer] = useState(initialOffer);

  // Track which sliders have been touched.

  const [touched, setTouched] = useState({});


  // Helper: Determine payoff for an issue (using the discrete options)
  const getPayoff = (issue, value) => {
    // Find the option for the exact level (e.g., level: 80000)
    const option = issue.options.find(opt => opt.level === value);
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

  const minScore = 11;
  const maxScore = 70;               // sum of all max issue payoffs
  const fallback = player.get("batna"); // or call it fallback
  const roundScore = totalScore;     // computed as you already do
  const [activeTooltip, setActiveTooltip] = useState(null); // null or the issue name


  // Update offer state and mark issue as touched when slider changes.
  const handleSliderChange = (issueName, newValue) => {
    setOffer((prev) => ({
      ...prev,
      [issueName]: newValue,
    }));
    setTouched((prev) => ({ ...prev, [issueName]: true }));
    // Show tooltip for this issue
    setActiveTooltip(issueName);

    // Hide it after 2 seconds (adjust timing as desired)
    setTimeout(() => setActiveTooltip(null), 2000);
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
      {role === "Hr" ? (
        <div className="mb-4 bg-blue-950/70 p-4 rounded text-cyan-100 shadow">
          <b>Story Context for HR:</b>
          <br />
          <span>
            Budget is tight this year. The company wants to retain talent without breaking the bank.
            Stock options cost the company nothing upfront, but cash and time off directly impact your department's budget and workload.
          </span>
        </div>
      ) : (
        <div className="mb-4 bg-fuchsia-950/70 p-4 rounded text-fuchsia-100 shadow">
          <b>Story Context for Employee:</b>
          <br />
          <span>
            You want to maximize your compensation. Cash and bonuses help you now, but stock options may pay off in the future. More vacation gives you time to recharge and balance life.
          </span>
        </div>
      )}

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
                const optionLevels = issue.options.map(opt => opt.level);
                const settings = {
                  min: Math.min(...optionLevels),
                  max: Math.max(...optionLevels),
                  step: optionLevels[1] - optionLevels[0],
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
                      <Tooltip text={tooltipContent[role][issue.name]} forceShow={activeTooltip === issue.name}>
                        <span className="font-medium underline decoration-dotted decoration-cyan-300">
                        {issue.name === "bonuses" ? "bonuses (%)" : issue.name}
                        </span>
                      </Tooltip>
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
              {isFinalRound ? (
                <button
                  onClick={handleFinalOffer}
                  disabled={finalOfferSubmitted}
                  className={`w-full h-12 rounded font-bold mt-6 transition-colors
        ${finalOfferSubmitted ? "bg-gray-500 text-gray-200" : "bg-cyan-400 text-black pulse-btn"}
        `}
                  style={{ fontSize: 20, borderRadius: 8 }}
                >
                  {finalOfferSubmitted ? "Final Offer Submitted" : "Submit Final Offer"}
                </button>
              ) : (
                <button
                  onClick={submitOffer}
                  disabled={submitDisabled}
                  className={`bg-black text-cyan-200 px-6 py-2 rounded transition-colors ${submitDisabled
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-blue-600"
                    }`}
                >
                  Make Intermediate Offer
                  {submitDisabled
                    ? ` (Available in ${timeRemaining}s)`
                    : ""}
                </button>
              )}
            </div>
            {showConfirm && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
                <div className="bg-gray-800 p-6 rounded shadow-lg text-center border border-cyan-400">
                  <h3 className="text-xl font-bold mb-4 text-cyan-200">Are You Sure?</h3>
                  <p className="text-gray-100 mb-4">
                    You are about to submit your <span className="text-cyan-300 font-bold">FINAL</span> offer.<br />
                    <span className="text-red-400 font-semibold">
                      This offer cannot be changed once submitted!
                    </span>
                  </p>
                  <button
                    onClick={confirmFinalOffer}
                    className="bg-cyan-400 text-black px-6 py-2 rounded font-bold mr-4"
                  >
                    Yes, Submit Final Offer
                  </button>
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="bg-gray-500 text-white px-6 py-2 rounded font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {showInstructions && <InstructionsModal onClose={handleToggleInstructions} />}
    </div>
  );
}
