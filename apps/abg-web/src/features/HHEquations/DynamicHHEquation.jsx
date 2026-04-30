import React, { useEffect, useMemo, useState } from "react";
import { usePressureUnit } from "../../context/PressureUnitContext";
import {
  getCO2Factor,
  getPaco2Range,
  getNormalPaco2,
} from "../../utils/pressureUnit";

const HCO3_MIN = 1.0;
const HCO3_MAX = 100.0;
const NORMAL_HCO3 = 24.0;

const KIDNEY_IMAGE =
  "https://abg.leadows.com/wp-content/uploads/2026/04/ChatGPT-Image-Apr-23-2026-12_50_29-PM.png";
// replace this with your lungs url when you have it
const LUNG_IMAGE =
  "https://abg.leadows.com/wp-content/uploads/2026/04/WhatsApp-Image-2026-04-23-at-12.38.48-PM.jpeg";
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function round1(value) {
  return Math.round(value * 10) / 10;
}

function getHco3Color(value) {
  if (Math.abs(value - NORMAL_HCO3) < 0.05) return "#73be28";
  if (value < NORMAL_HCO3) return "#73be28";
  return "#1d2cff";
}

function getPaco2Color(value, normalPaco2) {
  if (Math.abs(value - normalPaco2) < 0.05) return "#73be28";
  if (value < normalPaco2) return "#73be28";
  return "#ff1f1f";
}

let _sliderId = 0;

function EquationSlider({
  label,
  value,
  min,
  max,
  step,
  leftText,
  rightText,
  thumbColor,
  onChange,
}) {
  const [uid] = useState(() => `hh-sl-${++_sliderId}`);
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div style={{ marginBottom: 36 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          marginBottom: 14,
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: 400,
            color: "#444",
            minWidth: 100,
          }}
        >
          {label}
        </div>

        <div
          style={{
            minWidth: 90,
            textAlign: "center",
            fontSize: 20,
            color: "#333",
            padding: "10px 16px",
            border: "1.5px solid #d9d9d9",
            borderRadius: 10,
            background: "#fff",
          }}
        >
          {value.toFixed(1)}
        </div>
      </div>

      <input
        type="range"
        id={uid}
        min={min}
        max={max}
        step={step}
        value={value}
        style={{
          "--tc": thumbColor,
          "--progress": `${percentage}%`,
          width: "100%",
          appearance: "none",
          WebkitAppearance: "none",
          background: "transparent",
          margin: 0,
          outline: "none",
          display: "block",
        }}
        onChange={(e) => onChange(Number(e.target.value))}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 6,
          fontSize: 14,
          color: "#999",
        }}
      >
        <span>{leftText}</span>
        <span>{rightText}</span>
      </div>

      <style>{`
        #${uid} {
          outline: none;
          -webkit-tap-highlight-color: transparent;
        }
        #${uid}:focus {
          outline: none;
        }
        #${uid}::-webkit-slider-runnable-track {
          height: 5px;
          border-radius: 999px;
          background: linear-gradient(
            to right,
            var(--tc, #73be28) 0%,
            var(--tc, #73be28) var(--progress),
            #d0d0d0 var(--progress),
            #d0d0d0 100%
          );
        }
        #${uid}::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--tc, #73be28);
          border: 3px solid #fff;
          margin-top: -11.5px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.20);
          cursor: pointer;
          outline: none;
        }
        #${uid}:focus::-webkit-slider-thumb {
          outline: none;
          box-shadow: 0 2px 8px rgba(0,0,0,0.20);
        }
        #${uid}::-moz-range-track {
          height: 5px;
          border-radius: 999px;
          background: #d0d0d0;
        }
        #${uid}::-moz-range-progress {
          height: 5px;
          border-radius: 999px;
          background: var(--tc, #73be28);
        }
        #${uid}::-moz-range-thumb {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--tc, #73be28);
          border: 3px solid #fff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.20);
          cursor: pointer;
          outline: none;
        }
        #${uid}:focus::-moz-range-thumb {
          outline: none;
          box-shadow: 0 2px 8px rgba(0,0,0,0.20);
        }
      `}</style>
    </div>
  );
}

function PhFormula() {
  return (
    <div
      style={{
        fontFamily: "Georgia, 'Times New Roman', serif",
        fontSize: 22,
        color: "#333",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        flexWrap: "wrap",
        margin: "16px 0 28px",
      }}
    >
      <span style={{ fontStyle: "italic" }}>pH</span>
      <span style={{ margin: "0 4px" }}>=</span>
      <span style={{ fontStyle: "italic" }}>pK</span>
      <sub style={{ fontStyle: "italic", fontSize: 14, marginLeft: -2 }}>a</sub>
      <span style={{ margin: "0 4px" }}>+</span>
      <span style={{ fontStyle: "italic", marginRight: 2 }}>log</span>
      <sub style={{ fontSize: 14, marginLeft: -2, marginRight: 4 }}>10</sub>
      <span style={{ fontSize: 26 }}>(</span>
      <span
        style={{
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "center",
          verticalAlign: "middle",
        }}
      >
        <span
          style={{
            fontStyle: "italic",
            borderBottom: "1.5px solid #333",
            paddingBottom: 3,
            paddingLeft: 4,
            paddingRight: 4,
          }}
        >
          HCO<sub style={{ fontSize: 13 }}>3</sub>
          <sup style={{ fontSize: 13 }}>−</sup>
        </span>
        <span style={{ fontStyle: "italic", paddingTop: 3 }}>
          H<sub style={{ fontSize: 13 }}>2</sub>CO
          <sub style={{ fontSize: 13 }}>3</sub>
        </span>
      </span>
      <span style={{ fontSize: 26 }}>)</span>
    </div>
  );
}

function OrganImage({ src, alt, width = 120, marginBottom = 24, marginTop = 0 }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop,
        marginBottom,
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width,
          height: "auto",
          objectFit: "contain",
          display: "block",
        }}
      />
    </div>
  );
}

export default function DynamicHHEquation() {
  const { unit } = usePressureUnit();

  const CO2_FACTOR = getCO2Factor(unit);
  const { min: PACO2_MIN, max: PACO2_MAX } = getPaco2Range(unit);
  const normalPaco2 = getNormalPaco2(unit);

  const [hco3, setHco3] = useState(24.0);
  const [paco2, setPaco2] = useState(() => getNormalPaco2(unit));
  const [previousUnit, setPreviousUnit] = useState(unit);

  useEffect(() => {
    if (previousUnit === unit) return;
    setHco3(24.0);
    setPaco2(getNormalPaco2(unit));
    setPreviousUnit(unit);
  }, [unit, previousUnit]);

  const ph = useMemo(() => {
    if (hco3 <= 0 || paco2 <= 0) return 0;
    return 6.1 + Math.log10(hco3 / (CO2_FACTOR * paco2));
  }, [hco3, paco2, CO2_FACTOR]);

  const displayedPh = ph > 0 ? round1(ph) : 0.0;

  const hco3Color = getHco3Color(hco3);
  const paco2Color = getPaco2Color(paco2, normalPaco2);

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
      <div style={{ padding: "28px 28px 0" }}>
        <PhFormula />

        <div
          style={{
            textAlign: "center",
            fontSize: 16,
            color: "#7a5a91",
            fontWeight: 600,
            marginBottom: 18,
          }}
        >
          Play
        </div>

        <OrganImage
          src={KIDNEY_IMAGE}
          alt="Kidneys"
          width={110}
          marginBottom={28}
        />

        <EquationSlider
          label={
            <>
              HCO<sub>3</sub>
              <sup>−</sup>
            </>
          }
          value={hco3}
          min={HCO3_MIN}
          max={HCO3_MAX}
          step={0.1}
          leftText="1.0"
          rightText="100.0"
          thumbColor={hco3Color}
          onChange={(val) => setHco3(round1(clamp(val, HCO3_MIN, HCO3_MAX)))}
        />

        <EquationSlider
          label={
            <>
              PaCO<sub>2</sub> ({unit})
            </>
          }
          value={paco2}
          min={PACO2_MIN}
          max={PACO2_MAX}
          step={0.1}
          leftText={PACO2_MIN.toFixed(1)}
          rightText={PACO2_MAX.toFixed(1)}
          thumbColor={paco2Color}
          onChange={(val) => setPaco2(round1(clamp(val, PACO2_MIN, PACO2_MAX)))}
        />

        <OrganImage
          src={LUNG_IMAGE}
          alt="Lungs"
          width={110}
          marginTop={6}
          marginBottom={28}
        />

        <div
          style={{
            textAlign: "center",
            background: "#faf8fc",
            border: "1px solid #ece6f6",
            borderRadius: 14,
            padding: "16px 20px",
            marginTop: 8,
          }}
        >
          <div
            style={{
              fontSize: 13,
              color: "#7a5a91",
              marginBottom: 6,
              fontWeight: 600,
              letterSpacing: 0.3,
            }}
          >
            Calculated pH
          </div>
          <div style={{ fontSize: 34, color: "#1a1a2e", fontWeight: 500 }}>
            {displayedPh.toFixed(1)}
          </div>
          <div style={{ fontSize: 12, color: "#aaa", marginTop: 6 }}>
            pH = 6.1 + log₁₀(HCO₃⁻ / ({CO2_FACTOR} × PaCO₂))
          </div>
        </div>
      </div>
    </div>
  );
}