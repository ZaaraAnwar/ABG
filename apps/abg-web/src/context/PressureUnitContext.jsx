import React, { createContext, useContext, useEffect, useState } from "react";

const PressureUnitContext = createContext(null);
const STORAGE_KEY = "abg_pressure_unit";

export function PressureUnitProvider({ children }) {
  const [unit, setUnit] = useState(() => {
    const savedUnit = localStorage.getItem(STORAGE_KEY);
    return savedUnit === "mmHg" || savedUnit === "kPa" ? savedUnit : "kPa";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, unit);
  }, [unit]);

  return (
    <PressureUnitContext.Provider value={{ unit, setUnit }}>
      {children}
    </PressureUnitContext.Provider>
  );
}

export function usePressureUnit() {
  const context = useContext(PressureUnitContext);

  if (!context) {
    throw new Error("usePressureUnit must be used inside PressureUnitProvider");
  }

  return context;
}