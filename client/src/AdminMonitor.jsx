import React, { useState, useEffect } from "react";

function CollapsibleCell({ data }) {
  const [expanded, setExpanded] = useState(false);
  if (!data) return "";

  let str = typeof data === "string" ? data : JSON.stringify(data);
  const preview = str.length > 40 ? str.slice(0, 40) + "…" : str;

  return (
    <span>
      {expanded ? <pre style={{ whiteSpace: "pre-wrap" }}>{str}</pre> : preview}
      {str.length > 40 && (
        <button
          style={{
            marginLeft: 4,
            background: "none",
            border: "none",
            color: "#1e90ff",
            cursor: "pointer",
            fontSize: 12,
            textDecoration: "underline",
          }}
          onClick={() => setExpanded((e) => !e)}
        >
          {expanded ? "Show Less" : "Show More"}
        </button>
      )}
    </span>
  );
}


export function AdminMonitor() {
  const [players, setPlayers] = useState([]);
  const [chats, setChats] = useState([]);
  const API_BASE = window.location.hostname === "localhost"
    ? "http://localhost:5001"
    : "";
  const fetchMonitor = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin-monitor`);
      if (!res.ok) throw new Error(res.statusText);
      const json = await res.json();
      setPlayers(json.players || []);
      setChats(json.chats || []);
    } catch (err) {
      console.error("Failed to load monitor data:", err);
    }
  };

  useEffect(() => {
    fetchMonitor();
    const id = setInterval(fetchMonitor, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>🛠️ Admin Monitor</h2>
      <h3>Players</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {[
              "GameId",
              "Role",
              "ProlificId",
              "Score",
              "BATNA",
              "Initial BATNA",
              "Demographic",
              "OnboardingSurvey",
              "ExitSurvey",
              "ExitDone",
              "stateProgress",
              "Offers",
            ].map((h) => (
              <th
                key={h}
                style={{
                  border: "1px solid #ccc",
                  padding: "6px",
                  background: "#f7f7f7",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {players.map((row, i) => (
            <tr key={i}>
              <td style={{ border: "1px solid #ccc", padding: 6 }}>{row.GameId}</td>
              <td style={{ border: "1px solid #ccc", padding: 6 }}>{row.Role}</td>
              <td style={{ border: "1px solid #ccc", padding: 6 }}>{row.ProlificId}</td>
              <td style={{ border: "1px solid #ccc", padding: 6 }}>{row.Score}</td>
              <td style={{ border: "1px solid #ccc", padding: 6 }}>{row.Batna}</td>
              <td style={{ border: "1px solid #ccc", padding: 6 }}>{row.initialBatna}</td>
              <td style={{ border: "1px solid #ccc", padding: 6, maxWidth: 150, overflowX: "auto" }}>{row.Demographic}</td>
              <td style={{ maxWidth: 150, overflowX: "auto", fontSize: 12 }}>
                <CollapsibleCell data={row.Onboarding_Survey} />
              </td> 
              <td style={{ border: "1px solid #ccc", padding: 6, maxWidth: 150, overflowX: "auto" }}>{row.ExitSurvey}</td>
              <td style={{ border: "1px solid #ccc", padding: 6 }}>
                {row.ExitCompleted ? "✅" : "⏳"}
              </td>
              <td style={{ border: "1px solid #ccc", padding: 6 }}>
                {row.stateProgress}
              </td>
              <td style={{ border: "1px solid #ccc", padding: 6, maxWidth: 150, overflowX: "auto" }}>{row.Offers}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ marginTop: 40 }}>Chat Log</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {["BatchId", "GameId", "RoundIndex", "HrProlificId", "EmpProlificId", "ChatLog"].map((h) => (
              <th
                key={h}
                style={{
                  border: "1px solid #ccc",
                  padding: "6px",
                  background: "#f7f7f7",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {chats.map((row, i) => (
            <tr key={i}>
              <td style={{ border: "1px solid #ccc", padding: 6 }}>{row.BatchId}</td>
              <td style={{ border: "1px solid #ccc", padding: 6 }}>{row.GameId}</td>
              <td style={{ border: "1px solid #ccc", padding: 6 }}>{row.RoundIndex}</td>
              <td style={{ border: "1px solid #ccc", padding: 6 }}>{row.HrProlificId}</td>
              <td style={{ border: "1px solid #ccc", padding: 6 }}>{row.EmpProlificId}</td>
              <td style={{ border: "1px solid #ccc", padding: 6, maxWidth: 300, overflowX: "auto" }}>{row.ChatLog}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
