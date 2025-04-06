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
  const sql = "INSERT INTO accounts (prolificId, username) VALUES (?, ?)";
  db.run(sql, [prolificId.trim(), username.trim()], function (err) {
    if (err) {
      console.error("Error inserting account:", err);
      // Check for duplicate key error (SQLite returns a code like SQLITE_CONSTRAINT)
      return res.status(400).json({ message: "Account with this ID already exists" });
    }
    return res.status(201).json({ message: "Account created successfully", account: { prolificId, username } });
  });
});

// Endpoint to verify an account (for login)
app.post("/api/accounts/verify", (req, res) => {
  const { prolificId, username } = req.body;
//   if (!prolificId || !username) {
//     return res.status(400).json({ message: "prolificId and username are required" });
//   }
  const sql = "SELECT * FROM accounts WHERE prolificId = ?";
  db.get(sql, [prolificId.trim()], (err, row) => {
    if (err) {
      console.error("Error verifying account:", err);
      return res.status(500).json({ message: "Server error" });
    }
    if (row) {
      return res.status(200).json({ message: "Account verified", found: true, account: row });
    } else {
      return res.status(404).json({ message: "Account not found", found: false });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
