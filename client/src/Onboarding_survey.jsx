// import React, { useState } from "react";
// import { usePlayer ,useGame} from "@empirica/core/player/classic/react";

// // Define the 30 BFI-2-S items.
// const questions = [
//   { id: 1, text: "Tends to be quiet." },
//   { id: 2, text: "Is compassionate, has a soft heart." },
//   { id: 3, text: "Tends to be disorganized." },
//   { id: 4, text: "Worries a lot." },
//   { id: 5, text: "Is fascinated by art, music, or literature." },
//   { id: 6, text: "Is dominant, acts as a leader." },
//   { id: 7, text: "Is sometimes rude to others." },
//   { id: 8, text: "Has difficulty getting started on tasks." },
//   { id: 9, text: "Tends to feel depressed, blue." },
//   { id: 10, text: "Has little interest in abstract ideas." },
//   { id: 11, text: "Is full of energy." },
//   { id: 12, text: "Assumes the best about people." },
//   { id: 13, text: "Is reliable, can always be counted on." },
//   { id: 14, text: "Is emotionally stable, not easily upset." },
//   { id: 15, text: "Is original, comes up with new ideas." },
//   { id: 16, text: "Is outgoing, sociable." },
//   { id: 17, text: "Can be cold and uncaring." },
//   { id: 18, text: "Keeps things neat and tidy." },
//   { id: 19, text: "Is relaxed, handles stress well." },
//   { id: 20, text: "Has few artistic interests." },
//   { id: 21, text: "Prefers to have others take charge." },
//   { id: 22, text: "Is respectful, treats others with respect." },
//   { id: 23, text: "Is persistent, works until the task is finished." },
//   { id: 24, text: "Feels secure, comfortable with self." },
//   { id: 25, text: "Is complex, a deep thinker." },
//   { id: 26, text: "Is less active than other people." },
//   { id: 27, text: "Tends to find fault with others." },
//   { id: 28, text: "Can be somewhat careless." },
//   { id: 29, text: "Is temperamental, gets emotional easily." },
//   { id: 30, text: "Has little creativity." }
// ];


// export default function OnboardingSurvey({ next }) {
//   const player = usePlayer();
//   const game   = useGame();
//   // Initialize responses as an object with keys for each question id.
//   const initialState = {};
//   questions.forEach(q => {
//     initialState[q.id] = ""; 
//   });
  
//   const [responses, setResponses] = useState(initialState);

//   const handleChange = (e, id) => {
//     setResponses({
//       ...responses,
//       [id]: e.target.value,
//     });
//   };

//   const handleSubmit = async(e) => {
//     e.preventDefault();
    

//     // Transform responses into an array of objects with question id, text, and rating.
//     // We parse each rating to a number.
//     const collectedResponses = questions.map(q => ({
//       id: q.id,
//       text: q.text,
//       rating: parseInt(responses[q.id], 10)
//     }));
//     const prolificId = player.get("prolificId");  
//     console.log('prolific',prolificId);
//     const res = await fetch("http://localhost:5001/api/player/bfi", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         ProlificId: prolificId,      // your Prolific ID
//         BatchId:    game.get("batchID"), 
//         GameId:     game.id,        // Empirica’s game.id
//         Bfi:collectedResponses
//       }),
//     });

//     if (!res.ok) {
//       const body = await res.json();
//       throw new Error(body.message || res.statusText);
//     }
//     console.log("Survey submitted:", collectedResponses);
    
//     // Save the survey responses to the player record under the "BFI2S" field.
//     player.set("BFI2S", collectedResponses);
    
//     // Proceed to the next step.
//     next();
//   };

//   return (
//     <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
//       <h2>Onboarding Survey</h2>
//       <p>
//       Here are a number of characteristics that may or may not apply to you. For example, do you agree that you are
// someone who likes to spend time with others? Please write a number next to each statement to indicate the extent
// to which you agree or disagree with that statement.
//       </p>
//       <p>
//         <strong>1</strong> - Disagree strongly; <strong>2</strong> - Disagree a little; 
//         <strong>3</strong> - Neutral; <strong>4</strong> - Agree a little; <strong>5</strong> - Agree strongly.
//       </p>

//       <b>
//       I am someone who...
//       </b>
//       <form onSubmit={handleSubmit}>
//         {questions.map(q => (
//           <div key={q.id} style={{ marginBottom: "15px" }}>
//             <label htmlFor={`q-${q.id}`} style={{ fontWeight: "bold" }}>
//               {q.id}. {q.text}
//             </label>
//             <br />
//             <select
//               id={`q-${q.id}`}
//               value={responses[q.id]}
//               onChange={(e) => handleChange(e, q.id)}
//               required
//               style={{ width: "100%", padding: "8px", marginTop: "5px" }}
//             >
//               <option value="">Select rating</option>
//               <option value="1">1 - Disagree strongly</option>
//               <option value="2">2 - Disagree a little</option>
//               <option value="3">3 - Neutral</option>
//               <option value="4">4 - Agree a little</option>
//               <option value="5">5 - Agree strongly</option>
//             </select>
//           </div>
//         ))}
//         <button type="submit" style={{ padding: "10px 20px", fontSize: "16px" }}>
//           Submit Survey
//         </button>
//       </form>
//     </div>
//   );
// }

// OnboardingSurvey.jsx
import React, { useState ,useEffect} from "react";
import { usePlayer, useGame } from "@empirica/core/player/classic/react";
//import { useProgress } from "./ProgressContext.jsx";

// // Define the 30 BFI-2-S items.
const questions = [
  { id: 1, text: "Tends to be quiet." },
  { id: 2, text: "Is compassionate, has a soft heart." },
  { id: 3, text: "Tends to be disorganized." },
  { id: 4, text: "Worries a lot." },
  { id: 5, text: "Is fascinated by art, music, or literature." },
  { id: 6, text: "Is dominant, acts as a leader." },
  { id: 7, text: "Is sometimes rude to others." },
  { id: 8, text: "Has difficulty getting started on tasks." },
  { id: 9, text: "Tends to feel depressed, blue." },
  { id: 10, text: "Has little interest in abstract ideas." },
  { id: 11, text: "Is full of energy." },
  { id: 12, text: "Assumes the best about people." },
  { id: 13, text: "Is reliable, can always be counted on." },
  { id: 14, text: "Is emotionally stable, not easily upset." },
  { id: 15, text: "Is original, comes up with new ideas." },
  { id: 16, text: "Is outgoing, sociable." },
  { id: 17, text: "Can be cold and uncaring." },
  { id: 18, text: "Keeps things neat and tidy." },
  { id: 19, text: "Is relaxed, handles stress well." },
  { id: 20, text: "Has few artistic interests." },
  { id: 21, text: "Prefers to have others take charge." },
  { id: 22, text: "Is respectful, treats others with respect." },
  { id: 23, text: "Is persistent, works until the task is finished." },
  { id: 24, text: "Feels secure, comfortable with self." },
  { id: 25, text: "Is complex, a deep thinker." },
  { id: 26, text: "Is less active than other people." },
  { id: 27, text: "Tends to find fault with others." },
  { id: 28, text: "Can be somewhat careless." },
  { id: 29, text: "Is temperamental, gets emotional easily." },
  { id: 30, text: "Has little creativity." }
];
const PAGE_SIZE = 10;
const N_PAGES = Math.ceil(questions.length / PAGE_SIZE);

export default function OnboardingSurvey({ next }) {
  const player = usePlayer();
  const game   = useGame();
  // const { setCurrent } = useProgress();
  // useEffect(() => {
  //   setCurrent(3); // Onboarding is step 3 of 10
  // }, []);
  // responses: { [questionId]: "1"|"2"|"3"|"4"|"5" }
  const [responses, setResponses] = useState({});
  const [page, setPage] = useState(0);

  const handleChange = (qid, value) => {
    setResponses((prev) => ({ ...prev, [qid]: value }));
  };

  const handleNext = () => setPage((p) => Math.min(p + 1, N_PAGES - 1));
  const handlePrev = () => setPage((p) => Math.max(p - 1, 0));

  const handleSubmit = async (e) => {
    e.preventDefault();
    // assemble and POST exactly as you did
    const collected = questions.map((q) => ({
      id: q.id,
      text: q.text,
      rating: parseInt(responses[q.id], 10)
    }));
    await fetch("http://localhost:5001/api/player/bfi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ProlificId: player.get("prolificId"),
        BatchId:    game.get("batchID"),
        GameId:     game.id,
        Bfi:        collected
      })
    });
    player.set("BFI2S", collected);
    next();
  };

  // Which questions to show this page:
  const start = page * PAGE_SIZE;
  const slice = questions.slice(start, start + PAGE_SIZE);

  // Column headings
  const labels = [
    "1 – Disagree strongly",
    "2 – Disagree a little",
    "3 – Neither agree nor disagree",
    "4 – Agree a little",
    "5 – Agree strongly"
  ];

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      <h2>Onboarding Survey</h2>
      <p>
      Here are a number of characteristics that may or may not apply to you. For example, do you agree that you are
 someone who likes to spend time with others? Please select a number next to each statement to indicate the extent
 to which you agree or disagree with that statement.
      </p>
      <p style={{ fontSize: 14, color: "#555" }}>
        1 = Disagree strongly … 5 = Agree strongly
      </p>
      <b>
       I am someone who...
       </b>

      <form onSubmit={page === N_PAGES - 1 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 20 }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "8px 4px" }}>Statement</th>
              {labels.map((lab) => (
                <th key={lab} style={{ padding: "8px", fontSize: 12 }}>{lab}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slice.map((q) => (
              <tr key={q.id} style={{ borderTop: "1px solid #ddd" }}>
                <td style={{ padding: "8px 4px" }}>{q.id}. {q.text}</td>
                {[1,2,3,4,5].map((val) => (
                  <td key={val} style={{ textAlign: "center", padding: "8px" }}>
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      value={val}
                      checked={responses[q.id] === String(val)}
                      onChange={() => handleChange(q.id, String(val))}
                      required
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Navigation buttons */}
        <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between" }}>
          <button
            type="button"
            onClick={handlePrev}
            disabled={page === 0}
            style={{
              padding: "8px 16px",
              background: page === 0 ? "#ccc" : "#666",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: page === 0 ? "not-allowed" : "pointer"
            }}
          >
            Previous
          </button>

          {page < N_PAGES - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              style={{
                padding: "8px 16px",
                background: "#0077cc",
                color: "white",
                border: "none",
                borderRadius: 4,
                cursor: "pointer"
              }}
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              style={{
                padding: "8px 16px",
                background: "#28a745",
                color: "white",
                border: "none",
                borderRadius: 4,
                cursor: "pointer"
              }}
            >
              Submit Survey
            </button>
          )}
        </div>

      </form>

      <p style={{ marginTop: 10, textAlign: "center", fontSize: 12, color: "#888" }}>
        Page {page + 1} of {N_PAGES}
      </p>
    </div>
  );
}
