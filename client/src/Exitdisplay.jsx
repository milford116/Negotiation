// GameDisplay.jsx
import React from "react";
import { useGame } from "@empirica/core/player/classic/react";
import { ExitSurvey } from "./intro-exit/ExitSurvey.jsx";
import { Exit } from "./Exit.jsx";


export function Exitdisplay() {
    const game = useGame();
  
    const { playerCount } = game.get("treatment");
  
  return playerCount == 1? <Exit/> : <ExitSurvey next={() => {}}/>;
}
