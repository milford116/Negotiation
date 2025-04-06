import { EmpiricaClassic } from "@empirica/core/player/classic";
import { EmpiricaContext } from "@empirica/core/player/classic/react";
import { EmpiricaMenu, EmpiricaParticipant } from "@empirica/core/player/react";
import React, { useState } from "react";
import { Game } from "./Game";
import { ExitSurvey } from "./intro-exit/ExitSurvey";
import { Introduction } from "./intro-exit/Introduction";
import { MyConsent } from "./MyConsent.jsx";
import { MyPlayerForm } from "./MyPlayerForm.jsx";
import { UpdatePlayerInfo } from "./UpdatePlayerInfo.jsx";
import OnboardingSurvey from "./Onboarding_survey.jsx";

// Clear stored consent so the consent page is shown every time.
//localStorage.removeItem("empirica:consent");
export default function App() {

  // Local state to determine if the survey is complete.
  const [surveyComplete, setSurveyComplete] = useState(false);
  const urlParams = new URLSearchParams(window.location.search);
  //const playerKey = urlParams.get("participantKey") || "";
  const playerKey = Date.now().toString();

  
  const { protocol, host } = window.location;
  const url = `${protocol}//${host}/query`;
 
  function introSteps({ game, player, onNext }) { 
     const steps=[MyConsent];
    //const steps =[Introduction];
    steps.push(OnboardingSurvey);
    steps.push(Introduction);
    return steps;
    
  }

  function exitSteps({ game, player }) {
    return [ExitSurvey];
  }

  return (
    <EmpiricaParticipant url={url} ns={playerKey} modeFunc={EmpiricaClassic}>
      <div className="h-screen relative">
        <EmpiricaMenu position="bottom-left" />
        <div className="h-full overflow-auto">
          <EmpiricaContext 
         
          //consent={MyConsent}
          playerCreate={MyPlayerForm}
          introSteps={introSteps}
          exitSteps={exitSteps}

            >
          <UpdatePlayerInfo/>
          
          <Game/>
          </EmpiricaContext>
        </div>
      </div>
    </EmpiricaParticipant>
  );
}