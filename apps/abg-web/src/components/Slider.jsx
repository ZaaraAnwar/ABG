import React, { useState } from "react";

let sliderIdCounter = 0;

export default function Slider({
  label,
  value,
  min,
  max,
  step,
  decimals,
  thumbColor = "#4caf50",
  onChange,
  disabled = false,
  rightLabel,
}) {
  const [uid] = useState(() => `abg-slider-${++sliderIdCounter}`);

  return (
    <div style={{
      marginBottom: 24,
      opacity: disabled ? 0.4 : 1,
      pointerEvents: disabled ? "none" : "auto",
    }}>

      {/* Top row: label + value box */}
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: 10,
      }}>
        <span style={{ fontSize: 16, fontWeight: 500, color: "#1a1a2e" }}>
          {label}
        </span>
        <span style={{
          fontSize: 15, fontWeight: 500, color: "#1a1a2e",
          background: "#fff", border: "1.5px solid #d9d9d9",
          borderRadius: 10, padding: "6px 14px",
          minWidth: 72, textAlign: "center",
        }}>
          {value.toFixed(decimals)}
        </span>
      </div>

      {/* Track */}
      <input
        id={uid}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          width: "100%",
          appearance: "none",
          WebkitAppearance: "none",
          height: 3,
          borderRadius: 999,
          background: "#d0d0d0",
          outline: "none",
          cursor: disabled ? "default" : "pointer",
          display: "block",
        }}
      />

      {/* Bottom row: min + max labels */}
      <div style={{
        display: "flex", justifyContent: "space-between",
        marginTop: 6, fontSize: 13, color: "#aaa",
      }}>
        <span>{typeof min === "number" ? min.toFixed(min % 1 === 0 ? 1 : 1) : min}</span>
        <span style={{ textAlign: "right", lineHeight: 1.3 }}>
          {rightLabel ?? (typeof max === "number" ? max.toFixed(1) : max)}
        </span>
      </div>

      {/* 
        Interpolate thumbColor directly into the style string.
        This is the ONLY reliable way to style pseudo-elements dynamically in React —
        CSS variables on the element itself don't reach ::-webkit-slider-thumb.
      */}
      <style>{`
        #${uid} { outline: none; -webkit-tap-highlight-color: transparent; }
        #${uid}::-webkit-slider-runnable-track {
          height: 3px;
          border-radius: 999px;
          background: #d0d0d0;
        }
        #${uid}::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: ${thumbColor};
          border: none;
          box-shadow: none;
          margin-top: -11.5px;
          cursor: pointer;
        }
        #${uid}::-moz-range-track {
          height: 3px;
          border-radius: 999px;
          background: #d0d0d0;
        }
        #${uid}::-moz-range-thumb {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: ${thumbColor};
          border: none;
          box-shadow: none;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}