// UpdatePlayerInfo.jsx
import React, { useEffect } from "react";
import { usePlayer } from "@empirica/core/player/classic/react";

export  function UpdatePlayerInfo() {
  const player = usePlayer();

  useEffect(() => {
    if (!player) return;
    // Get custom account data from localStorage (only set in "create" mode)
    const data = sessionStorage.getItem("customAccountData");
    if (data) {
      try {
        const parsed = JSON.parse(data);
        console.log('parsed',parsed);
        // Update the player's record with the custom info.
        player.set("customId", parsed.id);
        player.set("username", parsed.username);
        console.log(
          `Updated player ${player.id} with customId: ${parsed.id} and username: ${parsed.username}`
        );
        // Remove the stored data so it doesn't persist.
        sessionStorage.removeItem("customAccountData");
      } catch (error) {
        console.error("Error parsing customAccountData", error);
      }
    }
  }, [player]);

  return null; // This component does not render visible UI.
}
