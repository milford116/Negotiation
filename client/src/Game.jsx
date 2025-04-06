import { Chat, useGame } from "@empirica/core/player/classic/react";

import React from "react";
import { Profile } from "./Profile";
import { Stage } from "./Stage";
import { OffersSidebar } from "./OffersSidebar.jsx";
export function Game() {
  const game = useGame();
  const { playerCount } = game.get("treatment");
// Retrieve previous offers from the game state.
  const previousOffers = game.get("previousOffers") || [];
  return (
    <div className="h-full w-full flex">
      {/* Left Column: Offers Sidebar */}
      <div className="w-1/4 border-r p-4 overflow-auto">
        <OffersSidebar previousOffers={previousOffers} />
      </div>

      {/* Center Column: Negotiation Interface */}
      <div className="flex-1 flex flex-col">
        <Profile />
        <div className="flex-1 flex items-center justify-center">
          <Stage />
        </div>
      </div>

      {playerCount > 1 && (
        <div className="w-1/4 border-l p-4 flex justify-center items-center">
          <Chat scope={game} attribute="chat" />
        </div>
      )}
    </div>
  );
}
