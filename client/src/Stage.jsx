import {
  usePlayer,
  usePlayers,
  useRound,
  useStage,
  useGame
} from "@empirica/core/player/classic/react";
import { Loading } from "@empirica/core/player/react";
import React, { useEffect,useState } from "react";
import { BargainingTask } from "./tasks/BargainingTask";
import { Result } from "./tasks/Result.jsx";
import { BatnaNotification } from "./BatnaNotification.jsx";

export function Stage() {
  const player = usePlayer();
  const players = usePlayers();
  const stage = useStage();
  const game = useGame();
  const round = useRound();
  const finished = game.get("finished");
  const [showNotification, setShowNotification] = useState(false);
  const [notifMessage, setNotifMessage] = useState(null);
  const [currentRound, setCurrentRound] = useState(0);
  const totalRounds=6;
  const roundIndex=game.get('roundIndex')-2;

  // useEffect(() => {
  //   if (player) {
  //     const notification = player.get("notification");
  //     if (notification) {
  //       alert(notification); // Display the notification to the player
  //       player.set("notification", null); // Clear the notification after displaying
  //     }
  //   }
  // }, [player]);

  useEffect(() => {
    if (player) {
      // Instead of alerting, check if notification exists and update state.
      const notification = player.get("notification");
      if (notification) {
        setNotifMessage(notification);
        console.log('new rounds',roundIndex);
        

          setCurrentRound(roundIndex);
          
        
        setShowNotification(true);
      }
    }
  }, [player, game,round]);

 

  if (player.stage.get("submit")) {
    if (players.length === 1) {
      return <Loading />;
    }

    return (
      <div className="text-center text-gray-400 pointer-events-none">
        Please wait for other player(s).
      </div>
    );
  }
  if (showNotification) {
    return (
      <BatnaNotification
        message={notifMessage}
        currentRound={currentRound}
        totalRounds={totalRounds}
        onResume={() => {
          // Clear the notification and resume normal game flow.
          setShowNotification(false);
          setNotifMessage(null);
          
          // Also clear the player's notification so it doesn't trigger again.
          player.set("notification", null);
        }}
      />
    );
  }

  switch (stage?.get("name")) {
    case "bar":
      return <BargainingTask />;
    // case "result":
    //   return <Result />; 
    default:
      return <div>Unknown task</div>;
  }
}