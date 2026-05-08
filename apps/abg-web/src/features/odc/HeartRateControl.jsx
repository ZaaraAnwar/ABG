import { useState, useEffect } from "react"; // 📱

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

export default function HeartRateControl({ heartRate, setHeartRate, heartDuration }) {
  const isMobile = useWindowWidth() < 640; // 📱

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: isMobile ? "space-between" : "flex-end", // 📱
        gap: 10,
      }}
    >
      <span
        style={{
          color: "#5a2d82",
          fontWeight: 700,
          fontSize: 14,
          letterSpacing: "0.5px",
        }}
      >
        Heart Rate
      </span>

      <button onClick={() => setHeartRate((h) => Math.max(30, h - 10))}>−</button>

      <input
        type="number"
        value={heartRate}
        onChange={(e) => {
          const v = parseInt(e.target.value, 10);
          if (!isNaN(v) && v >= 30 && v <= 220) {
            setHeartRate(v);
          }
        }}
        style={{
          width: isMobile ? 60 : 80, // 📱
          textAlign: "center",
        }}
      />

      <button onClick={() => setHeartRate((h) => Math.min(300, h + 10))}>+</button>
    </div>
  );
}