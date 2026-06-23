import React, { useEffect, useMemo, useRef, useState } from "react";
import { usePressureUnit } from "../../context/PressureUnitContext";
import {
  getNormalPaco2,
  getPaco2Range,
  kpaToMmhg,
} from "../../utils/pressureUnit";
import {
  SVG_W,
  SVG_H,
  mapX,
  mapY,
  interpret,
  buildRegions,
} from "../../utils/abgMath";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const PH_MIN = 6.8;
const PH_MAX = 7.85;
const NORMAL_PH = 7.4;

const MMHG_PER_KPA = 7.50062;
const Y_TICKS_MMHG = [0, 30, 60, 90, 120, 150];
const Y_TICKS_KPA = [0, 4, 8, 12, 16, 20];

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
function round1(value) {
  return Math.round(value * 10) / 10;
}
function round2(value) {
  return Math.round(value * 100) / 100;
}
function getPhThumbColor(value) {
  if (Math.abs(value - NORMAL_PH) < 0.005) return "#7cb342";
  if (value > NORMAL_PH) return "#2196f3";
  return "#ff1744";
}
function getPaco2ThumbColor(value, normalPaco2, unit) {
  if (unit === "kPa") {
    if (value >= 1.0) return "#ff1744";
    return "#2196f3";
  }
  if (Math.abs(value - normalPaco2) < 0.05) return "#7cb342";
  if (value < normalPaco2) return "#2196f3";
  return "#ff1744";
}

function ScaleSlider({
  label,
  value,
  min,
  max,
  step,
  decimals,
  thumbColor,
  onChange,
  leftLabel,
  rightLabel,
}) {
  const canvasRef = useRef(null);
  const isDragging = useRef(false);

  const getValueFromX = (clientX) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const THUMB_R = 11;
    const trackLeft = THUMB_R;
    const trackRight = rect.width - THUMB_R;
    const ratio = Math.max(
      0,
      Math.min(1, (clientX - rect.left - trackLeft) / (trackRight - trackLeft)),
    );
    const raw = min + ratio * (max - min);
    const stepped = Math.round(raw / step) * step;
    return Math.min(max, Math.max(min, stepped));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth;
    const H = 22;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    const THUMB_R = 11;
    const trackLeft = THUMB_R;
    const trackRight = W - THUMB_R;
    const trackY = H / 2;
    const ratio = (value - min) / (max - min);
    const thumbX = trackLeft + ratio * (trackRight - trackLeft);

    ctx.beginPath();
    ctx.roundRect(trackLeft, trackY - 2, trackRight - trackLeft, 4, 999);
    ctx.fillStyle = "#d0d0d0";
    ctx.fill();

    ctx.beginPath();
    ctx.roundRect(trackLeft, trackY - 2, thumbX - trackLeft, 4, 999);
    ctx.fillStyle = thumbColor;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(thumbX, trackY, THUMB_R, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(thumbX, trackY, THUMB_R - 2.5, 0, Math.PI * 2);
    ctx.fillStyle = thumbColor;
    ctx.fill();
  }, [value, min, max, thumbColor]);

  const handlePointer = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    onChange(getValueFromX(clientX));
  };
 
  
  return (
    <div style={{ marginBottom: 10 }}>
      {/* Label + Value row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 6,
          gap: 12,
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 500, color: "#333" }}>
          {label}
        </div>
        <div
          style={{
            minWidth: 70,
            textAlign: "center",
            fontSize: 13,
            color: "#333",
            padding: "5px 10px",
            border: "1.5px solid #d9d9d9",
            borderRadius: 8,
            background: "#fff",
          }}
        >
          {value.toFixed(decimals)}
        </div>
      </div>

      {/* Track */}
      <div
        style={{
          position: "relative",
          userSelect: "none",
          touchAction: "none",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            width: "100%",
            height: 22,
            display: "block",
            cursor: "pointer",
          }}
          onMouseDown={(e) => {
            isDragging.current = true;
            onChange(getValueFromX(e.clientX));
          }}
          onMouseMove={handlePointer}
          onMouseUp={() => {
            isDragging.current = false;
          }}
          onMouseLeave={() => {
            isDragging.current = false;
          }}
          onTouchStart={(e) => {
            isDragging.current = true;
            onChange(getValueFromX(e.touches[0].clientX));
          }}
          onTouchMove={handlePointer}
          onTouchEnd={() => {
            isDragging.current = false;
          }}
        />
      </div>

      {/* Min / Max labels */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 3,
          fontSize: 11,
          color: "#999",
        }}
      >
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  );
}

export default function ABGGraph() {
  const { unit } = usePressureUnit();
  const { min: paco2Min, max: paco2Max } = getPaco2Range(unit);
  const normalPaco2 = getNormalPaco2(unit);

  const [paco2, setPaco2] = useState(() => getNormalPaco2(unit));
  const [ph, setPh] = useState(NORMAL_PH);
  const [previousUnit, setPreviousUnit] = useState(unit);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (previousUnit === unit) return;
    setPaco2(getNormalPaco2(unit));
    setPh(NORMAL_PH);
    setPreviousUnit(unit);
  }, [unit, previousUnit]);

  const paco2ForDiagnosis = unit === "kPa" ? kpaToMmhg(paco2) : paco2;
  const paco2ForPlot = paco2;
  const isKpa = unit === "kPa";

  const yTicks = Y_TICKS_MMHG;

  const displayY = (mmHgValue) =>
    isKpa ? mmHgValue / MMHG_PER_KPA : mmHgValue;

  const mapDisplayY = (displayValue) => {
    const mmHgValue = isKpa ? displayValue * MMHG_PER_KPA : displayValue;
    return mapY(mmHgValue);
  };
  const title = useMemo(
    () => (paco2 === 0 ? "" : interpret(ph, paco2ForDiagnosis)),
    [ph, paco2ForDiagnosis, paco2],
  );
  const regions = useMemo(() => buildRegions(), []);

  const paco2ThumbColor = getPaco2ThumbColor(paco2, normalPaco2, unit);
  const phThumbColor = getPhThumbColor(ph);

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        background: "#fff",
        height: isMobile ? "auto" : "100vh",
        minHeight: isMobile ? "100vh" : "auto",
        maxHeight: isMobile ? "none" : "100vh",
        overflow: isMobile ? "auto" : "hidden",
        display: "flex",
        flexDirection: "column",
        padding: isMobile ? "0px 2px" : "10px 16px 8px", // completely remove top/bottom padding on mobile/tab
        boxSizing: "border-box",
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
            window.location.href = "https://abg.leadows.com/abg-graph-info/";
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
      <div style={{ flexShrink: 0 }}>
        <ScaleSlider
          label={
            <>
              PaCO<sub>2</sub> ({unit})
            </>
          }
          value={paco2}
          min={paco2Min}
          max={paco2Max}
          step={unit === "kPa" ? 0.1 : 1}
          decimals={unit === "kPa" ? 1 : 0}
          thumbColor={paco2ThumbColor}
          onChange={(val) => setPaco2(round1(clamp(val, paco2Min, paco2Max)))}
          leftLabel={paco2Min.toFixed(1)}
          rightLabel={paco2Max.toFixed(1)}
        />
        <ScaleSlider
          label="pH"
          value={ph}
          min={PH_MIN}
          max={PH_MAX}
          step={0.01}
          decimals={2}
          thumbColor={phThumbColor}
          onChange={(val) => setPh(round2(clamp(val, PH_MIN, PH_MAX)))}
          leftLabel={PH_MIN.toFixed(1)}
          rightLabel={PH_MAX.toFixed(2)}
        />
      </div>

      {/* ── Diagnosis label ── */}
      <div
        style={{
          textAlign: "center",
          fontSize: 14,
          fontWeight: 600,
          color: "#333",
          margin: isMobile ? "0" : "4px 0 6px",
          lineHeight: 1.35,
          minHeight: isMobile ? 22 : 36,
          flexShrink: 0,
        }}
      >
        {title.split("\n").map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>

      {/* ── Chart — grows to fill remaining space ── */}
      <div
        style={{
          flex: isMobile ? "none" : 1,
          minHeight: 0,
          position: "relative",
          marginTop: isMobile ? 70 : 0,
          marginBottom: isMobile ? 35 : 0,
          paddingLeft: isMobile ? 36 : 56, // smaller left padding
          paddingBottom: isMobile ? 24 : 44, // reduced bottom space
          paddingRight: isMobile ? 4 : 20, // smaller right padding for complete width
          paddingTop: isMobile ? 0 : 20, // removed top space
          boxSizing: "border-box",
        }}
      >

        {/* SVG fills 100% of the flex child */}
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
          {/* Main Axes */}
            <line
            x1="0"
            y1={SVG_H}
            x2={mapX(7.4)}
            y2={SVG_H}
            stroke="#b71c1c" // red = acidic
            strokeWidth="4"
            strokeLinecap="round"
          />
 
          <line
            x1={mapX(7.4)}
            y1={SVG_H}
            x2={SVG_W + 20}
            y2={SVG_H}
            stroke="#0d47a1" // blue = alkaline
            strokeWidth="4"
            strokeLinecap="round"
          />
          <line
            x1="0"
            y1={SVG_H}
            x2={SVG_W + 20}
            y2={SVG_H}
            stroke="#222"
            strokeWidth="1.5"
          />
          <line x1="0" y1={SVG_H} x2={SVG_W + 20} y2={SVG_H} stroke="#222" strokeWidth="1.5" />

          {/* Y-axis label */}
          <text
            x="-46"
            y={SVG_H / 2}
            fontSize={isMobile ? "28" : "20"}
            fill="#000"
            fontWeight={isMobile ? "600" : "400"}
            textAnchor="middle"
            transform={`rotate(-90, -46, ${SVG_H / 2})`}
            fontFamily="'Segoe UI', system-ui, sans-serif"
          >
            {`PaCO₂`}
          </text>

          {/* X-axis label */}
          <text
            x={SVG_W + 20}
            y={SVG_H + 34}
            fontSize={isMobile ? "28" : "20"}
            fill="#000"
            fontWeight={isMobile ? "600" : "400"}
            textAnchor="end"
            fontFamily="'Segoe UI', system-ui, sans-serif"
          >
            pH
          </text>
          {/* Y-axis grid */}
          {yTicks.map((val) => (
            <g key={`gy-${val}`}>
              <line
                x1="0"
                x2={SVG_W}
                y1={mapY(val)}
                y2={mapY(val)}
                stroke="#b0b0b0"
                strokeWidth="1"
              />
              <text
                x="-12"
                y={mapY(val) + (isMobile ? 6 : 5)}
                fontSize={isMobile ? "24" : "16"}
                fill={isMobile ? "#222" : "#000"}
                fontWeight={isMobile ? "600" : "400"}
                textAnchor="end"
              >
                {val}
              </text>
            </g>
          ))}

          {/* X-axis grid */}
          {[6.8, 7.0, 7.2, 7.4, 7.6, 7.8].map((val) => (
            <g key={`gx-${val}`}>
              <line
                x1={mapX(val)}
                x2={mapX(val)}
                y1="0"
                y2={SVG_H}
                stroke="#b0b0b0"
                strokeWidth="1"
              />
              <text
                x={mapX(val)}
                y={SVG_H + (isMobile ? 26 : 22)}
                fontSize={isMobile ? "24" : "16"}
                fill={isMobile ? "#222" : "#000"}
                fontWeight={isMobile ? "600" : "400"}
                textAnchor="middle"
              >
                {val.toFixed(1)}
              </text>
            </g>
          ))}

          {/* Regions */}
          {regions.map((r, i) => (
            <g key={`region-${i}`} fill={r.color} opacity="1">
              {r.points.map((pt, j) =>
                pt.ph >= PH_MIN &&
                pt.ph <= PH_MAX &&
                pt.pco2 >= 0 &&
                pt.pco2 <= 160 ? (
                  <circle key={j} cx={mapX(pt.ph)} cy={mapY(pt.pco2)} r="7" />
                ) : null,
              )}
            </g>
          ))}

          {/* Red dot */}
          <circle
            cx={mapX(ph)}
            cy={mapY(paco2ForPlot)}
            r={isMobile ? "12" : "8"}
            fill="#e11c2a"
            style={{
              transition: "cx 0.1s linear, cy 0.1s linear",
            }}
          />
        </svg>
      </div>

      {/* ── Legend ── */}
      <div
        style={{
          flexShrink: 0,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: isMobile ? "4px 8px" : "8px 16px",
          fontSize: isMobile ? 10 : 13,
          fontWeight: 600,
          color: "#444",
          paddingTop: isMobile ? 4 : 10,
          paddingBottom: isMobile ? 2 : 6,
          borderTop: "1px solid #f0f0f0",
        }}
      >
        {[
          { color: "#81afd4", label: "Normal" },
          { color: "#d6a6a1", label: "Metabolic Acidosis" },
          { color: "#bad098", label: "Metabolic Alkalosis" },
          { color: "#aba0c5", label: "Acute Respiratory Acidosis" },
          { color: "#88bacd", label: "Chronic Respiratory Acidosis" },
          { color: "#f2ccaa", label: "Acute Respiratory Alkalosis" },
          { color: "#9aaeb9", label: "Chronic Respiratory Alkalosis" },
          { color: "#ff1744", label: "Selected value" },
        ].map(({ color, label }) => (
          <div
            key={label}
            style={{ display: "flex", alignItems: "center", gap: 5 }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                background: color,
                flexShrink: 0,
              }}
            />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
