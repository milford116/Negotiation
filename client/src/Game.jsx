import { Chat, useGame, usePlayer} from "@empirica/core/player/classic/react";
import { MyNoGames } from "./MyNoGames.jsx";
import React, { useState,useEffect } from "react";
import { Profile } from "./Profile";
import { Stage } from "./Stage";
import { OffersSidebar } from "./OffersSidebar.jsx";
import { ExitSurvey } from "./intro-exit/ExitSurvey.jsx";
import { Finished } from "./Finished.jsx";
export function Game() {
  const game = useGame();
  const player = usePlayer();
  const { playerCount } = game.get("treatment");
  const messages = game.get("chat") || [];
  const chatStarted = messages.length > 0;
  const isHr = player.get("role") === "Hr";
  // Retrieve previous offers from the game state.
  const previousOffers = game.get("previousOffers") || [];
  // local state to step from ExitSurvey → Finished
  const [surveyDone, setSurveyDone] = useState(false);
  const finished = game.get("finished");
  // 1) If the game ended but exit‐survey hasn’t run yet, show it:
  if (finished && !surveyDone) {
    return (
      <ExitSurvey
        next={() => {
          setSurveyDone(true);
        }}
      />
    );
  }

  // 2) Once that survey calls next(), we flip to <Finished/>
  if (finished && surveyDone) {
    return <Finished />;
  }

  return (
    <div className="h-full flex w-full">
      {/* Left Column: Offers Sidebar */}
      <div className="w-1/4 border-r p-4 overflow-auto">
        <OffersSidebar previousOffers={previousOffers} />
      </div>

      {/* Center: Chat */}
      {playerCount > 1 && (
        <div className="w-1/4 border-l border-r p-4 flex flex-col">
          {/* Prompt until HR breaks the ice */}
          {!chatStarted ? (
            isHr ? (
              <div className="p-3 bg-yellow-100 rounded mb-4 text-center text-yellow-800">
                💬 HR: please send the first message.
              </div>
            ) : (
              <div className="p-3 bg-gray-100 rounded mb-4 text-center text-gray-600">
                🕒 Waiting for HR to start…
              </div>
            )
          ) : null}
          <div className="flex-1 overflow-auto">
            <Chat scope={game} attribute="chat" />
          </div>
        </div>
      )}

      {/* 3) Right column: Profile + Stage */}
      <div className="flex-1 flex flex-col p-4">
        <Profile />
        <div className="flex-1 flex items-center justify-center">
          <Stage chatStarted={chatStarted} />
        </div>
      </div>


    </div>
  );
}
