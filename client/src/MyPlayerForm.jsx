// import React, { useState } from "react";

// export function MyPlayerForm({ onPlayerID, connecting }) {
//   // For the text input field.
//   const [playerID, setPlayerID] = useState("");

//   // Handling the player submitting their ID.
//   const handleSubmit = (evt) => {
//     evt.preventDefault();
//     if (!playerID || playerID.trim() === "") {
//       return;
//     }

//     onPlayerID(playerID);
//   };

//   return (
//     <div>
//       <div>Enter your Player Identifier</div>

//       <form action="#" method="POST" onSubmit={handleSubmit}>
//         <fieldset disabled={connecting}>
//           <label htmlFor="playerID">Identifier</label>
//           <input
//             prolificId="playerID"
//             name="playerID"
//             type="text"
//             autoComplete="off"
//             required
//             autoFocus
//             value={playerID}
//             onChange={(e) => setPlayerID(e.target.value)}
//           />

//           <button type="submit">Enter</button>
//         </fieldset>
//       </form>
//     </div>
//   );
// }


// MyPlayerForm.jsx
import React, { useState } from "react";

export  function MyPlayerForm({ onPlayerID, connecting }) {
  // mode can be "create" or "login"
  const [mode, setMode] = useState("create");
  const [username, setUsername] = useState("");
  const [prolificId, setprolificID] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (mode === "create") {
      if (!prolificId.trim() || !username.trim()) {
        alert("Please fill in both the username and ID.");
        return;
      }
      try {
        const response = await fetch("http://localhost:5001/api/accounts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prolificId: prolificId.trim(),
            username: username.trim(),
          }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          alert("Error creating account: " + errorData.message);
          return;
        }
        sessionStorage.setItem(
          "customAccountData",
          JSON.stringify({ prolificId: prolificId.trim(), username: username.trim() })
        );
        onPlayerID(prolificId.trim());
      } catch (error) {
        alert("Error creating account: " + error.message);
      }
    } else if (mode === "login") {
      if (!prolificId.trim()) {
        alert("Please fill in your ID.");
        return;
      }
      try {
        const response = await fetch("http://localhost:5001/api/accounts/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prolificId: prolificId.trim(),
            
          }),
        });
        const result = await response.json();
        if (!response.ok || !result.found) {
          alert("Account not found. Please create an account first.");
          return;
        }
        // For login, we use the provided prolificId
        onPlayerID(prolificId.trim());
      } catch (error) {
        alert("Error during login: " + error.message);
      }
    }
  };
  

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", padding: "20px" }}>
      <h1>{mode === "create" ? "Create Account" : "Log In"}</h1>
      <div style={{ marginBottom: "20px" }}>
        <button type="button" onClick={() => setMode("create")} style={{ marginRight: "10px" }}>
          Create Account
        </button>
        <button type="button" onClick={() => setMode("login")}>Log In</button>
      </div>
      <form onSubmit={handleSubmit}>
        {mode === "create" && (
          <div style={{ marginBottom: "20px" }}>
            <label>
              Username:
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{ marginLeft: "10px", padding: "8px", width: "70%" }}
              />
            </label>
          </div>
        )}
        <div style={{ marginBottom: "20px" }}>
          <label>
            ProlificID:
            <input
              type="text"
              value={prolificId}
              onChange={(e) => setprolificID(e.target.value)}
              required
              style={{ marginLeft: "10px", padding: "8px", width: "70%" }}
            />
          </label>
        </div>
        <button type="submit" disabled={connecting} style={{ padding: "10px 20px", fontSize: "16px" }}>
          {mode === "create" ? "Create Account" : "Log In"}
        </button>
      </form>
    </div>
  );
}
