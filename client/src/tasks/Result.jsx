import React, { useEffect } from "react";
import { usePlayer, usePlayers,useGame } from "@empirica/core/player/classic/react";
import { Button } from "../components/Button";
import { ParetoChart } from "./ParetoChart.jsx";
export function Result() {
  const player = usePlayer();
  const players = usePlayers();
  const role = player.get("role");
  const game = useGame();
  const finalScore = player.get("score");
  // Feasible outcomes and Pareto Frontier
  const feasibleOutcomes = game.get("feasibleOutcomes") || [];
  const paretoFrontier = game.get("paretoFrontier") || [];
 
    
  // Determine if this is the final result
  const isFinalRound = game.get("finished") === true;
  console.log('final round',isFinalRound);

  //const partner = players.filter((p) => p.id !== player.id)[0];
  useEffect(() => {
    console.log("Game state updated:", game);
    console.log("Feasible Outcomes:", game.get("feasibleOutcomes"));
    console.log("Pareto Frontier:", game.get("paretoFrontier"));
  }, [game]);
  
  return (
    <div>
      
      <p className="mb-4">You are: <strong>{role}</strong></p>
      {isFinalRound && (
        <div>
          
        </div>
      )}
      <Button handleClick={() => player.stage.set("submit", true)}>
        Continue
      </Button>
    </div>
  );
}