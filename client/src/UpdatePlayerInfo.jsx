// UpdatePlayerInfo.jsx
import React, { useEffect } from "react";
import { usePlayer } from "@empirica/core/player/classic/react";

export  function UpdatePlayerInfo() {
  const player = usePlayer();

  useEffect(() => {
    
    const stored = sessionStorage.getItem("customAccountData");
    if (!stored) return;
    const { prolificId, username } = JSON.parse(stored);

    // stamp these onto the player's record on the server
    player.set("prolificId", prolificId);
    player.set("username", username);
        console.log(
          `Updated player ${player.id} with customId: ${prolificId} and username: ${username}`
        );
        // Remove the stored data so it doesn't persist.
        sessionStorage.removeItem("customAccountData");
      
    
  }, [player]);

  return null; // This component does not render visible UI.
}
