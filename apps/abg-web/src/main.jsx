import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { PressureUnitProvider } from "./context/PressureUnitContext";

const roots = document.querySelectorAll(".abg-react-root");

roots.forEach((rootEl) => {
  const chartType = rootEl.dataset.chart || "abg-graph";

  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <PressureUnitProvider>
        <App chartType={chartType} />
      </PressureUnitProvider>
    </React.StrictMode>
  );
});