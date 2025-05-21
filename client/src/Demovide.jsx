// DemoVideo.jsx
import React from "react";
import demo from "./videos/demo.mp4";
export function DemoVideo({ next }) {
  return (
    <div className="p-8 flex flex-col items-center">
      <h2 className="text-2xl mb-4">Quick Tutorial</h2>
      <video
        width="640"
        height="360"
        controls
        onEnded={next}                // auto-advance when it finishes
        style={{ borderRadius: 8 }}
      >
        <source src={demo} type="video/mp4" />
        Your browser doesn’t support HTML5 video.
      </video>

      <button
        onClick={next}                // let them skip if they want
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Skip Tutorial
      </button>
    </div>
  );
}
