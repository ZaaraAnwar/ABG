import React, { useState, useRef } from "react";

const KIDNEY_IMAGE_URL =
  "https://abg.leadows.com/wp-content/uploads/2026/04/ChatGPT-Image-Apr-23-2026-12_50_29-PM.png";

const SLIDER_STEPS = [
  { step: 13, paco2: 100, label: "13" },
  { step: 12, paco2: 90, label: "12" },
  { step: 11, paco2: 80, label: "11" },
  { step: 9, paco2: 70, label: "9" },
  { step: 8, paco2: 60, label: "8" },
  { step: 7, paco2: 50, label: "7" },
  { step: 5, paco2: 40, label: "5" },
  { step: 4, paco2: 30, label: "4" },
  { step: 3, paco2: 20, label: "3" },
  { step: 1, paco2: 15, label: "1" },
];

const NORMAL_PACO2 = 40;
const BASE_HCO3 = 24;
const NORMAL_STEP = 5;

function calculateExpectedHCO3(paco2) {
  if (paco2 > NORMAL_PACO2) {
    return {
      acuteAcidosis: Math.round(BASE_HCO3 + ((paco2 - NORMAL_PACO2) / 10) * 1),
      chronicAcidosis: Math.round(
        BASE_HCO3 + ((paco2 - NORMAL_PACO2) / 10) * 4,
      ),
      acuteAlkalosis: "",
      chronicAlkalosis: "",
    };
  }

  if (paco2 < NORMAL_PACO2) {
    return {
      acuteAcidosis: "",
      chronicAcidosis: "",
      acuteAlkalosis: Math.round(BASE_HCO3 - ((NORMAL_PACO2 - paco2) / 10) * 2),
      chronicAlkalosis: Math.round(
        BASE_HCO3 - ((NORMAL_PACO2 - paco2) / 10) * 5,
      ),
    };
  }

  return {
    acuteAcidosis: 24,
    chronicAcidosis: 24,
    acuteAlkalosis: 24,
    chronicAlkalosis: 24,
  };
}

function HCO3Box({ value, color }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
      }}
    >
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
      style={{
        width: 40,
        height: "auto",
        objectFit: "contain",
        display: "block",
      }}
    />
  );
}

function segmentColor(step) {
  if (step > NORMAL_STEP) return "#f85f5a";
  if (step === NORMAL_STEP) return "#8dd79a";
  return "#1677f2";
}

export default function AcuteChronic() {
  const [selectedStep, setSelectedStep] = useState(5);
  const trackRef = useRef(null);
  const isDragging = useRef(false);

  const currentStepData = SLIDER_STEPS.find(
    (item) => item.step === selectedStep,
  );
  const paco2 = currentStepData.paco2;

  const values = calculateExpectedHCO3(paco2);

  const isAcidosis = paco2 > NORMAL_PACO2;
  const isAlkalosis = paco2 < NORMAL_PACO2;
  const isNormal = paco2 === NORMAL_PACO2;

  const acidBorder = isAcidosis || isNormal ? "#ff7a70" : "#e4e4e4";
  const alkBorder = isAlkalosis || isNormal ? "#1677f2" : "#e4e4e4";

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
    if (trackRef.current) {
      trackRef.current.setPointerCapture(e.pointerId);
    }
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
      {/* <div
        style={{
          background: "#f4f5fa",
          borderBottom: "1px solid #d6d8df",
          height: 52,
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          position: "relative",
          flexShrink: 0,
        }}
      >
        <button
          style={{
            background: "none",
            border: "none",
            fontSize: 24,
            color: "#6b4c84",
            cursor: "pointer",
            padding: 0,
            lineHeight: 1,
          }}
        >
          ‹
        </button>

        <span
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 16,
            fontWeight: 700,
            color: "#6b4c84",
            whiteSpace: "nowrap",
          }}
        >
          Acute &amp; Chronic Co-relation
        </span>
      </div> */}

      <div style={{ padding: "14px 12px 24px", flex: 1 }}>
        <div style={{ fontSize: 13, color: "#444", marginBottom: 14 }}>
          Slide the bar to select value
        </div>

        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "#222",
                marginBottom: 8,
              }}
            >
              PaCO<sub>2</sub>
            </div>

            <div style={{ display: "flex", alignItems: "stretch" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  marginRight: 6,
                }}
              >
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
                      width: 22,
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
                        background: segmentColor(item.step),
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

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
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
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "#333",
                    marginBottom: 8,
                  }}
                >
                  Acute R. Acidosis
                </div>
                <HCO3Box value={values.acuteAcidosis} color="#222" />
              </div>

              <div style={{ padding: "12px 10px", textAlign: "center" }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "#333",
                    marginBottom: 8,
                  }}
                >
                  Chronic R. Acidosis
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 14,
                  }}
                >
                  <KidneyIcon />
                  <HCO3Box value={values.chronicAcidosis} color="#222" />
                </div>
              </div>
            </div>

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
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "#333",
                    marginBottom: 8,
                  }}
                >
                  Acute R. Alkalosis
                </div>
                <HCO3Box value={values.acuteAlkalosis} color="#222" />
              </div>

              <div style={{ padding: "12px 10px", textAlign: "center" }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "#333",
                    marginBottom: 8,
                  }}
                >
                  Chronic R. Alkalosis
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 14,
                  }}
                >
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
          of CO2 of 10mmHg
        </div>
      </div>
    </div>
  );
}