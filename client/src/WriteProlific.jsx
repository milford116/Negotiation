// WriteProlificID.jsx
import React, { useEffect } from "react";
import { usePlayer } from "@empirica/core/player/classic/react";

export function WriteProlific({ next }) {
  const player = usePlayer();

  useEffect(() => {
    const stored = sessionStorage.getItem("customAccountData");
    if (stored) {
      const { prolificId } = JSON.parse(stored);
      player.set("prolificId", prolificId);
      console.log('alu',prolificId);
    }
    // immediately jump to the *real* first intro step
    next();
  }, [player, next]);

  // renders nothing of its own
  return null;
}

