import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePressureUnit } from "../../context/PressureUnitContext";
import {
  getCO2Factor,
  getPaco2Range,
  getNormalPaco2,
} from "../../utils/pressureUnit";

/* ─── Constants ─────────────────────────────────────────────────── */
const HCO3_MIN = 1.0;
const HCO3_MAX = 100.0;
const NORMAL_HCO3 = 24.0;

const KIDNEY_IMAGE =
  "https://abg.leadows.com/wp-content/uploads/2026/04/ChatGPT-Image-Apr-23-2026-12_50_29-PM.png";
const LUNG_IMAGE =
  "https://abg.leadows.com/wp-content/uploads/2026/04/WhatsApp-Image-2026-04-23-at-12.38.48-PM.jpeg";

/* ─── Helpers ────────────────────────────────────────────────────── */
function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }
function round1(v) { return Math.round(v * 10) / 10; }
function getHco3Color(v) { return v <= NORMAL_HCO3 ? "#73be28" : "#1d2cff"; }
function getPaco2Color(v, norm) { return v <= norm ? "#73be28" : "#ff1f1f"; }

/* ─── EquationSlider (unchanged from original) ───────────────────── */
let _sliderId = 0;
function EquationSlider({ label, value, min, max, step, leftText, rightText, thumbColor, onChange }) {
  const [uid] = useState(() => `hh-sl-${++_sliderId}`);
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div style={{ marginBottom: 36 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, marginBottom: 14 }}>
        <div style={{ fontSize: 22, fontWeight: 400, color: "#444", minWidth: 100 }}>{label}</div>
        <div style={{ minWidth: 90, textAlign: "center", fontSize: 20, color: "#333", padding: "10px 16px", border: "1.5px solid #d9d9d9", borderRadius: 10, background: "#fff" }}>
          {value.toFixed(1)}
        </div>
      </div>

      <input
        type="range"
        id={uid}
        min={min}
        max={max}
        step={step}
        value={value}
        style={{
          "--tc": thumbColor,
          "--progress": `${percentage}%`,
          width: "100%",
          appearance: "none",
          WebkitAppearance: "none",
          background: "transparent",
          margin: 0,
          outline: "none",
          display: "block",
        }}
        onChange={(e) => onChange(Number(e.target.value))}
      />

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 14, color: "#999" }}>
        <span>{leftText}</span>
        <span>{rightText}</span>
      </div>

      <style>{`
        #${uid} { outline: none; -webkit-tap-highlight-color: transparent; }
        #${uid}:focus { outline: none; }
        #${uid}::-webkit-slider-runnable-track {
          height: 5px; border-radius: 999px;
          background: linear-gradient(to right, var(--tc, #73be28) 0%, var(--tc, #73be28) var(--progress), #d0d0d0 var(--progress), #d0d0d0 100%);
        }
        #${uid}::-webkit-slider-thumb {
          -webkit-appearance: none; width: 28px; height: 28px; border-radius: 50%;
          background: var(--tc, #73be28); border: 3px solid #fff; margin-top: -11.5px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.20); cursor: pointer; outline: none;
        }
        #${uid}:focus::-webkit-slider-thumb { outline: none; box-shadow: 0 2px 8px rgba(0,0,0,0.20); }
        #${uid}::-moz-range-track { height: 5px; border-radius: 999px; background: #d0d0d0; }
        #${uid}::-moz-range-progress { height: 5px; border-radius: 999px; background: var(--tc, #73be28); }
        #${uid}::-moz-range-thumb {
          width: 28px; height: 28px; border-radius: 50%;
          background: var(--tc, #73be28); border: 3px solid #fff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.20); cursor: pointer; outline: none;
        }
        #${uid}:focus::-moz-range-thumb { outline: none; box-shadow: 0 2px 8px rgba(0,0,0,0.20); }
      `}</style>
    </div>
  );
}

/* ─── Formula stage renderer ─────────────────────────────────────── */
/*
  Stages:
    0  pH = pKa + log10( HCO3⁻ / H2CO3 )          ← base / idle
    1  pH = 6.1  + log10( HCO3⁻ / H2CO3 )
    2  pH = 6.1  + log10( HCO3⁻ / (0.23 × PaCO2) )
    3  pH = 6.1  + log10( HCO3⁻ / (0.23 × paco2v) )
    4  pH = 6.1  + log10( hco3v  / (0.23 × paco2v) )
    5  pH = 6.1  + logVal
    6  pH = phResult
*/
function FormulaContent({ stage, frozen, activeOrgan }) {
  const { hco3, paco2, logVal, phResult } = frozen;

  const baseStyle = {
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: 22,
    color: "#333",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    flexWrap: "wrap",
    minHeight: 60,
  };

  /* Stage 6 — final pH */
  if (stage === 6) {
    return (
      <div style={{ ...baseStyle, gap: 10 }}>
        <span style={{ fontStyle: "italic" }}>pH</span>
        <span>=</span>
        <span style={{ color: "#7a5a91", fontWeight: 700, fontSize: 28 }}>{phResult}</span>
      </div>
    );
  }

  /* Stage 5 — pH = 6.1 + logVal */
  if (stage === 5) {
    return (
      <div style={baseStyle}>
        <span style={{ fontStyle: "italic" }}>pH</span>
        <span style={{ margin: "0 4px" }}>=</span>
        <span>6.1</span>
        <span style={{ margin: "0 4px" }}>+</span>
        <span style={{ color: "#7a5a91" }}>{logVal.toFixed(3)}</span>
      </div>
    );
  }

  /* Stages 0-4 — fraction form */
  const numGlow = activeOrgan === "kidney"
    ? { color: "#1d2cff", textShadow: "0 0 10px rgba(29,44,255,0.35)" }
    : {};
  const denGlow = activeOrgan === "lungs"
    ? { color: "#c0392b", textShadow: "0 0 10px rgba(192,57,43,0.35)" }
    : {};

  /* pKa part */
  const pKaPart = stage === 0
    ? (
      <>
        <span style={{ fontStyle: "italic" }}>pK</span>
        <sub style={{ fontStyle: "italic", fontSize: 14, marginLeft: -2 }}>a</sub>
      </>
    )
    : <span>6.1</span>;

  /* Numerator */
  const numerator = stage >= 4
    ? <span style={{ fontStyle: "italic", ...numGlow }}>{hco3.toFixed(1)}</span>
    : (
      <span style={{ fontStyle: "italic", ...numGlow }}>
        HCO<sub style={{ fontSize: 13 }}>3</sub><sup style={{ fontSize: 13 }}>−</sup>
      </span>
    );

  /* Denominator */
  let denominator;
  if (stage <= 1) {
    denominator = (
      <span style={{ fontStyle: "italic", ...denGlow }}>
        H<sub style={{ fontSize: 13 }}>2</sub>CO<sub style={{ fontSize: 13 }}>3</sub>
      </span>
    );
  } else if (stage === 2) {
    denominator = (
      <span style={{ fontStyle: "italic", ...denGlow }}>
        ({frozen.co2Factor} × PaCO<sub style={{ fontSize: 13 }}>2</sub>)
      </span>
    );
  } else {
    /* stage 3, 4 */
    denominator = (
      <span style={{ ...denGlow }}>
        ({frozen.co2Factor} × {paco2.toFixed(1)})
      </span>
    );
  }

  return (
    <div style={baseStyle}>
      <span style={{ fontStyle: "italic" }}>pH</span>
      <span style={{ margin: "0 4px" }}>=</span>
      {pKaPart}
      <span style={{ margin: "0 4px" }}>+</span>
      <span style={{ fontStyle: "italic", marginRight: 2 }}>log</span>
      <sub style={{ fontSize: 14, marginLeft: -2, marginRight: 4 }}>10</sub>
      <span style={{ fontSize: 26 }}>(</span>
      <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", verticalAlign: "middle" }}>
        <span style={{ borderBottom: "1.5px solid #333", paddingBottom: 3, paddingLeft: 4, paddingRight: 4 }}>
          {numerator}
        </span>
        <span style={{ paddingTop: 3 }}>{denominator}</span>
      </span>
      <span style={{ fontSize: 26 }}>)</span>
    </div>
  );
}

/* ─── AnimatedFormula wrapper ────────────────────────────────────── */
function AnimatedFormula({ stage, annotation, frozen, activeOrgan }) {
  return (
    <div style={{ margin: "16px 0 28px" }}>
      {/* Formula — crossfades between stages */}
      <div style={{ minHeight: 68, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.58, ease: "easeInOut" }}
            style={{ width: "100%" }}
          >
            <FormulaContent stage={stage} frozen={frozen} activeOrgan={activeOrgan} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Annotation line — fades in/out beneath formula */}
      <div style={{ minHeight: 28, textAlign: "center", marginTop: 6 }}>
        <AnimatePresence mode="wait">
          {annotation && (
            <motion.div
              key={annotation}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{
                fontSize: 14,
                color: "#7a5a91",
                fontWeight: 500,
                fontStyle: "italic",
                letterSpacing: 0.2,
              }}
            >
              {annotation}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─── OrganImage with pulse glow ─────────────────────────────────── */
function OrganImage({ src, alt, width = 120, marginBottom = 24, marginTop = 0, isActive = false, glowColor = "rgba(115,190,40,0.7)" }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop, marginBottom }}>
      <motion.div
        animate={
          isActive
            ? {
                filter: [
                  `drop-shadow(0 0 3px ${glowColor})`,
                  `drop-shadow(0 0 14px ${glowColor})`,
                  `drop-shadow(0 0 3px ${glowColor})`,
                ],
                scale: [1, 1.045, 1],
              }
            : {
                filter: "drop-shadow(0 0 0px rgba(0,0,0,0))",
                scale: 1,
              }
        }
        transition={
          isActive
            ? { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.5, ease: "easeOut" }
        }
      >
        <img
          src={src}
          alt={alt}
          style={{ width, height: "auto", objectFit: "contain", display: "block" }}
        />
      </motion.div>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────── */
export default function DynamicHHEquation() {
  const { unit } = usePressureUnit();

  const CO2_FACTOR = getCO2Factor(unit);
  const { min: PACO2_MIN, max: PACO2_MAX } = getPaco2Range(unit);
  const normalPaco2 = getNormalPaco2(unit);

  /* Slider values */
  const [hco3, setHco3] = useState(24.0);
  const [paco2, setPaco2] = useState(() => getNormalPaco2(unit));
  const [previousUnit, setPreviousUnit] = useState(unit);

  /* Reset on unit change (unchanged logic) */
  useEffect(() => {
    if (previousUnit === unit) return;
    setHco3(24.0);
    setPaco2(getNormalPaco2(unit));
    setPreviousUnit(unit);
  }, [unit, previousUnit]);

  /* pH calculation (unchanged) */
  const ph = useMemo(() => {
    if (hco3 <= 0 || paco2 <= 0) return 0;
    return 6.1 + Math.log10(hco3 / (CO2_FACTOR * paco2));
  }, [hco3, paco2, CO2_FACTOR]);

  const displayedPh = ph > 0 ? round1(ph) : 0.0;
  const hco3Color = getHco3Color(hco3);
  const paco2Color = getPaco2Color(paco2, normalPaco2);

  /* ── Animation state ── */
  const [isPlaying, setIsPlaying] = useState(false);
  const [formulaStage, setFormulaStage] = useState(0);
  const [annotation, setAnnotation] = useState(null);
  const [activeOrgan, setActiveOrgan] = useState(null);

  /* Frozen snapshot used during animation so sliders don't break it */
  const [frozenValues, setFrozenValues] = useState(() => {
    const p = getNormalPaco2("mmHg");
    const cf = getCO2Factor("mmHg");
    const h = 24.0;
    const lv = Math.log10(h / (cf * p));
    return { hco3: h, paco2: p, co2Factor: cf, logVal: lv, phResult: (6.1 + lv).toFixed(2) };
  });

  const timeoutsRef = useRef([]);

  /* Cleanup on unmount */
  useEffect(() => {
    return () => timeoutsRef.current.forEach(clearTimeout);
  }, []);

  /* ── Stop animation ── */
  function stopAnimation() {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setIsPlaying(false);
    setFormulaStage(0);
    setAnnotation(null);
    setActiveOrgan(null);
  }

  /* ── Play animation ── */
  function playAnimation() {
    /* Capture current values as a snapshot */
    const h = hco3;
    const p = paco2;
    const cf = CO2_FACTOR;
    const logVal = Math.log10(h / (cf * p));
    const phResult = (6.1 + logVal).toFixed(2);

    setFrozenValues({ hco3: h, paco2: p, co2Factor: cf, logVal, phResult });
    setIsPlaying(true);
    setFormulaStage(0);
    setAnnotation(null);
    setActiveOrgan(null);

    /* Clear any leftover timers */
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    const sched = (fn, delay) => {
      const id = setTimeout(fn, delay);
      timeoutsRef.current.push(id);
    };

    let t = 0;

    /* Step 1 — pKa annotation */
    sched(() => {
      setAnnotation("pKa for bicarbonate buffer is 6.1");
      setFormulaStage(0);
      setActiveOrgan(null);
    }, t);
    t += 3500;

    /* Step 2 — substitute pKa → 6.1 in formula */
    sched(() => {
      setAnnotation(null);
      setFormulaStage(1);
    }, t);
    t += 2200;

    /* Step 3 — H2CO3 equation annotation + lung glow */
    sched(() => {
      setAnnotation(`H₂CO₃ = ${cf} × PaCO₂`);
      setActiveOrgan("lungs");
    }, t);
    t += 3500;

    /* Step 4 — PaCO2 value annotation */
    sched(() => {
      setAnnotation(`Value for PaCO₂ is ${p.toFixed(1)} ${unit}`);
    }, t);
    t += 3000;

    /* Step 5 — substitute denominator symbols */
    sched(() => {
      setAnnotation(null);
      setFormulaStage(2);
    }, t);
    t += 2000;

    /* Step 6 — substitute PaCO2 numeric value in denominator */
    sched(() => {
      setFormulaStage(3);
    }, t);
    t += 2500;

    /* Step 7 — HCO3 value annotation + kidney glow */
    sched(() => {
      setAnnotation(`Value for HCO₃⁻ is ${h.toFixed(1)} mEq/L`);
      setActiveOrgan("kidney");
    }, t);
    t += 3000;

    /* Step 8 — substitute HCO3 numeric value in numerator */
    sched(() => {
      setAnnotation(null);
      setFormulaStage(4);
    }, t);
    t += 3000;

    /* Step 9 — show simplified log value */
    sched(() => {
      setActiveOrgan(null);
      setFormulaStage(5);
    }, t);
    t += 3500;

    /* Step 10 — show final pH result */
    sched(() => {
      setFormulaStage(6);
    }, t);
    t += 4000;

    /* Step 11 — reset to idle */
    sched(() => {
      setFormulaStage(0);
      setAnnotation(null);
      setActiveOrgan(null);
      setIsPlaying(false);
    }, t);
  }

  /* ── Render ── */
  return (
    <div
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
      <div style={{ padding: "28px 28px 0" }}>

        {/* Animated formula — replaces static PhFormula */}
        <AnimatedFormula
          stage={formulaStage}
          annotation={annotation}
          frozen={frozenValues}
          activeOrgan={activeOrgan}
        />

        {/* Play / Stop button */}
        <div style={{ textAlign: "center", marginBottom: 18 }}>
          <button
            onClick={isPlaying ? stopAnimation : playAnimation}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 16,
              color: "#7a5a91",
              fontWeight: 600,
              fontFamily: "'Segoe UI', system-ui, sans-serif",
              padding: "4px 18px",
              borderRadius: 8,
              transition: "background 0.18s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(122,90,145,0.09)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}
          >
            {isPlaying ? "Stop" : "Play"}
          </button>
        </div>

        {/* Kidney */}
        <OrganImage
          src={KIDNEY_IMAGE}
          alt="Kidneys"
          width={110}
          marginBottom={28}
          isActive={activeOrgan === "kidney"}
          glowColor="rgba(29,44,255,0.65)"
        />

        {/* HCO3 slider */}
        <EquationSlider
          label={<>HCO<sub>3</sub><sup>−</sup></>}
          value={hco3}
          min={HCO3_MIN}
          max={HCO3_MAX}
          step={0.1}
          leftText="1.0"
          rightText="100.0"
          thumbColor={hco3Color}
          onChange={(val) => setHco3(round1(clamp(val, HCO3_MIN, HCO3_MAX)))}
        />

        {/* PaCO2 slider */}
        <EquationSlider
          label={<>PaCO<sub>2</sub> ({unit})</>}
          value={paco2}
          min={PACO2_MIN}
          max={PACO2_MAX}
          step={0.1}
          leftText={PACO2_MIN.toFixed(1)}
          rightText={PACO2_MAX.toFixed(1)}
          thumbColor={paco2Color}
          onChange={(val) => setPaco2(round1(clamp(val, PACO2_MIN, PACO2_MAX)))}
        />

        {/* Lungs */}
        <OrganImage
          src={LUNG_IMAGE}
          alt="Lungs"
          width={110}
          marginTop={6}
          marginBottom={28}
          isActive={activeOrgan === "lungs"}
          glowColor="rgba(192,57,43,0.65)"
        />

        {/* pH result box (unchanged) */}
        <div
          style={{
            textAlign: "center",
            background: "#faf8fc",
            border: "1px solid #ece6f6",
            borderRadius: 14,
            padding: "16px 20px",
            marginTop: 8,
          }}
        >
          <div style={{ fontSize: 13, color: "#7a5a91", marginBottom: 6, fontWeight: 600, letterSpacing: 0.3 }}>
            Calculated pH
          </div>
          <div style={{ fontSize: 34, color: "#1a1a2e", fontWeight: 500 }}>
            {displayedPh.toFixed(1)}
          </div>
          <div style={{ fontSize: 12, color: "#aaa", marginTop: 6 }}>
            pH = 6.1 + log₁₀(HCO₃⁻ / ({CO2_FACTOR} × PaCO₂))
          </div>
        </div>

      </div>
    </div>
  );
}
