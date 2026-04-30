import { usePressureUnit } from "../context/PressureUnitContext";

const units = ["mmHg", "kPa"];

export default function PressureUnits() {
  const { unit: selected, setUnit } = usePressureUnit();

  const handleSelect = (unit) => {
    setUnit(unit);
  };

  return (
    <div
      style={{
        width: "100%",
        padding: "48px 20px",
        boxSizing: "border-box",
        fontFamily:
          "'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif",
        background: "transparent",
      }}
    >
      <div
        style={{
          maxWidth: 640,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            textAlign: "center",
            fontSize: 28,
            fontWeight: 700,
            color: "#5a458c",
            marginBottom: 28,
            letterSpacing: "0.2px",
          }}
        >
          Pressure Units
        </div>

        <div
          style={{
            background: "#ffffff",
            borderRadius: 18,
            overflow: "hidden",
            border: "1px solid #e6e7ee",
            boxShadow: "0 6px 18px rgba(38, 39, 52, 0.06)",
          }}
        >
          {units.map((unit, index) => {
            const isSelected = selected === unit;

            return (
              <div
                key={unit}
                onClick={() => handleSelect(unit)}
                style={{
                  height: 68,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0 24px",
                  boxSizing: "border-box",
                  cursor: "pointer",
                  background: isSelected ? "#faf8ff" : "#ffffff",
                  borderBottom:
                    index !== units.length - 1
                      ? "1px solid #ececf3"
                      : "none",
                  transition: "background 0.18s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.background = "#f8f8fb";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isSelected
                    ? "#faf8ff"
                    : "#ffffff";
                }}
              >
                <span
                  style={{
                    fontSize: 20,
                    fontWeight: 500,
                    color: "#1f2430",
                  }}
                >
                  {unit}
                </span>

                <span
                  style={{
                    width: 24,
                    textAlign: "center",
                    fontSize: 22,
                    color: "#5a458c",
                    opacity: isSelected ? 1 : 0,
                    transform: isSelected ? "scale(1)" : "scale(0.7)",
                    transition: "all 0.18s ease",
                  }}
                >
                  ✓
                </span>
              </div>
            );
          })}
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: 14,
            fontSize: 14,
            color: "#7a7f8c",
          }}
        >
          Select the unit system used across the ABG calculations.
        </div>
      </div>
    </div>
  );
}