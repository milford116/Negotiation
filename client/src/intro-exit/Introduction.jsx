import React from "react";
import { Button } from "../components/Button";

export function Introduction({ next }) {
  return (
    <div
      className="bg-cover bg-center bg-no-repeat min-h-screen flex items-center justify-center"
      style={{ backgroundImage: "url('/chessBg.jpg')" }}
    >
      <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-between px-8 py-16">
        {/* Heading (left) */}
        <div className="text-white text-4xl md:text-5xl font-extrabold anton-regular mb-8 md:mb-0 md:w-1/2 text-center md:text-left leading-tight drop-shadow-lg"
        style={{ textShadow: "2px 2px 8px rgba(0, 0, 0, 0.7)" }}>
          WELCOME TO THE SALARY
          <br />
          NEGOTIATION GAME!
        </div>
        <br />

        {/* Description box (right) */}
        <div className="bg-black bg-opacity-60 rounded-lg p-8 md:w-1/2 text-white shadow-lg">
          <p className="text-lg leading-relaxed mb-6" style={{ textShadow: "2px 2px 8px rgba(0, 0, 0, 0.7)" }}>
            Imagine you’re negotiating your first job offer. What matters most
            to you: a high salary, more stock options, or extra vacation days?
            <br />
            <br />
            You will step into the shoes of either an HR Manager or an Employee
            negotiating over salary, bonuses, stock options, and vacation days.
            The goal? Maximize your gains while ensuring a fair deal.
          </p>
          <div className="text-center">
            <Button
              handleClick={next}
              className="bg-cyan-100 text-black font-semibold text-md px-6 py-2 rounded hover:bg-cyan-200 transition"
            >
              See Instructions
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
