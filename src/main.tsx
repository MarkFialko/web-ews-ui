// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { enableMocking } from "@mocks/index";

const startApp = async () => {
  await enableMocking();

  createRoot(document.getElementById("root")!).render(
    // <StrictMode>
    <App />,
    // </StrictMode>,
  );
};

void startApp();
