import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { usePressureUnit } from "../../context/PressureUnitContext";
import { interpret } from "../../utils/abgMath";

/* --- Constants ------------------------------------------------------------ */
const SEA_ATM = 760;
const H2O_VAPOR = 47;
const RQ = 0.8;

const kpaToMmhg = (v) => Math.round(v * 7.5);
const r1 = (v) => Math.round(v * 10) / 10;
const r2 = (v) => Math.round(v * 100) / 100;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

/* --- Physics --------------------------------------------------------------- */
function calcHCO3(ph, paco2Mmhg) {
  const hco3 = 0.0302 * paco2Mmhg * Math.pow(10, ph - 6.1);
  if (Math.abs(ph - 7.4) < 0.01 && Math.abs(paco2Mmhg - 40) < 1) return 24;
  return hco3;
}

/* A/a Gradient = PAO2 - PaO2
   Alveolar Gas Equation: PAO2 = FiO2 x (Patm - PH2O) - PaCO2 / RQ
     Patm = 760 mmHg (sea level)
     PH2O = 47  mmHg (saturated at 37 C)
     RQ   = 0.8 (respiratory quotient)
   All pressures converted to mmHg before calculation.                        */
function calcAA(pao2, fio2, paco2, unit) {
  const PATM = 760;
  const PH2O = 47;
  const RQ = 0.8;

  const pao2Mmhg = unit === "kPa" ? kpaToMmhg(pao2) : pao2;
  const paco2Mmhg = unit === "kPa" ? kpaToMmhg(paco2) : paco2;

  const PAO2 = fio2 * (PATM - PH2O) - paco2Mmhg / RQ;

  return Math.trunc(PAO2 - pao2Mmhg);
}

/* --- Diagnosis ------------------------------------------------------------- */
/*
  Classification thresholds (all in mmHg):
    pH < 7.35  -> acidaemia
    pH > 7.45  -> alkalaemia
    PaCO2 < 35 -> respiratory alkalosis tendency
    PaCO2 > 45 -> respiratory acidosis tendency
    HCO3 < 22  -> metabolic acidosis tendency
    HCO3 > 26  -> metabolic alkalosis tendency

  Full truth table (Dr. Deopujari):
    Normal pH + normal CO2              → Normal
    Normal pH + low CO2                 → Compensated Respiratory Alkalosis
    Normal pH + high CO2 + high HCO3   → Metabolic Alkalosis and Respiratory Acidosis
    Normal pH + high CO2 + normal HCO3 → Compensated Respiratory Acidosis

    Acidemia + high CO2 + high HCO3    → Partially Compensated Respiratory Acidosis
    Acidemia + high CO2 + low HCO3     → Respiratory Acidosis and Metabolic Acidosis
    Acidemia + high CO2 + normal HCO3  → Respiratory Acidosis
    Acidemia + normal CO2              → Metabolic Acidosis
    Acidemia + low CO2                 → Partially Compensated Metabolic Acidosis

    Alkalemia + low CO2 + low HCO3     → Partially Compensated Respiratory Alkalosis
    Alkalemia + low CO2 + normal/high  → Respiratory Alkalosis
    Alkalemia + normal CO2             → Metabolic Alkalosis
    Alkalemia + high CO2               → Metabolic Alkalosis and Respiratory Acidosis
*/
function diagnose(ph, paco2Mmhg) {
  return { primary: null, secondary: interpret(ph, paco2Mmhg) };
}

/* --- Unit configs ---------------------------------------------------------- */
const CFG_PACO2_KPA = { min: 0, max: 30, normal: 5.3, step: 0.1, dec: 1 };
const CFG_PAO2_KPA = { min: 0, max: 54, normal: 13.3, step: 0.1, dec: 1 };
const CFG_PACO2_MMHG = { min: 0, max: 160, normal: 40, step: 1, dec: 0 };
const CFG_PAO2_MMHG = { min: 0, max: 400, normal: 100, step: 1, dec: 0 };

const getPaco2Config = (u) => (u === "kPa" ? CFG_PACO2_KPA : CFG_PACO2_MMHG);
const getPao2Config = (u) => (u === "kPa" ? CFG_PAO2_KPA : CFG_PAO2_MMHG);

/* --- useBreakpoint --------------------------------------------------------- */
function getBreakpoint() {
  if (typeof window === "undefined") return "desktop";
  if (window.innerWidth <= 480) return "mobile";
  if (window.innerWidth <= 900) return "tablet";
  return "desktop";
}
function useBreakpoint() {
  const [bp, setBp] = useState(getBreakpoint);
  useEffect(() => {
    const fn = () => setBp(getBreakpoint());
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return bp;
}

/* --- PHScale --------------------------------------------------------------- */
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
    const tm = (e) => {
      if (e.touches[0]) move(e.touches[0].clientX);
    };
    const pu = () => {
      drag.current = false;
    };
    window.addEventListener("pointermove", pm);
    window.addEventListener("touchmove", tm, { passive: true });
    window.addEventListener("pointerup", pu);
    window.addEventListener("touchend", pu);
    return () => {
      window.removeEventListener("pointermove", pm);
      window.removeEventListener("touchmove", tm);
      window.removeEventListener("pointerup", pu);
      window.removeEventListener("touchend", pu);
    };
  }, [move]);

  const N = 7,
    STEP = 0.01;
  const winMin = r2(ph - 3 * STEP);
  const segs = Array.from({ length: N }, (_, i) => r2(winMin + i * STEP));

  const rgb = (v) => {
    if (v < 7.35) return [239, 68, 68]; // Red for acidosis

    // Normal range 7.35 - 7.45
    if (v <= 7.45) return [34, 197, 94]; // Green for normal

    return [59, 130, 246]; // Blue for alkalosis
  };

  return (
    <div style={{ position: "relative", userSelect: "none", width: "100%" }}>
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
        onTouchStart={(e) => {
          drag.current = true;
          st.current = { x: e.touches[0].clientX, ph };
        }}
        style={{
          height: 52,
          display: "flex",
          cursor: "ew-resize",
          overflow: "hidden",
          borderRadius: 10,
          touchAction: "none",
          width: "100%",
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

/* --- VerticalBar ----------------------------------------------------------- */
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
    const tm = (e) => {
      if (drag.current && e.touches[0]) compute(e.touches[0].clientY);
    };
    const mu = () => {
      drag.current = false;
    };
    window.addEventListener("pointermove", mm);
    window.addEventListener("touchmove", tm, { passive: true });
    window.addEventListener("pointerup", mu);
    window.addEventListener("touchend", mu);
    return () => {
      window.removeEventListener("pointermove", mm);
      window.removeEventListener("touchmove", tm);
      window.removeEventListener("pointerup", mu);
      window.removeEventListener("touchend", mu);
    };
  }, [isInteractive, compute]);

  const pct = clamp(((value - visMin) / (visMax - visMin)) * 100, 0, 100);
  const circleTop = `${100 - pct}%`;

  const displayVal = Number.isInteger(value)
    ? value.toFixed(0)
    : value.toFixed(1);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flex: 1,
      }}
    >
      <div
        style={{
          fontWeight: 700,
          fontSize: `clamp(11px, ${titleSize}px, 2vw + 8px)`,
          marginBottom: 6,
          textAlign: "center",
          lineHeight: 1.25,
          wordBreak: "break-word",
          maxWidth: "100%",
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
        onTouchStart={
          isInteractive
            ? (e) => {
                drag.current = true;
                compute(e.touches[0].clientY);
              }
            : undefined
        }
        style={{
          width: "100%",
          maxWidth: barW,
          minHeight: barH,
          flex: 1,
          background: bgColor,
          position: "relative",
          paddingTop: 18,
          paddingBottom: circleSize / 2 + 12,
          cursor: isInteractive ? "ns-resize" : "default",
          touchAction: "none",
          userSelect: "none",
        }}
      >
        {ticks.map(({ label, pct: tp }) => (
          <div
            key={label}
            style={{
              position: "absolute",
              top: `calc(${tp}% * 0.9 + 5%)`,
              transform: "translateY(-50%)",
              width: "100%",
              textAlign: "center",
              fontSize: `clamp(7px, ${tickFontSize}px, 1.4vw + 4px)`,
              color: "#fff",
              fontWeight: 600,
              pointerEvents: "none",
              lineHeight: 1,
              overflow: "hidden",
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
            maxWidth: "90%",
            maxHeight: "90%",
            borderRadius: "50%",
            background: circleColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: Math.max(8, Math.round(circleSize * 0.3)),
            color: "#111",
            boxShadow: "0 2px 8px rgba(0,0,0,0.22)",
            pointerEvents: "none",
            zIndex: 2,
            flexShrink: 0,
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          {displayVal}
        </div>
      </div>
    </div>
  );
}

/* --- ABGTutor -------------------------------------------------------------- */
export default function ABGTutor() {
  const { unit } = usePressureUnit();
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "mobile";
  const isTablet = breakpoint === "tablet";

  const paco2Cfg = getPaco2Config(unit);
  const pao2Cfg = getPao2Config(unit);

  const [paco2, setPaco2] = useState(paco2Cfg.normal);
  const [ph, setPh] = useState(7.4);
  const [pao2, setPao2] = useState(pao2Cfg.normal);
  const [fio2, setFio2] = useState(0.21);
  const [popupOpen, setPopupOpen] = useState(false);
  const [previousUnit, setPreviousUnit] = useState(unit);

  /* reset to normal on unit change */
  useEffect(() => {
    if (previousUnit === unit) return;
    setPaco2(paco2Cfg.normal);
    setPao2(pao2Cfg.normal);
    setPreviousUnit(unit);
  }, [unit, previousUnit, paco2Cfg.normal, pao2Cfg.normal]);

  /* close popup when user changes PaCO2 back to normal */
  useEffect(() => {
    if (Math.abs(paco2 - paco2Cfg.normal) <= 0.05) setPopupOpen(false);
  }, [paco2, paco2Cfg.normal]);

  const paco2Mmhg = unit === "kPa" ? kpaToMmhg(paco2) : paco2;

  const hco3 = useMemo(
    () => Math.round(calcHCO3(ph, paco2Mmhg)),
    [ph, paco2Mmhg],
  );
  const aaGrad = useMemo(
    () => calcAA(pao2, fio2, paco2, unit),
    [pao2, fio2, paco2, unit],
  );
  const diagnosis = useMemo(() => diagnose(ph, paco2Mmhg), [ph, paco2Mmhg]);

  const isChanged = Math.abs(paco2 - paco2Cfg.normal) > 0.05;
  const extTarget = useMemo(() => {
    /*
     * pH-dependent HCO3 thresholds via piecewise linear interpolation.
     *
     * Anion Gap upper HCO3 calibration:
     *   pH 6.80→34, 7.00→32, 7.26→25, 7.40→10, 7.60→8
     *
     * Metabolic Alkalosis lower HCO3 calibration:
     *   pH <7.35 → disabled (acidemia)
     *   pH 7.40→26, 7.60→21, 7.85→19
     */
    const piecewise = (x, pts) => {
      if (x <= pts[0][0]) return pts[0][1];
      for (let i = 0; i < pts.length - 1; i++) {
        if (x <= pts[i + 1][0]) {
          const [x0, y0] = pts[i], [x1, y1] = pts[i + 1];
          return y0 + ((x - x0) / (x1 - x0)) * (y1 - y0);
        }
      }
      return pts[pts.length - 1][1];
    };

    const agMax = piecewise(ph, [
      [6.80, 34], [7.00, 32], [7.26, 25], [7.40, 10], [7.60, 8],
    ]);

    const maDisabled = ph < 7.35;
    const maMin = piecewise(ph, [
      [7.35, 26], [7.40, 26], [7.60, 21], [7.85, 19],
    ]);

    const h = hco3;

    if (h >= 1 && h <= agMax) {
      return { label: "Anion Gap", url: "https://abg.leadows.com/anion-gap/" };
    }

    if (!maDisabled && h >= maMin) {
      return {
        label: "Metabolic Alkalosis",
        url: "https://abg.leadows.com/metabolic-alkalosis/",
      };
    }

    return null;
  }, [ph, hco3]);
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

  /* PaCO2 ticks */
  const paco2Ticks = useMemo(() => {
    const tickStep = unit === "kPa" ? 2 : 16;
    const values = [];
    for (let n = paco2Cfg.max; n >= 0; n -= tickStep) values.push(n);
    return values.map((n) => ({
      label: n.toFixed(unit === "kPa" ? 1 : 0),
      pct: ((paco2Cfg.max - n) / paco2Cfg.max) * 100,
    }));
  }, [unit, paco2Cfg.max]);

  /* HCO3 ticks */
  const hco3Ticks = useMemo(() => {
    const tickStep = isMobile ? 25 : isTablet ? 20 : 10;
    return Array.from({ length: Math.floor(100 / tickStep) + 1 }, (_, i) => {
      const n = 100 - i * tickStep;
      return { label: String(n), pct: i * tickStep };
    });
  }, [isMobile, isTablet]);

  /* Responsive sizing */
  const barH = isMobile ? 240 : isTablet ? 340 : 460;
  const barW = isMobile ? 44 : isTablet ? 62 : 88;
  const circSz = isMobile ? 32 : isTablet ? 42 : 54;
  const tickFont = isMobile ? 9 : isTablet ? 12 : 16;
  const titleSz = isMobile ? 13 : isTablet ? 17 : 24;

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .abg-root {
          font-family: 'Segoe UI', system-ui, sans-serif;
          background: #e8e8e8;
          min-height: 100vh;
          width: 100%;
          padding: 28px 16px 48px;
        }

        .abg-grid {
          width: 100%;
          max-width: 960px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(0, 110px) minmax(0, 1fr) minmax(0, 110px);
          gap: 20px;
          align-items: stretch;
        }

        .abg-side {
          background: #fff;
          padding: 14px 8px 18px;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          overflow: visible;
        }

        .abg-center {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .interp-box {
          background: transparent;
          min-height: 160px;
          padding: 16px 14px 18px;
          text-align: center;
          display: flex;
          flex-direction: column;
        }
        .interp-box h2 { font-size: 22px; font-weight: 700; margin-bottom: 14px; }
        .interp-body   { font-size: 17px; line-height: 1.55; }

        .sliders-box      { background: transparent; padding: 12px 12px 24px; }
        .s-row            { margin-bottom: 14px; }
        .s-row:last-child { margin-bottom: 0; }
        .s-label          { font-size: 16px; margin-bottom: 2px; }
        .s-val            { font-size: 13px; color: #555; margin-bottom: 3px; }
        input[type=range] { width: 100%; accent-color: #4a9ab5; cursor: pointer; }

        .ph-wrap  { position: relative; width: 100%; }
        .ph-title { text-align: center; font-size: 18px; margin: 14px 0 8px; }

        .popup-wrap { position: relative; width: 100%; }

        .ext-btn {
          width: 100%;
          height: 76px;
          background: #245576;
          color: #fff;
          border: none;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          margin-top: 18px;
          transition: background 0.2s ease;
        }
        .ext-btn:hover:not(:disabled) { background: #1d4560; }
        .ext-btn:disabled { background: #d1d5db; color: #666; cursor: not-allowed; }

        .popup {
          position: absolute;
          bottom: calc(100% + 10px);
          left: 50%;
          transform: translateX(-50%);
          background: #f4f4f4;
          border: 1px solid #c9c9c9;
          border-radius: 14px;
          box-shadow: 0 18px 40px rgba(0,0,0,0.22);
          padding: 20px 22px 22px;
          text-align: center;
          width: 260px;
          z-index: 30;
        }
        .popup-title { font-size: 16px; font-weight: 700; margin-bottom: 16px; }
        .popup-btn {
          width: 100%; border: none;
          background: #e5e5e5; padding: 12px 10px;
          font-size: 15px; cursor: pointer; border-radius: 6px;
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

        .flowchart-btn {
          width: 44px; height: 44px; border-radius: 50%;
          border: 1.5px solid #a00;
          display: flex; align-items: center; justify-content: center;
          color: #a00; cursor: pointer; background: #fff;
          margin-bottom: 8px; transition: background 0.15s;
        }
        .flowchart-btn:hover { background: #ffeaea; }

        @media (max-width: 900px) {
          .abg-root  { padding: 18px 10px 36px; }
          .abg-grid  {
            grid-template-columns: minmax(0, 80px) minmax(0, 1fr) minmax(0, 80px);
            gap: 10px;
          }
          .abg-side  { padding: 10px 5px 14px; }
          .interp-box          { min-height: 130px; padding: 12px 8px 14px; }
          .interp-box h2       { font-size: 16px; margin-bottom: 10px; }
          .interp-body         { font-size: 13px; }
          .sliders-box         { padding: 10px 8px 18px; }
          .s-row               { margin-bottom: 10px; }
          .s-label             { font-size: 13px; }
          .s-val               { font-size: 11px; }
          .ph-title            { font-size: 15px; margin: 10px 0 6px; }
          .ext-btn             { height: 64px; font-size: 12px; margin-top: 14px; }
          .popup               { width: min(240px, 88vw); }
          .flowchart-btn       { width: 36px; height: 36px; }
          .flowchart-btn svg   { width: 18px; height: 18px; }
        }

        @media (max-width: 480px) {
          .abg-root  { padding: 10px 4px 28px; }
          .abg-grid  {
            grid-template-columns: minmax(0, 58px) minmax(0, 1fr) minmax(0, 58px);
            gap: 4px;
          }
          .abg-side  { padding: 6px 2px 10px; }
          .interp-box          { min-height: 100px; padding: 8px 4px 10px; }
          .interp-box h2       { font-size: 12px; margin-bottom: 8px; }
          .interp-body         { font-size: 10px; line-height: 1.4; }
          .sliders-box         { padding: 6px 4px 12px; }
          .s-row               { margin-bottom: 8px; }
          .s-label             { font-size: 11px; }
          .s-val               { font-size: 9px; }
          .ph-title            { font-size: 12px; margin: 8px 0 5px; }
          .ext-btn             { height: 48px; font-size: 10px; margin-top: 10px; }
          .popup               { width: min(200px, 86vw); padding: 10px 10px 12px; }
          .popup-title         { font-size: 11px; margin-bottom: 8px; }
          .popup-btn           { font-size: 10px; padding: 7px 5px; }
          .flowchart-btn       { width: 28px; height: 28px; margin-bottom: 4px; }
          .flowchart-btn svg   { width: 14px; height: 14px; }
        }
      `}</style>

      <div className="abg-root">
        <div className="abg-grid">
          {/* LEFT - PaCO2 */}
          <div className="abg-side">
            <VerticalBar
              title={`PaCO<sub>2</sub><br/><span style="font-size:0.6em;font-weight:500">(${unit})</span>`}
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
            {/* Interpretation box */}
            <div
              className="interp-box"
              style={{ visibility: paco2 <= 0.7 ? "hidden" : "visible" }}
            >
              <h2>Interpretation</h2>
              <div className="interp-body">
                <div>&#8226; {diagnosis.secondary}</div>
                <div style={{ marginTop: 6 }}>
                  &#8226; A/a Gradient of {aaGrad}
                </div>
              </div>
            </div>

            {/* pH scale + flowchart button */}
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
                  className="flowchart-btn"
                  onClick={() => {
                    window.location.href = flowUrl;
                  }}
                  title={
                    isAcidic ? "Acidosis Flowchart" : "Alkalosis Flowchart"
                  }
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") window.location.href = flowUrl;
                  }}
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

            {/* PaO2 + FiO2 sliders */}
            <div className="sliders-box">
              <div className="s-row">
                <label className="s-label" htmlFor="pao2-slider">
                  PaO<sub>2</sub> ({unit})
                </label>
                <div className="s-val">{pao2.toFixed(pao2Cfg.dec)}</div>
                <input
                  id="pao2-slider"
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
                <label className="s-label" htmlFor="fio2-slider">
                  FiO<sub>2</sub>
                </label>
                <div className="s-val">{fio2.toFixed(2)}</div>
                <input
                  id="fio2-slider"
                  type="range"
                  min={0.21}
                  max={1}
                  step={0.01}
                  value={fio2}
                  onChange={(e) => setFio2(clamp(+e.target.value, 0.21, 1))}
                />
              </div>
            </div>

            {/* Extended ABG popup + button */}
            <div className="popup-wrap">
              {isChanged && popupOpen && extTarget && (
                <div className="popup">
                  <div className="popup-title">Extended ABG</div>
                  <button
                    className="popup-btn"
                    onClick={() => {
                      window.location.href = extTarget.url;
                    }}
                  >
                    {extTarget.label}
                  </button>
                  <div className="popup-arrow" />
                </div>
              )}
              <button
                className="ext-btn"
                disabled={!isChanged || !extTarget}
                onClick={() =>
                  extTarget && isChanged && setPopupOpen((p) => !p)
                }
              >
                Press For Extended ABG
              </button>
            </div>
          </div>

          {/* RIGHT - HCO3 */}
          <div className="abg-side">
            <VerticalBar
              title="HCO<sub>3</sub><sup>&#8722;</sup>"
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
