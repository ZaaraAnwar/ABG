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
            <div style={cellHeader}>Hb Saturation</div>
            <div style={cellHeader}>PaO₂</div>
            <div style={cellHeader}>Hb(g/dl)</div>
          </div>

          <div style={gridStyle}>
            <div style={redCell}>{activeSat.toFixed(0)}%</div>

            <div style={purpleCell}>
              <button style={inlineBtnStyle} onClick={() => stepPO2(-1)}>−</button>
              <span style={{ margin: "0 12px" }}>{Math.round(activePO2)}</span>
              <button style={inlineBtnStyle} onClick={() => stepPO2(1)}>+</button>
            </div>

            <div style={redCell}>
              <button style={inlineBtnStyle} onClick={() => setHb((h) => Math.max(1, h - 1))}>
                −
              </button>
              <span style={{ margin: "0 12px" }}>{hb}</span>
              <button style={inlineBtnStyle} onClick={() => setHb((h) => Math.min(25, h + 1))}>
                +
              </button>
            </div>
          </div>

          <div style={resultLabel}>Content of O₂</div>
          <div style={resultValue}>{contentO2}</div>
        </>
      ) : (
        <>
          <div style={gridStyle}>
            <div style={cellHeader}>Hb Saturation</div>
            <div style={cellHeader}>Stroke Vol</div>
            <div style={cellHeader}>Hb(g/dl)</div>
          </div>

          <div style={gridStyle}>
            <div style={redCell}>{activeSat.toFixed(0)}%</div>

            <div style={purpleCell}>
              <button
                style={inlineBtnStyle}
                onClick={() => setStrokeVolume((v) => Math.max(10, v - 1))}
              >
                −
              </button>

              <span style={{ margin: "0 12px" }}>{strokeVolume}</span>

              <button
                style={inlineBtnStyle}
                onClick={() => setStrokeVolume((v) => Math.min(200, v + 1))}
              >
                +
              </button>
            </div>

            <div style={redCell}>
              <span>{hb}</span>
            </div>
          </div>

          <div style={resultLabel}>Delivery of Oxygen (DO₂)</div>
          <div style={resultValue}>{do2}</div>
        </>
      )}
    </div>
  );
}

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
};

const cellHeader = {
  background: "#c8d0e0",
  padding: "10px 8px",
  textAlign: "center",
  fontSize: 12,
  fontWeight: 700,
  color: "#333",
  borderRight: "1px solid #bbb",
};

const redCell = {
  background: "linear-gradient(180deg, #cc0000, #b80000)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "12px 4px",
  color: "#fff",
  fontSize: 32,
  fontWeight: 800,
};

const purpleCell = {
  background: "linear-gradient(180deg, #8a50b0, #5a2d82)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "12px 4px",
  color: "#fff",
  fontSize: 32,
  fontWeight: 800,
};

const resultLabel = {
  background: "#f0f0f0",
  textAlign: "center",
  padding: 6,
  fontSize: 12,
  fontWeight: 700,
  color: "#333",
};

const resultValue = {
  background: "linear-gradient(90deg, #6a8ec0, #cc4444)",
  textAlign: "center",
  padding: 10,
  color: "#fff",
  fontSize: 18,
  fontWeight: 700,
};

const inlineBtnStyle = {
  background: "transparent",
  border: "none",
  color: "#fff",
  fontSize: "inherit",
  fontWeight: "inherit",
  cursor: "pointer",
  padding: 0,
};