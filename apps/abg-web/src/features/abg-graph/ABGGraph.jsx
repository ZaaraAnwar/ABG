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

// Y-axis is always mmHg (0-160) regardless of unit
// The slider display changes with unit, but the graph scale never changes
const Y_TICKS = [0, 30, 60, 90, 120, 150];

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
  if (Math.abs(value - NORMAL_PH) < 0.005) return "#7cb342"; // green
  if (value > NORMAL_PH) return "#2196f3"; // blue
  return "#ff1744"; // red
}

function getPaco2ThumbColor(value, normalPaco2) {
  if (Math.abs(value - normalPaco2) < 0.05) return "#7cb342"; // green
  if (value < normalPaco2) return "#2196f3"; // blue
  return "#ff1744"; // red
}

let sliderId = 0;

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
  const containerRef = useRef(null);
  const isDragging = useRef(false);

  const getValueFromX = (clientX) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const THUMB_R = 14;
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
    const H = 28;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    const THUMB_R = 14;
    const trackLeft = THUMB_R;
    const trackRight = W - THUMB_R;
    const trackY = H / 2;
    const ratio = (value - min) / (max - min);
    const thumbX = trackLeft + ratio * (trackRight - trackLeft);

    // Track background
    ctx.beginPath();
    ctx.roundRect(trackLeft, trackY - 2.5, trackRight - trackLeft, 5, 999);
    ctx.fillStyle = "#d0d0d0";
    ctx.fill();

    // Filled portion
    ctx.beginPath();
    ctx.roundRect(trackLeft, trackY - 2.5, thumbX - trackLeft, 5, 999);
    ctx.fillStyle = thumbColor;
    ctx.fill();

    // Thumb
    ctx.beginPath();
    ctx.arc(thumbX, trackY, THUMB_R, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(thumbX, trackY, THUMB_R - 3, 0, Math.PI * 2);
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
    <div style={{ marginBottom: 28 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
          gap: 16,
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 500, color: "#333" }}>
          {label}
        </div>
        <div
          style={{
            minWidth: 88,
            textAlign: "center",
            fontSize: 16,
            color: "#333",
            padding: "10px 14px",
            border: "1.5px solid #d9d9d9",
            borderRadius: 10,
            background: "#fff",
          }}
        >
          {value.toFixed(decimals)}
        </div>
      </div>

      <div
        ref={containerRef}
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
            height: 28,
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

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 6,
          fontSize: 14,
          color: "#777",
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

  // Reset sliders when unit changes
  useEffect(() => {
    if (previousUnit === unit) return;
    setPaco2(getNormalPaco2(unit));
    setPh(NORMAL_PH);
    setPreviousUnit(unit);
  }, [unit, previousUnit]);

  // interpret() needs mmHg for correct diagnosis — convert only here
  const paco2ForDiagnosis = unit === "kPa" ? kpaToMmhg(paco2) : paco2;

  // Red dot always plots the raw value the user set (no conversion)
  // 9.0 kPa → dot at Y=9.0 on the mmHg-scaled axis (0–160)
  const paco2ForPlot = paco2;

  const title = useMemo(
    () => interpret(ph, paco2ForDiagnosis),
    [ph, paco2ForDiagnosis],
  );
  const regions = useMemo(() => buildRegions(), []);

  const paco2ThumbColor = getPaco2ThumbColor(paco2, normalPaco2);
  const phThumbColor = getPhThumbColor(ph);

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
      <div
        style={{
          textAlign: "center",
          fontSize: 22,
          fontWeight: 700,
          color: "#6b4fa0",
          marginBottom: 24,
        }}
      >
        ABG Graph
      </div>
      {/* Info Icon */}
      <div
        onClick={() => {
          window.location.href = "https://abg.leadows.com/abg-graph-info/";
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

      {/* PaCO2 slider — range and display change with unit, graph always mmHg */}
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

      {/* pH slider — unit-independent */}
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

      {/* Diagnosis label */}
      <div
        style={{
          textAlign: "center",
          fontSize: 18,
          fontWeight: 500,
          color: "#333",
          margin: "20px 0",
          lineHeight: 1.4,
          minHeight: 54,
        }}
      >
        {title.split("\n").map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>

      {/* Chart */}
      <div
        style={{
          background: "#fff",
          position: "relative",
          padding: "10px 10px 40px 40px",
        }}
      >
        {/* Y-axis label — always mmHg */}
        <div
          style={{
            position: "absolute",
            left: -40,
            top: "50%",
            transform: "translateY(-50%) rotate(-90deg)",
            fontSize: 14,
            fontWeight: 600,
            color: "#666",
          }}
        >
          PaCO₂ (mmHg)
        </div>

        {/* X-axis label */}
        <div
          style={{
            position: "absolute",
            bottom: 12,
            left: "50%",
            transform: "translateX(-50%)",
            width: "max-content",
            fontSize: 14,
            fontWeight: 600,
            color: "#666",
            pointerEvents: "none",
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
          {/* Y-axis grid — always mmHg scale */}
          {Y_TICKS.map((val) => (
            <g key={`gy-${val}`}>
              <line
                x1="0"
                x2={SVG_W}
                y1={mapY(val)}
                y2={mapY(val)}
                stroke="#eee"
                strokeWidth="1"
              />
              <text
                x="-12"
                y={mapY(val) + 5}
                fontSize="16"
                fill="#888"
                textAnchor="end"
              >
                {val}
              </text>
            </g>
          ))}

          {/* X-axis grid — pH is always the same */}
          {[6.8, 7.0, 7.2, 7.4, 7.6, 7.8].map((val) => (
            <g key={`gx-${val}`}>
              <line
                x1={mapX(val)}
                x2={mapX(val)}
                y1="0"
                y2={SVG_H}
                stroke="#eee"
                strokeWidth="1"
              />
              <text
                x={mapX(val)}
                y={SVG_H + 24}
                fontSize="16"
                fill="#888"
                textAnchor="middle"
              >
                {val.toFixed(1)}
              </text>
            </g>
          ))}

          {/* Regions — already in mmHg, plot directly */}
          {regions.map((r, i) => (
            <g key={`region-${i}`} fill={r.color} opacity="0.8">
              {r.points.map((pt, j) =>
                pt.ph >= PH_MIN &&
                pt.ph <= PH_MAX &&
                pt.pco2 >= 0 &&
                pt.pco2 <= 160 ? (
                  <circle key={j} cx={mapX(pt.ph)} cy={mapY(pt.pco2)} r="6" />
                ) : null,
              )}
            </g>
          ))}

          {/* Red dot — raw value in user's chosen unit, no conversion */}
          <circle
            cx={mapX(ph)}
            cy={mapY(paco2ForPlot)}
            r="9"
            fill="#ff1744"
            style={{
              transition: "cx 0.1s linear, cy 0.1s linear",
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
            }}
          />
        </svg>
      </div>

      {/* Legend */}
      <div
        style={{
          marginTop: 32,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "8px 12px",
          fontSize: 11,
          color: "#555",
        }}
      >
        {[
          { color: "#81afd4", label: "Normal" },
          { color: "#d6a6a1", label: "Metabolic Acidosis" },
          { color: "#bad098", label: "Metabolic Alkalosis" },
          { color: "#aba0c5", label: "Acute Resp. Acidosis" },
          { color: "#88bacd", label: "Chronic Resp. Acidosis" },
          { color: "#f2ccaa", label: "Acute Resp. Alkalosis" },
          { color: "#9aaeb9", label: "Chronic Resp. Alkalosis" },
          { color: "#ff1744", label: "Selected value" },
        ].map(({ color, label }) => (
          <div
            key={label}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 2,
                background: color,
              }}
            />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
