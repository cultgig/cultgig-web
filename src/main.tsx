import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { SpeedInsights } from "@vercel/speed-insights/react";
import App from "./app/App";
import { initPostHog } from "./lib/posthog";
import "./styles/globals.css";

initPostHog();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    <SpeedInsights />
  </StrictMode>
);
