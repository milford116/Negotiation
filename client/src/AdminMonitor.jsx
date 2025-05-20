// src/AdminMonitor.jsx
import React, { useState, useEffect } from "react";

export function AdminMonitor() {
  const [data, setData] = useState([]);
  const [expandedChat, setExpandedChat] = useState({});
  const API_ORIGIN =
  window.location.hostname === "localhost"
    ? "http://localhost:5001"  // your Express API
    : "";                      // in production they'll be same origin

  // fetch the monitor data
  const fetchMonitor = async () => {
    try {
      const res = await fetch(`${API_ORIGIN}/api/admin-monitor`);
      if (!res.ok) throw new Error(res.statusText);
      const json = await res.json();
      setData(json);
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
      <h2>🛠️  Admin Monitor</h2>
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
              "Chat",
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
          {data.map((row, i) => {
            const id = `${row.GameId}-${row.ProlificId}`;
            const isOpen = !!expandedChat[id];
            let chatLines = [];
            try {
              chatLines = JSON.parse(row.Chat || "[]");
            } catch {}
            return (
              <tr key={i}>
                <td style={{ border: "1px solid #ccc", padding: 6 }}>
                  {row.GameId}
                </td>
                <td style={{ border: "1px solid #ccc", padding: 6 }}>
                  {row.Role}
                </td>
                <td style={{ border: "1px solid #ccc", padding: 6 }}>
                  {row.ProlificId}
                </td>
                <td style={{ border: "1px solid #ccc", padding: 6 }}>
                  {row.Score}
                </td>
                <td style={{ border: "1px solid #ccc", padding: 6 }}>
                  {row.Batna}
                </td>
                <td style={{ border: "1px solid #ccc", padding: 6 }}>
                  {row.initialBatna}
                </td>
                <td style={{ border: "1px solid #ccc", padding: 6, maxWidth: 150, overflowX: "auto" }}>
                  {row.Demographic}
                </td>
                <td style={{ border: "1px solid #ccc", padding: 6, maxWidth: 150, overflowX: "auto" }}>
                  {row.OnboardingSurvey}
                </td>
                <td style={{ border: "1px solid #ccc", padding: 6, maxWidth: 150, overflowX: "auto" }}>
                  {row.ExitSurvey}
                </td>
                <td style={{ border: "1px solid #ccc", padding: 6 }}>
                  {row.ExitCompleted ? "✅" : "⏳"}
                </td>
                <td style={{ border: "1px solid #ccc", padding: 6 }}>
                  <button onClick={() => setExpandedChat((m) => ({ ...m, [id]: !isOpen }))}>
                    {isOpen ? "Hide" : "Show"}
                  </button>
                  {isOpen && (
                    <div style={{ maxHeight: 200, overflowY: "auto", marginTop: 4, background: "#fafafa", padding: 6 }}>
                      {chatLines.length === 0
                        ? <em>(no chat)</em>
                        : chatLines.map((m, j) => (
                            <div key={j} style={{ marginBottom: 4 }}>
                              <strong>{m.sender.name}</strong> [{m.timestamp}]:{" "}
                              {m.text}
                            </div>
                          ))
                      }
                    </div>
                  )}
                </td>
                <td style={{ border: "1px solid #ccc", padding: 6, maxWidth: 150, overflowX: "auto" }}>
                  {row.Offers}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
