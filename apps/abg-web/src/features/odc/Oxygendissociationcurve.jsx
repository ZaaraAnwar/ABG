import { useState, useCallback, useEffect } from "react"; // added useEffect

import OdcCanvas from "./OdcCanvas";
import HeartRateControl from "./HeartRateControl";
import ShiftInfoBox from "./ShiftInfoBox";
import CalculationTabs from "./CalculationTabs";
import ResultsPanel from "./ResultsPanel";

import { hillSat, getP50 } from "./odcMath";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

// 📱 tiny hook — reused across files
function useWindowWidth() {
  const [width, setWidth] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 800
  );
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return width;
}

export default function OxygenDissociationCurve() {
  const windowWidth = useWindowWidth(); // 📱
  const isMobile = windowWidth < 640;  // 📱

  const [heartRate, setHeartRate] = useState(60);
  const [hb, setHb] = useState(5);
  const [strokeVolume, setStrokeVolume] = useState(90);
  const [interactivePO2, setInteractivePO2] = useState(20);
  const [shiftDir, setShiftDir] = useState("none");
  const [activeTab, setActiveTab] = useState("o2");

  const p50 = getP50(shiftDir);

  const baseVenousPO2 = Math.max(5, 40 - (heartRate - 60) * 0.15);

  const arterialPO2 = 100;
  const arterialSat = hillSat(arterialPO2, p50);

  const activePO2 = interactivePO2 !== null ? interactivePO2 : baseVenousPO2;
  const activeSat = hillSat(activePO2, p50);

  const contentO2 = (
    hb * 1.345 * (activeSat / 100) +
    activePO2 * 0.0031
  ).toFixed(2);

  const cardiacOutput = (heartRate * strokeVolume) / 1000;

  const caO2 = hb * 1.3442 * (activeSat / 100) + activePO2 * 0.0031;

  const do2 = (cardiacOutput * caO2 * 10).toFixed(2);

  const heartDuration = 60 / heartRate;

  const toggleShift = useCallback((dir) => {
    setShiftDir((prev) => (prev === dir ? "none" : dir));
    setInteractivePO2(20);
  }, []);

  const stepPO2 = useCallback(
    (delta) => {
      setInteractivePO2((prev) => {
        const currentPO2 = prev !== null ? prev : baseVenousPO2;
        return Math.max(0, Math.min(100, Math.round(currentPO2) + delta));
      });
    },
    [baseVenousPO2],
  );

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        background: "#fff",
        padding: isMobile ? "12px 8px" : "24px", // 📱
        width: "100%",
        maxWidth: "100%",
        margin: 0,
        boxSizing: "border-box",
        overflowX: isMobile ? "hidden" : undefined,
        position: "relative",
      }}
    >
      <div
        onClick={() => {
          window.location.href = "https://abg.leadows.com/about-odc/";
        }}
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          cursor: "pointer",
          zIndex: 10,
        }}
      >
        <InfoOutlinedIcon
          style={{
            fontSize: 26,
            color: "#6b4fa0",
          }}
        />
      </div>

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: isMobile ? 0 : 20, // 📱
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: isMobile ? 16 : 24,               // 📱
            alignItems: isMobile ? "center" : "flex-start", // 📱
            justifyContent: "center",
            flexDirection: isMobile ? "column" : "row", // 📱 key fix
            flexWrap: "nowrap",
            width: "100%",
          }}
        >
          {/* LEFT → CHART */}
          <OdcCanvas
            activePO2={activePO2}
            p50={p50}
            shiftDir={shiftDir}
            heartRate={heartRate}
            toggleShift={toggleShift}
            setInteractivePO2={setInteractivePO2}
          />

          {/* RIGHT → CONTROLS + CALCULATIONS */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              minWidth: isMobile ? 0 : 300,       
              flexShrink: 0,
              width: isMobile ? "100%" : undefined, 
              boxSizing: "border-box",
            }}
          >
            <HeartRateControl
              heartRate={heartRate}
              setHeartRate={setHeartRate}
              heartDuration={heartDuration}
            />

            <ShiftInfoBox shiftDir={shiftDir} />

            <CalculationTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />

            <ResultsPanel
              activeTab={activeTab}
              activeSat={activeSat}
              activePO2={activePO2}
              stepPO2={stepPO2}
              hb={hb}
              setHb={setHb}
              arterialSat={arterialSat}
              strokeVolume={strokeVolume}
              setStrokeVolume={setStrokeVolume}
              contentO2={contentO2}
              do2={do2}
            />

            {/* STATS BOX */}
            <div
              style={{
                background: "#fff",
                border: "2px solid #ddd6f0",
                borderRadius: 10,
                padding: "10px 16px",
                display: "flex",
                gap: 20,
                flexWrap: "wrap",
              }}
            >
              {[
                ["Active PO₂", `${activePO2.toFixed(1)} mmHg`],
                ["Hb Saturation", `${activeSat.toFixed(1)}%`],
                ["P50", `${p50} mmHg`],
                ["Cardiac Output", `${cardiacOutput.toFixed(2)} L/min`],
              ].map(([label, value]) => (
                <div key={label}>
                  <div
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      color: "#9b6bbf",
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                    }}
                  >
                    {label}
                  </div>

                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 800,
                      color: "#3d2060",
                      fontFamily: "monospace",
                    }}
                  >
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
      @keyframes heartbeat {
        0% { transform: scale(1); }
        15% { transform: scale(1.3); }
        30% { transform: scale(1); }
        45% { transform: scale(1.2); }
        60% { transform: scale(1); }
        100% { transform: scale(1); }
      }

      input[type="number"]::-webkit-inner-spin-button,
      input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      input[type="number"] {
        -moz-appearance: textfield;
      }

      body {
        margin: 0;
        padding: 0;
        overflow-x: hidden;
      }
    `}</style>
    </div>
  );
}