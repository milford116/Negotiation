const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express(
);
app.use(cors());
app.options("*", cors());

const port = process.env.PORT || 5001;

const allowedOrigin = process.env.NODE_ENV === "production" ? "http://localhost:3000" : "*";
app.use(cors({ origin: allowedOrigin }));
app.options("*", cors({ origin: allowedOrigin }));


// Use body-parser middleware to parse JSON requests
app.use(bodyParser.json());
// Use CORS middleware to allow requests from your front-end domain


// Connect to MongoDB (adjust the connection string as needed)
mongoose
  .connect("mongodb+srv://urmi:nSV5vvAjS!6_TN7@cluster0.e49qwwm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define a schema and model for accounts
const accountSchema = new mongoose.Schema({
  prolificId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  
});

const Account = mongoose.model("Account", accountSchema);

// Endpoint to create an account
app.post("/api/accounts", async (req, res) => {
  try {
    const { prolificId, username } = req.body;
    if (!prolificId || !username) {
      return res.status(400).json({ message: "customId and username are required" });
    }
    // Check if an account with the given customId already exists
    const existing = await Account.findOne({ prolificId });
    if (existing) {
      return res.status(400).json({ message: "Account with this ID already exists" });
    }
    const newAccount = new Account({ prolificId, username });
    await newAccount.save();
    return res.status(201).json({ message: "Account created successfully", account: newAccount });
  } catch (err) {
    console.error("Error in /api/accounts:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Endpoint to verify an account (for login)
app.post("/api/accounts/verify", async (req, res) => {
  try {
    const { prolificId } = req.body;
    if (!prolificId ) {
      return res.status(400).json({ message: "customId and username are required" });
    }
    const account = await Account.findOne({ prolificId });
    if (account) {
      return res.status(200).json({ message: "Account verified", found: true, account });
    } else {
      return res.status(404).json({ message: "Account not found", found: false });
    }
  } catch (err) {
    console.error("Error in /api/accounts/verify:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
