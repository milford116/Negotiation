import React, { useEffect, useState } from "react";
import { usePlayer } from "@empirica/core/player/classic/react";

export function WaitingRoom() {
  const player = usePlayer();
  const [waitTime, setWaitTime] = useState(0);

  // Update wait time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setWaitTime((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Format wait time as mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="bg-white p-8 rounded shadow-lg max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Waiting for a Partner</h2>
        
        <div className="mb-6">
          <p className="mb-2">
            Welcome, <span className="font-semibold">{player.get("name") || "Player"}</span>!
          </p>
          <p>
            We're matching you with another player for your negotiation session.
            Please wait while we find a suitable partner for you.
          </p>
        </div>
        
        <div className="flex items-center justify-center mb-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mr-3"></div>
          <span className="text-lg font-medium">
            Wait time: {formatTime(waitTime)}
          </span>
        </div>
        
        <p className="text-sm text-gray-500">
          The game will begin automatically once you've been matched with another player.
        </p>
      </div>
    </div>
  );
}