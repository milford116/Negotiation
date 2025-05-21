import { ClassicListenersCollector } from "@empirica/core/admin/classic";
export const Empirica = new ClassicListenersCollector();


let selectedRandomRound = null;


function generateAllOutcomes(game) {
  const issues = game.get("issues");
  const allOutcomes = [];

  const generateCombinations = (issues, index, currentOutcome) => {
    if (index === issues.length) {
      // Calculate utilities for the current combination
      const utilityHR = currentOutcome.reduce((sum, option) => sum + option.valueA, 0);
      const utilityEmployee = currentOutcome.reduce(
        (sum, option) => sum + option.valueB,
        0
      );

      allOutcomes.push({
        outcome: [...currentOutcome],
        utilityHR,
        utilityEmployee,
      });
      return;
    }

    // Iterate over options for the current issue
    issues[index].options.forEach((option) => {
      generateCombinations(issues, index + 1, [...currentOutcome, option]);
    });
  };

  generateCombinations(issues, 0, []);
  return allOutcomes;
}

function filterFeasibleOutcomes(allOutcomes, batnaHR, batnaEmployee) {
  return allOutcomes.filter(
    (outcome) =>
      outcome.utilityHR >= batnaHR && outcome.utilityEmployee >= batnaEmployee
  );
}

function findParetoFrontier(feasibleOutcomes) {
  return feasibleOutcomes.filter((outcome, index) => {
    return !feasibleOutcomes.some((otherOutcome, otherIndex) => {
      return (
        otherIndex !== index &&
        otherOutcome.utilityHR >= outcome.utilityHR &&
        otherOutcome.utilityEmployee >= outcome.utilityEmployee &&
        (otherOutcome.utilityHR > outcome.utilityHR ||
          otherOutcome.utilityEmployee > outcome.utilityEmployee)
      );
    });
  });
}







// Setup the game when it starts
Empirica.onGameStart(({ game }) => {
  let players = game.players || [];
  //handle day0 session
  
  
  if (players.length === 1) {
    console.log("Solo session (Day 0): Ending game immediately.");
    // Mark the game as finished.
    //game.set("finished", true);
    // Create a dummy round and stage so that the game lifecycle ends.
    const round = game.addRound({ name: "exitRound", task: "exit" });
    // Add a stage with a short duration.
    const stage = round.addStage({ name: "exitStage", duration: 1 });
    // Delay a bit and then end the stage.
    setTimeout(() => {
      // If stage.end() is available, call it here.
      if (typeof stage.end === "function") {
        stage.end();
      } else {
        console.warn("stage.end is not available");
      }
    }, 1000);
    return;
  }
  
  for (let i = 1; i <= 6; i++) { 
    const round = game.addRound({
      name: `Round ${i}`,
      task: "bargaining",
    });

    round.addStage({ name: "Negotiation", duration: 120 }); // 2 minutes
    //round.addStage({ name: "result", duration: 60 }); // 1 minute
  }



  //console.log("Game object at start:", game);
  

  if (players.length === 0) {
    console.warn("No players found. Simulating players for testing.");
    players = [
      { id: "player1", set: (key, value) => {}, get: () => {} },
      { id: "player2", set: (key, value) => {}, get: () => {} },
    ];
    game.players = players; // Simulated players
  }

  if (players.length < 2) {
    console.error("Not enough players to start the game.");
    
    return;
  }

 
  players[0].set("role", "Hr");
  players[1].set("role", "Employee");

  players[0].set("name", "HR");
  players[1].set("name", "Employee");
  

  console.log("Players assigned roles:", players.map((p) => p.id));

  const issues = [
    {
      name: "salary", //utility  hr=2(6-l) ,employee= 2l
      options: [
        { range: [70000, 80000], valueA: 10, valueB: 2 },
        { range: [80001, 90000], valueA: 8, valueB: 4 },
        { range: [90001, 100000], valueA: 6, valueB: 6 },
        { range: [100001, 110000], valueA: 4, valueB: 8 },
        { range: [110001, 120000], valueA: 2, valueB: 10 },
      ],
    }
    ,
    {
      name: "bonuses", //utility hr- 6-l, employee- 3l
      options: [
        { range: [0,5000], valueA: 5, valueB: 3 },
        { range: [5001,10000], valueA: 4, valueB: 6 },
        { range: [10001,15000], valueA: 3, valueB: 9 },
        { range: [15001,20000], valueA: 2, valueB: 12 },
        { range: [20001,25000], valueA: 1, valueB: 15 },
      ]
    },
    {
      name: "stockOptions",  //utility  hr=2(6-l) ,employee= 2l
      options: [
        { range: [50000,60000], valueA: 10, valueB: 2 },
        { range: [60001,70000], valueA: 8, valueB: 4 },
        { range: [70001,80000], valueA: 6, valueB: 6 },
        { range: [80001,90000], valueA: 4, valueB: 8 },
        { range: [90001,100000], valueA: 2, valueB: 10 },
      ],
    },
    {
      name: "vacationDays", //utility  hr= 3(6-l), employee= l
      options: [
        { range: [10,11], valueA: 15, valueB: 1},
        { range: [12,13], valueA: 12, valueB: 2 },
        { range: [14,15], valueA: 9, valueB: 3 },
        { range: [16,17], valueA: 6, valueB: 4 },
        { range: [18,19], valueA: 3, valueB: 5 },
      ],
    },
  ];

  game.set("issues", issues);
  players[0].set("batna",25);
  players[1].set("batna",25);

  // Store initial BATNA values
  players[0].set("initialBatna", 25);
  players[1].set("initialBatna", 25);
  //game.set("BATNA", { valueA: 90000, valueB: 80000 });
  players.forEach((player) => {
    player.set("score", 0);
    player.set("offers", []);
    //player.set("notifications", []);
  });
  const possibleRounds = [3, 4, 5];
  selectedRandomRound = possibleRounds[Math.floor(Math.random() * possibleRounds.length)];

  //calculate single largest “equal‐split” value that some Pareto deal actually achieves.
  // 1) List every possible deal
// const allOutcomes = generateAllOutcomes(game);

// // 2) Get the Pareto‐efficient subset (no BATNA filter here!)
// const frontier   = findParetoFrontier(allOutcomes);

// // 3) Compute v = max over frontier of min( U_H, U_E )
// const v = Math.max(
//   ...frontier.map(o => Math.min(o.utilityHR, o.utilityEmployee))
// );

// console.log("Maximum symmetric payoff v =", v);

  //console.log("Game started successfully.");
});

// Handle the start of each round
Empirica.onRoundStart(({ round }) => {
  if (round.currentGame.players.length < 2) {
    console.error("sesh.");
    
    return;
  }

  
  const game = round.currentGame;
  
  const roundIndex = game.rounds.findIndex((r) => r.id === round.id) + 1; // Current round number
  console.log("Round number:", roundIndex);
  game.set('roundindex',roundIndex);
  
  const hrPlayer = game.players.find((p) => p.get("role") === "Hr");
  const employeePlayer = game.players.find((p) => p.get("role") === "Employee");
  console.log("hrbatna",hrPlayer.get("batna"));
  console.log("employebatna",employeePlayer.get("batna"));

  // Define dynamic BATNA changes for specific rounds
  // const batnaChangeRounds = [3, 4, 5]; // Define rounds where BATNA can change
  // const shouldChangeBatna = batnaChangeRounds.includes(roundIndex);
  

  //if (shouldChangeBatna) 
  console.log('selectedround',selectedRandomRound);
  if (roundIndex === selectedRandomRound) 
    {
    const randomScenario = Math.floor(Math.random() * 3); // Choose a random scenario (0, 1, 2)
    let message, newBatnaValue;

    switch (randomScenario) {
      case 0: // HR finds another candidate
        if (hrPlayer) {
          //batnachange= true;
          newBatnaValue = hrPlayer.get("batna") + 4; // Example adjustment
          message = "Heads up! Another candidate has come forward, which improves your backup option. If you decide to leave the negotiation now, you’ll receive an alternative offer of  " + newBatnaValue+ "  points. ";
          hrPlayer.set("batna", newBatnaValue);
          hrPlayer.set("notification", message);
        }
        break;

      case 1: // Employee gets another job offer
        if (employeePlayer) {
          //batnachange= true;
          newBatnaValue = employeePlayer.get("batna") + 3; // Example adjustment
          message = "Great news! You've received another job offer that boosts your backup option. Your new alternative offer is " + newBatnaValue + " points.";
          employeePlayer.set("batna", newBatnaValue);
          employeePlayer.set("notification", message);
        }
        break;

      case 2: // Job market crashes
        if (hrPlayer && employeePlayer) {
          //batnachange= true;
          newBatnaValue = hrPlayer.get("batna")-2; // Example adjustment
          hrPlayer.set("batna", newBatnaValue);
          hrPlayer.set("notification", "The job market crashed, reducing all leverage. New Fallback score: " + newBatnaValue + " This means that if you walk away from negotiation, you will get score:"+
          newBatnaValue);

          newBatnaValue =employeePlayer.get("batna")-2; // Example adjustment
          employeePlayer.set("batna", newBatnaValue);
          employeePlayer.set("notification", "The job market crashed, reducing all leverage. New Fallback score: " + newBatnaValue + " This means that if you walk away from negotiation, you will get score:"+
          newBatnaValue);
        }
        break;
    }
  }
});


Empirica.onStageStart(({ stage }) => {
  const watch = setInterval(() => {
    const offers = stage.get("offers") || {};
    if (offers.Hr && offers.Employee) {
      clearInterval(watch);
      stage.end();
    }
  }, 250);

  // make sure to clean up if the stage ends for any other reason
  //stage.once("ended", () => clearInterval(watch));
});

Empirica.onStageEnded(({stage,game }) => {
  if (stage.currentGame.players.length < 2) {
    console.error("Not enough players to start the game.");
    return;
  }


  const currentGame = stage.currentGame;
  if (stage.get("name") !== "Negotiation") return;
  console.log("End of choice stage");

  const players = stage.currentGame.players; //chnged
  
  const issues = stage.currentGame.get("issues"); // Retrieve the negotiation issues
  const offers = stage.get("offers"); // Get the offers made during this stage
  console.log("Received offers:", offers);

  
  if (!players || players.length < 2) {
    console.error("Not enough players to calculate scores");
    return;
  }

  if (!offers || offers.length === 0) {
    console.warn("No offers submitted this stage.");
    //chat data save
const chatMessages = currentGame.get("chat") || [];
//console.log("Chat messages from Empiricaly Chat:", chatMessages);
// map in prolificId
let prolificId=null;
const chatWithProlific = chatMessages.map((msg) => {
  
  const author = players.find((p) => p.id === msg.sender.id);
  prolificId= author.get("prolificId");
  return {
    ...msg,
    timestamp: msg.timestamp || new Date().toISOString(),
    sender: {
      empiricaId: msg.sender.id,
      name:       msg.sender.name,
      prolificId: author?.get("prolificId") ?? null
    }
  };
}); 
console.log('chatwithprol',chatWithProlific);
// 3) Fire‑and‑forget the HTTP call in an async IIFE
(async () => {
  try {
    const res = await fetch("http://localhost:5001/api/player/chat", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ProlificId: prolificId,            // or pick one player if you want per‑player rows
        BatchId:    currentGame.get("batchID"),
        GameId:     currentGame.id,
        Chat:       chatWithProlific
      })
    });
    if (!res.ok) {
      // logs any HTTP-level errors (400, 500, etc.)
      const text = await res.text();
      console.error("Chat save failed:", res.status, text);
    } else {
      console.log("Chat saved successfully");
    }
  } catch (err) {
    // logs network or JSON errors
    console.error("Chat save error:", err);
  }
})();

    return;
  }

  const playerA = players.find((p) => p.get("role") === "Hr");
  const playerB = players.find((p) => p.get("role") === "Employee");
  const batnaHR = playerA.get("batna");
  const batnaEmployee = playerB.get("batna");

  const initialBatnaHR = playerA.get("initialBatna");
  const initialBatnaEmployee = playerB.get("initialBatna");
  let batnaChangedFor = null;

  let totalUtilityHR = 0;
  let totalUtilityEmployee = 0;
  let agreementReached = true;

  

  // Detect HR BATNA change
  if (batnaHR !== initialBatnaHR) {
    console.log(`HR's BATNA changed from ${initialBatnaHR} to ${batnaHR}`);
    //playerA.set("initialBatna", batnaHR); // Update stored value
    batnaChangedFor = "HR";
  }

  // Detect Employee BATNA change
  if (batnaEmployee !== initialBatnaEmployee) {
    console.log(
      `Employee's BATNA changed from ${initialBatnaEmployee} to ${batnaEmployee}`
    );
    //playerB.set("initialBatna", batnaEmployee); // Update stored value
    batnaChangedFor = "Employee";
  }

  if (offers.Hr && offers.Employee) {
   
  issues.forEach((issue) => {
    const offerA = offers.Hr?.[issue.name];
    const offerB = offers.Employee?.[issue.name];
    console.log(`Processing issue: ${issue.name}, OfferA: ${offerA}, OfferB: ${offerB}`);
    if (offerA === undefined || offerB === undefined) {
      console.warn(`No valid agreement for issue: ${issue.name}`);
      agreementReached = false;
      return; // Skip this issue if any offer is missing
    }
    const rangeA = issue.options.find(
      (option) => offerA >= option.range[0] && offerA <= option.range[1]
    );
    const rangeB = issue.options.find(
      (option) => offerB >= option.range[0] && offerB <= option.range[1]
    );
    // const selectedOptionA = issue.options.find(
    //   (option) => offerA >= option.range[0] && offerA <= option.range[1]
    // );
    // const selectedOptionB = issue.options.find(
    //   (option) => offerB >= option.range[0] && offerB <= option.range[1]
    // );
    // Agreement is only valid if both players' offers fall in the same range
    if (rangeA && rangeB && rangeA.range[0] === rangeB.range[0]) {
      //agreementReached = true;
      totalUtilityHR += rangeA.valueA;
      totalUtilityEmployee += rangeB.valueB;
    }
    else{
      agreementReached = false;
    }
    
  });

}
const batnaH = playerA.get("batna");
const batnaE = playerB.get("batna");
//apply batna logic
if (agreementReached) {

  //when batna changes
//   if(batnaChangedFor)
//   {

//   if (batnaChangedFor === "HR") {
//     // HR's BATNA logic
//     totalUtilityHR = Math.max(playerA.get("batna"), totalUtilityHR);
//     totalUtilityEmployee =
//       totalUtilityHR >= playerA.get("batna")
//         ? totalUtilityEmployee
//         : playerB.get("batna");
//   } else if (batnaChangedFor === "Employee") {
//     // Employee's BATNA logic
//     totalUtilityEmployee = Math.max(
//       playerB.get("batna"),
//       totalUtilityEmployee
//     );
//     totalUtilityHR =
//       totalUtilityEmployee >= playerB.get("batna")
//         ? totalUtilityHR
//         : playerA.get("batna");
//   }

  
//   playerA.set("score", playerA.get("score") + totalUtilityHR);
//   playerB.set("score", playerB.get("score") + totalUtilityEmployee);

//   console.log(`Scores updated after Round ${stage.round?.index + 1 || "?"}:`, {
//     PlayerA: playerA.get("score"),
//     PlayerB: playerB.get("score"),
//   });
//   const currentIndex = stage.currentGame.rounds.findIndex(r => r.id === stage.round.id) + 1;
//   stage.currentGame.rounds.slice(currentIndex + 1).forEach(round => {
//     round.stages.forEach(s => s.set("submit", true));
//   });

//   stage.currentGame.set("finished", true);
//   stage.set("submit", true);
//   stage.end();

//     // while (stage.currentGame.rounds.length > currentIndex) {
//     //   stage.currentGame.rounds.pop();  // remove each subsequent round
//     // }
   

  
// }
// else if(batnaChangedFor ==null) 
// {
//   //BATNA MAX, THEN WALK AWAY
//   totalUtilityHR = Math.max(playerA.get("batna"), totalUtilityHR);
//   totalUtilityEmployee = Math.max(playerB.get("batna"), totalUtilityEmployee);
//   playerA.set("score", playerA.get("score") + totalUtilityHR);
//   playerB.set("score", playerB.get("score") + totalUtilityEmployee);

//   console.log(`Scores updated after Round ${stage.round?.index + 1 || "?"}:`, {
//     PlayerA: playerA.get("score"),
//     PlayerB: playerB.get("score"),
//   });
//   const currentIndex = stage.currentGame.rounds.findIndex(r => r.id === stage.round.id) + 1;
//   stage.currentGame.rounds.slice(currentIndex + 1).forEach(round => {
//     round.stages.forEach(s => s.set("submit", true));
//   });

//   stage.currentGame.set("finished", true);
//   stage.set("submit", true);
//   stage.end();

//     // while (stage.currentGame.rounds.length > currentIndex) {
//     //   stage.currentGame.rounds.pop();  // remove each subsequent round
//     // }

   

// }


  // 1) Compute raw utilities U_H, U_E as before
  //    (you already have totalUtilityHR, totalUtilityEmployee)

  // 2) Enforce minimum = BATNA
  const finalU_H = Math.max(totalUtilityHR, batnaH);
  const finalU_E = Math.max(totalUtilityEmployee, batnaE);

  
  playerA.set("score", playerA.get("score") + finalU_H);
  playerB.set("score", playerB.get("score") + finalU_E);

  console.log(`Final scores this round: HR=${playerA.get("score")}, Emp=${playerB.get("score")}`);

  // 5) End game immediately
  stage.currentGame.set("finished", true);
  stage.set("submit", true);
  stage.end();

}
else { //no agreement reached
  playerA.set("score", playerA.get("score") + batnaH);
  playerB.set("score", playerB.get("score") + batnaE);
  
  console.log("No agreement reached. Scores remain unchanged.");
}
//chat data save
const chatMessages = currentGame.get("chat") || [];
//console.log("Chat messages from Empiricaly Chat:", chatMessages);
// map in prolificId
let prolificId=null;
const chatWithProlific = chatMessages.map((msg) => {
  
  const author = players.find((p) => p.id === msg.sender.id);
  prolificId= author.get("prolificId");
  return {
    ...msg,
    timestamp: msg.timestamp || new Date().toISOString(),
    sender: {
      empiricaId: msg.sender.id,
      name:       msg.sender.name,
      prolificId: author?.get("prolificId") ?? null
    }
  };
}); 
console.log('chatwithprol',chatWithProlific);
// 3) Fire‑and‑forget the HTTP call in an async IIFE
(async () => {
  try {
    const res = await fetch("http://localhost:5001/api/player/chat", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ProlificId: prolificId,            // or pick one player if you want per‑player rows
        BatchId:    currentGame.get("batchID"),
        GameId:     currentGame.id,
        Chat:       chatWithProlific
      })
    });
    if (!res.ok) {
      // logs any HTTP-level errors (400, 500, etc.)
      const text = await res.text();
      console.error("Chat save failed:", res.status, text);
    } else {
      console.log("Chat saved successfully");
    }
  } catch (err) {
    // logs network or JSON errors
    console.error("Chat save error:", err);
  }
})();

    
}

);

// Handle the end of each round
Empirica.onRoundEnded(({round}) => {
  if (round.currentGame.players.length < 2) {
    console.error("Not enough players to start the game.");
    return;
  }

  
  const game = round.currentGame;
  const stages=round.stages;
  //console.log('cur stage',stages[0]);
  const totalRounds = game.rounds.length; // Total number of rounds
  //const roundIndex = game.rounds.findIndex((r) => r.id === round.id) + 1; // Current round number
  
  const currentRoundIndex = game.rounds.findIndex((r) => r.id === round.id) + 1; // Current round number
  
  console.log(`Round ${currentRoundIndex} has ended.`);

  const roundOffers = {
    round: currentRoundIndex,
    offers: stages[0].get("offers")
  };
  let previousOffers = game.get("previousOffers") || [];
  previousOffers.push(roundOffers);
  game.set("previousOffers", previousOffers);
  console.log('prev offers', stages[0].get("offers"));

  // api for saving offer, batna

let players = game.players || [];

players.forEach((player) => {
  const score= player.get('score');
  player.set('Final_score',score);
});
const allOffers      = game.get("previousOffers") || [];
const batchId        = game.get("batchID");
const gameId         = game.id;

game.players.forEach((player) => {
  const prolificId = player.get("prolificId");
  const score      = player.get("Final_score");
  const initialBatna= player.get("initialBatna");
  const batna      = player.get("batna");
  const Role=      player.get("role");

  // Send each player’s row
  (async () => {
    try {
    const res = await fetch("http://localhost:5001/api/player/data", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ProlificId: prolificId,
      BatchId:    batchId,
      GameId:     gameId,
      Role:       Role,
      Score:      score,
      Batna:      batna,
      initialBatna:initialBatna,
      Offers:     allOffers
    })
  })
  if (!res.ok) {
    // logs any HTTP-level errors (400, 500, etc.)
    const text = await res.text();
    console.error("player data save failed:", res.status, text);
  } else {
    console.log(`Data saved for ${prolificId}`);
  }
  
}
catch (err) {
  // logs network or JSON errors
  console.error("player data save error:", err);
}
}) ();


});

  // const players = game.players;
  // const hrPlayer = players.find((p) => p.get("role") === "Hr");
  // const employeePlayer = players.find((p) => p.get("role") === "Employee");

  // const batnaHR = hrPlayer.get("batna");
  // const batnaEmployee = employeePlayer.get("batna");

  // // Step 1: Generate all outcomes
  // const allOutcomes = generateAllOutcomes(game);

  // // Step 2: Filter feasible outcomes
  // const feasibleOutcomes = filterFeasibleOutcomes(allOutcomes, batnaHR, batnaEmployee);

  // // Step 3: Identify Pareto Frontier
  // const paretoFrontier = findParetoFrontier(feasibleOutcomes);

  // Log results
  //console.log("All Feasible Outcomes:", feasibleOutcomes);
  //console.log("Pareto Frontier Outcomes:", paretoFrontier);
  // game.set("feasibleOutcomes", feasibleOutcomes);
  // game.set("paretoFrontier", paretoFrontier);

  // Check if this is the final round
  // if (currentRoundIndex === totalRounds) {
  //   console.log("Final round reached. Calculating Pareto Frontier...");

  // // Save the data in the game state for use in the frontend
  //   game.set("feasibleOutcomes", feasibleOutcomes);
  //   game.set("paretoFrontier", paretoFrontier);

  //   console.log("Pareto Frontier calculation complete.");
  // }

});

// Handle the end of the game
Empirica.onGameEnded(({game}) => {
  let players = game.players || [];

  players.forEach((player) => {
    const score= player.get('score');
    player.set('Final_score',score);
  });
 const allOffers      = game.get("previousOffers") || [];
  const batchId        = game.get("batchID");
  const gameId         = game.id;

//   game.players.forEach((player) => {
//     const prolificId = player.get("prolificId");
//     const score      = player.get("Final_score");
//     const initialBatna= player.get("initialBatna");
//     const batna      = player.get("batna");

//     // Send each player’s row
//     (async () => {
//       try {
//       const res = await fetch("http://localhost:5001/api/player/data", {
//       method:  "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         ProlificId: prolificId,
//         BatchId:    batchId,
//         GameId:     gameId,
//         Score:      score,
//         Batna:      batna,
//         initialBatna:initialBatna,
//         Offers:     allOffers
//       })
//     })
//     if (!res.ok) {
//       // logs any HTTP-level errors (400, 500, etc.)
//       const text = await res.text();
//       console.error("player data save failed:", res.status, text);
//     } else {
//       console.log(`Data saved for ${prolificId}`);
//     }
    
//   }
//   catch (err) {
//     // logs network or JSON errors
//     console.error("player data save error:", err);
//   }
//   }) ();
//   console.log("Game Ended. Final results logged.");

// });

//need to move this part to serversql file so that exit survey is also saved here
// let currentDir = process.cwd();
//   let projectRoot = null;
  
//   while (currentDir !== path.parse(currentDir).root) {
//     if (fs.existsSync(path.join(currentDir, '.empirica'))) {
//       projectRoot = currentDir;
//       break;
//     }
//     currentDir = path.dirname(currentDir);
//   }
  
//   if (!projectRoot) {
//     console.error("Could not find Empirica project root directory");
//     return;
//   }
  
//   console.log(`Running export from project root: ${projectRoot}`);
  
//   // Using spawn with the correct working directory
//   const exportProcess = spawn("empirica", ["export"], {
//     env: { ...process.env },
//     cwd: projectRoot, // Use the found project root
//     stdio: "pipe"
//   });
  
//   exportProcess.stdout.on("data", (data) => {
//     console.log(`Export output: ${data}`);
//   });
  
//   exportProcess.stderr.on("data", (data) => {
//     console.error(`Export error: ${data}`);
//   });
  
//   exportProcess.on("close", (code) => {
//     console.log(`Export process exited with code ${code}`);
//   });

})


