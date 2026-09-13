import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App";
import { DevRoleSwitcher } from "./components/dev/DevRoleSwitcher";
import { AuthProviderRoot } from "./state/AuthContext";
import "./styles/globals.css";
import "./styles/visual.css";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProviderRoot><App /><DevRoleSwitcher /></AuthProviderRoot>
  </StrictMode>,
);
