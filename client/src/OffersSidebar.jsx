// OffersSidebar.jsx
import React, { useState } from "react";

export  function OffersSidebar({ previousOffers }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleOffer = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="p-4">
      <h3 className="text-xl font-bold mb-4">Previous Round Offers</h3>
      {previousOffers.length === 0 ? (
        <p>No previous offers available.</p>
      ) : (
        <ul className="space-y-2">
          {previousOffers.map((offer, index) => (
            <li
              key={index}
              className="border p-2 rounded cursor-pointer"
              onClick={() => toggleOffer(index)}
            >
              <div className="font-semibold">Round {offer.round}</div>
              {expandedIndex === index && (
                <div className="mt-2 text-sm text-gray-700">
                  <p>
                    <strong>HR Offer:</strong> {JSON.stringify(offer.offers.Hr)}
                  </p>
                  <p>
                    <strong>Employee Offer:</strong> {JSON.stringify(offer.offers.Employee)}
                  </p>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
