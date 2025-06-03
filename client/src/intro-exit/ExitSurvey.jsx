
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
  const API_BASE = window.location.hostname === "localhost"
  ? "http://localhost:5001"
  : "";
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
    const res = await fetch(`${API_BASE}/api/player/exitsurvey`, {
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
  const progRes = await fetch(`${API_BASE}/api/player/progress`, {
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
