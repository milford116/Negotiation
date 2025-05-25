import { EmpiricaClassic } from "@empirica/core/player/classic";
import { EmpiricaContext } from "@empirica/core/player/classic/react";
import { EmpiricaMenu, EmpiricaParticipant } from "@empirica/core/player/react";


import { GameDisplay } from "./GameDisplay.jsx";
import React, { useState,useEffect } from "react";

import { Game } from "./Game";
import { ExitSurvey } from "./intro-exit/ExitSurvey";
import { Exitdisplay } from "./Exitdisplay.jsx";
import { Introduction } from "./intro-exit/Introduction";
import { MyConsent } from "./MyConsent.jsx";
import { MyConsent2 } from "./MyConsent2.jsx";
import { MyPlayerForm } from "./MyPlayerForm.jsx";
import { UpdatePlayerInfo } from "./UpdatePlayerInfo.jsx";
import OnboardingSurvey from "./Onboarding_survey.jsx";
import { MyNoGames } from "./MyNoGames.jsx";
import { Finished } from "./Finished.jsx";
import { Demographic } from "./Demographic.jsx";
import { WriteProlific } from "./WriteProlific.jsx";
import { Exit } from "./Exit.jsx";
import { ProgressBar } from "./ProgressBar.jsx";
import { ProgressProvider } from "./ProgressContext.jsx";
import { AdminMonitor } from "./AdminMonitor.jsx";
import { DemoVideo } from "./Demovide.jsx";
import { GameInstructions } from "./GameInstructions.jsx";
import { ImportantInfo } from "./ImportantInfo.jsx";

export default function App() {

  // Local state to determine if the survey is complete.
  const [surveyComplete, setSurveyComplete] = useState(false);
  const urlParams = new URLSearchParams(window.location.search);
  const playerKey = urlParams.get("participantKey") || "";
  //const playerKey = Date.now().toString();
 


  
  const { protocol, host } = window.location;
 
 
  const url = `${protocol}//${host}/query`;

  const { pathname } = window.location;

  // // if we’re on /admin-monitor, skip the Empirica UI entirely
  if (pathname === "/admin-monitor") {
      return <AdminMonitor />;
    }



  
  
  function introSteps({ game, player }) { 
    let {playerCount} = game.get("treatment");
    //console.log('chata',playerCount);
    if (playerCount ==1){
      //const steps=[MyConsent];
      const steps=[WriteProlific];
      steps.push(MyConsent);
      return steps;
    }
    else{

     //const steps=[MyConsent2];
     const steps=[WriteProlific];
     steps.push(DemoVideo);
     steps.push(MyConsent2);
     steps.push(Demographic);
    steps.push(OnboardingSurvey);
    steps.push(Introduction);
    steps.push(GameInstructions);
    steps.push(ImportantInfo);
    return steps;
    }
    }
  



   //return [Exitdisplay,Finished];
  function exitSteps({ game, player,next }) {
    let {playerCount} = game.get("treatment");
    if (playerCount ==1){
      const steps=[Exit];
      steps.push(Finished);
      return steps;
    }
    else {
      const steps=[ExitSurvey];
      steps.push(Finished);
      return steps;
    }
   //return [Exitdisplay,Finished];
  }

  return (
    <EmpiricaParticipant url={url} ns={playerKey} modeFunc={EmpiricaClassic}>
       <ProgressProvider>
       <ProgressBar />
      <div className="h-screen relative">
        <EmpiricaMenu position="bottom-left" />
      
      
        <div className="h-full overflow-auto">
          
          
          <EmpiricaContext 
         
          playerCreate={MyPlayerForm}
          
          
          introSteps={introSteps}
          exitSteps={exitSteps}
         
         
            >
          <UpdatePlayerInfo/>
          
          <GameDisplay/>
         
          </EmpiricaContext>
         
         
        </div>
      </div>
      </ProgressProvider>
    </EmpiricaParticipant>
  );
}