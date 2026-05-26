import React, { useState, useMemo } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────
const NORMAL_ALBUMIN = 3.5;

export default function AnionGap() {
  const [na, setNa] = useState(140);
  const [cl, setCl] = useState(110);
  const [hco3, setHco3] = useState(9);
  const [albumin, setAlbumin] = useState(3.5);

  // ── ALL ORIGINAL LOGIC UNTOUCHED ──────────────────────────────────────────
  const ag = na - (cl + hco3);
  const correctedAG =
    albumin === 0
      ? ag
      : albumin >= NORMAL_ALBUMIN
        ? "NA"
        : ag + 2.5 * (NORMAL_ALBUMIN - albumin);

  const status = useMemo(() => {
    if (ag < 8) return { label: "Low Anion Gap", color: "#245576" };
    if (ag > 12) return { label: "High Anion Gap", color: "#245576" };
    return { label: "Normal Anion Gap", color: "#245576" };
  }, [ag]);

  const maxVal = Math.max(na, cl + hco3 + Math.max(0, ag)) + 20;
  const getH = (val) => (val / maxVal) * 300;
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Responsive styles injected once ─────────────────────────────── */}
      <style>{`
        .ag-root {
          font-family: 'Segoe UI', system-ui, sans-serif;
          background: #fff;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 60px 20px;
        }

        /* Main content row: albumin panel + graph side-by-side */
        .ag-content {
          display: flex;
          width: 100%;
          max-width: 900px;
          gap: 60px;
          align-items: center;
          justify-content: center;
          flex: 1;
        }

        /* Albumin left panel */
        .ag-albumin-panel {
          width: 200px;
          text-align: center;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .ag-albumin-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
        }

        /* Graph area */
        .ag-graph {
          display: flex;
          align-items: flex-end;
          gap: 80px;
          height: 400px;
        }

        /* Sliders section */
        .ag-sliders {
          margin-top: 40px;
          width: 100%;
          max-width: 640px;
        }

        /* Footer button */
        .ag-footer-btn {
          display: block;
          text-decoration: none;
          width: 100%;
          max-width: 600px;
          background: #245576;
          color: #fff;
          text-align: center;
          padding: 16px;
          font-weight: 700;
          font-size: 18px;
          border-radius: 4px;
          margin-top: 60px;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: all 0.2s;
        }

        /* ── Tablet  ≤ 700px ──────────────────────────────────────────── */
        @media (max-width: 700px) {
          .ag-root { padding: 32px 14px 40px; }

          /* Stack albumin panel above the graph */
          .ag-content {
            flex-direction: column;
            gap: 32px;
            align-items: center;
          }

          .ag-albumin-panel {
            width: 100%;
            flex-direction: row;
            gap: 12px;
            align-items: flex-start;
            margin-bottom: 60px;
          }
          .ag-albumin-col {
            flex: 1;
          }

          /* Shrink graph height and gap on smaller screens */
          .ag-graph {
            gap: 48px;
            height: 280px;
            width: 100%;
            justify-content: center;
          }

          .ag-footer-btn { margin-top: 32px; font-size: 16px; }
          .ag-sliders    { margin-top: 28px; }
        }

        /* ── Mobile  ≤ 420px ──────────────────────────────────────────── */
        @media (max-width: 420px) {
          .ag-root { padding: 20px 10px 32px; }

          .ag-graph {
            gap: 32px;
            height: 220px;
          }

          .ag-footer-btn { font-size: 14px; padding: 13px; }
        }
      `}</style>

      <div className="ag-root">
        <div className="ag-content">
          {/* Left: Albumin Controls — structure identical to original */}
          <div className="ag-albumin-panel">
            <div className="ag-albumin-col">
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 16,
                  color: "#333",
                  marginBottom: 12,
                }}
              >
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
                  margin: "0 auto",
                }}
              >
                <button
                  onClick={() =>
                    setAlbumin((v) =>
                      Math.max(0, Math.round((v - 0.5) * 10) / 10),
                    )
                  }
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
                <div style={{ flex: 1, fontWeight: 700, fontSize: 16 }}>
                  {albumin.toFixed(1)}
                </div>
                <button
                  onClick={() =>
                    setAlbumin((v) =>
                      Math.min(8.0, Math.round((v + 0.5) * 10) / 10),
                    )
                  }
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
            </div>

            <div className="ag-albumin-col">
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#444",
                  marginBottom: 8,
                }}
              >
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
                {typeof correctedAG === "number"
                  ? correctedAG.toFixed(2)
                  : correctedAG}
              </div>
            </div>
          </div>

          {/* Center: Graph — all original markup, only wrapper class changed */}
          <div className="ag-graph">
            {/* Na bar */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
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
            <div
              style={{
                display: "flex",
                flexDirection: "column-reverse",
                position: "relative",
              }}
            >
              {/* Cl- */}
              <div
                style={{
                  width: 60,
                  height: getH(cl),
                  background: "#66bb6a",
                  position: "relative",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: 70,
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: 13,
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                  }}
                >
                  Cl<sup>−</sup> ({cl})
                </span>
              </div>
              {/* AG */}
              <div
                style={{
                  width: 60,
                  height: getH(Math.max(2, ag)),
                  background: "#f44336",
                  position: "relative",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: 70,
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: 13,
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                  }}
                >
                  AG ({ag})
                </span>
              </div>
              {/* HCO3 */}
              <div
                style={{
                  width: 60,
                  height: getH(hco3),
                  background: "#29b6f6",
                  position: "relative",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: 70,
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: 13,
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                  }}
                >
                  HCO<sub>3</sub>
                  <sup>−</sup> ({hco3})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Result — identical logic */}
        <a
          href="#"
          className="ag-footer-btn"
          onClick={(e) => {
            e.preventDefault();
            if (ag > 12) {
              window.location.href = "https://abg.leadows.com/high-anion-gap/";
            } else if (ag >= 8 && ag <= 12) {
              window.location.href =
                "https://abg.leadows.com/normal-anion-gap/";
            } else {
              window.location.href = "https://abg.leadows.com/low-anion-gap/";
            }
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
            <div
              style={{
                fontSize: 13,
                fontWeight: 400,
                marginTop: 4,
                opacity: 0.9,
              }}
            >
              Click for Delta-Delta &amp; Osmolar Gap Analysis
            </div>
          )}
          {ag >= 8 && ag <= 12 && (
            <div
              style={{
                fontSize: 13,
                fontWeight: 400,
                marginTop: 4,
                opacity: 0.9,
              }}
            >
              Click for Normal Anion Gap Details
            </div>
          )}
          {ag < 8 && (
            <div
              style={{
                fontSize: 13,
                fontWeight: 400,
                marginTop: 4,
                opacity: 0.9,
              }}
            >
              Click for Low Anion Gap Details
            </div>
          )}
        </a>

        {/* Sliders — identical */}
        <div className="ag-sliders">
          <div style={{ marginBottom: 20 }}>
            <label
              style={{ display: "block", marginBottom: 8, fontWeight: 700 }}
            >
              Sodium ({na})
            </label>
            <input
              type="range"
              min="100"
              max="180"
              value={na}
              onChange={(e) => setNa(parseInt(e.target.value))}
              style={{ width: "100%" }}
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label
              style={{ display: "block", marginBottom: 8, fontWeight: 700 }}
            >
              Chloride ({cl})
            </label>
            <input
              type="range"
              min="0"
              max={na - 9}
              value={cl}
              onChange={(e) => setCl(parseInt(e.target.value))}
              style={{ width: "100%" }}
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label
              style={{ display: "block", marginBottom: 8, fontWeight: 700 }}
            >
              HCO3 ({hco3})
            </label>
            <input
              type="range"
              min="9"
              max="50"
              value={hco3}
              onChange={(e) => setHco3(parseInt(e.target.value))}
              style={{ width: "100%" }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
