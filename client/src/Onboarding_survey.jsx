// OnboardingSurvey.jsx
import React, { useState ,useEffect} from "react";
import { usePlayer, useGame } from "@empirica/core/player/classic/react";
import { useProgress } from "./ProgressContext.jsx";

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
  const { setCurrent } = useProgress();
  useEffect(() => {
    setCurrent(3); // Onboarding is step 3 of 10
  }, []);
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
    <div className="bg-[#fcf9f4] text-black px-8 py-12 min-h-screen epilogue-body">
      <div className="max-w-5xl mx-auto text-[1.05rem] leading-7">
        <h2 className="text-4xl font-extrabold uppercase text-center mb-6 anton-regular">
          Onboarding Survey
        </h2>

        <p className="mb-3">
          Here are a number of characteristics that may or may not apply to you. For example, do you agree that you are
          someone who likes to spend time with others? Please select a number next to each statement to indicate the extent
          to which you agree or disagree with that statement.
        </p>
        <p className="text-sm text-gray-600 mb-6">
          1 = Disagree strongly … 5 = Agree strongly
        </p>
        <p className="font-semibold anton-regular mb-4">I am someone who...</p>

        <form
          onSubmit={
            page === N_PAGES - 1
              ? handleSubmit
              : (e) => {
                  e.preventDefault();
                  handleNext();
                }
          }
        >
          <table className="w-full border-separate border-spacing-y-2">
            <thead>
              <tr className="text-sm text-gray-700">
                <th className="text-left py-2">Statement</th>
                {labels.map((lab) => (
                  <th key={lab} className="text-center px-2 font-normal">
                    {lab}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {slice.map((q) => (
                <tr key={q.id} className="bg-white border border-gray-300 rounded">
                  <td className="p-3">{q.id}. {q.text}</td>
                  {[1, 2, 3, 4, 5].map((val) => (
                    <td key={val} className="text-center">
                      <input
                        type="radio"
                        name={`q-${q.id}`}
                        value={val}
                        checked={responses[q.id] === String(val)}
                        onChange={() => handleChange(q.id, String(val))}
                        //required
                        className="form-radio text-blue-600 h-4 w-4"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Navigation */}
          <div className="mt-8 flex justify-between">
            <button
              type="button"
              onClick={handlePrev}
              disabled={page === 0}
              className={`px-6 py-2 rounded font-semibold ${
                page === 0
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-gray-700 text-white hover:bg-gray-800"
              }`}
            >
              Previous
            </button>

            {page < N_PAGES - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 font-semibold"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2 rounded bg-green-600 text-white hover:bg-green-700 font-semibold"
              >
                Submit Survey
              </button>
            )}
          </div>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          Page {page + 1} of {N_PAGES}
        </p>
      </div>
    </div>
  );
}
