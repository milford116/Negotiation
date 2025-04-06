import React from "react";
import { Button } from "../components/Button";

export function Introduction({ next }) {
  return (
    <div className="mt-5 sm:mt-8 px-6 py-8 bg-white shadow-lg rounded-lg max-w-3xl mx-auto">
      <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Welcome to the Salary Negotiation Game
      </h3>
      <div className="mb-6">
        <p className="text-base text-gray-600 leading-relaxed">
          This is a salary negotiation simulation between an HR representative and an Employee. Your goal is to negotiate effectively and maximize your score.
        </p>
        <ul className="list-disc list-inside mt-4 space-y-2 text-gray-600">
          <li>
            You will negotiate over <strong>4 issues</strong>: <em>Salary</em>, <em>Bonus</em>, <em>Stock Options</em>, and <em>Vacation Days</em>.
          </li>
          <li>
            If you reach an agreement, your score will be calculated based on the negotiated terms.
          </li>
          <li>
            If you walk away from the negotiation, you will receive your <strong>BATNA</strong> (Best Alternative to a Negotiated Agreement).
          </li>
          <li>
            The player with the higher score at the end wins.
          </li>
        </ul>
      </div>
      <div className="mt-8 flex justify-center">
        <Button handleClick={next} autoFocus>
          <span className="text-lg font-medium text-white">Start Game</span>
        </Button>
      </div>
    </div>
  );
  
}
