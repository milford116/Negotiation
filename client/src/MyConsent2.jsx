// ConsentForm.jsx
import React, { useState, useEffect } from "react";
import { usePlayer } from "@empirica/core/player/classic/react";
import { useProgress} from "./ProgressContext.jsx";

//export function MyConsent2({next }) {
  export function MyConsent2({next,onContinue, text = "Continue"  }) {
  const player = usePlayer();

  const { setCurrent } = useProgress();
  useEffect(() => {
    setCurrent(1); // Consent is step 1 of 10
  }, []);

  // Called when the user checks the consent box.
  const handleContinue = onContinue || next;
  // Track the checked state of the “I agree” box
  const [agreed, setAgreed] = useState(true);

  return (
    <div style={{ padding: "20px", display: "flex", flexWrap: "wrap" }}>
      {/* Left Section */}
      <div style={{ flex: "1 1 45%", marginRight: "5%", minWidth: "300px" }}>
        <h2><b>Consent Form</b></h2>
       
        <b>Study Description</b>
        <p>
        The experiment will take about 45 minutes. You will be paid once you complete the entire experiment. If you decide to participate in the study, you will be paired with another participant with
whom you will negotiate a remuneration-benefits package in a hypothetical job interview scenario.
There will be three stages in the study:
<br/>
<b>Stage 1 </b>: Onboarding: You will answer a questionnaire about yourself (e.g., capturing demographic
information and interests).<br/>

<b>Stage 2</b>: Negotiation Task: You will chat with your counterpart to negotiate the specifics of the
remuneration package. You will win more ‘points’ if you can secure a better deal for yourself.
You will also be informed about an ‘alternative job offer’ available to you (with a specific amount
of ‘points’), which will be your fallback plan if you cannot agree on the benefits package under
negotiation.<br/>

<b>Stage 3</b>: Offboarding: You will respond to a survey questionnaire to reflect on your negotiation
experience and to report your rapport with your counterpart. Likewise, your counterpart will also
rate the rapport they enjoyed with you.
Your goal will be to get the most economic value (how many points you score) and social value
(how much rapport your counterpart reports to have with you) out of the negotiation. You will be
guided with instructions throughout the experiment.
        </p>
        <p>
          <b>Payments </b>: You will be paid $10 for completing the study. Please note that the payment will only be made if
you complete all three stages of the study. All payments will be made through the Prolific interface.
No direct payment will be made from the University of South Florida research team.
        </p>
        <p>
       <b> Risks of Participation</b>: The risks of participation are minimal. In the unusual circumstance that you face inappropriate
language during your chat with your negotiation counterpart (e.g., use of curse words), you will be
able to flag and report the misbehavior. You will also have the option to withdraw from the study
at any time. In case any inappropriate language is used in the negotiation chat, the misbehaving
subject will be dismissed without compensation and reported to Prolific.
        </p>
      </div>

      {/* Right Section */}
      <div style={{ flex: "1 1 45%", minWidth: "300px" }}>
        
        <p>
        <b>Benefits of Participation</b>: You can benefit from practicing your negotiation skills with your counterpart.
        </p>
        <p>
         <b> Data Confidentiality</b>: This study will use our custom-built website to collect your research data; therefore, Prolific will not
have access to your research data. The University of South Florida makes every effort to keep the
information collected from you private. We will not collect any personally identifiable information
from you. Prolific IDs will be collected to distribute payments. The final data set from the study
will not include any reference to your Prolific ID.
Participation in this study provides implicit consent for the research team to share the data set and
results with other researchers not directly listed in this protocol for further analysis.
        </p>
        <p>
          <b>Voluntary Participation </b>: Your participation in this study is entirely voluntary. You are free to withdraw at any time, for
          whatever reason.
        </p>
        <p>
         <b> Contact </b>: For any questions, concerns, or complaints about this research, you may contact the research team
by sending a message in Prolific or emailing us at cssai.research@gmail.com. You can also
email the Principal Investigator, Dr. Raiyan Abdul Baten, at rbaten@usf.edu.
        </p>

        {/* 1) The “I agree” checkbox */}
      <label className="flex items-center space-x-2 mb-4">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="form-checkbox h-5 w-5 text-blue-600"
        />
        <span className="text-gray-700">
          I have read and agree to the terms above
        </span>
      </label>

        {/* Render the consent checkbox on Day 0 if consent has not already been given */}
       
        {agreed && (
        <button
          onClick={handleContinue}
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {text}
        </button>
      )}
        
      </div>
    </div>
  );
}
