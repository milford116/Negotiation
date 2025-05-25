import { Chat, useGame, usePlayer,useRound} from "@empirica/core/player/classic/react";
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
  //const round  = useRound();     
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { playerCount } = game.get("treatment");
  const messages = game.get("chat") || [];
  //const messages = round.get("chat") || [];
  const chatStarted = messages.length > 0;
  const isHr = player.get("role") === "Hr";
  // Retrieve previous offers from the game state.
  const previousOffers = game.get("previousOffers") || [];
  const exitDone    = player.get("exitDone");
  const finished = game.get("finished");
  // 1) If the game ended but exit‐survey hasn’t run yet, show it:
  if (finished && !exitDone) {
    return (
      <ExitSurvey
        next={() => {
          
        }}
      />
    );
  }

  // 2) Once that survey calls next(), we flip to <Finished/>
  if (finished && exitDone) {
    return <Finished />;
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-black font-inter overflow-hidden">
      {/* Top Bar */}
      <div className="w-full flex items-center justify-between px-6 py-3 bg-black text-white shadow z-30">
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-white font-semibold text-lg hover:opacity-80 anton-regular bg-black"
        >
          ☰ Past Offers
        </button>
        <h1 className="text-2xl anton-regular text-cyan-200">Negotiation Game</h1>
        <div className="w-24" />
      </div>

      {/* Sidebar Drawer */}
      <div
        className={`fixed top-0 left-0 h-full bg-black shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } w-80 p-4`}
      >
        <OffersSidebar previousOffers={previousOffers} onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-row overflow-auto">
        {/* Chat Section */}
        <div className="w-[40%] p-4 overflow-y-auto max-h-[calc(100vh-4rem)]">
          <Chat scope={game} attribute="chat" />
        </div>

        {/* Right Side: Profile + Stage */}
        <div className="w-[60%] flex flex-col p-4 overflow-y-auto max-h-[calc(100vh-4rem)]">
          <Profile />
          <div className="flex-1 flex items-start justify-center">
            <Stage chatStarted={chatStarted} />
          </div>
        </div>
      </div>
    </div>
  );
}