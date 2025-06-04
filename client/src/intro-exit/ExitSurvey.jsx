
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
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        {
          ProlificId: player.get("prolificId"),
          GameId: game.id
        })
    });
    if (!progRes.ok) {
      console.error("Progress bump failed:", await progRes.text());
      return;
    }


    player.set("exitDone", true);

    next();
  };

  return (

    <div className="bg-[#fffbea] text-black px-8 py-12 min-h-screen epilogue-body">

      <div className="max-w-5xl mx-auto text-[1.05rem] leading-7">

        <h2 className="text-4xl font-extrabold uppercase text-center mb-6 anton-regular">

          Exit Survey

        </h2>



        <p className="mb-3 anton-regular">

          Below are statements about your experience. Please select a number

          next to each statement to indicate how you feel. Use “NA” if not

          applicable.

        </p>

        <p className="text-sm text-gray-600 mb-6">

          1 = Extremely negative … 7 = Extremely positive

        </p>



        <form onSubmit={handleSubmit}>

          <table className="w-full border-separate border-spacing-y-2">

            <thead>

              <tr className="text-sm text-gray-700">

                <th className="text-left text-2xl py-2 anton-regular">

                  Statements

                </th>

                {labels.map((lab) => (

                  <th key={lab} className="text-center px-2 font-normal">

                    {lab}

                  </th>

                ))}

              </tr>

            </thead>

            <tbody>

              {surveyItems.map((q) => (

                <tr

                  key={q.id}

                  className="bg-white border border-gray-800 rounded"

                >

                  <td className="p-3">{q.text}</td>

                  {labels.map((label, i) => {

                    const val = label === "NA" ? "NA" : String(i + 1);

                    return (

                      <td key={val} className="text-center">

                        <input

                          type="radio"

                          name={`q-${q.id}`}

                          value={val}

                          checked={responses[q.id] === val}

                          onChange={() => handleChange(q.id, val)}

                          //required

                          className="form-radio text-blue-600 h-4 w-4"

                        />

                      </td>

                    );

                  })}

                </tr>

              ))}

            </tbody>

          </table>



          <div className="mt-8 text-center">

            <button

              type="submit"

              className="px-6 py-2 rounded bg-black text-white hover:bg-green-700 font-semibold"

            >

              Submit Exit Survey

            </button>

          </div>

        </form>

      </div>

    </div>

  );
}
