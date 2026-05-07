import React, { useState, useRef, useEffect } from "react";
import { usePressureUnit } from "../context/PressureUnitContext";
import { getNormalPaco2 } from "../utils/pressureUnit";

const KIDNEY_IMAGE_URL =
  "https://abg.leadows.com/wp-content/uploads/2026/04/ChatGPT-Image-Apr-23-2026-12_50_29-PM.png";

// Steps for mmHg: label and paco2 are the same (mmHg values)
const SLIDER_STEPS_MMHG = [
  { step: 10, paco2: 100, label: "100" },
  { step: 9,  paco2: 90,  label: "90"  },
  { step: 8,  paco2: 80,  label: "80"  },
  { step: 7,  paco2: 70,  label: "70"  },
  { step: 6,  paco2: 60,  label: "60"  },
  { step: 5,  paco2: 50,  label: "50"  },
  { step: 4,  paco2: 40,  label: "40"  },
  { step: 3,  paco2: 30,  label: "30"  },
  { step: 2,  paco2: 20,  label: "20"  },
  { step: 1,  paco2: 10,  label: "10"  },
];

// Steps for kPa: label is kPa value, paco2 stored in kPa
const SLIDER_STEPS_KPA = [
  { step: 10, paco2: 13.3, label: "13" },
  { step: 9,  paco2: 12.0, label: "12" },
  { step: 8,  paco2: 10.7, label: "11" },
  { step: 7,  paco2: 9.3,  label: "9"  },
  { step: 6,  paco2: 8.0,  label: "8"  },
  { step: 5,  paco2: 6.7,  label: "7"  },
  { step: 4,  paco2: 5.3,  label: "5"  },
  { step: 3,  paco2: 4.0,  label: "4"  },
  { step: 2,  paco2: 2.7,  label: "3"  },
  { step: 1,  paco2: 2.0,  label: "1"  },
];

const BASE_HCO3 = 24;

// Compensation formulas always use mmHg internally
function calculateExpectedHCO3(paco2Mmhg) {
  const NORMAL = 40;

  if (paco2Mmhg > NORMAL) {
    return {
      acuteAcidosis: Math.round(BASE_HCO3 + ((paco2Mmhg - NORMAL) / 10) * 1),
      chronicAcidosis: Math.round(BASE_HCO3 + ((paco2Mmhg - NORMAL) / 10) * 4),
      acuteAlkalosis: "",
      chronicAlkalosis: "",
    };
  }

  if (paco2Mmhg < NORMAL) {
    return {
      acuteAcidosis: "",
      chronicAcidosis: "",
      acuteAlkalosis: Math.round(BASE_HCO3 - ((NORMAL - paco2Mmhg) / 10) * 2),
      chronicAlkalosis: Math.round(BASE_HCO3 - ((NORMAL - paco2Mmhg) / 10) * 4),
    };
  }

  return {
    acuteAcidosis: 24,
    chronicAcidosis: 24,
    acuteAlkalosis: 24,
    chronicAlkalosis: 24,
  };
}

// Convert kPa to mmHg for the formula
function kpaToMmhg(kpa) {
  return Math.round(kpa * 7.50062);
}

function segmentColor(step, normalStep) {
  if (step > normalStep) return "#f85f5a";
  if (step === normalStep) return "#8dd79a";
  return "#1677f2";
}

function HCO3Box({ value, color }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <div style={{ fontSize: 13, color: "#555", fontWeight: 500 }}>
        HCO<sub>3</sub>
        <sup style={{ fontSize: 9 }}>−</sup>
      </div>
      <div
        style={{
          border: "1.5px solid #d9d9d9",
          borderRadius: 8,
          padding: "6px 28px",
          fontSize: 22,
          fontWeight: 500,
          color,
          background: "#fff",
          minWidth: 72,
          minHeight: 46,
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxSizing: "border-box",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function KidneyIcon() {
  return (
    <img
      src={KIDNEY_IMAGE_URL}
      alt="Kidneys"
      style={{ width: 40, height: "auto", objectFit: "contain", display: "block" }}
    />
  );
}

export default function AcuteChronic() {
  const { unit } = usePressureUnit();

  const SLIDER_STEPS = unit === "kPa" ? SLIDER_STEPS_KPA : SLIDER_STEPS_MMHG;

  // Normal step: the step whose paco2 is closest to normalPaco2 for the unit
  const normalPaco2 = getNormalPaco2(unit); // 5.3 kPa or 40 mmHg
  const NORMAL_STEP = SLIDER_STEPS.reduce((closest, item) =>
    Math.abs(item.paco2 - normalPaco2) < Math.abs(closest.paco2 - normalPaco2)
      ? item
      : closest
  ).step;

  const [selectedStep, setSelectedStep] = useState(NORMAL_STEP);
  const [previousUnit, setPreviousUnit] = useState(unit);
  const trackRef = useRef(null);
  const isDragging = useRef(false);

  // Reset to normal step when unit changes
  useEffect(() => {
    if (previousUnit === unit) return;
    setSelectedStep(NORMAL_STEP);
    setPreviousUnit(unit);
  }, [unit, previousUnit, NORMAL_STEP]);

  const currentStepData = SLIDER_STEPS.find((item) => item.step === selectedStep)
    || SLIDER_STEPS[Math.floor(SLIDER_STEPS.length / 2)];

  const paco2 = currentStepData.paco2;

  // Always pass mmHg to formula
  const paco2Mmhg = unit === "kPa" ? kpaToMmhg(paco2) : paco2;
  const NORMAL_MMHG = unit === "kPa" ? kpaToMmhg(normalPaco2) : normalPaco2;

  const values = calculateExpectedHCO3(paco2Mmhg);

  const isAcidosis  = paco2Mmhg > NORMAL_MMHG;
  const isAlkalosis = paco2Mmhg < NORMAL_MMHG;
  const isNormal    = paco2Mmhg === NORMAL_MMHG;

  const acidBorder = isAcidosis || isNormal ? "#ff7a70" : "#e4e4e4";
  const alkBorder  = isAlkalosis || isNormal ? "#1677f2" : "#e4e4e4";

  function getValueFromY(clientY) {
    const track = trackRef.current;
    if (!track) return null;
    const rect = track.getBoundingClientRect();
    const segmentHeight = rect.height / SLIDER_STEPS.length;
    const index = Math.floor((clientY - rect.top) / segmentHeight);
    const clamped = Math.max(0, Math.min(SLIDER_STEPS.length - 1, index));
    return SLIDER_STEPS[clamped].step;
  }

  function handlePointerDown(e) {
    isDragging.current = true;
    if (trackRef.current) trackRef.current.setPointerCapture(e.pointerId);
    const value = getValueFromY(e.clientY);
    if (value !== null) setSelectedStep(value);
  }

  function handlePointerMove(e) {
    if (!isDragging.current) return;
    const value = getValueFromY(e.clientY);
    if (value !== null) setSelectedStep(value);
  }

  function handlePointerUp() {
    isDragging.current = false;
  }

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
      <div style={{ padding: "14px 12px 24px", flex: 1 }}>
        <div style={{ fontSize: 13, color: "#444", marginBottom: 14 }}>
          Slide the bar to select value
        </div>

        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          {/* Vertical slider */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: "#222", marginBottom: 8 }}>
              PaCO<sub>2</sub> ({unit})
            </div>

            <div style={{ display: "flex", alignItems: "stretch" }}>
              {/* Labels */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", marginRight: 6 }}>
                <div
                  style={{
                    height: 22,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 20,
                    marginBottom: 2,
                    color: "#b9b9b9",
                    fontSize: 16,
                  }}
                >
                  ↑
                </div>

                {SLIDER_STEPS.map((item) => (
                  <div
                    key={item.step}
                    style={{
                      height: 32,
                      width: 28,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      fontSize: 12,
                      color: "#444",
                    }}
                  >
                    {item.label}
                  </div>
                ))}

                <div
                  style={{
                    height: 22,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 20,
                    marginTop: 2,
                    color: "#b9b9b9",
                    fontSize: 16,
                  }}
                >
                  ↓
                </div>
              </div>

              {/* Colour bar */}
              <div
                ref={trackRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                style={{
                  width: 30,
                  display: "flex",
                  flexDirection: "column",
                  marginTop: 22,
                  cursor: "pointer",
                  touchAction: "none",
                  userSelect: "none",
                }}
              >
                {SLIDER_STEPS.map((item) => {
                  const isSelected = selectedStep === item.step;
                  return (
                    <div
                      key={item.step}
                      style={{
                        height: 32,
                        width: "100%",
                        background: segmentColor(item.step, NORMAL_STEP),
                        borderBottom: "2px solid rgba(255,255,255,0.65)",
                        position: "relative",
                        boxSizing: "border-box",
                      }}
                    >
                      {isSelected && (
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            border: "3px solid #767676",
                            background: "rgba(255,255,255,0.15)",
                            boxSizing: "border-box",
                            pointerEvents: "none",
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* HCO3 result panels */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Acidosis panel */}
            <div
              style={{
                border: `2px solid ${acidBorder}`,
                borderRadius: 2,
                overflow: "hidden",
                background: "#fff",
              }}
            >
              <div
                style={{
                  padding: "12px 10px",
                  borderBottom: "1px solid #d7d7d7",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 500, color: "#333", marginBottom: 8 }}>
                  Acute R. Acidosis
                </div>
                <HCO3Box value={values.acuteAcidosis} color="#222" />
              </div>

              <div style={{ padding: "12px 10px", textAlign: "center" }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: "#333", marginBottom: 8 }}>
                  Chronic R. Acidosis
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
                  <KidneyIcon />
                  <HCO3Box value={values.chronicAcidosis} color="#222" />
                </div>
              </div>
            </div>

            {/* Alkalosis panel */}
            <div
              style={{
                border: `2px solid ${alkBorder}`,
                borderRadius: 2,
                overflow: "hidden",
                background: "#fff",
              }}
            >
              <div
                style={{
                  padding: "12px 10px",
                  borderBottom: "1px solid #d7d7d7",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 500, color: "#333", marginBottom: 8 }}>
                  Acute R. Alkalosis
                </div>
                <HCO3Box value={values.acuteAlkalosis} color="#222" />
              </div>

              <div style={{ padding: "12px 10px", textAlign: "center" }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: "#333", marginBottom: 8 }}>
                  Chronic R. Alkalosis
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
                  <KidneyIcon />
                  <HCO3Box value={values.chronicAlkalosis} color="#222" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 22,
            textAlign: "center",
            fontSize: 12,
            color: "#444",
            lineHeight: 1.35,
            padding: "0 8px",
          }}
        >
          This explains the concept of change of bicarbonate for every rise/fall
          of CO<sub>2</sub> of 10 mmHg
        </div>
      </div>
    </div>
  );
}