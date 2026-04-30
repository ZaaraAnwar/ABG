export default function CalculationTabs({ activeTab, setActiveTab }) {
  return (
    <div style={{ display: "flex", gap: 10 }}>
      {["o2", "do2"].map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          style={{
            background:
              activeTab === tab
                ? "linear-gradient(135deg, #5a2d82, #8a50b0)"
                : "#c8c0d8",
            color: activeTab === tab ? "#fff" : "#7a6a8a",
            padding: "8px 18px",
            borderRadius: 20,
            fontSize: 13,
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
          }}
        >
          {tab === "o2" ? "Calculate O₂" : "Calculate DO₂"}
        </button>
      ))}
    </div>
  );
}