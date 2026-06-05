import React, { useState, useMemo } from "react";
import { calculateCorrectedAnionGap4Albumin } from "../../utils/abgMath";

// ─── Constants ────────────────────────────────────────────────────────────────
const NORMAL_ALBUMIN = 3.5;

export default function AnionGap() {
  // Read HCO3 from URL query param (passed from ABGComplete).
  // Android: calculatedHCO3 = getArguments().getFloat(Constants.HCO3, 0)
  //          then used as Math.round(calculatedHCO3) for bar heights.
  const urlHco3 = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const val = params.get("hco3");
    if (val === null) return null;
    const parsed = Math.round(parseInt(val, 10));
    return Number.isFinite(parsed) ? parsed : null;
  }, []);
  const isHco3Fixed = urlHco3 !== null;

  // Android initial values: NA=140, CL=110, HCO3=round(calculatedHCO3)
  const [na, setNa] = useState(140);
  const [cl, setCl] = useState(110);
  const [hco3, setHco3] = useState(isHco3Fixed ? urlHco3 : 9);
  const [albumin, setAlbumin] = useState(3.5);

  // ── Core AG formula: ag = NA - (CL + HCO3)  [matches Android] ────────────
  const ag = na - (cl + hco3);

  // correctedAG: mirrors Android's albumin logic
  //   albumin >= 3.5 → "NA"  (isSAEnabled=false in Android)
  //   albumin <  3.5 → calculateCorrectedAnionGap4Albumin(ag, albumin)
  const correctedAG =
    albumin >= NORMAL_ALBUMIN
      ? "NA"
      : calculateCorrectedAnionGap4Albumin(ag, albumin);

  // effectiveAG: the value passed to showAnionGapResult() in Android.
  // When albumin is corrected (< 3.5) use correctedAG; otherwise use raw ag.
  const effectiveAG = typeof correctedAG === "number" ? correctedAG : ag;

  // Status label driven by effectiveAG — mirrors Android's showAnionGapResult()
  const status = useMemo(() => {
    if (effectiveAG < 8) return { label: "Low Anion Gap", color: "#245576" };
    if (effectiveAG > 12) return { label: "High Anion Gap", color: "#245576" };
    return { label: "Normal Anion Gap", color: "#245576" };
  }, [effectiveAG]);

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
          box-sizing: border-box;
        }

        /* Card wrapper that visually matches the screenshot border */
        .ag-card {
          width: 100%;
          max-width: 700px;
          padding: 32px 24px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* Main content row: albumin panel + graph side-by-side, centred inside the card */
        .ag-content {
          display: flex;
          width: 100%;
          align-items: center;
          justify-content: center;
          gap: 40px;
        }

        /* Albumin left panel */
        .ag-albumin-panel {
          width: 200px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          gap: 24px;
          align-items: center;
        }

        .ag-albumin-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          width: 100%;
          text-align: center;
        }

        /* Graph area — centred, bars aligned at the bottom */
        .ag-graph {
          display: flex;
          align-items: flex-end;
          justify-content: center;
          gap: 60px;
          height: 350px;
          flex: 1;
        }

        /* Sliders section */
        .ag-sliders {
          margin-top: 32px;
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
          margin-top: 40px;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: all 0.2s;
        }

        /* ── Tablet  ≤ 700px ──────────────────────────────────────────── */
        @media (max-width: 700px) {
          .ag-root { padding: 24px 12px 40px; }
          .ag-card { padding: 24px 16px; border-radius: 12px; }

          /* Stack albumin panel above the graph */
          .ag-content {
            flex-direction: column;
            gap: 24px;
            align-items: center;
          }

          .ag-albumin-panel {
            width: 100%;
            flex-direction: row;
            gap: 16px;
            align-items: stretch;
            justify-content: center;
          }
          .ag-albumin-col {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }

          /* Shrink graph on smaller screens */
          .ag-graph {
            gap: 40px;
            height: 260px;
            width: 100%;
          }

          .ag-footer-btn { margin-top: 24px; font-size: 16px; }
          .ag-sliders    { margin-top: 24px; }
        }

        /* ── Mobile  ≤ 420px ──────────────────────────────────────────── */
        @media (max-width: 420px) {
          .ag-root { padding: 16px 8px 28px; }
          .ag-card { padding: 16px 10px; }

          .ag-graph {
            gap: 28px;
            height: 200px;
          }

          .ag-footer-btn { font-size: 14px; padding: 13px; }
        }
      `}</style>

      <div className="ag-root">
        <div className="ag-card">
        <div className="ag-content">
          
          {/* Left: Albumin Controls — structure identical to original */}
          <div className="ag-albumin-panel">
            {/* ── Serum Albumin stepper ──────────────────────────────── */}
            <div className="ag-albumin-col">
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 15,
                  color: "#333",
                  marginBottom: 10,
                }}
              >
                Serum Albumin
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: "#f0f2f5",
                  borderRadius: 10,
                  padding: "2px 4px",
                  border: "1px solid #ddd",
                  width: "fit-content",
                  gap: 4,
                }}
              >
                <button
                  onClick={() =>
                    setAlbumin((v) =>
                      Math.max(0, Math.round((v - 0.5) * 10) / 10),
                    )
                  }
                  style={{
                    width: 30,
                    height: 30,
                    border: "none",
                    background: "none",
                    fontSize: 20,
                    cursor: "pointer",
                    color: "#555",
                    lineHeight: 1,
                    padding: 0,
                  }}
                >
                  −
                </button>
                <div
                  style={{
                    minWidth: 40,
                    textAlign: "center",
                    fontWeight: 700,
                    fontSize: 16,
                    color: "#222",
                  }}
                >
                  {albumin.toFixed(1)}
                </div>
                <button
                  onClick={() =>
                    setAlbumin((v) =>
                      Math.min(8.0, Math.round((v + 0.5) * 10) / 10),
                    )
                  }
                  style={{
                    width: 30,
                    height: 30,
                    border: "none",
                    background: "none",
                    fontSize: 20,
                    cursor: "pointer",
                    color: "#555",
                    lineHeight: 1,
                    padding: 0,
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* ── Corrected AG ───────────────────────────────────────── */}
            <div className="ag-albumin-col">
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#444",
                  marginBottom: 8,
                  lineHeight: 1.4,
                }}
              >
                Corrected AG for Serum Albumin
              </div>
              <div
                style={{
                  background: "#bdbdbd",
                  color: "#333",
                  padding: "8px 20px",
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
                  marginTop: 0,
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
        </div>

        {/* Footer Result — uses effectiveAG, matching Android's showAnionGapResult() */}
        <a
          href="#"
          className="ag-footer-btn"
          onClick={(e) => {
            e.preventDefault();
            if (effectiveAG > 12) {
              window.location.href = "https://abg.leadows.com/high-anion-gap/";
            } else if (effectiveAG >= 8 && effectiveAG <= 12) {
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
          {effectiveAG > 12 && (
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
          {effectiveAG >= 8 && effectiveAG <= 12 && (
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
          {effectiveAG < 8 && (
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
                HCO3 ({hco3}){isHco3Fixed && <span style={{ fontWeight: 400, fontSize: 12, color: "#888", marginLeft: 8 }}>(from ABG)</span>}
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
