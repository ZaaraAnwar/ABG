export default function ShiftButton({ direction, active, onClick }) {
  const isLeft = direction === "left";

  return (
    <button
      onClick={onClick}
      title={isLeft ? "Left shift" : "Right shift"}
      style={{
        position: "absolute",
        top: isLeft ? 8 : "auto",
        bottom: isLeft ? "auto" : 12,
        left: isLeft ? 56 : "auto",
        right: isLeft ? "auto" : 16,
        width: 28,
        height: 28,
        borderRadius: 6,
        border: "1.5px solid rgba(255,255,255,0.5)",
        background: active
          ? isLeft
            ? "rgba(42,106,176,0.82)"
            : "rgba(224,90,138,0.82)"
          : "rgba(255,255,255,0.22)",
        color: active ? "#fff" : "rgba(60,20,100,0.85)",
        fontSize: 17,
        fontWeight: 900,
        cursor: "pointer",
        zIndex: 10,
      }}
    >
      {isLeft ? "←" : "→"}
    </button>
  );
}