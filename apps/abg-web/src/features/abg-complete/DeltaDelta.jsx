import React, { useState, useMemo } from "react";
import {
  calculationDeltadelta,
  getDeltadeltaResult,
  calculationOsmolarGap,
  getOsmolarGapResult,
  round2Digit,
  format2D,
} from "../../utils/abgMath";

export default function DeltaDelta() {
  // Inputs for Delta Delta (usually from previous steps)
  const [correctedAG, setCorrectedAG] = useState(12);
  const [hco3, setHco3] = useState(24);
  const [na, setNa] = useState(140);

  // Inputs for Osmolar Gap as shown in screenshot
  const [glucose, setGlucose] = useState("");
  const [bun, setBun] = useState("");
  const [measuredOsm, setMeasuredOsm] = useState("");

  // ─── Calculations (Android Formula.java — exact port) ──────────────────────

  // Delta Delta: (correctedAG - 12) - (24 - calculatedHCO3)
  const deltaDelta = useMemo(() =>
    calculationDeltadelta(correctedAG, hco3),
    [correctedAG, hco3]
  );

  // Delta Delta interpretation with ±5 thresholds and AG>12 gate
  const ddInterpretation = useMemo(() =>
    getDeltadeltaResult(deltaDelta, correctedAG),
    [deltaDelta, correctedAG]
  );

  // Osmolar Gap
  const osmolarGap = useMemo(() => {
    if (!measuredOsm || !na) return 0;
    const g = glucose ? Number(glucose) : 0;
    const b = bun ? Number(bun) : 0;
    return calculationOsmolarGap(na, g, b, Number(measuredOsm));
  }, [na, glucose, bun, measuredOsm]);

  // Osmolar Gap result: "Toxic Alcohol" only if BOTH osmolarGap > 10 AND correctedAG > 12
  const osmolarResult = useMemo(() =>
    getOsmolarGapResult(osmolarGap, correctedAG),
    [osmolarGap, correctedAG]
  );

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        background: "#fff",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px 20px"
      }}
    >
      <div style={{ width: "100%", maxWidth: 900 }}>
      {/* Delta Delta Section */}
      <h2
        style={{
          textAlign: "center",
          fontSize: 28,
          fontWeight: 400,
          color: "#222",
          marginBottom: 20,
        }}
      >
        Delta Delta
      </h2>

      <div
        style={{
          background: "#f0f0f0",
          border: "1px solid #ccc",
          padding: "24px",
          textAlign: "center",
          marginBottom: 32,
          borderRadius: 4,
        }}
      >
        <div
          style={{
            fontWeight: 400,
            fontSize: 16,
            color: "#333",
            marginBottom: 12,
            lineHeight: 1.5,
          }}
        >
         {ddInterpretation}
        </div>
        <div style={{ fontWeight: 600, fontSize: 16, color: "#000" }}>
          Calculated Delta Delta = {round2Digit(deltaDelta)}
        </div>
      </div>

      {/* Patient Data (Hidden inputs for Delta-Delta context) */}
      <div style={{ display: "none" }}>
        <input value={correctedAG} onChange={(e) => setCorrectedAG(Number(e.target.value))} />
        <input value={hco3} onChange={(e) => setHco3(Number(e.target.value))} />
        <input value={na} onChange={(e) => setNa(Number(e.target.value))} />
      </div>

      {/* Osmolar Gap Section */}
      <h3
        style={{
          fontSize: 20,
          fontWeight: 500,
          color: "#333",
          marginBottom: 16,
        }}
      >
        Osmolar Gap
      </h3>

      <div
        style={{
          background: "#eee",
          padding: "30px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
          marginBottom: 32,
          borderRadius: 4,
        }}
      >
        <div style={{ position: "relative" }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#444",
              marginBottom: 8,
            }}
          >
            Glucose
          </div>
          <input
            type="number"
            placeholder="Please enter Glucose"
            value={glucose}
            onChange={(e) => setGlucose(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#444",
              marginBottom: 8,
            }}
          >
            BUN
          </div>
          <input
            type="number"
            placeholder="Please enter BUN"
            value={bun}
            onChange={(e) => setBun(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#444",
              marginBottom: 8,
            }}
          >
            Measured Osmolality
          </div>
          <input
            type="number"
            placeholder="Please enter Osmolality"
            value={measuredOsm}
            onChange={(e) => setMeasuredOsm(e.target.value)}
            style={inputStyle}
          />
        </div>
      </div>

      {/* Interpretation Section */}
      <div style={{ padding: "20px 0", textAlign: "center" }}>
        <div
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "#000",
            marginBottom: 24,
          }}
        >
          Interpretation
        </div>
        <div style={{ fontSize: 16, color: "#333", marginBottom: 8 }}>
          {osmolarResult}
        </div>
        <div style={{ fontSize: 14, color: "#666" }}>
          Calculated Osmolar Gap = {format2D(osmolarGap)}
        </div>

        {/* Home Flowchart Icon */}
       <div style={{ display: "flex", justifyContent: "center", marginTop: 40, marginBottom: 20 }}>
          <div
            onClick={() => {
              window.location.href = "https://abg.leadows.com/alkalosis-flowchart/";
            }}
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              border: "1.5px solid #a00",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#a00",
              cursor: "pointer",
            }}
            title="Go to Alkalosis Flowchart"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="10" y="3" width="4" height="4" />
              <path d="M12 7v4" />
              <path d="M6 11h12" />
              <path d="M6 11v4" />
              <path d="M18 11v4" />
              <rect x="4" y="15" width="4" height="4" />
              <rect x="16" y="15" width="4" height="4" />
              <path d="M12 11v4" />
              <rect x="10" y="15" width="4" height="4" />
            </svg>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  border: "1px solid #ccc",
  borderRadius: 6,
  fontSize: 14,
  boxSizing: "border-box",
  background: "#fff",
  outline: "none",
};
