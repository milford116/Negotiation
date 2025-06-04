import {
  usePlayer,
  useRound,
  useStage,
  useGame
} from "@empirica/core/player/classic/react";
import React from "react";
import { Avatar } from "./components/Avatar";
import { Timer } from "./components/Timer";

export function Profile() {
  const player = usePlayer();
  const round = useRound();
  const stage = useStage();
  const game = useGame();
  const totalRounds = 6;  // Use correct logic for your game
  const roundNumber = game.get('roundindex') !== undefined ? game.get('roundindex') : 1;
  const isFinalRound = roundNumber === totalRounds;

  const score = player.get("score") || 0;

  return (
    <div className="min-w-lg md:min-w-2xl mt-2 m-x-auto px-3 py-2 rounded-md grid grid-cols-3 items-center bg-black text-white border border-gray-700">
      <div className="leading-tight ml-1">
        <div className="text-white text-xl font-bold">
          {/* /*{round ? round.get("name") : ""}*/ }
          {isFinalRound ? "Final Round: Agreement Phase" : round.get("name")}
        </div>
        <div className="text-white font-medium">
          {stage ? stage.get("name") : ""}
        </div>
      </div>

      <Timer />

      <div className="flex space-x-3 items-center justify-end">
        <div className="flex flex-col items-center">
          {/* <div className="text-xs font-semibold uppercase tracking-wide leading-none text-gray-400">
            Final Score
          </div>
          <div className="text-3xl font-semibold !leading-none tabular-nums">
            {score}
          </div> */}
        </div>
        <div className="h-11 w-11">
          <Avatar player={player} />
        </div>
      </div>
    </div>
  );
}
