// GameDisplay.jsx
import React from "react";
import { useGame } from "@empirica/core/player/classic/react";
import { Game } from "./Game.jsx";
import { MyNoGames } from "./MyNoGames";


export function GameDisplay() {
    const game = useGame();
  
    const { playerCount } = game.get("treatment");
  
  return playerCount == 1? <MyNoGames/> : <Game/>;
}
