// OffersSidebar.jsx
import React, { useState } from "react";
import { InstructionsModal } from "./InstructionsModal.jsx";
import { MyConsent2 } from "./MyConsent2.jsx";

export function OffersSidebar({ previousOffers }) {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showConsent, setShowConsent] = useState(false);

  const handleToggleInstructions = () => {
    setShowInstructions((prev) => !prev);
  };

  const toggleOffer = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col h-full p-4 relative">
      <h3 className="text-xl font-bold mb-4">Previous Round Offers</h3>

      {/* Scrollable offers list */}
      <div className="flex-1 overflow-auto">
        {(!previousOffers || previousOffers.length === 0) ? (
          <p>No previous offers available.</p>
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
                  className="border p-2 rounded cursor-pointer"
                  onClick={() => toggleOffer(index)}
                >
                  <div className="font-semibold">Round {offer.round}</div>
                  {expandedIndex === index && (
                    <div className="mt-2 text-sm text-gray-700">
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

      {/* Buttons pinned to bottom-left */}
      <div className="mt-auto flex space-x-2">
        <button
          onClick={handleToggleInstructions}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Need Instructions?
        </button>
        <button
          onClick={() => setShowConsent(true)}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Revisit Consent
        </button>
      </div>

      {/* Modals */}
      {showInstructions && (
        <InstructionsModal onClose={handleToggleInstructions} />
      )}

      {showConsent && (
        <div
          className="fixed inset-0 bg-white z-50 overflow-auto p-8"
          style={{ backgroundColor: "rgba(255,255,255,0.95)" }}
        >
          <MyConsent2
            onContinue={() => setShowConsent(false)}
            text="I Agree & Return to Game"
          />
        </div>
      )}
    </div>
  );
}
