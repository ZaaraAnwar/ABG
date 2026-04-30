import React, { useEffect, useMemo, useRef, useState } from "react";
import { usePressureUnit } from "../../context/PressureUnitContext";

// ─── Constants ────────────────────────────────────────────────────────────────
const SEA_LEVEL_ATM_MMHG = 760;
const WATER_VAPOR_MMHG = 47;
const RQ = 0.8;

// ─── Unit helpers ─────────────────────────────────────────────────────────────
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

// ─── Derived HCO3 (Henderson-Hasselbalch) ────────────────────────────────────
// paco2 in mmHg
function calcHCO3(ph, paco2Mmhg) {
  return 0.03 * paco2Mmhg * Math.pow(10, ph - 6.1);
}

// ─── A-a gradient ─────────────────────────────────────────────────────────────
function calcAAGradient(pao2, fio2, paco2, unit) {
  const pao2Mmhg = unit === "kPa" ? kpaToMmhg(pao2) : pao2;
  const paco2Mmhg = unit === "kPa" ? kpaToMmhg(paco2) : paco2;
  const alveolarO2 =
    fio2 * (SEA_LEVEL_ATM_MMHG - WATER_VAPOR_MMHG) - paco2Mmhg / RQ;
  return alveolarO2 - pao2Mmhg;
}

// ─── Full interpretation logic ────────────────────────────────────────────────
// paco2 always in mmHg here
function interpret(ph, paco2Mmhg, hco3) {
  const acidotic = ph < 7.35;
  const alkalotic = ph > 7.45;
  const normal = !acidotic && !alkalotic;

  const highCO2 = paco2Mmhg > 45;
  const lowCO2 = paco2Mmhg < 35;
  const highHCO3 = hco3 > 26;
  const lowHCO3 = hco3 < 22;

  if (normal) {
    if (highCO2 && highHCO3) return "Compensated Respiratory Acidosis";
    if (lowCO2 && lowHCO3) return "Compensated Respiratory Alkalosis";
    if (highHCO3 && !highCO2) return "Compensated Metabolic Alkalosis";
    if (lowHCO3 && !lowCO2) return "Compensated Metabolic Acidosis";
    if (highCO2) return "Compensated Metabolic Alkalosis";
    if (lowCO2) return "Compensated Metabolic Acidosis";
    return "Normal";
  }

  if (acidotic) {
    if (highCO2) {
      if (highHCO3) return "Metabolic Alkalosis and Respiratory Acidosis";
      return hco3 >= 26
        ? "Chronic Respiratory Acidosis"
        : "Acute Respiratory Acidosis";
    }
    if (lowHCO3) {
      return lowCO2 ? "Compensated Metabolic Acidosis" : "Metabolic Acidosis";
    }
    return "Mixed Acidosis";
  }

  // alkalotic
  if (lowCO2) {
    if (lowHCO3) return "Compensated Metabolic Acidosis";
    if (highHCO3) return "Metabolic Alkalosis and Respiratory Alkalosis";
    return hco3 <= 22
      ? "Acute Respiratory Alkalosis"
      : "Chronic Respiratory Alkalosis";
  }
  if (highHCO3) {
    if (highCO2) return "Metabolic Alkalosis and Respiratory Acidosis";
    return "Metabolic Alkalosis";
  }
  return "Mixed Alkalosis";
}

// Extended (simpler) label
function extendedInterpret(ph, paco2Mmhg, hco3) {
  const acidotic = ph < 7.35;
  const alkalotic = ph > 7.45;
  const highCO2 = paco2Mmhg > 45;
  const lowCO2 = paco2Mmhg < 35;
  const highHCO3 = hco3 > 26;
  const lowHCO3 = hco3 < 22;

  if (!acidotic && !alkalotic && !highCO2 && !lowCO2 && !highHCO3 && !lowHCO3)
    return "Normal";

  const parts = [];
  if (highCO2 || (acidotic && !lowHCO3)) parts.push("Respiratory Acidosis");
  if (lowCO2 || (alkalotic && !highHCO3)) parts.push("Respiratory Alkalosis");
  if (highHCO3) parts.push("Metabolic Alkalosis");
  if (lowHCO3) parts.push("Metabolic Acidosis");

  return parts.length ? parts.join(" + ") : "Normal";
}

// ─── Slider configs per unit ───────────────────────────────────────────────────
function getPaco2Config(unit) {
  return unit === "kPa"
    ? {
        min: 0,
        max: 12,
        normal: 5.3,
        decimals: 1,
        step: 0.1,
        labels: [0, 2, 4, 6, 8, 10, 12],
      }
    : {
        min: 0,
        max: 100,
        normal: 40,
        decimals: 0,
        step: 1,
        labels: [0, 20, 40, 60, 80, 100],
      };
}

function getPao2Config(unit) {
  return unit === "kPa"
    ? { min: 0, max: 20, normal: 13.3, decimals: 1, step: 0.1 }
    : { min: 0, max: 150, normal: 100, decimals: 0, step: 1 };
}

// ─── PremiumHorizontalSlider ──────────────────────────────────────────────────
function PremiumHorizontalSlider({
  title,
  value,
  min,
  max,
  step,
  color,
  labels,
  onChange,
  decimals = 1,
  isReadOnly = false,
}) {
  const percent = ((value - min) / (max - min)) * 100;
  const trackRef = useRef(null);
  const dragging = useRef(false);

  const updateFromX = (clientX) => {
    if (!trackRef.current || isReadOnly) return;
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
    const raw = min + ratio * (max - min);
    const val = Math.round(raw / step) * step;
    onChange(clamp(decimals <= 1 ? round1(val) : round2(val), min, max));
  };

  useEffect(() => {
    const onMove = (e) => {
      if (dragging.current) updateFromX(e.clientX ?? e.touches?.[0]?.clientX);
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
  });

  return (
    <div
      style={{
        width: "100%",
        background: "#ffffff",
        padding: "24px",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
        border: "1px solid rgba(0,0,0,0.06)",
        marginBottom: "20px",
        boxSizing: "border-box"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div style={{ fontSize: "16px", fontWeight: 600, color: "#374151" }}>{title}</div>
        <div style={{ fontSize: "24px", fontWeight: 800, color: color }}>{value.toFixed(decimals)}</div>
      </div>

      <div
        ref={trackRef}
        onPointerDown={(e) => {
          if (!isReadOnly) {
            dragging.current = true;
            updateFromX(e.clientX);
          }
        }}
        style={{
          height: "14px",
          borderRadius: "99px",
          background: "#f1f5f9",
          position: "relative",
          cursor: isReadOnly ? "default" : "ew-resize",
          userSelect: "none",
          touchAction: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: `${percent}%`,
            background: color,
            borderRadius: "99px",
            opacity: isReadOnly ? 0.6 : 1,
            transition: dragging.current ? "none" : "width 0.15s ease-out"
          }}
        />
        {!isReadOnly && (
          <div
            style={{
              position: "absolute",
              left: `${percent}%`,
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: "#ffffff",
              border: `3px solid ${color}`,
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
              pointerEvents: "none",
              transition: dragging.current ? "none" : "left 0.15s ease-out"
            }}
          />
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px", fontSize: "13px", color: "#9ca3af", fontWeight: 500 }}>
        {labels ? (
          labels.map((l) => <span key={l}>{l}</span>)
        ) : (
          <>
            <span>{min}</span>
            <span>{max}</span>
          </>
        )}
      </div>
    </div>
  );
}

// ─── PHScale ───────────────────────────────────────────────────────────────────
function PHScale({ ph, onChange }) {
  const FULL_MIN = 6.8;
  const FULL_MAX = 7.85;
  const trackRef = useRef(null);

  const handlePointer = (clientX) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
    const val = round2(FULL_MIN + ratio * (FULL_MAX - FULL_MIN));
    onChange(val);
  };

  const onDown = (e) => {
    handlePointer(e.clientX);
    const onMove = (me) => handlePointer(me.clientX);
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  return (
    <div style={{ position: "relative", padding: "10px 0 30px" }}>
      <div
        ref={trackRef}
        onPointerDown={onDown}
        style={{
          height: "48px",
          display: "flex",
          cursor: "ew-resize",
          borderRadius: "12px",
          touchAction: "none",
          background: "#f0f0f0",
          boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Color regions */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(90deg, 
              #ef4444 0%, 
              #ef4444 ${((7.34 - FULL_MIN) / (FULL_MAX - FULL_MIN)) * 100}%, 
              #22c55e ${((7.35 - FULL_MIN) / (FULL_MAX - FULL_MIN)) * 100}%, 
              #22c55e ${((7.45 - FULL_MIN) / (FULL_MAX - FULL_MIN)) * 100}%, 
              #3b82f6 ${((7.46 - FULL_MIN) / (FULL_MAX - FULL_MIN)) * 100}%, 
              #3b82f6 100%)`,
            opacity: 0.8,
          }}
        />

        {/* Normal markers */}
        {[7.35, 7.45].map((v) => (
          <div
            key={v}
            style={{
              position: "absolute",
              left: `${((v - FULL_MIN) / (FULL_MAX - FULL_MIN)) * 100}%`,
              top: 0,
              bottom: 0,
              width: 2,
              background: "rgba(255,255,255,0.4)",
              zIndex: 5,
            }}
          />
        ))}

        {/* Indicator */}
        <div
          style={{
            position: "absolute",
            left: `${((ph - FULL_MIN) / (FULL_MAX - FULL_MIN)) * 100}%`,
            top: 0,
            bottom: 0,
            width: "4px",
            background: "#000",
            transform: "translateX(-50%)",
            boxShadow: "0 0 10px rgba(0,0,0,0.3)",
            zIndex: 10,
          }}
        />
      </div>

      {/* Static Labels */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 8,
          fontSize: "14px",
          fontWeight: 700,
          color: "#333",
        }}
      >
        <span>6.80</span>
        <span>7.85</span>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function ABGTutor() {
  const { unit } = usePressureUnit();

  const paco2Config = getPaco2Config(unit);
  const pao2Config = getPao2Config(unit);

  const [paco2, setPaco2] = useState(paco2Config.normal);
  const [ph, setPh] = useState(7.4);
  const [pao2, setPao2] = useState(pao2Config.normal);
  const [fio2, setFio2] = useState(0.21);
  const [showExtended, setShowExtended] = useState(false);
  const [showExtendedPopup, setShowExtendedPopup] = useState(false);
  const [prevUnit, setPrevUnit] = useState(unit);
  const paco2BarRef = useRef(null);

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

  const paco2Mmhg = unit === "kPa" ? kpaToMmhg(paco2) : paco2;
  const hco3 = useMemo(() => round1(calcHCO3(ph, paco2Mmhg)), [ph, paco2Mmhg]);
  const aaGradient = useMemo(() => round1(calcAAGradient(pao2, fio2, paco2, unit)), [pao2, fio2, paco2, unit]);
  // Updated diagnosis logic based on pH ranges
  const diagnosis = useMemo(() => {
    let phDiagnosis = "";
    if (ph >= 6.8 && ph <= 7.34) {
      phDiagnosis = "Metabolic Acidosis";
    } else if (ph >= 7.35 && ph <= 7.36) {
      phDiagnosis = "Compensated Metabolic Acidosis";
    } else if (ph >= 7.37 && ph <= 7.43) {
      phDiagnosis = "Normal";
    } else if (ph >= 7.44 && ph <= 7.46) {
      phDiagnosis = "Compensated Metabolic Alkalosis";
    } else if (ph >= 7.47 && ph <= 7.85) {
      phDiagnosis = "Metabolic Alkalosis and Respiratory Alkalosis";
    }
    return phDiagnosis;
  }, [ph]);

  const isExtendedEnabled = paco2Mmhg < 35 || paco2Mmhg > 45;
  const extendedTarget =
    paco2Mmhg < 35
      ? {
          label: "Anion Gap",
          url: "https://abg.leadows.com/anion-gap/",
        }
      : {
          label: "Metabolic Alkalosis",
          url: "https://abg.leadows.com/metabolic-alkalosis/",
        };

  const visualPaco2Value = unit === "mmHg" ? mmhgToKpa(paco2) : paco2;
  const paco2CircleTop = `${clamp(100 - (visualPaco2Value / 30) * 100, 0, 100)}%`;

  const handlePaco2Pointer = (clientY) => {
    if (!paco2BarRef.current) return;
    const rect = paco2BarRef.current.getBoundingClientRect();
    const ratio = clamp((rect.bottom - clientY) / rect.height, 0, 1);
    
    // Map visual ratio to the 0-30 visual scale (kPa equivalent)
    const visualValue = ratio * 30;
    
    // Convert visual kPa back to the active unit
    const targetValue = unit === "kPa" ? visualValue : kpaToMmhg(visualValue);
    
    const stepped = Math.round(targetValue / paco2Config.step) * paco2Config.step;
    setPaco2(clamp(round1(stepped), paco2Config.min, paco2Config.max));
  };

  const onPaco2Down = (e) => {
    handlePaco2Pointer(e.clientY);
    const onMove = (me) => handlePaco2Pointer(me.clientY);
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

return (
  <div
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
      style={{
        width: "100%",
        maxWidth: 1000,
        display: "grid",
        gridTemplateColumns: "190px 1fr 190px",
        gap: 40,
        alignItems: "start",
      }}
    >
      {/* Left PaCO2 Bar */}
      <div
        style={{
          background: "#fff",
          padding: "22px",
          minHeight: 560,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: 12 }}>
          PaCO<sub>2</sub>
        </div>

        <div
          ref={paco2BarRef}
          onPointerDown={onPaco2Down}
          style={{
            width: 95,
            height: 470,
            background: "#ff4b61",
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
                  fontSize: 20,
                  color: "#000",
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
              top: paco2CircleTop,
              transform: "translateY(-50%)",
              width: 58,
              height: 58,
              borderRadius: "50%",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 22,
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              pointerEvents: "none",
            }}
          >
            {paco2.toFixed(paco2Config.decimals)}
          </div>
        </div>

      </div>

      {/* Center Area */}
      <div>
        <div
          style={{
            background: "#e7e7e7",
            minHeight: 330,
            padding: "10px 20px",
            textAlign: "center",
          }}
        >
          <h2 style={{ margin: 0, marginBottom: 90, fontSize: 22 }}>
            Interpretation
          </h2>

          <div style={{ fontSize: 18, lineHeight: 1.25 }}>
            • {diagnosis}
            <br />• A/a Gradient of {aaGradient}
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 0 }}>
          <div style={{ fontSize: 20, marginBottom: 45 }}>pH</div>
          <PHScale ph={ph} onChange={setPh} />
        </div>

        <div
          style={{
            marginTop: 34,
            background: "#dedede",
            padding: "0 8px 34px",
          }}
        >
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 18 }}>
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
            <div style={{ fontSize: 18 }}>FiO₂</div>
            <div style={{ fontSize: 16 }}>{fio2.toFixed(2)}</div>
            <input
              type="range"
              min={0.21}
              max={1}
              step={0.01}
              value={fio2}
              onChange={(e) =>
                setFio2(clamp(Number(e.target.value), 0.21, 1))
              }
              style={{ width: "100%" }}
            />
          </div>
        </div>

        <div style={{ position: "relative", width: "100%" }}>
          {isExtendedEnabled && showExtendedPopup && (
            <div
              style={{
                position: "absolute",
                bottom: "105px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "260px",
                background: "#f4f4f4",
                border: "1px solid #c9c9c9",
                borderRadius: "14px",
                boxShadow: "0 18px 40px rgba(0,0,0,0.22)",
                padding: "20px 22px",
                textAlign: "center",
                zIndex: 20,
              }}
            >
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
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 16,
                  marginBottom: 16,
                  color: "#000",
                }}
              >
                Extended ABG
              </div>
              <div
                onClick={() => (window.location.href = extendedTarget.url)}
                style={{
                  background: "#e5e5e5",
                  padding: "12px",
                  cursor: "pointer",
                  fontSize: "15px",
                  fontWeight: "600",
                  color: "#000",
                }}
              >
                {extendedTarget.label}
              </div>
            </div>
          )}

          <button
            disabled={!isExtendedEnabled}
            onClick={() => setShowExtendedPopup(!showExtendedPopup)}
            style={{
              marginTop: 28,
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

      {/* Right HCO3 Bar */}
      <div
        style={{
          background: "#fff",
          padding: "22px",
          minHeight: 560,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: 12 }}>
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
                fontSize: 22,
                color: "#000",
              }}
            >
              {n}
            </div>
          ))}

          <div
            style={{
              position: "absolute",
              left: 18,
              top: `${100 - (clamp(hco3, 0, 100) / 100) * 100}%`,
              transform: "translateY(-50%)",
              width: 58,
              height: 58,
              borderRadius: "50%",
              background: "#aaa",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 18,
            }}
          >
            {hco3}
          </div>
        </div>
      </div>

      <style>
        {`
          @media (max-width: 768px) {
            div[style*="grid-template-columns: 190px 1fr 190px"] {
              grid-template-columns: 1fr !important;
              gap: 24px !important;
            }
          }
        `}
      </style>
    </div>
  </div>
);
}
