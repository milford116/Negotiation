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
  Timestamp	TEXT,
	PRIMARY KEY("ProlificId")
)
`, err => { if (err) console.error(err); });




// 3) Player_Realtime
db.run(`
  CREATE TABLE IF NOT EXISTS Player_Realtime (
	BatchId	TEXT NOT NULL,
	GameId	TEXT NOT NULL,
	ProlificId	TEXT NOT NULL UNIQUE,
	Role	TEXT,
	Demographic	TEXT,
	Onboarding_Survey	TEXT,
	Offers	TEXT,
	Score	INTEGER,
	Batna	INTEGER,
	initialBatna	INTEGER,
	Exit_survey	TEXT,
	ExitCompleted	INTEGER DEFAULT 0,
  stateProgress	INTEGER NOT NULL DEFAULT 0,
	PRIMARY KEY("GameId","ProlificId")

  )
`, err => { if (err) console.error(err); });

//chat table
// 1) Make sure you’ve created the Chat table at startup:
db.run(`
  CREATE TABLE IF NOT EXISTS Chat (
    BatchId       TEXT    NOT NULL,
    GameId        TEXT    NOT NULL,
    RoundIndex    INTEGER ,
    HrProlificId  TEXT    ,
    EmpProlificId TEXT   ,
    ChatLog       TEXT         
    
  )
`, (err) => {
  if (err) console.error("Error creating Chat table:", err);
});
db.run('PRAGMA journal_mode = WAL;');

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
    INSERT INTO Consent_Day0
      (ProlificId, Consent, Timestamp)
    VALUES
      (?, ?, CURRENT_TIMESTAMP)
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
  const { prolificId,username } = req.body;
  const studyId = "negotiation_spring_25_batch1";
  //   if (!prolificId || !username) {
  //     return res.status(400).json({ message: "prolificId and username are required" });
  //   }
  // console.log('pro', prolificId.trim());
  // console.log('studyid', studyId);
  const sql = "SELECT * FROM accounts WHERE prolificId = ? AND username= ? AND studyId = ?";
  db.get(sql, [prolificId.trim(), username.trim(),studyId], (err, row) => {
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

//api endpoint for saving chat in different chat table

// 2) Add this POST endpoint to save a round’s chat
app.post("/api/chat", (req, res) => {
  const {
    BatchId,
    GameId,
    RoundIndex,
    HrProlificId,
    EmpProlificId,
    Chat         // should be an array of message objects
  } = req.body;

  // Basic validation
  if (
    !BatchId ||
    !GameId ||
    typeof RoundIndex !== "number" ||
    !HrProlificId ||
    !EmpProlificId ||
    !Array.isArray(Chat)
  ) {
    return res
      .status(400)
      .json({ message: "BatchId, GameId, RoundIndex, HrProlificId, EmpProlificId and Chat[] are required" });
  }

  const chatBlob = JSON.stringify(Chat);
  const sql = `
    INSERT INTO Chat
      (BatchId, GameId, RoundIndex, HrProlificId, EmpProlificId, ChatLog)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [BatchId, GameId, RoundIndex, HrProlificId, EmpProlificId, chatBlob],
    function (err) {
      if (err) {
        console.error("Error saving chat:", err);
        return res.status(500).json({ message: err.message });
      }
      res.json({ message: "Chat saved", chatId: this.lastID });
    }
  );
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
    
    
      res.json({ message: "Exit_survey saved" });
  })
 
});

// ——— Admin monitor endpoint ———
app.get("/api/admin-monitor", (req, res) => {
  // Fetch Player_Realtime first
  db.all("SELECT * FROM Player_Realtime", (err, players) => {
    if (err) {
      console.error("Error loading players:", err);
      return res.status(500).json({ error: "Failed to load player data" });
    }
    // Then fetch Chat table
    db.all("SELECT * FROM Chat", (err2, chats) => {
      if (err2) {
        console.error("Error loading chats:", err2);
        return res.status(500).json({ error: "Failed to load chat data" });
      }
      // Return both as an object
      res.json({ players, chats });
    });
  });
});
// get saved state
// app.get("/api/player/state", (req, res) => {
//   const { ProlificId, BatchId, GameId } = req.query;
//   // … validate …
//   db.get(
//     `SELECT * FROM Player_Realtime
//        WHERE ProlificId=? AND BatchId=? AND GameId=?`,
//     [ProlificId, BatchId, GameId],
//     (err, row) => {
//       if (err) return res.status(500).json({ error: err.message });
//       if (!row) return res.json({});
//       // parse your JSON columns before returning
//       ["Demographic","Onboarding_Survey","Exit_survey","Chat","Offers"].forEach(c => {
//         if (row[c]) row[c] = JSON.parse(row[c]);
//       });
//       res.json(row);
//     }
//   );
// });

//endpoint to mark account as pariticipated

// in your serversql.js (or in a new /api/player/progress endpoint):

app.post("/api/player/progress", (req, res) => {
  const { ProlificId, GameId } = req.body;
  if (!ProlificId || !GameId) {
    return res.status(400).json({ message: "ProlificId and GameId required" });
  }
  const sql = `
    UPDATE Player_Realtime
       SET stateProgress = stateProgress + 1
     WHERE ProlificId = ? AND GameId = ?
  `;
  db.run(sql, [ProlificId, GameId], function (err) {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ message: "Progress incremented", newState: this.changes });
  });
});


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
