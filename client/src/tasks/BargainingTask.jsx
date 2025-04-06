// import React, { useState } from "react";
// import { usePlayer, useGame ,useStage} from "@empirica/core/player/classic/react";
// import { Stage } from "../Stage.jsx";

// export function BargainingTask() {
//   const player = usePlayer();
//   const game = useGame();
//   const stage = useStage(); //new
//   const [offer, setOffer] = useState({});
//   const issues = game.get("issues") || []; // Retrieve issues from game state
//   console.log("Loaded issues in frontend:", issues);
//   const role = player.get("role");
//   const notifications = player.get("notifications") || [];

//   // console.log('issues',issues);
//   // console.log('role',role);

//   function handleOfferChange(issue, quantity) {
//     //const numericValue = quantity === '' ? 0 : Number(quantity);
    
//     setOffer({ ...offer, [issue]: quantity });
//   }

//   function submitOffer() { 
//     const currentOffers = stage.get("offers") || {};
//     console.log('offers',currentOffers);
    

//   stage.set("offers", {
//     ...currentOffers,
//     [role]: offer,
//   });
//     console.log("Offer submitted:", offer); 
//     setOffer({}); // Reset the form
//     player.stage.set("submit", true);
//   }

 

//   return (
//     <div className="flex flex-col items-center">
      
//       <p className="mb-4">
//         You are: <strong>{role}</strong>
//       </p>
  
//       <div className="bg-white text-black p-8">
//         <div className="max-w-2xl mx-auto">
//           <div className="mb-8">
//             <div className="grid grid-cols-1 gap-4 mb-4">
//               <div className="font-semibold">Range (Min - Max)</div>
//             </div>
  
//             {issues.map((issue) => (
//               <div key={issue.name} className="mb-4">
//                 <div className="font-medium mb-2">{issue.name}</div>
//                 <ul className="space-y-2">
//                   {issue.options.map((option, idx) => (
//                     <li key={idx} className="flex items-center">
//                       <input
//                         type="radio"
//                         id={`${issue.name}-${idx}`}
//                         name={issue.name}
//                         value={option.range[0]} // Use the lower bound of the range
//                         onChange={(e) =>
//                           handleOfferChange(issue.name, parseInt(e.target.value))
//                         }
//                         className="mr-2"
//                       />
//                       <label htmlFor={`${issue.name}-${idx}`}>
//                       <span className="mr-2">
//                           {option.range[0]} – {option.range[1]}
//                         </span>
//                         <span className="text-sm text-gray-500">
//                           (Payoff: {role === "Hr" ? option.valueA : option.valueB})
//                         </span>
//                       </label>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             ))}
//           </div>
  
//           <div className="mt-4">
//             <button
//               onClick={submitOffer}
//               className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
//             >
//               Submit Offer
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { usePlayer, useGame, useStage } from "@empirica/core/player/classic/react";

export function BargainingTask() {
  const player = usePlayer();
  const game = useGame();
  const stage = useStage();
  const role = player.get("role");
  const issues = game.get("issues") || [];
  //console.log("Loaded issues in frontend:", issues);

  // Initialize local offer state with each issue's minimum value (from the first option)
  const initialOffer = {};
  issues.forEach((issue) => {
    initialOffer[issue.name] = issue.options[0].range[0];
  });
  const [offer, setOffer] = useState(initialOffer);

  // Define slider settings for each issue (you can customize these if needed)
  const sliderSettings = {
    salary: { min: 70000, max: 120000, step: 1000 },
    bonuses: { min: 0, max: 10000, step: 1000 },
    stockOptions: { min: 0, max: 250, step: 10 },
    vacationDays: { min: 10, max: 20, step: 1 },
  };

  // Helper to determine payoff for a given issue value based on its bracket
  const getPayoff = (issue, value) => {
    const option = issue.options.find(
      (opt) => value >= opt.range[0] && value <= opt.range[1]
    );
    if (option) {
      return role === "Hr" ? option.valueA : option.valueB;
    }
    return 0;
  };

  // Update offer state when a slider value changes
  const handleSliderChange = (issueName, newValue) => {
    setOffer((prevOffer) => ({
      ...prevOffer,
      [issueName]: newValue,
    }));
  };

  // Submit the current offer into stage offers and mark stage as submitted
  function submitOffer() {
    const currentOffers = stage.get("offers") || {};
    stage.set("offers", {
      ...currentOffers,
      [role]: offer,
    });
    console.log("Offer submitted:", offer);
    // Reset offer state (optional)
    setOffer(initialOffer);
    player.stage.set("submit", true);
  }

  return (
    <div className="flex flex-col items-center">
      <p className="mb-4">
        You are: <strong>{role}</strong>
      </p>
      <div className="bg-white text-black p-8 w-full max-w-3xl">
        <div className="mx-auto">
          <h2 className="text-lg font-semibold mb-6">Make Your Offer</h2>
          <div className="space-y-8">
            {issues.map((issue) => {
              const settings = sliderSettings[issue.name] || {
                min: issue.options[0].range[0],
                max: issue.options[issue.options.length - 1].range[1],
                step: 1,
              };
              const currentValue = offer[issue.name];
              const payoff = getPayoff(issue, currentValue);
              // Find the bracket range text for the current value
              const option = issue.options.find(
                (opt) =>
                  currentValue >= opt.range[0] && currentValue <= opt.range[1]
              );
              const rangeText = option
                ? `${option.range[0]} – ${option.range[1]}`
                : "";
              return (
                <div key={issue.name}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{issue.name}</span>
                    <span className="text-sm text-gray-500">
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
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs mt-1">
                    <span>{settings.min}</span>
                    <span>{settings.max}</span>
                  </div>
                  <div className="mt-1 text-sm text-gray-600">
                    Your chosen input range: {rangeText}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6">
            <button
              onClick={submitOffer}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Submit Offer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
