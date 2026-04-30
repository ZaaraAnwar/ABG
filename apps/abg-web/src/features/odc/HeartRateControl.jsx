export default function HeartRateControl({ heartRate, setHeartRate, heartDuration }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
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

      <button onClick={() => setHeartRate((h) => Math.max(30, h - 1))}>
        −
      </button>

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
          width: 80,
          textAlign: "center",
        }}
      />

      <button onClick={() => setHeartRate((h) => Math.min(300, h + 1))}>
        +
      </button>

    
    </div>
  );
}