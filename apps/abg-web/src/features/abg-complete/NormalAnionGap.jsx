import React, { useState, useMemo } from "react";
import {
  calculationUrinaryAnionGap,
  getUrinaryAnionGapResult,
  format2D,
} from "../../utils/abgMath";

export default function NormalAnionGap() {
  const [uNa, setUNa] = useState("");
  const [uK, setUK] = useState("");
  const [uCl, setUCl] = useState("");
  // correctedAnionGap passed from parent context (8-12 range = Normal AG)
  const [correctedAG, setCorrectedAG] = useState(10);

  const interpretation = useMemo(() => {
    if (uNa === "" || uK === "" || uCl === "") return null;
    const na = parseFloat(uNa);
    const k = parseFloat(uK);
    const cl = parseFloat(uCl);
    // Android: UAG = (Na + K) - Cl
    const uag = calculationUrinaryAnionGap(na, cl, k);
    // Android: uses correctedAG range 8-12 to gate interpretation
    const resultText = getUrinaryAnionGapResult(uag, correctedAG);

    let color = "#f57c00";
    let title = "";
    if (uag < 0) {
      color = "#388e3c";
      title = "Negative UAG (< 0)";
    } else if (uag > 0) {
      color = "#d32f2f";
      title = "Positive UAG (> 0)";
    } else {
      title = "Zero UAG";
    }

    return {
      uag,
      title,
      text: resultText === "NA" ? title : resultText,
      color,
    };
  }, [uNa, uK, uCl, correctedAG]);

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        background: "#fff",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
      }}
    >
      {/* Top Gray Section */}
      <div
        style={{
          background: "#ECEEF5",
          padding: "40px 20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          position: "relative",
          zIndex: 10,
          minHeight: "45vh",
        }}
      >
        <div style={{ width: "100%", maxWidth: 600 }}>
          {/* Urinary Na+ */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 6, fontWeight: 600, color: "#111", fontSize: 15 }}>
              Urinary Na<sup style={{ fontSize: 10 }}>+</sup>
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <input
                type="number"
                placeholder="Please enter Na"
                value={uNa}
                onChange={(e) => setUNa(e.target.value)}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  borderRadius: 6,
                  border: "1px solid #8302aaff",
                  fontSize: 15,
                  outline: "none",
                  background: "#fff",
                  boxShadow: "inset 0 1px 3px rgba(0,0,0,0.05)",
                }}
              />
              <span style={{ color: "#444", fontSize: 14, width: 65, textAlign: "left" }}>mmol/day</span>
            </div>
          </div>

          {/* Urinary K+ */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 6, fontWeight: 600, color: "#111", fontSize: 15 }}>
              Urinary K<sup style={{ fontSize: 10 }}>+</sup>
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <input
                type="number"
                placeholder="Please enter K"
                value={uK}
                onChange={(e) => setUK(e.target.value)}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  borderRadius: 6,
                  border: "1px solid #8302aaff",
                  fontSize: 15,
                  outline: "none",
                  background: "#fff",
                  boxShadow: "inset 0 1px 3px rgba(0,0,0,0.05)",
                }}
              />
              <span style={{ color: "#444", fontSize: 14, width: 65, textAlign: "left" }}>mmol/L</span>
            </div>
          </div>

          {/* Urinary Cl- */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 6, fontWeight: 600, color: "#111", fontSize: 15 }}>
              Urinary Cl<sup style={{ fontSize: 10 }}>−</sup>
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <input
                type="number"
                placeholder="Please enter Cl"
                value={uCl}
                onChange={(e) => setUCl(e.target.value)}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  borderRadius: 6,
                  border: "1px solid #8302aaff",
                  fontSize: 15,
                  outline: "none",
                  background: "#fff",
                  boxShadow: "inset 0 1px 3px rgba(0,0,0,0.05)",
                }}
              />
              <span style={{ color: "#777", fontSize: 14, width: 65, textAlign: "left" }}>mmol/L</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Interpretation Section */}
      <div style={{ flex: 1, width: "100%", padding: "30px 20px", display: "flex", flexDirection: "column", alignItems: "center", background: "#fff" }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#000", marginBottom: 20 }}>Interpretation</h2>
        
        <div style={{ width: "100%", maxWidth: 600, minHeight: 120 }}>
          {interpretation ? (
            <div style={{ padding: 24, borderRadius: 8, background: `${interpretation.color}10`, border: `1px solid ${interpretation.color}40`, textAlign: "center" }}>
               <div style={{ fontSize: 16, marginBottom: 12, color: "#111", fontWeight: 600 }}>
                 Urinary Anion Gap = {interpretation.uag.toFixed(1)}
               </div>
               <div style={{ fontSize: 18, fontWeight: 700, color: interpretation.color, marginBottom: 8 }}>
                 {interpretation.title}
               </div>
               <div style={{ fontSize: 15, color: "#111", lineHeight: 1.5 }}>
                 {interpretation.text}
               </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", color: "#555", fontStyle: "italic", marginTop: 40 }}>
              Enter all three urinary electrolytes to view the Urinary Anion Gap interpretation.
            </div>
          )}
        </div>

        {/* Icon at bottom */}
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", justifyContent: "center", marginTop: 40, marginBottom: 20 }}>
          <div
            onClick={() => {
              window.location.href = "https://abg.leadows.com/acidosis-flowchart/";
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
  );
}
