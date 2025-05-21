import React, { useState, useEffect } from "react";
import { usePlayer } from "@empirica/core/player/classic/react";

export function MyConsent2({ next, onContinue, text = "Continue" }) {
  const player = usePlayer();
  const handleContinue = onContinue || next;
  const [agreed, setAgreed] = useState(true); // default to checked if needed

  return (
    <div className="bg-[#fcf9f4] text-black px-8 py-12 min-h-screen font-sans">
      <div className="max-w-3xl mx-auto text-[1.05rem] leading-7 epilogue-body">
        {/* Centered Heading */}
        <h2 className="text-4xl font-extrabold uppercase text-center mb-10 tracking-wide anton-regular">
          Consent Form
        </h2>

        {/* Section Flow - DO NOT CHANGE TEXT */}
        <p className="text-xl mb-1 anton-regular"><b>Study Description</b></p>
        <p className="mb-6">
          The experiment will take about 45 minutes. You will be paid once you complete the entire experiment. If you decide to participate in the study, you will be paired with another participant with
          whom you will negotiate a remuneration-benefits package in a hypothetical job interview scenario.
          There will be three stages in the study:
          <br /><br />
          <b className="anton-regular">Stage 1: Onboarding</b> <br />
          You will answer a questionnaire about yourself (e.g., capturing demographic information and interests).
          <br /><br />
          <b className="anton-regular">Stage 2: Negotiation Task</b> <br />
          You will chat with your counterpart to negotiate the specifics of the remuneration package. You will win more ‘points’ if you can secure a better deal for yourself.
          You will also be informed about an ‘alternative job offer’ available to you (with a specific amount of ‘points’), which will be your fallback plan if you cannot agree on the benefits package under negotiation.
          <br /><br />
          <b className="anton-regular">Stage 3: Offboarding</b> <br />
          You will respond to a survey questionnaire to reflect on your negotiation experience and to report your rapport with your counterpart. Likewise, your counterpart will also rate the rapport they enjoyed with you.
          Your goal will be to get the most economic value (how many points you score) and social value (how much rapport your counterpart reports to have with you) out of the negotiation. You will be guided with instructions throughout the experiment.
        </p>

        <p className="mb-6">
  <b className="anton-regular">Payments:</b> You will be paid $10 for completing the study. Please note that the payment will only be made if
  you complete all three stages of the study. All payments will be made through the Prolific interface.
  No direct payment will be made from the University of South Florida research team.
  <br /><br />
  <span className="font-semibold">
    Please note: spam responses, low-effort answers, or behavior that suggests inattentiveness may result in exclusion from the study without compensation.
  </span>
</p>

        <p className="mb-6">
          <b className="anton-regular">Risks of Participation</b>: The risks of participation are minimal. In the unusual circumstance that you face inappropriate
          language during your chat with your negotiation counterpart (e.g., use of curse words), you will be
          able to flag and report the misbehavior. You will also have the option to withdraw from the study
          at any time. In case any inappropriate language is used in the negotiation chat, the misbehaving
          subject will be dismissed without compensation and reported to Prolific.
        </p>

        <p className="mb-6">
          <b className="anton-regular">Benefits of Participation</b>: You can benefit from practicing your negotiation skills with your counterpart.
        </p>

        <p className="mb-6">
          <b className="anton-regular">Data Confidentiality</b>: This study will use our custom-built website to collect your research data; therefore, Prolific will not
          have access to your research data. The University of South Florida makes every effort to keep the
          information collected from you private. We will not collect any personally identifiable information
          from you. Prolific IDs will be collected to distribute payments. The final data set from the study
          will not include any reference to your Prolific ID.
          Participation in this study provides implicit consent for the research team to share the data set and
          results with other researchers not directly listed in this protocol for further analysis.
        </p>

        <p className="mb-6">
          <b className="anton-regular">Voluntary Participation</b>: Your participation in this study is entirely voluntary. You are free to withdraw at any time, for
          whatever reason.
        </p>

        <p className="mb-6">
          <b className="anton-regular">Contact</b>: For any questions, concerns, or complaints about this research, you may contact the research team
          by sending a message in Prolific or emailing us at cssai.research@gmail.com. You can also
          email the Principal Investigator, Dr. Raiyan Abdul Baten, at rbaten@usf.edu.
        </p>

        {/* Checkbox */}
        <div className="mt-6 mb-6">
          <label className="flex items-center text-lg font-semibold anton-regular">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mr-3 h-5 w-5"
            />
            I have read and agree to the terms above
          </label>
        </div>

        {/* Continue Button */}
        {agreed && (
          <div className="flex justify-center mt-4">
            <button
              onClick={handleContinue}
              className="bg-black text-white text-lg font-bold px-8 py-3 rounded hover:bg-gray-800 transition"
            >
              {text}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
