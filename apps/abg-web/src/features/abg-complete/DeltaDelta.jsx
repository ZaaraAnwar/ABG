import React, { useState, useMemo } from "react";

export default function DeltaDelta() {
  // Inputs for Delta Delta (usually from previous steps)
  const [ag, setAg] = useState(12);
  const [hco3, setHco3] = useState(24);
  const [na, setNa] = useState(140);

  // Inputs for Osmolar Gap as shown in screenshot
  const [glucose, setGlucose] = useState("");
  const [bun, setBun] = useState("");
  const [measuredOsm, setMeasuredOsm] = useState("");

  // ─── Calculations ───────────────────────────────────────────────────────────

  // Delta Delta Ratio
  const deltaDelta = useMemo(() => {
    const deltaAG = ag - 12;
    const deltaHCO3 = 24 - hco3;
    if (deltaHCO3 === 0) return 0;
    return deltaAG / deltaHCO3;
  }, [ag, hco3]);

  // Osmolar Gap
  const calculatedOsm = useMemo(() => {
    if (!na) return 0;
    const g = glucose ? Number(glucose) / 18 : 0;
    const b = bun ? Number(bun) / 2.8 : 0;
    return 2 * na + g + b;
  }, [na, glucose, bun]);

  const osmolarGap = useMemo(() => {
    if (!measuredOsm || !calculatedOsm) return 0;
    return Number(measuredOsm) - calculatedOsm;
  }, [measuredOsm, calculatedOsm]);

  // ─── Interpretation ────────────────────────────────────────────────────────

  const ddInterpretation = useMemo(() => {
    if (deltaDelta < 0.4) return "Normal Anion Gap Metabolic Acidosis (NAGMA).";
    if (deltaDelta < 0.8) return "Mixed NAGMA and HAGMA.";
    if (deltaDelta <= 2.0)
      return "Pure High Anion Gap Metabolic Acidosis (HAGMA).";
    return "Mixed HAGMA and Metabolic Alkalosis.";
  }, [deltaDelta]);

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
          High Anion Gap with Metabolic Acidosis as well as normal Anion Gap
          Metabolic Acidosis
        </div>
        <div style={{ fontWeight: 600, fontSize: 16, color: "#000" }}>
          Calculated Delta Delta = {deltaDelta.toFixed(1)}
        </div>
      </div>

      {/* Patient Data (Hidden inputs for Delta-Delta context) */}
      <div style={{ display: "none" }}>
        <input value={ag} onChange={(e) => setAg(Number(e.target.value))} />
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
          {osmolarGap > 10 ? "Toxic alcohol" : "Within normal limit"}
        </div>
        <div style={{ fontSize: 14, color: "#666" }}>
          Calculated Osmolar Gap = {osmolarGap.toFixed(2)}
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
