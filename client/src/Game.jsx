// Game.jsx
import React, { useState } from "react";
import { useGame, usePlayer } from "@empirica/core/player/classic/react";
import { Profile } from "./Profile";
import { Stage } from "./Stage";
import { OffersSidebar } from "./OffersSidebar";
import { ExitSurvey } from "./intro-exit/ExitSurvey";
import { CustomChat } from "./components/CustomChat";

export function Game() {
  const game = useGame();
  const player = usePlayer();
  const { playerCount } = game.get("treatment");
  const finished = game.get("finished");
  const previousOffers = game.get("previousOffers") || [];
  const messages = game.get("chat") || [];
  const chatStarted = messages.length > 0;

  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (finished) return <ExitSurvey />;

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
          <CustomChat />
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