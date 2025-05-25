

// // ExitSVISurvey.jsx
// import React, { useState } from "react";
// import { usePlayer ,useGame} from "@empirica/core/player/classic/react";
// import { useProgress } from "../ProgressContext.jsx";
// // Define the selected survey items:
// // Category A: using item 1
// // Category B: using item 8
// // Category C: using item 12
// // Category D: all items (items 13, 14, 15, 16)
// const surveyItems = [
//   { id: "A1", text: "How satisfied are you with your own outcome—i.e., the extent to which the terms of your agreement (or lack of agreement) benefit you?" },
//   { id: "B8", text: "Did this negotiation positively or negatively impact your self-image or your impression of yourself?" },
//   { id: "C12", text: "Did your counterpart consider your wishes, opinions, or needs?" },
//   { id: "D13", text: "What kind of ‘overall’ impression did your counterpart make on you?" },
//   { id: "D14", text: "How satisfied are you with your relationship with your counterpart as a result of this negotiation?" },
//   { id: "D15", text: "Did the negotiation make you trust your counterpart?" },
//   { id: "D16", text: "Did the negotiation build a good foundation for a future relationship with your counterpart?" }
// ];

// export  function ExitSurvey({ next }) {
//   const player = usePlayer();
//   const game   = useGame();
//   // Initialize responses with an empty string for each item.
//   const initialResponses = {};
//   surveyItems.forEach((item) => {
//     initialResponses[item.id] = "";
//   });
//   const [responses, setResponses] = useState(initialResponses);
//   const { setCurrent, total } = useProgress();
//   useEffect(() => {
//     setCurrent(total); // Exit Survey is step 10 of 10
//   }, []);

//   // Update the state when an option is selected.
//   const handleChange = (e, id) => {
//     setResponses({
//       ...responses,
//       [id]: e.target.value,
//     });
//   };

//   // On form submission, store the responses on the player record.
//   const handleSubmit = async(e) => {
//     e.preventDefault();


//     // Save the responses as an array of objects, each containing question id, text, and rating
//     const collectedResponses = surveyItems.map((item) => ({
//       id: item.id,
//       text: item.text,
//       rating: responses[item.id]
//     }));
//     const prolificId = player.get("prolificId");  
//     const res = await fetch("http://localhost:5001/api/player/exitsurvey", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         ProlificId: prolificId,      // your Prolific ID
//         BatchId:    game.get("batchID"), 
//         GameId:     game.id,        // Empirica’s game.id
//         Exit_survey:collectedResponses
//       }),
//     });

//     if (!res.ok) {
//       const body = await res.json();
//       throw new Error(body.message || res.statusText);
//     }
//     console.log("Exit SVI responses:", collectedResponses);
//     // Save the collected responses in the player's record under the key "SVI_EXIT"
//     player.set("SVI_EXIT", collectedResponses);

//     // Proceed to the next step in the exit flow.
//     next();
//   };

//   return (
//     <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
//       <h2>Exit Survey: Subjective Value Inventory</h2>
//       <p>
//         For each statement below, please choose a number from 1 to 7 that best reflects your opinion. Use "NA" if the statement is not applicable.
//       </p>
//       <form onSubmit={handleSubmit}>
//         {surveyItems.map((item) => (
//           <div key={item.id} style={{ marginBottom: "20px" }}>
//             <label htmlFor={item.id} style={{ fontWeight: "bold" }}>
//               {item.text}
//             </label>
//             <br />
//             <select
//               id={item.id}
//               name={item.id}
//               value={responses[item.id]}
//               onChange={(e) => handleChange(e, item.id)}
//               required
//               style={{ width: "100%", padding: "8px", marginTop: "5px" }}
//             >
//               <option value="">Select response</option>
//               <option value="1">1 – Not at all / Extremely negative</option>
//               <option value="2">2</option>
//               <option value="3">3</option>
//               <option value="4">4</option>
//               <option value="5">5</option>
//               <option value="6">6</option>
//               <option value="7">7 – Perfectly / Extremely positive</option>
//               <option value="NA">NA</option>
//             </select>
//           </div>
//         ))}
//         <button type="submit" style={{ padding: "10px 20px", fontSize: "16px" }}>
//           Submit Exit Survey
//         </button>
//       </form>
//     </div>
//   );
// }

// ExitSurvey.jsx
import React, { useState, useEffect } from "react";
import { usePlayer, useGame } from "@empirica/core/player/classic/react";
import { useProgress } from "../ProgressContext.jsx";

const surveyItems = [
  {
    id: "A1",
    text:
      "How satisfied are you with your own outcome—i.e., the extent to which the terms of your agreement (or lack of agreement) benefit you?",
  },
  {
    id: "B8",
    text:
      "Did this negotiation positively or negatively impact your self-image or your impression of yourself?",
  },
  {
    id: "C12",
    text:
      "Did your counterpart consider your wishes, opinions, or needs?",
  },
  {
    id: "D13",
    text:
      "What kind of ‘overall’ impression did your counterpart make on you?",
  },
  {
    id: "D14",
    text:
      "How satisfied are you with your relationship with your counterpart as a result of this negotiation?",
  },
  {
    id: "D15",
    text: "Did the negotiation make you trust your counterpart?",
  },
  {
    id: "D16",
    text:
      "Did the negotiation build a good foundation for a future relationship with your counterpart?",
  },
];

// These are your column headers
const labels = [
  "1 – Extremely neg.",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7 – Extremely pos.",
  "NA",
];

export function ExitSurvey({ next }) {
  const player = usePlayer();
  const game = useGame();
  const { setCurrent, total } = useProgress();

  // 1) advance progress to final step
  useEffect(() => {
    setCurrent(total);
  }, []);

  // 2) initialize responses
  const initial = {};
  surveyItems.forEach((q) => (initial[q.id] = ""));
  const [responses, setResponses] = useState(initial);

  // 3) handler
  const handleChange = (id, val) => {
    setResponses((prev) => ({ ...prev, [id]: val }));
  };

  // 4) submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const collected = surveyItems.map((q) => ({
      id: q.id,
      text: q.text,
      rating: responses[q.id],
    }));
    player.set("SVI_EXIT", collected);
    //console.log("exit value",collected);
    const res = await fetch("http://localhost:5001/api/player/exitsurvey", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ProlificId: player.get("prolificId"),
        BatchId: game.get("batchID"),
        GameId: game.id,
        Exit_survey: collected,
      }),
    });
    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.message || res.statusText);
    }

      // 2) Bump the progress counter
  const progRes = await fetch("http://localhost:5001/api/player/progress", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(
      {ProlificId: player.get("prolificId"),
      GameId: game.id})
  });
  if (!progRes.ok) {
    console.error("Progress bump failed:", await progRes.text());
    return;
  }
   
  
    player.set("exitDone", true);
    
    next();
  };

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      <h2>Exit Survey: Subjective Value Inventory</h2>
      <p style={{ marginBottom: 16, color: "#555" }}>
        For each statement, select 1 (Extremely negative) up to 7 (Extremely
        positive). Use “NA” if not applicable.
      </p>

      <form onSubmit={handleSubmit}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: 20,
          }}
        >
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "8px 4px" }}>
                Statement
              </th>
              {labels.map((lab) => (
                <th
                  key={lab}
                  style={{ padding: 8, fontSize: 12, whiteSpace: "nowrap" }}
                >
                  {lab}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {surveyItems.map((q) => (
              <tr key={q.id} style={{ borderTop: "1px solid #ddd" }}>
                <td style={{ padding: "8px 4px" }}>
                  {q.text}
                </td>
                {labels.map((_, i) => {
                  const val = labels[i] === "NA" ? "NA" : String(i + 1);
                  return (
                    <td
                      key={val}
                      style={{ textAlign: "center", padding: 8 }}
                    >
                      <input
                        type="radio"
                        name={`q-${q.id}`}
                        value={val}
                        checked={responses[q.id] === val}
                        onChange={() => handleChange(q.id, val)}
                        required
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ textAlign: "right", marginTop: 20 }}>
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              fontSize: 16,
              backgroundColor: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Submit Exit Survey
          </button>
        </div>
      </form>
    </div>
  );
}
