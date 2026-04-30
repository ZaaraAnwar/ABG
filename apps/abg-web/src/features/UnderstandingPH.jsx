import React, { useState } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Slider from "../components/Slider";
import { usePressureUnit } from "../context/PressureUnitContext";
import {
  phToH,
  hToPh,
  SVG_W,
  SVG_H,
  PH_MIN,
  PH_MAX,
  mapX,
  mapY,
} from "../utils/abgMath";

// Medical reference ranges
// Normal pH: 7.35–7.45 (midpoint 7.40)
// Normal H+: 35–45 nmol/L (at pH 7.35–7.45)
// Survivable pH: ~6.8–7.85 → H+: ~14–158 nmol/L
const H_MIN = 14;
const H_MAX = 158;
const NORMAL_PH = 7.4;

export default function UnderstandingPH() {
  const { unit } = usePressureUnit(); // consumed for global consistency, doesn't affect H+/pH
  const [ph, setPh] = useState(NORMAL_PH);
  const h = phToH(ph); // always derived — never stored separately

  const handlePhChange = (newPh) => setPh(newPh);
  const handleHChange = (newH) => setPh(hToPh(newH));

  // Curve: H+ = 10^(9 - pH) expressed in nmol/L
  const curvePoints = [];
  for (let pt = PH_MIN; pt <= PH_MAX; pt += 0.02) {
    const hVal = phToH(pt);
    if (hVal >= H_MIN && hVal <= H_MAX + 20) {
      curvePoints.push(`${mapX(pt)},${mapY(hVal)}`);
    }
  }

  // Color the dot: green if normal, red if abnormal
  const isNormal = ph >= 7.35 && ph <= 7.45;
  const dotColor = isNormal ? "#4caf50" : "#ff1744";

  return (
    <div
      style={{
        position: "relative",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        background: "#fff",
        padding: "24px",
        width: "100%",
        maxWidth: "100%",
        margin: 0,
        boxSizing: "border-box",
      }}
    >
      <div
        onClick={() => {
          window.location.href =
            "https://abg.leadows.com/understanding-ph-info/";
        }}
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          cursor: "pointer",
          zIndex: 10,
        }}
      >
        <InfoOutlinedIcon
          style={{
            fontSize: 26,
            color: "#6b4fa0",
          }}
        />
      </div>

      {/* <div
        style={{
          textAlign: "center",
          fontSize: 20,
          fontWeight: 700,
          color: "#6b4fa0",
          marginBottom: 30,
        }}
      >
        Understanding pH
      </div> */}

      {/* H+ Slider */}
      <Slider
        label={
          <>
            H<sup>+</sup>
          </>
        }
        value={parseFloat(h.toFixed(1))}
        min={H_MIN}
        max={H_MAX}
        step={0.5}
        decimals={1}
        thumbColor="#4caf50"
        rightLabel={
          <>
            {H_MAX.toFixed(1)}
            <br />
            nMol
          </>
        }
        onChange={handleHChange}
      />

      {/* pH Slider */}
      <Slider
        label="pH"
        value={parseFloat(ph.toFixed(2))}
        min={6.8}
        max={7.85}
        step={0.01}
        decimals={2}
        thumbColor="#4caf50"
        onChange={handlePhChange}
      />

      {/* Formula */}
      <div
        style={{
          textAlign: "center",
          margin: "28px 0 24px",
          fontSize: 18,
          color: "#333",
          fontWeight: 500,
        }}
      >
        pH = log{" "}
        <span
          style={{
            display: "inline-block",
            textAlign: "center",
            verticalAlign: "middle",
            lineHeight: 1.2,
          }}
        >
          <span
            style={{
              display: "block",
              borderBottom: "1.5px solid #333",
              paddingBottom: 2,
            }}
          >
            1
          </span>
          <span style={{ display: "block", paddingTop: 2 }}>
            H<sup>+</sup>
          </span>
        </span>
      </div>

      {/* Normal range indicator */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 20,
          fontSize: 13,
          color: isNormal ? "#4caf50" : "#ff1744",
          fontWeight: 500,
        }}
      >
        {isNormal
          ? `Normal — pH ${ph.toFixed(2)}, H⁺ ${h.toFixed(1)} nmol/L`
          : ph < 7.35
            ? `Acidosis — pH ${ph.toFixed(2)}, H⁺ ${h.toFixed(1)} nmol/L`
            : `Alkalosis — pH ${ph.toFixed(2)}, H⁺ ${h.toFixed(1)} nmol/L`}
      </div>

      {/* Chart */}
      <div
        style={{
          background: "#fff",
          position: "relative",
          padding: "10px 10px 48px 44px",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: -40,
            top: "45%",
            transform: "translateY(-50%) rotate(-90deg)",
            fontSize: 14,
            fontWeight: 600,
            color: "#666",
            whiteSpace: "nowrap",
          }}
        >
          H⁺ (nmol/L)
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 4,
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 14,
            fontWeight: 600,
            color: "#666",
          }}
        >
          pH
        </div>

        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          style={{
            display: "block",
            width: "100%",
            height: "auto",
            overflow: "visible",
          }}
        >
          {/* Y grid */}
          {[0, 20, 40, 60, 80, 100, 120, 140, 160].map((val) => (
            <g key={`gy-${val}`}>
              <line
                x1="0"
                x2={SVG_W}
                y1={mapY(val)}
                y2={mapY(val)}
                stroke="#ddd"
                strokeWidth="1.5"
              />
              <text
                x="-10"
                y={mapY(val) + 5}
                fontSize="14"
                fill="#888"
                textAnchor="end"
              >
                {val}
              </text>
            </g>
          ))}

          {/* X grid */}
          {[6.8, 7.0, 7.2, 7.4, 7.6, 7.8].map((val) => (
            <g key={`gx-${val}`}>
              <line
                x1={mapX(val)}
                x2={mapX(val)}
                y1="0"
                y2={SVG_H}
                stroke="#ccc"
                strokeWidth="1.5"
              />
              <text
                x={mapX(val)}
                y={SVG_H + 22}
                fontSize="14"
                fill="#888"
                textAnchor="middle"
              >
                {val.toFixed(1)}
              </text>
            </g>
          ))}

          {/* Normal range shading: pH 7.35–7.45 */}
          <rect
            x={mapX(7.35)}
            y={0}
            width={mapX(7.45) - mapX(7.35)}
            height={SVG_H}
            fill="#4caf50"
            opacity="0.06"
          />

          {/* Curve */}
          {/* Curve */}
          <polyline
            points={curvePoints.join(" ")}
            fill="none"
            stroke="#6b4fa0"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.85"
          />

          {/* Normal range vertical markers */}
          <line
            x1={mapX(7.35)}
            x2={mapX(7.35)}
            y1="0"
            y2={SVG_H}
            stroke="#4caf50"
            strokeWidth="1"
            strokeDasharray="4,3"
            opacity="0.4"
          />
          <line
            x1={mapX(7.45)}
            x2={mapX(7.45)}
            y1="0"
            y2={SVG_H}
            stroke="#4caf50"
            strokeWidth="1"
            strokeDasharray="4,3"
            opacity="0.4"
          />

          {/* Current point */}
          <circle
            cx={mapX(ph)}
            cy={mapY(h)}
            r="10"
            fill={dotColor}
            style={{ transition: "cx 0.1s linear, cy 0.1s linear" }}
          />
        </svg>
      </div>

      <div
        style={{
          textAlign: "center",
          fontSize: 11,
          color: "#bbb",
          marginTop: 8,
        }}
      >
        Normal range: pH 7.35–7.45 · H⁺ 35–45 nmol/L
      </div>
    </div>
  );
}