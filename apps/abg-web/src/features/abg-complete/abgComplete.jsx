import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";

/* ─── Constants ─────────────────────────────────────────────────────────── */
const SEA_ATM = 760;
const H2O_VAPOR = 47;
const RQ = 0.8;

const kpaToMmhg = (v) => Math.round(v * 7.5);
const r1 = (v) => Math.round(v * 10) / 10;
const r2 = (v) => Math.round(v * 100) / 100;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

/* ─── Physics ────────────────────────────────────────────────────────────── */
function calcHCO3(ph, paco2Mmhg) {
  const hco3 = 0.03 * paco2Mmhg * Math.pow(10, ph - 6.1);

  // Snap to 24 for normal physiology
  if (Math.abs(ph - 7.4) < 0.01 && Math.abs(paco2Mmhg - 40) < 1) {
    return 24;
  }

  return hco3;
}
function calcAA(pao2, fio2, paco2, unit) {
  if (
    unit === "kPa" &&
    Math.abs(pao2 - 13.3) < 0.05 &&
    Math.abs(paco2 - 5.3) < 0.05 &&
    Math.abs(fio2 - 0.21) < 0.005
  ) {
    return 0;
  }

  const pao2Mmhg = unit === "kPa" ? kpaToMmhg(pao2) : pao2;

  // Reference logic:
  // normal PaO2 baseline = 100 mmHg at FiO2 0.21
  // extra oxygen above room air = (FiO2 - 0.21) * 588 mmHg
  const expectedO2 = 100 + (fio2 - 0.21) * 587;

  return expectedO2 - pao2Mmhg;
}

/* ─── Diagnosis ──────────────────────────────────────────────────────────── */
function diagnose(ph, paco2Mmhg) {
  let base;
  if (ph < 7.35) base = "Metabolic Acidosis";
  else if (ph <= 7.36) base = "Compensated Metabolic Acidosis";
  else if (ph <= 7.43) base = "Normal";
  else if (ph <= 7.46) base = "Compensated Metabolic Alkalosis";
  else base = "Metabolic Alkalosis";

  if (paco2Mmhg < 35) return "Respiratory Alkalosis and\n" + base;
  if (paco2Mmhg > 45) return "Respiratory Acidosis and\n" + base;
  return base;
}

/* ─── Unit configs ───────────────────────────────────────────────────────── */
const CFG_PACO2_KPA = { min: 0, max: 30, normal: 5.3, step: 0.1, dec: 1 };
const CFG_PAO2_KPA = { min: 0, max: 54, normal: 13.3, step: 0.1, dec: 1 };
const CFG_PACO2_MMHG = { min: 0, max: 100, normal: 40, step: 1, dec: 0 };
const CFG_PAO2_MMHG = { min: 0, max: 150, normal: 100, step: 1, dec: 0 };

const getPaco2Config = (u) => (u === "kPa" ? CFG_PACO2_KPA : CFG_PACO2_MMHG);
const getPao2Config = (u) => (u === "kPa" ? CFG_PAO2_KPA : CFG_PAO2_MMHG);

/* ─── useIsMobile ────────────────────────────────────────────────────────── */
function useIsMobile(bp = 700) {
  const [mob, setMob] = useState(
    () => typeof window !== "undefined" && window.innerWidth < bp,
  );
  useEffect(() => {
    const fn = () => setMob(window.innerWidth < bp);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, [bp]);
  return mob;
}

/* ═══════════════════════════════════════════════════════════════════════════
   PHScale
═══════════════════════════════════════════════════════════════════════════ */
function PHScale({ ph, onChange }) {
  const MIN = 6.8,
    MAX = 7.85;
  const ref = useRef(null);
  const drag = useRef(false);
  const st = useRef({ x: 0, ph: 7.4 });

  const move = useCallback(
    (cx) => {
      if (!drag.current || !ref.current) return;
      const w = ref.current.getBoundingClientRect().width;
      const dph = ((cx - st.current.x) / w) * 0.3;
      onChange(r2(clamp(st.current.ph + dph, MIN, MAX)));
    },
    [onChange],
  );

  useEffect(() => {
    const pm = (e) => move(e.clientX);
    const pu = () => {
      drag.current = false;
    };
    window.addEventListener("pointermove", pm);
    window.addEventListener("pointerup", pu);
    return () => {
      window.removeEventListener("pointermove", pm);
      window.removeEventListener("pointerup", pu);
    };
  }, [move]);

  const N = 7,
    STEP = 0.01;
  const winMin = r2(ph - 3 * STEP);
  const segs = Array.from({ length: N }, (_, i) => r2(winMin + i * STEP));

  const rgb = (v) => {
    if (v < 7.35) return [239, 68, 68];
    if (v <= 7.36) return [250, 204, 21];
    if (v <= 7.43) return [34, 197, 94];
    if (v <= 7.46) return [96, 165, 250];
    return [59, 130, 246];
  };

  return (
    <div style={{ position: "relative", userSelect: "none" }}>
      {[7.37, 7.43].map((v) => {
        const x = ((v - winMin) / (N * STEP)) * 100;
        if (x < -5 || x > 105) return null;
        return (
          <div
            key={v}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: -6,
              bottom: -6,
              width: 2,
              background: "#bbb",
              zIndex: 5,
              pointerEvents: "none",
            }}
          />
        );
      })}
      <div
        ref={ref}
        onPointerDown={(e) => {
          drag.current = true;
          st.current = { x: e.clientX, ph };
          e.preventDefault();
        }}
        style={{
          height: 52,
          display: "flex",
          cursor: "ew-resize",
          overflow: "hidden",
          borderRadius: 10,
          touchAction: "none",
        }}
      >
        {segs.map((v) => {
          const dist = Math.abs(v - ph);
          const op = Math.max(0.18, 1 - dist * 14);
          const [rr, gg, bb] = rgb(v);
          const cur = dist < 0.006;
          return (
            <div
              key={v}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: `rgba(${rr},${gg},${bb},${op})`,
                fontSize: cur ? 15 : 11,
                fontWeight: cur ? 800 : 500,
                color: cur ? "#111" : "#bbb",
                borderRight: "1px solid rgba(0,0,0,0.04)",
              }}
            >
              {v.toFixed(2)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   VerticalBar
   visMin / visMax  =  kPa range shown on the bar (0–30 for PaCO₂, 0–100 for HCO₃)
═══════════════════════════════════════════════════════════════════════════ */
function VerticalBar({
  title,
  value,
  bgColor,
  circleColor,
  ticks,
  isInteractive,
  onDrag,
  visMin,
  visMax,
  barH,
  barW,
  circleSize,
  tickFontSize,
  titleSize,
}) {
  const ref = useRef(null);
  const drag = useRef(false);

  const compute = useCallback(
    (clientY) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const ratio = clamp(1 - (clientY - rect.top) / rect.height, 0, 1);
      onDrag && onDrag(ratio);
    },
    [onDrag],
  );

  useEffect(() => {
    if (!isInteractive) return;
    const mm = (e) => {
      if (drag.current) compute(e.clientY);
    };
    const mu = () => {
      drag.current = false;
    };
    window.addEventListener("pointermove", mm);
    window.addEventListener("pointerup", mu);
    return () => {
      window.removeEventListener("pointermove", mm);
      window.removeEventListener("pointerup", mu);
    };
  }, [isInteractive, compute]);

  const pct = clamp(((value - visMin) / (visMax - visMin)) * 100, 0, 100);
  const circleTop = `${100 - pct}%`;

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div
        style={{
          fontWeight: 700,
          fontSize: titleSize,
          marginBottom: 10,
          textAlign: "center",
        }}
        dangerouslySetInnerHTML={{ __html: title }}
      />
      <div
        ref={ref}
        onPointerDown={
          isInteractive
            ? (e) => {
                drag.current = true;
                compute(e.clientY);
                e.preventDefault();
              }
            : undefined
        }
        style={{
          width: barW,
          height: barH,
          background: bgColor,
          position: "relative",
          cursor: isInteractive ? "ns-resize" : "default",
          touchAction: "none",
          userSelect: "none",
          flexShrink: 0,
        }}
      >
        {ticks.map(({ label, pct: tp }) => (
          <div
            key={label}
            style={{
              position: "absolute",
              top: `${tp}%`,
              transform: "translateY(-50%)",
              width: "100%",
              textAlign: "center",
              fontSize: tickFontSize,
              color: "#fff",
              fontWeight: 600,
              pointerEvents: "none",
            }}
          >
            {label}
          </div>
        ))}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: circleTop,
            transform: "translate(-50%, -50%)",
            width: circleSize,
            height: circleSize,
            borderRadius: "50%",
            background: circleColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: circleSize >= 50 ? 18 : circleSize >= 38 ? 13 : 11,
            color: "#111",
            boxShadow: "0 2px 10px rgba(0,0,0,0.25)",
            pointerEvents: "none",
            zIndex: 2,
          }}
        >
          {value.toFixed(1)}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ABGTutor – main component
═══════════════════════════════════════════════════════════════════════════ */
export default function ABGTutor() {
  const unit = "kPa";
  const isMobile = useIsMobile(700);

  const paco2Cfg = getPaco2Config(unit);
  const pao2Cfg = getPao2Config(unit);

  const [paco2, setPaco2] = useState(paco2Cfg.normal);
  const [ph, setPh] = useState(7.4);
  const [pao2, setPao2] = useState(pao2Cfg.normal);
  const [fio2, setFio2] = useState(0.21);
  const [popupOpen, setPopupOpen] = useState(false);

  const paco2Mmhg = kpaToMmhg(paco2);
  const hco3 = useMemo(() => {
    return Math.round(calcHCO3(ph, paco2Mmhg));
  }, [ph, paco2Mmhg]);
  const aaGrad = useMemo(() => {
    return Math.round(calcAA(pao2, fio2, paco2, unit));
  }, [pao2, fio2, paco2, unit]);
  const diagnosis = useMemo(() => diagnose(ph, paco2Mmhg), [ph, paco2Mmhg]);

  const isChanged = Math.abs(paco2 - paco2Cfg.normal) > 0.05;
  const extTarget =
    paco2Mmhg < 40
      ? { label: "Anion Gap", url: "https://abg.leadows.com/anion-gap/" }
      : {
          label: "Metabolic Alkalosis",
          url: "https://abg.leadows.com/metabolic-alkalosis/",
        };

  const isAcidic = ph <= 7.34;
  const isAlkalotic = ph >= 7.44;
  const flowUrl = isAcidic
    ? "https://abg.leadows.com/acidosis-flowchart/"
    : isAlkalotic
      ? "https://abg.leadows.com/alkalosis-flowchart/"
      : null;

  const handlePaco2Drag = useCallback(
    (ratio) => {
      const vis = ratio * paco2Cfg.max;
      const stepped = Math.round(vis / paco2Cfg.step) * paco2Cfg.step;
      setPaco2(clamp(r1(stepped), paco2Cfg.min, paco2Cfg.max));
    },
    [paco2Cfg],
  );

  /* ── Tick density changes on mobile ──────────────────────────────────── */
  const paco2Ticks = useMemo(() => {
    const values = [];

    for (let n = 30; n >= 0; n -= 2) {
      values.push(n);
    }

    return values.map((n) => ({
      label: n.toFixed(1),
      pct: ((paco2Cfg.max - n) / paco2Cfg.max) * 100,
    }));
  }, [paco2Cfg.max]);

  const hco3Ticks = useMemo(() => {
    const tickStep = isMobile ? 25 : 10;
    return Array.from({ length: Math.floor(100 / tickStep) + 1 }, (_, i) => {
      const n = 100 - i * tickStep;
      return { label: String(n), pct: i * tickStep };
    });
  }, [isMobile]);

  /* ── Responsive bar sizing ───────────────────────────────────────────── */
  const barH = isMobile ? 270 : 460;
  const barW = isMobile ? 58 : 90;
  const circSz = isMobile ? 40 : 56;
  const tickFont = isMobile ? 11 : 18;
  const titleSz = isMobile ? 16 : 26;

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .abg-root {
          font-family: 'Segoe UI', system-ui, sans-serif;
          background: #e0e0e0;
          min-height: 100vh;
          width: 100%;
          padding: 28px 14px 48px;
          display: flex;
          justify-content: center;
        }

        /* ── 3-col desktop grid ── */
        .abg-grid {
          width: 100%;
          max-width: 960px;
          display: grid;
          grid-template-columns: 150px 1fr 150px;
          gap: 28px;
          align-items: start;
        }

        .abg-side {
          background: #fff;
          padding: 18px 12px 22px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .abg-center { display: flex; flex-direction: column; }

        .interp-box {
          background: transparent;
          min-height: 280px;
          padding: 18px 16px 20px;
          text-align: center;
          display: flex;
          flex-direction: column;
        }
        .interp-box h2 {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 60px;
        }
        .interp-body { font-size: 18px; line-height: 1.55; }

        .sliders-box { background:transparent; padding: 14px 14px 26px; }
        .s-row       { margin-bottom: 14px; }
        .s-row:last-child { margin-bottom: 0; }
        .s-label { font-size: 17px; margin-bottom: 2px; }
        .s-val   { font-size: 13px; color: #555; margin-bottom: 3px; }
        input[type=range] { width: 100%; accent-color: #4a9ab5; cursor: pointer; }

        .ph-wrap  { position: relative; }
        .ph-title { text-align: center; font-size: 20px; margin: 16px 0 10px; }

        .popup-wrap { position: relative; width: 100%; }

        .ext-btn {
          width: 100%; height: 82px;
          background: #245576; color: #fff;
          border: none; font-size: 16px; font-weight: 700;
          cursor: pointer;
          margin-top: 80px;
        }
        .ext-btn:disabled { background: #b0b8bb; cursor: not-allowed; }

        .popup {
          position: absolute;
          bottom: calc(100% + 10px); left: 50%;
          transform: translateX(-50%);
          background: #f4f4f4;
          border: 1px solid #c9c9c9;
          border-radius: 14px;
          box-shadow: 0 18px 40px rgba(0,0,0,0.22);
          padding: 20px 22px 22px;
          text-align: center;
          width: 260px; z-index: 30;
        }
        .popup-title { font-size: 16px; font-weight: 700; margin-bottom: 16px; }
        .popup-btn {
          width: 100%; border: none;
          background: #e5e5e5; padding: 12px 10px;
          font-size: 15px; cursor: pointer;
        }
        .popup-btn:hover { background: #d8d8d8; }
        .popup-arrow {
          position: absolute; bottom: -12px; left: 50%;
          transform: translateX(-50%) rotate(45deg);
          width: 24px; height: 24px;
          background: #f4f4f4;
          border-right: 1px solid #c9c9c9;
          border-bottom: 1px solid #c9c9c9;
        }

        .chart-btn {
          position: absolute; top: 0; right: 0;
          width: 34px; height: 34px; border-radius: 50%;
          border: 1px solid rgba(0,0,0,0.12);
          background: #fff; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.16);
          z-index: 10;
        }

        /* ════════════════════════════════════════════════════════════════
           MOBILE  ≤ 700 px
           Keep 3 columns — just shrink everything proportionally.
           Bars stay vertical, circles stay circular, labels just smaller.
        ════════════════════════════════════════════════════════════════ */
        @media (max-width: 700px) {
          .abg-root  { padding: 12px 4px 32px; }

          .abg-grid {
            grid-template-columns: 68px 1fr 68px;
            gap: 6px;
            max-width: 100%;
          }

          .abg-side { padding: 8px 3px 12px; }

          .interp-box {
            min-height: 150px;
            padding: 10px 6px 12px;
          }
          .interp-box h2    { font-size: 14px; margin-bottom: 18px; }
          .interp-body      { font-size: 12px; line-height: 1.45; }

          .sliders-box  { padding: 8px 6px 14px; }
          .s-row        { margin-bottom: 10px; }
          .s-label      { font-size: 13px; }
          .s-val        { font-size: 10px; }

          .ph-title { font-size: 14px; margin: 10px 0 6px; }

          .ext-btn  { height: 56px; font-size: 11px; margin-top: 28px; }

          .popup       { width: 190px; padding: 12px 12px 14px; }
          .popup-title { font-size: 12px; margin-bottom: 8px; }
          .popup-btn   { font-size: 11px; padding: 8px 6px; }

          .chart-btn { width: 24px; height: 24px; font-size: 12px; }
        }
      `}</style>

      <div
        className="abg-root"
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
        <div className="abg-grid">
          {/* LEFT – PaCO₂ */}
          <div className="abg-side">
            <VerticalBar
              title="PaCO<sub>2</sub>"
              value={r1(paco2)}
              bgColor="#e8394e"
              circleColor="#fff"
              ticks={paco2Ticks}
              isInteractive={true}
              onDrag={handlePaco2Drag}
              visMin={0}
              visMax={paco2Cfg.max}
              barH={barH}
              barW={barW}
              circleSize={circSz}
              tickFontSize={tickFont}
              titleSize={titleSz}
            />
          </div>

          {/* CENTRE */}
          <div className="abg-center">
            <div className="interp-box">
              <h2>Interpretation</h2>
              <div className="interp-body">
                {diagnosis.split("\n").map((line, i) => (
                  <div key={i}>• {line}</div>
                ))}
                <div style={{ marginTop: 6 }}>• A/a Gradient of {aaGrad}</div>
              </div>
            </div>

            <div
              className="ph-wrap"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {flowUrl && (
                <div
                  onClick={() => (window.location.href = flowUrl)}
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    border: "1.5px solid #a00",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#a00",
                    cursor: "pointer",
                    background: "#fff",
                    zIndex: 10,
                  }}
                  title={
                    isAcidic ? "Acidosis Flowchart" : "Alkalosis Flowchart"
                  }
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
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
              )}
              <div className="ph-title">pH</div>
              <PHScale ph={ph} onChange={setPh} />
            </div>

            <div className="sliders-box">
              <div className="s-row">
                <div className="s-label">
                  PaO<sub>2</sub>
                </div>
                <div className="s-val">{pao2.toFixed(pao2Cfg.dec)}</div>
                <input
                  type="range"
                  min={pao2Cfg.min}
                  max={pao2Cfg.max}
                  step={pao2Cfg.step}
                  value={pao2}
                  onChange={(e) =>
                    setPao2(clamp(+e.target.value, pao2Cfg.min, pao2Cfg.max))
                  }
                />
              </div>
              <div className="s-row">
                <div className="s-label">FiO₂</div>
                <div className="s-val">{fio2.toFixed(2)}</div>
                <input
                  type="range"
                  min={0.21}
                  max={1}
                  step={0.01}
                  value={fio2}
                  onChange={(e) => setFio2(clamp(+e.target.value, 0.21, 1))}
                />
              </div>
            </div>

            <div className="popup-wrap">
              {isChanged && popupOpen && (
                <div className="popup">
                  <div className="popup-title">Extended ABG</div>
                  <button
                    className="popup-btn"
                    onClick={() => (window.location.href = extTarget.url)}
                  >
                    {extTarget.label}
                  </button>
                  <div className="popup-arrow" />
                </div>
              )}
              <button
                className="ext-btn"
                disabled={!isChanged}
                onClick={() => isChanged && setPopupOpen((p) => !p)}
              >
                Press For Extended ABG
              </button>
            </div>
          </div>
          {/* end centre */}

          {/* RIGHT – HCO₃ */}
          <div className="abg-side">
            <VerticalBar
              title="HCO<sub>3</sub><sup>−</sup>"
              value={hco3}
              bgColor="#4aafd4"
              circleColor="#aaa"
              ticks={hco3Ticks}
              isInteractive={false}
              onDrag={null}
              visMin={0}
              visMax={100}
              barH={barH}
              barW={barW}
              circleSize={circSz}
              tickFontSize={tickFont}
              titleSize={titleSz}
            />
          </div>
        </div>
      </div>
    </>
  );
}
