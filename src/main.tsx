import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App";
import { initPostHog } from "./lib/posthog";
import "./styles/globals.css";

initPostHog();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
