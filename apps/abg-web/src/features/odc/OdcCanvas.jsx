import { useRef, useState, useEffect, useCallback } from "react";
import {
  DISPLAY_W,
  DISPLAY_H,
  PAD_L,
  PAD_T,
  CW,
  CH,
  P50_NORMAL,
  P50_LEFT,
  P50_RIGHT,
} from "./constants";
import { hillSat, lookupSatNormal, po2ToX, satToY, xToPo2 } from "./odcMath";

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

export default function OdcCanvas({
  activePO2,
  activeSat,
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
    (hoverVal = null, currentActiveSat = activeSat) => {
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

      const drawCurve = (p50Value, color, lineWidth, alpha = 1, useTable = false) => {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.beginPath();

        for (let p = 0; p <= 100; p += 0.5) {
          // For the normal (unshifted) curve, use the clinical lookup table so the
          // curve shape matches the saturation values shown in the results panel.
          const s = useTable ? lookupSatNormal(p) : hillSat(p, p50Value);
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

      // Normal curve: draw with clinical lookup table values
      drawCurve(P50_NORMAL, "#cc0000", 3, 1, true);

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

      // Use the saturation value passed from the parent (clinical lookup table for
      // normal curve, Hill equation for shifted curves) — keeps dot and panel in sync.
      const dotX = po2ToX(activePO2);
      const dotY = satToY(currentActiveSat);

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
    [activePO2, activeSat, p50, shiftDir, isDragging, heartRate],
  );

  useEffect(() => {
    draw(hoverPO2, activeSat);
  }, [draw, hoverPO2, activeSat]);

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
    const sat = hillSat(po2, p50);

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

  // ── Shared inner content ────────────────────────────────────────────────
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

      {probePos && (
        <div
          style={{
            position: "absolute",
            left: (probePos.x + 14) / tooltipScale,
            top: Math.max(4, probePos.y - 34) / tooltipScale,
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
      )}
    </div>
  );

  const po2Label = (
    <div style={{ textAlign: "center", marginTop: 4, fontSize: 13, color: "#555" }}>
      PO<sub>2</sub> (mmHg)
    </div>
  );

  // ── Desktop: original structure, untouched ──────────────────────────────
  if (!isMobile) {
    return (
      <div style={{ flexShrink: 0 }}>
        {canvasAndControls(1)}
        {po2Label}
      </div>
    );
  }

  // ── Mobile: CSS scale wrapper ───────────────────────────────────────────
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