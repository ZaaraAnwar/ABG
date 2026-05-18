import { useState, useEffect } from "react"; // 📱

// 📱
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

export default function ResultsPanel({
  activeTab,
  activeSat,
  activePO2,
  stepPO2,
  hb,
  setHb,
  strokeVolume,
  setStrokeVolume,
  contentO2,
  do2,
}) {
  const isMobile = useWindowWidth() < 640; // 📱

  const cellFontSize = isMobile ? 20 : 32;   // 📱
  const cellPadding  = isMobile ? "8px 2px" : "12px 4px"; // 📱

  return (
    <div
      style={{
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
        border: "1px solid #d0d0d0",
      }}
    >
      {activeTab === "o2" ? (
        <>
          <div style={gridStyle}>
            <div style={cellHeader(isMobile)}>Hb Saturation</div>
            <div style={cellHeader(isMobile)}>PaO₂</div>
            <div style={cellHeader(isMobile)}>Hb(g/dl)</div>
          </div>

          <div style={gridStyle}>
            <div style={redCell(cellFontSize, cellPadding)}>{Math.round(activeSat)}%</div>

            <div style={purpleCell(cellFontSize, cellPadding)}>
              <button style={inlineBtnStyle} onClick={() => stepPO2(-1)}>−</button>
              <span style={{ margin: isMobile ? "0 6px" : "0 12px" }}>{Math.round(activePO2)}</span>
              <button style={inlineBtnStyle} onClick={() => stepPO2(1)}>+</button>
            </div>

            <div style={redCell(cellFontSize, cellPadding)}>
              <button style={inlineBtnStyle} onClick={() => setHb((h) => Math.max(1, h - 1))}>−</button>
              <span style={{ margin: isMobile ? "0 6px" : "0 12px" }}>{hb}</span>
              <button style={inlineBtnStyle} onClick={() => setHb((h) => Math.min(25, h + 1))}>+</button>
            </div>
          </div>

          <div style={resultLabel}>Content of O₂</div>
          <div style={resultValue(isMobile)}>{contentO2}</div>
        </>
      ) : (
        <>
          <div style={gridStyle}>
            <div style={cellHeader(isMobile)}>Hb Saturation</div>
            <div style={cellHeader(isMobile)}>Stroke Vol</div>
            <div style={cellHeader(isMobile)}>Hb(g/dl)</div>
          </div>

          <div style={gridStyle}>
            <div style={redCell(cellFontSize, cellPadding)}>{Math.round(activeSat)}%</div>

            <div style={purpleCell(cellFontSize, cellPadding)}>
              <button
                style={inlineBtnStyle}
                onClick={() => setStrokeVolume((v) => Math.max(10, v - 1))}
              >
                −
              </button>
              <span style={{ margin: isMobile ? "0 6px" : "0 12px" }}>{strokeVolume}</span>
              <button
                style={inlineBtnStyle}
                onClick={() => setStrokeVolume((v) => Math.min(200, v + 1))}
              >
                +
              </button>
            </div>

            <div style={redCell(cellFontSize, cellPadding)}>
              <span>{hb}</span>
            </div>
          </div>

          <div style={resultLabel}>Delivery of Oxygen (DO₂)</div>
          <div style={resultValue(isMobile)}>{do2}</div>
        </>
      )}
    </div>
  );
}

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
};

// 📱 converted to functions so they accept isMobile / dynamic values
const cellHeader = (isMobile) => ({
  background: "#c8d0e0",
  padding: isMobile ? "8px 4px" : "10px 8px",
  textAlign: "center",
  fontSize: isMobile ? 10 : 12,
  fontWeight: 700,
  color: "#333",
  borderRight: "1px solid #bbb",
});

const redCell = (fontSize, padding) => ({
  background: "linear-gradient(180deg, #cc0000, #b80000)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding,
  color: "#fff",
  fontSize,
  fontWeight: 800,
});

const purpleCell = (fontSize, padding) => ({
  background: "linear-gradient(180deg, #8a50b0, #5a2d82)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding,
  color: "#fff",
  fontSize,
  fontWeight: 800,
});

const resultLabel = {
  background: "#f0f0f0",
  textAlign: "center",
  padding: 6,
  fontSize: 12,
  fontWeight: 700,
  color: "#333",
};

const resultValue = (isMobile) => ({
  background: "linear-gradient(90deg, #6a8ec0, #cc4444)",
  textAlign: "center",
  padding: isMobile ? 8 : 10,
  color: "#fff",
  fontSize: isMobile ? 15 : 18,
  fontWeight: 700,
});

const inlineBtnStyle = {
  background: "transparent",
  border: "none",
  color: "#fff",
  fontSize: "inherit",
  fontWeight: "inherit",
  cursor: "pointer",
  padding: 0,
};