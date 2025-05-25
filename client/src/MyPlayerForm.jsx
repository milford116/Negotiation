import React, { useState } from "react";
import { usePlayer,useGame} from "@empirica/core/player/classic/react";
import { Button } from "./components/Button"; // adjust path if needed


export function MyPlayerForm({ onPlayerID, connecting }) {
  const [mode, setMode] = useState("create");
  const player   = usePlayer();
  const [username, setUsername] = useState("");
  const [prolificId, setprolificID] = useState("");
  const studyId="negotiation_spring_25_batch1";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === "create") {
      if (!prolificId.trim() || !username.trim()) {
        alert("Please fill in both fields.");
        return;
      }
      try {
        const response = await fetch("http://localhost:5001/api/accounts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prolificId: prolificId.trim(),
            username: username.trim(),
            studyId: studyId,
          }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          alert("Error creating account: " + errorData.message);
          return;
        }
        sessionStorage.setItem(
          "customAccountData",
          JSON.stringify({ prolificId, username })
        );
        const id = prolificId.trim();
        onPlayerID(id);
        
      
      } catch (error) {
        alert("Error creating account: " + error.message);
      }
    } else {
      if (!prolificId.trim() || !username.trim()) {
        alert("Please enter your username and prolific id both to login.");
        return;
      }
      try {
        const response = await fetch("http://localhost:5001/api/accounts/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prolificId: prolificId.trim(),
            username: username.trim(),
            studyId: studyId.trim(),
            
          }),
        });
        const result = await response.json();
        if (!response.ok || !result.found) {
          alert("Account not found. Please create one first.");
          return;
        }
        sessionStorage.setItem(
          "customAccountData",
          JSON.stringify({ prolificId: prolificId.trim(), username: '' })
        );
        const id = prolificId.trim();
        onPlayerID(id);
      } catch (error) {
        alert("Error logging in: " + error.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-16 epilogue-body">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12">
        {/* Left Text Block */}
        <div>
          <h1 className="text-4xl text-cyan-200 mb-6 uppercase anton-regular">
            {mode === "create" ? "Create Account" : "Login"}
          </h1>
          <p className="text-lg text-cyan-100">
            {mode === "create"
              ? "Please create an account for the Negotiation Game using your Prolific ID and set up a Pseudo Username!"
              : "Please login to the account you have created for the Negotiation Game using your Prolific ID and Pseudo Username."}
          </p>
        </div>

        {/* Right Form Block */}
        <div className="bg-black rounded p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            
              <div>
                <label className="block text-base text-white font-bold mb-1">
                Pseudo Username <span className="text-sm text-gray-300 font-normal">(required)</span>
              </label>

                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-full bg-cyan-300 text-black focus:outline-none"
                />
              </div>
           
            <div>
              <label className="block text-base text-white font-bold mb-1">
              ProlificID <span className="text-sm text-gray-300 font-normal">(required)</span>
              </label>
              <input
                type="text"
                value={prolificId}
              onChange={(e) => setprolificID(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-full bg-cyan-300 text-black focus:outline-none"
              />
            </div>

            <Button
            type="submit"
            disabled={connecting}
            primary
            className="bg-cyan-100 text-black font-semibold px-6 py-2 rounded hover:bg-cyan-200 transition w-auto mx-auto block"
          >
            {mode === "create" ? "Create Account" : "Login"}
          </Button>
          </form>

          {/* Toggle Links */}
          <div className="text-left mt-4">
            {mode === "create" ? (
              <p className="text-2xl text-cyan-200 mb-6 uppercase anton-regular">
                Already have an account?{" "}
                <button onClick={() => setMode("login")} className="underline text-cyan-600 hover:text-gray-800">
                  Login
                </button>
              </p>
            ) : (
              <p className="text-2xl text-cyan-200 mb-6 uppercase anton-regular">
                Don't have an account?{" "}
                <button onClick={() => setMode("create")} className="underline text-cyan-600 hover:text-gray-800">
                  Create one
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
