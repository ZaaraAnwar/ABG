import React, { useState, useMemo } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────
const NORMAL_ALBUMIN = 4.0;

export default function AnionGap() {
  const [na, setNa] = useState(140);
  const [cl, setCl] = useState(105);
  const [hco3, setHco3] = useState(24);
  const [albumin, setAlbumin] = useState(4.0);

  const ag = na - (cl + hco3);
  const correctedAG = ag + 2.5 * (NORMAL_ALBUMIN - albumin);

  const status = useMemo(() => {
    if (ag < 8) return { label: "Low Anion Gap", color: "#245576" };
    if (ag > 12) return { label: "High Anion Gap", color: "#245576" };
    return { label: "Normal Anion Gap", color: "#245576" };
  }, [ag]);

  // Height scaling
  const maxVal = Math.max(na, cl + hco3 + Math.max(0, ag)) + 20;
  const getH = (val) => (val / maxVal) * 300;

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        background: "#fff",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "60px 20px",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "100%",
          maxWidth: 900,
          gap: 60,
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
        }}
      >
        {/* Left: Albumin Controls */}
        <div style={{ width: 200, textAlign: "center" }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: "#333", marginBottom: 12 }}>
            Serum Albumin
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#f0f2f5",
              borderRadius: 12,
              padding: "4px",
              border: "1px solid #ddd",
              width: 120,
              margin: "0 auto 24px",
            }}
          >
            <button
              onClick={() => setAlbumin((v) => Math.max(0.1, Math.round((v - 0.1) * 10) / 10))}
              style={{
                width: 32,
                height: 32,
                border: "none",
                background: "none",
                fontSize: 20,
                cursor: "pointer",
                color: "#666",
              }}
            >
              −
            </button>
            <div style={{ flex: 1, fontWeight: 700, fontSize: 16 }}>{albumin.toFixed(1)}</div>
            <button
              onClick={() => setAlbumin((v) => Math.min(6.0, Math.round((v + 0.1) * 10) / 10))}
              style={{
                width: 32,
                height: 32,
                border: "none",
                background: "none",
                fontSize: 20,
                cursor: "pointer",
                color: "#666",
              }}
            >
              +
            </button>
          </div>

          <div style={{ fontSize: 14, fontWeight: 700, color: "#444", marginBottom: 8 }}>
            Corrected AG for Serum Albumin
          </div>
          <div
            style={{
              background: "#bdbdbd",
              color: "#333",
              padding: "8px 24px",
              borderRadius: 4,
              display: "inline-block",
              fontWeight: 700,
              fontSize: 16,
            }}
          >
            {correctedAG.toFixed(1)}
          </div>
        </div>

        {/* Center: Graph */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 80, height: 400 }}>
          {/* Na bar */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    width: 60,
                    height: getH(na),
                    background: "#ff9800",
                    position: "relative",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: -40,
                      top: 4,
                      fontWeight: 700,
                      color: "#ff9800",
                      fontSize: 14,
                    }}
                  >
                    Na<sup>+</sup>
                  </span>
                </div>
              </div>
            </div>
            <div
              style={{
                background: "#245576",
                color: "#fff",
                padding: "8px 12px",
                fontWeight: 700,
                fontSize: 16,
                marginTop: -10,
              }}
            >
              {na}
            </div>
          </div>

          {/* Comparative bar */}
          <div style={{ display: "flex", flexDirection: "column-reverse", position: "relative" }}>
            {/* Cl- */}
            <div style={{ width: 60, height: getH(cl), background: "#66bb6a", position: "relative" }}>
               <span style={{ position: "absolute", left: 70, top: "50%", transform: "translateY(-50%)", fontSize: 13, fontWeight: 700, whiteSpace: "nowrap" }}>
                Cl<sup>−</sup> ({cl})
              </span>
            </div>
            {/* AG */}
            <div style={{ width: 60, height: getH(Math.max(2, ag)), background: "#f44336", position: "relative" }}>
               <span style={{ position: "absolute", left: 70, top: "50%", transform: "translateY(-50%)", fontSize: 13, fontWeight: 700, whiteSpace: "nowrap" }}>
                AG ({ag})
              </span>
            </div>
            {/* HCO3 */}
            <div style={{ width: 60, height: getH(hco3), background: "#29b6f6", position: "relative" }}>
               <span style={{ position: "absolute", left: 70, top: "50%", transform: "translateY(-50%)", fontSize: 13, fontWeight: 700, whiteSpace: "nowrap" }}>
                HCO<sub>3</sub><sup>−</sup> ({hco3})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Result */}

<a
  href="#"
  onClick={(e) => {
    e.preventDefault();
    if (ag > 12) {
      window.location.href = "https://abg.leadows.com/high-anion-gap/";
    } else if (ag >= 8 && ag <= 12) {
      window.location.href = "https://abg.leadows.com/normal-anion-gap/";
    } else {
      window.location.href = "https://abg.leadows.com/low-anion-gap/";
    }
  }}
  style={{
    display: "block",
    textDecoration: "none",
    width: "100%",
    maxWidth: 600,
    background: status.color,
    color: "#fff",
    textAlign: "center",
    padding: "16px",
    fontWeight: 700,
    fontSize: 18,
    borderRadius: 4,
    marginTop: 60,
    letterSpacing: 0.5,
    cursor: "pointer",
    transition: "all 0.2s",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.filter = "brightness(1.1)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.filter = "none";
  }}
>
  {status.label}

  {ag > 12 && (
    <div style={{ fontSize: 13, fontWeight: 400, marginTop: 4, opacity: 0.9 }}>
      Click for Delta-Delta & Osmolar Gap Analysis
    </div>
  )}

  {ag >= 8 && ag <= 12 && (
    <div style={{ fontSize: 13, fontWeight: 400, marginTop: 4, opacity: 0.9 }}>
      Click for Normal Anion Gap Details
    </div>
  )}

  {ag < 8 && (
    <div style={{ fontSize: 13, fontWeight: 400, marginTop: 4, opacity: 0.9 }}>
      Click for Low Anion Gap Details
    </div>
  )}
</a>

      {/* Sliders for Na and Cl (hidden in screenshot but usually needed for tool) */}
      <div style={{ marginTop: 40, width: "100%", maxWidth: 640 }}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 700 }}>Sodium ({na})</label>
            <input type="range" min="100" max="180" value={na} onChange={e => setNa(parseInt(e.target.value))} style={{ width: "100%" }} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 700 }}>Chloride ({cl})</label>
            <input type="range" min="60" max="140" value={cl} onChange={e => setCl(parseInt(e.target.value))} style={{ width: "100%" }} />
          </div>
           <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 700 }}>HCO3 ({hco3})</label>
            <input type="range" min="5" max="50" value={hco3} onChange={e => setHco3(parseInt(e.target.value))} style={{ width: "100%" }} />
          </div>
      </div>
    </div>
  );
}
