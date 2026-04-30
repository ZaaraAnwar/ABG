import React, { useEffect, useMemo, useRef, useState } from "react";
import { usePressureUnit } from "../../context/PressureUnitContext";

const SEA_LEVEL_ATM_MMHG = 760;
const WATER_VAPOR_MMHG = 47;
const RQ = 0.8;

function kpaToMmhg(v) {
  return v * 7.500617;
}

function mmhgToKpa(v) {
  return v / 7.500617;
}

function round1(v) {
  return Math.round(v * 10) / 10;
}

function round2(v) {
  return Math.round(v * 100) / 100;
}

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

function calcHCO3(ph, paco2Mmhg) {
  return 0.03 * paco2Mmhg * Math.pow(10, ph - 6.1);
}

function calcAAGradient(pao2, fio2, paco2, unit) {
  const pao2Mmhg = unit === "kPa" ? kpaToMmhg(pao2) : pao2;
  const paco2Mmhg = unit === "kPa" ? kpaToMmhg(paco2) : paco2;

  const alveolarO2 =
    fio2 * (SEA_LEVEL_ATM_MMHG - WATER_VAPOR_MMHG) - paco2Mmhg / RQ;

  return alveolarO2 - pao2Mmhg;
}

function interpretPH(ph) {
  const value = round2(ph);

  if (value >= 6.8 && value <= 7.34) return "Metabolic Acidosis";
  if (value >= 7.35 && value <= 7.36) return "Compensated Metabolic Acidosis";
  if (value >= 7.37 && value <= 7.43) return "Normal";
  if (value >= 7.44 && value <= 7.46) return "Compensated Metabolic Alkalosis";
  if (value >= 7.47 && value <= 7.85) {
    return "Metabolic Alkalosis and Respiratory Alkalosis";
  }

  return "Normal";
}

function getPaco2Config(unit) {
  return unit === "kPa"
    ? {
        min: 0,
        max: 12,
        normal: 5.3,
        decimals: 1,
        step: 0.1,
      }
    : {
        min: 0,
        max: 100,
        normal: 40,
        decimals: 0,
        step: 1,
      };
}

function getPao2Config(unit) {
  return unit === "kPa"
    ? { min: 0, max: 20, normal: 13.3, decimals: 1, step: 0.1 }
    : { min: 0, max: 150, normal: 100, decimals: 0, step: 1 };
}

function PHScale({ ph, onChange }) {
  const FULL_MIN = 6.8;
  const FULL_MAX = 7.85;

  const trackRef = useRef(null);
  const dragging = useRef(false);
  const startRef = useRef({ x: 0, ph: 7.4 });

  const onDown = (e) => {
    dragging.current = true;
    startRef.current = { x: e.clientX, ph };
  };

  useEffect(() => {
    const onMove = (e) => {
      if (!dragging.current || !trackRef.current) return;

      const dx = e.clientX - startRef.current.x;
      const rect = trackRef.current.getBoundingClientRect();
      const dph = (dx / rect.width) * 0.3;

      onChange(round2(clamp(startRef.current.ph + dph, FULL_MIN, FULL_MAX)));
    };

    const onUp = () => {
      dragging.current = false;
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [ph, onChange]);

  const numSegments = 7;
  const stepSize = 0.01;
  const half = Math.floor(numSegments / 2);

  const centerPH = Math.round(ph * 100) / 100;
  const winMin = centerPH - half * stepSize;
  const winMax = centerPH + half * stepSize;

  const segments = [];

  for (let i = 0; i < numSegments; i++) {
    segments.push(round2(winMin + i * stepSize));
  }

  return (
    <div style={{ position: "relative", userSelect: "none" }}>
      <div
        ref={trackRef}
        onPointerDown={onDown}
        style={{
          height: 56,
          display: "flex",
          cursor: "ew-resize",
          overflow: "hidden",
          borderRadius: 12,
          touchAction: "none",
          background: "#f8f8f8",
          boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)",
        }}
      >
        {segments.map((v) => {
          const dist = Math.abs(v - ph);
          const opacity = Math.max(0.16, 1 - dist * 14);

          let bgColor = "";

          if (v <= 7.34) {
            bgColor = `rgba(239, 68, 68, ${opacity})`;
          } else if (v >= 7.35 && v <= 7.36) {
            bgColor = `rgba(250, 204, 21, ${opacity})`;
          } else if (v >= 7.37 && v <= 7.43) {
            bgColor = `rgba(34, 197, 94, ${opacity})`;
          } else if (v >= 7.44 && v <= 7.46) {
            bgColor = `rgba(96, 165, 250, ${opacity})`;
          } else {
            bgColor = `rgba(59, 130, 246, ${opacity})`;
          }

          const isCurrent = dist < 0.006;

          return (
            <div
              key={v}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: bgColor,
                fontSize: isCurrent ? 18 : 14,
                fontWeight: isCurrent ? 800 : 500,
                color: isCurrent ? "#111827" : "#9ca3af",
                borderRight: "1px solid rgba(0,0,0,0.03)",
                transition: "all 0.15s ease",
              }}
            >
              {v.toFixed(2)}
            </div>
          );
        })}
      </div>

      {[7.37, 7.43].map((v) => {
        const x = ((v - winMin) / (winMax - winMin)) * 100;

        if (x >= -5 && x <= 105) {
          return (
            <div
              key={v}
              style={{
                position: "absolute",
                left: `${x}%`,
                top: -8,
                bottom: -8,
                width: 2,
                background: "#bdbdbd",
                zIndex: 5,
              }}
            />
          );
        }

        return null;
      })}
    </div>
  );
}

export default function ABGTutor() {
  const { unit } = usePressureUnit();

  const paco2Config = getPaco2Config(unit);
  const pao2Config = getPao2Config(unit);

  const [paco2, setPaco2] = useState(paco2Config.normal);
  const [ph, setPh] = useState(7.4);
  const [pao2, setPao2] = useState(pao2Config.normal);
  const [fio2, setFio2] = useState(0.21);
  const [prevUnit, setPrevUnit] = useState(unit);

  const paco2TrackRef = useRef(null);
  const draggingPaco2 = useRef(false);

  useEffect(() => {
    if (prevUnit === unit) return;

    const c1 = getPaco2Config(unit);
    const c2 = getPao2Config(unit);

    if (unit === "kPa") {
      setPaco2((v) => clamp(round1(mmhgToKpa(v)), c1.min, c1.max));
      setPao2((v) => clamp(round1(mmhgToKpa(v)), c2.min, c2.max));
    } else {
      setPaco2((v) => clamp(round1(kpaToMmhg(v)), c1.min, c1.max));
      setPao2((v) => clamp(round1(kpaToMmhg(v)), c2.min, c2.max));
    }

    setPrevUnit(unit);
  }, [unit, prevUnit]);

  const updatePaco2FromY = (clientY) => {
    if (!paco2TrackRef.current) return;

    const rect = paco2TrackRef.current.getBoundingClientRect();
    const ratio = clamp(1 - (clientY - rect.top) / rect.height, 0, 1);

    const visualMin = 0;
    const visualMax = 30;

    const visualValue = visualMin + ratio * (visualMax - visualMin);
    const targetValue = unit === "mmHg" ? kpaToMmhg(visualValue) : visualValue;

    const steppedValue =
      Math.round(targetValue / paco2Config.step) * paco2Config.step;

    setPaco2(
      clamp(
        paco2Config.decimals <= 1 ? round1(steppedValue) : round2(steppedValue),
        paco2Config.min,
        paco2Config.max
      )
    );
  };

  useEffect(() => {
    const onMove = (e) => {
      if (draggingPaco2.current) {
        updatePaco2FromY(e.clientY);
      }
    };

    const onUp = () => {
      draggingPaco2.current = false;
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [
    unit,
    paco2Config.min,
    paco2Config.max,
    paco2Config.step,
    paco2Config.decimals,
  ]);

  const paco2Mmhg = unit === "kPa" ? kpaToMmhg(paco2) : paco2;
  const hco3 = useMemo(() => round1(calcHCO3(ph, paco2Mmhg)), [ph, paco2Mmhg]);

  const aaGradient = useMemo(
    () => round1(calcAAGradient(pao2, fio2, paco2, unit)),
    [pao2, fio2, paco2, unit]
  );

  const diagnosis = useMemo(() => interpretPH(ph), [ph]);

  const visualPaco2Value = unit === "mmHg" ? mmhgToKpa(paco2) : paco2;

  const paco2CircleTop = clamp(
    100 - ((visualPaco2Value - 0) / (30 - 0)) * 100,
    0,
    100
  );

  const hco3CircleTop = clamp(100 - (clamp(hco3, 0, 100) / 100) * 100, 0, 100);

  const isExtendedEnabled =
    unit === "kPa"
      ? Math.abs(paco2 - paco2Config.normal) > 0.05
      : Math.abs(paco2 - paco2Config.normal) > 0.5;

  const extendedTarget =
    paco2Mmhg < 40
      ? {
          label: "Anion Gap",
          url: "https://abg.leadows.com/anion-gap/",
        }
      : {
          label: "Metabolic Alkalosis",
          url: "https://abg.leadows.com/metabolic-alkalosis/",
        };

  const handleExtendedClick = () => {
    if (!isExtendedEnabled) return;
    window.location.href = extendedTarget.url;
  };

  const isAcidicPH = ph <= 7.34;
  const isAlkaloticPH = ph >= 7.44;

  const flowchartUrl = isAcidicPH
    ? "https://abg.leadows.com/acidosis-flowchart/"
    : isAlkaloticPH
    ? "https://abg.leadows.com/alkalosis-flowchart/"
    : null;

  return (
    <div
      className="abg-tutor-page"
      style={{
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        background: "#e7e7e7",
        minHeight: "100vh",
        width: "100%",
        boxSizing: "border-box",
        overflowX: "hidden",
        padding: "30px 12px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        className="abg-tutor-grid"
        style={{
          width: "100%",
          maxWidth: 1000,
          display: "grid",
          gridTemplateColumns: "190px 1fr 190px",
          gap: 40,
          alignItems: "start",
        }}
      >
        <div
          className="abg-side-card"
          style={{
            background: "#fff",
            padding: 22,
            minHeight: 560,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxSizing: "border-box",
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 28 }}>
            PaCO<sub>2</sub>
          </div>

          <div
            ref={paco2TrackRef}
            onPointerDown={(e) => {
              draggingPaco2.current = true;
              updatePaco2FromY(e.clientY);
            }}
            style={{
              width: 95,
              height: 470,
              background: "#ff4058",
              position: "relative",
              cursor: "ns-resize",
              touchAction: "none",
              userSelect: "none",
            }}
          >
            {[30, 28, 26, 24, 22, 20, 18, 16, 14, 12, 10, 8, 6, 4, 2, 0].map(
              (n, i) => (
                <div
                  key={n}
                  style={{
                    position: "absolute",
                    right: 8,
                    top: `${(i / 15) * 100}%`,
                    transform: "translateY(-50%)",
                    fontSize: 22,
                    color: "#111",
                    pointerEvents: "none",
                  }}
                >
                  {n.toFixed(1)}
                </div>
              )
            )}

            <div
              style={{
                position: "absolute",
                left: 18,
                top: `${paco2CircleTop}%`,
                transform: "translateY(-50%)",
                width: 58,
                height: 58,
                borderRadius: "50%",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: 22,
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                pointerEvents: "none",
              }}
            >
              {paco2.toFixed(paco2Config.decimals)}
            </div>
          </div>
        </div>

        <div className="abg-center-column">
          <div
            className="abg-interpretation"
            style={{
              background: "#e7e7e7",
              minHeight: 330,
              padding: "10px 20px",
              textAlign: "center",
              boxSizing: "border-box",
            }}
          >
            <h2
              style={{
                margin: 0,
                marginBottom: 90,
                fontSize: 28,
                fontWeight: 400,
              }}
            >
              Interpretation
            </h2>

            <div style={{ fontSize: 20, lineHeight: 1.25 }}>
              • {diagnosis}
              <br />• A/a Gradient of {aaGradient}
            </div>
          </div>

          <div
            style={{
              position: "relative",
              textAlign: "center",
              marginTop: 0,
            }}
          >
            {flowchartUrl && (
              <button
                type="button"
                onClick={() => {
                  window.location.href = flowchartUrl;
                }}
                aria-label={
                  isAcidicPH
                    ? "Open acidosis flowchart"
                    : "Open alkalosis flowchart"
                }
                title={
                  isAcidicPH
                    ? "Open acidosis flowchart"
                    : "Open alkalosis flowchart"
                }
                style={{
                  position: "absolute",
                  top: -6,
                  right: 0,
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  border: "1px solid rgba(0,0,0,0.12)",
                  background: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.16)",
                  fontSize: 18,
                  zIndex: 10,
                  padding: 0,
                }}
              >
                📊
              </button>
            )}

            <div style={{ fontSize: 24, marginBottom: 45 }}>pH</div>
            <PHScale ph={ph} onChange={setPh} />
          </div>

          <div
            style={{
              marginTop: 34,
              background: "#dedede",
              padding: "8px 14px 34px",
              boxSizing: "border-box",
            }}
          >
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 20 }}>
                PaO<sub>2</sub>
              </div>
              <div style={{ fontSize: 16 }}>
                {pao2.toFixed(pao2Config.decimals)}
              </div>

              <input
                type="range"
                min={pao2Config.min}
                max={pao2Config.max}
                step={pao2Config.step}
                value={pao2}
                onChange={(e) =>
                  setPao2(
                    clamp(Number(e.target.value), pao2Config.min, pao2Config.max)
                  )
                }
                style={{ width: "100%" }}
              />
            </div>

            <div>
              <div style={{ fontSize: 20 }}>FiO₂</div>
              <div style={{ fontSize: 16 }}>{fio2.toFixed(2)}</div>

              <input
                type="range"
                min={0.21}
                max={1}
                step={0.01}
                value={fio2}
                onChange={(e) => setFio2(clamp(Number(e.target.value), 0.21, 1))}
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <div
            style={{
              position: "relative",
              width: "100%",
              marginTop: 110,
            }}
          >
            {isExtendedEnabled && (
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  bottom: 104,
                  transform: "translateX(-50%)",
                  width: 260,
                  background: "#f4f4f4",
                  border: "1px solid #c9c9c9",
                  borderRadius: 14,
                  boxShadow: "0 18px 40px rgba(0,0,0,0.22)",
                  padding: "20px 22px",
                  textAlign: "center",
                  zIndex: 20,
                  boxSizing: "border-box",
                }}
              >
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    marginBottom: 16,
                    color: "#111",
                  }}
                >
                  Extended ABG
                </div>

                <button
                  onClick={handleExtendedClick}
                  style={{
                    width: "100%",
                    border: "none",
                    background: "#e5e5e5",
                    padding: "12px 10px",
                    fontSize: 15,
                    color: "#111",
                    cursor: "pointer",
                  }}
                >
                  {extendedTarget.label}
                </button>

                <div
                  style={{
                    position: "absolute",
                    bottom: -12,
                    left: "50%",
                    transform: "translateX(-50%) rotate(45deg)",
                    width: 24,
                    height: 24,
                    background: "#f4f4f4",
                    borderRight: "1px solid #c9c9c9",
                    borderBottom: "1px solid #c9c9c9",
                  }}
                />
              </div>
            )}

            <button
              disabled={!isExtendedEnabled}
              onClick={handleExtendedClick}
              style={{
                width: "100%",
                height: 90,
                background: isExtendedEnabled ? "#245576" : "#cfd4d5",
                color: "#fff",
                border: "none",
                fontSize: 17,
                fontWeight: 700,
                cursor: isExtendedEnabled ? "pointer" : "not-allowed",
              }}
            >
              Press For Extended ABG
            </button>
          </div>
        </div>

        <div
          className="abg-side-card"
          style={{
            background: "#fff",
            padding: 22,
            minHeight: 560,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxSizing: "border-box",
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 28 }}>
            HCO<sub>3</sub><sup>−</sup>
          </div>

          <div
            style={{
              width: 95,
              height: 470,
              background: "#46abd2",
              position: "relative",
            }}
          >
            {[100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0].map((n, i) => (
              <div
                key={n}
                style={{
                  position: "absolute",
                  left: 12,
                  top: `${(i / 10) * 100}%`,
                  transform: "translateY(-50%)",
                  fontSize: 24,
                  color: "#111",
                }}
              >
                {n}
              </div>
            ))}

            <div
              style={{
                position: "absolute",
                left: 18,
                top: `${hco3CircleTop}%`,
                transform: "translateY(-50%)",
                width: 58,
                height: 58,
                borderRadius: "50%",
                background: "#aaa",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: 18,
              }}
            >
              {hco3.toFixed(1)}
            </div>
          </div>
        </div>

        <style>
          {`
            @media (max-width: 768px) {
              .abg-tutor-page {
                padding: 16px 10px !important;
              }

              .abg-tutor-grid {
                grid-template-columns: 1fr !important;
                gap: 24px !important;
                max-width: 420px !important;
              }

              .abg-side-card {
                min-height: auto !important;
              }

              .abg-center-column {
                width: 100% !important;
              }

              .abg-interpretation {
                min-height: 230px !important;
              }
            }
          `}
        </style>
      </div>
    </div>
  );
}