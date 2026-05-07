import React, { useEffect, useMemo, useState } from "react";
import { usePressureUnit } from "../../context/PressureUnitContext";
import {
  getCO2Factor,
  getPaco2Range,
  getNormalPaco2,
} from "../../utils/pressureUnit";

const FIXED_PH = 7.4;
const PKA = 6.1;

const HCO3_MIN = 0;
const HCO3_MAX = 100;
const NORMAL_HCO3 = 24.0;

function round1(value) {
  return Math.round(value * 10) / 10;
}

function roundInt(value) {
  return Math.round(value);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getHco3Color(value) {
  if (Math.abs(value - NORMAL_HCO3) < 0.05) return "#73be28";
  if (value < NORMAL_HCO3) return "#ff1a1a";
  return "#1a1aff";
}

function getPaco2Color(value, normalPaco2) {
  if (Math.abs(value - normalPaco2) < 0.5) return "#73be28";
  if (value < normalPaco2) return "#1a1aff";
  return "#ff1a1a";
}

function ConstantPhSlider({
  label,
  value,
  min,
  max,
  step,
  decimals,
  thumbColor,
  onChange,
  leftDisplay,
  rightDisplay,
}) {
  return (
    <div style={{ marginBottom: 48 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: 14,
        }}
      >
        <div
          style={{
            fontSize: 22,
            color: "#444",
            fontWeight: 400,
            lineHeight: 1,
          }}
        >
          {label}
        </div>
        <div
          style={{
            minWidth: 90,
            height: 48,
            borderRadius: 10,
            border: "1.5px solid #d8d8d8",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            color: "#333",
            boxSizing: "border-box",
          }}
        >
          {value.toFixed(decimals)}
        </div>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        className="hh-constant-slider"
        style={{
          "--tc": thumbColor,
          width: "100%",
          appearance: "none",
          background: "transparent",
          margin: 0,
          outline: "none",
        }}
        onChange={(e) => onChange(Number(e.target.value))}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 8,
          fontSize: 16,
          color: "#888",
        }}
      >
        <span>{leftDisplay}</span>
        <span>{rightDisplay}</span>
      </div>

      <style>{`
        .hh-constant-slider {
          outline: none;
        }
        .hh-constant-slider:focus {
          outline: none;
        }
        .hh-constant-slider::-webkit-slider-runnable-track {
          height: 4px; background: #c8c8c8; border-radius: 999px;
        }
        .hh-constant-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 28px; height: 28px; border-radius: 50%;
          background: var(--tc, #73be28);
          margin-top: -12px; border: none; outline: none;
          box-shadow: 0 2px 8px rgba(0,0,0,0.22); cursor: pointer;
        }
        .hh-constant-slider:focus::-webkit-slider-thumb {
          outline: none; box-shadow: 0 2px 8px rgba(0,0,0,0.22);
        }
        .hh-constant-slider::-moz-range-track {
          height: 4px; background: #c8c8c8; border-radius: 999px;
        }
        .hh-constant-slider::-moz-range-thumb {
          width: 28px; height: 28px; border-radius: 50%;
          background: var(--tc, #73be28);
          border: none; outline: none;
          box-shadow: 0 2px 8px rgba(0,0,0,0.22); cursor: pointer;
        }
        .hh-constant-slider:focus::-moz-range-thumb {
          outline: none; box-shadow: 0 2px 8px rgba(0,0,0,0.22);
        }
      `}</style>
    </div>
  );
}

export default function HHEquationConstantPH() {
  const { unit } = usePressureUnit();

  const CO2_FACTOR = getCO2Factor(unit);
  const { min: PACO2_MIN, max: PACO2_MAX } = getPaco2Range(unit);
  const normalPaco2 = getNormalPaco2(unit);

  
  const RATIO = useMemo(
    () => CO2_FACTOR * Math.pow(10, FIXED_PH - PKA),
    [CO2_FACTOR]
  );

  const [hco3, setHco3] = useState(NORMAL_HCO3);
  const [previousUnit, setPreviousUnit] = useState(unit);

  // Reset to normal values when unit changes
  useEffect(() => {
    if (previousUnit === unit) return;
    setHco3(NORMAL_HCO3);
    setPreviousUnit(unit);
  }, [unit, previousUnit]);

  // PaCO2 is always derived from HCO3 to maintain pH = 7.4
  const paco2 = useMemo(() => {
    if (hco3 <= 0) return 0;
    return clamp(roundInt(hco3 / RATIO), PACO2_MIN, PACO2_MAX);
  }, [hco3, RATIO, PACO2_MIN, PACO2_MAX]);

  // Dragging HCO3 → derive PaCO2
  const handleHco3Change = (val) => {
    setHco3(round1(clamp(val, HCO3_MIN, HCO3_MAX)));
  };

  // Dragging PaCO2 → back-calculate HCO3
  const handlePaco2Change = (val) => {
    const nextPaco2 = clamp(roundInt(val), PACO2_MIN, PACO2_MAX);
    if (nextPaco2 <= 0) {
      setHco3(0);
      return;
    }
    setHco3(round1(clamp(nextPaco2 * RATIO, HCO3_MIN, HCO3_MAX)));
  };

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        background: "#fff",
        padding: "24px",
        width: "100%",
        maxWidth: "100%",
        margin: 0,
        boxSizing: "border-box",
      }}
    >
      {/* Header — title only, plain white */}
      {/* <div
        style={{
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: "1px solid #eee",
        }}
      >
        
      </div> */}

      <div style={{ padding: "48px 32px 40px" }}>
        {/* pH display */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div
            style={{
              fontSize: 20,
              color: "#555",
              marginBottom: 10,
              fontWeight: 500,
            }}
          >
            Normal pH
          </div>
          <div style={{ fontSize: 36, color: "#1a1a2e", fontWeight: 500 }}>
            {FIXED_PH}
          </div>
        </div>

        {/* HCO3 slider — 1 decimal, step 0.5 */}
        <ConstantPhSlider
          label={
            <>
              HCO<sub>3</sub>
              <sup>−</sup>
            </>
          }
          value={hco3}
          min={HCO3_MIN}
          max={HCO3_MAX}
          step={0.5}
          decimals={1}
          thumbColor={getHco3Color(hco3)}
          onChange={handleHco3Change}
          leftDisplay="1.0"
          rightDisplay="100.0"
        />

        {/* PaCO2 slider — integer, step 1, unit-aware */}
        <ConstantPhSlider
          label={
            <>
              PaCO<sub>2</sub> ({unit})
            </>
          }
          value={paco2}
          min={PACO2_MIN}
          max={PACO2_MAX}
          step={1}
          decimals={1}
          thumbColor={getPaco2Color(paco2, normalPaco2)}
          onChange={handlePaco2Change}
          leftDisplay={PACO2_MIN.toFixed(1)}
          rightDisplay={PACO2_MAX.toFixed(1)}
        />

        <p
          style={{
            textAlign: "center",
            fontSize: 15,
            lineHeight: 1.7,
            color: "#555",
            maxWidth: 400,
            margin: "16px auto 0",
          }}
        >
          Normal pH is a normal ratio between PaCO<sub>2</sub> and Bicarbonate.
          Move the CO<sub>2</sub> and bicarbonate values to see the various
          combinations at which the pH is 7.4
        </p>
      </div>
    </div>
  );
}