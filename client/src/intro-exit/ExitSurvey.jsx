

// ExitSVISurvey.jsx
import React, { useState } from "react";
import { usePlayer ,useGame} from "@empirica/core/player/classic/react";
//import { useProgress } from "../ProgressContext.jsx";
// Define the selected survey items:
// Category A: using item 1
// Category B: using item 8
// Category C: using item 12
// Category D: all items (items 13, 14, 15, 16)
const surveyItems = [
  { id: "A1", text: "How satisfied are you with your own outcome—i.e., the extent to which the terms of your agreement (or lack of agreement) benefit you?" },
  { id: "B8", text: "Did this negotiation positively or negatively impact your self-image or your impression of yourself?" },
  { id: "C12", text: "Did your counterpart consider your wishes, opinions, or needs?" },
  { id: "D13", text: "What kind of ‘overall’ impression did your counterpart make on you?" },
  { id: "D14", text: "How satisfied are you with your relationship with your counterpart as a result of this negotiation?" },
  { id: "D15", text: "Did the negotiation make you trust your counterpart?" },
  { id: "D16", text: "Did the negotiation build a good foundation for a future relationship with your counterpart?" }
];

export  function ExitSurvey({ next }) {
  const player = usePlayer();
  const game   = useGame();
  // Initialize responses with an empty string for each item.
  const initialResponses = {};
  surveyItems.forEach((item) => {
    initialResponses[item.id] = "";
  });
  const [responses, setResponses] = useState(initialResponses);
  // const { setCurrent, total } = useProgress();
  // useEffect(() => {
  //   setCurrent(total); // Exit Survey is step 10 of 10
  // }, []);

  // Update the state when an option is selected.
  const handleChange = (e, id) => {
    setResponses({
      ...responses,
      [id]: e.target.value,
    });
  };

  // On form submission, store the responses on the player record.
  const handleSubmit = async(e) => {
    e.preventDefault();
    
    
    // Save the responses as an array of objects, each containing question id, text, and rating
    const collectedResponses = surveyItems.map((item) => ({
      id: item.id,
      text: item.text,
      rating: responses[item.id]
    }));
    const prolificId = player.get("prolificId");  
    const res = await fetch("http://localhost:5001/api/player/exitsurvey", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ProlificId: prolificId,      // your Prolific ID
        BatchId:    game.get("batchID"), 
        GameId:     game.id,        // Empirica’s game.id
        Exit_survey:collectedResponses
      }),
    });

    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.message || res.statusText);
    }
    console.log("Exit SVI responses:", collectedResponses);
    // Save the collected responses in the player's record under the key "SVI_EXIT"
    player.set("SVI_EXIT", collectedResponses);
    
    // Proceed to the next step in the exit flow.
    next();
  };

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <h2>Exit Survey: Subjective Value Inventory</h2>
      <p>
        For each statement below, please choose a number from 1 to 7 that best reflects your opinion. Use "NA" if the statement is not applicable.
      </p>
      <form onSubmit={handleSubmit}>
        {surveyItems.map((item) => (
          <div key={item.id} style={{ marginBottom: "20px" }}>
            <label htmlFor={item.id} style={{ fontWeight: "bold" }}>
              {item.text}
            </label>
            <br />
            <select
              id={item.id}
              name={item.id}
              value={responses[item.id]}
              onChange={(e) => handleChange(e, item.id)}
              required
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            >
              <option value="">Select response</option>
              <option value="1">1 – Not at all / Extremely negative</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7 – Perfectly / Extremely positive</option>
              <option value="NA">NA</option>
            </select>
          </div>
        ))}
        <button type="submit" style={{ padding: "10px 20px", fontSize: "16px" }}>
          Submit Exit Survey
        </button>
      </form>
    </div>
  );
}
