import React from "react";
import { createRoot } from "react-dom/client";
import "@unocss/reset/tailwind-compat.css";
import "virtual:uno.css";
import "../styles/empirica.css"; //changed

import App from "./App";
import "./index.css";
//import { BrowserRouter } from "react-router-dom";

const container = document.getElementById("root");
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
  <React.StrictMode>
    
    <App />
   
  </React.StrictMode>
);
