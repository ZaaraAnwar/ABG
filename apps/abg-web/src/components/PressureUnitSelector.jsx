import React from "react";
import { usePressureUnit } from "../context/PressureUnitContext";

export default function PressureUnitSelector() {
  const { unit, setUnit } = usePressureUnit();

  const options = ["mmHg", "kPa"];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: 12,
        marginTop: 20,
        marginBottom: 16
      }}
    >
      {options.map((option) => {
        const active = unit === option;

        return (
          <div
            key={option}
            onClick={() => setUnit(option)}
            style={{
              padding: "10px 22px",
              borderRadius: 999,
              background: active ? "#6b4fa0" : "#f3f4f6",
              color: active ? "#fff" : "#444",
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
              border: active ? "1px solid #6b4fa0" : "1px solid #d9d9d9",
              userSelect: "none",
              lineHeight: 1.2
            }}
          >
            {option}
          </div>
        );
      })}
    </div>
  );
}