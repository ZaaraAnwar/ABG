export default function ProbeTooltip({ probePos }) {
  if (!probePos) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: probePos.x + 14,
        top: Math.max(4, probePos.y - 34),
        background: "rgba(255,255,255,0.94)",
        border: "1.5px solid #7b5ea7",
        borderRadius: 8,
        padding: "4px 10px",
        fontSize: 10.5,
        fontWeight: 700,
        color: "#3d2060",
        pointerEvents: "none",
        whiteSpace: "nowrap",
        backdropFilter: "blur(4px)",
        boxShadow: "0 2px 8px rgba(107,79,160,0.2)",
        zIndex: 20,
      }}
    >
      PO₂ {probePos.po2.toFixed(1)} mmHg | Sat {probePos.sat.toFixed(1)}%
    </div>
  );
}