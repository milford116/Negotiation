import React, { useState, useEffect } from "react";
import { usePlayer, useGame } from "@empirica/core/player/classic/react";
import { Button } from "./components/Button"; // Assuming you have this component

export function PlayerAuth() {
  const player = usePlayer();
  const [playerName, setPlayerName] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (!playerName.trim() || !playerId.trim()) {
      setError("Please enter both name and ID");
      return;
    }
    
    // Check if ID is already in use by another player
    const game = player.get("game");
    const existingPlayerWithId = game?.players?.find(
      p => p.id !== player.id && p.get("id") === playerId.trim()
    );
    
    if (existingPlayerWithId) {
      setError("This ID is already in use. Please choose another ID.");
      return;
    }

    // Set the player name and ID in the player object
    player.set("name", playerName.trim());
    player.set("id", playerId.trim());
    
    // Store authentication timestamp for potential matchmaking order
    player.set("authTime", new Date().getTime());
    
    // Immediately set the player to waiting status
    player.set("waiting", true);

    setError("");
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="bg-white p-8 rounded shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold mb-4 text-center">Welcome to the Negotiation Game</h1>
        <p className="mb-6 text-center">
          Please enter your name and ID to join the waiting room.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="text-red-500 text-center">{error}</div>}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your ID
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={playerId}
              onChange={(e) => setPlayerId(e.target.value)}
              placeholder="Enter your ID"
            />
          </div>

          <Button type="submit" className="w-full">
            Join Waiting Room
          </Button>
        </form>
      </div>
    </div>
  );
}