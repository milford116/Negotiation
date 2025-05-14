const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(bodyParser.json());

// Open (or create) the SQLite database file
const db = new sqlite3.Database("./empirica.db", (err) => {
  if (err) {
    console.error("Could not open SQLite database:", err);
  } else {
    console.log("Connected to SQLite database.");
  }
});

// Create an accounts table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS accounts (
    prolificId TEXT PRIMARY KEY,
    username TEXT NOT NULL
  )
`, (err) => {
  if (err) console.error("Error creating accounts table:", err);
});

// Endpoint to create an account
app.post("/api/accounts", (req, res) => {
  const { prolificId, username } = req.body;
  if (!prolificId || !username) {
    return res.status(400).json({ message: "prolificId and username are required" });
  }
  const studyId= "negotiation_spring_25_batch1";
  const sql = "INSERT INTO accounts (prolificId, username, studyId) VALUES (?, ?,?)";
  db.run(sql, [prolificId.trim(), username.trim(), studyId], function (err) {
    if (err) {
      console.error("Error inserting account:", err);
      // Check for duplicate key error (SQLite returns a code like SQLITE_CONSTRAINT)
      return res.status(400).json({ message: "Account with this ID already exists" });
    }
    return res.status(201).json({ message: "Account created successfully", account: { prolificId, username } });
  });
});

// 1) Record consent for day 0
app.post("/api/player/consent", (req, res) => {
  const { ProlificId, Consent } = req.body;
  if (!ProlificId  ) {
    return res.status(400).json({ message: "playerId  required" });
  }
  const sql = `
    INSERT INTO Consent_Day0(ProlificId, Consent)
    VALUES (?, ?)
   
  `;
  db.run(sql, [ProlificId, Consent ? 1 : 0], function (err) {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ message: "Consent saved" });
  });
});


//demographic data

app.post("/api/player/demographic", (req, res) => {
  const { ProlificId,BatchId,GameId, Demographic } = req.body;
  if (!ProlificId || !BatchId || !GameId ) {
    return res.status(400).json({ message: "playerId and batchid,gameid required" });
  }
  const blob = JSON.stringify(Demographic);
  const sql = `
    INSERT INTO Player_Realtime(ProlificId, BatchId,GameId, Demographic)
    VALUES (?, ?,?,?)
    ON CONFLICT(ProlificId,GameId) DO UPDATE SET Demographic = excluded.Demographic
  `;
  db.run(sql, [ProlificId,BatchId,GameId, blob], function (err) {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ message: "demographic saved" });
  });
});

///BFI SURVEY DATA
app.post("/api/player/bfi", (req, res) => {
  const { ProlificId,BatchId,GameId, Bfi } = req.body;
  if (!ProlificId || !BatchId || !GameId ) {
    return res.status(400).json({ message: "playerId and batchid,gameid required" });
  }
  const blob = JSON.stringify(Bfi);
  const sql = `
    INSERT INTO Player_Realtime(ProlificId, BatchId,GameId, Onboarding_Survey)
    VALUES (?, ?,?,?)
    ON CONFLICT(ProlificId,GameId) DO UPDATE SET Onboarding_Survey = excluded.Onboarding_Survey
  `;
  db.run(sql, [ProlificId,BatchId,GameId, blob], function (err) {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ message: "Onboarding survey saved" });
  });
});

// Endpoint to verify an account (for login)
app.post("/api/accounts/verify", (req, res) => {
  const { prolificId } = req.body;
  const studyId= "negotiation_spring_25_batch1";
//   if (!prolificId || !username) {
//     return res.status(400).json({ message: "prolificId and username are required" });
//   }
console.log('pro',prolificId.trim());
console.log('studyid',studyId);
  const sql = "SELECT * FROM accounts WHERE prolificId = ? AND studyId = ?";
  db.get(sql, [prolificId.trim(), studyId], (err, row) => {
    if (err) {
      console.error("Error verifying account:", err);
      return res.status(500).json({ message: "Server error" });
    }
    if (row) {
        if (row.participated === 1) {
          return res.status(400).json({ message: "You have already participated in this experiment", found: true });
        }
        return res.status(200).json({ message: "Account verified", found: true, account: row });
      } else {
        return res.status(404).json({ message: "Account not found", found: false });
      }
  });
});

// ——— Save Empirica chat for a player ———
app.post("/api/player/chat", (req, res) => {
  const { ProlificId, BatchId, GameId, Chat } = req.body;
  if (!ProlificId || !BatchId || !GameId) {
    return res
      .status(400)
      .json({ message: "ProlificId, BatchId and GameId are required" });
  }
  // serialize the array of messages
  const blob = JSON.stringify(Chat);
  const sql = `
    INSERT INTO Player_Realtime(ProlificId, BatchId, GameId, Chat)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(ProlificId,GameId)
    DO UPDATE SET Chat = excluded.Chat
  `;
  db.run(sql, [ProlificId, BatchId, GameId, blob], function (err) {
    if (err) {
      console.error("Error saving chat:", err);
      return res.status(500).json({ message: err.message });
    }
    res.json({ message: "Chat saved successfully" });
  });
});

//endpoint to upsert offers,final score, batna
app.post("/api/player/data", (req, res) => {
  const {
    ProlificId,
    BatchId,
    GameId,
    Score,
    Batna,
    initialBatna,
    Offers
  } = req.body;
  if (!ProlificId || !BatchId || !GameId) {
    return res
      .status(400)
      .json({ message: "ProlificId, BatchId and GameId are required" });
  }

  const offersBlob = JSON.stringify(Offers);

  const sql = `
    INSERT INTO Player_Realtime
      (ProlificId, BatchId, GameId,Score, Batna,initialBatna, Offers)
    VALUES (?, ?, ?, ?, ?,?, ?)
    ON CONFLICT(ProlificId, GameId) DO UPDATE SET
      Score  = excluded.Score,
      Batna  = excluded.Batna,
      initialBatna= excluded.initialBatna,
      Offers = excluded.Offers
  `;

  db.run(
    sql,
    [
      ProlificId,
      BatchId,
      GameId,
      Score,
      Batna,
      initialBatna,
      offersBlob
    ],
    function (err) {
      if (err) {
        console.error("Error saving player data:", err);
        return res.status(500).json({ message: err.message });
      }
      res.json({ message: "Player data saved" });
    }
  );
});

//exit survey data


app.post("/api/player/exitsurvey", (req, res) => {
  const { ProlificId,BatchId,GameId, Exit_survey } = req.body;
  if (!ProlificId || !BatchId || !GameId ) {
    return res.status(400).json({ message: "playerId and batchid,gameid required" });
  }
  const blob = JSON.stringify(Exit_survey);
  const sql = `
    INSERT INTO Player_Realtime(ProlificId, BatchId,GameId, Exit_survey)
    VALUES (?, ?,?,?)
    ON CONFLICT(ProlificId,GameId) DO UPDATE SET Exit_survey = excluded.Exit_survey
  `;
  db.run(sql, [ProlificId,BatchId,GameId, blob], function (err) {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ message: "Exit_survey saved" });
  });
});

//endpoint to mark account as pariticipated

app.post("/api/accounts/complete", (req, res) => {
    const { prolificId, studyId } = req.body;
    if (!prolificId || !studyId) {
      return res.status(400).json({ message: "prolificId and studyId are required" });
    }
    const sql = "UPDATE accounts SET participated = 1 WHERE prolificId = ? AND studyId = ?";
    db.run(sql, [prolificId.trim(), studyId.trim()], function (err) {
      if (err) {
        console.error("Error updating participation:", err);
        return res.status(500).json({ message: "Server error" });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: "Account not found" });
      }
      return res.status(200).json({ message: "Participation recorded" });
    });
  });
  

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
