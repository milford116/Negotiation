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
  
  for (let i = 1; i <= 6; i++) { 
    const round = game.addRound({
      name: `Round ${i}`,
      task: "bargaining",
    });

    round.addStage({ name: "bar", duration: 300 }); // 5 minutes
    //round.addStage({ name: "result", duration: 60 }); // 1 minute
  }



  //console.log("Game object at start:", game);
  let players = game.players || [];

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
        { range: [0,2000], valueA: 5, valueB: 3 },
        { range: [2001,4000], valueA: 4, valueB: 6 },
        { range: [4001,6000], valueA: 3, valueB: 9 },
        { range: [6001,8000], valueA: 2, valueB: 12 },
        { range: [8001,10000], valueA: 1, valueB: 15 },
      ]
    },
    {
      name: "stockOptions",  //utility  hr=2(6-l) ,employee= 2l
      options: [
        { range: [0,50], valueA: 10, valueB: 2 },
        { range: [51,100], valueA: 8, valueB: 4 },
        { range: [101,150], valueA: 6, valueB: 6 },
        { range: [151,200], valueA: 4, valueB: 8 },
        { range: [201,250], valueA: 2, valueB: 10 },
      ],
    },
    {
      name: "vacationDays", //utility  hr= 3(6-l), employee= l
      options: [
        { range: [10,12], valueA: 15, valueB: 1},
        { range: [13,14], valueA: 12, valueB: 2 },
        { range: [15,16], valueA: 9, valueB: 3 },
        { range: [17,18], valueA: 6, valueB: 4 },
        { range: [19,20], valueA: 3, valueB: 5 },
      ],
    },
  ];

  game.set("issues", issues);
  players[0].set("batna",25);
  players[1].set("batna",25);

  // Store initial BATNA values
  players[0].set("initialBatna", players[0].get("batna"));
  players[1].set("initialBatna", players[1].get("batna"));
  //game.set("BATNA", { valueA: 90000, valueB: 80000 });
  players.forEach((player) => {
    player.set("score", 0);
    player.set("offers", []);
    player.set("notifications", []);
  });
  const possibleRounds = [3, 4, 5];
  selectedRandomRound = possibleRounds[Math.floor(Math.random() * possibleRounds.length)];
 
  //console.log("Game started successfully.");
});

// Handle the start of each round
Empirica.onRoundStart(({ round }) => {
  
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
  if (roundIndex === selectedRandomRound) 
    {
    const randomScenario = Math.floor(Math.random() * 3); // Choose a random scenario (0, 1, 2)
    let message, newBatnaValue;

    switch (randomScenario) {
      case 0: // HR finds another candidate
        if (hrPlayer) {
          //batnachange= true;
          newBatnaValue = hrPlayer.get("batna") + 4; // Example adjustment
          message = "Another candidate has applied, increasing your leverage. New Fallback score: " + newBatnaValue+ "  This means that if you walk away from negotiation, you will get score:"+
          newBatnaValue;
          hrPlayer.set("batna", newBatnaValue);
          hrPlayer.set("notification", message);
        }
        break;

      case 1: // Employee gets another job offer
        if (employeePlayer) {
          //batnachange= true;
          newBatnaValue = employeePlayer.get("batna") + 3; // Example adjustment
          message = "You received another job offer, improving your negotiation position. New Fallback score: " + newBatnaValue+"  This means that if you walk away from negotiation, you will get score:"+
          newBatnaValue;
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


Empirica.onStageStart(({ stage }) => {});

Empirica.onStageEnded(({stage,game }) => {

  const currentGame = stage.currentGame;
  const chatMessages = currentGame.get("chat") || [];
  console.log("Chat messages from Empiricaly Chat:", chatMessages);
  if (stage.get("name") !== "bar") return;
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
    playerA.set("initialBatna", batnaHR); // Update stored value
    batnaChangedFor = "HR";
  }

  // Detect Employee BATNA change
  if (batnaEmployee !== initialBatnaEmployee) {
    console.log(
      `Employee's BATNA changed from ${initialBatnaEmployee} to ${batnaEmployee}`
    );
    playerB.set("initialBatna", batnaEmployee); // Update stored value
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

//apply batna logic
if (agreementReached) {

  //when batna changes
  if(batnaChangedFor)
  {

  if (batnaChangedFor === "HR") {
    // HR's BATNA logic
    totalUtilityHR = Math.max(playerA.get("batna"), totalUtilityHR);
    totalUtilityEmployee =
      totalUtilityHR >= playerA.get("batna")
        ? totalUtilityEmployee
        : playerB.get("batna");
  } else if (batnaChangedFor === "Employee") {
    // Employee's BATNA logic
    totalUtilityEmployee = Math.max(
      playerB.get("batna"),
      totalUtilityEmployee
    );
    totalUtilityHR =
      totalUtilityEmployee >= playerB.get("batna")
        ? totalUtilityHR
        : playerA.get("batna");
  }

  
  playerA.set("score", playerA.get("score") + totalUtilityHR);
  playerB.set("score", playerB.get("score") + totalUtilityEmployee);

  console.log(`Scores updated after Round ${stage.round?.index + 1 || "?"}:`, {
    PlayerA: playerA.get("score"),
    PlayerB: playerB.get("score"),
  });
  stage.currentGame.set("finished", true);
  stage.end();
}
else if(batnaChangedFor ==null) 
{
  playerA.set("score", playerA.get("score") + totalUtilityHR);
  playerB.set("score", playerB.get("score") + totalUtilityEmployee);

  console.log(`Scores updated after Round ${stage.round?.index + 1 || "?"}:`, {
    PlayerA: playerA.get("score"),
    PlayerB: playerB.get("score"),
  });
  stage.currentGame.set("finished", true);
  stage.end();
}
}
else {
  
  console.log("No agreement reached. Scores remain unchanged.");
}

    
}
);

// Handle the end of each round
Empirica.onRoundEnded(({round}) => {
  
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

  const players = game.players;
  const hrPlayer = players.find((p) => p.get("role") === "Hr");
  const employeePlayer = players.find((p) => p.get("role") === "Employee");

  const batnaHR = hrPlayer.get("batna");
  const batnaEmployee = employeePlayer.get("batna");

  // Step 1: Generate all outcomes
  const allOutcomes = generateAllOutcomes(game);

  // Step 2: Filter feasible outcomes
  const feasibleOutcomes = filterFeasibleOutcomes(allOutcomes, batnaHR, batnaEmployee);

  // Step 3: Identify Pareto Frontier
  const paretoFrontier = findParetoFrontier(feasibleOutcomes);

  // Log results
  //console.log("All Feasible Outcomes:", feasibleOutcomes);
  //console.log("Pareto Frontier Outcomes:", paretoFrontier);
  game.set("feasibleOutcomes", feasibleOutcomes);
  game.set("paretoFrontier", paretoFrontier);

  // Check if this is the final round
  if (currentRoundIndex === totalRounds) {
    console.log("Final round reached. Calculating Pareto Frontier...");

  // Save the data in the game state for use in the frontend
    game.set("feasibleOutcomes", feasibleOutcomes);
    game.set("paretoFrontier", paretoFrontier);

    console.log("Pareto Frontier calculation complete.");
  }

});

// Handle the end of the game
Empirica.onGameEnded(({game}) => {




  const players = game.players;
  const hrPlayer = players.find((p) => p.get("role") === "Hr");
  const employeePlayer = players.find((p) => p.get("role") === "Employee");

  const batnaHR = hrPlayer.get("batna");
  const batnaEmployee = employeePlayer.get("batna");

  


  players.forEach((player) => {
    console.log(
      `Final score for ${player.get("role")}: ${player.get("score")}`
    );
  });

  console.log("Game Ended. Final results logged.");
  // Step 1: Generate all outcomes
  // const allOutcomes = generateAllOutcomes(game);

  // // Step 2: Filter feasible outcomes
  // const feasibleOutcomes = filterFeasibleOutcomes(allOutcomes, batnaHR, batnaEmployee);

  // // Step 3: Identify Pareto Frontier
  // const paretoFrontier = findParetoFrontier(feasibleOutcomes);

  // // Log results
  // console.log("All Feasible Outcomes:", feasibleOutcomes);
  // console.log("Pareto Frontier Outcomes:", paretoFrontier);

  // // Feedback to players
  // const negotiatedOutcome = {
  //   utilityHR: hrPlayer.get("score"),
  //   utilityEmployee: employeePlayer.get("score"),
  // };

  // const isOnParetoFrontier = paretoFrontier.some(
  //   (outcome) =>
  //     outcome.utilityHR === negotiatedOutcome.utilityHR &&
  //     outcome.utilityEmployee === negotiatedOutcome.utilityEmployee
  // );

  // console.log(
  //   `Negotiated outcome is ${
  //     isOnParetoFrontier ? "" : "not "
  //   }on the Pareto Frontier.`
  // );

  
});




