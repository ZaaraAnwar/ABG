// import { useMemo, useState } from 'react'
// import './App.css'

// type Product = {
//   id: number
//   name: string
//   description: string
//   price: number
//   image: string
// }

// type CartItem = {
//   product: Product
//   quantity: number
// }

// const products: Product[] = [
//   {
//     id: 1,
//     name: 'Wireless Headphones',
//     description: 'Noise-cancelling over-ear headphones with long battery life.',
//     price: 149.99,
//     image: 'https://via.placeholder.com/300x220?text=Headphones',
//   },
//   {
//     id: 2,
//     name: 'Comfort Keyboard',
//     description: 'Ergonomic mechanical keyboard with RGB lighting.',
//     price: 89.99,
//     image: 'https://via.placeholder.com/300x220?text=Keyboard',
//   },
//   {
//     id: 3,
//     name: 'Smart Watch',
//     description: 'Track workouts, heart rate, and notifications.',
//     price: 199.99,
//     image: 'https://via.placeholder.com/300x220?text=Smart+Watch',
//   },
// ]

// function App() {
//   const [cart, setCart] = useState<CartItem[]>([])

//   const addToCart = (product: Product) => {
//     setCart((prevCart) => {
//       const existing = prevCart.find((item) => item.product.id === product.id)
//       if (existing) {
//         return prevCart.map((item) =>
//           item.product.id === product.id
//             ? { ...item, quantity: item.quantity + 1 }
//             : item
//         )
//       }
//       return [...prevCart, { product, quantity: 1 }]
//     })
//   }

//   const removeFromCart = (productId: number) => {
//     setCart((prevCart) =>
//       prevCart
//         .map((item) =>
//           item.product.id === productId
//             ? { ...item, quantity: item.quantity - 1 }
//             : item
//         )
//         .filter((item) => item.quantity > 0)
//     )
//   }

//   const clearCart = () => setCart([])

//   const total = useMemo(
//     () => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
//     [cart]
//   )

//   return (
//     <div className="app-container">
//       <header className="hero-banner">
//         <h1>One-Page E-commerce</h1>
//         <p>Shop our featured products and checkout with one click.</p>
//       </header>

//       <main className="content">
//         <section className="catalog">
//           <h2>Products</h2>
//           <div className="product-grid">
//             {products.map((product) => (
//               <article key={product.id} className="product-card">
//                 <img src={product.image} alt={product.name} />
//                 <h3>{product.name}</h3>
//                 <p>{product.description}</p>
//                 <strong>${product.price.toFixed(2)}</strong>
//                 <button onClick={() => addToCart(product)}>Add to cart</button>
//               </article>
//             ))}
//           </div>
//         </section>

//         <aside className="cart-panel">
//           <h2>Shopping Cart</h2>
//           {cart.length === 0 ? (
//             <p>Your cart is empty.</p>
//           ) : (
//             <ul className="cart-list">
//               {cart.map((item) => (
//                 <li key={item.product.id}>
//                   <div>
//                     <strong>{item.product.name}</strong> x {item.quantity}
//                   </div>
//                   <div>
//                     <span>${(item.product.price * item.quantity).toFixed(2)}</span>
//                     <button onClick={() => removeFromCart(item.product.id)}>-</button>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           )}

//           <div className="cart-summary">
//             <p>Total: <strong>${total.toFixed(2)}</strong></p>
//             <button onClick={clearCart} disabled={cart.length === 0}>Clear cart</button>
//             <button onClick={() => alert('Order placed!')} disabled={cart.length === 0}>Checkout</button>
//           </div>
//         </aside>
//       </main>

//       <footer className="page-footer">
//         <small>Built with React + Vite · Demo store</small>
//       </footer>
//     </div>
//   )
// }

// export default App

import { useState, useCallback, useEffect, useRef } from "react";
// import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
// ============================================================================
// CONSTANTS
// ============================================================================
const DISPLAY_W = 460;
const DISPLAY_H = 330;
const PAD_L = 50;
const PAD_R = 20;
const PAD_T = 20;
const PAD_B = 45;
const CW = DISPLAY_W - PAD_L - PAD_R;
const CH = DISPLAY_H - PAD_T - PAD_B;
const P50_NORMAL = 24.7;
const P50_LEFT = 20.83;
const P50_RIGHT = 29.5;
const HILL_N = 2.7;
const RIGHT_SHIFT_LINES = [
  { arrow: "↑", text: "P50 (Decreased Affinity)" },
  { arrow: "↑", text: "Temperature" },
  { arrow: "↑", text: "PCO₂" },
  { arrow: "↑", text: "2-3 DPG" },
  { arrow: "↓", text: "pH" },
];
const LEFT_SHIFT_LINES = [
  { arrow: "↓", text: "P50 (Increased Affinity)" },
  { arrow: "↓", text: "Temperature" },
  { arrow: "↓", text: "PCO₂" },
  { arrow: "↓", text: "2-3 DPG" },
  { arrow: "↑", text: "pH" },
  { arrow: "↑", text: "HbF (fetal Hb)" },
  { arrow: "↑", text: "MetHb / CO-Hb" },
];
// ============================================================================
// MATH & UTILS
// ============================================================================
const hillSat = (po2, p50 = P50_NORMAL) =>
  po2 <= 0
    ? 0
    : (Math.pow(po2, HILL_N) /
        (Math.pow(p50, HILL_N) + Math.pow(po2, HILL_N))) *
      100;

const getP50 = (shiftDir) =>
  shiftDir === "left"
    ? P50_LEFT
    : shiftDir === "right"
      ? P50_RIGHT
      : P50_NORMAL;

// Clinically-accurate lookup table for the normal (unshifted) ODC curve
const NORMAL_SAT_TABLE = [
  [0, -1],
  [2, -1],
  [3, 0],
  [4, 0],
  [5, 1],
  [6, 3],
  [7, 5],
  [8, 7],
  [9, 9],
  [10, 10],
  [20, 36.1041],
  [21, 39.0],
  [22, 41.0677],
  [23, 44.1442],
  [24, 46.1799],
  [25, 48.2156],
  [26, 50.1026],
  [27, 53.0],
  [28, 55.0],
  [29, 57.0],
  [30, 59.0],
  [31, 61.0],
  [32, 63.0],
  [33, 64.0],
  [34, 66.0],
  [35, 68.0],
  [36, 70.0],
  [37, 71.0],
  [38, 73.0],
  [39, 74.0],
  [40, 76.0],
  [41, 77.0],
  [42, 78.0],
  [43, 79.0],
  [44, 80.0],
  [45, 81.0],
  [46, 82.0],
  [47, 83.0],
  [48, 84.0],
  [49, 85.0],
  [50, 86.0],
  [51, 87.0],
  [52, 87.0],
  [53, 88.0],
  [54, 89.0],
  [55, 89.0],
  [56, 90.0],
  [57, 90.0],
  [58, 91.0],
  [59, 91.0],
  [60, 91.0],
  [61, 92.0],
  [62, 92.0],
  [63, 93.0],
  [64, 93.0],
  [65, 93.0],
  [66, 93.0],
  [67, 94.0],
  [68, 94.0],
  [69, 94.0],
  [70, 94.0],
  [71, 95.0],
  [72, 95.0],
  [73, 95.0],
  [74, 95.0],
  [75, 95.0],
  [76, 95.0],
  [77, 96.0],
  [78, 96.0],
  [79, 96.0],
  [80, 96.0],
  [81, 96.0],
  [82, 96.0],
  [83, 96.0],
  [84, 96.0],
  [85, 96.0],
  [86, 97.0],
  [87, 97.0],
  [88, 97.0],
  [89, 97.0],
  [90, 97.0],
  [91, 97.0],
  [92, 97.0],
  [93, 97.0],
  [94, 97.0],
  [95, 97.0],
  [96, 97.0],
  [97, 97.0],
  [98, 97.0],
  [99, 97.0],
  [100, 97.0],
  [150, 98.8],
  [500, 100],
];

function lookupSatNormal(po2) {
  if (po2 <= 0) return -1;
  const table = NORMAL_SAT_TABLE;
  if (po2 >= table[table.length - 1][0]) return table[table.length - 1][1];
  for (let i = 0; i < table.length - 1; i++) {
    const [x0, y0] = table[i];
    const [x1, y1] = table[i + 1];
    if (po2 >= x0 && po2 <= x1) {
      const t = (po2 - x0) / (x1 - x0);
      return y0 + t * (y1 - y0);
    }
  }
  return 0;
}

// Use the clinical lookup table for normal shift; Hill equation (offset by -1) for left/right shifts
function getCorrectedSaturation(po2, shiftDir, p50) {
  if (shiftDir === "none") return lookupSatNormal(po2);
  return hillSat(po2, p50) - 1;
}

const po2ToX = (po2) => PAD_L + (po2 / 100) * CW;
const satToY = (sat) => PAD_T + (1 - sat / 100) * CH;
const xToPo2 = (cx) => Math.max(0, Math.min(100, ((cx - PAD_L) / CW) * 100));

function useWindowWidth() {
  const [width, setWidth] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 800,
  );
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return width;
}
// ============================================================================
// COMPONENTS
// ============================================================================
function CalculationTabs({ activeTab, setActiveTab }) {
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
function HeartRateControl({ heartRate, setHeartRate }) {
  const isMobile = useWindowWidth() < 640;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: isMobile ? "space-between" : "flex-end",
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
      <button onClick={() => setHeartRate((h) => Math.max(30, h - 10))}>
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
          width: isMobile ? 60 : 80,
          textAlign: "center",
        }}
      />
      <button onClick={() => setHeartRate((h) => Math.min(300, h + 10))}>
        +
      </button>
    </div>
  );
}
function ProbeTooltip({ probePos }) {
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
const gridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
};
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
function ResultsPanel({
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
  const isMobile = useWindowWidth() < 640;
  const cellFontSize = isMobile ? 20 : 32;
  const cellPadding = isMobile ? "8px 2px" : "12px 4px";
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
            <div style={cellHeader(isMobile)}>PO₂ (mmHg)</div>
            <div style={{ ...cellHeader(isMobile), color: "#cc0000" }}>Enter Hb(g/dl)</div>
          </div>
          <div style={gridStyle}>
            <div style={redCell(cellFontSize, cellPadding)}>
              {activeSat.toFixed(0)}%
            </div>
            <div style={purpleCell(cellFontSize, cellPadding)}>
              <button style={inlineBtnStyle} onClick={() => stepPO2(-1)}>
                −
              </button>
              <span style={{ margin: isMobile ? "0 6px" : "0 12px" }}>
                {Math.round(activePO2)}
              </span>
              <button style={inlineBtnStyle} onClick={() => stepPO2(1)}>
                +
              </button>
            </div>
            <div style={redCell(cellFontSize, cellPadding)}>
              <button
                style={inlineBtnStyle}
                onClick={() => setHb((h) => Math.max(1, h - 1))}
              >
                −
              </button>
              <span style={{ margin: isMobile ? "0 6px" : "0 12px" }}>
                {hb}
              </span>
              <button
                style={inlineBtnStyle}
                onClick={() => setHb((h) => Math.min(25, h + 1))}
              >
                +
              </button>
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
            <div style={{ ...cellHeader(isMobile), color: "#cc0000" }}>Enter Hb(g/dl)</div>
          </div>
          <div style={gridStyle}>
            <div style={redCell(cellFontSize, cellPadding)}>
              {activeSat.toFixed(0)}%
            </div>
            <div style={purpleCell(cellFontSize, cellPadding)}>
              <button
                style={inlineBtnStyle}
                onClick={() => setStrokeVolume((v) => Math.max(10, v - 1))}
              >
                −
              </button>
              <span style={{ margin: isMobile ? "0 6px" : "0 12px" }}>
                {strokeVolume}
              </span>
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
function ShiftInfoBox({ shiftDir }) {
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
function OdcCanvas({
  activePO2,
  p50,
  shiftDir,
  heartRate,
  toggleShift,
  setInteractivePO2,
}) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < 640;
  const scale = isMobile ? Math.min(1, (windowWidth - 16) / DISPLAY_W) : 1;
  const [isDragging, setIsDragging] = useState(false);
  const [probePos, setProbePos] = useState(null);
  const [hoverPO2, setHoverPO2] = useState(null);
  const draw = useCallback(
    (hoverVal = null) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = DISPLAY_W * dpr;
      canvas.height = DISPLAY_H * dpr;
      canvas.style.width = DISPLAY_W + "px";
      canvas.style.height = DISPLAY_H + "px";
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, DISPLAY_W, DISPLAY_H);
      const bg = ctx.createLinearGradient(PAD_L, PAD_T, PAD_L + CW, PAD_T + CH);
      bg.addColorStop(0, "#b8a0d8");
      bg.addColorStop(0.3, "#d4a0c0");
      bg.addColorStop(0.6, "#e8a8a0");
      bg.addColorStop(1, "#f0a8a0");
      ctx.fillStyle = bg;
      ctx.fillRect(PAD_L, PAD_T, CW, CH);
      ctx.strokeStyle = "rgba(255,255,255,0.28)";
      ctx.lineWidth = 0.5;
      ctx.setLineDash([3, 3]);
      for (let v = 20; v <= 100; v += 20) {
        ctx.beginPath();
        ctx.moveTo(po2ToX(v), PAD_T);
        ctx.lineTo(po2ToX(v), PAD_T + CH);
        ctx.stroke();
      }
      for (let v = 10; v <= 100; v += 10) {
        ctx.beginPath();
        ctx.moveTo(PAD_L, satToY(v));
        ctx.lineTo(PAD_L + CW, satToY(v));
        ctx.stroke();
      }
      ctx.setLineDash([]);
      ctx.strokeStyle = "#444";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(PAD_L, PAD_T);
      ctx.lineTo(PAD_L, PAD_T + CH);
      ctx.lineTo(PAD_L + CW, PAD_T + CH);
      ctx.stroke();
      ctx.fillStyle = "#333";
      ctx.font = "11px sans-serif";
      ctx.textAlign = "right";
      for (let i = 0; i <= 10; i++) {
        ctx.fillText(String(i * 10), PAD_L - 6, satToY(i * 10) + 4);
      }
      ctx.textAlign = "center";
      for (let i = 1; i <= 5; i++) {
        ctx.fillText(String(i * 20), po2ToX(i * 20), PAD_T + CH + 16);
      }
      ctx.font = "10px sans-serif";
      ctx.fillStyle = "#555";
      ctx.textAlign = "center";
      ctx.fillText("Venous Blood", PAD_L + CW * 0.2, PAD_T + CH + 32);
      ctx.fillText("Arterial End", PAD_L + CW * 0.82, PAD_T + CH + 32);
      const drawCurve = (p50Value, color, lineWidth, alpha = 1) => {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        for (let p = 0; p <= 100; p += 0.5) {
          const s = hillSat(p, p50Value);
          if (p === 0) {
            ctx.moveTo(po2ToX(p), satToY(s));
          } else {
            ctx.lineTo(po2ToX(p), satToY(s));
          }
        }
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.lineJoin = "round";
        ctx.stroke();
        ctx.restore();
      };
      drawCurve(P50_NORMAL, "#cc0000", 3);
      if (shiftDir === "left") {
        drawCurve(P50_LEFT, "#2a6ab0", 2.5, 0.85);
      }
      if (shiftDir === "right") {
        drawCurve(P50_RIGHT, "#e05a8a", 2.5, 0.85);
      }
      if (shiftDir !== "none") {
        const labelPO2 = 55;
        const shiftedP50 = shiftDir === "left" ? P50_LEFT : P50_RIGHT;
        ctx.font = "bold 10px sans-serif";
        ctx.fillStyle = shiftDir === "left" ? "#2a6ab0" : "#c03060";
        ctx.textAlign = "left";
        ctx.fillText(
          shiftDir === "left" ? "← Left Shift" : "Right Shift →",
          po2ToX(labelPO2) + 4,
          satToY(hillSat(labelPO2, shiftedP50)) - 8,
        );
      }
      if (hoverVal !== null && !isDragging) {
        const hoverSat = hillSat(hoverVal, p50);
        ctx.setLineDash([3, 5]);
        ctx.strokeStyle = "rgba(200,100,150,0.4)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(po2ToX(hoverVal), PAD_T);
        ctx.lineTo(po2ToX(hoverVal), PAD_T + CH);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.arc(po2ToX(hoverVal), satToY(hoverSat), 4, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(224,90,138,0.4)";
        ctx.fill();
      }
      const activeSat = hillSat(activePO2, p50);
      const dotX = po2ToX(activePO2);
      const dotY = satToY(activeSat);
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = "rgba(70,30,110,0.6)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(dotX, dotY);
      ctx.lineTo(dotX, PAD_T + CH);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(dotX, dotY);
      ctx.lineTo(PAD_L, dotY);
      ctx.stroke();
      ctx.setLineDash([]);
      const glow = ctx.createRadialGradient(dotX, dotY, 4, dotX, dotY, 16);
      glow.addColorStop(
        0,
        isDragging ? "rgba(107,79,160,0.5)" : "rgba(107,79,160,0.28)",
      );
      glow.addColorStop(1, "rgba(107,79,160,0)");
      ctx.beginPath();
      ctx.arc(dotX, dotY, 16, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(dotX, dotY, isDragging ? 8 : 7, 0, Math.PI * 2);
      ctx.fillStyle = "#4a2080";
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();
      if (shiftDir === "none") {
        ctx.fillStyle = "#333";
        ctx.font = "10.5px sans-serif";
        ctx.textAlign = "left";
        const tx = PAD_L + CW * 0.42;
        const ty = PAD_T + CH * 0.38;
        ctx.fillText("Normal Arterio -", tx, ty);
        ctx.fillText("Venous difference at", tx, ty + 14);
        ctx.fillText(`${heartRate} times a minute`, tx, ty + 28);
        ctx.fillText("(heart rate)", tx, ty + 42);
      }
    },
    [activePO2, p50, shiftDir, isDragging, heartRate],
  );
  useEffect(() => {
    draw(hoverPO2);
  }, [draw, hoverPO2]);
  const readPointer = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const wrapperRect = wrapRef.current.getBoundingClientRect();
    const scaleX = DISPLAY_W / rect.width;
    const po2 = xToPo2((e.clientX - rect.left) * scaleX);
    return {
      po2,
      px: e.clientX - wrapperRect.left,
      py: e.clientY - wrapperRect.top,
    };
  };
  const onPointerDown = (e) => {
    const { po2 } = readPointer(e);
    setIsDragging(true);
    setInteractivePO2(po2);
    canvasRef.current?.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    const { po2, px, py } = readPointer(e);
    const sat = getCorrectedSaturation(po2, shiftDir, p50);
    if (isDragging) {
      setInteractivePO2(po2);
      setProbePos({ x: px, y: py, po2, sat });
      setHoverPO2(null);
    } else {
      setProbePos({ x: px, y: py, po2, sat });
      setHoverPO2(po2);
    }
  };
  const onPointerUp = () => {
    setIsDragging(false);
  };
  const onPointerLeave = () => {
    if (!isDragging) {
      setProbePos(null);
      setHoverPO2(null);
    }
  };
  const canvasAndControls = (tooltipScale = 1) => (
    <div ref={wrapRef} style={{ position: "relative", lineHeight: 0 }}>
      <canvas
        ref={canvasRef}
        style={{
          borderRadius: 8,
          cursor: "crosshair",
          touchAction: "none",
          display: "block",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerLeave}
      />
      <div
        style={{
          position: "absolute",
          top: 35,
          right: 18,
          width: 50,
          height: 34,
          zIndex: 12,
          pointerEvents: "none",
        }}
      >
        <svg
          width="40"
          height="24"
          viewBox="0 0 82 54"
          style={{
            overflow: "visible",
            animationName: "heartbeat",
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
            animationDuration: `${60 / heartRate}s`,
          }}
        >
          <path
            d="M28 42 C28 42 8 30 8 15 C8 7 14 3 21 3 C25 3 29 6 31 10 C33 6 37 3 42 3 C49 3 55 7 55 15 C55 30 36 42 28 42Z"
            fill="#cc0066"
          />
          <path
            d="M10 25 H25 L30 14 L36 39 L42 21 L47 25 H72"
            fill="none"
            stroke="#5522aa"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <button
        onClick={() => toggleShift("left")}
        title="Left shift"
        style={{
          position: "absolute",
          top: 22,
          left: 56,
          border: "none",
          background: "transparent",
          color: shiftDir === "left" ? "#2a6ab0" : "rgba(60,20,100,0.85)",
          fontSize: 24,
          fontWeight: 900,
          cursor: "pointer",
          padding: 0,
        }}
      >
        ←
      </button>
      <button
        onClick={() => toggleShift("right")}
        title="Right shift"
        style={{
          position: "absolute",
          top: 250,
          right: 24,
          border: "none",
          background: "transparent",
          color: shiftDir === "right" ? "#e05a8a" : "rgba(60,20,100,0.85)",
          fontSize: 24,
          fontWeight: 900,
          cursor: "pointer",
          zIndex: 10,
          padding: 0,
        }}
      >
        →
      </button>
      {probePos && <ProbeTooltip probePos={probePos} />}
    </div>
  );
  const po2Label = (
    <div
      style={{ textAlign: "center", marginTop: 4, fontSize: 13, color: "#555" }}
    >
      PO<sub>2</sub> (mmHg)
    </div>
  );
  if (!isMobile) {
    return (
      <div style={{ flexShrink: 0 }}>
        {canvasAndControls(1)}
        {po2Label}
      </div>
    );
  }
  return (
    <div
      style={{
        width: DISPLAY_W * scale,
        height: (DISPLAY_H + 30) * scale,
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          transformOrigin: "top left",
          transform: `scale(${scale})`,
          width: DISPLAY_W,
        }}
      >
        {canvasAndControls(scale)}
        {po2Label}
      </div>
    </div>
  );
}
// ============================================================================
// MAIN APP COMPONENT
// ============================================================================
export default function App() {
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < 640;
  const [showInfo, setShowInfo] = useState(false);
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
  const activeSat = getCorrectedSaturation(activePO2, shiftDir, p50);
  const displaySat = Math.round(activeSat);

  // CaO₂ (ml O₂ per 100 ml blood)
  // = (1.35 × Hb × SaO₂%) + (0.0031 × PO₂)
  // 1.35 = Hüfner's constant used in reference app
  const contentO2Raw = (1.35 * hb * displaySat) / 100 + 0.0031 * activePO2;
  const contentO2 = contentO2Raw.toFixed(2);
  // Cardiac Output (L/min) = HR × SV (ml) / 1000
  const cardiacOutput = (heartRate * strokeVolume) / 1000;
  // DO₂ (ml O₂/min) = CaO2 * (HR * SV) / 100
  const do2 = ((Number(contentO2) * heartRate * strokeVolume) / 100).toFixed(2);
  const toggleShift = useCallback((dir: "left" | "right") => {
    setShiftDir((prev) => (prev === dir ? "none" : dir));
    setInteractivePO2(20);
  }, []);
  const stepPO2 = useCallback(
    (delta: number) => {
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
        width: "100%",
        maxWidth: "100%",
        margin: 0,
        boxSizing: "border-box",
        overflowX: isMobile ? "hidden" : undefined,
        position: "relative",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "#6d3596",
          color: "#fff",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
          marginBottom: "20px"
        }}
      >
        <h1 style={{ margin: 0, fontSize: isMobile ? 18 : 24, fontWeight: 700 }}>
          Oxygen Dissociation Curve
        </h1>
        <div
          onClick={() => setShowInfo(true)}
          style={{
            position: "absolute",
            right: 20,
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: "2px solid #fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: 18,
            fontWeight: "bold",
            background: "rgba(255,255,255,0.1)"
          }}
        >
          i
        </div>
      </div>

      {showInfo && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20
          }}
          onClick={() => setShowInfo(false)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 24,
              maxWidth: 600,
              maxHeight: "80vh",
              overflowY: "auto",
              position: "relative",
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowInfo(false)}
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                background: "none",
                border: "none",
                fontSize: 24,
                cursor: "pointer",
                color: "#666"
              }}
            >
              &times;
            </button>
            <h2 style={{ color: "#6d3596", marginTop: 0 }}>About</h2>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: "#333" }}>
              ODC represents partial pressure of oxygen on horizontal axis and saturation of hemoglobin on vertical axis. The normal sigmoid curve can be shifted to right or left on the app, which indicates the decreased and increased affinity of hemoglobin to oxygen respectively.
            </p>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: "#333" }}>
              As the curve shifts the app displays the causes for the shift. App shows the fall in saturation of hemoglobin as the blood moves from the arterial to venous end and the oscillating cursor indicates the heart rate which can be changed.
            </p>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: "#333" }}>
              Application also displays the arterial and venous saturation. P50 value denotes the partial pressure of oxygen at which hemoglobin is 50% saturated (marked in the application). Partial pressure of 60 roughly corresponds with Hb saturation of 90 and marks an important point (ICU Point) on ODC, as from here for a small drop in pressure, the drop in saturation is rapid. At partial pressure of around 500 hemoglobin is 100% saturation.
            </p>
            <h3 style={{ color: "#6d3596", fontSize: 16 }}>Some important points to remember:</h3>
            <ul style={{ fontSize: 14, lineHeight: 1.6, color: "#333" }}>
              <li>PaO₂ 0 mm Hg. SaO₂ 0%</li>
              <li>PaO₂ 10 mm Hg. SaO₂ 10%</li>
              <li>PaO₂ approx. 25 mm Hg. SaO₂ 50% (P50 value)</li>
              <li>PaO₂ 60 mm Hg. SaO₂ 90% (the ICU point)</li>
              <li>PaO₂ 150 mm Hg. SaO₂ 98.8% shows flat upper part of ODC</li>
              <li>PaO₂ 500 mm Hg. SaO₂ 100%</li>
            </ul>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: "#333" }}>
              Oxygen delivery (DO₂) can also be calculated in this app.
              <br/><br/>
              This app DO₂ largely depends on three parameters:
              <br/>1. Hemoglobin concentration
              <br/>2. Saturation (SaO₂)
              <br/>3. Cardiac Output (heart rate × stroke volume)
            </p>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: "#333" }}>
              In this app ENTER stroke volume in ml. and with values of saturation, PaO₂ and Hb% already entered in the app, this app will calculate the DO₂ (ml/min).
              <br/><br/>
              The delivery of oxygen to the tissues per minute can be calculated as follows:
              <br/><br/>
              <strong>Step 1:</strong> Calculate amount of oxygen/100 ml of blood (CaO₂).
              <br/>[(1.39 × Hb × SaO₂) / 100 + (0.003 × PaO₂)]
              <br/><br/>
              <strong>Step 2:</strong> Calculate the cardiac output per minute = Heart rate × Stroke volume.
              <br/><br/>
              <strong>Step 3:</strong> Calculate the DO₂.
            </p>
            <div style={{ background: "#f5f0fa", padding: 12, borderRadius: 8, fontSize: 14, color: "#333" }}>
              <strong>For example: Consider</strong>
              <br/>Hb% = 15%
              <br/>SaO₂ = 100%
              <br/>Cardiac output = 5 L/min (5000 ml/min)
              <br/><br/>
              Step 1: Amount of oxygen/100 ml of blood = 20.88
              <br/>Step 2: Cardiac output/min = 5 L/min
              <br/>Step 3: DO₂ = 20.88 × 5000 / 100 = 1044 ml of O₂/min
              <br/><br/>
              Delivery of oxygen = 1044 ml of O₂/min (as per this example)
            </div>
            <h3 style={{ color: "#6d3596", fontSize: 16 }}>Normal Cardiac output per minute</h3>
            <ul style={{ fontSize: 14, lineHeight: 1.6, color: "#333" }}>
              <li>Birth: 400 ml/Kg/min</li>
              <li>Infancy onwards: 200 ml/Kg/min</li>
              <li>Adolescents: 100 ml/Kg/min</li>
            </ul>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: "#333" }}>
              Stroke output = min output / Heart rate
            </p>
            <hr style={{ border: 0, borderTop: "1px solid #eee", margin: "20px 0" }} />
            <h3 style={{ color: "#6d3596", fontSize: 16 }}>Team Behind the App:</h3>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: "#333" }}>
              The ODC app was developed by a team of medical professionals, including Dr. Satish Deopujari, a Professor Emeritus at Govt. Medical College Nagpur IGGMC, Adjunct Professor in Mechanical Engineering at VNIT Nagpur, Chairman Academics at Nelson Hospital Nagpur, Founder Chairman of the National Pediatric Intensive chapter, and President of the Society of Pediatric Critical Care in Chandigarh.
              <br/><br/>
              Dr. Lawrence Martin, Dr. Vivek Shivhare, and Dr. Shruti Deopujari were also part of the development team. Their collective experience in the medical field has contributed to the development of medical education and research in India.
            </p>
          </div>
        </div>
      )}

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: isMobile ? "0 8px" : "0 20px 20px 20px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: isMobile ? 16 : 24,
            alignItems: isMobile ? "center" : "flex-start",
            justifyContent: "center",
            flexDirection: isMobile ? "column" : "row",
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



