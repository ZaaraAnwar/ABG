import { useMemo, useState } from "react";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const buildArcPath = (cx, cy, radius, startAngle, endAngle) => {
  const segments = 48;
  const points = Array.from({ length: segments + 1 }, (_, i) => {
    const angle = startAngle + ((endAngle - startAngle) * i) / segments;
    const rad = (angle * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy - radius * Math.sin(rad) };
  });
  return points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(" ");
};

const pointOnArc = (cx, cy, radius, angle) => {
  const rad = (angle * Math.PI) / 180;
  return { x: cx + radius * Math.cos(rad), y: cy - radius * Math.sin(rad) };
};

function GaugeControl({ label, unit, value, min, max, step, color, marks, onChange }) {
  const ratio = (value - min) / (max - min);
  const currentAngle = 180 - ratio * 180;
  const backgroundArc = buildArcPath(120, 126, 84, 180, 0);
  const activeArc = buildArcPath(120, 126, 84, 180, currentAngle);
  const knob = pointOnArc(120, 126, 84, currentAngle);

  return (
    <div style={{ position: "relative", width: "100%", userSelect: "none" }}>
      <div style={{ position: "relative", height: "106px", width: "100%" }}>
        <svg viewBox="0 0 240 148" style={{ height: "100%", width: "100%", overflow: "visible" }}>
          {marks.map((mark) => {
            const mr = (mark - min) / (max - min);
            const angle = 180 - mr * 180;
            const pos = pointOnArc(120, 126, 104, angle);
            return (
              <text key={mark} x={pos.x} y={pos.y} textAnchor="middle" fill="#b0b0b8" fontSize="9" fontWeight="600">
                {mark === 0 ? "00" : `${mark}`}
              </text>
            );
          })}
          <path d={backgroundArc} fill="none" stroke="#dde0e4" strokeWidth="5" strokeLinecap="round" />
          <path d={activeArc} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" />
          <circle cx={knob.x} cy={knob.y} r="5.5" fill="white" stroke="#9ca3af" strokeWidth="2" />
          <text x="120" y="93" textAnchor="middle" fill="#111827" fontSize="23" fontWeight="700">
            {Math.round(value)}
          </text>
          <text x="120" y="108" textAnchor="middle" fill="#9ca3af" fontSize="9" fontWeight="500">
            {unit}
          </text>
        </svg>

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            opacity: 0,
            cursor: "ew-resize",
            margin: 0,
          }}
        />
      </div>

      <p
        style={{
          margin: "1px 0 0 0",
          textAlign: "center",
          fontSize: "0.82rem",
          fontWeight: "700",
          color,
        }}
      >
        {label}
      </p>
    </div>
  );
}

function ValueBadge({ title, value }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", minWidth: "64px" }}>
      <div
        style={{
          background: "#cc0000",
          color: "#fff",
          fontSize: "10px",
          fontWeight: "800",
          padding: "2px 8px",
          borderRadius: "3px",
          letterSpacing: "0.04em",
          whiteSpace: "nowrap",
        }}
      >
        {title}
      </div>

      <div
        style={{
          background: "#fff",
          border: "1px solid #ddd",
          borderRadius: "3px",
          fontSize: "1rem",
          fontWeight: "700",
          color: "#111",
          padding: "1px 10px",
          textAlign: "center",
          minWidth: "52px",
        }}
      >
        {value}
      </div>
    </div>
  );
}

export default function AGTutor() {
  const [frequency, setFrequency] = useState(12);
  const [deadSpace, setDeadSpace] = useState(150);
  const [tidalVolume, setTidalVolume] = useState(500);
  const [fio2, setFio2] = useState(0.21);

  const model = useMemo(() => {
    const effectiveBreath = tidalVolume - deadSpace;
    const alveolarVentilationL = (frequency * effectiveBreath) / 1000;

    const isVentilating = alveolarVentilationL !== 0;

    const paco2 = isVentilating
      ? (200 * 0.863) / alveolarVentilationL
      : null;

    const alveolarOxygen =
      paco2 === null
        ? null
        : fio2 * (760 - 47) - paco2 / 0.8;

    const pao2 =
      alveolarOxygen === null
        ? null
        : alveolarOxygen - 5;

    const aaGradient =
      alveolarOxygen === null || pao2 === null
        ? null
        : alveolarOxygen - pao2;

    const ventilationState =
      !isVentilating
        ? "No effective alveolar ventilation"
        : paco2 > 45
        ? "Hypoventilation"
        : paco2 < 35
        ? "Hyperventilation"
        : "Normal ventilation";

    const warning =
      frequency === 0
        ? "Frequency is zero — ventilation stops."
        : alveolarVentilationL === 0
        ? "No effective alveolar ventilation."
        : null;

    return {
      alveolarVentilationL,
      paco2,
      alveolarOxygen,
      pao2,
      aaGradient,
      ventilationState,
      warning,
    };
  }, [deadSpace, fio2, frequency, tidalVolume]);

  const fmt = (value, digits = 0) => {
    if (value === null || !Number.isFinite(value)) return "\u2014";
    return value.toFixed(digits);
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', system-ui, sans-serif; }
        .ag-root {
          display: grid;
          grid-template-columns: 1fr 1fr;
          width: 100%;
          min-height: 100vh;
        }
        .ag-left {
          background: #fff;
          padding: 14px 10px 10px 10px;
          display: flex;
          flex-direction: column;
          border-right: 1px solid #e8eaf0;
        }
        .ag-right {
          background: #c8d8ea;
          display: flex;
          flex-direction: column;
          height: 100vh;
        }
        .gauge-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2px;
          width: 100%;
        }
        @media (max-width: 768px) {
          .ag-root {
            grid-template-columns: 1fr;
          }
          .ag-left {
            border-right: none;
            border-bottom: 1px solid #e8eaf0;
          }
          .ag-right {
            height: 100vh;
          }
        }
      `}</style>

      <div className="ag-root">
        <div className="ag-left">
          <div className="gauge-grid">
            <GaugeControl
              label="Frequency"
              unit="breaths/min"
              value={frequency}
              min={0}
              max={40}
              step={1}
              color="#16a34a"
              marks={[0, 10, 20, 30, 40]}
              onChange={setFrequency}
            />

            <GaugeControl
              label="Dead Space"
              unit="ml"
              value={deadSpace}
              min={0}
              max={1000}
              step={10}
              color="#2563eb"
              marks={[0, 250, 500, 750, 1000]}
              onChange={setDeadSpace}
            />
          </div>

          <div style={{ borderTop: "1px solid #ebebeb", margin: "8px 0" }} />

          <div className="gauge-grid" style={{ alignItems: "center" }}>
            <GaugeControl
              label="Tidal Volume"
              unit="ml/breath"
              value={tidalVolume}
              min={0}
              max={3000}
              step={10}
              color="#ea580c"
              marks={[0, 750, 1500, 2250, 3000]}
              onChange={setTidalVolume}
            />

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                paddingBottom: "16px",
              }}
            >
              <span style={{ fontSize: "1rem", fontWeight: "700", color: "#111827" }}>FiO&#8322;</span>

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  border: "1.5px solid #d1d5db",
                  borderRadius: "999px",
                  background: "#f9fafb",
                  overflow: "hidden",
                }}
              >
                <button
                  type="button"
                  onClick={() => setFio2((c) => clamp(Number((c - 0.01).toFixed(2)), 0.21, 1.0))}
                  style={{
                    width: "28px",
                    height: "28px",
                    border: "none",
                    background: "transparent",
                    fontSize: "1.1rem",
                    color: "#6b7280",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  &#8722;
                </button>

                <div
                  style={{
                    borderLeft: "1.5px solid #d1d5db",
                    borderRight: "1.5px solid #d1d5db",
                    background: "#fff",
                    padding: "2px 10px",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                    color: "#374151",
                    minWidth: "50px",
                    textAlign: "center",
                  }}
                >
                  {fio2.toFixed(2)}
                </div>

                <button
                  type="button"
                  onClick={() => setFio2((c) => clamp(Number((c + 0.01).toFixed(2)), 0.21, 1.0))}
                  style={{
                    width: "28px",
                    height: "28px",
                    border: "none",
                    background: "transparent",
                    fontSize: "1.1rem",
                    color: "#6b7280",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  +
                </button>
              </div>

              <input
                type="range"
                min="0.21"
                max="1"
                step="0.01"
                value={fio2}
                onChange={(e) => setFio2(Number(e.target.value))}
                style={{ width: "88%", maxWidth: "100px", accentColor: "#6b7280" }}
              />
            </div>
          </div>

          <div style={{ flex: 1 }} />

          <p style={{ fontSize: "0.56rem", color: "#b0b8c8", marginTop: "6px" }}>
            V&#775;CO&#8322;=200ml/min &middot; P&#7742;=760mmHg &middot; R=0.8
          </p>
        </div>

        <div className="ag-right">
          <div style={{ position: "relative", width: "100%", flex: 1, minHeight: 0 }}>
            <img
              src="https://abg.leadows.com/wp-content/uploads/2026/04/ChatGPT-Image-Apr-24-2026-04_19_33-PM-1.png"
              alt="Lung illustration"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "fill",
                objectPosition: "center top",
                display: "block",
              }}
            />

            <div
              style={{
                position: "absolute",
                top: "22%",
                left: "46%",
                transform: "translateX(-50%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                zIndex: 5,
              }}
            >
              <ValueBadge title="PAO&#8322;" value={fmt(model.alveolarOxygen)} />
              <ValueBadge title="PACO&#8322;" value={fmt(model.paco2)} />
            </div>

            <div
              style={{
                position: "absolute",
                right: "4%",
                top: "24%",
                background: "#fff",
                border: "2px solid #e53e3e",
                borderRadius: "4px",
                zIndex: 5,
                minWidth: "120px",
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  fontWeight: "700",
                  fontSize: "0.85rem",
                  padding: "4px 12px",
                  borderBottom: "1px solid #e5e7eb",
                  color: "#111",
                }}
              >
                ABG
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "4px 12px",
                  borderBottom: "1px solid #f3f4f6",
                  fontSize: "0.8rem",
                  color: "#374151",
                }}
              >
                <span>PaO&#8322;</span>
                <span style={{ fontWeight: "600", color: "#111" }}>{fmt(model.pao2)}</span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "4px 12px",
                  fontSize: "0.8rem",
                  color: "#374151",
                }}
              >
                <span>PaCO&#8322;</span>
                <span style={{ fontWeight: "600", color: "#111" }}>{fmt(model.paco2)}</span>
              </div>
            </div>

            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                padding: "10px 12px 12px 12px",
                zIndex: 5,
              }}
            >
              <p style={{ fontSize: "0.75rem", fontWeight: "700", color: "#1a202c", marginBottom: "5px" }}>
                Alveolar-arterial gradient
              </p>

              <div
                style={{
                  display: "flex",
                  border: "1px solid #c8d0dc",
                  borderRadius: "3px",
                  overflow: "hidden",
                  background: "#fff",
                  maxWidth: "200px",
                }}
              >
                <div
                  style={{
                    background: "#b8c8e0",
                    color: "#334155",
                    padding: "3px 7px",
                    fontWeight: "700",
                    fontSize: "0.7rem",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  A
                </div>

                <div
                  style={{
                    flex: 1,
                    textAlign: "center",
                    padding: "3px 4px",
                    fontWeight: "600",
                    fontSize: "0.88rem",
                    color: "#111",
                    borderRight: "1px solid #e2e8f0",
                  }}
                >
                  {fmt(model.alveolarOxygen)}
                </div>

                <div
                  style={{
                    background: "#7a9ec0",
                    color: "#fff",
                    padding: "3px 7px",
                    fontWeight: "700",
                    fontSize: "0.7rem",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  a
                </div>

                <div
                  style={{
                    flex: 1,
                    textAlign: "center",
                    padding: "3px 4px",
                    fontWeight: "600",
                    fontSize: "0.88rem",
                    color: "#111",
                  }}
                >
                  {fmt(model.pao2)}
                </div>
              </div>

              <div
                style={{
                  marginTop: "4px",
                  background: "#fff",
                  border: "1px solid #c8d0dc",
                  borderRadius: "3px",
                  padding: "3px 7px",
                  fontSize: "0.88rem",
                  fontWeight: "600",
                  color: "#111",
                  maxWidth: "200px",
                }}
              >
                {fmt(model.aaGradient)}
              </div>

              <p style={{ marginTop: "6px", fontSize: "0.62rem", color: "#2d3748", fontWeight: "500" }}>
                V&#775;A {fmt(model.alveolarVentilationL, 2)} L/min &middot; {model.ventilationState}
              </p>

              {model.warning && (
                <div
                  style={{
                    marginTop: "4px",
                    fontSize: "0.62rem",
                    color: "#c53030",
                    background: "rgba(255,255,255,0.7)",
                    borderRadius: "3px",
                    padding: "2px 6px",
                    maxWidth: "200px",
                  }}
                >
                  {model.warning}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}