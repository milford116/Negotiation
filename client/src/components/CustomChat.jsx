// CustomChat.jsx
import React, { useState, useEffect, useRef } from "react";
import { usePlayer, useGame } from "@empirica/core/player/classic/react";

export function CustomChat() {
  const game = useGame();
  const player = usePlayer();
  const messages = game.get("chat") || [];
  const [text, setText] = useState("");
  const chatEndRef = useRef(null);

  const handleSend = () => {
    if (text.trim() === "") return;
    const newMessage = {
      playerId: player.id,
      name: player.get("username") || player.get("role"),
      role: player.get("role"),
      text,
      timestamp: new Date().toISOString(),
    };
    const updatedMessages = [...messages, newMessage];
    game.set("chat", updatedMessages);
    setText("");
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const playerRole = player.get("role");

  return (
    <div className="flex flex-col h-full bg-black text-white border rounded-lg shadow overflow-hidden">
      <div className="p-3 font-bold text-xl text-cyan-200 text-left anton-regular tracking-wide border-b border-cyan-200 uppercase">
        Chat <span className="normal-case text-xl text-gray-400">(You are <strong>{playerRole})</strong></span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg, index) => {
          const isSelf = msg.playerId === player.id;
          return (
            <div
              key={index}
              className={`flex ${isSelf ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-4 py-3 rounded-md text-sm leading-snug shadow ${
                  isSelf
                    ? "bg-white text-black rounded-bl-none"
                    : "bg-gray-700 text-white rounded-br-none"
                }`}
              >
                <p className="text-xs text-gray-400 mb-1">{msg.name} ({msg.role})</p>
                <p>{msg.text}</p>
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      <div className="p-3 border-t border-gray-700 bg-black">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-white text-black rounded focus:outline-none"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-white text-black font-semibold rounded hover:opacity-90"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
