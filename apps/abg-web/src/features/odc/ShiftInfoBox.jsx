import { LEFT_SHIFT_LINES, RIGHT_SHIFT_LINES } from "./constants";

export default function ShiftInfoBox({ shiftDir }) {
  if (shiftDir === "none") return null;

  const isLeft = shiftDir === "left";
  const shiftLines = isLeft ? LEFT_SHIFT_LINES : RIGHT_SHIFT_LINES;

  return (
    <div
      style={{
        borderRadius: 10,
        padding: "10px 14px",
        border: `2px solid ${isLeft ? "#7ab4e8" : "#e05a8a"}`,
        background: isLeft ? "#e8f4ff" : "#fff0f5",
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.07em",
          marginBottom: 6,
          color: isLeft ? "#2a6ab0" : "#c03060",
        }}
      >
        {isLeft ? "← Left Shift — Causes" : "Right Shift → — Causes"}
      </div>

      {shiftLines.map((line, index) => (
        <div key={index} style={{ fontSize: 12, fontWeight: 600 }}>
          {line.arrow} {line.text}
        </div>
      ))}
    </div>
  );
}