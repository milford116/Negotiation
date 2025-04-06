// MainContent.jsx
import React from "react";
import { usePlayer } from "@empirica/core/player/classic/react";
import {Game} from "./Game";
import OnboardingSurvey from "./Onboarding_survey.jsx";


export default function MainContent() {
  const player = usePlayer();
  if (!player) return <div>Loading...</div>;

  const introComplete = player.get("introComplete");
  return (
    introComplete ? <Game /> : <OnboardingSurvey />
  );
}
