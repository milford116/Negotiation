const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");


const app = express();
const port = process.env.PORT || 5001;
let exportTriggered = false;

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
    prolificId TEXT,
    username TEXT NOT NULL,
    studyId	TEXT,
	  participated	INTEGER DEFAULT 0,
	  PRIMARY KEY("prolificId")
  )
`, (err) => {
  if (err) console.error("Error creating accounts table:", err);
});
// 2) Consent_Day0
db.run(`
  CREATE TABLE IF NOT EXISTS Consent_Day0 (
	ProlificId	TEXT NOT NULL,
	Consent	INTEGER DEFAULT 0,
	PRIMARY KEY("ProlificId")
)
`, err => { if (err) console.error(err); });

// 3) Player_Realtime
db.run(`
  CREATE TABLE IF NOT EXISTS Player_Realtime (
	"BatchId"	TEXT NOT NULL,
	"GameId"	TEXT NOT NULL,
	"ProlificId"	TEXT NOT NULL UNIQUE,
	"Role"	TEXT,
	"Demographic"	TEXT,
	"Onboarding_Survey"	TEXT,
	"Offers"	TEXT,
	"Chat"	TEXT,
	"Score"	INTEGER,
	"Batna"	INTEGER,
	"initialBatna"	INTEGER,
	"Exit_survey"	TEXT,
	"ExitCompleted"	INTEGER DEFAULT 0,
	PRIMARY KEY("GameId","ProlificId")

  )
`, err => { if (err) console.error(err); });

function triggerEmpiricaExport() {
  if (exportTriggered) return;
  exportTriggered = true;
  let currentDir = process.cwd();
  let projectRoot = null;

  while (currentDir !== path.parse(currentDir).root) {
    if (fs.existsSync(path.join(currentDir, ".empirica"))) {
      projectRoot = currentDir;
      break;
    }
    currentDir = path.dirname(currentDir);
  }

  if (!projectRoot) {
    console.error("Empirica project root not found for export");
    return;
  }

  console.log(`Running Empirica export from root: ${projectRoot}`);

  const exportProcess = spawn("empirica", ["export"], {
    env: { ...process.env },
    cwd: projectRoot,
    stdio: "pipe",
  });

  exportProcess.stdout.on("data", (data) => {
    console.log(`Empirica Export: ${data}`);
  });

  exportProcess.stderr.on("data", (data) => {
    console.error(`Empirica Export Error: ${data}`);
  });

  exportProcess.on("close", (code) => {
    console.log(`Empirica Export completed with code ${code}`);
  });
}
// Endpoint to create an account
app.post("/api/accounts", (req, res) => {
  const { prolificId, username } = req.body;
  if (!prolificId || !username) {
    return res.status(400).json({ message: "prolificId and username are required" });
  }
  const studyId = "negotiation_spring_25_batch1";
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
  if (!ProlificId) {
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
  const { ProlificId, BatchId, GameId, Demographic } = req.body;
  if (!ProlificId || !BatchId || !GameId) {
    return res.status(400).json({ message: "playerId and batchid,gameid required" });
  }
  const blob = JSON.stringify(Demographic);
  const sql = `
    INSERT INTO Player_Realtime(ProlificId, BatchId,GameId, Demographic)
    VALUES (?, ?,?,?)
    ON CONFLICT(ProlificId,GameId) DO UPDATE SET Demographic = excluded.Demographic
  `;
  db.run(sql, [ProlificId, BatchId, GameId, blob], function (err) {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ message: "demographic saved" });
  });
});

///BFI SURVEY DATA
app.post("/api/player/bfi", (req, res) => {
  const { ProlificId, BatchId, GameId, Bfi } = req.body;
  if (!ProlificId || !BatchId || !GameId) {
    return res.status(400).json({ message: "playerId and batchid,gameid required" });
  }
  const blob = JSON.stringify(Bfi);
  const sql = `
    INSERT INTO Player_Realtime(ProlificId, BatchId,GameId, Onboarding_Survey)
    VALUES (?, ?,?,?)
    ON CONFLICT(ProlificId,GameId) DO UPDATE SET Onboarding_Survey = excluded.Onboarding_Survey
  `;
  db.run(sql, [ProlificId, BatchId, GameId, blob], function (err) {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ message: "Onboarding survey saved" });
  });
});

// Endpoint to verify an account (for login)
app.post("/api/accounts/verify", (req, res) => {
  const { prolificId } = req.body;
  const studyId = "negotiation_spring_25_batch1";
  //   if (!prolificId || !username) {
  //     return res.status(400).json({ message: "prolificId and username are required" });
  //   }
  console.log('pro', prolificId.trim());
  console.log('studyid', studyId);
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

//endpoint to upsert offers,final score, batna,role
app.post("/api/player/data", (req, res) => {
  const {
    ProlificId,
    BatchId,
    GameId,
    Role,
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
      (ProlificId, BatchId, GameId,Role,Score, Batna,initialBatna, Offers)
    VALUES (?, ?, ?, ?,?, ?,?, ?)
    ON CONFLICT(ProlificId, GameId) DO UPDATE SET
      Role=  excluded.Role,
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
      Role,
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
  const { ProlificId, BatchId, GameId, Exit_survey } = req.body;
  if (!ProlificId || !BatchId || !GameId) {
    return res.status(400).json({ message: "playerId and batchid,gameid required" });
  }
  const blob = JSON.stringify(Exit_survey);
  const sql = `
    INSERT INTO Player_Realtime(ProlificId, BatchId,GameId, Exit_survey, ExitCompleted)
    VALUES (?, ?,?,?,?)
    ON CONFLICT(ProlificId,GameId) DO UPDATE SET Exit_survey = excluded.Exit_survey, ExitCompleted = 1
    
  `;
  db.run(sql, [ProlificId, BatchId, GameId, blob, 1], function (err) {
    if (err) return res.status(500).json({ message: err.message });
    // After marking this player, check if ALL players are done:
    const checkAllDoneSQL = `
      SELECT COUNT(*) as total,
             SUM(CASE WHEN ExitCompleted = 1 THEN 1 ELSE 0 END) as completed
      FROM Player_Realtime
      
    `;
    db.get(checkAllDoneSQL, [], (err, row) => {
      if (err) {
        console.error("Error checking completion:", err);
        return res.status(500).json({ message: err.message });
      }

      if (row.total === row.completed) {
        console.log("All players completed. Scheduling export explicitly with short delay.");

        setTimeout(() => {
          triggerEmpiricaExport();
        }, 100); // CLEAR DELAY HERE (100ms)
      } else {
        console.log("Still waiting for other players.");
      }
      res.json({ message: "Exit_survey saved" });
    });
  });
});

// ——— Admin monitor endpoint ———
app.get("/api/admin-monitor", (req, res) => {
  const sql = `
    SELECT
      ProlificId,
      Role,
      BatchId,
      GameId,
      Demographic,
      Onboarding_Survey   AS OnboardingSurvey,
      Chat,
      Score,
      Batna,
      initialBatna        AS initialBatna,
      Offers,
      Exit_survey         AS ExitSurvey,
      ExitCompleted
    FROM Player_Realtime
    ORDER BY GameId, Role
  `;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Error fetching monitor data:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
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
