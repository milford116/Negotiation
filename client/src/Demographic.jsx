import React, { useState } from "react";
import { usePlayer, useGame } from "@empirica/core/player/classic/react";

export function Demographic({ next }) {
  const player = usePlayer();
  const game = useGame();

  const [formData, setFormData] = useState({
    ageRange: "",
    race: [],
    hispanicOrigin: "",
    gender: "",
    education: "",
    occupation: "",
  });

  const ageOptions = [
    { value: "18-24", label: "18–24 years old" },
    { value: "25-34", label: "25–34 years old" },
    { value: "35-44", label: "35–44 years old" },
    { value: "45-54", label: "45–54 years old" },
    { value: "55-64", label: "55–64 years old" },
    { value: "65+", label: "65+ years old" },
  ];

  const raceOptions = [
    { value: "White", label: "White" },
    { value: "Black or African American", label: "Black or African American" },
    { value: "American Indian or Alaska Native", label: "American Indian or Alaska Native" },
    { value: "Asian", label: "Asian" },
    { value: "Native Hawaiian or Other Pacific Islander", label: "Native Hawaiian or Other Pacific Islander" },
    { value: "Some other race", label: "Some other race" },
    { value: "Prefer not to answer", label: "I prefer not to answer" },
  ];

  const hispanicOptions = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
    { value: "Prefer not to answer", label: "I prefer not to answer" },
  ];

  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Non-binary", label: "Non-binary" },
    { value: "Prefer not to answer", label: "I prefer not to answer" },
  ];

  const educationOptions = [
    { value: "Less than high school", label: "Less than a high school degree" },
    { value: "High school or equivalent", label: "High school degree or equivalent (e.g., GED)" },
    { value: "Some college", label: "Some college but no degree" },
    { value: "Associates", label: "Associate’s degree (occupational or academic)" },
    { value: "Bachelors", label: "Bachelor’s degree" },
    { value: "Masters", label: "Master’s degree" },
    { value: "Professional", label: "Professional degree" },
    { value: "Doctoral", label: "Doctoral degree" },
    { value: "Prefer not to answer", label: "I prefer not to answer" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRaceChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const newRace = checked
        ? [...prev.race, value]
        : prev.race.filter((r) => r !== value);
      return { ...prev, race: newRace };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const prolificId = player.get("prolificId");
    const res = await fetch("http://localhost:5001/api/player/demographic", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ProlificId: prolificId,
        BatchId: game.get("batchID"),
        GameId: game.id,
        Demographic: formData,
      }),
    });

    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.message || res.statusText);
    }

    player.set("demographic", formData);
    next();
  };

  return (
    <div className="bg-[#fcf9f4] text-black px-8 py-12 min-h-screen epilogue-body">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-extrabold uppercase text-center mb-10 anton-regular">
          Demographic Information Questionnaire
        </h2>
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Age */}
          <div>
            <label className="block text-xl font-bold mb-2 anton-regular">
              1. Your age range
            </label>
            <select
              name="ageRange"
              value={formData.ageRange}
              onChange={handleChange}
              //required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Select age range…</option>
              {ageOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Race */}
          <div>
            <label className="block text-xl font-bold mb-2 anton-regular">
              2. Your race (select all that apply)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {raceOptions.map((opt) => (
                <label key={opt.value} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="race"
                    value={opt.value}
                    onChange={handleRaceChange}
                    checked={formData.race.includes(opt.value)}
                    className="form-checkbox text-blue-600"
                  />
                  <span className="ml-2">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Hispanic Origin */}
          <div>
            <label className="block text-xl font-bold mb-2 anton-regular">
              3. Are you of Hispanic or Latino origin?
            </label>
            <select
              name="hispanicOrigin"
              value={formData.hispanicOrigin}
              onChange={handleChange}
              //required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Select an option…</option>
              {hispanicOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xl font-bold mb-2 anton-regular">
              4. Your gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              //required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Select an option…</option>
              {genderOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Education */}
          <div>
            <label className="block text-xl font-bold mb-2 anton-regular">
              5. Highest degree of education
            </label>
            <select
              name="education"
              value={formData.education}
              onChange={handleChange}
              //required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Select an option…</option>
              {educationOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Occupation */}
          <div>
            <label className="block text-xl font-bold mb-2 anton-regular">
              6. Please specify your occupation
            </label>
            <input
              type="text"
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              placeholder="Enter your occupation…"
              //required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 mt-6 bg-black text-white text-lg font-bold rounded hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Submit Demographic Information
          </button>
        </form>
      </div>
    </div>
  );
}
