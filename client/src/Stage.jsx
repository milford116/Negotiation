import {
  usePlayer,
  usePlayers,
  useRound,
  useStage,
  useGame,
} from "@empirica/core/player/classic/react";
import { Loading } from "@empirica/core/player/react";
import React, { useEffect, useState } from "react";
import { BargainingTask } from "./tasks/BargainingTask";
import { Result } from "./tasks/Result.jsx";
import { BatnaNotification } from "./BatnaNotification.jsx";
import { useProgress } from "./ProgressContext.jsx";


export function Stage({ chatStarted }) {
  const player = usePlayer();
  const players = usePlayers();
  const stage = useStage();
  const game = useGame();
  const round = useRound();
  const finished = game.get("finished");
  const { setCurrent } = useProgress();
  const [showNotification, setShowNotification] = useState(false);
  const [notifMessage, setNotifMessage] = useState(null);
  const [currentRound, setCurrentRound] = useState(0);
  const totalRounds=6;
  const roundIndex=game.get('roundindex')-1;

  // if (player.stage.get("submit")) {
  //   if (players.length === 1) {
  //     return <Loading />;
  //   }
  //   return (
  //     <div className="text-center text-gray-400 pointer-events-none">
  //       Please wait for the other player...
  //     </div>
  //   );
  // }
  useEffect(() => {
    setCurrent(4 + roundIndex);     // rounds occupy steps 4–9
  }, [roundIndex]);

  useEffect(() => {
    if (player) {
      const notification = player.get("notification");
      if (notification) {
        setNotifMessage(notification);
        console.log("new rounds", roundIndex);
        setCurrentRound(roundIndex);
        setShowNotification(true);
      }
    }
  }, [player, game, round]);

  if (showNotification) {
    return (
      <div className="w-full h-full bg-black text-white p-6 rounded shadow-md">
        <BatnaNotification
          message={notifMessage}
          currentRound={currentRound}
          totalRounds={totalRounds}
          onResume={() => {
            setShowNotification(false);
            setNotifMessage(null);
            player.set("notification", null);
          }}
        />
      </div>
    );
  }

  let content;

  switch (stage?.get("name")) {
    case "Negotiation":
      content = <BargainingTask chatStarted={chatStarted} />;
      break;
    // case "Result":
    //   content = <Result />;
    //   break;
    default:
      content = <div className="text-cyan-200 text-xl">Unknown task</div>;
  }

  return (
    <div className="w-full h-full bg-black text-white p-6 rounded shadow-inner">
      {content}
    </div>
  );
}
