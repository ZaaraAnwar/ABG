import React from "react";
import ABGGraph from "./features/abg-graph/ABGGraph";
import AcuteChronic from "./features/AcuteChronic";
import HHEquation from "./features/HHEquations/HHEquation";
import HHEquationConstantPH from "./features/HHEquations/HHEquationConstantPH";
import DynamicHHEquation from "./features/HHEquations/DynamicHHEquation";
import UnderstandingPH from "./features/UnderstandingPH";

import "./App.css";
import AnionGap from "./features/abg-complete/AnionGap";
import NormalAnionGap from "./features/abg-complete/NormalAnionGap";
import DeltaDelta from "./features/abg-complete/DeltaDelta";
import PressureUnits from "./features/PressureUnits";
import ABGTutor from "./features/abg-complete/abgComplete";
import VentilatorPanel from "./features/ag-tutor/agtutor";
import AGTutor from "./features/ag-tutor/agtutor";
import OxygenDissociationCurve from "./features/odc/Oxygendissociationcurve";
import Aagradient from "./features/a_aGradient/aagradient";
import RespiratoryTutor from "./features/respiratory-tutor/RespiratoryTutor";

function App({ chartType = "abg-graph" }) {
  if (chartType === "acute-chronic") {
    return <AcuteChronic />;
  }

  if (chartType === "hh-equation") {
    return <HHEquation />;
  }

  if (chartType === "hh-equation-constant-ph") {
    return <HHEquationConstantPH />;
  }

  if (chartType === "dynamic-hh-equation") {
    return <DynamicHHEquation />;
  }

  if (chartType === "understanding-ph") {
    return <UnderstandingPH />;
  }

  if (chartType === "pressure-units") {
    return <PressureUnits />;
  }

  if (chartType === "abg-tutor") {
    return <ABGTutor />;
  }

  if (chartType === "anion-gap") {
    return <AnionGap />;
  }

  if (chartType === "normal-anion-gap") {
    return <NormalAnionGap />;
  }

  if (chartType === "delta-delta") {
    return <DeltaDelta />;
  }

  if (chartType === "ag-tutor") {
    return <AGTutor />;
  }

  if (chartType === "odc") {
    return <OxygenDissociationCurve />;
  }

  if (chartType === "aa-gradient") {
    return <Aagradient />;
  }

  if (chartType === "respiratory-tutor") {
    return <RespiratoryTutor />;
  }

  return <ABGGraph />;
}

export default App;
