import React, { useState } from "react";
import { InstructionsModal } from "./InstructionsModal";
import { MyConsent2 } from "./MyConsent2";

export function OffersSidebar({ previousOffers, onClose }) {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showConsent, setShowConsent] = useState(false);

  const toggleOffer = (index) =>
    setExpandedIndex(expandedIndex === index ? null : index);

  return (
    <div className="flex flex-col h-full bg-black text-white p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold anton-regular text-cyan-200">
          Previous Round Offers
        </h3>
        <button onClick={onClose} className=" bg-black text-gray-700 hover:text-white text-2xl font-bold">
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        {(!previousOffers || previousOffers.length === 0) ? (
          <p className="text-gray-400">No previous offers available.</p>
        ) : (
          <ul className="space-y-2">
            {previousOffers.map((offer, index) => {
              const hrOffer = offer.offers?.Hr
                ? JSON.stringify(offer.offers.Hr)
                : "No HR offer submitted";
              const employeeOffer = offer.offers?.Employee
                ? JSON.stringify(offer.offers.Employee)
                : "No Employee offer submitted";

              return (
                <li
                  key={index}
                  className="bg-cyan-200 text-black border border-cyan-300 p-2 rounded cursor-pointer"
                  onClick={() => toggleOffer(index)}
                >
                  <div className="font-semibold text-cyan-800">Round {offer.round}</div>
                  {expandedIndex === index && (
                    <div className="bg-cyan-100 p-1 mt-2 text-sm text-grey-900">
                      <p><strong>HR Offer:</strong> {hrOffer}</p>
                      <p><strong>Employee Offer:</strong> {employeeOffer}</p>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="mt-4 flex space-x-2">
        <button
          onClick={() => setShowInstructions(true)}
          className="bg-white text-black px-4 py-2 rounded hover:bg-gray-100 anton-regular"
        >
          Need Instructions?
        </button>
        <button
          onClick={() => setShowConsent(true)}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 anton-regular"
        >
          Revisit Consent
        </button>
      </div>

      {showInstructions && (
        <InstructionsModal onClose={() => setShowInstructions(false)} />
      )}
      {showConsent && (
        <div className="fixed inset-0 bg-black z-50 overflow-auto p-8 bg-opacity-95">
          <MyConsent2
            onContinue={() => setShowConsent(false)}
            text="I Agree & Return to Game"
          />
        </div>
      )}
    </div>
  );
}
