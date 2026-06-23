import React, { useState, useEffect } from "react";
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

const H_MIN = 14;
const H_MAX = 158;
const NORMAL_PH = 7.4;

export default function UnderstandingPH() {
  const { unit } = usePressureUnit();
  const [ph, setPh] = useState(NORMAL_PH);
  const h = Math.round(phToH(ph));
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 480);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 480);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handlePhChange = (newPh) => setPh(newPh);
  const handleHChange = (newH) => setPh(hToPh(newH));

  const colourchangeph = () => {
    if (ph === 7.4) {
      return "#4caf50";
    } else if (ph > 7.4) {
      return "#155bc4ff";
    } else if (ph < 7.4) {
      return "#da1c1cff";
    }
  };

  const colourchangeH = () => {
    if (h === 40) {
      return "#4caf50";
    } else if (h < 40) {
      return "#155bc4ff";
    } else if (h > 40) {
      return "#c41515ff";
    }
  };

  const curvePoints = [];
  for (let pt = PH_MIN; pt <= PH_MAX; pt += 0.02) {
    const hVal = phToH(pt);
    if (hVal >= H_MIN && hVal <= H_MAX + 20) {
      curvePoints.push(`${mapX(pt)},${mapY(hVal)}`);
    }
  }

  const isNormal = ph >= 7.35 && ph <= 7.45;
  const dotColor = ph === 7.4 ? "#4caf50" : ph > 7.4 ? "#155bc4ff" : "#da1c1cff";

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        background: "#fff",
        // Lock to viewport — no scroll
        height: isMobile ? "auto" : "100dvh",
        minHeight: isMobile ? "100dvh" : "auto",
        maxHeight: isMobile ? "none" : "100dvh",
        display: "flex",
        flexDirection: "column",
        padding: "10px 16px 8px",
        boxSizing: "border-box",
        overflow: isMobile ? "auto" : "hidden",
        position: "relative",
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 8,
          flexShrink: 0,
        }}
      >
        <div
          onClick={() => {
            window.location.href =
              "https://abg.leadows.com/understanding-ph-info/";
          }}
          style={{
            cursor: "pointer",
            padding: 4,
          }}
        >
          <InfoOutlinedIcon style={{ fontSize: 22, color: "#6b4fa0" }} />
        </div>
      </div>

      {/* ── Sliders ── */}
      <div
        style={{
          flexShrink: 0,
          width: "100%",
          maxWidth: 900,
          margin: "0 auto",
        }}
      >
        <Slider
          label={
            <>
              H<sup>+</sup>
            </>
          }
          value={h}
          min={H_MIN}
          max={H_MAX}
          step={1}
          decimals={0}
          thumbColor={colourchangeH()}
          rightLabel={
            <>
              {H_MAX}
              <br />
              nMol
            </>
          }
          onChange={handleHChange}
        />
        <Slider
          label="pH"
          value={parseFloat(ph.toFixed(2))}
          min={6.8}
          max={7.85}
          step={0.01}
          decimals={2}
          thumbColor={colourchangeph()}
          onChange={handlePhChange}
        />
      </div>

      {/* ── Formula ── */}
      <div
        style={{
          textAlign: "center",
          margin: "6px 0 4px",
          fontSize: 16,
          color: "#333",
          fontWeight: 500,
          flexShrink: 0,
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

      {/* ── Status label ── */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 6,
          fontSize: 16,
          color: isNormal ? "#4caf50" : ph < 7.35 ? "#ff1744" : "#2196f3",
          fontWeight: 500,
          flexShrink: 0,
        }}
      >
        {isNormal
          ? `Normal — pH ${ph.toFixed(2)}, H⁺ ${h} nmol/L`
          : ph < 7.35
            ? `Acidosis — pH ${ph.toFixed(2)}, H⁺ ${h} nmol/L`
            : `Alkalosis — pH ${ph.toFixed(2)}, H⁺ ${h} nmol/L`}
      </div>

      {/* ── Chart — fills remaining space ── */}
      <div
        style={{
          flex: isMobile ? "none" : 1,
          minHeight: 0, // critical: lets flex child shrink
          position: "relative",
          marginTop: isMobile ? 70 : 0,
          marginBottom: isMobile ? 60 : 0,
          paddingLeft: isMobile ? 42 : 56, // give enough room for the Y-axis labels
          paddingBottom: isMobile ? 36 : 44, // give enough room for the X-axis labels
          paddingRight: isMobile ? 6 : 20, // right space for curve
          paddingTop: isMobile ? 6 : 20, // top space
          boxSizing: "border-box",
        }}
      >
        {/* X-axis label */}
        <div
          style={{
            position: "absolute",
            bottom: 4,
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 11,
            fontWeight: 600,
            color: "#666",
            pointerEvents: "none",
          }}
        >
          pH
        </div>

        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          preserveAspectRatio="xMidYMid meet"
          style={{
            display: "block",
            width: "100%",
            height: isMobile ? "auto" : "100%",
            overflow: "visible",
          }}
        >
          {/* Y-axis label — inside SVG, snug beside tick numbers */}
          <text
            x="-60"
            y={SVG_H / 2}
            fontSize="26"
            fill="#444"
            fontWeight="700"
            textAnchor="middle"
            transform={`rotate(-90, -60, ${SVG_H / 2})`}
            fontFamily="'Segoe UI', system-ui, sans-serif"
          >
            H⁺ (nmol/L)
          </text>

          {/* Main pH Axis */}
          <line
            x1="0"
            y1={SVG_H}
            x2={mapX(7.4)}
            y2={SVG_H}
            stroke="#b71c1c"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <line
            x1={mapX(7.4)}
            y1={SVG_H}
            x2={SVG_W}
            y2={SVG_H}
            stroke="#0d47a1"
            strokeWidth="4"
            strokeLinecap="round"
          />

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
                y={mapY(val) + 6}
                fontSize="24"
                fontWeight="600"
                fill="#333"
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
                y={SVG_H + 26}
                fontSize="24"
                fontWeight="600"
                fill="#333"
                textAnchor="middle"
              >
                {val.toFixed(1)}
              </text>
            </g>
          ))}

          {/* Normal range shading */}
          <rect
            x={mapX(7.35)}
            y={0}
            width={mapX(7.45) - mapX(7.35)}
            height={SVG_H}
            fill="#4caf50"
            opacity="0.06"
          />

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

          {/* Normal range dashed markers */}
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

          {/* Active dot */}
          <circle
            cx={mapX(ph)}
            cy={mapY(h)}
            r="13"
            fill={dotColor}
            style={{ transition: "cx 0.1s linear, cy 0.1s linear" }}
          />
        </svg>
      </div>

      {/* ── Footer note ── */}
      <div
        style={{
          textAlign: "center",
          fontSize: 15,
          color: "#7e7e7eff",
          marginTop: 4,
          flexShrink: 0,
        }}
      >
        Normal range: pH 7.35–7.45 · H⁺ 35–45 nmol/L
      </div>
    </div>
  );
}
