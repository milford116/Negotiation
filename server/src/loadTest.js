// loadTest.js
const axios = require("axios");
const { faker } = require("@faker-js/faker");

// Configure simulation parameters:
const gameCount = 20; // 20 separate concurrent games
const playerCount = 20; // Number of simulated players
const messagesPerPlayer = 50; // How many messages each player will send
const chatEndpoint = "http://localhost:5001/api/game/chat"; // Replace with your chat API endpoint

// Function to simulate sending one chat message for a given player.
async function sendChatMessage(gameId,playerId) {
  // Generate a random lengthy message
  const randomMessage = faker.lorem.paragraphs(2);
  try {
    const response = await axios.post(chatEndpoint, {
        gameId,       
      text: randomMessage,
      senderId:playerId,
      senderName:playerId
     
    }, {
      headers: { "Content-Type": "application/json" }
    });
    console.log(`[Game: ${gameId} | Player: ${playerId}] Sent message: ${response.status}`);
  } catch (error) {
    console.error(`Error sending message for player ${playerId}: ${error.message}`);
  }
}

// Function to simulate a player sending many chat messages
async function simulatePlayer(gameId,playerId) {
  for (let i = 0; i < messagesPerPlayer; i++) {
    await sendChatMessage(gameId,playerId);
    // Optionally wait a short time to simulate pacing (e.g., 100 ms)
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}
// Simulate an entire game (two players concurrently)
async function simulateGame(gameId) {
  const playerIds = [`${gameId}_player1`, `${gameId}_player2`];
  await Promise.all(playerIds.map(playerId => simulatePlayer(gameId, playerId)));
  console.log(`[Game: ${gameId}] Simulation complete.`);
}
// Main function to run all simulations concurrently.
async function main() {
  const gameIds = Array.from({ length: gameCount }, (_, i) => `loadtest_game_${i + 1}`);
  await Promise.all(gameIds.map(gameId => simulateGame(gameId)));
  console.log("🚀 Load testing complete for all games.");
}

main().catch(err => {
  console.error("Load test encountered an error:", err);
});


