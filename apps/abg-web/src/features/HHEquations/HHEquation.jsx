import React, { useState, useEffect } from "react";
import Slider from "../../components/Slider";
import { usePressureUnit } from "../../context/PressureUnitContext";
import {
  getPaco2Range,
  getNormalPaco2,
  kpaToMmhg,
} from "../../utils/pressureUnit";
import {
  calculatePh as calcPh,
  calcPco2,
  calcHco3,
  interpret,
} from "../../utils/abgMath";

const NORMAL_PH = 7.4;
const NORMAL_HCO3 = 24.0;

export default function HHEquation() {
  const { unit } = usePressureUnit();
  const { min: paco2Min, max: paco2Max } = getPaco2Range(unit);
  const normalPaco2 = getNormalPaco2(unit);

  const [locked, setLocked] = useState("paco2");
  const [previousUnit, setPreviousUnit] = useState(unit);

  const [vals, setVals] = useState({
    hco3: NORMAL_HCO3,
    ph: NORMAL_PH,
    paco2: normalPaco2,
  });

  // When unit changes, convert the paco2 value and reset to normal
  useEffect(() => {
    if (previousUnit === unit) return;
    setVals({ hco3: NORMAL_HCO3, ph: NORMAL_PH, paco2: normalPaco2 });
    setPreviousUnit(unit);
  }, [unit, previousUnit, normalPaco2]);

  const handleChange = (key, val) => {
    let newVals = { ...vals, [key]: val };

    // interpret() and calcPco2/calcHco3/calcPh all expect mmHg internally
    // so convert paco2 to mmHg before passing, then convert result back
    const paco2InMmhg =
      unit === "kPa" ? kpaToMmhg(newVals.paco2) : newVals.paco2;

    if (locked === "paco2") {
      const computed = calcPco2(newVals.hco3, newVals.ph); // returns mmHg
      newVals.paco2 = unit === "kPa" ? computed / 7.5006 : computed;
    } else if (locked === "ph") {
      newVals.ph = calcPh(newVals.hco3, paco2InMmhg);
    } else if (locked === "hco3") {
      newVals.hco3 = calcHco3(newVals.ph, paco2InMmhg);
    }

    setVals(newVals);
  };

  // For interpret(), always pass mmHg
  const paco2ForDiagnosis = unit === "kPa" ? kpaToMmhg(vals.paco2) : vals.paco2;
  const title = interpret(vals.ph, paco2ForDiagnosis);

  const displayTargetName =
    locked === "paco2" ? (
      <>
        PaCO<sub>2</sub>
      </>
    ) : locked === "ph" ? (
      "pH"
    ) : (
      <>
        HCO<sub>3</sub>
        <sup>−</sup>
      </>
    );

  const displayValue =
    locked === "paco2"
      ? vals.paco2.toFixed(unit === "kPa" ? 1 : 1)
      : locked === "ph"
        ? vals.ph.toFixed(2)
        : vals.hco3.toFixed(1);

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
      {/* <div
        style={{
          textAlign: "center",
          fontSize: 20,
          fontWeight: 700,
          color: "#6b4fa0",
          marginBottom: 24,
        }}
      >
        Henderson-Hasselbalch Equation
      </div> */}

      {/* Select value to calculate */}
      <div style={{ fontSize: 13, color: "#888", marginBottom: 10 }}>
        Select Value to Calculate
      </div>
      <div
        style={{
          display: "flex",
          borderRadius: 12,
          overflow: "hidden",
          border: "1.5px solid #d9d0e8",
          marginBottom: 28,
        }}
      >
        {["hco3", "ph", "paco2"].map((key, i) => {
          const isLocked = locked === key;
          const label =
            key === "hco3" ? (
              <>
                HCO<sub>3</sub>
                <sup>−</sup>
              </>
            ) : key === "ph" ? (
              "pH"
            ) : (
              <>
                PaCO<sub>2</sub>
              </>
            );
          return (
            <div
              key={key}
              onClick={() => setLocked(key)}
              style={{
                flex: 1,
                textAlign: "center",
                padding: "11px 0",
                background: isLocked ? "#7c6990" : "#f5f3f8",
                color: isLocked ? "#fff" : "#7c6990",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 14,
                borderRight: i < 2 ? "1.5px solid #d9d0e8" : "none",
                transition: "background 0.15s, color 0.15s",
              }}
            >
              {label}
            </div>
          );
        })}
      </div>

      {/* Calculated value display */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 28,
          padding: "20px 24px",
          background: "#f9f8fc",
          borderRadius: 14,
        }}
      >
        <div
          style={{
            fontSize: 13,
            color: "#7c6990",
            fontWeight: 600,
            marginBottom: 6,
          }}
        >
          Calculated {displayTargetName}
        </div>
        <div
          style={{
            fontSize: 38,
            fontWeight: 700,
            color: "#1a1a2e",
            marginBottom: 10,
          }}
        >
          {displayValue}
        </div>
        <div
          style={{
            fontSize: 15,
            fontWeight: 500,
            color: "#666",
            lineHeight: 1.5,
          }}
        >
          {title.split("\n").map((l, i) => (
            <div key={i}>{l}</div>
          ))}
        </div>
      </div>

      {/* Sliders */}
      <Slider
        label={
          <>
            PaCO<sub>2</sub> ({unit})
          </>
        }
        value={vals.paco2}
        min={paco2Min}
        max={paco2Max}
        step={unit === "kPa" ? 0.1 : 0.5}
        decimals={unit === "kPa" ? 1 : 1}
        thumbColor="#7c6990"
        disabled={locked === "paco2"}
        onChange={(v) => handleChange("paco2", v)}
      />
      <Slider
        label="pH"
        value={vals.ph}
        min={6.8}
        max={7.85}
        step={0.01}
        decimals={2}
        thumbColor="#0018ff"
        disabled={locked === "ph"}
        onChange={(v) => handleChange("ph", v)}
      />
      <Slider
        label={
          <>
            HCO<sub>3</sub>
            <sup>−</sup>
          </>
        }
        value={vals.hco3}
        min={1}
        max={100}
        step={0.5}
        decimals={1}
        thumbColor="#82bc35"
        disabled={locked === "hco3"}
        onChange={(v) => handleChange("hco3", v)}
      />

      <div
        style={{
          textAlign: "center",
          fontSize: 12,
          color: "#888",
          marginTop: 28,
          lineHeight: 1.7,
        }}
      >
        Calculate one of the three values by moving
        <br />
        rest of the <strong>TWO</strong> variables
      </div>
    </div>
  );
}
